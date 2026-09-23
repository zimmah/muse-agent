# Source check — claim 177bce9394bc5fb91ee04827bfa526198c4b329eb25f28628a9fb20babce8ec3

Claim: Abstract extract PMID 25285786 ("Strategies to overcome trastuzumab resistance in HER2-overexpressing breast cancers: focus on new data from clinical trials."):  Key fragments: ith early and metastatic breast cancer. Resistance to trastuzumab involves the phosphoinositide 3-kinase/mammalian target of rapamycin (PI3K/mTOR) pat | ajor advances in strategies to overcome resistance to trastuzumab. This includes the development of antibody-drug conjugates, dual HER2 inhibition str Abstract-only SHA-256 TITLE+PMID+ABSTRACT=96f935cab527c5f5dd57cd8cc163fdbadd64e1049b0756905817e79e8a9b65f1. Not treatment advice.
Source: PMID 25285786 (https://pubmed.ncbi.nlm.nih.gov/25285786/)
Checked: 2026-09-23T01:41:43.960Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 96, 935, 527, 163, 64, 1049, 0756905817, 79, 65
Model verdict: supports
Reasoning: The source text directly supports the claim. It mentions that resistance to trastuzumab involves the phosphoinositide 3-kinase/mammalian target of rapamycin (PI3K/mTOR) pathway, and it discusses major advances in strategies to overcome resistance, including the development of antibody-drug conjugates, dual HER2 inhibition strategies, inhibition of the PI3K/mTOR pathway, and development of modulators of immune checkpoints. These details align with the key fragments provided in the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 36b69938fdcca7f24503142007073a69eaca62962030b4672b20d2af9ed79a2b