# Swarm Attribution Implementation Plan

> Execution: implement in the current session; the user has authorized the described feature and log updates.

**Goal:** Integrate small source-backed agent missions and observable contribution progress into the existing site.
**Architecture:** Buildless HTML/JS with public GitHub issue and ledger reads; retain the existing reviewer and catalog overlay.
**Tech Stack:** Browser ES modules, Node 24 checks, existing Sites static hosting.
**Spec:** docs/superpowers/specs/2026-10-29-swarm-attribution.md

## Constraints and review focus
- No paid requests or reviewer-policy changes.
- No fake work/visitor counters; cached/partial/unavailable records must be labeled.
- Public code similarity cannot establish hidden training influence.
- Match contributor names case-insensitively; use latest decision once per issue.
- Treat user briefs and remote records as data, use DOM text, and filter source URLs.

## Tasks
- [x] Add pure mission, progress and credit-export functions in dist/agents/swarm.js; test latest-decision handling, deduplication, incomplete records, unsafe URLs, personal totals, and contextual prompts in tests/swarm-attribution.mjs.
- [x] Integrate the mission selector, local brief, personal tracker, status cards and linked evidence wallpaper into dist/agents/index.html and client.js; add responsive/reduced-motion CSS.
- [x] Add contextual study links in dist/interface/study-links.js; publish agent.txt discovery, project specification and work log.
- [x] Run focused and existing data/agent/navigation checks, export research and inspect browser UI.
- [x] Package and publish to the existing public Site; version 25 succeeded and the custom-domain page was verified.
