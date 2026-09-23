# Source check — claim 6a2abc656262a7acfbdd333404ad9fc2b658507a57092c5231beb289328907ad

Claim: Abstract extract PMID 42627360 ("Clinical management of adverse events in patients with human epidermal growth factor receptor 2-positive metastatic breast cancer treated with tucatinib, trastuzumab, and capecitabine."):  Key fragments: pecitabine (TTC) significantly improved progression-free survival and overall survival compared with the placebo combination with a manageable safety profil | zyme elevations, and palmar-plantar erythrodysesthesia. This article aims to describe the clinical presentation of AEs most frequently requiri Abstract-only SHA-256 TITLE+PMID+ABSTRACT=59b3d237c03acc8194eb12362772c2d46d87a8d227a0a4d4a1a2c53beaaee5bd. Not treatment advice.
Source: PMID 42627360 (https://pubmed.ncbi.nlm.nih.gov/42627360/)
Checked: 2026-09-23T14:41:48.603Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 59, 237, 03, 8194, 12362772, 46, 87, 227
Model verdict: supports
Reasoning: The source text supports the claim. It states that 'tucatinib in combination with trastuzumab and capecitabine (TTC) significantly improved progression-free survival and overall survival compared with the placebo combination with a manageable safety profile' and mentions 'the most common being diarrhea, liver enzyme elevations, and palmar-plantar erythrodysesthesia.' These statements align with the key fragments provided in the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 58df81a2b101d19793be46b16ecb85caba2fe2d5d96375d639d9f2e23137eaba