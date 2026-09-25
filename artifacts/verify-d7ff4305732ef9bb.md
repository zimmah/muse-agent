# source-check — claim d7ff4305732ef9bba26b7158f32e94c230b833b83654e514fff43847d81b4006

Claim: Abstract extract PMID 42739283 ("Pretreatment MRI and Ultrasound Features of the Primary Tumor and Axillary Nodes for Predicting Axillary Pathologic Complete Response After Neoadjuvant Chemotherapy: A Cross-Anatomic Comparison."):  Key fragments: enter study included 243 patients from three centers: 146 in the training cohort, 59 in the internal validation cohort, and 38 in the external | based on BI-RADS 2025. Least absolute shrinkage and selection operator regression and logistic regression were used to develop imaging-only, | , AUCs were 0.928, 0.804, and 0.700 for HR-positive/HER2-negative, HER2-positive, and triple-negative tumors, and 0.898 and 0.880 for cN1 and Abstract-only SHA-256 TITLE+PMID+ABSTRACT=5f640ca5a18eb99e5c2b267a71cd54f5b046d6c1465fcd86db773fc8552f63c6. Not treatment advice.
Source: PMID 42739283 (https://pubmed.ncbi.nlm.nih.gov/42739283/)
Checked: 2026-09-25T03:41:38.841Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim. The text mentions that the study included 243 patients from three centers, with 146 in the training cohort, 59 in the internal validation cohort, and 38 in the external validation cohort. It also states that AUCs were 0.928, 0.804, and 0.700 for HR-positive/HER2-negative, HER2-positive, and triple-negative tumors, and 0.898 and 0.880 for cN1 and cN2-3 disease, respectively. These details align with the key fragments in the claim.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 8da45ec4e9d315120c0032f927abffe9bf5405c96e3fd8fd18ddc12cdc5d8f80