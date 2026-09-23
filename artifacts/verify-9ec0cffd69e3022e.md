# Source check — claim 9ec0cffd69e3022ee889e842c1bc6a90a296cb8353cfdebd4695a4f47a525c31

Claim: Abstract extract PMID 39039196 ("HER2-targeted therapies beyond breast cancer - an update."):  Key fragments: rected treatment strategies to overcome resistance and thereby improve efficacy and patient outcomes. Abstract-only SHA-256 TITLE+PMID+ABSTRACT=d11b78dda90263d2a9abe574febd6a9ca58dd61ed370532ce8c42fb3287f80b0. Not treatment advice.
Source: PMID 39039196 (https://pubmed.ncbi.nlm.nih.gov/39039196/)
Checked: 2026-09-23T05:11:41.940Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 11, 78, 90263, 574, 58, 61, 370532, 42, 3287, 80
Model verdict: supports
Reasoning: The source text explicitly mentions 'anticipated future HER2-directed treatment strategies to overcome resistance and thereby improve efficacy and patient outcomes,' which directly supports the claim that the abstract discusses key fragments related to 'rected treatment strategies to overcome resistance and thereby improve efficacy and patient outcomes.'
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 570a46f20d952327721887a1f49b35fefd11755d56c56e45bca0442b88e151dc