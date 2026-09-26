# statistical-reproduction — claim 68fd9d41f8df48d6e8536f0a1a09eacfe7f1930e7bb127d34d02917093a8be8d

Claim: Results: The overall pCR rate was 67.5% (411/609), with rates of 68.7% (338/492) among patients receiving sequential anti-HER2 neoadjuvant therapy and 62.4% (73/117) among those receiving upfront anti-HER2 neoadjuvant therapy (PMID 42778319, Zhonghua Yi Xue Za Zhi 2026)
Source: PMID 42778319 (https://pubmed.ncbi.nlm.nih.gov/42778319/)
Checked: 2026-09-26T12:11:53.365Z

## Method
1. Fetched abstract via NCBI efetch.
2. Parsed numerator/denominator/percentage patterns from the claim.
3. Recomputed each percentage in code (tolerance 0.55 for rounding):
- 411/609 = 67.49% vs reported 67.5% → MATCH
- 338/492 = 68.70% vs reported 68.7% → MATCH
- 73/117 = 62.39% vs reported 62.4% → MATCH
4. Deterministic numeric grounding: missing tokens: none.

## Result
supports (confidence 9000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: e10719ea262d36bd7e3460e193be737c9653d9e33893ec4495e5ed2872b3b9e9