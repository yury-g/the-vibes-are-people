# Anthropic algorithmic-art: mini audit

Checked September 28, 2026. [Pinned source](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md).

Counts cover SKILL.md only. The two bundled templates were inspected for implementation context. This is an instruction audit, not a benchmark of generated art.

## Counts

- 0 explicit human-name credits.
- 2 surnames inside technique names: Perlin and Voronoi. These are not explicit biographical credits.
- 12 selected method families catalogued below.

Count distinct literal surnames separately from explicit human-name credits. The 12 method families are our selected, overlapping groupings of named techniques and computational processes—not an exhaustive algorithm count. Repeated mentions count once. Software, UI controls, generic mathematical concepts and template helpers are excluded.

L-systems does not spell out Lindenmayer; we do not count that expansion as a person named in the source. Anthropic, Claude, Art Blocks and p5.js are not human-name credits.

## Matrix

| Area | What is clear in the source | Opportunity we would add |
| --- | --- | --- |
| [People & attribution](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L58-L74) | Two surnames survive in method names. | Expand these into credited people, specific contributions and sources; include the people behind L-systems and p5.js. |
| [Technique coverage](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L54-L74) | Recognizable methods connect creative ideas to computation. | Give each method a plain-language definition, distinguishing features and a linked example. |
| [Adjustable controls](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L143-L160) | The instructions connect parameters to interactive controls. | Label the visible effect of each control: sparse/dense, fine/coarse, smooth/abrupt. |
| [Repeatable comparisons](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L135-L141) | Both random and noise generators receive a seed. | Save parameters, code version and animation frame too; a seed alone does not preserve every input. |
| [Visual language](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L35-L51) | A creative rationale guides the implementation. | Pair expressive language with observable criteria, comparison images and a maker’s intended meaning. |
| [Working scaffold](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/templates/viewer.html#L499-L531) | The viewer supplies interface structure and seed navigation. | Its art functions are placeholders. Generate and test the actual sketch, including each parameter’s visible effect. |
| [Export & actions](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L327-L335) | The instructions require regeneration and PNG export. | The viewer’s Actions section contains only Reset. Add and test the two missing buttons. [Viewer evidence](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/templates/viewer.html#L423-L429). |

## Method inventory

- [Seeded randomness](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L135)
- [Flow / vector fields](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L70)
- [Particle systems](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L3)
- [Perlin noise](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L58)
- [Noise octaves](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L58)
- [Wave interference](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L62)
- [L-systems](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L66)
- [Recursive subdivision](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L66)
- [Circle packing](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L74)
- [Voronoi tessellation](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L74)
- [Relaxation](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L74)
- [Feedback](https://github.com/anthropics/skills/blob/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/algorithmic-art/SKILL.md#L172)

## Reproducible scope

An independent second agent checked the name counts, method groupings and template placeholders. No generated-art run was scored. A missing credit is an attribution opportunity, not proof of copying, training-data inclusion, or a faulty technique. Template helpers such as easing and spatial hashing are outside the technique count. The skill deliberately leaves algorithms open for the AI to implement.

Future work: give each method a sourced person/contribution link; test fixed-seed, single-control comparisons; define observable visual vocabulary with examples. These are teaching proposals, not measured performance improvements.

Machine-readable findings: [skill-audit.json](https://thevibesarepeople.com/agents/skill-audit.json).

- `SKILL.md` · 405 lines · SHA-256 `3bc4092c09804853186524c826bc0621b940bb6122c05b84496dff95388e6eef`
- `templates/viewer.html` · 599 lines · SHA-256 `86c79d7ce97d2599ebe4bd9b97fdeb7295c9d3ed61ceeb513cbe1b2bb5d1ce29`
- `templates/generator_template.js` · 223 lines · SHA-256 `9ee0f1da52ef8f7bbfde1917123654880890d43f2d388642d71eab6dd78f94c4`
