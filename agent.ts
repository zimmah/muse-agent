#!/usr/bin/env node
/**
 * muse-agent — research agent for musesolvescancer.com (protocol v3.5)
 *
 * Commands:
 *   node agent.ts register <wallet> [handle] [specialty]      register once, stores apiKey
 *   node agent.ts status | inspect [pageFile] | graph          platform introspection
 *   node agent.ts leaderboard                                  find your wallet on the leaderboard
 *   node agent.ts extract <pageFile> [recordIndex] [--dry]     one manual extraction
 *   node agent.ts run                                          daemon (see round work below)
 *
 * Per research round the daemon does:
 *   1. evidence-extraction (focus-biased paper selection)
 *   2. source-screening (second paper)
 *   3. peer-review of another wallet's submission (reviewTargetId)
 *   4. up to VERIFY_BATCH verifications, choosing per claim the strongest honest method:
 *      statistical-reproduction (recomputable numbers, executed in code) > methods-audit
 *      (trial-design checklist) > source-check
 *
 * State lives in ./muse-agent.json (chmod 600, never commit). Artifacts are pushed to RAW_BASE.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  chmodSync,
  existsSync,
  appendFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const BASE = "https://musesolvescancer.com";
const OLLAMA = "http://localhost:11434/api/chat";
const MODEL = "qwen3:8b";
const STATE_PATH = "./muse-agent.json";
const ARTIFACT_DIR = "./artifacts";
const LOG_PATH = "./agent.log";
const RAW_BASE = "https://raw.githubusercontent.com/zimmah/msc-muse/main";
const PAPER_PAGES = 40;
const PAGE_SIZE = 250;
const MIN_MARGIN_MS = 4 * 60_000;
const POLL_MS = 45_000;
const VERIFY_BATCH = 3;
const FOCUS_RE =
  /(residual|neoadjuvant|adjuvant|KATHERINE|DESTINY-Breast0?5|trastuzumab emtansine|T-DM1|pathologic(al)? complete response)/i;

type State = {
  wallet: string;
  handle: string;
  apiKey?: string;
  doneRounds?: number[];
  usedPmids?: string[];
  skippedPmids?: string[];
  verifiedClaims?: string[];
  reviewedSubmissions?: string[];
  lastExtraction?: {
    pmid: string;
    title: string;
    submissionId: string;
    claimIds: string[];
  };
};

// ---------- basics ----------

function log(msg: string) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  try {
    appendFileSync(LOG_PATH, line + "\n");
  } catch {}
}
function fail(msg: string): never {
  throw new Error(msg);
}
function sha256(t: string) {
  return createHash("sha256").update(t, "utf8").digest("hex");
}
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function trimDot(s: unknown) {
  return String(s ?? "not stated").replace(/\.\s*$/, "");
}
function numbersOf(t: string) {
  return t.match(/\d+(?:\.\d+)?/g) ?? [];
}

function loadState(optional = false): State {
  const missing =
    !existsSync(STATE_PATH) || readFileSync(STATE_PATH, "utf8").trim() === "";
  if (missing) {
    if (optional) return { wallet: "DRY_RUN_WALLET", handle: "dry-run" };
    fail(`No usable ${STATE_PATH}. Run: node agent.ts register <wallet>`);
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf8"));
}
function saveState(s: State) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
  chmodSync(STATE_PATH, 0o600);
}

async function api(path: string, init: RequestInit = {}, apiKey?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers as any) },
  });
  const text = await res.text();
  let body: any;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!res.ok)
    fail(
      `${init.method ?? "GET"} ${path} → ${res.status}\n${JSON.stringify(body, null, 2)}`,
    );
  return body;
}

function pick(obj: any, names: string[]): any {
  for (const n of names) {
    const v = n
      .split(".")
      .reduce((o, k) => (o == null ? undefined : o[k]), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

async function fetchPubmedAbstract(pmid: string): Promise<string> {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`;
  const res = await fetch(url);
  if (!res.ok) fail(`PubMed efetch ${pmid} → ${res.status}`);
  const text = (await res.text()).trim();
  if (text.length < 200)
    fail(`PubMed returned too little text for PMID ${pmid}`);
  return text;
}

async function ollamaJSON(prompt: string, schema: object): Promise<any> {
  const res = await fetch(OLLAMA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      think: false,
      stream: false,
      format: schema,
      options: { num_ctx: 16384, temperature: 0 },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) fail(`Ollama error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return JSON.parse(data.message.content);
}

function gitPushArtifacts(msg: string) {
  try {
    execSync(`git add ${ARTIFACT_DIR}`, { stdio: "pipe" });
    execSync(`git commit -m ${JSON.stringify(msg)}`, { stdio: "pipe" });
    execSync("git push", { stdio: "pipe", timeout: 60_000 });
    return true;
  } catch (e: any) {
    const out = String(e.stdout ?? "") + String(e.stderr ?? "");
    if (/nothing to commit/i.test(out)) return true;
    log(`git push failed: ${out.slice(0, 300)}`);
    return false;
  }
}

function saveArtifact(name: string, content: string): string | null {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  writeFileSync(`${ARTIFACT_DIR}/${name}`, content);
  if (!gitPushArtifacts(`artifact: ${name}`)) return null;
  return `${RAW_BASE}/artifacts/${name}`;
}

// ---------- round / records ----------

async function getRound() {
  const s = await api("/api/research-status");
  const round = pick(s, ["round"]) ?? s;
  return {
    id: Number(pick(round, ["id", "roundId"])),
    phase: String(pick(round, ["phase", "status"]) ?? ""),
    endsAt: Number(pick(round, ["researchEndsAt", "endsAt"])),
  };
}

/** Prefer papers matching the current research focus; fall back to random. */
async function pickUnusedRecord(state: State): Promise<any> {
  const used = new Set([
    ...(state.usedPmids ?? []),
    ...(state.skippedPmids ?? []),
  ]);
  let fallback: any = null;
  for (let attempt = 0; attempt < 14; attempt++) {
    const pageNum = String(
      1 + Math.floor(Math.random() * PAPER_PAGES),
    ).padStart(3, "0");
    let page: any;
    try {
      page = await api(`/data/research/papers/${pageNum}.json`);
    } catch {
      continue;
    }
    const records: any[] = page.records ?? [];
    const fresh = records.filter((r) => r?.pmid && !used.has(String(r.pmid)));
    const focused = fresh.filter((r) => FOCUS_RE.test(String(r.title ?? "")));
    if (focused.length)
      return focused[Math.floor(Math.random() * focused.length)];
    if (!fallback && fresh.length)
      fallback = fresh[Math.floor(Math.random() * fresh.length)];
  }
  if (fallback) return fallback;
  fail("Could not find an unused record.");
}

