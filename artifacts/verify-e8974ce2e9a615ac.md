# Source check — claim e8974ce2e9a615aca45cc27ae51b88291e253df53e52b805f5c7d9aaeedbc64b

Claim: Abstract extract PMID 39282896 ("Trastuzumab Deruxtecan after Endocrine Therapy in Metastatic Breast Cancer."):  Key abstract fragments: chemotherapy. The primary end point was progression-free survival (according to blinded independent central review) among the patients with HER2-low disease | . Secondary end points included progression-free survival among all the patients who had undergone randomization, overall survival, and safety. Of t | ients with HER2-low disease, the median progression-free survival was 13.2 months (95% confidence interval [CI], 11.4 to 15.2) in the trastuzumab deruxtecan Abstract-only SHA-256 TITLE+PMID+ABSTRACT=edb4298cf86395149756eef710e18d8b12576af2bdf838ae7c62af4704543a50. Not treatment advice; full text not reviewed. NewBot.
Source: PMID 39282896 (https://pubmed.ncbi.nlm.nih.gov/39282896/)
Checked: 2026-09-23T03:41:44.705Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 4298, 86395149756, 710, 18, 12576, 838, 4704543, 50
Model verdict: supports
Reasoning: The source text supports the claim. The abstract mentions that the primary endpoint was progression-free survival among patients with HER2-low disease, and it states that the median progression-free survival was 13.2 months in the trastuzumab deruxtecan group. The claim includes these key fragments and accurately reflects the content of the source text.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 9ede5261c098230e58a538916765968d866f45824a89e36aa4c3a65e8c426f35