// All images are original, deterministic, 24-second Canvas studies.
// This is a visual introduction; see each record for limits of the analogy.
const TAU=Math.PI*2;
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const lerp=(a,b,t)=>a+(b-a)*t;
const fade=t=>t*t*t*(t*(t*6-15)+10);
function noise(x,y){let X=Math.floor(x),Y=Math.floor(y);x-=X;y-=Y;const g=(i,j,dx,dy)=>{const a=hash(i*17+j*113)*TAU;return Math.cos(a)*dx+Math.sin(a)*dy};return lerp(lerp(g(X,Y,x,y),g(X+1,Y,x-1,y),fade(x)),lerp(g(X,Y+1,x,y-1),g(X+1,Y+1,x-1,y-1),fade(x)),fade(y))}
function path(c,pts,close=false){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));if(close)c.closePath();c.stroke()}
function dot(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
const dark=new Set(['mohr','whitney','schwartz','reynolds','reas','levin','davis']);
export function drawStudy(canvas,id,seconds=0){const c=canvas.getContext('2d');const W=canvas.width,H=canvas.height,t=(seconds%24)/24*TAU;
c.save();c.setTransform(W/300,0,0,H/300,0,0);c.fillStyle=dark.has(id)?'#141414':'#f0f0ec';c.fillRect(0,0,300,300);c.strokeStyle=c.fillStyle=dark.has(id)?'#ededE8':'#242423';c.lineWidth=1;c.lineJoin='round';c.lineCap='round';
switch(id){
case 'molnar':for(let y=0;y<5;y++)for(let x=0;x<5;x++){const n=x+y*5;for(let k=0;k<4;k++){c.save();c.translate(44+x*53,44+y*53);c.rotate(Math.sin(t+n*2)*.1*(k+1));const s=34-k*7;c.strokeRect(-s/2+Math.sin(t+n)*k,-s/2,s,s);c.restore()}}break;
case 'mohr':{let ps=[];for(let i=0;i<16;i++){let x=(i&1)?1:-1,y=(i&2)?1:-1,z=(i&4)?1:-1,w=(i&8)?1:-1;let xx=x*Math.cos(t)-w*Math.sin(t),ww=x*Math.sin(t)+w*Math.cos(t);let yy=y*Math.cos(t)-z*Math.sin(t),zz=y*Math.sin(t)+z*Math.cos(t);let s=56/(1.7-ww*.28-zz*.16);ps.push([150+xx*s+zz*s*.5,150+yy*s+zz*s*.25])}for(let i=0;i<16;i++)for(let k=0;k<4;k++){let j=i^(1<<k);if(j>i){c.lineWidth=(i+k)%3===0?4:1;c.globalAlpha=(i+k)%3===0?1:.38;path(c,[ps[i],ps[j]])}}c.globalAlpha=1;break}
case 'nake':for(let y=0;y<8;y++){const yy=35+y*30;path(c,[[25,yy],[275,yy+Math.sin(t+y)*7]]);for(let x=0;x<12;x++){let q=hash(y*14+x);if(q>.33)path(c,[[25+x*21,yy],[25+x*21+Math.sin(t+q*8)*14,yy+25]])}}break;
case 'nees':for(let y=0;y<10;y++)for(let x=0;x<9;x++){c.save();const d=y*y*.17;c.translate(45+x*26+Math.sin(t+x*12+y)*d,28+y*26+Math.cos(t+y*17+x)*d);c.rotate(Math.sin(t+x*3+y*7)*y*.10);c.strokeRect(-10,-10,20,20);c.restore()}break;
case 'cohen':for(let i=0;i<7;i++){const x=45+i*35;const h=80+hash(i)*140;c.lineWidth=1.4;path(c,[[x,268],[x+Math.sin(t+i)*13,268-h*.5],[x+Math.sin(t+i)*22,268-h]]);for(let j=1;j<6;j++){const y=268-j*h/6,side=j%2?1:-1;c.beginPath();c.ellipse(x+side*12+Math.sin(t+i)*j*2,y,18,7,side*.7+Math.sin(t)*.2,0,TAU);c.stroke()}}break;
case 'whitney':for(let i=1;i<210;i++){const r=12+Math.sqrt(i/210)*117,a=i*.11+Math.sin(t)*i*.022;dot(c,150+Math.cos(a)*r,150+Math.sin(a)*r,1.1+(i%5)*.18)}break;
case 'schwartz':c.lineWidth=1;for(let j=0;j<2;j++)for(let r=4;r<230;r+=5){c.beginPath();c.arc(150+Math.cos(t+j*Math.PI)*35,150+Math.sin(t+j*Math.PI)*22,r,0,TAU);c.stroke()}break;
case 'perlin':for(let j=0;j<38;j++){let pts=[];for(let x=0;x<=300;x+=4){let n=noise(x*.014+Math.cos(t)*.5,j*.14+Math.sin(t)*.5);pts.push([x,j*8+30*n])}path(c,pts)}break;
case 'reynolds':for(let i=0;i<95;i++){const a=t+hash(i)*TAU,r=35+hash(i+90)*83;const x=150+Math.cos(a)*r,y=150+Math.sin(a*2+Math.sin(t)*.3)*r*.7;c.save();c.translate(x,y);c.rotate(Math.atan2(2*Math.cos(a*2),-Math.sin(a)));c.globalAlpha=.4+hash(i+7)*.6;path(c,[[-4,-2],[4,0],[-4,2]]);c.restore()}break;
case 'sims':for(let y=12;y<290;y+=5)for(let x=12;x<290;x+=5){let f=Math.sin(x*.08+Math.sin(t))+Math.cos(y*.08+Math.cos(t))+Math.sin((x+y)*.06+Math.sin(t));const r=Math.max(.35,1.6+Math.sin(f*2)*1.1);dot(c,x,y,r)}break;
case 'reas':{const pts=Array.from({length:65},(_,i)=>[150+Math.cos(t+hash(i)*TAU)*(30+hash(i+200)*110),150+Math.sin(t+hash(i+15)*TAU)*(30+hash(i+300)*110)]);c.lineWidth=.55;for(let i=0;i<pts.length;i++){dot(c,...pts[i],1.2);for(let j=0;j<i;j++){let d=Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1]);if(d<78){c.globalAlpha=(1-d/90)*.65;path(c,[pts[i],pts[j]])}}}c.globalAlpha=1;break}
case 'fry':{for(let i=0;i<80;i++){let a=i/80*TAU,r=85+Math.sin(i*.9+t)*20;const p=[150+Math.cos(a)*r,150+Math.sin(a)*r],q=[150+Math.cos(a)*35,150+Math.sin(a)*35];c.globalAlpha=.55;path(c,[[150,150],q,p]);c.globalAlpha=1;dot(c,...p,1.5+(i%4)*.8)}}break;
case 'levin':for(let j=0;j<12;j++){let pts=[];for(let i=0;i<100;i++){let a=i/100*TAU,r=70+Math.sin(a*3+t)*25+j*3;pts.push([150+Math.cos(a)*r,150+Math.sin(a)*r*.65+Math.sin(t+a)*20])}c.globalAlpha=.25+j*.06;path(c,pts,true)}c.globalAlpha=1;break;
case 'lieberman':for(let k=0;k<22;k++){let pts=[];for(let i=0;i<130;i++){let a=i/130*TAU,r=15+k*5+Math.sin(a*3+t+k*.07)*10;pts.push([150+Math.cos(a)*r,150+Math.sin(a)*r])}path(c,pts,true)}break;
case 'shiffman':{let pts=[];for(let i=0;i<500;i++){let a=t-i*.006;pts.push([150+Math.sin(a*3)*70+Math.sin(a*7)*39,150+Math.cos(a*2)*70+Math.cos(a*5)*39])}c.lineWidth=.8;path(c,pts);const end=pts[0];c.globalAlpha=.35;path(c,[[150,10],[150+Math.sin(t*3)*70,150+Math.cos(t*2)*70],end]);c.globalAlpha=1;dot(c,...end,5);break}
case 'tarbell':{const grow=.5+.5*Math.sin(t);function branch(x,y,a,len,depth,n){if(!depth)return;const xx=x+Math.cos(a)*len,yy=y+Math.sin(a)*len;c.lineWidth=depth*.22;path(c,[[x,y],[xx,yy]]);const split=.45+hash(n)*.5;branch(xx,yy,a+split,len*(.59+grow*.08),depth-1,n+15);branch(xx,yy,a-split,len*(.63+grow*.08),depth-1,n+29)}for(let i=0;i<4;i++)branch(150,150,i*TAU/4+Math.sin(t)*.15,39,6,i)}break;
case 'davis':for(let y=0;y<6;y++)for(let x=0;x<6;x++){const n=x+y*6;c.save();c.translate(28+x*49,28+y*49);c.rotate(t+hash(n)*TAU);const r=12+Math.sin(t+n)*5;let pts=[];for(let i=0;i<8;i++){let a=i*TAU/8,rr=i%2?r*.4:r;pts.push([Math.cos(a)*rr,Math.sin(a)*rr])}c.lineWidth=1.5;path(c,pts,true);c.restore()}break;
case 'hobbs':c.lineWidth=1.3;for(let i=0;i<75;i++){let x=-10,y=i*5-25,pts=[];for(let j=0;j<115;j++){pts.push([x,y]);let a=Math.sin(x*.015+Math.cos(t)*.6)*.9+Math.cos(y*.022+Math.sin(t)*.6)*.8;x+=Math.cos(a)*3.4;y+=Math.sin(a)*3.4}path(c,pts)}break;
}c.restore()}