// ---------- work: extraction ----------

async function submitExtraction(
  rec: any,
  state: State,
  dry: boolean,
): Promise<boolean> {
  const pmid = String(rec.pmid);
  const canonicalUrl =
    rec.sourceUrl ?? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  log(`[extract] PMID ${pmid} — ${rec.title}`);

  const abstractText = await fetchPubmedAbstract(pmid);
  const contentHash = sha256(abstractText);
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  writeFileSync(`${ARTIFACT_DIR}/pmid-${pmid}.txt`, abstractText);

  const extraction = await ollamaJSON(
    `You are extracting structured facts from a breast-cancer research abstract. ` +
      `Only state what the text explicitly supports; use null when absent.\n\n${abstractText}`,
    {
      type: "object",
      properties: {
        study_design: { type: ["string", "null"] },
        sample_size: { type: ["integer", "null"] },
        population: { type: ["string", "null"] },
        intervention: { type: ["string", "null"] },
        comparator: { type: ["string", "null"] },
        primary_outcome: { type: ["string", "null"] },
        key_result: { type: ["string", "null"] },
        claims: { type: "array", items: { type: "string" }, maxItems: 5 },
        limitations: { type: ["string", "null"] },
      },
      required: ["claims"],
    },
  );

  const claims = (extraction.claims ?? [])
    .map((c: string) => c.trim())
    .filter((c: string) => c.length >= 20 && c.length <= 2000)
    .filter((c: string) => numbersOf(c).every((n) => abstractText.includes(n)));
  if (claims.length === 0) {
    log(`[extract] PMID ${pmid}: no grounded claims — skipping paper.`);
    state.skippedPmids = [...(state.skippedPmids ?? []), pmid];
    if (!dry) saveState(state);
    return false;
  }

  let abstract =
    `Structured extraction of ${canonicalUrl} (doi:${rec.doi ?? "n/a"}). ` +
    `Design: ${trimDot(extraction.study_design)}; n=${extraction.sample_size ?? "not stated"}; ` +
    `population: ${trimDot(extraction.population)}; intervention: ${trimDot(extraction.intervention)}; ` +
    `comparator: ${trimDot(extraction.comparator)}; primary outcome: ${trimDot(extraction.primary_outcome)}. ` +
    `Key result: ${trimDot(extraction.key_result)}. Limitations: ${trimDot(extraction.limitations)}. ` +
    `Method: local LLM extraction (${MODEL}, temp 0), deterministic post-validation; numeric claims verified against source text. ` +
    `Source sha256:${contentHash.slice(0, 16)}…`;
  if (abstract.length > 1500) abstract = abstract.slice(0, 1497) + "…";

  const submission = {
    wallet: state.wallet,
    title: `Structured extraction: ${rec.title}`.slice(0, 120),
    evidenceUrl: canonicalUrl,
    abstract,
    workType: "evidence-extraction",
    timestamp: 0,
  };
  const evidence = {
    wallet: state.wallet,
    timestamp: 0,
    source: {
      type: "pubmed",
      externalId: pmid,
      canonicalUrl,
      title: String(rec.title).slice(0, 300),
      contentHash,
      metadata: { doi: rec.doi ?? null, journal: rec.journal ?? null },
    },
    claims: claims.map((text: string) => ({
      type: "descriptive",
      text,
      structured: {},
      relations: [],
    })),
  };

  if (dry) {
    console.log(JSON.stringify({ submission, evidence }, null, 2));
    return true;
  }

  submission.timestamp = Date.now();
  const subRes = await api(
    "/api/submissions",
    { method: "POST", body: JSON.stringify(submission) },
    state.apiKey,
  );
  log(`[extract] ✓ submission → ${JSON.stringify(subRes).slice(0, 180)}`);
  evidence.timestamp = Date.now();
  const evRes = await api(
    "/api/science/evidence",
    { method: "POST", body: JSON.stringify(evidence) },
    state.apiKey,
  );
  log(`[extract] ✓ evidence → ${JSON.stringify(evRes).slice(0, 180)}`);

  state.usedPmids = [...(state.usedPmids ?? []), pmid];
  saveState(state);
  state.lastExtraction = {
    pmid,
    title: String(rec.title),
    submissionId: String(pick(subRes, ["submission.id", "id"]) ?? ""),
    claimIds: (evRes?.claims ?? [])
      .map((c: any) => String(c.id))
      .filter(Boolean),
  };
  return true;
}

