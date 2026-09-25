# source-check — claim 8e1e5f023c91ba49efbf65a2e99300567e10579f524a8d494e8ba3f062143380

Claim: In PMID 40456670 (JAVELIN Bladder Medley interim analysis, avelumab+SG vs avelumab in la/mUC), the statistically significant efficacy endpoint was PFS: median 11.17 vs 3.75 months, HR 0.49 (95% CI 0.31-0.76), prespecified boundary HR<=0.60.
Source: PMID 40456670 (https://pubmed.ncbi.nlm.nih.gov/40456670/)
Checked: 2026-09-25T20:11:52.241Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text states that the median PFS with avelumab plus SG was 11.17 months versus 3.75 months with avelumab monotherapy, with a hazard ratio (HR) of 0.49 (95% CI 0.31-0.76), and mentions the prespecified efficacy boundary HR ≤ 0.60. This directly supports the claim that the statistically significant efficacy endpoint was PFS with the specified values and HR boundary.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: d406e6bf149a6db7222e55ce4229bd802230192d2b91b4b529bddf704151a2d0