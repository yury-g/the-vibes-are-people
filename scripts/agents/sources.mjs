import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {hash,publicURL} from './core.mjs';
export function publicIPv4(ip){const a=ip.split('.').map(Number);return a.length===4&&a.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&!(a[0]===0||a[0]===10||a[0]===127||a[0]>=224||a[0]===169&&a[1]===254||a[0]===172&&a[1]>=16&&a[1]<=31||a[0]===192&&(a[1]===168||a[1]===0||a[1]===2)||a[0]===100&&a[1]>=64&&a[1]<=127||a[0]===198&&(a[1]===18||a[1]===19||a[1]===51)||a[0]===203&&a[1]===0&&a[2]===113);}
export function toText(html){return html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(_,n)=>{const c=Number(n);return c>0&&c<=0x10ffff?String.fromCodePoint(c):' '}).replace(/\s+/g,' ').trim();}
export async function fetchSource(url,redirects=0){
 const u=publicURL(url);if(redirects>3)throw Error('Too many source redirects');
 const addresses=await lookup(u.hostname,{all:true,family:4});if(!addresses.length||addresses.some(a=>!publicIPv4(a.address)))throw Error('Non-public source address');
 const result=await new Promise((resolve,reject)=>{
  const req=https.get(u,{lookup:(host,opts,cb)=>{const a=addresses[0];cb(null,opts.all?[a]:a.address,4)},headers:{'User-Agent':'VibesIngredientsResearch/1.0 (+https://thevibesarepeople.com/agents/)','Accept':'text/html,text/plain','Accept-Encoding':'identity'}},res=>{
   if([301,302,303,307,308].includes(res.statusCode)){res.resume();resolve({redirect:res.headers.location});return}
   if(res.statusCode!==200){res.resume();reject(Error('Source HTTP '+res.statusCode));return}
   if(!/^(text\/html|text\/plain)/i.test(res.headers['content-type']||'')){res.resume();reject(Error('Source needs HTML or plain text; PDFs are research leads for now'));return}
   let size=0;const chunks=[];res.on('data',chunk=>{size+=chunk.length;if(size>262144){req.destroy(Error('Source exceeds 256 KB'));return}chunks.push(chunk)});res.on('end',()=>resolve({body:Buffer.concat(chunks).toString('utf8')}));res.on('error',reject);
  });const timer=setTimeout(()=>req.destroy(Error('Source timeout')),15000);req.on('close',()=>clearTimeout(timer));req.on('error',reject);
 });
 if(result.redirect)return fetchSource(new URL(result.redirect,u).href,redirects+1);
 const full=toText(result.body);return {url:u.href,text:Buffer.from(full).subarray(0,12000).toString('utf8'),sha256:hash(full),fetchedAt:new Date().toISOString(),truncated:Buffer.byteLength(full)>12000};
}
