# Source check — claim b2f4f0dadf3e21400903f32283ee952d4e360d4eb8040d4f95df0bda4ab0c011

Claim: Abstract extract PMID 38007349 ("Trastuzumab Resistance in Patients With HER2-Positive Advanced Breast Cancer: Results From the SONABRE Registry."):  Key fragments: ) and trastuzumab pretreated (n = 112). Progression-free survival (PFS) was compared using multivariable Cox proportional hazard models. The interaction eff | ed with trastuzumab naïve patients, the hazard ratio for first-line progression was 2.07 (CI:1.47-2.92). For trastuzumab pretreated patients who receive | ine trastuzumab without pertuzumab, the hazard ratio for progression was 2.60 (95% CI:1.72-3.93), whereas for those who received first-line trastuzumab Abstract-only SHA-256 TITLE+PMID+ABSTRACT=70c385d3ec271ce6bf49f70fc1489ecfdf70945a5752e91426b125c554910827. Not treatment advice.
Source: PMID 38007349 (https://pubmed.ncbi.nlm.nih.gov/38007349/)
Checked: 2026-09-22T21:11:40.072Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 70, 385, 271, 70, 1489, 70945, 5752, 91426, 125, 554910827
Model verdict: supports
Reasoning: The source text supports the claim. The text mentions that for trastuzumab pretreated patients who received first-line trastuzumab without pertuzumab, the hazard ratio for progression was 2.60 (95% CI:1.72-3.93), which matches the key fragment provided in the claim. Additionally, the text discusses the impact of prior trastuzumab use on progression-free survival (PFS) and the effect of adding pertuzumab to first-line trastuzumab-based therapy, which aligns with the claim's context.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: fa99fe0844556af0720b1102d83925283443a34a94ce51867249470b298fe8d7