// ---------- work: screening ----------

async function submitScreening(rec: any, state: State) {
  const pmid = String(rec.pmid);
  const canonicalUrl =
    rec.sourceUrl ?? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  log(`[screen] PMID ${pmid} — ${rec.title}`);
  const abstractText = await fetchPubmedAbstract(pmid);
  const s = await ollamaJSON(
    `Screen this record for a systematic evidence review. Mission: "HER2-positive breast cancer: ` +
      `residual disease, treatment resistance, toxicity, and access to care". Current focus: randomized ` +
      `evidence in high-risk residual HER2+ early breast cancer after neoadjuvant therapy. ` +
      `Judge only from the text. Publication type: ${rec.publicationType}. Evidence level: ${rec.evidenceLevel}.\n\n${abstractText}`,
    {
      type: "object",
      properties: {
        include: { type: "boolean" },
        relevance: {
          type: "string",
          enum: ["direct", "related", "out-of-scope"],
        },
        matches_current_focus: { type: "boolean" },
        topics: { type: "array", items: { type: "string" }, maxItems: 4 },
        reason: { type: "string" },
      },
      required: ["include", "relevance", "matches_current_focus", "reason"],
    },
  );
  let abstract =
    `Eligibility screening of ${canonicalUrl} (doi:${rec.doi ?? "n/a"}) against the HER2+ mission scope. ` +
    `Decision: ${s.include ? "INCLUDE" : "EXCLUDE"} (${s.relevance}; current-focus match: ${s.matches_current_focus}). ` +
    `Topics: ${(s.topics ?? []).join(", ") || "n/a"}. Reason: ${trimDot(s.reason)}. ` +
    `Record metadata: ${rec.publicationType}; ${rec.evidenceLevel}. ` +
    `Method: rules-guided LLM screening (${MODEL}, temp 0) from the PubMed abstract; judgment limited to stated content.`;
  if (abstract.length > 1500) abstract = abstract.slice(0, 1497) + "…";
  const res = await api(
    "/api/submissions",
    {
      method: "POST",
      body: JSON.stringify({
        wallet: state.wallet,
        title: `Eligibility screening: ${rec.title}`.slice(0, 120),
        evidenceUrl: canonicalUrl,
        abstract,
        workType: "source-screening",
        timestamp: Date.now(),
      }),
    },
    state.apiKey,
  );
  log(`[screen] ✓ → ${JSON.stringify(res).slice(0, 180)}`);
  state.usedPmids = [...(state.usedPmids ?? []), pmid];
  saveState(state);
}

// ---------- work: peer review of another wallet's submission ----------

function extractSubmissions(body: any): any[] {
  const arr = Array.isArray(body)
    ? body
    : (body?.submissions ?? body?.items ?? []);
  return (Array.isArray(arr) ? arr : []).filter(
    (s) => /^[0-9a-f]{8}-/.test(String(s?.id ?? "")) && s?.title,
  );
}

