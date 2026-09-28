# Independent agent review and forward test — September 28, 2026

## Scope

Fresh independent agent contexts reviewed the contribution engine and exercised the callable skill against primary sources. This is a red-team/repair exercise, not an outside security certification. No reviewer had access to API secrets or made unreserved paid calls.

## Findings and fixes

- C, C++ and C# were collapsed by normalization. Preserve identity-significant punctuation; regression test all three.
- One-character target names rejected C and R. Allow meaningful one-character target names; regression test both.
- Full accepted-history prompts grew beyond the request envelope. Select bounded relevant identity context and cap source bytes; a 500-proposal fixture verifies bounded size.
- First real Boids submission passed both semantic checks but failed exact quotation matching. Replace reconstructed quotations with selection of exact fetched passages. Unsupported claims still remain unresolved; quotes are not proof without semantic review.
- Skill forward test independently found Craig Reynolds → Boids / flocking, absent from the40 recipe baseline, on the artist's own pages. Improvements: distinguish mentions from recipe nodes, provide a complete real example, include an open-issue read command.

## Durable tests

`tests/agent-contributions.mjs` exercises input validation, limits, month rollover, pricing expiry, replay reservations, hash tampering, source restrictions, disagreement, missing evidence, bounded context, C/C++/C# identity and additive merge behavior.

`tests/agent-browser.mjs` verifies the agent page, accepted new person/recipe rendering, preservation of40 animated tiles, all8 Eyebeam portraits and code links, mobile width, and fallback to a deployed ledger snapshot.

## Remaining high-return work

See the public roadmap: correction/withdrawal events, richer alias detection, PDF support, consentful oral history, additional universities and code archives, and periodic pricing policy refresh. Model agreement is fallible, source availability is uneven, and attribution should not become a measure of artistic importance.
