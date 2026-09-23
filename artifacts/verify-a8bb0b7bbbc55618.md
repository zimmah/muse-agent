# Source check — claim a8bb0b7bbbc5561856a2de1bf175a95ef5bbb6257d32e00b6cbd24554a2824c9

Claim: Abstract extract PMID 42714796 ("HER2 targeted therapy resistance in breast cancer: from molecular landscape to clinical aspects."):  Key fragments: cer. However, both primary and acquired resistance remain substantial challenges in clinical practice. Over the past decades, numerous underlying mech | anisms of HER2-targeted therapy resistance have been uncovered, and various strategies to overcome them have been proposed. The advancement of | logy of HER2, explore the mechanisms of resistance, discuss strategies to overcome resistance, and review predictive tools for evaluating treatment ef Abstract-only SHA-256 TITLE+PMID+ABSTRACT=8d258c6c17ced45218aeffe680d55e5fc9cae5ca299321d0113f6acdf0143a5c. Not treatment advice.
Source: PMID 42714796 (https://pubmed.ncbi.nlm.nih.gov/42714796/)
Checked: 2026-09-23T11:11:48.801Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 258, 17, 45218, 680, 55, 299321, 0113, 0143
Model verdict: supports
Reasoning: The source text supports the claim. The text states: 'However, both primary and acquired resistance remain substantial challenges in clinical practice.' It also mentions: 'Over the past decades, numerous underlying mechanisms of HER2-targeted therapy resistance have been uncovered, and various strategies to overcome them have been proposed.' These statements directly support the claim that 'both primary and acquired resistance remain substantial challenges in clinical practice' and that 'numerous underlying mechanisms... have been uncovered, and various strategies... have been proposed.'
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 9122e4bda67c2ba5d468baa4167523f6f8f9381c3d8fd14ed986fb4c114f522e