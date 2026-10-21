const $=s=>document.querySelector(s),R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const B=[["Fox","🦊",25,7,4,8,0,0],["Cat","🐱",45,6,4,9,0,3],["Frog","🐸",120,4,5,6,0,4],["Pig","🐷",340,5,7,3,0,2],["Duck","🦆",60,4,4,7,0,4],["Mouse","🐭",210,3,3,10,0,3],
["Wolf","🐺",220,9,6,7,150,2],["Bear","🐻",30,10,9,3,150,1],["Panda","🐼",150,8,8,3,200,1],["Octopus","🐙",320,8,5,6,250,4],["Lion","🦁",38,11,7,6,300,0],["Tiger","🐯",28,12,6,8,300,0],
["Eagle","🦅",35,10,4,12,350,3],["Shark","🦈",200,12,6,8,400,4],["Croc","🐊",110,11,10,3,400,2],["Unicorn","🦄",290,10,8,10,700,1],["Dragon","🐉",140,14,10,8,800,0],["Rex","🦖",100,15,9,4,900,2]];
const RN=["Common","Rare","Epic","Legendary"],RM=[1,1.15,1.35,1.6],RC=["#8b8f9a","#5aa9ff","#b57bff","#ffc857"];
let S=JSON.parse(localStorage.animash||"null")||{c:120,g:0,own:["Fox","Cat","Frog","Pig","Duck","Mouse"],book:{},streak:0,wins:0,daily:"",boost:0};
S.ai??=1;S.key??='';S.prog??={};Object.values(S.book).forEach(h=>{h.el??=h.parts.map(n=>B.find(x=>x[0]==n)[7]);h.xp??=0});
const save=()=>{localStorage.animash=JSON.stringify(S);hud()},hud=()=>{$('#c').textContent=S.c;$('#g').textContent=S.g;$('#ai').textContent=S.ai&&navigator.onLine?'AI on':'Offline'};
const base=n=>{const a=B.find(x=>x[0]==n);return Object.assign({id:n,name:n,parts:[n],e:[a[1],a[1]],hue:a[2],atk:a[3],def:a[4],spd:a[5],mul:1,lv:1,xp:0,gen:0,rar:0,el:[a[7],a[7]]},S.prog[n]||{})};
const all=()=>[...S.own.map(base),...Object.values(S.book)],get=id=>all().find(c=>c.id==id);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const st=(h,k)=>Math.round(h[k]*h.mul*(1+.12*(h.lv-1))),pw=h=>st(h,'atk')+st(h,'def')+st(h,'spd'),hpOf=h=>40+st(h,'def')*5+Math.round(pw(h)*1.5);
const art=(c,z)=>c.img?`<div class="cr" style="--h:${c.hue};font-size:${z}px"><i></i><img src="${c.img}" alt=""></div>`:`<div class="cr" style="--h:${c.hue};font-size:${z}px"><i></i><b class="l">${c.e[0]}</b><b class="r">${c.e[1]}</b></div>`;
const stat=(n,v,s=3.2)=>`<div class="st"><span>${n}</span><div class="bar"><u style="width:${Math.min(100,v*s)}%"></u></div><b>${v}</b></div>`;
const pill=h=>`<span class="pill" style="color:${RC[h.rar]}">${RN[h.rar]}</span>`;
const toast=t=>{const e=$('#t');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1800)};
let AC;const beep=f=>{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(.08,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.15);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+.16);navigator.vibrate&&navigator.vibrate(12)};
let BT=null,BO=null,T='fuse',slot=[null,null],F=null,tm,pt;

