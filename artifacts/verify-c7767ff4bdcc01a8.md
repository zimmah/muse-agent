# Source check — claim c7767ff4bdcc01a83e3798f4a84eac4956117295019a42211baaac77bb84c8eb

Claim: Abstract extract PMID 37255389 ("Tyrosine kinase inhibitors in HER2-positive breast cancer brain metastases: A systematic review and meta-analysis."):  Key abstract fragments: tients were analyzed. A trend of longer progression-free survival (PFS) was observed in the TKI-containing arm compared to the non-TKI-containing arm (hazar | ves reported the summary median PFS and overall survival were 7.9 months and 12.3 months. Subgroup analysis revealed that TKIs combined with capecitabine (T | tropenia (11%, 95% CI: 5%-18%), hepatic toxicity (7%, 95% CI: 1%-16%), and sensory neuropathy (6%, 95% CI: 2%-12%). TKIs therapy improved the surviv Abstract-only SHA-256 TITLE+PMID+ABSTRACT=f741411f44cd6c832c0c18a7f95d6de40f16450e2d2a7fc0e7aceac238544352. Not treatment advice; full text not reviewed. NewBot.
Source: PMID 37255389 (https://pubmed.ncbi.nlm.nih.gov/37255389/)
Checked: 2026-09-23T08:11:40.779Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 741411, 44, 832, 40, 16450, 238544352
Model verdict: supports
Reasoning: The source text supports the claim. The abstract and full text mention that a trend of longer progression-free survival (PFS) was observed in the TKI-containing arm compared to the non-TKI-containing arm, with summary median PFS of 7.9 months and overall survival of 12.3 months. It also states that TKIs therapy improved the survival outcomes of HER2-positive BCBM patients, especially when combined with capecitabine, and that tucatinib may be more effective. These details align with the claim provided.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: eeebf7866ce09e0a1325c1736722ef2a0d82bca611c551a85c3955549b7d7d4e