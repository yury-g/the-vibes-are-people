# Languages, tools and confidence

Research pass: September 27, 2026. Source records: `research/language-tools.json`. Generated relationships: `dist/connections/data.json`. Public entry: https://thevibesarepeople.com/connections/#languages

## What a connection means

Each relationship applies to a named work, version, repository, teaching practice or documented role. It is not a rating of a person's expertise and does not claim that all their works use the same language. Libraries, toolkits, frameworks and programming environments have explicit categories rather than being flattened into languages. Processing is treated as a language/environment; p5.js as a JavaScript library; Rails as a framework, separate from Ruby. C and C++ have distinct explicit identifiers.

The website's own animated studies are JavaScript. That implementation does not establish the historical artist's language. Profiles state this distinction. A hosted repository may document publishing or maintaining code without establishing sole authorship; the FaceTracker fork is labeled accordingly.

## Confidence rubric

The meter is an ordinal editorial evidence scale, **not a calibrated probability**:

- **3/3 — Documented:** the inspected artist account, institutional record, project documentation or source repository explicitly supports the limited statement.
- **2/3 — Inferred:** a documented chain suggests the association, such as a tool creator linked to its underlying language. The inference and rationale are shown alongside the record. It does not establish a particular artwork's direct implementation language.
- **1/3 — Tentative:** reserved for a grounded lead with explicit uncertainty and evidence. No tentative claims were needed in this first release.
- **Unknown:** no asserted relationship and no numeric confidence. Unresearched technologies are displayed as research gaps.

All language records require a scope, rationale, evidence URLs and matching review status. Guessing from someone's generation, school, institution, or visual style is not sufficient evidence. Do not treat a GitHub language-percentage badge or repository ownership as proof that every line was authored by that person.

The first release has 37 scoped relationships across 16 people: 32 documented and five inferred. The five inferred associations are Reas→Java, Fry→Java, McCarthy→JavaScript, Lieberman→C++, and Hobbs→Java. The first three are connected through created or co-created tools; the fourth through openFrameworks; the last through Quil/Processing. Each record explains its own basis. There are 19 technology nodes, including three currently unassigned research targets: Assembly, Ruby and Ruby on Rails.

## Examples and source routes

- Cohen's 1995 interview distinguishes AARON's Lisp software from its C++ painting controller: https://computerhistory.org/blog/into-the-archives-a-look-back-with-robotic-artist-harold-cohen/
- Museum history describes an earlier C implementation: https://computerhistory.org/blog/harold-cohen-and-aaron-a-40-year-collaboration/
- Mohr's artist archive documents FORTRAN IV in 1969: https://emohr.com/paris-1971/meteo.html
- Mohr's artwork-specific C credit: https://zkm.de/en/artworks/spacecolormotion
- Molnár / FORTRAN: https://www.mudam.com/de/vera-molnar
- Nees / ALGOL: https://zkm.de/en/exhibition/2006/08/georg-nees-the-great-temptation
- Processing creators and Java basis: https://processing.org/people/ and https://processing.org/tutorials/overview/
- p5.js creator and JavaScript basis: https://p5js.org/about/
- Shiffman's teaching context: https://natureofcode.com/introduction/
- Levin's templates explicitly identify Processing/Java, p5.js/JavaScript and Processing.py/Python: https://github.com/golanlevin/LoopTemplates
- Hobbs's Clojure/Quil workflow: https://www.tylerxhobbs.com/words/code-goes-in-art-comes-out
- Davis's After You credits Processing, HYPE and GLSL: https://joshuadavis.com/After-You
- Perlin's 2002 Java reference implementation: https://cs.nyu.edu/~perlin/noise/
- Reynolds's Java diagrams and C++ steering implementation: https://www.red3d.com/cwr/steer/

Complete evidence, including McDonald, Tarbell and Lieberman, is stored per relationship in the JSON file. These are links and short research summaries, not copied full articles or source archives.

## Gaps and rejected shortcuts

Assembly, Ruby and Rails have no supported person/work link in this edition. Rails documentation establishes what the framework is, not which artist used it: https://guides.rubyonrails.org/getting_started.html . Architecture-specific assembly requires a precise source; machine code and assembly must not be conflated.

A search located a Nake Polygon Drawings record mentioning several languages, but direct extraction failed: https://www.medienkunstnetz.de/works/polygonzuege/ . It remains a lead rather than a published person/language assertion. The Whitney Software Structures essay describes several participants and languages; a list of participants next to a list of languages does not establish a one-to-one mapping: https://artport.whitney.org/commissions/software-structures-2016/text.html . The Complexification page could not be fetched in this pass; Tarbell's public conference talk supports the narrower Processing statement used here.

## Automated checks and presentation

`node scripts/build-connections.mjs` validates and generates the layer. `node tests/languages.mjs` checks confidence/review consistency, scope requirements, distinct C/C++ identifiers, unassigned gaps and exclusion of inferred links from documented overlap counts. `tests/languages-browser.mjs` checks visible meters, the inferred-link toggle, navigation, unknown items and mobile layout.

The directory's language counts separate documented and inferred people. Documented overlap counts exclude inferred and tentative relationships. The general index retains prior imported source credits with their existing status; those are not upgraded by this language research. The public export and GitHub checks include this evidence file and policy.

## Ingredients expansion update

The subsequent Ingredients pass brings the layer to 41 relationships across 18 people: 37 documented and four inferred. Gene Kogan’s Processing/GLSL examples and Tega Brain’s shared Processing/JavaScript teaching collection are added. Zach Lieberman’s C++ link now cites his authored ofBook animation tutorial directly. See [Ingredients expansion](INGREDIENTS-EXPANSION.md) for precise role boundaries. Earlier first-release counts above describe that earlier snapshot.
