# Source check — claim c9edaf260665ab7bf0b2656e001bc961ad2903ec594ed4e2d033267dd78ce5b8

Claim: Abstract extract PMID 42772048 ("Anthracycline-free versus anthracycline-based neoadjuvant therapy in HER2-positive breast cancer: A Propensity score-matched real-world study."):  Key fragments: Anthracycline-free TCHP and anthracycline-based AC-THP are both used as neoadjuvant dual anti-HER2 regimens for HER2-positive breast | did not differ significantly between anthracycline-free (TCHP) and anthracycline-based (AC-THP) neoadjuvant regimens (50.4% vs 45.6%; P = .519 | n selection may reasonably be guided by toxicity, cardiac risk, and cost rather than an expected difference in efficacy. Abstract-only SHA-256 TITLE+PMID+ABSTRACT=df48528755877d3c34add5f727996e38a90bd9190410a96950ea2046cb24f1f3. Not treatment advice.
Source: PMID 42772048 (https://pubmed.ncbi.nlm.nih.gov/42772048/)
Checked: 2026-09-23T09:11:37.004Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 48528755877, 34, 727996, 38, 90, 9190410, 96950, 2046, 24
Model verdict: supports
Reasoning: The source text explicitly states that pathologic complete response (pCR) did not differ significantly between anthracycline-free (TCHP) and anthracycline-based (AC-THP) neoadjuvant regimens (50.4% vs 45.6%; P = .519). This directly supports the claim that there was no significant difference in efficacy between the two regimens, which aligns with the statement that regimen selection may reasonably be guided by toxicity, cardiac risk, and cost rather than an expected difference in efficacy.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 726213befb9a6bb9dd22392d60120213472133ab6d4d5a5568314a594dbbcfd9