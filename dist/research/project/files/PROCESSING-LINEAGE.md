# Processing: people, tools and transmission

Checked September 28, 2026. The existing 120-person catalog and all recipe credits remain intact. Seven people are added to the connection directory, with an explicit `inclusion` reason each. No animated artist studies, recipe tiles, portraits, or top-level interfaces are added. Processing Foundation already had a single affiliation record; it now has an explicit organization type and source-linked connections to tools, people, community and a publication. Eyebeam retains its records and receives the same organization type.

## Lineage and limits

- **Muriel Cooper → John Maeda:** research continuity between the Visible Language Workshop and the Aesthetics and Computation Group, not a claim of personal instruction. Reas and Fry identify David Small as a specific carrier of continuity. [Their first-person history](https://www.processingfoundation.org/blog/a-modern-prometheus/) also establishes Design By Numbers as a precursor to Processing.
- **Maeda → Casey Reas / Ben Fry:** [Fry identifies Maeda as their former advisor](https://www.benfry.com/writing/archives/513/). This does not make Maeda a co-creator of Processing; the account explicitly complicates that assumption.
- **Reas + Fry → Processing:** existing checked co-creator records retained. [Processing's own history](https://processing.org/people/) also records the 2012 foundation with Daniel Shiffman and the end of their active project-lead roles in 2023.
- **Processing → p5.js ← Lauren Lee McCarthy:** reinterpretation for the web in 2013, supported by [p5.js's history](https://p5js.org/people/). McCarthy's existing creator records remain. The nonprofit supports the tools; it is not counted as an artist or inventor.

These are selected documented paths, not an exhaustive or exclusive origin story. Neither common tools nor institutional overlap establishes personal influence, collaboration or a shared aesthetic. No aesthetic edges were invented to complete a chain.

## Inclusion and transmission decisions

| Person | Specific contribution and evidence | Treatment |
| --- | --- | --- |
| Daniel Shiffman | [The Nature of Code introduction](https://natureofcode.com/introduction/) distinguishes the Processing and p5.js editions and accompanying teaching videos. | Existing person; add publication/pedagogy and foundation founding. |
| Xin Xin | [Teaching archive](https://xin-xin.info/teaching/): Critical Computation with Katherine Moriwaki, p5.js instruction, and Code, Decolonized. [Foundation announcement](https://processingfoundation.org/blog/announcing-roxana-hadad-and-xin-xin-as-executive-co-directors-of-the-processing-foundation/) documents community programs. | New person for specific pedagogy; separate institutional/community edges. |
| Golan Levin | [LoopTemplates](https://github.com/golanlevin/LoopTemplates) supplies Processing and p5.js animation templates. | Existing person and checked tool records retained; no duplicate role or unsupported foundation affiliation. |
| R. Luke DuBois | [Sound tutorial](https://processing.org/tutorials/sound/), co-authored with Wilm Thoben; [foundation profile](https://processingfoundation.org/people/r-luke-dubois/). | New person for sound pedagogy, separately labeled advisory service. Use DuBois capitalization from his authored tutorial, not a second person for the foundation's Dubois spelling. |
| Kate Hollenbach | [phonelovesyoutoo](https://www.katehollenbach.com/phonelovesyoutoo/) documents her custom recording app and video installation. [Current foundation profile](https://processingfoundation.org/people/kate-hollenbach/) names Processing Java development and past board roles. | New person for artwork and tool development, not a board-directory import. Do not repeat older profiles calling her current board president. |
| Cassie Tarakajian | [Editor leadership transition](https://processingfoundation.org/blog/the-soothing-balm-of-uncertainty/) documents editor creation and Rachel Lim's account of mentorship. | New person for a concrete creative tool and transmission role. |
| Taeyoon Choi | Existing Eyebeam and School for Poetic Computation co-founder/curriculum records; [foundation profile](https://www.processingfoundation.org/people/taeyoon-choi/) connects alternative pedagogy and accessibility. | Existing person; add explicitly historical advisory/contributor role. School relationship reused, not duplicated. |
| Qianqian Ye | [January 2025 retrospective](https://processingfoundation.org/blog/celebrating-4-years-of-p5js-leadership-with-qianqian-ye/) documents documentation accessibility and contributor work. | New person for maintenance/accessibility and catalog editing. Use the dated completed-tenure account rather than p5.js's stale “present, on leave” listing. |
| Roxana Hadad | [2024 appointment announcement](https://processingfoundation.org/blog/announcing-roxana-hadad-and-xin-xin-as-executive-co-directors-of-the-processing-foundation/) documents equity-focused CS education, Seasons of CS and SCALE-CA. | **Deferred.** No person-node based merely on the appointment. This pass did not establish a sufficiently specific creative-coding/artwork contribution for this catalog. This is a research limit, not a judgment of her work's value. |

New Cooper and Maeda nodes have their specific visual-computing/toolmaking inclusion reasons in the data. They do not receive invented recipe credits.

## Archival sources

[Processing Community Catalog publication record](https://processingfoundation.org/blog/20th-anniversary-processing-community-catalog-out-now/) documents a 2021 community open call, 2023 publication, and editors Lauren Lee McCarthy, Casey Reas, Qianqian Ye and Nikki Makagiansar. The catalog is linked as a publication and a source of future first-person research. Only the publication/credit record was used here; individual submissions were not mined or treated as verified influence claims. Its linked Internet Archive viewer was unavailable in this pass.

**Potential source only:** *Back to the Present: Fifty Years of Free Expression with Franklin Furnace*. Yury reports that the forthcoming book includes his work. Recorded from the project brief, not independently verified. The book has not been read, mined or used as evidence for any graph relationship. Consult the [Franklin Furnace publications/archive entry point](https://franklinfurnace.org/archives-publications/) in a future research pass.

## Data and interface

`research/processing-lineage.json` extends the existing graph through exact names and stable IDs. Its `from`/`to` records become ordinary person-origin relationships or non-person-origin relationships with `subject`. Existing `person` fields and records remain unchanged. `origin(r)` reads either; validation rejects dangling references and ambiguous origins. `type` labels organizations, tools, publications, pedagogy, communities and artworks without overloading the language layer's `category`.

New relationships retain kind, role, inverse role, specific scope, date (null if unknown), primary source and checked date. Entity pages show their own tool/community links above the existing people cards. People counts include actual people only. Person-to-person links read “Advised” in one direction and “Studied with” in the other. Tool pages now expose all documented roles, including maintenance and teaching, while the explicit language-only filter retains its behavior. New person cards state the contribution that justifies inclusion. Tool-gap counts recognize documented toolmaking, maintenance and pedagogy as well as language-layer evidence, without treating a two-hop teaching chain as direct personal tool use.

The front-page addition is one contextual link inside the existing teaching-history paragraph. Compact person details show at most one additional foundation relationship. No new stylesheet, dependency, media or network request is added.

Rebuild with `node scripts/build-connections.mjs` and `node scripts/export-research.mjs`. Run the existing data and browser regressions plus `tests/processing-lineage.mjs` and `tests/processing-lineage-browser.mjs`.
