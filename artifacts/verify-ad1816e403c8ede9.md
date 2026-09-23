# Source check — claim ad1816e403c8ede989a2744eabe4cef9356bbf4d6db388870859864720941b1f

Claim: Abstract extract PMID 29844123 ("Combined c-Met/Trk Inhibition Overcomes Resistance to CDK4/6 Inhibitors in Glioblastoma."):  Key fragments: novel mechanism involved in therapeutic resistance of GBM to CDK4/6 inhibition and that dual inhibition of c-Met/Trk with CDK4/6 should be considered Abstract-only SHA-256 TITLE+PMID+ABSTRACT=ee1c9b4061e51dcbe0ab1dcccf9f321d3cfba99403a710ae9f6475fb134a60f6. Not treatment advice.
Source: PMID 29844123 (https://pubmed.ncbi.nlm.nih.gov/29844123/)
Checked: 2026-09-23T06:11:33.403Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 4061, 51, 321, 99403, 710, 6475, 134
Model verdict: supports
Reasoning: The source text explicitly states that the activation of c-Met/TrkA-B pathways is a novel mechanism involved in therapeutic resistance of GBM to CDK4/6 inhibition. It also mentions that dual inhibition of c-Met/Trk with CDK4/6 should be considered in future clinical trials, which directly supports the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 21efce6bb7d086bd51fc5b24edb216f3e884c609087b3aac4873aafd268e384a