const K='subsaver';
let S={subs:[],saved:0,points:0},tab='home',done=null;
try{const d=localStorage.getItem(K);if(d)S=JSON.parse(d)}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY=864e5,today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const iso=n=>new Date(Date.now()+n*DAY).toISOString().slice(0,10);
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const mo=s=>s.cycle==='yearly'?s.cost/12:s.cost;
const active=()=>S.subs.filter(s=>!s.gone);
const idle=s=>Math.round((today()-new Date(s.lastUsed))/DAY);
function nextDue(s){const d=new Date(s.renewal);d.setHours(0,0,0,0);while(d<today()){s.cycle==='yearly'?d.setFullYear(d.getFullYear()+1):d.setMonth(d.getMonth()+1)}return Math.round((d-today())/DAY)}
function demo(){const a=[['Netflix','Streaming',649,'monthly',3,-2],['Spotify','Music',119,'monthly',9,-1],['Gym membership','Fitness',1500,'monthly',5,-75],['Canva Pro','Software',499,'monthly',12,-48],['Adobe Creative Cloud','Software',1675,'monthly',2,-90],['Prime Video','Streaming',1499,'yearly',40,-20],['Cloud storage','Software',130,'monthly',20,-5]];
S.subs=a.map((x,i)=>({id:Date.now()+i,name:x[0],cat:x[1],cost:x[2],cycle:x[3],renewal:iso(x[4]),lastUsed:iso(x[5])}));S.saved=0;S.points=0;save();render()}
function render(){
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  $pts.textContent='Level '+(Math.floor(S.points/50)+1)+' · '+S.points+' pts';
  $view.innerHTML=tab==='home'?home():tab==='review'?review():add();
  if(tab==='review')bindReview();if(tab==='add')bindAdd();
  if(tab==='home'){const d=document.getElementById('demo');if(d)d.onclick=demo;const c=document.getElementById('clear');if(c)c.onclick=()=>{if(confirm('Delete all data?')){S={subs:[],saved:0,points:0};save();render()}};document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go))}
}
function home(){
  const a=active();if(!a.length)return `<div class="empty"><h2>No subscriptions yet</h2><p>Add one, or load sample data to see how it works.</p><p><button id="demo">Load sample data</button></p></div>`;
  const m=a.reduce((t,s)=>t+mo(s),0),soon=a.filter(s=>nextDue(s)<=7).sort((x,y)=>nextDue(x)-nextDue(y)),un=a.filter(s=>idle(s)>=30);
  const li=(s,t)=>`<div class="item"><div><b>${esc(s.name)}</b><small>${esc(s.cat)} · ${inr(s.cost)}/${s.cycle==='yearly'?'yr':'mo'}</small></div>${t}</div>`;
  return `<div class="row"><div class="box hero"><small>You pay every month</small><div class="big">${inr(m)}</div></div>
  <div class="box"><small>Per year</small><div class="big">${inr(m*12)}</div></div>
  <div class="box"><small>Saved so far</small><div class="big" style="color:var(--mint)">${inr(S.saved)}</div></div></div>
  <h2>Renewing in 7 days</h2>${soon.map(s=>li(s,`<span class="tag">${nextDue(s)===0?'Today':'in '+nextDue(s)+'d'}</span>`)).join('')||'<p class="empty">Nothing renews this week.</p>'}
  <h2>Looks unused (30+ days)</h2>${un.map(s=>li(s,`<span class="tag r">${idle(s)}d idle</span>`)).join('')||'<p class="empty">Everything is in use. Nice.</p>'}
  ${un.length?'<p style="margin-top:12px"><button data-go="review">Review them now</button></p>':''}
  <p style="margin-top:24px"><button class="ghost" id="clear">Clear all data</button></p>`}
