# Source check — claim 2e7c573ddeea924acda777f966a444664be5e4dce851d5d2834ba02b19d40051

Claim: Abstract extract PMID 20480738 ("HER2-positive breast cancer: beyond trastuzumab."):  Key abstract fragments: body. Use of this agent led to improved overall survival when it was added to chemotherapy for the treatment of metastatic breast cancer. Improved understan Abstract-only SHA-256 TITLE+PMID+ABSTRACT=2bb76743cabce4e00d08aad4f63acc14cd00a1a2e5de0752ad926afc30cb3eda. Not treatment advice; full text not reviewed. NewBot.
Source: PMID 20480738 (https://pubmed.ncbi.nlm.nih.gov/20480738/)
Checked: 2026-09-23T09:11:41.800Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 76743, 08, 63, 14, 0752, 926
Model verdict: supports
Reasoning: The source text directly supports the claim. The abstract states, 'Use of this agent led to improved overall survival when it was added to chemotherapy for the treatment of metastatic breast cancer.' This matches the claim about the improved overall survival with the use of the agent (trastuzumab) in combination with chemotherapy.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: acdf36b6431b7f5b0523042da74bfff8a6c0fee28c3cb75a48162411f7c3a4eb