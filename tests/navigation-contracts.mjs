import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// These tests exercise navigation behavior without a browser. Visual layout and
// native iframe gesture handling still require the separate browser checks.
const source=name=>readFileSync(new URL('../dist/interface/'+name,import.meta.url),'utf8');
const run=(name,context)=>vm.runInNewContext(source(name).replace(/^export /gm,''),context,{filename:name});
function element(extra={}){
 const listeners=new Map(),classes=new Set();
 return {dataset:{},attributes:{},style:{setProperty(){}},
  classList:{contains:name=>classes.has(name),add:name=>classes.add(name),toggle(name,on){on?classes.add(name):classes.delete(name);}},
  addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn);},
  emit(type,event={}){for(const fn of listeners.get(type)||[])fn(event);},
  setAttribute(key,value){this.attributes[key]=String(value);},
  focus(){this.focused=true;},...extra};
}
function bookFixture({phone=false,hash=''}={}){
 const controls=['people','together','ingredients'].map(view=>element({dataset:{view}}));
 const frames=[],leaves=['people','ingredients'].map(id=>{
  const frame={src:'https://example.test/'+(id==='people'?'notes/living/':'notes/ingredients/techniques.html')+'?book=test',contentWindow:{messages:[],postMessage(data,origin){this.messages.push({data,origin});}}};
  frames.push(frame);
  const content=element({getBoundingClientRect:()=>({width:600,height:800})}),rail=element();
  return element({id,dataset:{label:id},content,rail,querySelector:selector=>selector==='iframe'?frame:selector==='.page-content'?content:rail});
 });
 const book=element({dataset:{view:'together'},clientWidth:390,scrollLeft:0,querySelectorAll:()=>leaves,scrollTo(value){this.lastScroll=value;this.scrollLeft=value.left;}});
 const media=element({matches:phone}),window=element(),status={},history={calls:[],replaceState(...args){this.calls.push(args);}};
 const location={origin:'https://example.test',href:'https://example.test/'+hash,pathname:'/',search:'',hash};
 const document={body:element(),querySelectorAll:()=>controls,querySelector(selector){if(selector==='.book')return book;if(selector==='#view-status')return status;if(selector.startsWith('#people'))return frames[0];if(selector.startsWith('#ingredients'))return frames[1];return element();}};
 const context={document,window,history,location,URL,URLSearchParams,matchMedia:query=>query.includes('prefers-reduced-motion')?{matches:false}:media,ResizeObserver:class{observe(){}}};
 run('book.js',context);
 return {book,leaves,frames,controls,window,media,history,location};
}

test('folding preserves both frame objects and URLs while changing accessible content',()=>{
 const f=bookFixture(),urls=f.frames.map(frame=>frame.src),windows=f.frames.map(frame=>frame.contentWindow);
 f.controls[0].emit('click');
 assert.equal(f.book.dataset.view,'people');assert.equal(f.leaves[1].content.inert,true);assert.equal(f.frames[1].tabIndex,-1);
 f.leaves[1].rail.emit('click');
 assert.equal(f.book.dataset.view,'together');assert.equal(f.controls[1].focused,true);
 assert.equal(f.leaves[1].content.inert,false);
 assert.deepEqual(f.frames.map(frame=>frame.src),urls);assert.deepEqual(f.frames.map(frame=>frame.contentWindow),windows);
});

test('book accepts view messages only from its own same-origin child frames',()=>{
 const f=bookFixture(),message={data:{type:'book-view',view:'ingredients'},origin:f.location.origin,source:f.frames[0].contentWindow};
 f.window.emit('message',{...message,origin:'https://other.test'});assert.equal(f.book.dataset.view,'together');
 f.window.emit('message',{...message,source:{}});assert.equal(f.book.dataset.view,'together');
 f.window.emit('message',{...message,data:{type:'book-view',view:'unknown'}});assert.equal(f.book.dataset.view,'together');
 f.window.emit('message',message);assert.equal(f.book.dataset.view,'ingredients');
});

