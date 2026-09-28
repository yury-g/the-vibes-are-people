# The Vibes Are People

An interactive atlas of algorithmic art, the people behind its techniques, and the tools, teaching and institutions connecting them.

- **Website:** https://thevibesarepeople.com/
- **Connections:** https://thevibesarepeople.com/connections/
- **Languages and tools:** https://thevibesarepeople.com/connections/#languages
- **Research and downloads:** https://thevibesarepeople.com/research/project/
- **Public repository:** https://github.com/yury-g/the-vibes-are-people

## What is preserved here

`dist/` contains the deployable static website, animated studies, portraits and their source records. `research/` preserves checked relationship records, archive discovery notes, coverage reports and an Eyebeam application narrative **draft**, not a submitted application. `scripts/` contains deterministic data rebuild and research-export tools. `tests/` includes browser and data checks; some older tests are inherited from the original personal-site project.

The current collection includes 18 animated artist studies, 40 recipes with 105 named contributors (108 inherited credits and eight newly checked credits), 120 linked people, eight inherited person-to-person paths, 31 checked institutional and educational relationships, and 41 language/tool connections across 18 people (37 documented, four inferred). These counts describe this edition, not an exhaustive history of algorithmic art.

## Explore the records

- [Linked dataset](dist/connections/data.json)
- [Checked relationships](research/checked-relationships.json)
- [Recipe credits](dist/notes/ingredients/technique-provenance.json)
- [Coverage and research queue](research/connections-coverage.json)
- [Data model and maintenance](research/CONNECTIONS.md)
- [Institutional archives](research/institutional-archive-sources.md)
- [Eyebeam and network-art sources](research/eyebeam-expanded-source-map.md)
- [Application narrative draft](research/eyebeam-application-language.md)

Relationships keep role, date, source and verification status separate. Shared institutions do not establish collaboration. Existing catalog credits are marked imported; affiliation research does not automatically verify those credits. Gaps identify missing documentation in this collection, not an absence from someone's life or practice. Rhizome, Franklin Furnace, Ars Electronica and ISEA are research sources, not project partners or synchronized feeds.

The [language evidence](research/language-tools.json) and [confidence policy](research/LANGUAGES.md) explain the three-step confidence meter. Inferences remain visible and are excluded from documented-overlap counts. Assembly, Ruby and Rails remain unassigned research gaps.

## Run and rebuild

Use Node.js 24+ and Python 3 for a simple local server. No build framework or API key is needed.

```sh
node scripts/build-connections.mjs
node scripts/export-research.mjs
node tests/connections.mjs
node tests/connection-links.mjs
node tests/languages.mjs
node tests/ingredients-expansion.mjs
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000/. Browser tests use Playwright and its Chrome channel; set `PLAYWRIGHT_PATH` if Playwright is installed outside normal Node module resolution, and `TEST_URL=http://localhost:8000`. Run `tests/connections-browser.mjs`, `tests/technique-labels.mjs`, `tests/ingredients-presentation.mjs` and `tests/folding-interface.mjs` with Node as appropriate.

GitHub Actions checks the data and public research export on pushes and pull requests. The website is hosted separately through Sites; pushing to GitHub does not deploy it automatically. Research exports include SHA-256 checksums so published files can be compared with the source records.

## Contribute and correct

Open an issue or pull request with the person, contribution or relationship, dates if known, and supporting original or institutional sources. Keep proposals separate from verified facts. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits and reuse

Authored by Yury Gitman. Technique catalog names credit Pardesco. Portrait and third-party source credits remain alongside the work and in the portrait manifests. Animated studies are original visual introductions, not authentic reconstructions of named artists' works. Making this repository public does not grant a blanket license to third-party images, artworks or source material; consult each source's rights and attribution terms. No new blanket license is asserted here.

The project began as a standalone publication from the Yury personal-site source. People / Together / Ingredients use a folding interface; both embedded views retain their browsing state. The connections layer uses visible links, shared-target overlaps and explicit research queues.
