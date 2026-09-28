# A taxonomy with several connected views

Use existing names and classifications before proposing a new label. This project connects established technical categories to people, tools, teaching contexts and visual vocabulary; it does not claim to have invented a universal taxonomy.

## Foundations to build on

- [The Nature of Code](https://natureofcode.com/), Daniel Shiffman: randomness, vectors, forces, oscillation, particles, agents, cellular automata and fractals, among other topics. A teaching sequence, not an exhaustive history of invention.
- [HIPR, University of Edinburgh](https://homepages.inf.ed.ac.uk/rbf/HIPR2/index.htm), Robert Fisher, Simon Perkins, Ashley Walker and Erik Wolfart: image operations, morphology, filters, detectors, transforms and synthesis. Distinguish reference authors from the inventors of each method.
- [Algorithmic Botany, University of Calgary](https://algorithmicbotany.org/): plant modeling and simulation. [The Algorithmic Beauty of Plants](https://algorithmicbotany.org/papers/abop/abop.pdf), Przemyslaw Prusinkiewicz and Aristid Lindenmayer, with credited collaborators, is a central source for L-systems and plant models.
- [p5.js reference](https://p5js.org/reference/): implementation-facing functions and parameters. A library function is an implementation, not the whole history of its method.

## Classify the operation before the appearance

| Method | Computational role | Useful visible qualities | Controls to distinguish | Credit question |
| --- | --- | --- | --- | --- |
| Perlin noise | Signal synthesis; coherent procedural noise | Smooth variation at different scales | Coordinate scale; octave count; persistence; seed | Trace Ken Perlin’s work and identify the actual noise implementation. |
| Gaussian blur / smoothing | Image filtering; convolution with a Gaussian kernel | Softened edges; reduced fine detail | Standard deviation, kernel support and boundary handling | Separate the mathematical namesake from later filter implementations; a surname does not prove sole invention. |
| L-systems | Formal rewriting; often interpreted as geometry | Repetition, hierarchy, branching | Grammar, iterations, angle, length | Trace Lindenmayer, later modeling contributions and the interpreter used. |

Sources for these examples: [Perlin’s 1985 paper](https://www.cs.cmu.edu/afs/cs/academic/class/15869-f11/www/readings/perlin85_imagesynthesizer.pdf), [HIPR Gaussian smoothing](https://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm), and *The Algorithmic Beauty of Plants* above. The paper/book should be read for detailed historical claims.

Keep these facets separate and linkable:

1. Method identity: established name, aliases, proposed labels and source.
2. Computational role: generator, simulation, geometric construction, filter, sampling, rendering or composition. A pipeline can use several.
3. Observable qualities and controls: what a maker sees and can change.
4. People and roles: method contribution, implementation, toolmaking, teaching, artistic use or mathematical namesake; each tied to evidence.
5. Context: tools, languages, institutions, works and time. Shared affiliation alone does not establish influence.

A new pattern is not automatically a new algorithm. Record a combination of known methods as a composition first. Suggested personal names remain proposed aliases until supported or adopted. Human-approved names and uncertain recollections can coexist with established terms without overwriting them.
