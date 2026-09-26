# source-check — claim 4810b51a247aeb9bc6e8f317989689e9a832e416627165143f9b2eb5c48415cb

Claim: Abstract extract PMID 42613278 ("Early Prediction Of Treatment Response To Neoadjuvant Chemotherapy Based On Pre-treatment Ultrasound Radiomics of HER2-positive Breast Cancer Patients by Radiomics-based Model: A Dual-center Retrospective Study."):  Key fragments: omics signature (RS) was first refined through redundancy and dimensionality reduction to mitigate overfitting. The retained features were the | n used to build a Least Absolute Shrinkage and Selection Operator (LASSO) regression model for further feature selection and RS optimiza Abstract-only SHA-256 TITLE+PMID+ABSTRACT=96f1d4e94707d42f663e5b299bffb485dc18421d22d7beac989e4370a9e99050. Not treatment advice.
Source: PMID 42613278 (https://pubmed.ncbi.nlm.nih.gov/42613278/)
Checked: 2026-09-26T09:11:42.025Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim. The text states that the 'radiomics signature (RS) was first refined through redundancy and dimensionality reduction to mitigate overfitting. The retained features were then used to build a Least Absolute Shrinkage and Selection Operator (LASSO) regression model for further feature selection and RS optimization.' This directly supports the claim's key fragments about the refinement of the omics signature and the use of LASSO regression for feature selection and RS optimization.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: b2d5eb382630b5ebade62a885561c0ea356e0c1d0e707ecfe83eba656133201e