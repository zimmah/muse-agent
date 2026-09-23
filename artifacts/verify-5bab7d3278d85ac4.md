# Source check — claim 5bab7d3278d85ac46a420cd46964c7b088134927d5ee5d13684ae96733211298

Claim: Abstract extract PMID 42682439 ("Omission of frozen section in sentinel lymph node biopsy after neoadjuvant chemotherapy in cN0 HER2-positive and TNBC."):  Key fragments: ssection in patients with minimal or no residual disease provides comparable local control when combined with axillary radiotherapy. This study aime Abstract-only SHA-256 TITLE+PMID+ABSTRACT=554af504ae79935890049debaf076668f52024bcd5cec7889a2148542b8d4116. Not treatment advice.
Source: PMID 42682439 (https://pubmed.ncbi.nlm.nih.gov/42682439/)
Checked: 2026-09-23T16:41:45.746Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 554, 504, 79935890049, 076668, 52024, 7889, 2148542, 4116
Model verdict: supports
Reasoning: The source text supports the claim. The abstract states that 'omission of frozen section in sentinel lymph node biopsy after neoadjuvant chemotherapy in cN0 HER2-positive and TNBC' and mentions that 'in patients with minimal or no residual disease provides comparable local control when combined with axillary radiotherapy.' This directly supports the claim provided.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: a02523aab6f453f00f950fa73aaac81bbd5bb39e57fada23f124a737e7d7ea63