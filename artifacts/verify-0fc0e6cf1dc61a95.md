# Source check — claim 0fc0e6cf1dc61a950e83c861e4e0f21ee247e95273cf10aa01d700f8e73db369

Claim: Abstract extract PMID 42562949 ("AKAP13 regulates GLI1/ULK1 axis and drive tumor resistance to next-generation HER2-targeted therapies."):  Key fragments: ver, mechanisms of primary and acquired resistance remain unclear. Here, we reported that primary HER2-specific targeted therapy (tucatinib) resistant | e breast cancer cells. Integrated high-throughput analyses identified A-kinase anchoring protein (AKAP)13 as a critical molecule involved in b | oth primary and acquired resistance and an independent predictor of poor prognosis. Silencing of AKAP13 significantly diminished novel Abstract-only SHA-256 TITLE+PMID+ABSTRACT=d40c4c0fd7fcb1a813f39055bc3d10d3070da963aed51418917a924d520972d6. Not treatment advice.
Source: PMID 42562949 (https://pubmed.ncbi.nlm.nih.gov/42562949/)
Checked: 2026-09-23T16:11:36.045Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 40, 813, 39055, 3070, 963, 51418917, 924, 520972
Model verdict: supports
Reasoning: The source text supports the claim. The text explicitly states that AKAP13 is a critical molecule involved in both primary and acquired resistance to HER2-targeted therapies and is an independent predictor of poor prognosis. It also mentions that silencing AKAP13 significantly diminishes resistance to novel HER2-targeted therapies, which aligns with the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: edfe2916bcddf3429fc0acde7124e5e1c4a98557a2294dfa751a6002e6b09545