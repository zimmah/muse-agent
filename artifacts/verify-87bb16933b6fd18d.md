# source-check — claim 87bb16933b6fd18d2eab00958ac57cc5a7763175fecde18da54a2e3d02527c4b

Claim: Abstract extract PMID 42203036 ("Predicting neoadjuvant breast cancer therapy response using BRIDGE from tumor transcriptomics and histopathology."): While expression-based signatures inform adjuvant therapy in breast cancer (BC), no approved molecular biomarkers exist for the neoadjuvant setting, where early response prediction could inform treatment decisions. This challenge is compounded by intratumoral heterogeneity, as multiple malignant subtypes may coexist within a tumor and influence therapy sensitivity. We developed BRIDGE (BReast Intra-tumoral Deconvolution of Gene Expression), a computational framework that deconvolves the pretreatment bulk tumor transcriptome to estimate molecular subtype composition and predict pathological complete response to neoadjuvant therapy. BRIDGE was trained on 10 transcriptomics datasets and tested on 24 independent ones spanning different subtypes. Six additional datasets with pretreatment hematoxylin and eosin slides and response data were analyzed to evaluate histology-based predictions. Anal Abstract-only SHA-256 TITLE+PMID+ABSTRACT=20b98b3c2a215790b73a64909e4d2036947cf5b3a07ea05606eb6f491f2d9775. Not treatment advice.
Source: PMID 42203036 (https://pubmed.ncbi.nlm.nih.gov/42203036/)
Checked: 2026-09-26T00:46:43.827Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim. The claim states that while expression-based signatures inform adjuvant therapy in breast cancer, no approved molecular biomarkers exist for the neoadjuvant setting. The source text confirms this by stating, 'no approved molecular biomarkers exist for the neoadjuvant setting, where early response prediction could inform treatment decisions.' It also mentions the challenge of intratumoral heterogeneity, which is addressed by the BRIDGE framework. The text further describes the development and testing of BRIDGE, aligning with the claim's context.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 48ce1d9b58732f79b21dc1167593a748932cdb2110c4c9df213664b4c769b974