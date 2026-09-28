import {portraitSources} from './portrait-sources.js';

export function portrait(person, className='portrait') {
  const entry=portraitSources[person.id];
  if(!entry) return null;
  const img=document.createElement('img');
  img.className=className;
  img.src=entry.src||new URL(`./portraits/${entry.file}`,import.meta.url).href;
  img.alt=`${person.name} — illustrated portrait`;
  img.width=160; img.height=160; img.loading='lazy'; img.decoding='async'; img.draggable=false;
  return img;
}

export function portraitFigure(person) {
  const entry=portraitSources[person.id],img=portrait(person,'portrait portrait-large');
  if(!img) return null;
  const figure=document.createElement('figure');figure.className='portrait-figure';
  const caption=document.createElement('figcaption');
  const a=document.createElement('a');a.href=entry.sourcePage;a.target='_blank';a.rel='noopener noreferrer';
  a.textContent=entry.credit ? `Photo source: ${entry.credit}` : 'Source photograph';
  caption.append(a,document.createTextNode(' · AI-assisted stippled illustration'));
  figure.append(img,caption);return figure;
}