test('phone switches between full pages and restores the desktop split after resize',()=>{
 const f=bookFixture({phone:true});assert.equal(f.book.dataset.view,'people');
 f.controls[2].emit('click');assert.equal(f.book.lastScroll.left,390);
 f.controls[1].emit('click');assert.equal(f.book.dataset.view,'ingredients','Hidden Together cannot create a split phone view');
 f.book.scrollLeft=0;f.book.emit('scroll');assert.equal(f.book.dataset.view,'people');
 f.media.matches=false;f.media.emit('change');assert.equal(f.book.dataset.view,'together');
});

test('interacting with one pane closes only the other pane, and untrusted messages do nothing',()=>{
 const f=bookFixture(),message={origin:f.location.origin,source:f.frames[0].contentWindow,data:{type:'book-interaction'}};
 f.window.emit('message',{...message,origin:'https://other.test'});f.window.emit('message',{...message,source:{}});
 assert.equal(f.frames[1].contentWindow.messages.length,0);
 f.window.emit('message',message);assert.equal(f.frames[0].contentWindow.messages.length,0);
 assert.equal(f.frames[1].contentWindow.messages[0].data.type,'book-dismiss-dialog');
 f.window.emit('pointerdown');assert.equal(f.frames[0].contentWindow.messages.length,1);
});

for(const phone of [false,true])for(const [kind,view,index] of [['person','people',0],['recipe','ingredients',1]]){
 test(`${phone?'phone':'desktop'} ${kind} deep links select the right pane and retain the exact encoded record`,()=>{
  const value='A & B / naïve',f=bookFixture({phone,hash:'#'+new URLSearchParams({[kind]:value})});
  assert.equal(f.book.dataset.view,view);assert.equal(new URL(f.frames[index].src).searchParams.get(kind),value);
  assert.equal(new URL(f.frames[1-index].src).searchParams.has(kind),false);
  if(phone)assert.equal(f.book.lastScroll.left,index*f.book.clientWidth);
 });
}

test('a changed shared-link hash opens the new exact record without replacing the other pane',()=>{
 const f=bookFixture(),peopleURL=f.frames[0].src;
 f.location.hash='#recipe=halftone';f.window.emit('hashchange');
 assert.equal(f.book.dataset.view,'ingredients');assert.equal(new URL(f.frames[1].src).searchParams.get('recipe'),'halftone');
 assert.equal(f.frames[0].src,peopleURL);
});

for(const phone of [false,true])for(const view of ['people','ingredients']){
 test(`${phone?'phone':'desktop'} #${view} selects the requested section at startup`,()=>{
  const f=bookFixture({phone,hash:'#'+view});assert.equal(f.book.dataset.view,view);
  assert.equal(f.leaves.find(leaf=>leaf.id===view).content.inert,false);
  if(phone)assert.equal(f.book.lastScroll.left,view==='ingredients'?f.book.clientWidth:0);
 });
}

function embeddedFixture({embedded=true,phone=true}={}){
 const messages=[],parent={postMessage(data,origin){messages.push({data,origin});}},window=element({frameElement:embedded?{matches:()=>true}:null});
 const dialog={closed:0,close(){this.closed++;}},document=element({documentElement:element(),querySelector:()=>null,querySelectorAll:()=>[dialog]});
 const location={origin:'https://example.test',href:'https://example.test/notes/living/?book=test',pathname:'/notes/living/'};
 run('embedded.js',{window,parent,document,location,URL,matchMedia:()=>({matches:phone})});
 document.emit('DOMContentLoaded');
 function click(href,{brand=false,metaKey=false}={}){
  const link=element({href,target:'',hasAttribute:()=>false});if(brand)link.classList.add('notes-home');
  const event={target:{closest:()=>link},button:0,metaKey,preventDefault(){this.prevented=true;}};
  document.emit('click',event);return {link,event};
 }
 return {document,window,parent,location,messages,dialog,click};
}

test('standalone pages retain chrome and do not message a parent',()=>{
 const f=embeddedFixture({embedded:false});assert.equal(f.document.documentElement.classList.contains('in-book'),false);
 f.click('/notes/ingredients/techniques.html');f.document.emit('pointerdown');assert.equal(f.messages.length,0);
});

