# Rebuilding the connections index

Run `node scripts/build-connections.mjs` after editing the catalog or `research/checked-relationships.json`. This regenerates the public `dist/connections/data.json` and private editorial `research/connections-coverage.json` deterministically. Run `node tests/connections.mjs` to validate.

Each record preserves a person, target, relationship kind, exact role, date text (null when unknown), source URL, source label, checked date and review status. People are joined by exact catalog names; there is no fuzzy name merging. Generated ID collisions and dangling references fail validation. Existing recipe claims remain `imported`, not newly source-checked. Add checked claims only after reading a supporting source. A source loading successfully is not factual verification.

The coverage file automatically lists people lacking checked institutional relationships and people awaiting recipe placement. It is an editorial queue, not a claim that these people lack affiliations. Institutions, tools and publications are separate targets; future evidence can add more than one source record per relationship. Existing animated-study paths are preserved.

Current UI: visible relationship sentences with internal entity/person/recipe links and adjacent source links in artist cards, the Person step, and contributor cards. The searchable directory shows all records without dropdowns. Shared-target overlap counts deduplicate people; research-gap links open exact queues for missing checked affiliations, pending recipe placement and imported records awaiting recheck. These are coverage gaps, not claims about the full art world. Stable node IDs drive links and backlinks. No external archive synchronization or recurring background job is configured. Rhizome, Franklin Furnace, Ars Electronica and ISEA remain source-specific research tasks.

Browser checks: set TEST_URL to a local static server and PLAYWRIGHT_PATH to installed Playwright, then run `node tests/connections-browser.mjs`. Existing regression checks: `tests/technique-labels.mjs`, `tests/ingredients-presentation.mjs`.

The language/tool layer is maintained in `research/language-tools.json`, with its evidence rubric in `research/LANGUAGES.md`. Its inferred and tentative records are never promoted to checked by the generator. Languages and frameworks share the stable node-link system while preserving category, work context and confidence.