async function submitPeerReview(state: State) {
  const body = await api("/api/submissions");
  const subs = extractSubmissions(body);
  if (subs.length === 0) {
    log(
      "[review] no submissions listed — run once manually and send me the /api/submissions shape.",
    );
    return;
  }
  const reviewed = new Set(state.reviewedSubmissions ?? []);
  const target = subs.find(
    (s) =>
      s.wallet !== state.wallet &&
      !reviewed.has(s.id) &&
      String(s.abstract ?? "").length >= 40,
  );
  if (!target) {
    log(
      "[review] no unreviewed foreign submission with visible abstract found.",
    );
    return;
  }
  log(`[review] target ${target.id} — ${String(target.title).slice(0, 80)}`);

  // Deterministic checks against the platform's acceptance criteria
  const txt = String(target.abstract ?? "");
  const checks = {
    cites_stable_source:
      /(pubmed\.ncbi|doi\.org|doi:|clinicaltrials\.gov|NCT\d+)/i.test(
        txt + " " + String(target.evidenceUrl ?? ""),
      ),
    states_method:
      /(method|extraction|screening|audit|reproduc|checklist|LLM|review)/i.test(
        txt,
      ),
    states_limitations:
      /(limitation|caveat|not assessed|abstract-level|uncertain)/i.test(txt),
    has_quantitative_content: numbersOf(txt).length > 0,
  };
  const judgment = await ollamaJSON(
    `You are peer-reviewing a research work submission for an evidence review on HER2+ breast cancer. ` +
      `Assess only what is written. Submission title: "${target.title}". Work type: ${target.workType ?? "unknown"}. ` +
      `Submission text:\n${txt}\n\nAssess: is the described work traceable to its source, is the method explicit, ` +
      `are limitations acknowledged, and is anything overclaimed?`,
    {
      type: "object",
      properties: {
        strengths: { type: "array", items: { type: "string" }, maxItems: 3 },
        weaknesses: { type: "array", items: { type: "string" }, maxItems: 3 },
        overclaims: { type: ["string", "null"] },
        verdict: {
          type: "string",
          enum: ["adequate", "minor-issues", "major-issues"],
        },
      },
      required: ["strengths", "weaknesses", "verdict"],
    },
  );

  const artifactName = `review-${String(target.id).slice(0, 13)}.md`;
  const report = [
    `# Independent review — submission ${target.id}`,
    ``,
    `Title: ${target.title}`,
    `Work type: ${target.workType ?? "unknown"}`,
    `Reviewed: ${new Date().toISOString()}`,
    ``,
    `## Deterministic checks`,
    ...Object.entries(checks).map(([k, v]) => `- ${k}: ${v}`),
    ``,
    `## Model assessment (${MODEL}, temp 0)`,
    `Strengths: ${(judgment.strengths ?? []).join("; ") || "none noted"}`,
    `Weaknesses: ${(judgment.weaknesses ?? []).join("; ") || "none noted"}`,
    `Overclaims: ${judgment.overclaims ?? "none noted"}`,
    `Verdict: ${judgment.verdict}`,
    ``,
    `Limitations of this review: based on the submission text as listed by the API; underlying full texts not re-read.`,
  ].join("\n");
  const artifactUrl = saveArtifact(artifactName, report);
  if (!artifactUrl) {
    log("[review] artifact push failed — skipping.");
    return;
  }

  let abstract =
    `Independent review of submission ${target.id} ("${String(target.title).slice(0, 90)}"). ` +
    `Deterministic checks — stable source cited: ${checks.cites_stable_source}; method stated: ${checks.states_method}; ` +
    `limitations stated: ${checks.states_limitations}; quantitative content: ${checks.has_quantitative_content}. ` +
    `Assessment: ${judgment.verdict}. Strengths: ${(judgment.strengths ?? []).join("; ") || "none noted"}. ` +
    `Weaknesses: ${(judgment.weaknesses ?? []).join("; ") || "none noted"}. ` +
    `Overclaims: ${judgment.overclaims ?? "none noted"}. ` +
    `Method: deterministic criteria checks + LLM assessment (${MODEL}, temp 0) of the submission text; full report at artifact URL. ` +
    `This is automated review, not expert peer review.`;
  if (abstract.length > 1500) abstract = abstract.slice(0, 1497) + "…";

  const res = await api(
    "/api/submissions",
    {
      method: "POST",
      body: JSON.stringify({
        wallet: state.wallet,
        title: `Independent review: ${String(target.title).slice(0, 95)}`.slice(
          0,
          120,
        ),
        evidenceUrl: artifactUrl,
        abstract,
        workType: "peer-review",
        reviewTargetId: target.id,
        timestamp: Date.now(),
      }),
    },
    state.apiKey,
  );
  log(`[review] ✓ → ${JSON.stringify(res).slice(0, 180)}`);
  state.reviewedSubmissions = [...(state.reviewedSubmissions ?? []), target.id];
  saveState(state);
}

// ---------- work: verifications (method chosen per claim) ----------

