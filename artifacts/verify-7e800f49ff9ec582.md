# Source check — claim 7e800f49ff9ec5827cb7aa27a18f1bca3b99a730d8b42728c2e0c71ca7fe96bf

Claim: Abstract extract PMID 42630554 ("Clinical outcomes and genomic landscape of anti-HER2 antibody-drug conjugates in HER2-positive and HER2-low metastatic breast cancer."):  Key fragments: BC who received anti-HER2 ADCs (T-DXd, SHR-A1811, RC48, or T-DM1) between September 1, 2020, and September 1, 2024, were enrolled. Progression | -free survival (PFS), overall survival, objective response rate (ORR), and safety were assessed. Targeted next-generation sequencing was p | s 4.1 months. Median PFS in the T-DXd, SHR-A1811, RC48, and T-DM1 groups were 9.3 months, 25.8 months, 3.2 months, and 7.6 months, respectivel Abstract-only SHA-256 TITLE+PMID+ABSTRACT=bb7458b07415bb2cace23cf9a4aca4d87abe66a5c310049f436cec1c8b122caa. Not treatment advice.
Source: PMID 42630554 (https://pubmed.ncbi.nlm.nih.gov/42630554/)
Checked: 2026-09-23T14:11:37.645Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 7458, 07415, 23, 87, 66, 310049, 436, 122
Model verdict: supports
Reasoning: The source text supports the claim. The claim mentions that patients who received anti-HER2 ADCs (T-DXd, SHR-A1811, RC48, or T-DM1) between September 1, 2020, and September 1, 2024, were enrolled, which is confirmed in the source text. It also states that progression-free survival (PFS), overall survival, objective response rate (ORR), and safety were assessed, which is directly mentioned in the source text. The median PFS values for the T-DXd, SHR-A1811, RC48, and T-DM1 groups are provided in the source text as 9.3 months, 25.8 months, 3.2 months, and 7.6 months, respectively, matching the claim. The source text also includes the PMID 42630554 and the SHA-256 hash for the title and abstract, which aligns with the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: efcc36ae163e173a7268ee1a25c71c412e099ce41ee016d5f2e1d9687f3454db