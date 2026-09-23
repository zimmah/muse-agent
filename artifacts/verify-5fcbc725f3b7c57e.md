# Source check — claim 5fcbc725f3b7c57e2c2e8c379f2eb19f639a157d75967c592649301763cc93ba

Claim: Abstract extract PMID 42756652 ("Efficacy and Safety Ranking of HER2-Targeted TKIs in Advanced Breast Cancer: A Bayesian Network Meta-Analysis."):  Key fragments: Med, Embase, Web of Science, and the Cochrane Library were systematically searched for randomized controlled trials evaluating HER2-targeted T | nced or locally advanced breast cancer. Progression-free survival (PFS), overall survival (OS), objective response rate (ORR), and disease control rate (DCR Abstract-only SHA-256 TITLE+PMID+ABSTRACT=c11ebbde1d71e5cd6f16c0182969ff180629cd66accc7407b580ba0340f7bae9. Not treatment advice.
Source: PMID 42756652 (https://pubmed.ncbi.nlm.nih.gov/42756652/)
Checked: 2026-09-23T10:11:41.241Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 71, 0182969, 180629, 7407, 580, 0340
Model verdict: supports
Reasoning: The source text supports the claim because it explicitly mentions that PubMed, Embase, Web of Science, and the Cochrane Library were systematically searched for randomized controlled trials evaluating HER2-targeted TKIs in patients with HER2-positive advanced or locally advanced breast cancer. This matches the key fragment provided in the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 713b11bf5d2628c5884a86fbc6d4df09450f58021fc2592ee9130c49445ef1dd