test('embedded routing preserves local anchors, switches sibling views, and allows explicit restart',()=>{
 const f=embeddedFixture();
 const local=f.click('/notes/living/#research');assert.equal(local.event.prevented,undefined);assert.equal(local.link.target,'');
 const sibling=f.click('/notes/ingredients/techniques.html');assert.equal(sibling.event.prevented,true);assert.equal(f.messages.at(-1).data.view,'ingredients');
 const before=f.messages.length,restart=f.click('/',{brand:true});
 assert.equal(restart.event.prevented,undefined);assert.equal(restart.link.target,'_top');assert.equal(f.messages.length,before);
 const resource=f.click('/connections/#languages');assert.equal(resource.link.target,'_top');assert.equal(resource.event.prevented,undefined);
 const modified=f.click('/notes/ingredients/techniques.html',{metaKey:true});assert.equal(modified.event.prevented,undefined);
});

test('child dismissal messages require both the same origin and the actual parent',()=>{
 const f=embeddedFixture(),message={origin:f.location.origin,source:f.parent,data:{type:'book-dismiss-dialog'}};
 f.window.emit('message',{...message,origin:'https://other.test'});f.window.emit('message',{...message,source:{}});assert.equal(f.dialog.closed,0);
 f.window.emit('message',message);assert.equal(f.dialog.closed,1);
});

test('phone swipe forwarding ignores vertical gestures, controls, and cancelled touches',()=>{
 const f=embeddedFixture(),target={closest:()=>null};
 const start=()=>f.document.emit('touchstart',{touches:[{clientX:200,clientY:100}],target});
 const end=(x,y)=>{const event={changedTouches:[{clientX:x,clientY:y}],preventDefault(){this.prevented=true;}};f.document.emit('touchend',event);return event;};
 start();assert.equal(end(100,110).prevented,true);assert.equal(f.messages.at(-1).data.view,'ingredients');
 const count=f.messages.length;start();assert.equal(end(190,250).prevented,undefined,'Vertical reading must remain native');assert.equal(f.messages.length,count);
 start();f.document.emit('touchcancel');assert.equal(end(50,100).prevented,undefined);assert.equal(f.messages.length,count);
 const control={closest:selector=>selector==='button'?{}:null};
 f.document.emit('touchstart',{touches:[{clientX:200,clientY:100}],target:control});assert.equal(end(50,100).prevented,undefined);assert.equal(f.messages.length,count);
});

for(const kind of ['card','tile'])test(`horizontal phone swipes may start on a ${kind} and suppress its synthetic click`,()=>{
 const f=embeddedFixture(),button={className:kind},target={closest:selector=>selector==='button'||selector==='.card,.tile'?button:null};
 const start=()=>f.document.emit('touchstart',{touches:[{clientX:200,clientY:100}],target});
 const end=(x,y)=>{const event={changedTouches:[{clientX:x,clientY:y}],preventDefault(){this.prevented=true;}};f.document.emit('touchend',event);return event;};
 start();assert.equal(end(80,110).prevented,true);assert.equal(f.messages.at(-1).data.view,'ingredients');
 const count=f.messages.length;start();assert.equal(end(198,240).prevented,undefined,'Vertical movement over artwork must remain scrollable');assert.equal(f.messages.length,count);
 start();assert.equal(end(202,101).prevented,undefined,'A normal artwork tap must still open the study');assert.equal(f.messages.length,count);
});