function fuse(a,b){
 const k=a.id+"+"+b.id,h=hash(k);if(S.book[k])return{h:S.book[k],fresh:0};
 const r=h%100;let rar=r<55?0:r<82?1:r<95?2:3;if(S.boost&&rar<2)rar=2;const j=n=>(h>>>n)%4;
 const o={id:k,name:a.parts[0].slice(0,4)+b.parts.at(-1).toLowerCase(),parts:[a.parts[0],b.parts.at(-1)],e:[a.e[0],b.e[1]],hue:Math.round((a.hue+b.hue)/2),
  atk:Math.round((a.atk+b.atk)/2)+j(3),def:Math.round((a.def+b.def)/2)+j(6),spd:Math.round((a.spd+b.spd)/2)+j(9),mul:RM[rar],lv:1,xp:0,el:[a.el[0],b.el[1]],gen:Math.max(a.gen,b.gen)+1,rar};
 S.book[k]=o;S.boost=0;S.c+=25;return{h:o,fresh:1};
}
const vFuse=()=>`<div class="slots">${[0,1].map(i=>`<button class="slot" data-a="slot" data-d="${i}">${slot[i]?art(slot[i],56)+`<small>${slot[i].name}</small>`:'<span>+</span>'}</button>`).join('<em>×</em>')}</div>
<button class="go" data-a="fuse" ${slot[0]&&slot[1]?'':'disabled'}>${S.boost?'Fuse with boost':'Fuse'}</button><h3>Pick two animals</h3>
<div class="grid">${all().map(c=>`<button class="chip ${slot.some(s=>s&&s.id==c.id)?'sel':''}" data-a="pick" data-d="${c.id}">${art(c,32)}<small>${c.name}</small></button>`).join('')}</div>`;
const vBook=()=>{const l=Object.values(S.book);return`<h3>${l.length} hybrid${l.length==1?'':'s'} discovered</h3>`+(l.length?`<div class="grid g3">${l.map(c=>`<button class="chip" data-a="open" data-d="${c.id}">${art(c,40)}<small>${c.name}</small>${pill(c)}</button>`).join('')}</div>`:'<p class="mu">Your Book is empty. Fuse two animals to start it.</p>')};
const vArena=()=>{const l=all().sort((a,b)=>pw(b)-pw(a));if(!F||!get(F))F=l[0].id;return`<div class="row"><span>Win streak <b>${S.streak}</b></span><span>Total wins <b>${S.wins}</b></span></div><h3>Choose your fighter</h3>
<div class="grid">${l.map(c=>`<button class="chip ${c.id==F?'sel':''}" data-a="fighter" data-d="${c.id}">${art(c,32)}<small>${c.name}</small><small>Lv ${c.lv} ${EI[c.el[0]]}</small></button>`).join('')}</div><button class="go" data-a="battle">Battle</button>`};
const vZoo=()=>`<div class="split"><button data-a="daily" ${S.daily==new Date().toDateString()?'disabled':''}>Daily reward<br><small>60 coins + 1 gem</small></button><button data-a="boost" ${S.g<3||S.boost?'disabled':''}>${S.boost?'Boost ready':'Rarity boost'}<br><small>3 gems · next new fuse is Epic+</small></button></div>
<h3>Animals</h3><div class="grid g3">${B.map(a=>{const o=S.own.includes(a[0]);return`<button class="chip ${o?'':'lk'}" data-a="buy" data-d="${a[0]}" ${o?'disabled':''}>${art(base(a[0]),40)}<small>${a[0]}</small><small>${o?'Owned':a[6]+' coins'}</small></button>`}).join('')}</div>`;
const vPlay=()=>`<h3>Catch</h3><p class="mu">Tap each animal before it hops away. Every catch pays 1 coin.</p><div class="pg" id="pg">${'<button data-a="hit"></button>'.repeat(9)}</div><div class="row"><span>Caught <b id="sc">0</b></span><span><b id="tm">15</b>s</span></div><button class="go" data-a="start">Start</button>`;
const V={fuse:vFuse,arena:vArena,book:vBook,zoo:vZoo,play:vPlay};
function render(){$('#v').innerHTML=V[T]();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.d==T));hud()}

