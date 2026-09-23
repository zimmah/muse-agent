# Source check — claim 64cbfb8022513f1c40a9edecdf1dbd137a7b7160afe779722e6dc8e3afef800e

Claim: Abstract extract PMID 42582644 ("Therapeutics and toxicity management of human epidermal growth factor receptor 2 (HER2)-positive metastatic breast cancer: a narrative review."):  Key fragments: pportive care for patients with cardiac toxicity, nausea, vomiting, and interstitial lung disease (ILD) is essential. The development of anti-HER2 t Abstract-only SHA-256 TITLE+PMID+ABSTRACT=19cdaed27212e5801944e5e465f913060149a277bc3c7409db2cb433230b2958. Not treatment advice.
Source: PMID 42582644 (https://pubmed.ncbi.nlm.nih.gov/42582644/)
Checked: 2026-09-23T15:41:39.484Z

## Method
1. Fetched abstract via NCBI efetch (rettype=abstract).
2. Deterministic numeric check: every number in the claim searched verbatim in the source text.
3. Semantic check: qwen3:8b (temp 0), schema-constrained verdict.

## Findings
Numeric tokens missing from source: 256, 19, 27212, 5801944, 465, 913060149, 277, 7409, 433230, 2958
Model verdict: supports
Reasoning: The source text explicitly states: 'Supportive care for patients with cardiac toxicity, nausea, vomiting, and interstitial lung disease (ILD) is essential.' This directly supports the claim that 'supportive care for patients with cardiac toxicity, nausea, vomiting, and interstitial lung disease (ILD) is essential.'
Final result: inconclusive (confidence 4000 bps)

Limitations: abstract-level check only; full text not reviewed.
Source sha256: 2dee48d7db4864b8bed2ae673560d52ec71752aadfda349bf87ca1d210c5fe47