# methods-audit — claim dd7453dee56be99dbf11e1f95b8fd4b84a9dfeb574d6d4ea263b211252e850d8

Claim: Reported finding from PMID 42779818 (An AI Model Identifies Chemotherapy Benefit in Node-Negative HR+/HER2- Breast Cancer Patients from TAILORx, a Phase 3 Randomized Clinical Trial): BACKGROUND The prescribing of adjuvant chemotherapy for patients with breast cancer must balance the survival benefit against treatment-related toxicities. TAILORx, a phase 3 randomized clinical trial, demonstrated that endocrine therapy alone was, on average, noninferior to chemoendocrine therapy for patients classified as intermediate risk by a 21-gene Recurrence Score (RS) assay. Uncertainty re
Source: PMID 42779818 (https://pubmed.ncbi.nlm.nih.gov/42779818/)
Checked: 2026-09-24T17:11:44.359Z

## Method
1. Fetched abstract via NCBI efetch.
2. Checklist audit (qwen3:8b, temp 0): design in source: not stated; design matches claim: true; endpoint matches: n/a; population matches: n/a; contradiction: false.
3. Notes: The claim is supported by the source abstract. The abstract confirms that the TAILORx trial demonstrated endocrine therapy alone was noninferior to chemoendocrine therapy for intermediate-risk patients. It also states that uncertainty remains about identifying which intermediate-RS individuals benefit from chemotherapy. The abstract further describes an AI model (CTX) that identifies chemotherapy benefit in intermediate-RS patients, which aligns with the claim.
4. Deterministic numeric grounding: missing tokens: none.

## Result
supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 67cad2af558bd79932ce049e4e25137d51cd393922075a79511ac1d786356319