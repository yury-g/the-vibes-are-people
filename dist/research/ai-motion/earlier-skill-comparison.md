> Snapshot of the earlier 27 September survey. Relative companion links refer to that original research bundle and are not included in this text snapshot. This predates the user’s shift toward visual vocabulary over attribution.

# Algorithmic art with human ingredients

Research date: 27 September 2026. Recommendation: build a small provenance companion around existing creation skills. Keep the rendering engine replaceable. Start with a lightweight Canvas workflow; evaluate Pardesco as the first optional integration and Anthropic as the p5.js alternative. Do not fork either skill yet.

The useful new capability is a durable connection between a generated piece, its actual algorithms, the people associated with those algorithms, the evidence for their roles, and the particular code and assets reused. Another large catalog or a new renderer would duplicate work. The local database already supplies unusually useful role distinctions; it needs a repeatable delivery contract and checks.

## What was surveyed

Five deliberately selected projects: two directly relevant agent skills, plus three established creation tools that test whether a skill is the right layer to extend. Primary repositories, skill instructions, templates, licenses, official documentation, and the project's supplied local records were inspected. Search also surfaced repackagings; they were not counted as independent approaches. This is not an exhaustive survey of skills or generative-art software. Blender, shaders and audio appear as capability routes in the surveyed skill, not separately audited engines.

Repository revisions and retrieved file hashes are saved in [upstream snapshots](checks/upstream-snapshots.json). Dates below are repository-head dates, not claims that the art skill or every file changed that day. These are snapshots, not installed package versions.

