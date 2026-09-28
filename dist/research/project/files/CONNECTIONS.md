# Rebuilding the connections index

Run `node scripts/build-connections.mjs` after editing the catalog or `research/checked-relationships.json`. This regenerates the public `dist/connections/data.json` and public editorial `research/connections-coverage.json` deterministically. Run `node tests/connections.mjs` to validate.

Each record preserves a person, target, relationship kind, exact role, date text (null when unknown), source URL, source label, checked date and review status. People are joined by exact catalog names; there is no fuzzy name merging. Generated ID collisions and dangling references fail validation. Existing recipe claims remain `imported`, not newly source-checked. Add checked claims only after reading a supporting source. A source loading successfully is not factual verification.

The coverage file automatically lists people lacking checked institutional relationships and people awaiting recipe placement. It is an editorial queue, not a claim that these people lack affiliations. Institutions, tools and publications are separate targets; future evidence can add more than one source record per relationship. Existing animated-study paths are preserved.

Current UI: visible relationship sentences with internal entity/person/recipe links and adjacent source links in artist cards, the Person step, and contributor cards. The searchable directory shows all records without dropdowns. Shared-target overlap counts deduplicate people; research-gap links open exact queues for missing checked affiliations, pending recipe placement and imported records awaiting recheck. These are coverage gaps, not claims about the full art world. Stable node IDs drive links and backlinks. No external archive synchronization or recurring background job is configured. Rhizome, Franklin Furnace, Ars Electronica and ISEA remain source-specific research tasks.

Browser checks: set TEST_URL to a local static server and PLAYWRIGHT_PATH to installed Playwright, then run `node tests/connections-browser.mjs`. Existing regression checks: `tests/technique-labels.mjs`, `tests/ingredients-presentation.mjs`.

The language/tool layer is maintained in `research/language-tools.json`, with its evidence rubric in `research/LANGUAGES.md`. Its inferred and tentative records are never promoted to checked by the generator. Languages and frameworks share the stable node-link system while preserving category, work context and confidence.

Recipe contributors can now carry `review: "checked"` with a checked date after source inspection; absent review metadata remains imported. Actual recipe membership determines the generated “In Ingredients” placement. `tests/ingredients-expansion.mjs` ensures the original 108 records remain intact while the five new contributors have checked recipe and Eyebeam links.

## Lean connection improvements · September 28, 2026

Ingredients search now matches checked tool/institution links belonging to credited contributors. It does not infer which language implements a recipe or that an institution sponsored it. Inferred links do not enter this search. Without connection data, ordinary person/recipe search still works.

“View recipe” links open the exact existing animated recipe and its provenance overlay. The current recipe's repeated credit is omitted from each embedded connection list; the original contribution and source above it remain visible. Other recipe credits remain available. Imported credits now have a visible source-recheck label. Documented overlaps require checked records at both ends and deduplicate people across multiple roles; imported credits remain available separately but do not inflate those overlaps.

The Ingredients page shares one connection-data promise for overlays, search and the Eyebeam overview. A small in-memory graph index reuses node and relationship lookups. No dependency, service, dashboard or new media payload is added. Unit and browser regressions cover evidence filtering, duplicate residency counts, exact recipe navigation, one graph request, mobile layout and unavailable-data fallback.

## People-section expansion · September 28, 2026

Lauren Lee McCarthy, Tega Brain and Gene Kogan now join the left-hand People contact sheet, bringing it to 21 entries. Their existing Ingredients photographs, biographies, source records and checked recipe links are reused. Each has a lightweight original JavaScript study (layered noise, rotating line-grid moiré, and nested deltoid curves respectively), explicitly distinguished from the artist’s own work. Birth dates are left blank instead of guessed. Golan Levin and Zach Lieberman were already present. The 105 recipe contributors and 120-person broader directory do not increase from this presentation change.
