# Source check — claim 60da68ce666cf481c333e81c56cefcde0d198169e5a36a2ddc3ef1d69b4436bf

Claim: Reported finding from PMID 23046488 (Fastbreak: a tool for analysis and visualization of structural variations in genomic data): Genomic studies are now being undertaken on thousands of samples requiring new computational tools that can rapidly analyze data to identify clinically important features. Inferring structural variations in cancer genomes from mate-paired reads is a combinatorially difficult problem. We introduce Fastbreak, a fast and scalable toolkit that enables the analysis and visualization of large amounts of
Source: PMID 23046488 (https://pubmed.ncbi.nlm.nih.gov/23046488/)
Checked: 2026-09-23T14:11:42.970Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: none
Model verdict: supports
Reasoning: The source text directly supports the claim by stating: 'Genomic studies are now being undertaken on thousands of samples requiring new computational tools that can rapidly analyze data to identify clinically important features.' It also mentions that 'Inferring structural variations in cancer genomes from mate-paired reads is a combinatorially difficult problem,' which aligns with the claim. Additionally, the text introduces Fastbreak as a tool for analysis and visualization of structural variations, supporting the claim about the need for new computational tools.
Final result: supports (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 5e9794314834ff715a5a8031e442b1ce70c5637f9d3e997e5bc34415dc634806