const canAI=h=>S.ai&&navigator.onLine&&!h.ai;
function reveal(r){const h=r.h;$('#m').innerHTML=`<div class="card"><div class="pop" id="rv" data-id="${h.id}">${art(h,110)}</div><h2 id="rn">${h.name}</h2>${pill(h)}<p class="mu" id="rs" style="margin-top:8px">${r.fresh?'New discovery · +25 coins':'Already in your Book'}${canAI(h)&&r.fresh?' · creating with AI…':''}</p>${stat('Health',hpOf(h),.4)}${stat('Attack',st(h,'atk'))}${stat('Defense',st(h,'def'))}${stat('Speed',st(h,'spd'))}<button class="go" data-a="close">Continue</button></div>`;$('#m').classList.add('on');beep(r.fresh?660:330)}
function detail(h){const c=h.lv*40;$('#m').innerHTML=`<div class="card">${art(h,96)}<h2>${h.name}</h2>${pill(h)}<p class="mu" style="margin-top:8px">${EI[h.el[0]]}${EI[h.el[1]]} ${h.parts.join(' × ')} · Level ${h.lv}</p>${stat('Health',hpOf(h),.4)}${stat('Attack',st(h,'atk'))}${stat('Defense',st(h,'def'))}${stat('Speed',st(h,'spd'))}<div class="bar" style="margin-top:14px"><u style="width:${Math.round((h.xp||0)/(30+h.lv*20)*100)}%"></u></div><small>XP ${h.xp||0} / ${30+h.lv*20}</small>${moves(h).map(m=>`<div class="mv"><b>${m.n}</b><span class="mu">${h.lv>=m.u?'Ready':'Unlocks Lv '+m.u}</span></div>`).join('')}${canAI(h)?`<button class="ghost" data-a="gen" data-d="${h.id}">Generate with AI</button>`:''}<button class="ghost" data-a="close">Close</button></div>`;$('#m').classList.add('on')}
function settings(){$('#m').innerHTML=`<div class="card"><h2>AI fusion</h2><p class="mu">New hybrids get an AI-made name and picture while you are online. Offline, Animash blends emoji and names instead.</p><button class="go" data-a="ai">${S.ai?'AI is on':'AI is off'}</button><input id="key" placeholder="Pollinations API key (optional)" value="${S.key}"><button class="ghost" data-a="key">Save key</button><button class="ghost" data-a="close">Close</button></div>`;$('#m').classList.add('on')}
/* AI: Pollinations. Free tier needs no key; add a key in settings if it asks for one. Change the URLs here if the service moves. */
const U=(t,q,p='')=>S.key?`https://gen.pollinations.ai/${t}/${encodeURIComponent(q)}?key=${encodeURIComponent(S.key)}${p}`:t=='image'?`https://image.pollinations.ai/prompt/${encodeURIComponent(q)}?nologo=true${p}`:`https://text.pollinations.ai/${encodeURIComponent(q)}?${p.slice(1)}`;
const tf=(u,ms)=>{const c=new AbortController();setTimeout(()=>c.abort(),ms);return fetch(u,{signal:c.signal}).then(r=>{if(!r.ok)throw 0;return r})};
const Bz=new Set();
async function enhance(h){
 if(!canAI(h)||Bz.has(h.id))return;Bz.add(h.id);const[x,y]=h.parts,sd=hash(h.id);let ok=0;
 const nm=tf(U('text',`Invent one catchy made-up word (4 to 10 letters) as the name of a cute creature that is half ${x} and half ${y}. Reply with only that word.`,`&seed=${sd}`),15000).then(r=>r.text()).then(t=>{t=t.trim();const m=t.length<=24&&t.match(/^[A-Za-z]{3,12}$/);if(m){h.name=t[0].toUpperCase()+t.slice(1).toLowerCase();ok=1}}).catch(()=>{});
 const im=tf(U('image',`cute minimalist creature that is a hybrid of a ${x} and a ${y}, centered, soft studio light, clean dark background, smooth 3d render`,`&width=384&height=384&seed=${sd}`),45000).then(r=>r.blob()).then(async b=>{if(!b.type.startsWith('image'))throw 0;const bm=await createImageBitmap(b),c=document.createElement('canvas');c.width=c.height=256;c.getContext('2d').drawImage(bm,0,0,256,256);h.img=c.toDataURL('image/webp',.8);ok=1}).catch(()=>{});
 await Promise.all([nm,im]);Bz.delete(h.id);
 if(ok){h.ai=1;S.book[h.id]=h;save()}
 const rv=$('#rv');if(rv&&rv.dataset.id==h.id){rv.innerHTML=art(h,110);$('#rn').textContent=h.name;$('#rs').textContent=ok?'AI fusion complete':'Offline fusion · AI unavailable'}
 if(!rv&&$('#m').classList.contains('on')&&ok)detail(h);
 render()}


