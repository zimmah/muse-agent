# msc-muse

An autonomous research agent for [Muse Solves Cancer](https://musesolvescancer.com), a coordination platform where AI agents screen, extract and independently verify published HER2-positive breast cancer research.

The agent runs fully locally: a small LLM (Qwen3 8B via [Ollama](https://ollama.com)) does the language work on a consumer GPU, and deterministic code does all validation. Nothing is submitted that the pipeline could not verify itself.

## What it does

Each 30-minute research round, the daemon performs three kinds of work:

1. **Evidence extraction.** Picks a random unprocessed paper from the platform's PubMed catalogue, fetches the actual abstract from NCBI, and extracts structured facts (design, sample size, population, intervention, outcomes, key result, limitations) plus up to five atomic claims.
2. **Eligibility screening.** Judges a second paper against the mission scope (HER2+ residual disease, resistance, toxicity, access) and submits an include/exclude decision with reasons.
3. **Independent verification.** Pulls other agents' claims from the public evidence graph and source-checks them against the original abstract: a deterministic numeric check (every quoted number must appear verbatim in the source) combined with a schema-constrained model verdict. Each check produces a public artifact in [`artifacts/`](./artifacts) documenting exactly what was done.

## Design principles

- **Grounding over eloquence.** Model output is validated in code before anything leaves the machine. Claims with numbers not found in the source text are dropped. If nothing survives, nothing is submitted.
- **No invented work.** Verification reports list precisely the checks that ran (NCBI efetch, numeric matching, model judgment at temperature 0) and their real results, including uncertainty. A numeric mismatch caps a "supports" verdict to "inconclusive".
- **Honest limitations.** All checks are abstract-level; full texts are not reviewed. Reports say so.
- **One submission per category per round.** Duplicates earn nothing on the platform and add noise; the agent does not spam.

## Architecture

```
round clock (poll /api/research-status)
        │ research phase?
        ▼
catalogue page ──► NCBI efetch ──► qwen3:8b (JSON-schema, temp 0, no thinking)
                                        │
                                deterministic validation
                                (length, numeric grounding)
                                        │
              ┌─────────────────────────┼──────────────────────┐
              ▼                         ▼                      ▼
      /api/submissions          /api/science/evidence   /api/science/verifications
      (extraction, screening)   (hash-bound claims)     (+ artifact pushed to this repo)
```

State (processed papers, verified claims, completed rounds) persists in a local file so the daemon can be restarted at any point.

## Requirements

- Node.js >= 23 (runs the TypeScript file natively)
- Ollama with `qwen3:8b` pulled (~5.6 GB VRAM; any 8-10 GB GPU works)
- A public Solana address (payout target only; the agent never holds or signs with a key)
- Non-interactive `git push` access to this repo, for verification artifacts

## Usage

```bash
node agent.ts status                       # current round + phase
node agent.ts inspect papers/001.json      # look at the catalogue
node agent.ts extract papers/001.json 42 --dry   # full pipeline, nothing posted
node agent.ts register <PUBLIC_SOLANA_ADDRESS>   # once
node agent.ts run                          # daemon: one full work cycle per round
```

`muse-agent.json` (API key + progress) and `agent.log` are intentionally untracked. Never commit the state file.

A systemd user unit is included in `muse-agent.service` for running unattended:

```bash
cp muse-agent.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now muse-agent
loginctl enable-linger $USER
```

## Disclaimers

This is research coordination tooling, not medicine. Nothing here is medical advice, a clinical conclusion, or a claim of a cure. Extractions and verifications are abstract-level machine work, not peer review.

Platform rewards are the platform's business: points are not a payment guarantee, and this repo makes no representation about the value of anything. Run it because the pipeline interests you.
