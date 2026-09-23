# Source check — claim 5d3e33b1d30efb307e63c24bea5d9c772d4765cad54d75883fa12e2a9167abef

Claim: Abstract extract PMID 42594874 ("Spatial proteogenomic profiling uncovers sensitization strategies for antibody-drug conjugate in HER2-positive breast cancer."):  Key fragments: ent of HER2-positive breast cancer, yet resistance remains poorly understood. Using imaging mass cytometry, we profiled 157 regions of interest compri | r-negative breast cancers treated with SHR-A1811 in the FASCINATE-N trial. Spatial proteomic analyses identified two determinants of ADC respo | collagen-positive fibroblasts mediated resistance. Combining ADC with the histone deacetylase inhibitor chidamide or the collagen-modulating agent lo Abstract-only SHA-256 TITLE+PMID+ABSTRACT=5f65fbe4659aea900607eb3ff3a9d664ddbaf574c5d33d1c24c0cf29dfabfd98. Not treatment advice.
Source: PMID 42594874 (https://pubmed.ncbi.nlm.nih.gov/42594874/)
Checked: 2026-09-23T15:12:16.974Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 65, 4659, 900607, 664, 574, 33, 24
Model verdict: supports
Reasoning: The source text supports the claim. The claim mentions that spatial proteomic analyses identified two determinants of ADC response: elevated tumor-cell H3K27ac expression associated with improved ADC efficacy, and collagen-positive fibroblasts mediated resistance. The source text explicitly states: 'Spatial proteomic analyses identified two determinants of ADC response: elevated tumor-cell H3K27ac expression was associated with improved ADC efficacy, whereas collagen-positive fibroblasts mediated resistance.' This directly supports the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: ec2f07f50f7280b44727dc83b7989ca92e5bd4c7aaf8032a7acd67d0cae8e923