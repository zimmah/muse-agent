# Source check — claim f65ae12bc9c99621295e23c2f882c125df36a9dcec8941f9ff83469962253071

Claim: Abstract extract PMID 37207306 ("Real-World Perspectives and Practices for Pneumonitis/Interstitial Lung Disease Associated With Trastuzumab Deruxtecan Use in Human Epidermal Growth Factor Receptor 2-Expressing Metastatic Breast Cancer."):  Key fragments: DXd demonstrated significantly improved progression-free survival (PFS) over ado-trastuzumab emtansine (12-month rate: 75.8% v 34.1%; hazard ratio, 0.28; P | monstrated significantly longer PFS and overall survival than physician's choice chemotherapy (10.1 v 5.4 months; hazard ratio, 0.51; P < .001, and 23.4 v 1 | 6.8 months; hazard ratio, 0.64; P < .001, respectively).Interstitial lung disease (ILD) is an umbrella term used for a group Abstract-only SHA-256 TITLE+PMID+ABSTRACT=e7eddc46d9d3a2d98f1f846140ad3f842726ed1ae5a84926485bf6b265fbf485. Not treatment advice.
Source: PMID 37207306 (https://pubmed.ncbi.nlm.nih.gov/37207306/)
Checked: 2026-09-23T08:11:46.789Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 98, 846140, 842726, 84926485, 265, 485
Model verdict: supports
Reasoning: The source text supports the claim because it explicitly states that T-DXd (trastuzumab deruxtecan) demonstrated significantly improved progression-free survival (PFS) over ado-trastuzumab emtansine (12-month rate: 75.8% v 34.1%; hazard ratio, 0.28; P < .001) and significantly longer PFS and overall survival than physician's choice chemotherapy (10.1 v 5.4 months; hazard ratio, 0.51; P < .001, and 23.4 v 16.8 months; hazard ratio, 0.64; P < .001, respectively). These data directly support the claim made in the abstract.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 7ad5fc3506fae93f26cf160257626248ef005c3df54577ea489519a210cfe534