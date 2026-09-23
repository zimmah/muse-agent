# Source check — claim 878a422ce7c32c6e730214c1c04c5d03e1a584c933d3829cc01095f0f0a4f7bf

Claim: Abstract extract PMID 36587473 ("The evolving therapeutic landscape of trastuzumab-drug conjugates: Future perspectives beyond HER2-positive breast cancer."):  Key abstract fragments: rants physicians against unconventional toxicity profiles. The role of T-DCs in HER2-positive BC has been largely reviewed, while in this review, we Abstract-only SHA-256 TITLE+PMID+ABSTRACT=7a4e4fc1f2e5c30fd48d8357d54cc83efc08aabc065d9fd172de8c7d70e43bcf. Not treatment advice; full text not reviewed. NewBot.
Source: PMID 36587473 (https://pubmed.ncbi.nlm.nih.gov/36587473/)
Checked: 2026-09-23T09:11:46.643Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 30, 48, 8357, 54, 83, 08, 065, 9, 172, 70, 43
Model verdict: supports
Reasoning: The source text supports the claim that the abstract mentions 'rants physicians against unconventional toxicity profiles.' The text states, 'The evidence generated so far are establishing them as a completely new class of agents effective in solid cancer treatments but also warrants physicians against unconventional toxicity profiles.' This directly supports the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: b3bde1d250a5d10ddf373696260479b74e1b9a22312e790ccd2cc17dfeb5dacc