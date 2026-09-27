# The Vibes Are People

Standalone publication of the approved contact sheet / human ingredient index.

Primary domain: https://thevibesarepeople.com/
Additional domain: https://vibesarepeople.com/

Source: yury-personal-site commit bf58ed831ef87fef02ad221bf1d6a2d995d5f9c7.
The three original presentation directories are copied without edits; root index uses the approved comparison with public metadata. The Yury Gitman Notes link returns to the personal site.

## Folding interface — September 27, 2026

Public A/B language is retired. The default remains the approved split screen, with People / Together / Ingredients controls, panel expansion buttons and a narrow rail to unfold the other view. The three existing entry URLs share the same shell and `/interface/book.css` / `/interface/book.js`. Both iframes stay mounted; folding preserves their state. Mobile uses stacked pages; reduced motion disables transitions. Original Living Index / Technique Index code, data and portrait assets remain unchanged. Ingredient-page navigation labels now describe the views rather than test variants.

Validation: `tests/folding-interface.mjs` covers state and scroll preservation, no iframe reloads, keyboard operation, 320px layout, reduced motion and legacy entry URLs. `tests/ingredients-presentation.mjs` covers the existing people and recipe interactions.
