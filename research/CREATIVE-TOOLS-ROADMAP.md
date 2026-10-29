# The Vibes Are People — creative-tools roadmap

**Recorded:** October 29, 2026  
**Status:** Deferred exploration, not an active build. No release date or implementation commitment.

## Purpose

Explore ways people can *use* well-documented computational-art methods while discovering and properly crediting the people who developed, practiced, taught and maintained them. Tools should teach transferable techniques, not offer one-click copies of identifiable living artists' signature work.

The existing [Vibes Algorithmic Art creation skill](../dist/skills/vibes-algorithmic-art/SKILL.md), [technique provenance records](../dist/notes/ingredients/technique-provenance.json), [Processing history](PROCESSING-LINEAGE.md) and [research methodology](ART-SKILL-VALIDATION.md) are the starting points. This idea does not supersede them.

## Possible formats (none scheduled)

1. **CSS / web examples — lowest-friction exploration.** Demonstrate general visual principles such as repeating-line interference (moiré), gradients, overlays and blend modes, with legible controls and source-linked context. Label the actual implementation precisely. CSS alone does not implement pixel-by-pixel Floyd–Steinberg error diffusion; use original JavaScript canvas or another pixel-processing path if a real dithering algorithm is requested.
2. **Processing and p5.js classroom sketches.** Develop original, editable examples for established techniques such as dithering, halftone and moiré, accompanied by an explanation of the method, its documented history, implementation authorship, and a clear license for the *new code*. Distinguish a new teaching sketch from an artist's particular artwork.
3. **Apple Motion / Final Cut Pro effects — deferred until there is interest, time and a suitable Mac.** Explore free reusable moving-video effects, not exported still frames, with meaningful controls and inspectable, source-linked credits. Evaluate Apple Silicon GPU/Metal support, performance and template distribution in a prototype rather than presuming every algorithm runs in real time. Apple Motion templates are not interchangeable with Adobe After Effects plug-ins. An After Effects implementation, if desired, would be a separate project.

## Attribution and artist-respect rules

- **Name the technique before naming an artist.** Keep algorithm inventors/authors, artistic practitioners, teachers, maintainers, source archives and the new tool's implementers in distinct roles. A connection is not proof that someone invented a whole style.
- **No uninvited “make it look like [living artist]” presets.** Do not use a living artist's name as a preset brand, copy their recognizable compositions/assets, or present a close emulation as collaboration. Invite artists to opt in for artist-specific demonstrations or featured work and agree on scope, credits and reuse rights.
- **Credits are not licenses or endorsements.** Independently check code, artwork, fonts, images and footage rights before redistributing them. A factual link to Eyebeam, NYU ITP, Parsons/The New School or the Processing community does not imply sponsorship, collaboration or permission.
- **Make provenance useful.** Each downloadable example/effect should carry technique and method version, implementation author/license, named contributors with the supported role and dated sources, status of verification, and an easy correction/contact route. Offer optional visible credits or end cards without requiring the viewer's exported media to carry a watermark.
- **Leave unknowns unknown.** Similarity, shared techniques and public archives are not proof of influence or inclusion in an AI model's training data. Label historical uncertainty and import status rather than laundering an association into an attribution claim.
- **Protect artist agency.** Invite corrections, respect withdrawals of permission for artist-specific imagery or marketing, and preserve carefully worded historical documentation only when justified by evidence and applicable rights.

## Revisit criteria

Revisit only if community/teacher demand or a suitable residency creates time for it, representative artists are willing to review the framing, and a small original proof of concept can demonstrate performance, usable controls and correct credits. Start with generic methods and original code before considering artist-specific work. **No current engineering assignment or publication promise.**