test('dialog closes on primary pointer outside its bounds, but not padding, contents, or scrolling',()=>{
 const dialog=element({closed:0,close(){this.closed++;},getBoundingClientRect:()=>({left:10,right:110,top:20,bottom:220})});
 const context={};run('dialog.js',context);context.dismissOnOutsideTouch(dialog);
 const pointer={target:dialog,button:0,clientX:50,clientY:50,preventDefault(){this.prevented=true;}};
 dialog.emit('pointerdown',{...pointer});dialog.emit('pointerdown',{...pointer,target:{},clientX:0});
 dialog.emit('scroll');dialog.emit('pointermove',{...pointer,clientX:0});
 dialog.emit('pointerdown',{...pointer,button:2,clientX:0});assert.equal(dialog.closed,0);
 const outside={...pointer,clientX:9};dialog.emit('pointerdown',outside);
 assert.equal(dialog.closed,1);assert.equal(outside.prevented,true);
});

test('copying an exact study link uses the shell URL, updates on next record, and clears on close',async()=>{
 const messages=[],copied=[],dialog=element(),head={insertBefore(button){dialog.button=button;}},document={documentElement:element(),createElement:()=>element()};
 document.documentElement.classList.add('in-book');
 dialog.querySelector=selector=>selector==='[data-copy-study]'?dialog.button:selector==='.dialog-bar,.dialog-head'?head:{};
 const context={document,URL,URLSearchParams,location:{origin:'https://example.test'},parent:{postMessage(data,origin){messages.push({data,origin});}},navigator:{clipboard:{async writeText(value){copied.push(value);}}}};
 run('study-links.js',context);context.studyLink(dialog,'recipe','flow & noise');
 const first=dialog.button;assert.equal(new URL(first.dataset.url).hash,'#recipe=flow+%26+noise');
 context.studyLink(dialog,'recipe','second');assert.equal(dialog.button,first);
 first.emit('click');await Promise.resolve();assert.equal(copied[0],'https://example.test/#recipe=second');
 dialog.emit('close');assert.equal(messages.filter(({data})=>data.type==='book-detail-close').length,1);
 assert.equal(messages.at(-1).data.kind,'recipe');
});

test('generated section anchors remain unique, preserve existing IDs, and ignore dialog titles',()=>{
 const headings=[],ids=new Map(),observers=[];
 function heading(text,{id='',dialog=false}={}){
  const h={nodeType:1,textContent:text,_id:id,links:[],matches:selector=>selector==='h2,h3,h4',querySelectorAll:()=>[],querySelector:()=>h.links[0]||null,closest:selector=>selector.includes('dialog')&&dialog?{}:null,append(link){h.links.push(link);},scrollIntoView(){h.scrolled=true;},get id(){return this._id;},set id(value){this._id=value;ids.set(value,this);}};
  if(id)ids.set(id,h);headings.push(h);return h;
 }
 const first=heading('Origins'),second=heading('Origins'),existing=heading('Research',{id:'research'}),ignored=heading('Detail',{dialog:true});
 const document={body:{},documentElement:element(),querySelectorAll:()=>headings,getElementById:id=>ids.get(id),createElement:()=>element()};
 run('section-links.js',{document,URL,location:{href:'https://example.test/notes/living/?book=test#research',hash:'#research'},MutationObserver:class{constructor(callback){observers.push(callback);}observe(){}}});
 assert.equal(first.id,'origins');assert.equal(second.id,'origins-2');assert.equal(existing.id,'research');assert.equal(existing.scrolled,true);
 assert.equal(ignored.links.length,0);assert.equal(new URL(first.links[0].href).searchParams.has('book'),false);
 observers[0]([{addedNodes:[first]}]);assert.equal(first.links.length,1,'Mutation delivery must not duplicate anchors');
 const later=heading('Origins');observers[0]([{addedNodes:[later]}]);assert.equal(later.id,'origins-3');
});

test('primary brand restart is a clean root URL and Recipes has no replacement slogan',()=>{
 const root=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const recipes=readFileSync(new URL('../dist/notes/ingredients/techniques.html',import.meta.url),'utf8');
 assert.match(root,/<a[^>]*class="home-link"[^>]*href="\/"/);
 assert.match(recipes,/<h1>Recipes<\/h1>/i);
 assert.doesNotMatch(recipes,/THE RECIPES\.|THE PEOPLE\.|Techniques are recipes\. People are the ingredients\./);
 assert.doesNotMatch(recipes,/class="recipe-guide"/);
});
