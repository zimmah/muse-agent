# Source check — claim 24bb7ca7dcbcf9cd566a23f3d6f8f8832d87b78ca02ba6a00a45b8a713be6272

Claim: Abstract extract PMID 42699083 ("Treatment and survival of de novo HER2-positive metastatic breast cancer across regional cancer networks in the Netherlands: a cohort study."):  Key fragments: l variation in first-line treatment and overall survival (OS) among patients with de novo HER2-positive MBC in the Netherlands in 2013-2023. Data from the N | d borderline longer OS versus region A (hazard ratio 0.77 and 0.77, P = 0.06 and 0.07, respectively). No large regional differences in first-line HER2-t Abstract-only SHA-256 TITLE+PMID+ABSTRACT=298a2193724353ae76a9873f0f4a1a64f88718e2aa457888b0afec0016c192d9. Not treatment advice.
Source: PMID 42699083 (https://pubmed.ncbi.nlm.nih.gov/42699083/)
Checked: 2026-09-23T12:11:40.788Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 298, 2193724353, 76, 9873, 64, 88718, 457888, 0016, 192
Model verdict: supports
Reasoning: The source text supports the claim. The text mentions 'borderline longer OS versus region A (hazard ratio 0.77 and 0.77, P = 0.06 and 0.07, respectively)' which matches the key fragment in the claim. Additionally, it states 'No large regional differences in first-line HER2-t' which aligns with the claim's mention of 'No large regional differences in first-line HER2-t'. The text also discusses variation in first-line treatment and overall survival among patients with de novo HER2-positive MBC in the Netherlands in 2013-2023, which directly supports the claim.
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: d11e251a58355a1e276d5046d93213d6d2f3830c7e0a11cf87854f12999df96e