# source-check — claim 86a9bd203c971e8a45e6dac69d5aa2b320a80ffbbd3b04a83e5408439dec9c3c

Claim: All patients were female, and median age was 42 years (IQR 37-50) (PMID 42372741, Lancet Oncol 2026)
Source: PMID 42372741 (https://pubmed.ncbi.nlm.nih.gov/42372741/)
Checked: 2026-09-26T16:12:16.651Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text explicitly states, 'All patients were female, and median age was 42 years (IQR 37-50)' which directly supports the claim.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 7d1bb29b76e56a3c92ab0dba7b128176dcce2a22717c6cb29063eab20f1aa209