function extractClaimsFromGraph(graph: any): any[] {
  const out: any[] = [];
  const visit = (node: any) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const id = pick(node, ["claimId", "id"]);
    const text = pick(node, ["text", "claim", "claimText"]);
    const wallet = pick(node, ["wallet", "agentWallet", "submitterWallet"]);
    const url = pick(node, [
      "canonicalUrl",
      "source.canonicalUrl",
      "sourceUrl",
      "source.url",
    ]);
    const pmid = pick(node, [
      "externalId",
      "source.externalId",
      "pmid",
      "source.pmid",
    ]);
    if (id && text && String(id).length >= 32)
      out.push({ id: String(id), text: String(text), wallet, url, pmid });
    Object.values(node).forEach(visit);
  };
  visit(graph);
  return out;
}

function cleanClaimText(text: string): string {
  return String(text)
    .replace(/\b[0-9a-f]{40,64}\b/gi, " ")
    .replace(/SHA-?256[^.]*/gi, " ")
    .replace(/PMID[ :]*\d+/gi, " ");
}

/** Find "P% (a of b)" / "a of b (P%)" / "a/b (P%)" patterns and recompute them. */
function reproducibleComputations(
  text: string,
): { a: number; b: number; pct: number }[] {
  const found: { a: number; b: number; pct: number }[] = [];
  const patterns = [
    /(\d+(?:\.\d+)?)\s*%\s*\(\s*(\d+)\s*(?:of|\/)\s*(\d+)\s*\)/g, // 61% (25 of 41)
    /\(\s*(\d+)\s*(?:of|\/)\s*(\d+)\s*[;,]?\s*(\d+(?:\.\d+)?)\s*%\s*\)/g, // (25 of 41, 61%)
    /(\d+)\s+of\s+(\d+)\s+(?:patients|participants|subjects)?[^.]{0,40}?\(\s*(\d+(?:\.\d+)?)\s*%\s*\)/g, // 25 of 41 patients (61%)
  ];
  for (const [pi, re] of patterns.entries()) {
    for (const m of text.matchAll(re)) {
      const [a, b, pct] =
        pi === 0
          ? [Number(m[2]), Number(m[3]), Number(m[1])]
          : [Number(m[1]), Number(m[2]), Number(m[3])];
      if (b > 0 && a <= b) found.push({ a, b, pct });
    }
  }
  return found;
}

const METHODS_RE =
  /(randomi[sz]ed|phase\s+(1|2|3|I{1,3})|double-blind|open-label|hazard ratio|primary end\s?point|intention-to-treat|placebo|meta-analysis)/i;

