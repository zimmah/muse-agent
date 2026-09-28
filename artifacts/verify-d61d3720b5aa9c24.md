# source-check — claim d61d3720b5aa9c24ba0b377442b10431d360e9355e272a94103f4426ede34b07

Claim: Abstract extract PMID 42798330 ("Metaplastic breast cancer: a clinicopathological analysis of nine cases highlighting diagnostic challenges and aggressive behavior."):  Key fragments: edian follow-up of 24 months. However, three patients remained disease-free, and one was alive with metastatic disease at the last follow-up, Abstract-only SHA-256 TITLE+PMID+ABSTRACT=f6e61a5a7e2b10692ae4a02886f7967d8b8839767224aa26ca01d088bc054f77. Not treatment advice.
Source: PMID 42798330 (https://pubmed.ncbi.nlm.nih.gov/42798330/)
Checked: 2026-09-28T02:11:44.475Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim. The text states, 'At a median follow-up of 24 months (range: 15.7-28.4 months), five patients (55.6%) died from distant metastasis.' It also mentions, 'However, three patients remained disease-free, and one was alive with metastatic disease at the last follow-up.' These statements directly support the claim's key fragments about the median follow-up of 24 months and the outcomes of the patients.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 3a8257785669aaff97b4a853d8cf67df788bbc5a88bf54d857774c66a15ef104