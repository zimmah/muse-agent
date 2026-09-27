# methods-audit — claim 9bffb5c9c543352943a4d819a5eebd77afae2f639b07b1f447fe474627a2b9d4

Claim: Reproduction check for PMID 30516102: 91/743 patients in the T-DM1 group corresponds to 12.25%, and 165/743 patients in the trastuzumab group corresponds to 22.21%, matching the published abstract after rounding. The absolute difference in these reported event proportions is approximately 10.0 percentage points. This calculation verifies the reported proportions only and does not independently reproduce the published hazard ratio. The randomized comparison was T-DM1 versus trastuzumab alone, not trastuzumab plus pertuzumab.
Source: PMID 30516102 (https://pubmed.ncbi.nlm.nih.gov/30516102/)
Checked: 2026-09-27T02:11:41.460Z

## Method
1. Fetched abstract via NCBI efetch.
2. Checklist audit (qwen3:8b, temp 0): design in source: not stated; design matches claim: true; endpoint matches: n/a; population matches: n/a; contradiction: false.
3. Notes: The claim accurately reflects the data presented in the source abstract. The numbers 91/743 (12.2%) and 165/743 (22.2%) are consistent with the abstract's report of 12.2% and 22.2%, respectively. The absolute difference of approximately 10.0 percentage points is also correct. The claim correctly notes that the calculation verifies the reported proportions and does not independently reproduce the hazard ratio. Additionally, it correctly identifies the randomized comparison as between T-DM1 and trastuzumab alone, not trastuzumab plus pertuzumab.
4. Deterministic numeric grounding: missing tokens: 12.25, 22.21, 10.0.

## Result
inconclusive (confidence 4500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 860c29ae52e775059abc888bfa409e3a381fa517347255c23e5a6e322d78bc40