async function verifyBatch(state: State, max: number): Promise<number> {
  let graph: any;
  try {
    graph = await api("/api/science/graph");
  } catch (e: any) {
    log(`[verify] graph fetch failed: ${e.message}`);
    return 0;
  }
  const all = extractClaimsFromGraph(graph);
  if (all.length === 0) {
    log("[verify] no claims recognised in graph.");
    return 0;
  }

  const pmidByHash = new Map<string, string>();
  for (const ev of graph.evidence ?? []) {
    if (ev?.externalId) {
      if (ev.hash) pmidByHash.set(String(ev.hash), String(ev.externalId));
      if (ev.contentHash)
        pmidByHash.set(String(ev.contentHash), String(ev.externalId));
    }
  }
  const ours = new Set(state.usedPmids ?? []);
  const verified = new Set(state.verifiedClaims ?? []);
  const candidates = all
    .map((c) => {
      let pmid: string | undefined = c.pmid && String(c.pmid);
      pmid ??= String(c.url ?? "").match(
        /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/,
      )?.[1];
      pmid ??= String(c.text).match(/PMID[ :]*(\d{6,9})/i)?.[1];
      if (!pmid) {
        for (const h of String(c.text).match(/\b[0-9a-f]{64}\b/g) ?? []) {
          const hit = pmidByHash.get(h);
          if (hit) {
            pmid = hit;
            break;
          }
        }
      }
      return { ...c, pmid };
    })
    .filter(
      (c) =>
        !verified.has(c.id) &&
        c.wallet !== state.wallet &&
        c.pmid &&
        !ours.has(String(c.pmid)),
    );

  let done = 0;
  for (const c of candidates) {
    if (done >= max) break;
    try {
      const pmid = String(c.pmid);
      const sourceText = await fetchPubmedAbstract(pmid);
      const cleaned = cleanClaimText(c.text);
      const missingNumbers = numbersOf(cleaned).filter(
        (n) => !sourceText.includes(n),
      );
      const computations = reproducibleComputations(cleaned).filter(
        (x) =>
          sourceText.includes(String(x.a)) && sourceText.includes(String(x.b)),
      );

      let method: string,
        specialization: string,
        toolName: string,
        result: string,
        confidenceBps: number;
      let methodReport: string[];

      if (computations.length > 0) {
        // statistical-reproduction: recompute each percentage in code
        method = "statistical-reproduction";
        specialization = "statistics";
        toolName = "node.js arithmetic reproduction + NCBI efetch";
        const lines: string[] = [];
        let allMatch = true;
        for (const x of computations) {
          const calc = (x.a / x.b) * 100;
          const match = Math.abs(calc - x.pct) <= 0.55; // allow rounding to nearest int/decimal
          if (!match) allMatch = false;
          lines.push(
            `- ${x.a}/${x.b} = ${calc.toFixed(2)}% vs reported ${x.pct}% → ${match ? "MATCH" : "MISMATCH"}`,
          );
        }
        result = allMatch ? "supports" : "refutes";
        confidenceBps = allMatch ? 9000 : 8500;
        if (missingNumbers.length > 0 && result === "supports") {
          result = "inconclusive";
          confidenceBps = 5000;
        }
        methodReport = [
          `1. Fetched abstract via NCBI efetch.`,
          `2. Parsed numerator/denominator/percentage patterns from the claim.`,
          `3. Recomputed each percentage in code (tolerance 0.55 for rounding):`,
          ...lines,
          `4. Deterministic numeric grounding: missing tokens: ${missingNumbers.join(", ") || "none"}.`,
        ];
      } else if (METHODS_RE.test(cleaned)) {
        // methods-audit: design checklist against the source
        method = "methods-audit";
        specialization = "methods";
        toolName = `${MODEL} design checklist + deterministic numeric matcher`;
        const audit = await ollamaJSON(
          `Audit this claim against the source abstract. Answer strictly from the texts.\n` +
            `Claim: "${cleaned}"\n\nSource abstract:\n${sourceText}`,
          {
            type: "object",
            properties: {
              design_in_source: { type: ["string", "null"] },
              design_matches_claim: { type: "boolean" },
              endpoint_matches_claim: { type: ["boolean", "null"] },
              population_matches_claim: { type: ["boolean", "null"] },
              contradiction_found: { type: "boolean" },
              notes: { type: "string" },
            },
            required: ["design_matches_claim", "contradiction_found", "notes"],
          },
        );
        if (audit.contradiction_found) {
          result = "refutes";
          confidenceBps = 7500;
        } else if (audit.design_matches_claim && missingNumbers.length === 0) {
          result = "supports";
          confidenceBps = 7500;
        } else {
          result = "inconclusive";
          confidenceBps = 4500;
        }
        methodReport = [
          `1. Fetched abstract via NCBI efetch.`,
          `2. Checklist audit (${MODEL}, temp 0): design in source: ${audit.design_in_source ?? "not stated"}; ` +
            `design matches claim: ${audit.design_matches_claim}; endpoint matches: ${audit.endpoint_matches_claim ?? "n/a"}; ` +
            `population matches: ${audit.population_matches_claim ?? "n/a"}; contradiction: ${audit.contradiction_found}.`,
          `3. Notes: ${audit.notes}`,
          `4. Deterministic numeric grounding: missing tokens: ${missingNumbers.join(", ") || "none"}.`,
        ];
      } else {
        // source-check fallback
        method = "source-check";
        specialization = "literature";
        toolName = `${MODEL} + deterministic numeric matcher`;
        const judgment = await ollamaJSON(
          `Does the source text support this claim? Answer strictly from the text.\n` +
            `Claim: "${cleaned}"\n\nSource text:\n${sourceText}`,
          {
            type: "object",
            properties: {
              verdict: {
                type: "string",
                enum: ["supports", "refutes", "inconclusive"],
              },
              reasoning: { type: "string" },
            },
            required: ["verdict", "reasoning"],
          },
        );
        result = judgment.verdict;
        confidenceBps = result === "inconclusive" ? 4000 : 7500;
        if (missingNumbers.length > 0 && result === "supports") {
          result = "inconclusive";
          confidenceBps = 4000;
        }
        methodReport = [
          `1. Fetched abstract via NCBI efetch.`,
          `2. Deterministic numeric grounding: missing tokens: ${missingNumbers.join(", ") || "none"}.`,
          `3. Semantic check (${MODEL}, temp 0): ${judgment.verdict} — ${judgment.reasoning}`,
        ];
      }

      const report = [
        `# ${method} — claim ${c.id}`,
        ``,
        `Claim: ${c.text}`,
        `Source: PMID ${pmid} (https://pubmed.ncbi.nlm.nih.gov/${pmid}/)`,
        `Checked: ${new Date().toISOString()}`,
        ``,
        `## Method`,
        ...methodReport,
        ``,
        `## Result`,
        `${result} (confidence ${confidenceBps} bps)`,
        ``,
        `Limitations: abstract-level check only; full text not reviewed.`,
        `Source sha256: ${sha256(sourceText)}`,
      ].join("\n");
      const artifactUrl = saveArtifact(
        `verify-${c.id.slice(0, 16)}.md`,
        report,
      );
      if (!artifactUrl) {
        log(`[verify] artifact push failed — skipping ${c.id.slice(0, 12)}`);
        continue;
      }

      const payload = {
        wallet: state.wallet,
        claimId: c.id,
        specialization,
        method,
        toolName,
        result,
        confidenceBps,
        inputHash: sha256(sourceText),
        outputHash: sha256(report),
        artifactUrl,
        metrics: {
          missingNumericTokens: missingNumbers.length,
          recomputedValues: computations.length,
        },
        timestamp: Date.now(),
      };
      const res = await api(
        "/api/science/verifications",
        { method: "POST", body: JSON.stringify(payload) },
        state.apiKey,
      );
      log(
        `[verify] ✓ ${c.id.slice(0, 12)} ${method} → ${result} — ${JSON.stringify(res).slice(0, 140)}`,
      );
      state.verifiedClaims = [...(state.verifiedClaims ?? []), c.id];
      saveState(state);
      done++;
    } catch (e: any) {
      log(
        `[verify] ${String(c.id).slice(0, 12)} failed: ${e.message?.slice(0, 200)}`,
      );
    }
  }
  return done;
}

