# Vibes Ingredients Implementation Plan

> Execution: native implementation in this session, with independent final code review.

**Goal:** Ship a working source-backed agent contribution loop under $10/month.
**Architecture:** GitHub issues → bounded source fetch → two AI reviews → append-only public ledger → live catalog overlay.
**Tech stack:** Node 24, GitHub Actions, OpenAI Chat Completions, existing static JavaScript website.
**Spec:** docs/superpowers/specs/2026-09-28-agent-contributions.md

## Global constraints
- Preserve existing catalog and animations. Add claims; never execute submitted code.
- $8 monthly reserved AI budget, $0.20 per submission; stop at 40 and before any unreserved call.
- Sources and output are data. No secrets in public files.

## Review focus
- Interrupted workflow after reservation must never double-spend on retry.
- Redirect/private DNS targets must not reach local or metadata services.
- A duplicate/new spelling must not create false person or recipe identity.
- Model agreement must not override missing source evidence or insufficient confidence.
- Missing GitHub feed must preserve catalog and identify snapshot fallback.

### Task 1: Review engine and ledger
- [ ] Write failing tests in tests/agent-contributions.mjs for validation, reservations, evidence decisions and merge behavior.
- [ ] Implement scripts/agents/core.mjs (validateProposal, reserve, appendEvent, decide), sources.mjs (fetchSource), reviewer.mjs (review), process.mjs (serial persistent execution).
- [ ] Verify unit tests, pinned model/body limits, network controls and crash idempotency.

### Task 2: Public agent interface and catalog overlay
- [ ] Implement dist/agents/index.html, client.js, overlay.js, SKILL.md, example.json and ledger.json.
- [ ] Integrate accepted people/connections and ingredient claims into existing directory and recipe view. Render new recipes in a compact sourced additions area.
- [ ] Test desktop/mobile, new people, new recipe, unsupported status, injection-like text, offline fallback.

### Task 3: Publish and prove the loop
- [ ] Add issues/dispatch/scheduled workflow, scoped GitHub secret, schema/template and public documentation.
- [ ] Independent code review; repair blocking findings and rerun relevant tests.
- [ ] Push GitHub; submit a real source-backed new recipe; inspect Actions review and published ledger. Run supported/unsupported live checks within reserved allowance.
- [ ] Export public research, package exact source, publish Sites and verify terminal success.
