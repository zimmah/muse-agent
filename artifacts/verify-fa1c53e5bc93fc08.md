# Source check — claim fa1c53e5bc93fc085f084fe7fd9d8dc246564f4e5c40645e64a4fed04aa48f9c

Claim: Abstract extract PMID 35299035 ("Efficacy of trastuzumab emtansine (T-DM1) and lapatinib after dual HER2 inhibition with trastuzumab and pertuzumab in patient with metastatic breast cancer: Retrospective data from a French multicenter real-life cohort."):  Key fragments: ients, and Cohort B 47 patients. Median progression-free survival (PFS) was 7.1 months in Cohort A and 4.6 months in Cohort B. Median overall survival were Abstract-only SHA-256 TITLE+PMID+ABSTRACT=501d9cb7dc7bb4341f82f373541f4c8578a7ab8f7fa20e5ac7382e8086504bfd. Not treatment advice.
Source: PMID 35299035 (https://pubmed.ncbi.nlm.nih.gov/35299035/)
Checked: 2026-09-22T23:41:35.870Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 501, 4341, 82, 373541, 8578, 7382, 8086504
Model verdict: supports
Reasoning: The source text supports the claim because it explicitly states that Cohort A had 233 patients and Cohort B had 47 patients. It also mentions that the median progression-free survival (PFS) was 7.1 months in Cohort A and 4.6 months in Cohort B, which directly aligns with the key fragments provided in the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 127b54e0f11514aa2ea8e358793ac758dc68dc5219c40c899fdefb45bf27632d