| Project | Technique and output coverage | Workflow and quality evidence | Actual provenance practice / maintenance implication |
|---|---|---|---|
| [Anthropic algorithmic-art](https://github.com/anthropics/skills/tree/33375500bcea98d610eb30ce10ac4e59b89c390d/skills/algorithmic-art) | p5.js, procedural fields, particles, emergent systems; interactive HTML and PNG. | Philosophy-first generation, seeded variation and controls. Visual-quality instructions are aspirations, not measured results. Template leaves algorithm functions unfinished; that is a scaffold, not a ready artwork. | Advises originality but does not require a claim-to-person evidence manifest. Prescribed branding reduces fit with this project. Template requests CDN p5.js and Google Fonts, so the delivered file is not inherently offline. Repo head: 24 Sep 2026. |
| [Pardesco algorithmic-art](https://github.com/Pardesco/algorithmic-art-skill/tree/030f7b752d5982dadacaa775453e13310f202dc0) | Catalog spans 40 entries in 9 headings; routes to Canvas, SVG, video, audio, WebGL and Blender. | Explicit visual inspection, revision and multi-seed checks; shipped Canvas demo is implemented. Best process fit for autonomous output review in this set; artistic superiority remains untested. | Catalog names some people but does not link systematic claim-level evidence. Code and skill are inspectable; narrower maintenance base than the multi-project ecosystems. Core template has no external imports. Inline scripts still need an appropriate CSP; dependency-free does not mean compatible with every strict CSP. Repo head: 27 Jul 2026. |
| [p5.js](https://github.com/processing/p5.js/tree/9e2cf0bf2a240c4605996331c25c6e9f1ee29d40) | Broad browser creative coding, interaction, animation, audio ecosystem and WebGL. A library, not an agent skill. | Extensive examples and authoring environment; quality depends on the sketch and review process. | Explicitly names creator Lauren Lee McCarthy and recognizes community contributors by contribution type. That is real software attribution, not automatic lineage for every artwork. Active contributor infrastructure; version pinning still matters. Repo head: 26 Sep 2026. [Community](https://p5js.org/community/) and [repository credits](https://github.com/processing/p5.js/blob/9e2cf0bf2a240c4605996331c25c6e9f1ee29d40/README.md). |
| [canvas-sketch](https://github.com/mattdesl/canvas-sketch/tree/798a24f734030c2bdff01bec1f195df390eec22a) | JavaScript generative artwork, print dimensions, raster output and export workflows. | Useful production plumbing, including physical dimensions and high-resolution exports. It does not select an algorithm or critique a composition for an agent. | Named author Matt DesLauriers, visible source and license. No required per-artwork human-lineage record in inspected documentation. More tooling than a single HTML pilot needs. Repo head: 26 May 2026. |
| [vsketch](https://github.com/abey79/vsketch/tree/c73ac3903e976fea967115e6cd6b6ba62bc935d6) | Python generative drawing and plotter-ready SVG with vpype integration. | Parameters, saved configurations and batch seed generation support repeatable exploration. Best medium fit here for a future pen-plotter branch. | Credits Antoine Beyeler and contributors, acknowledges Processing-derived documentation, and separates documentation rights from code rights. Python/Qt/vpype dependencies add setup cost. Repo head: 1 Aug 2026. |

The Pardesco README says ten catalog categories; counting the current technique headings gives nine. The catalog has forty entries. This small discrepancy is a reason to inspect files rather than repeat promotional comparisons. Its breadth and quality controls make it a promising integration, not proof that it produces better art.

Anthropic may be the strongest fit when the user wants its particular p5.js artifact experience. The available evidence does not establish it as the best algorithmic-art skill overall. A controlled comparison would need the same model, brief, time/tool budget, seeds, and independent visual assessment. None was performed here.

## Reuse constraints observed in the actual files

These are inventory findings, not a blanket clearance of every dependency or generated output.

| Material | Observed terms | Consequence for a future adaptation |
|---|---|---|
| Anthropic algorithmic-art skill | [Apache-2.0](https://github.com/anthropics/skills/blob/33375500bcea98d610eb30ce10ac4e59b89c390d/skills/algorithmic-art/LICENSE.txt) | Preserve applicable notices and license, mark modified files, handle any relevant NOTICE material. Trademark permission is separate. Branding requirements are skill instructions, not a reason to imply Anthropic endorsement. |
| Pardesco skill, templates, catalog | [MIT](https://github.com/Pardesco/algorithmic-art-skill/blob/030f7b752d5982dadacaa775453e13310f202dc0/LICENSE) | Include its copyright and permission notice if copying substantial material. Credit Pardesco as the skill/catalog source, distinct from algorithm authors. |
| p5.js and its website examples | Library LGPL-2.1; reference/examples CC BY-NC-SA 4.0; website has separate MIT terms. [Official notice](https://p5js.org/copyright/) | Library use and copying tutorial/example text or code require separate review. Do not assume a permissive library license covers everything shown on its site. |
| canvas-sketch | [MIT](https://github.com/mattdesl/canvas-sketch/blob/798a24f734030c2bdff01bec1f195df390eec22a/LICENSE.md) | Retain the applicable notice when redistributing copied software; inspect additional modules individually. |
| vsketch | Code MIT; documentation CC BY-NC-SA 4.0. [License](https://github.com/abey79/vsketch/blob/c73ac3903e976fea967115e6cd6b6ba62bc935d6/LICENSE) | Avoid treating copied documentation as MIT. Tool output, third-party source material and code dependencies need their own inventory. |
| Project portraits / researched catalog | Local research and approval records, not a general third-party content license | The 18 existing illustrations have recorded user approval for reuse. Supplemental image source pages establish sourcing, not necessarily reuse rights. Do not extend the approval to all mapped photographs. |

The prototype contains new Canvas code. It does not redistribute either upstream skill's template, p5.js, vsketch documentation, or portrait images. Its catalog copy is the user-supplied project snapshot, retained locally for evaluation; this is not a decision about public licensing of that dataset or the new draft.

## What the local records establish

A structural audit found 40 techniques, 108 contributor-to-technique edges, 100 unique named contributors and 69 unique evidence URLs. Every contributor edge has name, role, detail, URL and source label; every technique has a caveat. The original people and technique files were also inspected, and input hashes are saved in [local input inventory](checks/local-inputs.json).

The portrait map has 100 entries: 18 existing illustrations and 82 dithered photographs. Only 86 of those entries correspond to the supplemental catalog's 100 unique contributors. Those are different universes, not contradictory counts. The remaining 14 catalog contributors have no portrait-map entry. Null portrait fields in a technique record must not overwrite separate portrait-map research.

The [coverage report](checks/coverage.json) preserves the technique-to-person mapping. The [link check](checks/link-health.json) reached 52 of 69 URLs: 13 HTTP errors and 4 unresolved connection/certificate/timeout cases. Requests used a small response sample, not a full claim review. A 200 response can still be a login page or irrelevant text. A 403 is not a refutation. These results must never become a “52 verified sources” badge.

For the pilot, the [author-hosted curl-noise paper](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf) was read. Page 1 identifies Robert Bridson, Jim Hourihan and Marcus Nordenstam and explicitly acknowledges earlier Kniss/Hart work; page 2 provides the two-dimensional curl construction. The pilot uses fresh value-noise code and a simple path integrator. It does not reproduce the paper's Perlin-noise implementation or solid-boundary treatment. Its record makes that difference visible.

## Why a companion is the right first move

**Extend an upstream skill:** quickest way to hardwire a label into its viewer, but ties our evidence format to its template, styling rules and upstream updates. Good later as a small adapter, once the output contract proves useful.

**Add a companion — recommended:** reuse the current database, attach the same evidence contract to any renderer, and keep the art-making instructions focused on composition and medium. This is a new, narrowly scoped skill, not a replacement art engine. The cost is one integration boundary: the generator must supply its actual technique choices and implementation details.

**Build a standalone database-driven art skill:** would combine selection, research, rendering, licensing, critique, export and maintenance at once. It risks treating the 40 recipes as a closed vocabulary and the 18 portraits as a mandatory historical canon. Defer until real usage shows a repeated gap that a companion cannot solve.

The small draft consists of [SKILL.md](human-aware-art/SKILL.md), an output contract, a catalog snapshot, and a standard-library audit script. The [interactive pilot](pilot.html), [credited SVG](pilot.svg), and [manifest](pilot-manifest.json) demonstrate the contract. Labels keep people visible; exports carry credits; the manifest binds to the artwork hash. There is no percentage-of-person “ingredient” measurement, fabricated face, implied endorsement or claim that historical contributors made the new piece.

## What requires judgment

I can independently select candidate techniques, fetch and triage public sources, preserve coauthors, record uncertainty, check dependency notices, implement local sketches, compare seeds, inspect outputs, repair mechanical failures and shortlist candidates. Link checks and schema checks reduce routine filtering; they cannot establish a historical claim or aesthetic merit by themselves.

Yury's useful decision is whether the resulting work and labels express the project well. After a small benchmark, show three representative finalists with short reasons. Ask about a contested attribution or new reuse commitment only when the available evidence cannot resolve it. Installation, publication, creator contact and website changes remain separate actions outside this task.

## Uncertainty ledger

| Question | Current evidence / limitation | Next autonomous action |
|---|---|---|
| Which skill produces the best art? | Not established; instructions and templates were compared, not matched model generations. | Run the bounded paired benchmark in the QC plan. |
| Are all 108 contribution claims correct? | Complete fields, inherited research. Only the pilot's paper was directly reviewed here by the primary researcher. | Review selected recipes on demand; save locators and corrections in overlays. |
| Are 17 problematic URLs dead? | One observed 404, 11 observed 403s, one 503, four connection/certificate/timeout cases. | Retry once, search author/DOI/institutional copies, keep original evidence lineage. |
| Are all portraits reusable? | Identity/source mappings are richer than rights records. | Default to text; retain explicit approval scope and seek documented reuse bases where needed. |
| Is the 2007 team the sole origin of curl noise? | No; the paper acknowledges earlier work. Original 2004 source was not independently reviewed. | Keep the qualification; investigate that earlier source only if expanding the lineage. |
| Do upstream credits describe every contributor? | No. Even p5.js's substantive community credits are software-project credits. | Track the people relevant to each reused component and recipe. |
| Are upstream dates proof of maintainability? | No; they identify current repository heads only. | Pin files, compare diffs on intentional refresh, rerun the adapter's smoke tests. |
| Do automated checks certify the skill? | No. They establish stated structural invariants and a tested pilot, not general reliability. | Retain adversarial cases and add only demonstrated failure cases. |

See [quality-control plan and results](quality-control.md) for the executed checks and the next small experiment.
