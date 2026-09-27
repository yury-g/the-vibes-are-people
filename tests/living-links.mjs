import test from 'node:test';
import assert from 'node:assert/strict';
const mod=await import('../dist/iterations/living-links/physics.js').catch(()=>({}));
test('a hovered glyph remains a stable target while a moving neighbor yields',()=>{
 assert.equal(typeof mod.stepLetters,'function');
 const letters=[{x:100,y:100,hx:100,hy:100,width:30,height:40,vx:0,vy:0,pinned:true},{x:130,y:100,hx:100,hy:100,width:30,height:40,vx:-100,vy:0}];
 for(let i=0;i<300;i++)mod.stepLetters(letters,1/60,{width:320,height:568,time:i/60});
 assert.equal(letters[0].x,100);assert.equal(letters[0].y,100);
 assert(Math.abs(letters[0].x-letters[1].x)>=30||Math.abs(letters[0].y-letters[1].y)>=40);
});
test('several lines of differently sized aquatic letters remain separate',()=>{
 assert.equal(typeof mod.stepLetters,'function');
 const letters=Array.from({length:55},(_,i)=>({x:25+i%11*25,y:110+Math.floor(i/11)*52,hx:25+i%11*25,hy:110+Math.floor(i/11)*52,width:18,height:i<11?34:25,vx:0,vy:0}));
 for(let i=0;i<900;i++){
  mod.stepLetters(letters,[.016,.033,.05][i%3],{width:320,height:568,time:i/60,pointer:{x:160,y:220}});
  for(let a=0;a<letters.length;a++)for(let b=a+1;b<letters.length;b++)assert(Math.abs(letters[a].x-letters[b].x)>=(letters[a].width+letters[b].width)/2-.001||Math.abs(letters[a].y-letters[b].y)>=(letters[a].height+letters[b].height)/2-.001);
 }
});
