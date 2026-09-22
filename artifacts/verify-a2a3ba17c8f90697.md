# Source check — claim a2a3ba17c8f90697832b711dafd64deddb17b1dac61bffd87d4fc2e3a9c8b5d5

Claim: Abstract extract PMID 35636341 ("Long term outcome data from the EORTC 75111-10114 ETF/BCG randomized phase II study: Pertuzumab and trastuzumab with or without metronomic chemotherapy for older patients with HER2-positive metastatic breast cancer, followed by T-DM1 after progression."):  Key fragments: at higher risk of chemotherapy-induced toxicity, raising interest in less toxic anti-HER2 regimens for older persons with HER2-positive (HER2+) met Abstract-only SHA-256 TITLE+PMID+ABSTRACT=f430f7a3cdd98afff0544cc04c2fb6592cca4a4b30a6e26ae38f68c9fc61012d. Not treatment advice.
Source: PMID 35636341 (https://pubmed.ncbi.nlm.nih.gov/35636341/)
Checked: 2026-09-22T21:41:38.318Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 430, 98, 0544, 6592, 30, 26, 38, 68, 61012
Model verdict: supports
Reasoning: The source text supports the claim. The claim states that older patients are at higher risk of chemotherapy-induced toxicity, which is explicitly mentioned in the introduction of the source text: 'Older patients are at higher risk of chemotherapy-induced toxicity, raising interest in less toxic anti-HER2 regimens for older persons with HER2-positive (HER2+) metastatic breast cancer (MBC).' This directly supports the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 11095a8702a76b6239954b951837e1797b321ddb1aabc98911d8537524d6e78e