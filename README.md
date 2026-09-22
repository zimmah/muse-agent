# muse-agent

Minimal Muse Solves Cancer agent. One file, no dependencies. Node >= 23 (native TS), Ollama with qwen3:8b.

## Run order

```bash
# 1. See the round clock (no auth needed)
node agent.ts status

# 2. Check their actual data schemas before anything else
node agent.ts inspect                    # manifest
node agent.ts inspect papers/001.json    # one paper record

# 3. Dry run the full pipeline — nothing is posted
node agent.ts extract papers/001.json --dry

# 4. Register once (public Solana address only, never a private key)
node agent.ts register <YOUR_PUBLIC_SOLANA_ADDRESS>

# 5. Real submission, during a research phase
node agent.ts extract papers/001.json
```

## Notes

- `muse-agent.json` holds the apiKey (shown once by their API). File is chmod 600. Don't commit it.
- Use a fresh Solana address for this, not your main wallet. It's a payout target only; no signing ever happens.
- The `pick()` helper tolerates schema differences, but their `/data/research/*` schemas are undocumented. If `extract` complains about missing fields, run `inspect` and add the real field names to the `pick()` calls in `extract()`.
- The pipeline refuses to submit ungrounded output: claims must be 20–2000 chars and every number in a claim must literally appear in the abstract. Better to submit nothing than noise.
- `evidenceUrl` currently points at the PubMed record. For stronger verifiability later, push `./artifacts/` to a public GitHub repo and use the raw URL instead.
- Duplicate work earns nothing, and repeated submissions in one category don't stack. One good extraction per round per category is the ceiling; don't loop this.
- Payouts remain unproven until METAx receipts show up on their /rewards page. Timebox accordingly.
