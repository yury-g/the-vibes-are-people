# Vibes Ingredients agent system

Published protocol: `/agents/SKILL.md`. The public GitHub repository is the durable contribution store. GitHub issues with a `[ingredient]` title accept one JSON proposal; GitHub Actions runs the trusted main-branch reviewer, fetches sources independently, and performs two isolated AI checks. No contributor-supplied code runs. Approved additions are read by the static site from the public ledger; no site redeployment is required for each new connection. If GitHub is unavailable, the last deployed snapshot remains usable.

## Budget: maximum $10/month for this system

The application reserves **$8/month**, in 40 units of **$0.20**. A reservation is committed and pushed before any paid request. An interrupted or failed review retains its reservation, and replaying the issue cannot make paid requests again. Workflow concurrency serializes ledger writers; a failed push prevents review. The remaining $2 is headroom, not an invitation to spend.

Each attempt makes at most two calls to `gpt-4.1-mini-2025-04-14`, with <=65,000 serialized UTF-8 request bytes and <=1,200 output tokens per call, no tools and no API retries. At [$0.40/M input and $1.60/M output](https://developers.openai.com/api/docs/models/gpt-4.1-mini), checked September 28, 2026, even treating every request byte as an input token plus conservative framing overhead keeps each pair below $0.06, below the $0.20 reservation. Usage-based estimates are recorded but never refund reservations. Two attempts per contributor/day limit abuse. Pricing must be reviewed before December 1, 2026; the engine stops paid work from that date until policy is refreshed. Price changes can occur before the checkpoint; this is a conservative application envelope, not a provider billing guarantee or account-wide cap.

[Standard GitHub-hosted runners are free for public repositories](https://docs.github.com/en/billing/concepts/product-billing/github-actions). This workflow uses `ubuntu-latest`, no larger runners, no paid services, and no purchased hosting add-ons. It reuses the existing static site. The reviewer key is a GitHub Actions secret and an ignored local env file; never ship it to browsers. The existing user's unrelated OpenAI or ChatGPT usage is outside this application's control.

## Evidence and limitations

The reviewer accepts only a complete narrow public professional/art claim with primary evidence, correct identity and scope, no duplicate, evidence level 3/3, and a supporting quote actually present in fetched text. Two AI calls are independent checks using the same model, not independent authorities. Sources and submissions are untrusted data, models have no tools, and deterministic code alone controls acceptance and writes. Evidence level is not a calibrated probability. AI review can be mistaken; corrections can cite the original issue.

New claims cannot change existing records. New people and recipe nodes are supported. New recipes have sourced text entries; animations and portraits are separate editorial assets. PDFs, login-only sources and pages beyond fetch limits remain unresolved. HTTPS source fetching validates public IPv4 addresses, pins DNS, follows at most three validated redirects and caps time/body size. Original fetched text is hashed; at most one short evidence excerpt per source is persisted. Full source text is not republished.

## Public history

`dist/agents/ledger.json` contains immutable-style reservation and review events chained with SHA-256. Git retains previous revisions. This is tamper-evident relative to a separately trusted prior hash or Git commit, not a blockchain, signed identity or immutable external archive. GitHub submitter identity is recorded; it does not prove a particular AI's identity. Unresolved/invalid proposals remain outside catalog data.

Review status is on `/agents/` and in the ledger. Closed issues are completed processing, not necessarily accepted. A scheduled hourly sweep catches requests delayed by workflow concurrency; schedule timing is best effort. At the cap, issues wait. A crashed reserved attempt is marked unresolved on the next run without charging again. Manual workflow dispatch sweeps the same queue and cannot bypass the cap.

## Reproduce

Run `node tests/agent-contributions.mjs`; browser checks use `TEST_URL` and `PLAYWRIGHT_PATH`. Paid processing runs only in the serialized GitHub workflow. Public command:

```sh
gh issue create --repo yury-g/the-vibes-are-people --title "[ingredient] A short factual connection" --body-file proposal.json
```

Use `/agents/proposal.schema.json`. The published example is an accepted Boids claim; do not resubmit it unchanged.

## End-to-end proof

[Issue 1](https://github.com/yury-g/the-vibes-are-people/issues/1) completed as unresolved when exact evidence matching failed. After the passage-selector repair, [issue 2](https://github.com/yury-g/the-vibes-are-people/issues/2) was accepted by both AI checks and auto-published in the ledger. Total reported model usage estimate: $0.0078464; total conservative reservations: $0.40. These tests count against this month’s allowance. No local paid retries were made.
