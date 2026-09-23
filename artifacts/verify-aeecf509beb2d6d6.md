# Source check — claim aeecf509beb2d6d6c2c738ea579d86303c41763fbcc1a3bd59149e04cbbc25af

Claim: Reported finding from PMID 35941372 (Trastuzumab deruxtecan in HER2-positive breast cancer with brain metastases: a single-arm, phase 2 trial): Trastuzumab deruxtecan is an antibody-drug conjugate with high extracranial activity in human epidermal growth factor receptor 2 (HER2)-positive metastatic breast cancer. We conducted the prospective, open-label, single-arm, phase 2 TUXEDO-1 trial. We enrolled patients aged ≥18 years with HER2-positive breast cancer and newly diagnosed untreated brain metastases or brain metastases progressing aft
Source: PMID 35941372 (https://pubmed.ncbi.nlm.nih.gov/35941372/)
Checked: 2026-09-23T13:11:34.754Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: none
Model verdict: supports
Reasoning: The source text directly supports the claim. It states that 'Trastuzumab deruxtecan is an antibody-drug conjugate with high extracranial activity in human epidermal growth factor receptor 2 (HER2)-positive metastatic breast cancer' and describes the TUXEDO-1 trial as a single-arm, phase 2 trial. The text also mentions the inclusion of patients with HER2-positive breast cancer and brain metastases, which aligns with the claim.
Final result: supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 66fc33283b0978b43de59dd090bdb1800e87596ad1647a7f943f84a476b94551