# Source check — claim aad26d06e8bdb2b0d25b9761eb0c30ba217bfc8b2306455691a1bd6d84e61048

Claim: Reported finding from PMID 37827827 ([Internal comorbidities and complications of multiple sclerosis therapy - don't be caught off guard!]): Multiple sclerosis (MS) is a chronic autoimmune disease of the central nervous system, mainly affecting young adults. Factors positively influencing its course include early antiinflammatory treatment and the influencing of other comorbidities. The most common comorbidities occurring in MS patients with a higher frequency than in the general population are neurological, psychiatric, cardiovascular
Source: PMID 37827827 (https://pubmed.ncbi.nlm.nih.gov/37827827/)
Checked: 2026-09-23T10:41:41.083Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: none
Model verdict: supports
Reasoning: The source text explicitly states that the most common comorbidities in MS patients, occurring with higher frequency than in the general population, include neurological, psychiatric, cardiovascular, metabolic, and autoimmune comorbidities. This directly supports the claim that the most common comorbidities are neurological, psychiatric, and cardiovascular.
Final result: supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: f1da4e5fe31acb36884c00e6f1015ea05d609aa61017c7757f8cc18265d60196