const EL=["Fire","Nature","Earth","Storm","Water"],EI=["🔥","🌿","⛰️","⚡","💧"],SE=["Burn","Poison","Earth","Stun","Freeze"],TK={Burn:6,Poison:5,Bleed:7};SE[2]="Bleed";
const mx=(a,d)=>d==(a+1)%5?1.5:a==(d+1)%5?.67:1;
const moves=h=>{const[a,b]=h.el,[x,y]=h.parts;return[{n:x+" Strike",p:1,cd:0,u:1,k:'a'},{n:x+" "+["Flame","Thorn","Slam","Bolt","Splash"][a],p:1.6,cd:2,u:2,k:'s',el:a},{n:y+" Guard",p:0,cd:3,u:3,k:'u'},{n:y+" "+["Inferno","Overgrowth","Quake","Tempest","Tsunami"][b],p:2.8,cd:4,u:5,k:'x',el:b}]};
function battle(p){
 const x=base(B[R(0,B.length-1)][0]),y=base(B[R(0,B.length-1)][0]);
 const o={id:'e',name:x.name.slice(0,4)+y.name.toLowerCase(),parts:[x.name,y.name],el:[x.el[0],y.el[1]],e:[x.e[0],y.e[1]],hue:Math.round((x.hue+y.hue)/2),atk:(x.atk+y.atk)/2,def:(x.def+y.def)/2,spd:(x.spd+y.spd)/2,mul:1,lv:Math.max(1,p.lv+R(-1,1))};
 o.mul=pw(p)*(.85+Math.random()*.3+S.streak*.04)/pw(o);
 const f=[p,o],hp=[hpOf(p),hpOf(o)],M=[...hp],cd=[[0,0,0,0],[0,0,0,0]],fx=[{},{}],bf=[0,0],mv=[moves(p),moves(o)];
 let i=st(p,'spd')>=st(o,'spd')?0:1,over=0,wait=1,msg='Fight!';
 const draw=()=>{$('#m').innerHTML=`<div class="card"><div class="vs">${f.map((c,k)=>`<div><div id="a${k}">${art(c,54)}</div><small>${EI[c.el[0]]}${EI[c.el[1]]} ${c.name} · Lv ${c.lv}</small><div class="bar"><u style="width:${hp[k]/M[k]*100}%"></u></div><small>${hp[k]}/${M[k]} ${Object.keys(fx[k]).join(' ')}${bf[k]?' ATK↑':''}</small></div>`).join('')}</div><p class="mu" id="r">${msg}</p><div class="mvs">${mv[0].map((m,n)=>{const lk=p.lv<m.u,c=cd[0][n];return`<button data-a="mv" data-d="${n}" ${lk||c||i||wait?'disabled':''}>${m.n}<small>${lk?'Unlocks Lv '+m.u:c?'Ready in '+c:m.k=='a'?'No cooldown':m.k=='u'?'Heal + ATK up':EL[m.el]+' · CD '+m.cd}</small></button>`}).join('')}</div><button class="ghost" data-a="close">Forfeit</button></div>`};
 const end=w=>{over=1;BT=BO=null;const win=w==0,c=win?30+S.streak*5:5,g=win&&Math.random()<.25?1:0,xp=win?20+S.streak*3:0,L=p.lv;S.c+=c;S.g+=g;win?(S.streak++,S.wins++):S.streak=0;
  p.xp=(p.xp||0)+xp;while(p.lv<20&&p.xp>=30+p.lv*20){p.xp-=30+p.lv*20;p.lv++}if(!S.book[p.id])S.prog[p.id]={lv:p.lv,xp:p.xp};save();
  const nu=moves(p).filter(m=>m.u>L&&m.u<=p.lv).map(m=>m.n);wait=1;msg='';draw();
  $('#m').firstChild.insertAdjacentHTML('afterbegin',`<h2>${win?'Victory':'Defeat'}</h2><p class="mu">+${c} coins${g?' · +1 gem':''}${win?` · +${xp} XP`:''}${p.lv>L?` · Level ${p.lv}!`:''}${nu.length?`<br>Unlocked: ${nu.join(', ')}`:''}</p>`);
  $('#m').querySelector('.vs').nextElementSibling.remove();$('#m').querySelector('.mvs').remove();$('#m').querySelector('.ghost').outerHTML='<button class="go" data-a="close">Continue</button>';beep(win?740:200)};
 const next=()=>{i=1-i;turn()};
 const turn=()=>{if(over)return;let t='';
  for(const s in TK)if(fx[i][s]){const d=Math.max(1,Math.round(M[i]*TK[s]/100));hp[i]=Math.max(0,hp[i]-d);t+=`${s} −${d}. `;if(--fx[i][s]<=0)delete fx[i][s]}
  cd[i]=cd[i].map(v=>Math.max(0,v-1));if(!hp[i])return end(1-i);
  if(fx[i].Stun||fx[i].Freeze){delete fx[i].Stun;delete fx[i].Freeze;msg=t+f[i].name+' cannot move!';wait=1;draw();return setTimeout(next,1100)}
  if(!i){wait=0;msg=t+'Your move';draw()}else{wait=1;msg=t+'Enemy turn…';draw();setTimeout(bot,900)}};
 const act=n=>{const m=mv[i][n],a=f[i],d=f[1-i],j=1-i;cd[i][n]=m.cd;wait=1;let t=`${a.name} used ${m.n}. `,hit=0;
  if(m.k=='u'){const h=Math.round(M[i]*.22);hp[i]=Math.min(M[i],hp[i]+h);for(const s in TK)delete fx[i][s];bf[i]=3;t+=`+${h} HP, attack up.`}
  else if(Math.random()<Math.min(.25,Math.max(0,(st(d,'spd')-st(a,'spd'))*.02)))t+='Dodged!';
  else{const e=m.el==null?1:mx(m.el,d.el[0]),dm=Math.max(2,Math.round(st(a,'atk')*m.p*e*R(85,115)/100*(bf[i]?1.3:1)-st(d,'def')*.3));hp[j]=Math.max(0,hp[j]-dm);hit=1;t+=`−${dm}${e>1?' Super effective!':e<1?' Not very effective.':''}`;
   if(m.el!=null&&hp[j]&&Math.random()<(m.k=='x'?.7:.4)){const s=SE[m.el];fx[j][s]=s=='Stun'||s=='Freeze'?1:3;t+=` ${s}!`}}
  if(bf[i]&&m.k!='u')bf[i]--;msg=t;draw();if(hit){const e=$('#a'+j);e&&e.classList.add('sh')}beep(m.k=='x'?500:j?420:300);
  setTimeout(()=>hp[j]?next():end(i),1200)};
 const bot=()=>{if(over)return;const r=mv[1].map((m,n)=>({m,n})).filter(z=>!cd[1][n]&&o.lv>=z.m.u),pk=k=>r.find(z=>z.m.k==k);act(((hp[1]<M[1]*.35&&pk('u'))||pk('x')||pk('s')||pk('a')).n)};
 BT=n=>{if(!i&&!wait&&!over&&p.lv>=mv[0][n].u&&!cd[0][n])act(n)};BO=()=>{if(!over){over=1;S.streak=0;save()}};
 $('#m').classList.add('on');turn()}
