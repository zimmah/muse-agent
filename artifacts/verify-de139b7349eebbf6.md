# source-check — claim de139b7349eebbf6da5bf19ca1951c25a0ae12c8e07997ee99ea8b4a551015c2

Claim: Abstract extract PMID 42315091 ("Phenotypic plasticity and competition shape therapy sequencing in HER2+/HER2- breast cancer: A mathematical framework."):  Key fragments: pe-specific therapies are incorporated through simple pharmacodynamic surrogates: Paclitaxel chemotherapy acting primarily on HER2+ cells and Abstract-only SHA-256 TITLE+PMID+ABSTRACT=b1eef6e9b09b8e5b6af51be8bff790abec389bd8ba9e52c50c5e2cfe71ea1ece. Not treatment advice.
Source: PMID 42315091 (https://pubmed.ncbi.nlm.nih.gov/42315091/)
Checked: 2026-09-25T11:41:40.244Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim. It explicitly states that 'Phenotype-specific therapies are incorporated through simple pharmacodynamic surrogates: Paclitaxel chemotherapy acting primarily on HER2+ cells and Notch-pathway inhibition targeting HER2- cells.' This directly aligns with the key fragment in the claim. Additionally, the text mentions that the abstract is provided, which supports the 'Abstract-only' part of the claim. The text also clearly states that the content is not treatment advice, which matches the last part of the claim.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 00801f74d748f318d1ad1bfceeb97ee699e1c1212c19c4eab7c673c16241027c