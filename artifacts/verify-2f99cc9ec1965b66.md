# Source check — claim 2f99cc9ec1965b667a0563b21615770316afc58e67c2c3439157ea208d704655

Claim: Abstract extract PMID 38233810 ("Neoadjuvant trastuzumab deruxtecan (T-DXd) with response-directed definitive therapy in early stage HER2-positive breast cancer: a phase II study protocol (SHAMROCK study)."):  Key fragments: cancer. To improve treatment-associated toxicity, chemotherapy-sparing approaches are currently being investigated. Trastuzumab deruxtecan (T-DXd) i | e a high pCR rate and be associated low toxicity in early stage HER2-positive breast cancer. EudraCT Number: 2022-002485-32; ClinicalTrials.gov iden Abstract-only SHA-256 TITLE+PMID+ABSTRACT=da9867672c4cda8b40f4a2748df37a7dbd16aa13c38dbd42c760cd967382e1ed. Not treatment advice.
Source: PMID 38233810 (https://pubmed.ncbi.nlm.nih.gov/38233810/)
Checked: 2026-09-23T07:41:36.224Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 9867672, 40, 2748, 37, 16, 13, 42, 760, 967382
Model verdict: supports
Reasoning: The source text supports the claim that 'Trastuzumab deruxtecan (T-DXd) is expected to have a high pCR rate and be associated with low toxicity in early stage HER2-positive breast cancer.' This is explicitly stated in the DISCUSSION section of the source text, which hypothesizes that neoadjuvant T-DXd will have a high pCR rate and be associated with low toxicity in early stage HER2-positive breast cancer.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: dd12f06a16f02ae7d96315f906c533aba2b7b9a33a1c2dec17c77b1578d17fcd