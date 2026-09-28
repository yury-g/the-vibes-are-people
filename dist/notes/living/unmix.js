// Observations and recipes refer to the original studies in studies.js.
// Artist links are context, not claims that these studies reconstruct specific works.
export const unmix = {
 mccarthy:['Small ripples ride on broad, gently moving contours.','Add three layers of gradient noise at doubling frequencies and diminishing amplitudes. Sample along a circular path through the noise field to make a seamless loop.'],
 brain:['Two grids create bands that appear to move between the lines.','Draw two evenly spaced line grids. Rotate them in opposite directions with a slow periodic angle; their intersections produce moiré bands.'],
 kogan:['Nested three-cusped loops overlap into shifting dark bands.','Trace a family of deltoid curves with two harmonics. Vary their radius and rotation periodically. This is our own construction, not the lost source of Interference.'],
  molnar: ['A tidy grid of nested squares seems to hesitate and slip.', 'Place five rows of squares. Draw four nested outlines in each cell. Rotate and offset each outline with slow sine waves.'],
  mohr: ['Sharp line fragments fold through a shape that feels bigger than the page.', 'Make sixteen vertices of a four-dimensional cube. Rotate two coordinate pairs, project them into two dimensions, then draw selected edges with different weights.'],
  nake: ['A measured score of horizontal lines is interrupted by small slashes.', 'Lay down eight scored rows. Use a fixed numeric seed to decide which short slashes appear; sway their endpoints over time.'],
  nees: ['The top squares keep their places. The lower ones wander and turn.', 'Draw a regular grid of squares. Increase each row’s displacement and rotation toward the bottom, using looping sine and cosine functions.'],
  cohen: ['Stems and leaves appear from repeated drawing decisions.', 'Start seven stems at the bottom. Give each a seeded height, add a bent centerline, then place alternating leaf contours along it.'],
  whitney: ['Dots organize into changing rhythmic figures.', 'Place dots at radii that grow with the square root of their index. Change each dot’s angle at a rate partly determined by that index.'],
  schwartz: ['Two fields of circles slide across each other, making moiré bands.', 'Draw two sets of concentric rings. Move their centers around a small loop so overlapping lines create shifting interference.'],
  perlin: ['Lines bend smoothly, without abrupt random jumps.', 'Sample gradient noise across each line. Use a circular path through the noise field to displace its points, making a seamless loop.'],
  reynolds: ['Many tiny arrows travel as if they belong to one flock.', 'Give each arrow a seeded looping path and orient it to that path. Their movement is choreographed; no separation, alignment, or cohesion is simulated here.'],
  sims: ['Dense dots cluster into islands that swell and dissolve.', 'Combine three oscillating sine and cosine waves. Map the combined value to each dot’s radius. This is not a reaction-diffusion or evolutionary simulation.'],
  reas: ['A delicate mesh appears when moving points approach each other.', 'Move sixty-five seeded points on loops. Connect every pair closer than a fixed distance; fade each link as the points separate.'],
  fry: ['Branches radiate from a common center, like a living diagram.', 'Place eighty spokes around a circle. Connect a center, a middle joint, and a moving outer point. All values are synthetic; no dataset is plotted.'],
  levin: ['An elastic ribbon seems to answer an invisible gesture.', 'Draw twelve closed contours from polar coordinates. Modulate radius and vertical position with waves, then offset each contour.'],
  lieberman: ['Nested contours stretch together, retaining a family resemblance.', 'Draw twenty-two rings. Vary each ring’s radius with the same three-lobed wave, shifting its phase slightly from its neighbors.'],
  shiffman: ['A pendulum-like trail repeats with intricate but regular crossings.', 'Combine several sine and cosine oscillations into a single parametric path. This is an analytic loop, not a physical double-pendulum simulation.'],
  tarbell: ['Branches repeatedly split into smaller branches.', 'Start four stems from the center. At each branch, split in two with seeded angles and shorter lengths; vary the length with a slow wave.'],
  davis: ['A field of emblems rotates with individual timing.', 'Arrange thirty-six star-shaped outlines in a grid. Give each a seeded angle and a periodically changing radius.'],
  hobbs: ['Curves travel through a common current, bending as they go.', 'Start seventy-five paths at the left edge. At each step, read a direction from a periodic field and advance a short distance along it.']
};
