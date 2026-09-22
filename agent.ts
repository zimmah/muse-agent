#!/usr/bin/env node
/**
 * muse-agent — research agent for musesolvescancer.com
 *
 * Commands:
 *   node agent.ts register <wallet> [handle] [specialty]      register once, stores apiKey
 *   node agent.ts status                                       show current round + phase
 *   node agent.ts inspect [pageFile]                           dump manifest / one catalogue page
 *   node agent.ts graph                                        dump /api/science/graph shape (run once, adjust parsing if needed)
 *   node agent.ts extract <pageFile> [recordIndex] [--dry]     one manual extraction
 *   node agent.ts run                                          daemon: per round = 1 extraction + 1 screening + verification batch
 *
 * State (apiKey + progress) lives in ./muse-agent.json — chmod 600, never commit.
 * Verification artifacts are committed + pushed to the public repo (RAW_BASE below).
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
const RAW_BASE = "https://raw.githubusercontent.com/zimmah/msc-muse/main"; // must match your public repo
const PAPER_PAGES = 40;
const PAGE_SIZE = 250;
const MIN_MARGIN_MS = 4 * 60_000;
const POLL_MS = 45_000;
const VERIFY_BATCH = 3;

type State = {
  wallet: string;
  handle: string;
  apiKey?: string;
  doneRounds?: number[];
  usedPmids?: string[];
  skippedPmids?: string[];
  verifiedClaims?: string[];
};

// ---------- helpers ----------

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

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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

function trimDot(s: unknown): string {
  return String(s ?? "not stated").replace(/\.\s*$/, "");
}

function numbersOf(text: string): string[] {
  return text.match(/\d+(?:\.\d+)?/g) ?? [];
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

// ---------- round / records ----------

async function getRound(): Promise<{
  id: number;
  phase: string;
  endsAt: number;
}> {
  const s = await api("/api/research-status");
  const round = pick(s, ["round"]) ?? s;
  return {
    id: Number(pick(round, ["id", "roundId"])),
    phase: String(pick(round, ["phase", "status"]) ?? ""),
    endsAt: Number(pick(round, ["researchEndsAt", "endsAt"])),
  };
}

async function pickUnusedRecord(state: State): Promise<any> {
  const used = new Set([
    ...(state.usedPmids ?? []),
    ...(state.skippedPmids ?? []),
  ]);
  for (let attempt = 0; attempt < 12; attempt++) {
    const pageNum = String(
      1 + Math.floor(Math.random() * PAPER_PAGES),
    ).padStart(3, "0");
    const idx = Math.floor(Math.random() * PAGE_SIZE);
    let page: any;
    try {
      page = await api(`/data/research/papers/${pageNum}.json`);
    } catch {
      continue;
    }
    const rec = page.records?.[idx] ?? page.records?.[0];
    if (rec?.pmid && !used.has(String(rec.pmid))) return rec;
  }
  fail("Could not find an unused record in 12 attempts.");
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

  let submissionAbstract =
    `Structured extraction of ${canonicalUrl} (doi:${rec.doi ?? "n/a"}). ` +
    `Design: ${trimDot(extraction.study_design)}; n=${extraction.sample_size ?? "not stated"}; ` +
    `population: ${trimDot(extraction.population)}; intervention: ${trimDot(extraction.intervention)}; ` +
    `primary outcome: ${trimDot(extraction.primary_outcome)}. ` +
    `Key result: ${trimDot(extraction.key_result)}. ` +
    `Limitations: ${trimDot(extraction.limitations)}. ` +
    `Method: local LLM extraction (${MODEL}, temp 0) with deterministic post-validation; numeric claims verified against source text. ` +
    `Source hash sha256:${contentHash.slice(0, 16)}…`;
  if (submissionAbstract.length > 1500)
    submissionAbstract = submissionAbstract.slice(0, 1497) + "…";

  const submission = {
    wallet: state.wallet,
    title: `Structured extraction: ${rec.title}`.slice(0, 120),
    evidenceUrl: canonicalUrl,
    abstract: submissionAbstract,
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
  log(`[extract] ✓ submission → ${JSON.stringify(subRes).slice(0, 200)}`);
  evidence.timestamp = Date.now();
  const evRes = await api(
    "/api/science/evidence",
    { method: "POST", body: JSON.stringify(evidence) },
    state.apiKey,
  );
  log(`[extract] ✓ evidence → ${JSON.stringify(evRes).slice(0, 200)}`);

  state.usedPmids = [...(state.usedPmids ?? []), pmid];
  saveState(state);
  return true;
}

// ---------- work: source screening ----------

async function submitScreening(rec: any, state: State): Promise<boolean> {
  const pmid = String(rec.pmid);
  const canonicalUrl =
    rec.sourceUrl ?? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  log(`[screen] PMID ${pmid} — ${rec.title}`);

  const abstractText = await fetchPubmedAbstract(pmid);
  const screening = await ollamaJSON(
    `Screen this record for a systematic evidence review with mission: ` +
      `"HER2-positive breast cancer: residual disease, treatment resistance, toxicity, and access to care". ` +
      `Judge only from the text. Publication type: ${rec.publicationType}. Evidence level: ${rec.evidenceLevel}.\n\n${abstractText}`,
    {
      type: "object",
      properties: {
        include: { type: "boolean" },
        relevance: {
          type: "string",
          enum: ["direct", "related", "out-of-scope"],
        },
        population_matches_her2: { type: ["boolean", "null"] },
        topics: { type: "array", items: { type: "string" }, maxItems: 4 },
        reason: { type: "string" },
      },
      required: ["include", "relevance", "reason"],
    },
  );

  let abstract =
    `Eligibility screening of ${canonicalUrl} (doi:${rec.doi ?? "n/a"}) against the HER2+ mission scope. ` +
    `Decision: ${screening.include ? "INCLUDE" : "EXCLUDE"} (${screening.relevance}). ` +
    `HER2+ population: ${screening.population_matches_her2 ?? "unclear"}. ` +
    `Topics: ${(screening.topics ?? []).join(", ") || "n/a"}. ` +
    `Reason: ${trimDot(screening.reason)}. ` +
    `Record metadata: ${rec.publicationType}; ${rec.evidenceLevel}. ` +
    `Method: rules-guided LLM screening (${MODEL}, temp 0) from the PubMed abstract; judgment limited to stated content.`;
  if (abstract.length > 1500) abstract = abstract.slice(0, 1497) + "…";

  const submission = {
    wallet: state.wallet,
    title: `Eligibility screening: ${rec.title}`.slice(0, 120),
    evidenceUrl: canonicalUrl,
    abstract,
    workType: "source-screening",
    timestamp: Date.now(),
  };
  const res = await api(
    "/api/submissions",
    { method: "POST", body: JSON.stringify(submission) },
    state.apiKey,
  );
  log(`[screen] ✓ → ${JSON.stringify(res).slice(0, 200)}`);
  state.usedPmids = [...(state.usedPmids ?? []), pmid];
  saveState(state);
  return true;
}

// ---------- work: source-check verifications ----------

function extractClaimsFromGraph(graph: any): any[] {
  // tolerant: the graph schema is undocumented; look for claim-like objects
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
    log(
      `[verify] no claims recognised in graph — run "node agent.ts graph" and send me the shape.`,
    );
    return 0;
  }
  const verified = new Set(state.verifiedClaims ?? []);
  const candidates = all.filter(
    (c) =>
      !verified.has(c.id) &&
      c.wallet !== state.wallet &&
      (c.pmid || /pubmed\.ncbi/.test(String(c.url ?? ""))),
  );
  let done = 0;
  for (const c of candidates) {
    if (done >= max) break;
    try {
      const pmid = String(
        c.pmid ??
          String(c.url).match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)?.[1] ??
          "",
      );
      if (!pmid) continue;
      const sourceText = await fetchPubmedAbstract(pmid);

      // deterministic part: every number in the claim must appear in the source
      const missingNumbers = numbersOf(c.text).filter(
        (n) => !sourceText.includes(n),
      );

      // model part: semantic support
      const judgment = await ollamaJSON(
        `Does the source text support this claim? Answer strictly from the text. ` +
          `Claim: "${c.text}"\n\nSource text:\n${sourceText}`,
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

      // combine: numeric mismatch caps the verdict
      let result: string = judgment.verdict;
      let confidenceBps = result === "inconclusive" ? 4000 : 7500;
      if (missingNumbers.length > 0 && result === "supports") {
        result = "inconclusive";
        confidenceBps = 4000;
      }
      if (missingNumbers.length > 0 && result === "refutes")
        confidenceBps = 8000;

      const report = [
        `# Source check — claim ${c.id}`,
        ``,
        `Claim: ${c.text}`,
        `Source: PMID ${pmid} (https://pubmed.ncbi.nlm.nih.gov/${pmid}/)`,
        `Checked: ${new Date().toISOString()}`,
        ``,
        `## Method`,
        `1. Fetched abstract via NCBI efetch (rettype=abstract).`,
        `2. Deterministic numeric check: every number in the claim searched verbatim in the source text.`,
        `3. Semantic check: ${MODEL} (temp 0), schema-constrained verdict.`,
        ``,
        `## Findings`,
        `Numeric tokens missing from source: ${missingNumbers.length ? missingNumbers.join(", ") : "none"}`,
        `Model verdict: ${judgment.verdict}`,
        `Reasoning: ${judgment.reasoning}`,
        `Final result: ${result} (confidence ${confidenceBps} bps)`,
        ``,
        `Limitations: abstract-level check only; full text not reviewed.`,
        `Source sha256: ${sha256(sourceText)}`,
      ].join("\n");

      mkdirSync(ARTIFACT_DIR, { recursive: true });
      const artifactFile = `${ARTIFACT_DIR}/verify-${c.id.slice(0, 16)}.md`;
      writeFileSync(artifactFile, report);
      if (
        !gitPushArtifacts(
          `verification artifact for claim ${c.id.slice(0, 16)}`,
        )
      ) {
        log(
          `[verify] artifact push failed — skipping submission for ${c.id.slice(0, 12)}`,
        );
        continue;
      }

      const payload = {
        wallet: state.wallet,
        claimId: c.id,
        specialization: "literature",
        method: "source-check",
        toolName: `${MODEL} + deterministic numeric matcher`,
        result,
        confidenceBps,
        inputHash: sha256(sourceText),
        outputHash: sha256(report),
        artifactUrl: `${RAW_BASE}/artifacts/verify-${c.id.slice(0, 16)}.md`,
        metrics: { missingNumericTokens: missingNumbers.length },
        timestamp: Date.now(),
      };
      const res = await api(
        "/api/science/verifications",
        { method: "POST", body: JSON.stringify(payload) },
        state.apiKey,
      );
      log(
        `[verify] ✓ ${c.id.slice(0, 12)} → ${result} — ${JSON.stringify(res).slice(0, 150)}`,
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

// ---------- commands ----------

async function register(wallet: string, handle: string, specialty: string) {
  if (!wallet)
    fail(
      "usage: node agent.ts register <PUBLIC_SOLANA_ADDRESS> [handle] [specialty]",
    );
  if (loadState(true).apiKey)
    fail("Already registered (muse-agent.json has an apiKey).");
  const body = {
    wallet,
    handle,
    specialty,
    bio: "Deterministic extraction pipeline: fetches PubMed sources, extracts structured claims with a local LLM, validates output in code before submitting.",
  };
  const res = await api("/api/agents", {
    method: "POST",
    body: JSON.stringify(body),
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
  console.log(`round:  ${r.id}`);
  console.log(`phase:  ${r.phase}`);
  if (Number.isFinite(r.endsAt)) {
    console.log(
      `ends:   ${new Date(r.endsAt).toISOString()} (${((r.endsAt - Date.now()) / 60000).toFixed(1)} min from now)`,
    );
  }
}

async function inspect(pageFile?: string) {
  if (!pageFile) {
    const manifest = await api("/data/research/manifest.json");
    console.log(JSON.stringify(manifest, null, 2).slice(0, 3000));
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
  const s = JSON.stringify(g, null, 2);
  console.log(s.slice(0, 6000));
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
    `daemon started — wallet ${state.wallet.slice(0, 8)}…, ${state.usedPmids?.length ?? 0} papers used, ${state.verifiedClaims?.length ?? 0} claims verified`,
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

        // 1) evidence-extraction
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

        // 2) source-screening (separate category, separate paper)
        try {
          await submitScreening(await pickUnusedRecord(state), state);
        } catch (e: any) {
          log(`screening failed: ${e.message?.slice(0, 200)}`);
        }

        // 3) source-check verifications on other wallets' claims
        try {
          const n = await verifyBatch(state, VERIFY_BATCH);
          log(`verifications this round: ${n}`);
        } catch (e: any) {
          log(`verify batch failed: ${e.message?.slice(0, 200)}`);
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
        "usage: node agent.ts <register|status|inspect|graph|extract|run> — see file header",
      );
  }
} catch (e: any) {
  console.error(`✗ ${e.message ?? e}`);
  process.exit(1);
}
