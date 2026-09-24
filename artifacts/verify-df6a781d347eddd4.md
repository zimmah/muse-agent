# source-check — claim df6a781d347eddd46439f3510f19ed8453c27d5b37e34abef6b73fa9e1b8c50f

Claim: Abstract extract PMID 42738394 ("Radiologic Axillary Response After Neoadjuvant Chemotherapy in cN2 Breast Cancer: Decision Support for Selective Axillary De-Escalation."):  Key fragments: olecular subtype, ranging from 20.5% in HR+/HER2- disease to 72.2% in triple-negative disease (p < 0.001). No ipsilateral axillary recurrence Abstract-only SHA-256 TITLE+PMID+ABSTRACT=87cc0f9210ad966f80434c5cf72e1d70e6d1d226221fd1b1ff49fdde26cce117. Not treatment advice.
Source: PMID 42738394 (https://pubmed.ncbi.nlm.nih.gov/42738394/)
Checked: 2026-09-24T02:41:52.415Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim. The key fragment 'Axillary pCR rates varied by molecular subtype, ranging from 20.5% in HR+/HER2- disease to 72.2% in triple-negative disease (p < 0.001). No ipsilateral axillary recurrence' is directly mentioned in the source text, confirming the claim.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: ae527d4a35f1f1446f5ec48ecdf6a26f3b2ff5aa45ddf89e3f94dec763dcaebd