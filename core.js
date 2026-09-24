// @ts-nocheck
export const SAMPLE_ROOT = "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM";
export const KIT_ROOT = "https://cdn.jsdelivr.net/gh/workinwithai-create/PreEight@main/public/samples/drums";
const FLATS = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
export const VOICE_DIR = { harp: "harmonica-mp3", clean: "acoustic_guitar_steel-mp3", bass: "acoustic_bass-mp3" };
export function midiName(midi){ const m=((midi%12)+12)%12; const oct=Math.floor(midi/12)-1; return `${FLATS[m]}${oct}`; }
export function sampleUrl(voice,midi){ return `${SAMPLE_ROOT}/${VOICE_DIR[voice]}/${midiName(midi)}.mp3`; }
function harp(m){ let n=m; while(n<48)n+=12; while(n>84)n-=12; return n; }
function bassNote(m){ let n=m; while(n<28)n+=12; while(n>52)n-=12; return n; }
function guitar(m){ let n=m; while(n<40)n+=12; while(n>76)n-=12; return n; }
function chord(symbol,root,third,fifth,bass,minor){ return { symbol, root:harp(root), third:harp(third), fifth:harp(fifth), bass:bassNote(bass), gRoot:guitar(root), gThird:guitar(third), gFifth:guitar(fifth), minor }; }
export const recipes = [
  { id:"train", name:"Train chord", blurb:"Draw-blow chord punches that ride the changes." },
  { id:"blue", name:"Blue line", blurb:"One minor-pent line across four bars." },
  { id:"call", name:"Call and answer", blurb:"Two bars of a short call, two bars of the answer up." },
  { id:"wail", name:"Held wail", blurb:"Long draws on one and three, then a turn." },
  { id:"cross", name:"Cross harp", blurb:"Second-position neighbor notes. Country pocket." },
  { id:"tag", name:"Last-bar tag", blurb:"Three bars of pocket, last bar holds the fifth." }
];
export const grooves = [
  { id:"porch", name:"Porch Light", bpm:92, key:"E minor", tonic:64, minor:true, blurb:"Night chorus. The harmonica chair is empty.", bars:[ chord("Em",64,67,71,40,true), chord("C",60,64,67,36,false), chord("G",67,71,74,43,false), chord("D",62,66,69,38,false) ] },
  { id:"wire", name:"County Wire", bpm:108, key:"A minor", tonic:69, minor:true, blurb:"Faster pocket. The hook is a harp line.", bars:[ chord("Am",69,72,76,33,true), chord("F",65,69,72,41,false), chord("C",60,64,67,36,false), chord("G",67,71,74,43,false) ] },
  { id:"dust", name:"Dust Road", bpm:84, key:"G major", tonic:67, minor:false, blurb:"Slow major. A harmonica figure finishes the chorus.", bars:[ chord("G",67,71,74,43,false), chord("C",60,64,67,36,false), chord("Em",64,67,71,40,true), chord("D",62,66,69,38,false) ] },
  { id:"freight", name:"Freight Yard", bpm:118, key:"D minor", tonic:62, minor:true, blurb:"Driving minor. The harp is the section change.", bars:[ chord("Dm",62,65,69,38,true), chord("Bb",70,74,77,34,false), chord("F",65,69,72,41,false), chord("C",60,64,67,36,false) ] },
  { id:"amber", name:"Amber Lot", bpm:100, key:"C major", tonic:60, minor:false, blurb:"Open major. Four bars you can hum after one pass.", bars:[ chord("C",60,64,67,36,false), chord("Am",69,72,76,33,true), chord("F",65,69,72,41,false), chord("G",67,71,74,43,false) ] }
];
function hit(step,voice,midi,gain,dur){ return { step, voice, midi, gain, dur }; }
function scaleMidi(tonic,minor,degree){ const scale=minor?[0,3,5,7,10]:[0,2,4,7,9]; const wrapped=((degree%5)+5)%5; const oct=Math.floor(degree/5); return harp(tonic+scale[wrapped]+oct*12); }
function trainHits(c,bar){ const out=[ hit(0,"harp",c.root,0.72,0.38), hit(0,"harp",c.third,0.42,0.36), hit(0,"harp",c.fifth,0.38,0.36), hit(6,"harp",c.root,0.48,0.18), hit(8,"harp",c.fifth,0.62,0.34), hit(12,"harp",c.third,0.4,0.2) ]; if(bar===3) out.push(hit(14,"harp",harp(c.root+12),0.5,0.28)); return out; }
const LINE=[[0,1,2,1,2,3,2,4],[1,2,3,2,0,1,3,2],[2,3,4,3,4,5,4,2],[3,4,5,4,5,6,4,7]]; const STEPS=[0,2,4,6,8,10,12,14];
function blueHits(groove,bar){ return LINE[bar].map((deg,i)=>{ const step=STEPS[i]; const midi=scaleMidi(groove.tonic,groove.minor,deg); const accent=step%4===0; return hit(step,"harp",midi,accent?0.7:0.48,accent?0.3:0.16); }); }
function callHits(groove,bar){ const base=blueHits(groove,bar%2); return bar<2?base:base.map(h=>hit(h.step,h.voice,harp(h.midi+12),h.gain*0.92,h.dur)); }
function wailHits(c){ return [ hit(0,"harp",c.root,0.74,0.7), hit(0,"harp",c.fifth,0.28,0.7), hit(8,"harp",c.fifth,0.66,0.55), hit(14,"harp",c.third,0.42,0.22) ]; }
function crossHits(c,bar){ const neighbor=harp(c.root+(c.minor?3:2)); const out=[ hit(0,"harp",c.root,0.7,0.28), hit(3,"harp",neighbor,0.44,0.12), hit(4,"harp",c.root,0.52,0.16), hit(8,"harp",c.fifth,0.64,0.3), hit(11,"harp",neighbor,0.36,0.1), hit(12,"harp",c.root,0.5,0.22) ]; if(bar%2===1) out.push(hit(14,"harp",harp(c.fifth+12),0.4,0.2)); return out; }
function tagHits(c,bar){ if(bar<3) return trainHits(c,bar); return [ hit(0,"harp",c.root,0.62,0.22), hit(4,"harp",c.third,0.58,0.22), hit(8,"harp",c.fifth,0.7,0.7), hit(8,"harp",harp(c.fifth+12),0.36,0.7) ]; }
export function riffHits(groove,recipeId,bar){ const c=groove.bars[bar]; if(recipeId==="blue") return blueHits(groove,bar); if(recipeId==="call") return callHits(groove,bar); if(recipeId==="wail") return wailHits(c); if(recipeId==="cross") return crossHits(c,bar); if(recipeId==="tag") return tagHits(c,bar); return trainHits(c,bar); }
export function formLength(mode){ return mode==="pass"?8:4; }
export function isHole(mode,formBar){ return mode==="hole"||(mode==="pass"&&formBar<4); }
export function riffIndex(mode,formBar){ if(mode==="pass") return formBar<4?formBar:formBar-4; return formBar%4; }
export function barEvents(groove,recipeId,formBar,mode){ const hole=isHole(mode,formBar); const idx=riffIndex(mode,formBar); const c=groove.bars[idx]; const events=[]; const push=(step,voice,gain,dur,midi)=>events.push({step,voice,gain,dur,midi:midi??null}); push(0,"kick",0.76,0.28); push(8,"kick",0.64,0.26); push(4,"snare",0.48,0.22); push(12,"snare",0.42,0.22); for(let s=0;s<16;s+=2) push(s,"hat",s%4===2?0.1:0.05,0.06); if(!hole&&idx===0) push(0,"crash",0.22,0.7); push(0,"bass",hole?0.5:0.34,0.4,bassNote(c.bass)); push(8,"bass",hole?0.34:0.24,0.28,bassNote(c.bass+7)); if(hole){ push(0,"clean",0.16,1.05,c.gRoot); push(0,"clean",0.12,1.05,c.gThird); push(0,"clean",0.1,1.05,c.gFifth); return { chord:c, hole:true, riffBar:idx, events }; } for(const h of riffHits(groove,recipeId,idx)) push(h.step,h.voice,h.gain,h.dur,h.midi); return { chord:c, hole:false, riffBar:idx, events }; }
const KIT=new Set(["kick","snare","hat","crash"]);
export function collectSamples(){ const map=new Map(); const add=(voice,midi)=>{ if(KIT.has(voice)) return; const key=`${voice}:${midi}`; if(!map.has(key)) map.set(key,{ key, voice, midi, url:sampleUrl(voice,midi) }); }; for(const g of grooves){ for(const r of recipes){ for(let b=0;b<4;b++){ for(const h of riffHits(g,r.id,b)) add(h.voice,h.midi); } } for(let b=0;b<4;b++){ const ev=barEvents(g,"train",b,"hole"); for(const e of ev.events) if(e.midi!=null) add(e.voice,e.midi); const pass=barEvents(g,"train",b+4,"pass"); for(const e of pass.events) if(e.midi!=null) add(e.voice,e.midi); } } return [ { key:"kick", voice:"kick", midi:null, url:`${KIT_ROOT}/kick.mp3` }, { key:"snare", voice:"snare", midi:null, url:`${KIT_ROOT}/snare.mp3` }, { key:"hat", voice:"hat", midi:null, url:`${KIT_ROOT}/hihat.mp3` }, { key:"crash", voice:"crash", midi:null, url:`${KIT_ROOT}/crash.mp3` }, ...map.values() ]; }
export function punchText(groove,recipe){ const lines=groove.bars.map((bar,i)=>{ const hits=riffHits(groove,recipe.id,i); const notes=hits.map(h=>`${h.step+1}:${midiName(h.midi)}`).join(" "); return `  ${i+1}. ${bar.symbol}  ${notes}`; }).join("\n"); return ["HarmFour punch list", `${groove.name} · ${groove.bpm} BPM · ${groove.key} · ${recipe.name}`, "", "The hole: chorus already has a vocal and a kit. No harmonica figure.", `The move: ${recipe.blurb}`, "", "Four bars — live FluidR3 harmonica, steel-string bed, acoustic bass, kit.", lines, "", "Drop the WAV on the chorus. Distinct from RiffFour, AltoFour, LeadFour, AirFour."].join("\n"); }
export function stepHasRiff(hits,step){ return hits.some(h=>h.step===step&&h.voice==="harp"); }
