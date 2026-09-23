# Source check — claim e2b96a03238c5c3f83dcdf0f4fc501d468bddc4543cd05c113f4aca5707de1f5

Claim: Abstract extract PMID 33819752 ("T-DM1 versus pertuzumab, trastuzumab and a taxane as first-line therapy of early-relapsed HER2-positive metastatic breast cancer: an Italian multicenter observational study."):  Key fragments: institutions. The primary endpoint was progression-free survival. Secondary endpoints included patients' characterization, overall survival and post-progre | + T + taxane was associated with worse progression-free survival (adjusted hazard ratio: 2.26, 95% confidence interval: 1.13-4.52, P = 0.021) and overall s | urvival (adjusted hazard ratio: 3.95, 95% confidence interval: 1.38-11.32, P = 0.010), irrespective of previous (neo)adjuvant trea Abstract-only SHA-256 TITLE+PMID+ABSTRACT=8278c52bef6bd32dde04d2881167477c583f0430f5586b74477d1f8f5c50de80. Not treatment advice.
Source: PMID 33819752 (https://pubmed.ncbi.nlm.nih.gov/33819752/)
Checked: 2026-09-23T01:11:40.934Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 8278, 2881167477, 583, 0430, 5586, 74477, 50
Model verdict: supports
Reasoning: The source text supports the claim. The claim states that T-DM1 was associated with worse progression-free survival (adjusted hazard ratio: 2.26, 95% confidence interval: 1.13-4.52, P = 0.021) and overall survival (adjusted hazard ratio: 3.95, 95% confidence interval: 1.38-11.32, P = 0.010) compared to P + T + taxane, irrespective of previous (neo)adjuvant treatment. This is directly supported by the results section of the source text, which states: 'T-DM1, compared with P + T + taxane was associated with worse progression-free survival... and overall survival... irrespective of previous (neo)adjuvant treatment...'
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: f3370dbcc8b1720fd5f25710b76ab59b1a176641cb88cb4c2ff428323b83a387