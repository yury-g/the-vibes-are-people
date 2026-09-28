import {drawDemo} from './demos.js';
import {drawStudy} from '/notes/living/studies.js';

const $ = selector => document.querySelector(selector);
const el = (tag, text, className) => { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; };
const link = (text, href, className) => { const a = el('a', text, className); a.href = href; return a; };
const fetchJSON = async url => { const response = await fetch(url); if (!response.ok) throw new Error(`Could not load ${url}`); return response.json(); };
const [methodResult, graphResult] = await Promise.allSettled([fetchJSON('./data.json'), fetchJSON('/connections/data.json')]);
const graph = graphResult.status === 'fulfilled' ? graphResult.value : null;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const animations = [];
let role = 'All methods';

function motion(canvas, draw, label) {
  const button = el('button', '', 'motion-button'); button.type = 'button';
  const state = {canvas, draw, button, playing: !reducedMotion.matches, visible: false, seconds: 0};
  const update = () => { button.textContent = `${state.playing ? 'Pause' : 'Play'} ${label}`; button.setAttribute('aria-pressed', String(state.playing)); };
  button.addEventListener('click', () => { state.playing = !state.playing; update(); });
  state.pause = () => { state.playing = false; update(); }; update();
  animations.push(state); new IntersectionObserver(entries => { state.visible = entries[0].isIntersecting; }, {threshold: .05}).observe(canvas);
  return {button, state};
}

function appendCredits(host, method) {
  const list = el('ul', null, 'credits');
  for (const wanted of method.credits) {
    const person = graph?.people.find(p => p.id === wanted.person);
    const credit = graph?.relationships.find(r => r.person === wanted.person && r.target === wanted.target && r.kind === 'contribution');
    if (!person || !credit) continue;
    const item = el('li'); item.dataset.review = credit.review || 'unspecified';
    item.append(link(person.name, '/connections/?person=' + encodeURIComponent(person.name) + '#people'), ' · ' + credit.role + ' · ', link('source ↗', credit.source, 'source-link'));
    item.append(el('small', credit.detail));
    if (credit.review === 'imported') item.append(el('small', 'Catalog credit · source recheck pending'));
    else if (credit.review === 'checked') item.append(el('small', 'Catalog source checked' + (credit.checked ? ' · ' + credit.checked : '')));
    list.append(item);
  }
  if (method.eponym) {
    const e = method.eponym, item = el('li'); item.append(el('strong', e.name), ' · ' + e.role + ' · ', link('name history ↗', e.source, 'source-link'), el('small', e.note)); list.append(item);
  }
  if (!list.childElementCount) list.append(el('li', 'Contribution records could not load. Follow the method sources below, or visit People & connections.'));
  host.append(list);
}

