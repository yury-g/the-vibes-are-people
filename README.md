# The Vibes Are People

Standalone publication of the approved contact sheet / human ingredient index.

Primary domain: https://thevibesarepeople.com/
Additional domain: https://vibesarepeople.com/

Source: yury-personal-site commit bf58ed831ef87fef02ad221bf1d6a2d995d5f9c7.
The three original presentation directories are copied without edits; root index uses the approved comparison with public metadata. The Yury Gitman Notes link returns to the personal site.

## Folding interface — September 27, 2026

Public A/B language is retired. The default remains the approved split screen, with People / Together / Ingredients controls, panel expansion buttons and a narrow rail to unfold the other view. The three existing entry URLs share the same shell and `/interface/book.css` / `/interface/book.js`. Both iframes stay mounted; folding preserves their state. Mobile uses stacked pages; reduced motion disables transitions. Original Living Index / Technique Index code, data and portrait assets remain unchanged. Ingredient-page navigation labels now describe the views rather than test variants.

Validation: `tests/folding-interface.mjs` covers state and scroll preservation, no iframe reloads, keyboard operation, 320px layout, reduced motion and legacy entry URLs. `tests/ingredients-presentation.mjs` covers the existing people and recipe interactions.

## Guided Studio tour — September 27, 2026

Studio View now offers an opt-in Play tour. Eleven timed stops (about four minutes) drive the existing People and Ingredients interfaces: contact sheet, Perlin study, recipe/person steps, domain-warping contributors, reaction–diffusion, Sims study, connections and the combined view. No dataset, portrait, artwork, or underlying controller is duplicated or modified.

The tour has previous/next, pause/resume, replay after completion, a reading countdown and Explore freely. Real pointer, touch, wheel or keyboard interaction pauses the tour; hiding the browser tab also pauses it. Normal-motion tour starts enable the existing animations, while reduced-motion preferences are respected. Stops wait for view readiness with a bounded timeout; exiting cancels pending preparation. Captions and controls remain above the artwork on narrow screens.

Validation: `tests/studio-tour.mjs` covers visitor opt-in, automatic advance, pause/resume, iframe input takeover, all eleven stops, completion, rapid cancellation, reduced motion, 320px layout and unavailable recipe provenance. Existing folding and presentation tests also remain applicable.
