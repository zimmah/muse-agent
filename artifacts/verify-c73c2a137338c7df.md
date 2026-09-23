# Source check — claim c73c2a137338c7df466bd98b8921c36951e6c7724a273052f28dfba8b888c0e8

Claim: Abstract extract PMID 42710145 ("Construction of efficacy prediction model for T-DXd treatment of HER2-positive and HER2-low expression breast cancer based on hematological indicators: A real-world study."):  Key fragments: er method. HER2-positive patients had a progression-free survival (PFS) of 12.2 months vs. 10.2 months for HER2-low. Common adverse events included Nausea, | ombination, respectively. Hematological toxicity is a recognized concern with T-DXd therapy. Our predictive model demonstrates strong performance in Abstract-only SHA-256 TITLE+PMID+ABSTRACT=3bd26a821c4591d35f7c14a253055f884fef88363923233dfa566825b50d94f4. Not treatment advice.
Source: PMID 42710145 (https://pubmed.ncbi.nlm.nih.gov/42710145/)
Checked: 2026-09-23T13:11:45.883Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 821, 4591, 35, 253055, 884, 88363923233, 566825, 50, 94
Model verdict: supports
Reasoning: The source text supports the claim. The text states that HER2-positive patients had a progression-free survival (PFS) of 12.2 months vs. 10.2 months for HER2-low, which matches the claim. It also mentions that hematological toxicity is a recognized concern with T-DXd therapy and that the predictive model demonstrates strong performance, aligning with the claim's assertion.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 2adc419dbca5aae5bcf043305a1e70240b6a601ea9f1a4f160ed64f02d67032e