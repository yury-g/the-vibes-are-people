# Visual taxonomy · first edition

Local route: `/taxonomy/`. Five method entries are defined in `dist/taxonomy/data.json` and rendered with original Canvas demonstrations in `demos.js`.

## Editorial scope

The navigation facets describe computational roles, not a universal classification. Visible qualities, mechanisms, implementation scope, and people’s contribution roles remain separate. Source-backed credit rows resolve the existing graph at `/connections/data.json`; imported records remain explicitly marked “source recheck pending.” The taxonomy does not upgrade them or create a second people database.

- Perlin noise: deterministic 2D gradient noise, eight lattice gradients, quintic interpolation, one octave. A fixed seed in the lattice hash makes the output repeatable. This is an educational implementation, not a claim to reproduce Perlin’s reference code exactly.
- Gaussian blur: normalized sampled Gaussian kernel truncated to a radius of `ceil(3σ)`, separable convolution, clamped image edges. Sigma is in source pixels. Carl Friedrich Gauss is identified as a mathematical eponym; the entry does not invent a digital-image-processing contribution for him.
- L-systems: four parallel rewriting generations of `F → F[+F]F[-F]F`, bracketed turtle interpretation, adjustable angle. The frame is fitted after a change.
- Moiré: two equally spaced line grids with adjustable angular separation. A 12-second phase oscillation illustrates moving interference.
- Ordered dithering: a 4 × 4 Bayer threshold matrix and binary output. It is distinguished from error diffusion and random-dot methods.

## Motion and reuse

The existing `drawStudy` export from `/notes/living/studies.js` supplies the related Ken Perlin study. Its 24-second motion and biography backlink remain visible as a collection example. No existing controller is copied. Moiré and the collection study have separate play/pause buttons; default playback respects `prefers-reduced-motion`, and rendering pauses offscreen and in background tabs. Gaussian and dithering use before/after images with controls; the L-system angle is directly adjustable.

## Sources

Mechanism references include [Perlin’s reference implementation](https://cs.nyu.edu/~perlin/noise/), [HIPR2 Gaussian smoothing](https://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm), [The Algorithmic Beauty of Plants author archive](https://algorithmicbotany.org/papers/#abop), [Cruz-Diez’s official archive](https://cruz-diez.com/works/chromointerference/), and [HIPR2 dithering](https://homepages.inf.ed.ac.uk/rbf/HIPR2/dither.htm). Bayer’s graph credit retains its original bibliographic source and pending review status. Gauss’s mathematical name history links to [MacTutor](https://mathshistory.st-andrews.ac.uk/Miller/mathsym/stat/).

The page explicitly directs readers to HIPR2, The Nature of Code, and The Algorithmic Beauty of Plants as larger, differently organized maps of this subject.

## Verification

`tests/taxonomy-browser.mjs` checks the five entries, graph credit review statuses, actual pixel changes from every slider, method and person search, role filters, empty results and reset, keyboard range changes, reduced-motion play/pause for both moving canvases, internal links, fragment navigation, and mobile/desktop overflow. Numerical checks cover Gaussian normalization, symmetry, constant preservation and an impulse response; gradient-noise continuity; binary Bayer coverage; and L-system branch balance and segment count.

Run with Node and Playwright against a static server; the server defaults to `http://127.0.0.1:8879`. Set `PLAYWRIGHT_PATH` for a bundled runtime or install the `playwright` package. Screenshots are saved under `/tmp/vibes-taxonomy-*`.

## Boundaries and follow-up

This is five working examples, not a complete taxonomy. There is no claim that a visible quality belongs to one mechanism or one author. A Gaussian image-processing contributor record remains an explicit research gap. No stock images, artist reproductions, paid generation calls, third-party scripts, or deployment were needed for this edition.
