# Source check — claim 57c63ce65ba1ce0a40bd4045fce1cc6d958994db7e4c9dc4e3bf639d60ea6ad5

Claim: Abstract extract PMID 42727044 ("Trastuzumab Botidotin Versus Trastuzumab Emtansine in Human Epidermal Growth Factor Receptor 2-Positive Advanced Breast Cancer: A Phase III, Open-Label, Randomized Controlled Trial."):  Key fragments: ab emtansine. The primary end point was progression-free survival (PFS), assessed by blinded independent central review (BICR), using an intention-to-treat | b emtansine (median, 11.1 v 4.4 months; hazard ratio [HR], 0.39 [95% CI, 0.30 to 0.51]; nominal P < .0001). Benefit was consistent across subgroups, inc | .5 to 60.4) with trastuzumab emtansine. Overall survival data were immature (medians not reached in either group; HR, 0.62 [95% CI, 0.38 to 1.03]). Grade ≥3 Abstract-only SHA-256 TITLE+PMID+ABSTRACT=51c9e91cdba67d47ca89dcff0f7547f466a3468ff991f228a176304953537037. Not treatment advice.
Source: PMID 42727044 (https://pubmed.ncbi.nlm.nih.gov/42727044/)
Checked: 2026-09-23T10:41:35.995Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 91, 67, 47, 89, 7547, 466, 3468, 991, 228, 176304953537037
Model verdict: supports
Reasoning: The source text supports the claim. The claim mentions key fragments such as 'ab emtansine' and provides details about the primary endpoint (progression-free survival) and its results (median 11.1 vs 4.4 months; HR 0.39). These details are directly supported by the source text, which states: 'At data cutoff (median follow-up, 14.9 months), trastuzumab botidotin resulted in longer PFS than trastuzumab emtansine (median, 11.1 v 4.4 months; hazard ratio [HR], 0.39 [95% CI, 0.30 to 0.51]; nominal P < .0001).'
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 94ec7d7b1dbaf76bf9fab3a72f31fef86a33422298b8df89512c60bd16d28174