if (methodResult.status === 'rejected') {
  $('#result-count').textContent = 'The method index could not load. Please reload to try again.';
} else {
  const data = methodResult.value;
  const buttons = [];
  for (const name of ['All methods', ...new Set(data.methods.map(m => m.role))]) {
    const button = el('button', name); button.type = 'button'; button.setAttribute('aria-pressed', String(name === role));
    button.addEventListener('click', () => { role = name; filter(); }); buttons.push(button); $('#role-filters').append(button);
  }
  const cards = [];
  for (const [index, method] of data.methods.entries()) {
    const article = el('article', null, 'method'); article.id = method.id; article.dataset.role = method.role;
    const heading = el('div', null, 'method-heading'), title = el('div');
    title.append(el('span', `0${index + 1} / METHOD`, 'method-number'));
    const h2 = el('h2'); h2.append(link(method.name, '#' + method.id)); title.append(h2);
    heading.append(title, el('span', method.role, 'role')); article.append(heading);
    const figure = el('figure', null, 'demo'), canvas = el('canvas'); canvas.width = 640; canvas.height = 320;
    canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', method.name + ': ' + method.canvasDescription);
    canvas.textContent = method.canvasDescription;
    figure.append(canvas, el('figcaption', method.canvasDescription)); article.append(figure);
    const controls = el('div', null, 'parameter'), label = el('label', method.control.name), input = el('input'), output = el('output');
    input.type = 'range'; input.id = method.id + '-parameter'; input.min = method.control.min; input.max = method.control.max; input.step = method.control.step; input.value = method.control.value; label.htmlFor = input.id; output.htmlFor = input.id;
    label.append(output); controls.append(label, input); article.append(controls);
    let animation = null;
    const draw = (seconds = 0) => drawDemo(canvas, method.id, Number(input.value), seconds);
    if (method.id === 'moire') { animation = motion(canvas, draw, 'grid motion'); controls.append(animation.button); }
    const update = () => { output.value = `${input.value} ${method.control.unit}`; input.setAttribute('aria-valuetext', output.value); draw(animation?.state.seconds || 0); };
    input.addEventListener('input', update); update();
    const copy = el('div', null, 'method-copy');
    copy.append(el('h3', 'Visible qualities')); const qualities = el('ul', null, 'qualities'); for (const quality of method.qualities) qualities.append(el('li', quality)); copy.append(qualities);
    copy.append(el('h3', 'Mechanism'), el('p', method.mechanism), el('p', method.roleDescription, 'implementation'));
    copy.append(el('h3', 'This demonstration'), el('p', method.implementation, 'implementation'));
    copy.append(el('h3', 'People & contributions')); appendCredits(copy, method);
    copy.append(el('h3', 'Read the method')); const sources = el('ul', null, 'sources');
    for (const source of method.sources) { const li = el('li'); li.append(link(source.label + ' ↗', source.url)); sources.append(li); } copy.append(sources);
    const related = el('div', null, 'method-links');
    if (method.recipe) related.append(link(method.recipeLabel || 'Open the recipe & moving study →', '/notes/ingredients/techniques.html?recipe=' + encodeURIComponent(method.recipe)));
    else related.append(link('Contribute a filter connection →', '/agents/'));
    related.append(link(method.vocabularyLabel || 'Explore the visible quality ↗', '/vocabulary/#' + method.vocabulary)); copy.append(related);
    article.append(copy); $('#methods').append(article);
    const people = method.credits.map(c => graph?.people.find(p => p.id === c.person)?.name || '').join(' ');
    cards.push({article, method, text: [method.name, method.role, method.mechanism, method.qualities.join(' '), people, method.eponym?.name || ''].join(' ').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()});
  }
  function filter() {
    const query = $('#method-search').value.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    let count = 0;
    for (const {article, method, text} of cards) { article.hidden = !(role === 'All methods' || role === method.role) || !text.includes(query); if (!article.hidden) count++; }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.textContent === role)));
    $('#result-count').textContent = `${count} of ${data.methods.length} methods shown`; $('#empty').hidden = count > 0;
  }
  $('#method-search').addEventListener('input', filter);
  $('#reset-filters').addEventListener('click', () => { role = 'All methods'; $('#method-search').value = ''; filter(); $('#method-search').focus(); }); filter();

  const study = el('aside', null, 'collection-study'); study.setAttribute('aria-labelledby', 'collection-study-title');
  const copy = el('div'), h2 = el('h2', 'Follow the field.'); h2.id = 'collection-study-title';
  copy.append(el('p', 'From the collection', 'eyebrow'), h2, el('p', 'The project’s existing Ken Perlin study bends rows of lines with gradient noise. A circular path through the field makes a repeating 24-second animation.'), el('p', 'This original visual study connects the mechanism to an application, and to a person.'), link('Open Ken Perlin’s moving study & biography →', '/notes/ingredients/people.html?person=perlin'));
  const figure = el('figure'), canvas = el('canvas'); canvas.width = 360; canvas.height = 360; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Existing collection study: a field of lines bent by gradient noise');
  const draw = seconds => drawStudy(canvas, 'perlin', seconds); draw(0);
  const animation = motion(canvas, draw, 'collection study'); figure.append(canvas, animation.button); study.append(copy, figure); $('.next').before(study);
  // Fragment links resolve after the fetched index has created its cards.
  const target = cards.find(({method}) => '#' + method.id === location.hash); if (target) target.article.scrollIntoView();
}

reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) animations.forEach(state => state.pause()); });
let previous = 0;
function frame(now) {
  const delta = previous ? Math.min((now - previous) / 1000, .1) : 0;
  if (now - previous > 1000 / 24) {
    previous = now;
    for (const state of animations) if (state.playing && state.visible && !document.hidden && !state.canvas.closest('[hidden]')) { state.seconds += delta; state.draw(state.seconds); }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
