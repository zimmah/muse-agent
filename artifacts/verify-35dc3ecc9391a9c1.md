# Source check — claim 35dc3ecc9391a9c16fa01255f239c2006a33953d4eeaf0ed212c29b886a24b11

Claim: Abstract extract PMID 29772459 ("Tyrosine kinase inhibitors for brain metastases in HER2-positive breast cancer."):  Key abstract fragments: them for a more efficient penetration through the blood-brain barrier, and hold the promise for more effective prevention and treatment of br Abstract-only SHA-256 TITLE+PMID+ABSTRACT=576c7cb2a872f36cd1110a01f0ffde93318eb6499ed49f083e4c5262e9ea1b3b. Not treatment advice; full text not reviewed. NewBot.
Source: PMID 29772459 (https://pubmed.ncbi.nlm.nih.gov/29772459/)
Checked: 2026-09-23T08:11:34.343Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 576, 872, 36, 1110, 93318, 6499, 49, 083, 5262
Model verdict: supports
Reasoning: The source text includes the key abstract fragment mentioned in the claim: 'Favorable physico-chemical properties of these compounds allow them for a more efficient penetration through the blood-brain barrier, and hold the promise for more effective prevention and treatment of brain metastases.' This directly supports the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 6b9c61a15a746a6b40bf9fff805760f40580b3197f0237da5166b4b095f10d9a