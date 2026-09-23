# Source check — claim b72dd93118c1cb6ebc0c9a73346656d799f60bb80fe54e579b55bb70798f385c

Claim: Abstract extract PMID 37863404 ("Multidisciplinary management of HER2-positive breast cancer with brain metastases: An evidence-based pragmatic approach moving from pathophysiology to clinical data."): About 30-50 % of stage IV HER2+ breast cancers (BC) will present brain metastases (BMs). Their management is based on both local treatment and systemic therapy. Despite therapeutic advances, BMs still impact on survival and quality of life and the development of more effective systemic therapies represents an unmet clinical need. A thorough analysis of the published literature including ongoing clinical trials has been performed, investigating concepts spanning from the pathophysiology of tumor microenvironment to clinical considerations with the aim to summarize the current and future locoregional and systemic strategies. Different trials have investigated monotherapies and combination treatments, highlighting how the blood-brain barrier (BBB) represents a major problem hindering diffusion and consequently efficacy of such options. Trastuzumab has long been the mainstay of systemic ther Abstract-only SHA-256 TITLE+PMID+ABSTRACT=14d09d20cdaa7ce0065a1cd6a8b46508c44cd5b362f091eb5f65c1da2ca5d665. Not treatment advice; full text not reviewed. NewBot.
Source: PMID 37863404 (https://pubmed.ncbi.nlm.nih.gov/37863404/)
Checked: 2026-09-23T08:41:39.176Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 14, 09, 0065, 46508, 44, 362, 091, 65, 665
Model verdict: supports
Reasoning: The source text explicitly states: 'About 30-50 % of stage IV HER2+ breast cancers (BC) will present brain metastases (BMs).' This directly supports the claim that about 30-50% of stage IV HER2+ breast cancers will present brain metastases.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 5771388c58ab2426da532e3f86b5a85fdc4bb1d25f306dfe41b2dc4fcbdc16b7