# Source check — claim d5c6c4e5e94bda46c41954a675685ada966f2746e3a85bc04df7fce7dea3976b

Claim: Abstract extract PMID 42229584 ("Final outcomes of the SOFT and TEXT phase III trials in premenopausal hormone receptor-positive early breast cancer."):  Key fragments: nt recurrence-free interval (DRFI), and overall survival (OS). Additionally, 15-year Kaplan-Meier estimates, hazard ratios (HRs), and 95% confidence interva | T+OFS, and 72.1% for T (T+OFS versus T: HR 0.82, 95% CI, 0.69-0.98, P = 0.03). In the SOFT no-chemotherapy cohort, OFS reduced breast cancer e | ersus T+OFS reduced distant recurrence (HR 0.75, 95% CI 0.63-0.90), with a smaller reduction in deaths (HR 0.89, 95% CI 0.74-1.06), with absol Abstract-only SHA-256 TITLE+PMID+ABSTRACT=9aa16f90925f9469a0bb06625fe26e10399224fda55fae369db9913fdfbbc5a9. Not treatment advice.
Source: PMID 42229584 (https://pubmed.ncbi.nlm.nih.gov/42229584/)
Checked: 2026-09-23T07:11:35.594Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 90925, 9469, 06625, 10399224, 55, 369, 9913
Model verdict: supports
Reasoning: The source text directly supports the claim by providing the key fragments mentioned in the claim. The text includes the 15-year Kaplan-Meier estimates, hazard ratios (HRs), and 95% confidence intervals (CIs) for the comparisons between T+OFS and T, as well as the reduction in distant recurrence and deaths with E+OFS versus T+OFS. These details align with the claim's content.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: a4368b82cb449de49fa4ebef5b09fc019166376e9981b82fb82252c3a0662b94