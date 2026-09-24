# source-check — claim c19bd6fc966909b42e25ac6f09722828d0e68e01851d2fae437137fc923042ce

Claim: Abstract extract PMID 42739512 ("Saliency-Curated Deep Learning for Predicting Receptor Status in Breast Cancer Brain Metastases."):  Key fragments: e analyzed. We developed a mask-free 3D Residual Neural Network (ResNet) ensemble trained directly on cropped, bias-corrected brain images, with com | d only four HER2-negative patients, so threshold-dependent HER2 metrics are strongly prevalence-driven and AUROC is the more appropriate summa Abstract-only SHA-256 TITLE+PMID+ABSTRACT=1eb2df20890bf799b74bd8b515f7bfa0f571b5ca7d6c3818ef1688954b01fcbe. Not treatment advice.
Source: PMID 42739512 (https://pubmed.ncbi.nlm.nih.gov/42739512/)
Checked: 2026-09-24T02:41:57.578Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim that 'the held-out cohort contained only four HER2-negative patients, so threshold-dependent HER2 metrics are strongly prevalence-driven and AUROC is the more appropriate summary.' This is explicitly stated in the source text in the results section.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: a538456e5100c7173fafab856de6ad3ff4a35e87b6c25decfef45aa9d6c20a3d