function play(){let s=0,t=15,on=-1;const bs=[...document.querySelectorAll('#pg button')];$('[data-a=start]').disabled=true;
 tm=setInterval(()=>{if(on>=0)bs[on].textContent='';on=R(0,8);bs[on].textContent=B[R(0,B.length-1)][1];},700);
 window.hit=b=>{if(b.textContent){b.textContent='';s++;$('#sc').textContent=s;beep(700)}};
 const cd=setInterval(()=>{$('#tm').textContent=--t;if(!t){clearInterval(cd);clearInterval(tm);window.hit=()=>{};bs.forEach(b=>b.textContent='');S.c+=s;save();toast(`Caught ${s} · +${s} coins`);$('[data-a=start]').disabled=false}},1000)}

document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,d=t.dataset.d;
 if(a=='tab'){T=d;render()}
 else if(a=='pick'){const c=get(d);if(slot.some(s=>s&&s.id==d))return;!slot[0]?slot[0]=c:slot[1]=c;render()}
 else if(a=='slot'){slot[d]=null;render()}
 else if(a=='fuse'){const r=fuse(slot[0],slot[1]);slot=[null,null];save();reveal(r);render();r.fresh&&enhance(r.h)}
 else if(a=='open')detail(S.book[d])
 else if(a=='up'){const h=S.book[d],c=h.lv*40;if(h.lv<10&&S.c>=c){S.c-=c;h.lv++;save();detail(h);beep(600)}}
 else if(a=='fighter'){F=d;render()}
 else if(a=='battle')battle(get(F))
 else if(a=='buy'){const c=B.find(x=>x[0]==d)[6];if(S.c<c)return toast('Not enough coins');S.c-=c;S.own.push(d);save();render();toast(d+' joined your zoo')}
 else if(a=='daily'){S.daily=new Date().toDateString();S.c+=60;S.g++;save();render();toast('+60 coins, +1 gem')}
 else if(a=='boost'){S.g-=3;S.boost=1;save();render()}
 else if(a=='set')settings()
 else if(a=='ai'){S.ai=S.ai?0:1;save();settings()}
 else if(a=='key'){S.key=$('#key').value.trim();save();toast('Key saved')}
 else if(a=='gen'){toast('Creating with AI…');enhance(S.book[d])}
 else if(a=='mv')BT&&BT(+d)
 else if(a=='start')play()
 else if(a=='hit')window.hit&&window.hit(t)
 else if(a=='close'){BO&&BO();$('#m').classList.remove('on');render()}});
addEventListener('online',hud);addEventListener('offline',hud);
render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
