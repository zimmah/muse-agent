# Source check — claim d1e822e33532facc1d12e0caa598a89ce76abcba5bd2a72cd51a1e5ece64011b

Claim: Abstract extract PMID 32329582 ("HER3 targeting with an antibody-drug conjugate bypasses resistance to anti-HER2 therapies."):  Key fragments: rties against several models of primary resistance and secondary resistance to common anti-HER2 available therapies, including trastuzumab, lapatinib, | est in mitosis and promoted cell death through mitotic catastrophe. These findings encourage the clinical testing of EV20/MMAF for several ind Abstract-only SHA-256 TITLE+PMID+ABSTRACT=8193035a20fab321e47b1ea0131111f86e72d9c77ed87703ea329c85d69a9a3d. Not treatment advice.
Source: PMID 32329582 (https://pubmed.ncbi.nlm.nih.gov/32329582/)
Checked: 2026-09-22T22:41:34.683Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 8193035, 321, 47, 0131111, 86, 77, 87703, 85, 69
Model verdict: supports
Reasoning: The source text supports the claim that 'HER3 targeting with an antibody-drug conjugate bypasses resistance to anti-HER2 therapies.' The text explicitly states that the anti-HER3 antibody-drug conjugate EV20/MMAF exerted potent anti-tumoral properties against several models of primary and secondary resistance to common anti-HER2 therapies, including trastuzumab, lapatinib, neratinib, and trastuzumab-emtansine. It also mentions that EV20/MMAF caused cell cycle arrest in mitosis and promoted cell death through mitotic catastrophe, which aligns with the key fragments provided in the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 8eddc19381ec8bb2d25b0dd9fc8e575286475390592de84e8032561a12fcb280