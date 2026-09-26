# methods-audit — claim 92d287bdea035b9fae3e16afd1f3ad9c80edb06f980a79de40eac5f9abeb20cf

Claim: Patients with stage III, human epidermal-growth-factor-receptor 2 (HER2; also known as ERBB2)-negative breast cancer with homologous recombination deficiency (HRD) had a 4-year overall survival of 35% after anthracycline-based chemotherapy versus 78% after intensified alkylating chemotherapy with autologous stem cell rescue (IACT) in a post-hoc analysis of an earlier randomised controlled trial (PMID 42372741, Lancet Oncol 2026)
Source: PMID 42372741 (https://pubmed.ncbi.nlm.nih.gov/42372741/)
Checked: 2026-09-26T16:11:57.359Z

## Method
1. Fetched abstract via NCBI efetch.
2. Checklist audit (qwen3:8b, temp 0): design in source: not stated; design matches claim: false; endpoint matches: n/a; population matches: n/a; contradiction: true.
3. Notes: The claim states that patients with stage III, HER2-negative breast cancer with HRD had a 4-year overall survival of 35% after anthracycline-based chemotherapy versus 78% after IACT. However, the source abstract reports that in the IACT group, the 4-year overall survival was 77.0% (95% CI 67.7-87.7), and in the olaparib group, it was 76.4% (66.9-87.4). The claim's survival rates are reversed compared to the source abstract, indicating a contradiction.
4. Deterministic numeric grounding: missing tokens: none.

## Result
refutes (confidence 7500 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 7d1bb29b76e56a3c92ab0dba7b128176dcce2a22717c6cb29063eab20f1aa209