// ---------- Threadx: deterministic round announcement (no model in the loop) ----------

async function announceRound(state: State, roundId: number) {
  const ex = state.lastExtraction;
  if (!ex?.submissionId || !ex.claimIds?.length) return;
  const body = [
    `New evidence extraction this round from PMID ${ex.pmid}: "${ex.title}".`,
    ``,
    `Submission UUID (for scored independent review, workType peer-review/quality-audit): ${ex.submissionId}`,
    `Claim IDs open for verification (one verification per claim per wallet):`,
    ...ex.claimIds.map((id) => `- ${id}`),
    ``,
    `Method: local LLM extraction, deterministic numeric grounding against the PubMed abstract; ` +
      `artifacts and pipeline are public at ${RAW_BASE.replace("raw.githubusercontent.com", "github.com").replace("/main", "")}. ` +
      `Abstract-level work; treat as untested until independently verified. Reviews and disagreements welcome.`,
  ]
    .join("\n")
    .slice(0, 4000);
  const res = await api(
    "/api/discussions",
    {
      method: "POST",
      body: JSON.stringify({
        wallet: state.wallet,
        requestId: crypto.randomUUID(),
        title:
          `Round ${roundId}: extraction of PMID ${ex.pmid} — review requested`.slice(
            0,
            180,
          ),
        sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${ex.pmid}/`,
        body,
      }),
    },
    state.apiKey,
  );
  log(`[threadx] ✓ announced → ${JSON.stringify(res).slice(0, 140)}`);
  state.lastExtraction = undefined;
  saveState(state);
}

// ---------- commands ----------

async function register(wallet: string, handle: string, specialty: string) {
  if (!wallet)
    fail(
      "usage: node agent.ts register <PUBLIC_SOLANA_ADDRESS> [handle] [specialty]",
    );
  if (loadState(true).apiKey)
    fail("Already registered (muse-agent.json has an apiKey).");
  const res = await api("/api/agents", {
    method: "POST",
    body: JSON.stringify({
      wallet,
      handle,
      specialty,
      bio: "Deterministic extraction pipeline: fetches PubMed sources, extracts structured claims with a local LLM, validates output in code before submitting.",
    }),
  });
  const apiKey = pick(res, ["apiKey", "agent.apiKey", "token"]);
  if (!apiKey)
    fail(
      `Registered but no apiKey in response:\n${JSON.stringify(res, null, 2)}`,
    );
  saveState({ wallet, handle, apiKey });
  console.log(
    `✓ Registered as "${handle}". apiKey saved to ${STATE_PATH} (mode 600). Shown only once — back it up.`,
  );
}

async function status() {
  const r = await getRound();
  console.log(`round:  ${r.id}\nphase:  ${r.phase}`);
  if (Number.isFinite(r.endsAt)) {
    console.log(
      `ends:   ${new Date(r.endsAt).toISOString()} (${((r.endsAt - Date.now()) / 60000).toFixed(1)} min from now)`,
    );
  }
}

async function leaderboard() {
  const state = loadState(true);
  const body = await api("/api/leaderboard");
  const text = JSON.stringify(body, null, 2);
  const idx = text.indexOf(state.wallet);
  if (idx === -1) {
    console.log(
      `Wallet ${state.wallet} not found on the leaderboard response. First 2500 chars:\n${text.slice(0, 2500)}`,
    );
  } else {
    console.log(
      `Found your wallet. Surrounding entry:\n${text.slice(Math.max(0, idx - 400), idx + 400)}`,
    );
  }
}

async function inspect(pageFile?: string) {
  if (!pageFile) {
    console.log(
      JSON.stringify(await api("/data/research/manifest.json"), null, 2).slice(
        0,
        3000,
      ),
    );
    return;
  }
  const page = await api(`/data/research/${pageFile}`);
  console.log(
    `kind=${page.kind} page=${page.page} total=${page.total} records=${page.records?.length}`,
  );
  console.log(JSON.stringify(page.records?.[0], null, 2));
}

async function graphCmd() {
  const g = await api("/api/science/graph");
  console.log(JSON.stringify(g, null, 2).slice(0, 6000));
  const claims = extractClaimsFromGraph(g);
  console.log(`\n[parsed ${claims.length} claim-like objects]`);
  if (claims[0]) console.log(JSON.stringify(claims[0], null, 2));
}

async function extractCmd(
  pageFile: string,
  indexArg: string | undefined,
  dry: boolean,
) {
  if (!pageFile)
    fail("usage: node agent.ts extract papers/001.json [recordIndex] [--dry]");
  const state = loadState(dry);
  if (!state.apiKey && !dry)
    fail("Not registered. Run register first, or use --dry.");
  const r = await getRound();
  log(`round ${r.id} phase=${r.phase}`);
  if (!dry && !/research/i.test(r.phase))
    fail(`Phase is "${r.phase}" — wait for a research phase (or use run).`);
  const page = await api(`/data/research/${pageFile}`);
  const rec = page.records?.[indexArg ? Number(indexArg) : 0];
  if (!rec?.pmid) fail("No usable record at that index.");
  await submitExtraction(rec, state, dry);
}

async function run() {
  const state = loadState();
  if (!state.apiKey) fail("Not registered. Run register first.");
  log(
    `daemon started — wallet ${state.wallet.slice(0, 8)}…, ${state.usedPmids?.length ?? 0} papers used, ` +
      `${state.verifiedClaims?.length ?? 0} claims verified, ${state.reviewedSubmissions?.length ?? 0} reviews done`,
  );

  while (true) {
    try {
      const r = await getRound();
      const doneRounds = state.doneRounds ?? [];
      const remaining = r.endsAt - Date.now();

      if (
        /research/i.test(r.phase) &&
        !doneRounds.includes(r.id) &&
        remaining > MIN_MARGIN_MS
      ) {
        log(
          `round ${r.id}: research phase, ${(remaining / 60000).toFixed(1)} min left`,
        );

        try {
          let ok = false;
          for (let i = 0; i < 3 && !ok; i++)
            ok = await submitExtraction(
              await pickUnusedRecord(state),
              state,
              false,
            );
        } catch (e: any) {
          log(`extraction failed: ${e.message?.slice(0, 200)}`);
        }

        try {
          await submitScreening(await pickUnusedRecord(state), state);
        } catch (e: any) {
          log(`screening failed: ${e.message?.slice(0, 200)}`);
        }

        try {
          await submitPeerReview(state);
        } catch (e: any) {
          log(`peer review failed: ${e.message?.slice(0, 200)}`);
        }

        try {
          log(
            `verifications this round: ${await verifyBatch(state, VERIFY_BATCH)}`,
          );
        } catch (e: any) {
          log(`verify batch failed: ${e.message?.slice(0, 200)}`);
        }

        try {
          await announceRound(state, r.id);
        } catch (e: any) {
          log(`threadx announce failed: ${e.message?.slice(0, 200)}`);
        }

        state.doneRounds = [...doneRounds, r.id].slice(-500);
        saveState(state);
        log(`round ${r.id}: done. Sleeping until next round.`);
        await sleep(Math.max(r.endsAt - Date.now() + 30_000, POLL_MS));
      } else {
        await sleep(POLL_MS);
      }
    } catch (e: any) {
      log(`ERROR: ${e.message ?? e} — retrying in 60s`);
      await sleep(60_000);
    }
  }
}

// ---------- main ----------

const [, , cmd, ...args] = process.argv;
const dry = args.includes("--dry");
const positional = args.filter((a) => !a.startsWith("--"));

try {
  switch (cmd) {
    case "register":
      await register(
        positional[0],
        positional[1] ?? "grounded-extractor",
        positional[2] ?? "Evidence extraction",
      );
      break;
    case "status":
      await status();
      break;
    case "leaderboard":
      await leaderboard();
      break;
    case "inspect":
      await inspect(positional[0]);
      break;
    case "graph":
      await graphCmd();
      break;
    case "extract":
      await extractCmd(positional[0], positional[1], dry);
      break;
    case "run":
      await run();
      break;
    default:
      console.log(
        "usage: node agent.ts <register|status|leaderboard|inspect|graph|extract|run>",
      );
  }
} catch (e: any) {
  console.error(`✗ ${e.message ?? e}`);
  process.exit(1);
}
