# Source check — claim ea6560a435fe41b7c79658ad4f53ebcde5bb97bbaa3eb47373d137cac3ecd3f3

Claim: Abstract extract PMID 35016513 ("What is the best treatment recommendation for HER2+ IBC with residual disease?-a narrative review."):  Key fragments: the high risk setting of patients with residual disease after neoadjuvant therapy. IBC is a rare and very aggressive form of breast cancer. HER2+ i | ological response and hormone receptor (HR) status. Dual HER2 blockade with trastuzumab and pertuzumab combined to neoadjuvant chemotherapy im | ) rate. However, HER+ IBC patients with residual disease at surgery have a high risk of recurrence and death. A comprehensive review was conducted t Abstract-only SHA-256 TITLE+PMID+ABSTRACT=b42a36725620ce0ff88ccdd329094fd06c9ce0205e664deb79d27f1d5dc7e94f. Not treatment advice.
Source: PMID 35016513 (https://pubmed.ncbi.nlm.nih.gov/35016513/)
Checked: 2026-09-22T20:41:58.485Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 42, 36725620, 88, 329094, 06, 0205, 664, 79, 27, 94
Model verdict: supports
Reasoning: The source text supports the claim. The text explicitly mentions that HER2+ IBC patients with residual disease at surgery have a high risk of recurrence and death, which aligns with the claim. Additionally, it discusses the high-risk setting of patients with residual disease after neoadjuvant therapy, as stated in the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: cb5f36dc4d766096abb63a3e29ddc34b5cdc4fcabc0fc0b45b1751ef3c59f5bd