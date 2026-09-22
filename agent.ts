#!/usr/bin/env node
/**
 * muse-agent — minimal research agent for musesolvescancer.com
 *
 * Commands:
 *   node agent.ts register <wallet> [handle] [specialty]   register once, stores apiKey
 *   node agent.ts status                                    show current round + phase
 *   node agent.ts inspect [paperFile]                       dump manifest / one paper's schema
 *   node agent.ts extract <paperFile> [--dry]               run local-LLM extraction + submit
 *
 * paperFile is a path under /data/research/, e.g. papers/001.json
 * --dry prints payloads without POSTing anything.
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

function loadState(): State {
  if (!existsSync(STATE_PATH))
    fail(`No ${STATE_PATH}. Run: node agent.ts register <wallet>`);
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

/** Tolerant field lookup: schemas may differ from the docs; try several names. */
function pick(obj: any, names: string[]): any {
  for (const n of names) {
    const v = n
      .split(".")
      .reduce((o, k) => (o == null ? undefined : o[k]), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
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
  if (existsSync(STATE_PATH) && loadState().apiKey)
    fail("Already registered (muse-agent.json has an apiKey).");
  const body = {
    wallet,
    handle,
    specialty,
    bio: "Deterministic extraction pipeline: parses papers, extracts structured claims with a local LLM, validates output in code before submitting.",
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
  console.log(`round:  ${pick(round, ["id", "roundId"])}`);
  console.log(`phase:  ${pick(round, ["phase", "status"])}`);
  console.log(`ends:   ${pick(round, ["researchEndsAt", "endsAt"]) ?? "?"}`);
  return round;
}

async function inspect(paperFile?: string) {
  if (!paperFile) {
    const manifest = await api("/data/research/manifest.json");
    console.log("=== manifest keys ===");
    console.log(Object.keys(manifest));
    console.log(JSON.stringify(manifest, null, 2).slice(0, 3000));
    return;
  }
  const paper = await api(`/data/research/${paperFile}`);
  console.log("=== paper keys ===");
  console.log(Object.keys(paper));
  console.log(JSON.stringify(paper, null, 2).slice(0, 4000));
}

async function extract(paperFile: string, dry: boolean) {
  if (!paperFile) fail("usage: node agent.ts extract papers/001.json [--dry]");
  const state = loadState();
  if (!state.apiKey && !dry)
    fail("Not registered. Run register first, or use --dry.");

  // 1. Round gate
  const round = await status();
  const phase = String(pick(round, ["phase", "status"]) ?? "");
  if (!dry && !/research/i.test(phase))
    fail(
      `Phase is "${phase}" — research writes only during the research phase. Wait and retry.`,
    );

  // 2. Fetch the source from Muse's own mirror
  const record = await api(`/data/research/${paperFile}`);
  const title =
    pick(record, ["title", "source.title", "record.title"]) ?? "(untitled)";
  const abstractText = pick(record, [
    "abstract",
    "abstractText",
    "summary",
    "record.abstract",
    "briefSummary",
  ]);
  if (!abstractText)
    fail(
      `No abstract field found in ${paperFile}. Run "inspect ${paperFile}" and adjust pick() names.`,
    );
  const pmid = String(
    pick(record, ["pmid", "PMID", "externalId", "uid", "id"]) ?? "",
  );
  const canonicalUrl =
    pick(record, ["canonicalUrl", "url"]) ??
    (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : undefined);
  if (!canonicalUrl)
    fail("No canonical URL / PMID found — inspect the record and adjust.");

  // 3. Hash + local artifact (publish to a stable public URL later for stronger verifiability)
  const sourceContent = JSON.stringify(record);
  const contentHash = sha256(sourceContent);
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const artifactPath = `${ARTIFACT_DIR}/${pmid || contentHash.slice(0, 12)}.json`;
  writeFileSync(artifactPath, sourceContent);

  // 4. Local model: structured extraction, validated in code
  console.log(`→ extracting with ${MODEL} …`);
  const extraction = await ollamaJSON(
    `You are extracting structured facts from a breast-cancer research abstract. ` +
      `Only state what the text explicitly supports; use null when absent. Title: ${title}\n\nAbstract:\n${abstractText}`,
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
    // crude grounding check: numbers quoted in a claim must appear in the source text
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
    `Structured extraction of ${canonicalUrl}. ` +
    `Design: ${extraction.study_design ?? "not stated"}; n=${extraction.sample_size ?? "not stated"}; ` +
    `population: ${extraction.population ?? "not stated"}; intervention: ${extraction.intervention ?? "not stated"}; ` +
    `primary outcome: ${extraction.primary_outcome ?? "not stated"}. ` +
    `Key result: ${extraction.key_result ?? "not stated"}. ` +
    `Limitations: ${extraction.limitations ?? "not assessed"}. ` +
    `Method: local LLM extraction (qwen3:8b, temp 0) with deterministic post-validation; numeric claims verified against source text. ` +
    `Source hash sha256:${contentHash.slice(0, 16)}…`;
  if (submissionAbstract.length > 1500)
    submissionAbstract = submissionAbstract.slice(0, 1497) + "…";
  if (submissionAbstract.length < 40) fail("Submission abstract too short.");

  const submission = {
    wallet: state.wallet,
    title: `Structured extraction: ${title}`.slice(0, 120),
    evidenceUrl: canonicalUrl,
    abstract: submissionAbstract,
    workType: "evidence-extraction",
    timestamp: 0, // set immediately before send
  };

  const evidence = {
    wallet: state.wallet,
    timestamp: 0,
    source: {
      type: "pubmed",
      externalId: pmid || contentHash.slice(0, 12),
      canonicalUrl,
      title: String(title).slice(0, 300),
      contentHash,
      metadata: {},
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
    await extract(positional[0], dry);
    break;
  default:
    console.log(
      "usage: node agent.ts <register|status|inspect|extract> — see file header",
    );
}
