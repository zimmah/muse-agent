#!/usr/bin/env node
/**
 * muse-agent — minimal research agent for musesolvescancer.com
 *
 * Commands:
 *   node agent.ts register <wallet> [handle] [specialty]      register once, stores apiKey
 *   node agent.ts status                                       show current round + phase
 *   node agent.ts inspect [pageFile]                           dump manifest / one catalogue page
 *   node agent.ts extract <pageFile> [recordIndex] [--dry]     extraction pipeline for one record
 *
 * pageFile is a path under /data/research/, e.g. papers/001.json (a page of 250 records).
 * recordIndex picks a record on that page (default 0). Pick a non-obvious index:
 * everyone extracts priorityRank 1 first, and duplicates earn nothing.
 * --dry prints payloads without POSTing anything to Muse.
 *
 * Requires Node >= 23 (native TS) and Ollama running qwen3:8b locally.
 * State (apiKey!) is stored in ./muse-agent.json — chmod 600, never commit.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  chmodSync,
  existsSync,
} from "node:fs";
import { createHash } from "node:crypto";

const BASE = "https://musesolvescancer.com";
const OLLAMA = "http://localhost:11434/api/chat";
const MODEL = "qwen3:8b";
const STATE_PATH = "./muse-agent.json";
const ARTIFACT_DIR = "./artifacts";

type State = { wallet: string; handle: string; apiKey?: string };

// ---------- helpers ----------

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

function fail(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
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
    fail(`PubMed returned suspiciously little text for PMID ${pmid}:\n${text}`);
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
      `Registered but no apiKey found in response:\n${JSON.stringify(res, null, 2)}`,
    );
  saveState({ wallet, handle, apiKey });
  console.log(
    `✓ Registered as "${handle}". apiKey saved to ${STATE_PATH} (mode 600). It is shown only once — back it up.`,
  );
}

async function status(): Promise<any> {
  const s = await api("/api/research-status");
  const round = pick(s, ["round"]) ?? s;
  const ends = Number(pick(round, ["researchEndsAt", "endsAt"]));
  console.log(`round:  ${pick(round, ["id", "roundId"])}`);
  console.log(`phase:  ${pick(round, ["phase", "status"])}`);
  if (Number.isFinite(ends)) {
    const mins = ((ends - Date.now()) / 60000).toFixed(1);
    console.log(
      `ends:   ${new Date(ends).toISOString()} (${mins} min from now)`,
    );
  }
  return round;
}

async function inspect(pageFile?: string) {
  if (!pageFile) {
    const manifest = await api("/data/research/manifest.json");
    console.log("=== manifest ===");
    console.log(JSON.stringify(manifest, null, 2).slice(0, 3000));
    return;
  }
  const page = await api(`/data/research/${pageFile}`);
  console.log(
    `kind=${page.kind} page=${page.page} total=${page.total} records=${page.records?.length}`,
  );
  console.log(JSON.stringify(page.records?.[0], null, 2));
}

async function extract(
  pageFile: string,
  indexArg: string | undefined,
  dry: boolean,
) {
  if (!pageFile)
    fail("usage: node agent.ts extract papers/001.json [recordIndex] [--dry]");
  const state = loadState(dry);
  if (!state.apiKey && !dry)
    fail("Not registered. Run register first, or use --dry.");

  // 1. Round gate
  const round = await status();
  const phase = String(pick(round, ["phase", "status"]) ?? "");
  if (!dry && !/research/i.test(phase))
    fail(
      `Phase is "${phase}" — research writes only during the research phase. Wait and retry.`,
    );

  // 2. Pick a record from the catalogue page (metadata only — no abstracts in the mirror)
  const page = await api(`/data/research/${pageFile}`);
  const records: any[] = page.records ?? [];
  const idx = indexArg ? Number(indexArg) : 0;
  const rec = records[idx];
  if (!rec) fail(`No record at index ${idx} (page has ${records.length}).`);
  const pmid = String(rec.pmid ?? "");
  if (!pmid)
    fail(
      `Record ${idx} has no pmid — trials pages need a different flow; use a papers/ page for now.`,
    );
  const canonicalUrl =
    rec.sourceUrl ?? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  console.log(`→ record ${idx}: PMID ${pmid} — ${rec.title}`);

  // 3. Fetch the actual source text from PubMed
  const abstractText = await fetchPubmedAbstract(pmid);
  const contentHash = sha256(abstractText);
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const artifactPath = `${ARTIFACT_DIR}/pmid-${pmid}.txt`;
  writeFileSync(artifactPath, abstractText);

  // 4. Local model: structured extraction, schema-constrained
  console.log(`→ extracting with ${MODEL} …`);
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

  // 5. Deterministic validation before anything leaves the machine
  const claims = (extraction.claims ?? [])
    .map((c: string) => c.trim())
    .filter((c: string) => c.length >= 20 && c.length <= 2000)
    // grounding check: numbers quoted in a claim must appear in the source text
    .filter((c: string) =>
      (c.match(/\d+(?:\.\d+)?/g) ?? []).every((n: string) =>
        abstractText.includes(n),
      ),
    );
  if (claims.length === 0)
    fail(
      "No claims survived validation — model output was ungrounded. Nothing submitted.",
    );

  let submissionAbstract =
    `Structured extraction of ${canonicalUrl} (doi:${rec.doi ?? "n/a"}). ` +
    `Design: ${extraction.study_design ?? "not stated"}; n=${extraction.sample_size ?? "not stated"}; ` +
    `population: ${extraction.population ?? "not stated"}; intervention: ${extraction.intervention ?? "not stated"}; ` +
    `primary outcome: ${extraction.primary_outcome ?? "not stated"}. ` +
    `Key result: ${extraction.key_result ?? "not stated"}. ` +
    `Limitations: ${extraction.limitations ?? "not assessed"}. ` +
    `Method: local LLM extraction (qwen3:8b, temp 0) with deterministic post-validation; numeric claims verified against source text. ` +
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

  console.log("\n=== extraction ===");
  console.log(JSON.stringify(extraction, null, 2));
  console.log(
    `\n${claims.length} claim(s) passed validation. Artifact: ${artifactPath}`,
  );

  if (dry) {
    console.log("\n=== DRY RUN — would POST /api/submissions ===");
    console.log(JSON.stringify(submission, null, 2));
    console.log("\n=== DRY RUN — would POST /api/science/evidence ===");
    console.log(JSON.stringify(evidence, null, 2));
    return;
  }

  submission.timestamp = Date.now();
  const subRes = await api(
    "/api/submissions",
    { method: "POST", body: JSON.stringify(submission) },
    state.apiKey,
  );
  console.log("\n✓ /api/submissions →", JSON.stringify(subRes, null, 2));

  evidence.timestamp = Date.now();
  const evRes = await api(
    "/api/science/evidence",
    { method: "POST", body: JSON.stringify(evidence) },
    state.apiKey,
  );
  console.log("\n✓ /api/science/evidence →", JSON.stringify(evRes, null, 2));
}

// ---------- main ----------

const [, , cmd, ...args] = process.argv;
const dry = args.includes("--dry");
const positional = args.filter((a) => !a.startsWith("--"));

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
  case "extract":
    await extract(positional[0], positional[1], dry);
    break;
  default:
    console.log(
      "usage: node agent.ts <register|status|inspect|extract> — see file header",
    );
}
