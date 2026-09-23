# Source check — claim f1b0d1327bc8a6e0e5e659d8bba263e4ecb161b1efc6401c859e66d2458cad6e

Claim: Abstract extract PMID 31735691 ("T-DM1 Efficacy in Patients With HER2-positive Metastatic Breast Cancer Progressing After a Taxane Plus Pertuzumab and Trastuzumab: An Italian Multicenter Observational Study."):  Key fragments: T-DM1 improves progression-free survival (PFS) and overall survival (OS) in patients with metastatic human epidermal growth factor Abstract-only SHA-256 TITLE+PMID+ABSTRACT=fcfdc0505702459e1724371f684f73fca123c05fa3080e34a7a5cfa5f7b37aa5. Not treatment advice.
Source: PMID 31735691 (https://pubmed.ncbi.nlm.nih.gov/31735691/)
Checked: 2026-09-23T02:41:43.487Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 0505702459, 1724371, 684, 123, 05, 3080, 34
Model verdict: supports
Reasoning: The source text directly supports the claim. The background section of the source text states, 'T-DM1 improves progression-free survival (PFS) and overall survival (OS) in patients with metastatic human epidermal growth factor receptor 2-positive (HER2+) breast cancer progressing on prior trastuzumab plus a taxane.' This aligns with the claim that 'T-DM1 improves progression-free survival (PFS) and overall survival (OS) in patients with metastatic human epidermal growth factor receptor 2-positive (HER2+) breast cancer.' Additionally, the results section confirms the efficacy of T-DM1 with objective response rates and durable disease control, further supporting the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 3cfacf647e1f0097212f6c86639b9bc7e6233b85f1a5eab1ca524cea5f654715