function review(){
  if(done)return `<div class="box" style="margin-top:16px"><h2 style="margin-top:0">Cancelled ${esc(done.name)}</h2><p>You'll save ${inr(mo(done)*12)} a year. Finish the cancellation on their site:</p><p style="margin:14px 0"><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent('how to cancel '+done.name+' subscription')}">Open cancel guide</a></p><button class="ghost" id="next">Next subscription</button></div>`;
  const q=active().filter(s=>!s.kept).sort((x,y)=>idle(y)-idle(x));
  if(!q.length)return `<div class="empty"><h2>All reviewed</h2><p>Come back next month for another check.</p><p><button id="again">Review again</button></p></div>`;
  const s=q[0];
  return `<p style="margin-top:12px;color:var(--mute)">Swipe right to keep, left to cancel. ${q.length} left.</p>
  <div class="stack"><div class="card" id="card"><small>${esc(s.cat)}</small><div class="big">${esc(s.name)}</div><div>${inr(s.cost)} per ${s.cycle==='yearly'?'year':'month'}</div><div>Last used ${idle(s)} days ago</div><div class="tag ${idle(s)>=30?'r':''}" style="align-self:flex-start;margin-top:8px">Costs ${inr(mo(s)*12)} a year</div></div></div>
  <div class="acts"><button class="no" id="no">Cancel it</button><button class="yes" id="yes">Keep it</button></div>`}
function decide(s,keep){S.points+=10;if(keep){s.kept=true;s.lastUsed=iso(0)}else{s.gone=true;S.saved+=mo(s)*12;done=s}save();render()}
function bindReview(){
  const n=document.getElementById('next');if(n)n.onclick=()=>{done=null;render()};
  const ag=document.getElementById('again');if(ag)ag.onclick=()=>{S.subs.forEach(s=>delete s.kept);save();render()};
  const el=document.getElementById('card');if(!el)return;
  const s=active().filter(x=>!x.kept).sort((x,y)=>idle(y)-idle(x))[0];
  document.getElementById('yes').onclick=()=>decide(s,true);document.getElementById('no').onclick=()=>decide(s,false);
  let x0=null,dx=0;
  el.onpointerdown=e=>{x0=e.clientX;el.setPointerCapture(e.pointerId);el.style.transition='none'};
  el.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;el.style.transform=`translateX(${dx}px) rotate(${dx/15}deg)`;el.className='card '+(dx>40?'k':dx<-40?'c':'')};
  el.onpointerup=()=>{if(x0===null)return;x0=null;el.style.transition='';if(dx>100)decide(s,true);else if(dx<-100)decide(s,false);else{el.style.transform='';el.className='card'}dx=0}
}
function add(){return `<h2>Add a subscription</h2><form id="f"><label for="n">Name</label><input id="n" required placeholder="e.g. Netflix">
<label for="c">Category</label><select id="c"><option>Streaming</option><option>Music</option><option>Fitness</option><option>Software</option><option>Other</option></select>
<label for="p">Cost (₹)</label><input id="p" type="number" min="1" required>
<label for="y">Billed</label><select id="y"><option value="monthly">Every month</option><option value="yearly">Every year</option></select>
<label for="d">Next renewal date</label><input id="d" type="date" required>
<label for="u">When did you last use it?</label><select id="u"><option value="-2">This week</option><option value="-20">This month</option><option value="-60">1-3 months ago</option><option value="-120">Over 3 months ago</option></select>
<p style="margin-top:18px"><button>Save subscription</button></p></form>`}
function bindAdd(){document.getElementById('f').onsubmit=e=>{e.preventDefault();const v=id=>document.getElementById(id).value;
  S.subs.push({id:Date.now(),name:v('n').trim(),cat:v('c'),cost:+v('p'),cycle:v('y'),renewal:v('d'),lastUsed:iso(+v('u'))});S.points+=5;save();go('home')}}
function go(t){tab=t;done=null;render()}
const $view=document.getElementById('view'),$pts=document.getElementById('pts');
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
render();
