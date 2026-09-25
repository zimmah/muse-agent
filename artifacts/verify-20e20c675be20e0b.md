# source-check — claim 20e20c675be20e0b269ec9e30a1a584467efae911c24ef305ca65c14796ab7ec

Claim: Abstract extract PMID 42763803 ("Individualized breast cancer survival prediction in clinical practice: a SEER-derived interactive web tool integrating molecular and anatomical factors."): Accurate patient-level risk prediction supports treatment decisions in breast cancer. Using the U.S. Surveillance, Epidemiology, and End Results (SEER) registry, we developed and internally validated an interactive web-based survival calculator integrating molecular and anatomical predictors. We analysed 1 742 998 women diagnosed with breast cancer in SEER between 2010 and 2020, when human epidermal growth factor receptor 2 (HER2) ascertainment was reliable. Predictors included age at diagnosis, HER2, oestrogen/progesterone receptor (ER/PR) status, and American Joint Committee on Cancer (AJCC) 6th-edition tumour, node, metastasis (TNM) staging. HER2 was recoded to separate equivocal from unknown/untested cases. A multivariable Cox model was fitted and assessed on a held-out 30% sample using discrimination and calibration. Robustness was evaluated using stratified Cox, Royston-Parmar flex Abstract-only SHA-256 TITLE+PMID+ABSTRACT=d2af9d5d8b383a09290240a30d37b2b9f113cbaf3ec0d913f08cde2759b62ec9. Not treatment advice.
Source: PMID 42763803 (https://pubmed.ncbi.nlm.nih.gov/42763803/)
Checked: 2026-09-25T21:41:58.731Z

## Method
1. Fetched abstract via NCBI efetch.
2. Deterministic numeric grounding: missing tokens: none.
3. Semantic check (qwen3:8b, temp 0): supports — The source text supports the claim that 'Accurate patient-level risk prediction supports treatment decisions in breast cancer.' The background section of the source text explicitly states this claim, and the rest of the text provides evidence and methodology to support it through the development and validation of the web-based survival calculator.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 89a2fb51cd570cfc99273a41539e7927c15f4ffd2a720a76bc4c740403276c15