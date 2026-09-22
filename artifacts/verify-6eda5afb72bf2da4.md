# Source check — claim 6eda5afb72bf2da424d4ada04783839bfb067c310283d083bc7ea658a4cb2aa2

Claim: Abstract extract PMID 32996066 ("Trastuzumab Emtansine: A Review of Its Adjuvant Use in Residual Invasive HER2-Positive Early Breast Cancer."):  Key fragments: HER2-positive early BC in patients with residual invasive disease in the breast and/or lymph nodes after neoadjuvant taxane-based and HER2-targeted Abstract-only SHA-256 TITLE+PMID+ABSTRACT=38d917e1b2903a18bb3718f3eb349de256c2f3e3168d5307d45770c2c1c02f9b. Not treatment advice.
Source: PMID 32996066 (https://pubmed.ncbi.nlm.nih.gov/32996066/)
Checked: 2026-09-22T21:11:45.425Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 38, 917, 2903, 3718, 349, 256, 3168, 5307, 45770
Model verdict: supports
Reasoning: The source text explicitly states that trastuzumab emtansine is approved for single-agent adjuvant treatment of HER2-positive early breast cancer in patients with residual invasive disease in the breast and/or lymph nodes after neoadjuvant taxane-based and HER2-targeted treatment. This directly supports the claim in the abstract fragment.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 1dc1c257c911f19306154d37fe105f678fa5d2123e1ea59e053244a04953cdd3