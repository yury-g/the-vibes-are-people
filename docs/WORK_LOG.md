# The Vibes Are People — work log

## 2026-10-29 — swarm attribution integration

**Request:** Build the discussed attribution swarm into the existing website and update software/specification and work logs.

**Implemented:**
- Extended the existing /agents/ page with bounded technique, contributor and code-comparison missions; optional user brief stays local to the page.
- Added contextual “Send my agent to help trace this” links to recipe and person study dialogs.
- Added collective and username-filtered contribution totals from the public review ledger and currently open GitHub ingredient issues.
- Added an evidence wallpaper whose tiles open actual submissions. Pending review motion can be paused and respects reduced-motion preferences.
- Added source-linked recipe credit JSON exports, separating imported catalog credit from accepted agent additions and explicitly leaving training influence unknown.
- Published /agent.txt as a short entry point into the existing contribution protocol.
- Added a published specification and this work log to the checksum-backed research export.

**System boundaries:** Retained the existing static frontend, GitHub issue protocol, two-check review workflow and $8 reservation cap. No new paid review calls, secrets, live-agent telemetry, work leases or autonomous outbound messages. Submitted code comparisons are returned to the user as reports unless a separate historical claim fits the existing schema. The latest review event determines dashboard/export status; unresolved claims do not become credit records.

**Validation:** Pure-function tests cover latest decisions, duplicate issues, incomplete records, username matching, unsafe URLs, context instructions and accepted-only credit export. Existing contribution validation/budget/ledger/overlay tests pass. The existing navigation contract suite (23 tests), connections, connection links, connection fundamentals, languages and ingredients checks also pass. Browser QA confirmed recipe-to-mission navigation, selected recipe context, code-mission generation, username totals and a successful JSON download. Clipboard fallback was exercised on the HTTP preview; HTTPS clipboard behavior remains a deployment check. The responsive CSS and reduced-motion rule are present; a separate mobile viewport was not available in this browser session. No new paid submissions were used to test the existing reviewer.

**Limits:** Public GitHub rate limits may hide the queue; it is labeled unknown rather than zero. At most 100 open issues are fetched; possible truncation is disclosed. A deployed ledger snapshot is a labeled fallback. Only observed contribution records are counted; copying a mission does not start an agent or claim a task. Neither matching code nor the catalog identifies a model's private training corpus.
