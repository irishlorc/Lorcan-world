if(!document.documentElement.lang)document.documentElement.lang="en";window.__lorReady=1;
// Routing works two ways: hash routes in the single-file preview, real paths on the live site (html[data-mpa]).
const MPA=document.documentElement.hasAttribute("data-mpa");
function keyToHref(k){if(!MPA)return "#"+k;if(k==="home")return "/";if(k.startsWith("post-"))return "/thoughts/"+k.slice(5);if(k.startsWith("studio-"))return "/studio/"+k.slice(7);return "/"+k}
function hrefToKey(h){if(!h)return null;if(h[0]==="#")return h.slice(1)||"home";try{const u=new URL(h,location.href);if(u.origin!==location.origin)return null;const p=u.pathname.replace(/\/+$/,"").replace(/\.html$/,"").replace(/\/index$/,"")||"/";if(p==="/")return "home";const m=p.match(/^\/thoughts\/([a-z0-9-]+)$/);if(m)return "post-"+m[1];const sm=p.match(/^\/studio\/([a-z]+)$/);if(sm)return "studio-"+sm[1];const k=p.slice(1);return PAGES.includes(k)?k:"lost"}catch(e){return null}}
function routeKey(){return MPA?hrefToKey(location.pathname):((location.hash||"#home").slice(1))}
function go(k){if(MPA){history.pushState(null,"",keyToHref(k));route()}else location.hash="#"+k}
const POSTS=[
 {slug:"best-ideas-show-up-on-a-bike",date:null,tag:"Everyday",title:"The best ideas show up on a bike",dek:"Why I stopped trying to have ideas at a desk.",read:3,quote:"The best ideas I've had didn't arrive at a desk.",body:[
  "The best ideas I've had didn't arrive at a desk. They showed up somewhere between home and the shop, on a bike, in a headwind.",
  "Living in the Netherlands, cycling stops being a hobby pretty quickly. It's just how you get around. And because it's ordinary, your head is free. You're not concentrating on anything in particular, so the stuff you've been stuck on starts to untangle itself.",
  "I've tried to recreate that at a desk. Blocking out time to think, closing the laptop, staring out the window. It doesn't really work. There's something about moving, and about not trying, that does it.",
  "So now I treat a ride, or a walk, as part of the work. Not a break from it. If I'm stuck on something, I leave it alone and go somewhere. No headphones. Nine times out of ten, it's sorted by the time I get back.",
  "It feels a bit like cheating. I'll take it."]},
 {slug:"ai-is-a-good-colleague-not-a-boss",date:null,tag:"AI",title:"AI is a good colleague, not a boss",dek:"How I actually use AI tools day to day.",read:4,quote:"Treat it like a sharp new colleague. Useful, fast, and sometimes confidently wrong.",body:[
  "I use AI tools most days. For writing, for building things, for thinking out loud. They've genuinely changed how I work.",
  "But the way I get the most out of them is to treat them like a sharp new colleague. Useful, fast, and sometimes confidently wrong. You wouldn't hand a new starter your biggest client on day one and walk off. Same idea.",
  "The good bit is the speed. You can try five versions of something in the time it used to take to do one. That changes how you work, because trying things gets cheap.",
  "The risky bit is that it all sounds right. So you still need taste, and you still need to know what good looks like. The tool doesn't replace judgement. It makes judgement more important.",
  "My rule is simple. Let it do the first draft. I do the last one."]},
 {slug:"creative-people-should-talk-about-money",date:null,tag:"Business",title:"Creative people should talk about money more",dek:"Being good at the work is only half of it.",read:3,quote:"Being good at the work is only half of it.",body:[
  "A lot of creative people I know are brilliant at the work and awkward about the money. I get it. Talking about price can feel like it cheapens the thing you care about.",
  "But being good at the work is only half of it. If you can't explain what it's worth, someone else will decide for you, and they'll usually pick a lower number.",
  "Working on the commercial side has helped me here. Most money conversations aren't confrontations. They're just two people trying to work out if something makes sense for both of them.",
  "Ask what the person is trying to achieve. Be clear about what you'll do and what it costs. Then stop talking. It's simpler than it feels.",
  "Nobody's going to think less of your work because you priced it properly. If anything, the opposite."]},
 {slug:"what-dutch-directness-did-to-me",date:null,tag:"Everyday",title:"What Dutch directness did to me",dek:"Nearly nine years of people saying exactly what they mean.",read:3,quote:"It turns out you can be direct and kind at the same time.",body:[
  "When I moved to the Netherlands, the directness took some getting used to. Coming from Ireland, where we can spend five minutes politely circling a point, it was a shock to just hear it.",
  "\"That idea won't work.\" No softening. No \"ah, it's grand, but maybe\". Just the point.",
  "Over time I started to like it. It saves an enormous amount of time. You know where you stand, and nobody has to guess what anyone meant.",
  "The trick I picked up is that directness isn't the same as rudeness. It turns out you can be direct and kind at the same time. Say the thing clearly, then help fix it.",
  "I've kept a bit of the Irish warmth and a bit of the Dutch clarity. Most days, I think it's a decent mix."]},
 {slug:"build-the-small-version-first",date:null,tag:"Technology",title:"Build the small version first",dek:"The quickest way to find out if an idea is any good.",read:3,quote:"A small thing that works teaches you more than a big plan.",body:[
  "Every time I've built something, the first version I imagined was far too big. Features, settings, dashboards. All of it before anyone had used the thing once.",
  "What actually works is building the smallest version that does the one job. Then putting it in front of someone and watching.",
  "A small thing that works teaches you more than a big plan. You find out quickly what people actually use, and it's rarely what you expected.",
  "Modern tools make this easier than ever. You can go from idea to something real in a weekend. There's no excuse to spend months guessing.",
  "Start small, learn fast, then decide what's worth making bigger."]},
 {slug:"the-second-coffee",date:null,tag:"Creativity",title:"The second coffee is where it happens",dek:"On meetings, conversations and slowing down a bit.",read:2,quote:"The first coffee is the agenda. The second one is the conversation.",body:[
  "I've noticed something about meeting people for coffee. The first coffee is the agenda. The second one is the conversation.",
  "The first round is polite. You cover what you came to talk about. Then, if there's time, someone says \"another?\" and things loosen up.",
  "That's usually when the interesting stuff comes out. The idea someone hasn't told anyone yet. The problem they're actually trying to solve. The thing that connects to something you're working on.",
  "So I try not to rush. Leave a bit of room at the end. Order the second one.",
  "Worst case, you've had two coffees. There are worse outcomes."]}
];
const TAGS=["All","Technology","AI","Creativity","Business","Everyday"];
const $=s=>document.querySelector(s);
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const arrow='<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeTag="All";

function postCard(p,extra=""){
  return `<a class="post rv${extra}" href="${keyToHref("post-"+p.slug)}"><span class="tag">${p.tag}</span><h2>${esc(p.title)}</h2><p>${esc(p.dek)}</p><span class="meta"><span>${p.read} min read</span><span class="go">Read ${arrow}</span></span></a>`;
}
function renderFilters(){
  if(!$("#filters"))return;
  const cnt=t=>t==="All"?POSTS.length:POSTS.filter(p=>p.tag===t).length;
  $("#filters").innerHTML=TAGS.map(t=>`<button class="filter" type="button" aria-pressed="${t===activeTag}" data-tag="${t}">${t}<span class="fc">${cnt(t)}</span></button>`).join("");
}
function renderPosts(){
  if(!$("#posts"))return;
  const list=POSTS.filter(p=>activeTag==="All"||p.tag===activeTag);
  $("#posts").innerHTML=list.map((p,i)=>i===0&&activeTag==="All"
    ?`<a class="post lead" href="${keyToHref("post-"+p.slug)}"><div><span class="tag">${p.tag}</span><h2>${esc(p.title)}</h2><p>${esc(p.dek)}</p><span class="meta"><span>${p.read} min read</span><span class="go">Read ${arrow}</span></span></div><blockquote class="post-q">${esc(p.quote)}</blockquote></a>`
    :postCard(p)).join("");
  [...$("#posts").children].forEach((c,i)=>{c.style.setProperty("--i",i);c.classList.remove("rv")});
}
$("#filters")&&$("#filters")?.addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;activeTag=b.dataset.tag;renderFilters();renderPosts();widont($("#posts"))});

function renderArticle(slug){
  const i=POSTS.findIndex(p=>p.slug===slug);if(i<0)return false;
  const p=POSTS[i],n=POSTS[(i+1)%POSTS.length];
  $("#article").innerHTML=`<a class="back" href="${keyToHref("thoughts")}">${arrow} All thoughts</a>
   <h1>${esc(p.title)}</h1><p class="stand">${esc(p.dek)}</p>
   <p class="byline"><b>Lorcán O'Neill</b>${p.date?`<time datetime="${p.date}">${new Date(p.date+"T12:00:00").toLocaleDateString("en-IE",{day:"numeric",month:"long",year:"numeric"})}</time>`:""}<span>${p.tag}</span><span>${p.read} min read</span></p>
   <div class="body-copy">${p.body.map(x=>`<p>${esc(x)}</p>`).join("")}</div>
   <div class="next"><span class="label" style="margin-top:28px">Up next</span>${postCard(n)}</div>`;
  document.title=p.title+" | Lorcán O'Neill";
  if(typeof widont==="function")widont($("#article"));
  return true;
}

const PAGES=["home","about","experience","work","websites","studio","studio-wadden","studio-kindling","studio-rune","studio-fold","thoughts","contact"];
const TITLES={"home":"Lorcan — Creative, Business & AI","about":"About Lorcan | Dublin, the Netherlands & Arkintel","experience":"Experience: Design, Comms, Business & Tech | Lorcan","work":"Work | Organisations Lorcan Has Worked For and With","websites":"Websites | Selected Digital Work by Lorcan","studio":"The Possibilities Studio | Lorcan","studio-wadden":"WADDEN: Maritime Robotics Brand Concept | Lorcan","studio-kindling":"Kindling: Small-Business Software Brand Concept | Lorcan","studio-rune":"RUNE: Premium Audio Brand Concept | Lorcan","studio-fold":"FOLD: Modular Furniture Brand Concept | Lorcan","thoughts":"Thoughts | Lorcan on AI, Creativity & Business","contact":"Contact Lorcan | Say Hello","lost":"Page not found | Lorcan"};
let swapT=null,firstRoute=true;
function route(){
  const h=routeKey();
  if(h==="main")return;
  let page=h,nav=h.startsWith("studio-")?"studio":h;
  if(h.startsWith("post-")){page=renderArticle(h.slice(5))?"post":"lost";nav=page==="post"?"thoughts":""}
  else if(!PAGES.includes(h)){page="lost";nav=""}
  document.querySelectorAll(".links a,.sheet a,.sig-nav a").forEach(a=>{hrefToKey(a.getAttribute("href"))===nav?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")});
  closeMenu();
  const cur=document.querySelector("[data-page]:not([hidden])");
  clearTimeout(swapT);
  if(cur&&!firstRoute&&!reduced&&(cur.dataset.page!==page||page==="post")){curtain(cur);showPage(page)}
  else showPage(page);
  firstRoute=false;
}
function showPage(page){
  document.querySelectorAll("[data-page]").forEach(el=>{
    const on=el.dataset.page===page;
    if(on&&(el.hidden||page==="post")){el.hidden=false;replayAnims(el)}
    else if(!on)el.hidden=true;
  });
  if(page!=="post")document.title=TITLES[page];
  window.scrollTo({top:0,left:0,behavior:"instant"});
  requestAnimationFrame(armReveal);
  requestAnimationFrame(()=>typeof armSpots==="function"&&armSpots());
  if(typeof onPageShown==="function")requestAnimationFrame(()=>onPageShown(page));
}
if(!MPA)window.addEventListener("hashchange",route);
else{
  // old #about style links become real paths
  if(location.hash){const k=location.hash.slice(1);if(PAGES.includes(k)||(k.startsWith("post-")&&POSTS.some(p=>"post-"+p.slug===k)))history.replaceState(null,"",keyToHref(k))}
  document.addEventListener("click",e=>{
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest("a[href]");if(!a||(a.target&&a.target!=="_self")||a.hasAttribute("download"))return;
    const href=a.getAttribute("href");if(!href||href[0]==="#"||/^[a-z]+:/i.test(href)&&!href.startsWith(location.origin))return;
    const k=hrefToKey(href);if(!k||k==="lost")return;
    const pg=k.startsWith("post-")?"post":k;
    if(!document.querySelector('[data-page="'+pg+'"]')||(pg==="post"&&!POSTS.some(p=>"post-"+p.slug===k)))return; // let the browser load it
    e.preventDefault();
    if(k===routeKey()){closeMenu();return}
    history.pushState(null,"",keyToHref(k));route();
  });
  addEventListener("popstate",route);
}

const menuBtn=$("#menuBtn"),sheet=$("#sheet");
function setMenu(open){if(!open&&!sheet.hidden&&!reduced){sheet.classList.add("closing");setTimeout(()=>{sheet.hidden=true;sheet.classList.remove("closing")},170)}else sheet.hidden=!open;menuBtn.setAttribute("aria-expanded",String(open));menuBtn.innerHTML=`<span class="mt">${open?"Close":"Menu"}</span><svg aria-hidden="true"><use href="#i-${open?"close":"menu"}"/></svg>`}
function closeMenu(){setMenu(false)}
menuBtn.addEventListener("click",()=>setMenu(sheet.hidden));
sheet.addEventListener("click",e=>{const a=e.target.closest("a");if(a&&hrefToKey(a.getAttribute("href"))===routeKey())closeMenu()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!sheet.hidden){closeMenu();menuBtn.focus()}});

const EMAIL="lorcancreative@gmail.com";
let toastT;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2200)}
function copyEmail(){
  const btn=$("#copyBtn"),lbl=btn.querySelector("span");
  const done=()=>{lbl.textContent="Copied";btn.classList.add("ok");toast("Email address copied");setTimeout(()=>{lbl.textContent="Copy email";btn.classList.remove("ok")},2000)};
  const fallback=()=>{const r=document.createRange();r.selectNodeContents($("#emailText"));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);toast("Address selected. Copy it from your keyboard or menu")};
  try{navigator.clipboard.writeText(EMAIL).then(done,fallback)}catch(e){fallback()}
}
$("#copyBtn")&&$("#copyBtn")?.addEventListener("click",copyEmail);
// Contact form (Web3Forms)
(function(){const f=document.getElementById("talkForm");if(!f)return;const st=document.getElementById("tfStatus"),btn=f.querySelector(".tf-send"),lbl=btn.querySelector(".tf-l"),done=document.getElementById("tfDone");
f.addEventListener("submit",async e=>{e.preventDefault();st.className="tf-status";st.textContent="";
  let bad=null;f.querySelectorAll("input[required],textarea[required]").forEach(i=>{const ok=i.value.trim()&&i.checkValidity();i.setAttribute("aria-invalid",String(!ok));if(!ok&&!bad)bad=i});
  if(bad){st.className="tf-status err";st.textContent=bad.type==="email"&&bad.value.trim()?"That email address doesn't look right.":"Please fill in your name, email and message.";bad.focus();return}
  if(f.botcheck.checked)return;
  btn.disabled=true;lbl.textContent="Sending…";
  try{const r=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify((()=>{const o=Object.fromEntries(new FormData(f));const n=String(o.name||"").trim().replace(/\s+/g," ").slice(0,60);o.subject=n?`Message from ${n} · lorcan.space`:"New message · lorcan.space";o.replyto=o.email;return o})())});const d=await r.json().catch(()=>({}));
    if(r.ok&&d.success!==false){f.hidden=true;done.hidden=false;done.focus();f.reset()}else throw new Error(d.message||"failed")}
  catch(err){st.className="tf-status err";st.textContent="Something went wrong. Please try again, or email lorcancreative@gmail.com.";btn.disabled=false;lbl.textContent="Send message"}
});
f.addEventListener("input",e=>{if(e.target.getAttribute("aria-invalid")==="true"&&e.target.value.trim()&&e.target.checkValidity())e.target.setAttribute("aria-invalid","false")});
})();

$("#toTop")?.addEventListener("click",()=>window.scrollTo({top:0,behavior:reduced?"auto":"smooth"}));



// Typesetting: keep the last two words of every text block together, so no line ends on a lone word.
function widont(root=document){
  root.querySelectorAll("h1,h2,h3,p,li,blockquote,.lbl,.ln,.sheet small").forEach(el=>{
    if(el.closest(".cycle")||el.querySelector(".ln")||el.dataset.wd)return;
    const nodes=[];const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())if(!n.parentElement.closest(".sr,[aria-hidden='true']"))nodes.push(n);
    let seen=0;
    for(let i=nodes.length-1;i>=0;i--){const t=nodes[i].textContent;const trimmed=t.replace(/\s+$/,"");
      if(!seen){if(!trimmed)continue;const k=trimmed.search(/\s\S+$/);if(k>=0){nodes[i].textContent=trimmed.slice(0,k)+"\u00a0"+trimmed.slice(k+1)+t.slice(trimmed.length);break}seen=1;continue}
      const m=t.match(/\s+$/);if(m){nodes[i].textContent=t.slice(0,t.length-m[0].length)+"\u00a0";break}
      if(/\s/.test(t))break;}
    el.dataset.wd=1;
  });
}


function replayAnims(root){root.style.animation="none";root.offsetHeight;root.style.animation="";root.querySelectorAll(".rise>*,.hero-grid>*,.enter,.mi,.acc").forEach(c=>{c.style.animation="none";c.offsetHeight;c.style.animation=""})}


// ---------- Motion v2 ----------
const fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
// headline masks
function maskHeads(){
  document.querySelectorAll(".page h1.display:not(.talk-h),.page h2.title").forEach(h=>{
    if(h.dataset.mk)return;h.dataset.mk=1;
    const lines=h.querySelectorAll(":scope>.ln");
    if(lines.length)lines.forEach((l,k)=>{l.classList.add("mline");l.innerHTML=`<span class="mi" style="--k:${k}">${l.innerHTML}</span>`});
    else h.innerHTML=`<span class="mline"><span class="mi">${h.innerHTML}</span></span>`;
  });
}
// parallax: one passive rAF loop, transform only
let parEls=[],parTick=false;
function collectPar(){parEls=[...document.querySelectorAll(".page:not([hidden]) [data-par]")].map(el=>({el:el.tagName==="FIGURE"?el.querySelector("img"):el,f:parseFloat(el.dataset.par)}))}
function parFrame(){parTick=false;const vh=innerHeight;if(document.documentElement.scrollHeight<=vh+4)return;for(const p of parEls){const r=p.el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)continue;const d=(r.top+r.height/2-vh/2)*-p.f;p.el.style.transform=`translate3d(0,${d.toFixed(1)}px,0) scale(1.12)`}}
if(!reduced)addEventListener("scroll",()=>{if(!parTick){parTick=true;requestAnimationFrame(parFrame)}},{passive:true});
// hero leans toward the cursor
if(fine&&!reduced){
  const hp=$(".hero-panel"),hi=hp&&hp.querySelector("img");
  hp&&hp.addEventListener("pointermove",e=>{if(hp.classList.contains("dragging"))return;const r=hp.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;hp.style.setProperty("--gx",(x*100).toFixed(0)+"%");hp.style.setProperty("--gy",(y*100).toFixed(0)+"%")});
  
  // the thinker follows you
  const th=$("#thinker img");
  document.addEventListener("pointermove",e=>{if(!th||th.closest("[hidden]"))return;const r=th.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/innerWidth,dy=(e.clientY-(r.top+r.height/2))/innerHeight;th.style.transform=`translateX(calc(-50% + ${(dx*10).toFixed(1)}px)) translateY(${(dy*6).toFixed(1)}px) rotate(${(dx*4).toFixed(2)}deg)`},{passive:true});
}
// experience: count the years up
let yrsDone=false;
function countYears(){const el=$("#yrs");if(!el||reduced)return;const t0=performance.now(),D=1100;el.textContent="0";const step=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);el.textContent=Math.round(10*e);if(k<1)requestAnimationFrame(step)};setTimeout(()=>requestAnimationFrame(step),450)}
// contact: Lor waves, and waves back
const waver=$("#waver");let waveT=null;
function wave(delay=0){if(reduced||!waver)return;clearTimeout(waveT);waveT=setTimeout(()=>{waver.classList.remove("waving");void waver.offsetWidth;waver.classList.add("waving");setTimeout(()=>waver.classList.remove("waving"),1300)},delay)}
waver&&waver.querySelector(".talk-rig").addEventListener("click",()=>wave(0));
fine&&waver&&waver.addEventListener("pointerenter",()=>{if(!waver.classList.contains("waving"))wave(0)});
// per-page entrance hooks
function onPageShown(page){
  maskHeads();collectPar();parFrame();
  if(page==="experience")countYears();
  if(page==="contact")wave(1000);
  if(page==="lost")onLost();
  window.headerOnRoute&&headerOnRoute(page);
  $("#readBar").style.transform="scaleX(0)";
  if(typeof armWatches==="function"){armWatches();watched.forEach(placeWatch)}
  if(document.documentElement.classList.contains("wires")){wiresLayer.style.height="0px";setTimeout(drawWires,700)}else{wiresLayer.innerHTML="";wiresLayer.style.height="0px"}
}
// close the sheet when tapping outside it
document.addEventListener("click",e=>{if(sheet.hidden)return;const path=e.composedPath();if(!path.includes(sheet)&&!path.includes(menuBtn))closeMenu()});
// back to top launches
$("#toTop")?.addEventListener("click",()=>{const b=$("#toTop");b.classList.remove("launch");void b.offsetWidth;b.classList.add("launch")});
// a little hello when you wander off
const baseTitle=()=>document.title;let savedTitle="";
document.addEventListener("visibilitychange",()=>{if(document.hidden){savedTitle=document.title;document.title="Come back soon 👋"}else if(savedTitle){document.title=savedTitle;savedTitle=""}});
setTimeout(()=>document.querySelectorAll('#egg img').forEach(i=>i.loading='eager'),2500);
console.log("%cHello, curious one. — Lor","color:#FF6A00;font:600 14px sans-serif");




// Spotlights: later sections wait in the dark and light up as they arrive
let spotIO=null;
function armSpots(){
  if(!("IntersectionObserver" in window)||reduced)return;
  spotIO&&spotIO.disconnect();
  spotIO=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("lit");spotIO.unobserve(en.target)}}),{threshold:.12});
  const list=[...document.querySelectorAll(".page:not([hidden])>.sec:not(:first-child)"),document.querySelector(".site-foot")];
  list.forEach(el=>{el.classList.add("spot");el.classList.remove("lit");void el.offsetWidth;spotIO.observe(el)});
}

// Curtain: snapshot what's on screen, split it, draw it aside over the new page
function curtain(cur){
  document.querySelectorAll(".curtain").forEach(c=>c.remove());
  const box=document.createElement("div");box.className="curtain";box.setAttribute("aria-hidden","true");
  const top=$("#main").getBoundingClientRect().top;
  const snap=()=>{const w=document.createElement("div");w.className="snap";w.style.top=top+"px";
    const p=cur.cloneNode(true);p.hidden=false;p.removeAttribute("data-page");
    const f=document.querySelector("footer").cloneNode(true);
    [p,f].forEach(n=>{n.querySelectorAll("[id]").forEach(e=>e.removeAttribute("id"));n.querySelectorAll(".pre").forEach(e=>e.classList.remove("pre"));w.appendChild(n)});
    return w};
  ["l","r"].forEach(side=>{const h=document.createElement("div");h.className="ct "+side;h.appendChild(snap());const sh=document.createElement("i");sh.className="shade";h.appendChild(sh);box.appendChild(h)});
  document.body.appendChild(box);
  setTimeout(()=>box.remove(),820);
}

// Liquid orange: a soft highlight that flows toward the pointer, then settles
(function(){
  if(!fine||reduced)return;
  const els=()=>document.querySelectorAll(".page:not([hidden]) h1 .acc, .btn-primary, .xp-contact");
  document.querySelectorAll("h1 .acc,.btn-primary,.xp-contact").forEach(e=>e.classList.add("liquid"));
  const st=new WeakMap();let mx=-1e4,my=-1e4,raf=0,last=0;
  addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;last=performance.now();if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
  function loop(t){
    raf=0;let moving=false;
    els().forEach(el=>{
      const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
      const reach=Math.max(r.width,r.height)*1.6,dx=mx-(r.left+r.width/2),dy=my-(r.top+r.height/2),dist=Math.hypot(dx,dy);
      const pull=Math.max(0,1-dist/reach);
      const tx=pull?Math.min(100,Math.max(0,(mx-r.left)/r.width*100)):30,ty=pull?Math.min(100,Math.max(0,(my-r.top)/r.height*100)):40;
      const s=st.get(el)||{x:30,y:40};s.x+=(tx-s.x)*.12;s.y+=(ty-s.y)*.12;st.set(el,s);
      el.style.setProperty("--lx",s.x.toFixed(1)+"%");el.style.setProperty("--ly",s.y.toFixed(1)+"%");
      if(Math.abs(tx-s.x)>.3||Math.abs(ty-s.y)>.3)moving=true;
    });
    if(moving||performance.now()-last<200)raf=requestAnimationFrame(loop);
  }
})();


// =====================================================================
// SHOW THE WIRES
// =====================================================================
const wiresLayer=$("#wiresLayer"),wiresT=$("#wiresT");
const NOTES={
  home:[["h1","Changes with the time of day. Try 2am."],[".xp","Five doors. Five different tricks."]],
  about:[["h1","The one word in italics is always the point."],[".photo","Coffee: canon."]],
  experience:[["#yrs","Counts up. Every time. Sorry."],[".now","Current. Not a case study."]],
  websites:[["h1","Real screenshots. No templates."],[".wsp-steps","Six steps. One coffee."]],
  work:[["h1","No captions. The cards do the talking."],[".bc-grid","Ten cards. Identical sizes. I measured."]],
  thoughts:[["h1","Short notes. Written the way I'd say them."],[".filters","Real filters. They actually filter."]],
  contact:[["h1","Big type, one form, one address."],[".talk-fig","Wave at him. He waves back."]],
  lost:[["h1","You're not lost. The page is."],[".lost-door","It doesn't go anywhere. Honestly."]],
  post:[["h1","Max 700px wide. Your eyes will thank me."]]
};
function px(n){return Math.round(parseFloat(n))}
function drawWires(){
  wiresLayer.innerHTML="";wiresLayer.style.height="0px";const ft=document.querySelector("footer");wiresLayer.style.height=Math.ceil(ft?ft.getBoundingClientRect().bottom+scrollY:document.body.offsetHeight)+"px";
  const page=document.querySelector(".page:not([hidden])");if(!page)return;
  const sy=scrollY,add=(el,txt,cls,d,dx=0,dy=-6)=>{const r=el.getBoundingClientRect();if(!r.width)return;const l=document.createElement("span");l.className="wl"+(cls?" "+cls:"");l.textContent=txt;l.style.left=Math.max(8,Math.min(innerWidth-240,r.left+dx))+"px";l.style.top=(r.top+sy+dy)+"px";l.style.setProperty("--d",d+"s");wiresLayer.appendChild(l);return l};
  let d=.25;
  page.querySelectorAll("h1,h2").forEach(h=>{const c=getComputedStyle(h);add(h,`${h.tagName} · Bricolage ${c.fontWeight} · ${px(c.fontSize)}/${px(c.lineHeight)||"1"} · ${(parseFloat(c.letterSpacing)/parseFloat(c.fontSize)).toFixed(3)}em`,"",d+=.05)});
  const le=page.querySelector(".lede");if(le){const c=getComputedStyle(le);add(le,`lede · ${px(c.fontSize)}px · max ${Math.round(le.getBoundingClientRect().width)}px`,"",d+=.05)}
  const bt=page.querySelector(".btn-primary");if(bt){const c=getComputedStyle(bt);add(bt,`button · ${px(c.height)}px · r${px(c.borderTopLeftRadius)} · gradient 135°`,"",d+=.05)}
  const w=page.querySelector(".wrap");if(w){const c=getComputedStyle(w);const l=add(w,`gutter ${px(c.paddingLeft)}px`,"gap",d+=.05,0,40);if(l){l.style.height="18px"}}
  page.querySelectorAll(".sec").forEach(sc=>{const r=sc.getBoundingClientRect(),pb=px(getComputedStyle(sc).paddingBottom);if(pb<20)return;const l=document.createElement("span");l.className="wl gap";l.textContent=`section space ${pb}px`;l.style.left=(innerWidth-170)+"px";l.style.top=(r.bottom+sy-pb)+"px";l.style.height=pb+"px";l.style.setProperty("--d",(d+=.05)+"s");wiresLayer.appendChild(l)});
  (NOTES[page.dataset.page]||[]).forEach(([sel,txt],i)=>{const el=page.querySelector(sel);if(el)add(el,txt,"note",.6+i*.15,Math.min(el.getBoundingClientRect().width*.55,innerWidth*.4),-14)});
}
function setWires(on){
  const sc=$("#wiresScan");sc.className="wires-scan";void sc.offsetWidth;if(!reduced)sc.classList.add(on?"run":"back");
  if(on){drawWires();document.documentElement.classList.add("wires")}else{document.documentElement.classList.remove("wires");clearTimeout(setWires.t);setWires.t=setTimeout(()=>{if(!document.documentElement.classList.contains("wires")){wiresLayer.innerHTML="";wiresLayer.style.height="0px"}},950)}
  wiresT.setAttribute("aria-checked",String(on));
}
wiresT.addEventListener("click",()=>setWires(!document.documentElement.classList.contains("wires")));
let wrT=null;addEventListener("resize",()=>{if(!document.documentElement.classList.contains("wires"))return;clearTimeout(wrT);wrT=setTimeout(drawWires,150)});

// =====================================================================
// Draggable Lor: spring physics, a cheeky reaction, home again
// =====================================================================
function makeDraggable(el,{box,onRelease,onGrab}={}){
  if(reduced)return;
  el.classList.add("drag-me");el.draggable=false;
  let x=0,y=0,vx=0,vy=0,tx=0,ty=0,drag=false,sx=0,sy=0,raf=0,lastT=0,px0=0,py0=0,moved=false,pid=null,hist=[];
  const base=()=>el.dataset.base||"";
  function render(){const rot=Math.max(-25,Math.min(25,vx*.035)),sq=1+Math.min(.08,Math.abs(vy)*.00012);el.style.transform=`${base()} translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${(1/sq).toFixed(3)},${sq.toFixed(3)})`}
  function step(t){
    const dt=Math.min(.032,(t-(lastT||t))/1000)||.016;lastT=t;
    if(!drag){const k=170,c=13;vx+=(-k*x-c*vx)*dt;vy+=(-k*y-c*vy)*dt;x+=vx*dt;y+=vy*dt;
      if(Math.abs(x)<.3&&Math.abs(y)<.3&&Math.abs(vx)<5&&Math.abs(vy)<5){x=y=vx=vy=0;el.style.transform=base()?base():"";raf=0;box&&box.classList.remove("dragging");return}}
    render();raf=requestAnimationFrame(step)}
  el.addEventListener("pointerdown",e=>{if(e.button>0)return;pid=e.pointerId;drag=true;moved=false;sx=e.clientX-x;sy=e.clientY-y;px0=e.clientX;py0=e.clientY;hist=[];el.setPointerCapture(pid);el.classList.add("grabbing");box&&box.classList.add("dragging");onGrab&&onGrab();if(!raf){lastT=0;raf=requestAnimationFrame(step)}});
  el.addEventListener("pointermove",e=>{if(!drag||e.pointerId!==pid)return;const nx=e.clientX-sx,ny=e.clientY-sy;if(Math.hypot(e.clientX-px0,e.clientY-py0)>5)moved=true;const now=performance.now();hist.push([now,nx,ny]);hist=hist.filter(h=>now-h[0]<90);if(hist.length>1){const a=hist[0],b=hist[hist.length-1],dt=(b[0]-a[0])/1000||.016;vx=(b[1]-a[1])/dt;vy=(b[2]-a[2])/dt}x=nx;y=ny});
  const end=e=>{if(!drag)return;drag=false;el.classList.remove("grabbing");try{el.releasePointerCapture(pid)}catch(_){};const speed=Math.hypot(vx,vy),dist=Math.hypot(x,y);if(moved){onRelease&&onRelease({speed,dist});el.dataset.justDragged="1";setTimeout(()=>delete el.dataset.justDragged,60)}};
  el.addEventListener("pointerup",end);el.addEventListener("pointercancel",e=>{drag=false;el.classList.remove("grabbing")});
  el.addEventListener("click",e=>{if(el.dataset.justDragged){e.preventDefault();e.stopPropagation()}},true);
}
function quip({speed,dist}){
  const big=speed>1400||dist>260;
  const pool=big?["Wheee!","Easy, easy!","I've had coffee, you know.","Okay that was fun."]:dist>90?["Oi! Put me down.","Personal space?","Right, back to my spot.","I can walk, thanks."]:["Hello to you too.","Ticklish, that.","Careful, new shirt."];
  return pool[Math.floor(Math.random()*pool.length)];
}
function sayIn(el,txt,ms=1800){el.textContent=txt;el.classList.remove("on");void el.offsetWidth;el.classList.add("on");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("on"),ms)}

// contact: drag him and he waves when he lands
(function(){const rig=$(".talk-rig");if(!rig)return;
  makeDraggable(rig,{box:$("#waver"),onRelease:r=>{wave(650);}});
})();
// 404: try the door
$("#tryDoor")&&$("#tryDoor")?.addEventListener("click",()=>{const sc=$(".lost-scene");const say=$("#lostSay");if(sc.classList.contains("open")){sc.classList.remove("open");sayIn(say,"Told you.");return}sc.classList.add("open");setTimeout(()=>sayIn(say,"Yeah. It does that.",2400),700)});
function onLost(){const say=$("#lostSay");if(!say)return;$(".lost-scene").classList.remove("open");setTimeout(()=>sayIn(say,"Huh.",1600),1200)}
// skip link focuses without routing
$("#skipLink")?.addEventListener("click",e=>{e.preventDefault();$("#main").focus()});


// ---------- The Possibilities Studio: jump links and the artwork viewer ----------
(function(){
  let list=[],at=0,from=null;
  const lb=()=>document.getElementById("stLb");
  function show(i){const L=lb();if(!L)return;at=(i+list.length)%list.length;const b=list[at],img=document.getElementById("stImg"),full=b.querySelector("img").getAttribute("srcset").split(",").pop().trim().split(" ")[0];
    img.src=full;img.alt=b.querySelector("img").alt;img.style.animation="none";void img.offsetWidth;img.style.animation="";
    document.getElementById("stCap").textContent=b.closest("figure").querySelector("figcaption").textContent.replace(/^\d+/,"");document.getElementById("stN").textContent=(at+1)+" / "+list.length;}
  function open(b){const L=lb();if(!L)return;list=[...document.querySelectorAll('.page:not([hidden]) .st-open')];from=b;L.hidden=false;document.documentElement.classList.add("st-open-lb");show(list.indexOf(b));document.getElementById("stX").focus({preventScroll:true})}
  function close(){const L=lb();if(!L||L.hidden)return;L.hidden=true;document.documentElement.classList.remove("st-open-lb");from&&from.focus({preventScroll:true})}
  document.addEventListener("click",e=>{
    const o=e.target.closest(".st-open");if(o){open(o);return}
    const j=e.target.closest("[data-jump]");if(j){const t=document.getElementById(j.dataset.jump);if(t)t.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});return}
    if(e.target.closest("#stX")||e.target.id==="stStage"){close();return}
    if(e.target.closest("#stPrev"))show(at-1);else if(e.target.closest("#stNext"))show(at+1);
  });
  document.addEventListener("keydown",e=>{const L=lb();if(!L||L.hidden)return;if(e.key==="Escape"){e.preventDefault();close()}else if(e.key==="ArrowLeft")show(at-1);else if(e.key==="ArrowRight")show(at+1)});
  let sx=null;document.addEventListener("touchstart",e=>{const L=lb();if(L&&!L.hidden)sx=e.touches[0].clientX},{passive:true});
  document.addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)show(at+(dx<0?1:-1))},{passive:true});
  addEventListener("hashchange",close);addEventListener("popstate",close);
})();

// ---------- The greeting knows when you're visiting ----------
(function(){
  const h=new Date().getHours(),H=$("#heroH");if(!H)return;
  const set=(a,b)=>{const l=H.querySelectorAll(":scope>.ln");l[0].innerHTML=a;l[1].innerHTML=b};
  if(h>=5&&h<12)set("Morning.","Coffee's <em class=\"acc\">on.</em>");
  else if(h>=18&&h<22)set("Evening,","I'm <em class=\"acc\">Lor.</em>");
  else if(h>=22||h<5)set("Up late?","<em class=\"acc\">Same.</em>");
})();

// ---------- The watch knows the time (in Ireland) ----------
const WATCH={"tablet-bust":[69.1,86.1],"coffee-crop":[72.6,82.4],"backpack-bust":[67.2,70.7],"hi-base":[66.6,51.9],"lean-full":[75.7,51.4],"host":[77.9,38],
  "work-arkintel":[77.4,70.6],"work-heineken":[70.5,67],"work-f1":[22.6,79.2],"work-uefa":[53.3,46.4],"work-justeat":[48.7,84.9],"work-atpi":[47.4,28.7],"work-savvy":[58.7,71.1],"work-htm":[32.9,75.5],"work-brandit":[52.5,79.5],"work-ocean":[47.5,83.5]};
function irishTime(){
  const d=new Date(),fmt=new Intl.DateTimeFormat("en-IE",{timeZone:"Europe/Dublin",hour:"numeric",minute:"2-digit",hour12:true}).formatToParts(d);
  const g=t=>(fmt.find(p=>p.type===t)||{}).value||"";const hr=+new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Dublin",hour:"2-digit",hour12:false}).format(d)%24;
  return {txt:`${g("hour")}:${g("minute")}${(g("dayPeriod")||"").toLowerCase().replace(/[^apm]/g,"")}`,h:hr};
}
function watchLine(){
  const {txt,h}=irishTime(),t=`<b>${txt}</b>`;
  if(h<6)return `It's ${t} here. I'm probably asleep.`;
  if(h<9)return `It's ${t} here. Coffee first, then words.`;
  if(h<12)return `It's ${t} here. Working, allegedly.`;
  if(h<14)return `It's ${t} here. Thinking about lunch.`;
  if(h<17)return `It's ${t} here. Peak afternoon.`;
  if(h<19)return `It's ${t} here. Nearly clocking off.`;
  if(h<22)return `It's ${t} here. Feet up.`;
  return `It's ${t} here. One more episode, then bed.`;
}
const tickSay=$("#tickSay");let tickT=null,tickFrom=null;
function showTick(btn){
  tickFrom=btn;tickY=scrollY;tickSay.innerHTML=watchLine();tickSay.classList.remove("on","flip");
  const r=btn.getBoundingClientRect(),w=Math.min(260,innerWidth-24);tickSay.style.width="auto";
  const bw=tickSay.offsetWidth||w,bh=tickSay.offsetHeight||40;
  // open the bubble outward from the watch, level with it, so it stays off his face
  const host=(btn.parentElement.querySelector("img")||btn.parentElement).getBoundingClientRect(),cx=r.left+r.width/2,outRight=cx>=host.left+host.width/2;
  let x=outRight?r.right+8:r.left-8-bw,y=r.top+r.height/2-bh*.35;
  if(x+bw>innerWidth-12){x=r.left-8-bw;tickSay.classList.add("flip")}
  if(x<12){x=Math.min(innerWidth-12-bw,Math.max(12,cx-bw/2));y=r.bottom+8}
  else if(!outRight)tickSay.classList.add("flip");
  y=Math.max(12,Math.min(innerHeight-12-bh,y));
  tickSay.style.left=x+"px";tickSay.style.top=y+"px";void tickSay.offsetWidth;tickSay.classList.add("on");
  clearTimeout(tickT);tickT=setTimeout(()=>tickSay.classList.remove("on"),3200);
}
let tickY=0;addEventListener("scroll",()=>{if(tickSay.classList.contains("on")&&Math.abs(scrollY-tickY)>40)tickSay.classList.remove("on")},{passive:true});
const watchRO=("ResizeObserver" in window)?new ResizeObserver(es=>es.forEach(e=>placeWatch(e.target))):null;
const watched=[];
function keyOf(img){const m=(img.getAttribute("src")||"").match(/img\/([a-z0-9-]+?)(?:-800)?\.webp/);return m&&m[1]}
function placeWatch(img){
  const b=img._watch;if(!b)return;const k=keyOf(img),pt=WATCH[k];if(!pt)return;
  const par=b.parentElement,pr=par.getBoundingClientRect(),ir=img.getBoundingClientRect();if(!ir.width||!pr.width){b.hidden=true;return}
  const nw=img.naturalWidth||+img.getAttribute("width"),nh=img.naturalHeight||+img.getAttribute("height");
  const cs=getComputedStyle(img);let cw=ir.width,ch=ir.height,ox=0,oy=0;
  if(cs.objectFit==="cover"||cs.objectFit==="contain"){const sc=(cs.objectFit==="cover"?Math.max:Math.min)(ir.width/nw,ir.height/nh);cw=nw*sc;ch=nh*sc;const [px,py]=cs.objectPosition.split(" ").map(v=>parseFloat(v)/100);ox=(ir.width-cw)*(isNaN(px)?.5:px);oy=(ir.height-ch)*(isNaN(py)?.5:py)}
  const x=ir.left-pr.left+ox+cw*pt[0]/100,y=ir.top-pr.top+oy+ch*pt[1]/100;
  const inside=x>4&&y>4&&x<pr.width-4&&y<pr.height-4;b.hidden=!inside;
  b.style.left=x+"px";b.style.top=y+"px";b.style.setProperty("--ws",Math.max(30,Math.min(46,cw*.07))+"px");
}
function armWatches(root=document){
  root.querySelectorAll("img").forEach(img=>{
    if(img._watch||img.closest(".intro,.egg,.peek,.curtain,.xp-art,.egg-fig"))return;
    const k=keyOf(img);if(!k||!WATCH[k])return;
    if(img.classList.contains("rig-arm"))return;
    const par=img.parentElement;
    const b=document.createElement("button");b.type="button";b.className="watch";b.setAttribute("aria-label","Check the time on Lor's watch");b.title="What time is it?";b.style.setProperty("--gd",(watched.length*0.9%7)+"s");
    b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();showTick(b)});
    b.addEventListener("pointerdown",e=>e.stopPropagation());
    par.appendChild(b);img._watch=b;watched.push(img);
    img.addEventListener("load",()=>placeWatch(img));watchRO&&watchRO.observe(img);placeWatch(img);
  });
}
let wpT=0;addEventListener("scroll",()=>{if(wpT)return;wpT=requestAnimationFrame(()=>{wpT=0;watched.forEach(i=>{if(i.closest("[data-par],.xp-about")||i.dataset.par)placeWatch(i)})})},{passive:true});

// reading progress on articles
(function(){const bar=$("#readBar");let t=0;addEventListener("scroll",()=>{if(t)return;t=requestAnimationFrame(()=>{t=0;const art=document.querySelector('[data-page="post"]:not([hidden]) .article');if(!art){bar.style.transform="scaleX(0)";return}const r=art.getBoundingClientRect(),k=Math.min(1,Math.max(0,(innerHeight*.35-r.top)/(r.height-innerHeight*.35)));bar.style.transform=`scaleX(${k.toFixed(4)})`})},{passive:true})})();

// ---------- Sticky header ----------
(function(){
  const shell=$(".nav-shell"),prog=$("#navProg"),ind=$("#navInd"),links=$(".links");
  let lastY=0,ticking=false,acc=0;
  // Some app viewers (like Claude on a phone) lay the page out at full height and scroll it from outside,
  // so the page never scrolls itself and sticky has nothing to stick to. In that case we work out which
  // part of the page is on screen from intersection data and carry the header along by hand.
  const de=document.documentElement;let emb=false,vTop=0,vH=innerHeight,sent=null,sio=null;
  const isEmbedded=()=>window.self!==window.top&&de.scrollHeight-innerHeight<4;
  const vis=new Map();
  function buildSentinels(){
    sio&&sio.disconnect();sent&&sent.remove();vis.clear();
    const H=de.scrollHeight,step=40;sent=document.createElement("div");sent.className="vp-sent";sent.setAttribute("aria-hidden","true");
    for(let y=0;y<H;y+=step){const i=document.createElement("i");i.style.top=y+"px";i.style.height=Math.min(step,H-y)+"px";sent.appendChild(i)}
    document.body.appendChild(sent);
    const th=[];for(let k=0;k<=20;k++)th.push(k/20);
    sio=new IntersectionObserver(es=>{es.forEach(e=>{if(e.intersectionRatio>0)vis.set(e.target,[e.intersectionRect.top,e.intersectionRect.bottom]);else vis.delete(e.target)});
      if(!vis.size)return;let t=1e9,b=-1e9;vis.forEach(([a,z])=>{t=Math.min(t,a);b=Math.max(b,z)});vTop=t;vH=b-t;schedule()},{threshold:th});
    sent.querySelectorAll("i").forEach(i=>sio.observe(i));
  }
  function setMode(){
    const e=isEmbedded();if(e===emb){if(e)buildSentinels();return}
    emb=e;de.classList.toggle("emb",e);
    if(e){$("#main").style.paddingTop=shell.offsetHeight+"px";buildSentinels()}else{$("#main").style.paddingTop="";sio&&sio.disconnect();sent&&sent.remove();shell.style.transform=""}
  }
  const curY=()=>emb?vTop:scrollY,curH=()=>emb?vH:innerHeight;
  function schedule(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  function frame(){
    ticking=false;const y=curY(),dy=y-lastY;lastY=y;
    if(emb)shell.style.setProperty("--ey",y+"px");
    const max=Math.max(1,de.scrollHeight-curH());
    prog.style.setProperty("--p",Math.min(1,y/max).toFixed(4));
    shell.classList.toggle("scrolled",y>24);
    const locked=!sheet.hidden||document.documentElement.classList.contains("room-on")||document.activeElement&&shell.contains(document.activeElement);
    shell.classList.remove("hide");
    // header always stays visible
  }
  addEventListener("scroll",schedule,{passive:true});
  let rT=0;const reMode=()=>{clearTimeout(rT);rT=setTimeout(()=>{setMode();schedule()},120)};
  addEventListener("resize",reMode);("ResizeObserver" in window)&&new ResizeObserver(reMode).observe(document.body);
  setTimeout(setMode,300);
  shell.addEventListener("focusin",()=>shell.classList.remove("hide"));
  // sliding indicator: sits under the current page, follows the pointer, returns on leave
  function moveTo(a){if(!a){ind.classList.remove("on");return}const r=a.getBoundingClientRect(),lr=links.getBoundingClientRect();ind.style.setProperty("--x",(r.left-lr.left+14)+"px");ind.style.setProperty("--w",(r.width-28)+"px");ind.classList.add("on")}
  const cur=()=>links.querySelector('a[aria-current="page"]');
  links.addEventListener("pointerover",e=>{const a=e.target.closest("a");if(a)moveTo(a)});
  links.addEventListener("pointerleave",()=>moveTo(cur()));
  addEventListener("resize",()=>moveTo(cur()));
  // breadcrumb + indicator follow the route
  const names={about:"About",experience:"Experience",work:"Work",websites:"Websites",studio:"Studio","studio-wadden":"WADDEN","studio-kindling":"Kindling","studio-rune":"RUNE","studio-fold":"FOLD",thoughts:"Thoughts",contact:"Contact",post:"Thoughts",lost:"Lost"};
  window.headerOnRoute=page=>{
    requestAnimationFrame(()=>moveTo(cur()));
    const c=$("#crumb"),t=$("#crumbT"),n=names[page];
    if(n){t.textContent=n;t.style.animation="none";void t.offsetWidth;t.style.animation="";c.classList.add("on")}else c.classList.remove("on");
    shell.classList.remove("hide");setTimeout(()=>{setMode();frame()},350);
  };
})();
// ---------- Little world ----------
// Work: cursor spotlight + gentle 3D tilt
if(fine&&!reduced){document.querySelectorAll(".bc").forEach(c=>{
  c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty("--mx",(x*100).toFixed(1)+"%");c.style.setProperty("--my",(y*100).toFixed(1)+"%");c.style.setProperty("--ry",((x-.5)*8).toFixed(2)+"deg");c.style.setProperty("--rx",((.5-y)*6).toFixed(2)+"deg")});
  c.addEventListener("pointerleave",()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
})}
// Lights
const lightsBtn=$("#lights");
function setLights(on){document.documentElement.classList.toggle("dim",!on);lightsBtn.setAttribute("aria-checked",String(on));try{localStorage.setItem("lor-lights",on?"on":"off")}catch(e){}}
try{if(localStorage.getItem("lor-lights")==="off")setLights(false)}catch(e){}
lightsBtn.addEventListener("click",()=>setLights(document.documentElement.classList.contains("dim")));
// Don't press this: lights out, Lor pops up from below, a switch on the wall
const egg=$("#egg")||Object.assign(document.createElement("div"),{hidden:true}),eggSay=$("#eggSay");let eggT=[],eggFrom=null;
function eggAt(ms,fn){eggT.push(setTimeout(fn,ms))}
function eggLine(t){eggSay.classList.remove("on");void eggSay.offsetWidth;eggSay.textContent=t;eggSay.classList.add("on")}
$("#nope")?.addEventListener("click",()=>{
  if(!egg.hidden)return;eggFrom=document.activeElement;eggT.forEach(clearTimeout);eggT=[];
  egg.className="egg";egg.hidden=false;eggSay.className="egg-say";document.documentElement.classList.add("room-on");
  egg.querySelectorAll("img").forEach(i=>i.loading="eager");
  eggAt(reduced?0:700,()=>egg.classList.add("risen"));
  eggAt(reduced?0:1500,()=>eggLine("Now look what you did."));
  eggAt(reduced?0:2300,()=>{egg.classList.add("ready");$("#eggSwitch").focus({preventScroll:true})});
  eggAt(7500,()=>{if(!egg.classList.contains("on"))eggLine("The switch. On the wall.")});
  eggAt(14000,()=>{if(!egg.classList.contains("on"))eggLine("I'm not getting up.")});
});
function lightsBackOn(){
  if(egg.hidden||egg.classList.contains("on"))return;eggT.forEach(clearTimeout);eggT=[];
  egg.classList.add("on");eggLine("Thank you.");
  eggAt(reduced?600:1100,()=>{eggSay.classList.remove("on");egg.classList.add("sink")});
  eggAt(reduced?700:1800,()=>{egg.hidden=true;egg.className="egg";document.documentElement.classList.remove("room-on");eggFrom&&eggFrom.focus({preventScroll:true})});
}
$("#eggSwitch")?.addEventListener("click",lightsBackOn);
document.addEventListener("keydown",e=>{if(!egg.hidden&&e.key==="Escape"){e.preventDefault();lightsBackOn()}});



// ---------- The Other Room ----------
// Fill these in when the media is ready. Nothing here autoplays.
const SONG=f=>(MPA?"/":"")+"media/songs/"+f;
const ROOM={
  // music videos on YouTube: rename the titles here
  videos:[
    {title:"Music video I",yt:"MTVVfzCUF0I"},
    {title:"Music video II",yt:"AcfxTrcVUkw"},
    {title:"Music video III",yt:"OJSCrFcbT_U"}
  ],
  // paintings: rename the titles here; files live in img/paintings/<key>-400|1000.webp
  paintings:[
    {title:"Painting I",key:"p1",w:1000,h:1111},
    {title:"Painting II",key:"p2",w:1000,h:1327},
    {title:"Painting III",key:"p3",w:1000,h:1000},
    {title:"Painting IV",key:"p4",w:1000,h:1000},
    {title:"Painting V",key:"p5",w:1000,h:1000},
    {title:"Painting VI",key:"p6",w:1000,h:1000},
    {title:"Painting VII",key:"p7",w:1000,h:1045}
  ],
  // songs: rename the titles here; files live in media/songs/
  songs:[
    {title:"Beat 01",src:SONG("lor-84.mp3"),dur:172},
    {title:"Beat 02",src:SONG("lor-85.mp3"),dur:182},
    {title:"Beat 03",src:SONG("lor-86.mp3"),dur:167},
    {title:"Beat 04",src:SONG("lor-87.mp3"),dur:130},
    {title:"Beat 05",src:SONG("lor-88.mp3"),dur:158},
    {title:"Beat 06",src:SONG("lor-89.mp3"),dur:173},
    {title:"Beat 07",src:SONG("lor-90.mp3"),dur:114},
    {title:"Beat 08",src:SONG("lor-91.mp3"),dur:137},
    {title:"Beat 09",src:SONG("lor-92.mp3"),dur:130},
    {title:"Beat 10",src:SONG("lor-93.mp3"),dur:162},
    {title:"Beat 11",src:SONG("lor-94.mp3"),dur:151}
  ],
  // the collection: covers live in img/books/<key>-400|800.webp
  books:[
    {title:"Seers of the North",sub:"Prophecy, Power and the O’Neill Dynasty",num:"I",key:"seers-of-the-north",acc:"#B8473B",bg:"#0b0d0e",about:"An exploration of the O'Neill dynasty, the Irish seers and poets who shaped its legacy, and how stories of prophecy and sovereignty survived centuries after Gaelic power collapsed.",excerpt:["In 1602, English forces destroyed the stone used to inaugurate the O'Neill chiefs at Tullaghogue in County Tyrone. It was a symbolic act, intended to bring an end to something much larger than a ceremony.", "The stone disappeared. The stories didn't.", "For centuries, the O'Neills had ruled much of Ulster, supported by a remarkable tradition of hereditary poets and seers. These weren't simply men who entertained kings. They preserved genealogies, interpreted prophecies, challenged authority and helped determine who had the right to rule.", "Their words carried enormous political and cultural weight.", "What interested me was what happened when the dynasty lost its power. The castles fell, the chiefs went into exile, and the old Gaelic order was dismantled. Yet the poets' stories survived in manuscripts, songs, folklore and eventually modern Irish identity.", "This book follows that inheritance, from the earliest legends of Irish kingship through the Flight of the Earls and into the present.", "It's about the O'Neills, certainly. But it's also about a question that goes well beyond one family: how do you defeat something that people refuse to stop remembering?"]},
    {title:"Honey & Flies",sub:"The Art of Not Explaining Yourself",num:"II",key:"honey-and-flies",acc:"#D9A441",bg:"#0c0904",about:"Why we exhaust ourselves trying to be understood, how incompatible values affect relationships, and when it's healthier to stop explaining and put our energy elsewhere.",excerpt:["Have you ever walked away from a conversation and spent the rest of the evening thinking about what you should have said?", "You were clear enough at the time. You explained your reasoning, answered the questions and made a genuine effort to understand the other person's perspective. Still, you left feeling as though you'd somehow failed to communicate.", "So you start preparing another explanation.", "I've become interested in how much energy people spend doing this, particularly with people who have repeatedly shown that they see the world very differently.", "The bee and the fly offer a useful image. Both occupy the same garden, but they're drawn to entirely different things. Neither needs to convince the other that its interests are legitimate.", "Of course, human relationships are more complicated than that. People change, misunderstandings happen, and difficult conversations are sometimes necessary.", "But there's a point where explaining yourself stops being productive and becomes a way of asking for permission to be who you already are.", "This book is about recognising that point."]},
    {title:"Never Leave Neverland",sub:"The Boy Within and the Man Who Forgot His Face",num:"III",key:"never-leave-neverland",acc:"#E3D3A0",bg:"#060c10",about:"How boys gradually lose their imagination, sensitivity and freedom as they grow into men, and what it means to recover those qualities without abandoning adulthood.",excerpt:["Nobody sits you down as a child and announces that you're about to become someone else.", "It happens gradually.", "You stop playing certain games because you're getting too old. You learn which emotions are acceptable to show. You become more aware of how other people see you, and you start adjusting accordingly.", "By adulthood, you've usually become quite good at it.", "You know how to behave at work, how to appear confident, how to keep your responsibilities under control. You might have a family, a career and a life that looks perfectly respectable from the outside.", "Yet something of the boy you once were has become difficult to find.", "I don't think the answer is to reject adulthood or spend our lives wishing we were children again. Growing up brings things worth having: independence, understanding, responsibility and the ability to care for others.", "But why should those things require us to abandon curiosity, imagination, sensitivity or the pleasure of doing something simply because we enjoy it?", "*Never Leave Neverland* explores the expectations placed on boys and men, the ways those expectations are passed between generations, and the possibility of growing older without losing everything that made childhood worth remembering."]},
    {title:"Through the Noise",sub:"Seeing Clearly in an Age of Infinite Distraction",num:"IV",key:"through-the-noise",acc:"#7FD1D8",bg:"#07080a",about:"An examination of how digital platforms, information overload, institutions and modern systems influence what we think, believe and pay attention to.",excerpt:["We're living through a rather strange period in human history.", "Almost anything we want to know is available within seconds. We can speak to people on the other side of the world, learn almost any skill and follow events as they happen.", "Yet it's becoming increasingly difficult to tell what's worth our attention.", "Every day we're presented with news, opinions, advertising, recommendations and arguments, much of it selected by systems designed to keep us engaged.", "The problem goes beyond spending too much time looking at our phones.", "When the information we encounter is constantly filtered, ranked and presented to us by other interests, it changes how we understand the world. It influences what we remember, who we trust, what we consider important and sometimes what we mistake for our own opinions.", "This book examines those influences across technology, communication, community, institutions, surveillance and culture.", "I wanted to understand how we might become better at distinguishing useful information from distraction, especially when the distraction is so well designed."]},
    {title:"State",sub:"",num:"V",key:"state",acc:"#FF7A2A",bg:"#0c0605",about:"A challenge to the idea that productivity and discipline are simply matters of character, examining how stress, safety, exhaustion and the nervous system affect our ability to function.",excerpt:["Imagine someone who is perfectly capable of managing a complicated project, solving difficult problems and working for hours with extraordinary concentration.", "Now imagine that same person struggling to answer a simple email.", "We tend to see that contradiction as a problem with motivation. If they can manage the difficult task, surely they should be able to manage the easy one.", "But capability isn't always available on demand.", "Sleep, stress, health, environment and our sense of safety all influence how we function. Someone who appears confident and capable in one situation may struggle considerably in another.", "And yet we often judge people as though their performance provides a complete picture of their character.", "*State* examines that assumption, looking at nervous-system regulation, the effects of prolonged stress and the consequences of constantly pushing ourselves beyond our available capacity.", "It also considers the environments we create in schools, workplaces and everyday life, and whether those environments support the people expected to perform within them.", "The central argument is that understanding someone's condition may tell us more about their difficulties than immediately questioning their discipline or willingness to try."]},
    {title:"Children of the Glow",sub:"",num:"VI",key:"children-of-the-glow",acc:"#8DB8F0",bg:"#070910",about:"A coming-of-age novel following Seán, an Irish boy growing up during the arrival of the digital age, from a childhood spent outdoors to an adulthood increasingly consumed by screens.",excerpt:["Seán grew up in a Dublin where you found your friends by knocking on their doors.", "There were football matches on the estate green, afternoons that lasted until somebody's ma called them home, and very little reason to be indoors when the weather was decent.", "Then the technology started arriving.", "First came the games consoles. Then the family computer, the strange screech of dial-up internet, chatrooms, MSN Messenger and eventually phones that could carry an entire world around in your pocket.", "For Seán, it was extraordinary. Suddenly there were people to meet, places to explore and things to discover that had never existed in his childhood.", "But the more connected he became, the less time he seemed to spend with the people standing right in front of him.", "As he grew older, the late nights online became normal. His friendships changed, the streets of his childhood grew quieter, and the screens that once offered an escape began taking over his everyday life.", "*Children of the Glow* follows Seán through that transformation, exploring what happened to the generation that remembers life before the internet but came of age alongside it.", "It's a story about growing up, becoming dependent on something you once loved, and finding your way back to a world that never entirely disappeared."]},
    {title:"Killing All of the Trees",sub:"",num:"VII",key:"killing-all-of-the-trees",acc:"#9DBF86",bg:"#060a07",about:"An examination of neurodivergence, education, psychiatric diagnosis and the ways institutions can mistake differences in how people think for problems that need correcting.",excerpt:["We're remarkably comfortable with the idea that people are different, provided those differences don't interfere too much with how things are organised.", "A child who learns quickly but struggles to sit still becomes a classroom problem. Someone who thinks creatively but finds repetitive tasks exhausting becomes an unreliable employee. A person whose mind works differently may spend years trying to understand why ordinary expectations seem so difficult to meet.", "Sometimes a diagnosis provides an important explanation, useful support and genuine relief.", "But I think we also need to examine the environments in which those difficulties become visible.", "Our schools, workplaces and institutions were largely designed around shared expectations of attention, behaviour, communication and performance.", "What happens when someone doesn't fit those expectations?", "*Killing All of the Trees* uses the contrast between a garden and a forest to explore that question. A garden is carefully organised, maintained and controlled. A forest is less predictable, but its diversity is part of what makes it work.", "The book challenges some of the assumptions behind how we identify and support different minds, while recognising that clinical care and diagnosis can be essential.", "It's an argument for examining the environment as carefully as we examine the individual."]},
    {title:"What’s Mine Is Yours",sub:"",num:"VIII",key:"whats-mine-is-yours",acc:"#C9A27A",bg:"#0b0907",about:"How our time, attention, energy and generosity are gradually consumed by demanding relationships, social expectations and systems designed to keep taking.",excerpt:["There's a particular type of person everyone knows they can rely on.", "They answer the phone, help when something goes wrong, remember the things other people forget and usually find a way to make themselves available.", "Often, they're proud of being that person.", "But being reliable can gradually become an obligation that nobody remembers agreeing to.", "The favours get bigger. The expectations become more familiar. People stop asking whether you have the time because experience has taught them that you'll make it.", "Something similar happens with the technology we use. Services designed to make life easier compete for our attention, subscriptions quietly become permanent expenses, and the boundary between our time and everybody else's demands becomes increasingly difficult to maintain.", "*What's Mine Is Yours* examines these forms of extraction, from the economics of attention to the personal relationships that leave us emotionally exhausted.", "It explores why we keep giving even when we're running low ourselves, why recognising an unhealthy pattern doesn't automatically make it easy to leave, and how to establish boundaries without losing our capacity to care.", "Generosity is worth protecting. So is the person being generous."]}
  ]
};
const room=$("#room")||document.createElement("div"),orPanel=$("#orPanel"),orBody=$("#orBody");let roomFrom=null,orAudio=null;
function setClipFrom(el){const r=el.getBoundingClientRect();room.style.setProperty("--ct",r.top+"px");room.style.setProperty("--cl",r.left+"px");room.style.setProperty("--cr",(innerWidth-r.right)+"px");room.style.setProperty("--cb",(innerHeight-r.bottom)+"px");room.style.setProperty("--crr","4px")}
function clearClip(){["--ct","--cl","--cr","--cb"].forEach(v=>room.style.setProperty(v,"0px"));room.style.setProperty("--crr","0px")}

// remember what's been explored (per visitor, this browser)
let RM={};try{RM=JSON.parse(localStorage.getItem("lor-room")||"{}")}catch(e){}
function remember(k,v=1){RM[k]=v;try{localStorage.setItem("lor-room",JSON.stringify(RM))}catch(e){}applyMemory()}
function applyMemory(){
  if(!room.isConnected)return;
  room.querySelectorAll("[data-book]").forEach(b=>b.classList.toggle("read",!!RM["book"+b.dataset.book]&&!b.classList.contains("out")));
  room.querySelectorAll("[data-frame]").forEach(b=>b.classList.toggle("seen",!!RM["frame"+b.dataset.frame]));
  room.querySelector(".or-tv").classList.toggle("watched",!!RM.videos);
  room.classList.toggle("played",!!RM.songs);
  room.querySelector(".or-drawer").classList.toggle("ajar",!!RM.drawer);
}
applyMemory();
// books slide off the shelf, then open
room.querySelectorAll("[data-book]").forEach(b=>b.addEventListener("click",()=>{b.classList.remove("read");b.classList.add("out");RM["book"+b.dataset.book]=1;try{localStorage.setItem("lor-room",JSON.stringify(RM))}catch(e){}setTimeout(()=>openPanel("book:"+b.dataset.book),reduced?0:420)}));
// the camera leans in to a painting
room.querySelectorAll("[data-frame]").forEach(f=>f.addEventListener("click",()=>{
  const st=room.querySelector(".or-stage"),sr=st.getBoundingClientRect(),r=f.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2,k=innerWidth<768?1.9:2.1;
  room.style.setProperty("--zx",((innerWidth/2-cx)*k)+"px");room.style.setProperty("--zy",((innerHeight*(innerWidth<768?0.36:0.42)-cy)*k)+"px");
  room.style.setProperty("--fx",((cx-sr.left)/sr.width*100)+"%");room.style.setProperty("--fy",((cy-sr.top)/sr.height*100)+"%");
  room.querySelectorAll(".or-fr").forEach(x=>x.classList.toggle("focus",x===f));room.classList.add("zoom");remember("frame"+f.dataset.frame);setTimeout(()=>openPanel("frame:"+f.dataset.frame),reduced?0:900);
}));
// clock: the real local time, quietly
function tick(){const d=new Date(),h=d.getHours()%12,m=d.getMinutes(),s=d.getSeconds();const c=room.querySelector(".or-clock");if(!c)return;c.querySelector(".h").style.transform=`rotate(${h*30+m/2}deg)`;c.querySelector(".m").style.transform=`rotate(${m*6}deg)`;c.querySelector(".s").style.transform=`rotate(${s*6}deg)`}
let clockT=null;
// day and night follow the visitor's clock; the switch overrides it
function isDayNow(){const h=new Date().getHours();return h>=7&&h<19}
function setDay(on){room.classList.toggle("day",on)}
$("#orDN")?.addEventListener("click",()=>setDay(!room.classList.contains("day")));
function openRoom(){
  setTimeout(()=>{armWatches(room);watched.forEach(placeWatch)},60);
  setDay(isDayNow());tick();clearInterval(clockT);clockT=setInterval(tick,1000);applyMemory();
  roomFrom=document.activeElement;const door=$("#orDoor");
  room.hidden=false;document.documentElement.classList.add("room-on");
  room.querySelectorAll("img").forEach(i=>i.loading="eager");
  if(!reduced){room.style.transition="none";setClipFrom(door);room.classList.add("entering");void room.offsetWidth;room.style.transition="";requestAnimationFrame(()=>{clearClip();room.classList.remove("entering")})}
  const hi=$("#orHi");hi.textContent="Ah, you found it.";
  setTimeout(()=>room.classList.add("greet"),reduced?0:1500);
  setTimeout(()=>{room.classList.remove("greet");setTimeout(()=>{hi.textContent="Make yourself at home. Don't touch anything expensive.";room.classList.add("greet")},350)},reduced?2000:3600);
  setTimeout(()=>room.classList.remove("greet"),reduced?5500:7400);
  setTimeout(()=>$("#orLeave").focus({preventScroll:true}),reduced?0:900);
}
function closeRoom(){
  closePanel();if(orAudio){orAudio.pause()}
  clearInterval(clockT);
  const done=()=>{room.hidden=true;room.classList.remove("zoom");room.classList.remove("greet","playing");document.documentElement.classList.remove("room-on");roomFrom&&roomFrom.focus({preventScroll:true})};
  if(reduced){done();return}
  setClipFrom($("#orDoor"));setTimeout(()=>{done();clearClip()},850);
}
$("#orDoor")?.addEventListener("click",openRoom);
$("#orLeave")?.addEventListener("click",closeRoom);
const fmt=t=>isFinite(t)?Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0"):"0:00";
function empty(title,line){return `<div class="or-empty"><b>${title}</b><span>${line}</span></div>`}
const ptSrc=(p,w)=>`${MPA?"/":""}img/paintings/${p.key}-${w}.webp`;
const bookSrc=(b,w)=>`${MPA?"/":""}img/books/${b.key}-${w}.webp`;
const toRoman=n=>["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][n]||String(n);
// YouTube: a still and a play button first; the player only loads when someone presses play.
// The single-file preview can't embed other sites, so it links out instead.
function ytStage(v,play){
  const watch=`https://www.youtube.com/watch?v=${v.yt}`;
  if(!MPA)return `<a class="yt-lite yt-off" href="${watch}" target="_blank" rel="noopener"><span class="yt-play">▶</span><span class="yt-t">${esc(v.title)}</span><span class="yt-s">Watch on YouTube</span></a>`;
  if(play)return `<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0&playsinline=1" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  return `<button class="yt-lite" type="button" data-play="1" style="background-image:url(https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg)" aria-label="Play ${esc(v.title)}"><span class="yt-play">▶</span></button>`;
}
function panelHTML(kind){
  if(kind==="videos"){const v=ROOM.videos;return `<span class="or-kick">On the telly</span><h3 class="or-h">Music videos</h3>`+(v.length?(()=>{const L=Math.min(RM.lastVideo||0,v.length-1);return `<div class="or-video" id="orStage">${ytStage(v[L],false)}</div><p class="yt-cap"><a id="ytOut" href="https://www.youtube.com/watch?v=${v[L].yt}" target="_blank" rel="noopener">Watch on YouTube ↗</a></p><div class="or-tracks">${v.map((x,i)=>`<button class="or-track${i===L?" on":""}" data-vid="${i}"><span class="pp">▶</span><span>${esc(x.title)}</span><span></span></button>`).join("")}</div>`})():empty("Nothing on yet.","The music videos are on their way."))}
  if(kind==="paintings"){const v=ROOM.paintings;return `<span class="or-kick">On the wall</span><h3 class="or-h">Paintings</h3>`+(v.length?`<div class="or-grid">${v.map((x,i)=>`<button data-goto-pt="${i}" class="gold"><img src="${ptSrc(x,400)}" alt="${esc(x.title)}" loading="lazy"></button>`).join("")}</div>`:empty("The frames are waiting.","Paintings will be hung here soon."))}
  if(kind==="drawer"){return `<span class="or-kick">In the drawer</span><h3 class="or-h">Things I probably shouldn't have made.</h3>`+empty("Suspiciously empty.","Unfinished concepts, sketches and strange creations will turn up here.")}
  if(kind&&kind.startsWith("book:")){const n=+kind.slice(5),b=ROOM.books[n];return `<span class="or-kick">The Hidden Library · ${b.num} of ${toRoman(ROOM.books.length)}</span><article class="or-read has-cover"><img class="or-cover" src="${bookSrc(b,800)}" srcset="${bookSrc(b,400)} 400w, ${bookSrc(b,800)} 800w" sizes="(max-width:600px) 40vw, 260px" width="800" height="1200" alt="Cover of ${esc(b.title)} by Lorcán O’Neill"><div><h3 class="or-h">${esc(b.title)}</h3>${b.sub?`<p class="or-sub">${esc(b.sub)}</p>`:""}<p class="or-p">${esc(b.about)}</p></div></article>`+(b.excerpt&&b.excerpt.length?`<div class="or-exc">${b.excerpt.map(x=>`<p>${esc(x).replace(/\*([^*]+)\*/g,"<em>$1</em>")}</p>`).join("")}</div>`:empty("Excerpt coming soon.","A short passage from the book will live here."))+`<div class="or-shelfrow" aria-label="The collection">${ROOM.books.map((x,i)=>`<button type="button" data-goto-book="${i}" class="${i===n?"on":""}" aria-label="${esc(x.title)}"><img src="${bookSrc(x,400)}" alt="" width="400" height="600" loading="lazy"></button>`).join("")}</div>`}
  if(kind&&kind.startsWith("frame:")){const i=+kind.slice(6),p=ROOM.paintings[i],n=ROOM.paintings.length;return `<span class="or-kick">Private view · ${toRoman(i+1)} of ${toRoman(n)}</span>`+(p?`<h3 class="or-h">${esc(p.title)}</h3><p class="or-p">By Lorcán O’Neill.</p><div class="pv"><button class="pv-nav" type="button" data-goto-pt="${(i+n-1)%n}" aria-label="Previous painting">‹</button><figure class="gold pv-art" style="--ar:${p.w}/${p.h}"><img src="${ptSrc(p,1000)}" srcset="${ptSrc(p,400)} 400w, ${ptSrc(p,1000)} 1000w" sizes="(max-width:600px) 80vw, 560px" width="${p.w}" height="${p.h}" alt="${esc(p.title)}, a painting by Lorcán O’Neill"></figure><button class="pv-nav" type="button" data-goto-pt="${(i+1)%n}" aria-label="Next painting">›</button></div><div class="or-shelfrow pv-row" aria-label="All paintings">${ROOM.paintings.map((x,k)=>`<button type="button" data-goto-pt="${k}" class="gold${k===i?" on":""}" aria-label="${esc(x.title)}"><img src="${ptSrc(x,400)}" alt="" loading="lazy"></button>`).join("")}</div>`:`<h3 class="or-h">An empty frame</h3>`+empty("Nothing hung here yet.","The paintings are coming soon."))}
  if(kind==="books"){return `<span class="or-kick">On the shelf</span><h3 class="or-h">Writing</h3><div class="or-booklist">${ROOM.books.map(b=>`<article class="or-book"><img class="cv" src="${bookSrc(b,400)}" alt="" width="400" height="600" loading="lazy"><div><h4>${esc(b.title)}</h4><p>${esc(b.about)}</p>${b.excerpt&&b.excerpt.length?`<p class="ex">${esc(b.excerpt[0])}</p>`:`<p class="ex">Excerpt coming soon.</p>`}</div></article>`).join("")}</div>`}
  if(kind==="songs"){const v=ROOM.songs;return `<span class="or-kick">On the record player</span><h3 class="or-h">Beats</h3>`+(v.length?`<div class="or-tracks">${v.map((x,i)=>`<button class="or-track" data-song="${i}"><span class="pp">▶</span><span>${esc(x.title)}</span><span class="tm">${x.dur?fmt(x.dur):"–"}</span></button>`).join("")}</div><div class="or-bar"><i id="orProg"></i></div>`:empty("Still being pressed.","Beats will be playable here soon. Nothing plays until you press play."))}
}
function openPanel(kind){
  orBody.innerHTML=panelHTML(kind);orPanel.classList.remove("clear");orPanel.hidden=false;$("#orX").focus({preventScroll:true});
  orBody.querySelectorAll("[data-goto-pt]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.gotoPt;remember("frame"+i);openPanel("frame:"+i);const pi=orPanel.querySelector(".or-panel-in");if(pi)pi.scrollTo({top:0})}));
  orBody.querySelectorAll("[data-goto-book]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.gotoBook;remember("book"+i);openPanel("book:"+i);const pi=orPanel.querySelector(".or-panel-in");if(pi)pi.scrollTo({top:0,behavior:reduced?"auto":"smooth"})}));
  const stage=orBody.querySelector("#orStage"),playAt=i=>{stage.innerHTML=ytStage(ROOM.videos[i],true)};
  stage&&stage.addEventListener("click",e=>{if(e.target.closest("[data-play]"))playAt(Math.min(RM.lastVideo||0,ROOM.videos.length-1))});
  orBody.querySelectorAll("[data-vid]").forEach(b=>b.addEventListener("click",e=>{const i=+b.dataset.vid;const o=orBody.querySelector("#ytOut");if(o)o.href="https://www.youtube.com/watch?v="+ROOM.videos[i].yt;remember("lastVideo",i);orBody.querySelectorAll("[data-vid]").forEach(x=>x.classList.toggle("on",x===b));if(MPA)playAt(i);else stage.innerHTML=ytStage(ROOM.videos[i],false)}));
  orBody.querySelectorAll("[data-pt]").forEach(b=>b.addEventListener("click",()=>{const p=ROOM.paintings[+b.dataset.pt];orBody.innerHTML=`<span class="or-kick">Paintings</span><h3 class="or-h">${esc(p.title)}</h3><img src="${p.src}" alt="${esc(p.title)}" style="width:100%;margin-top:18px;border-radius:10px"><button class="btn btn-line btn-sm" style="margin-top:16px" onclick="openPanel('paintings')">All paintings</button>`}));
  orBody.querySelectorAll("[data-song]").forEach(b=>b.addEventListener("click",()=>{
    const i=+b.dataset.song;if(!orAudio){orAudio=new Audio();orAudio.preload="none";orAudio.addEventListener("timeupdate",()=>{const p=$("#orProg");if(p)p.style.width=(orAudio.currentTime/orAudio.duration*100||0)+"%";const on=orBody.querySelector(".or-track.on .tm");if(on)on.textContent=fmt(orAudio.currentTime)});orAudio.addEventListener("ended",()=>{const nx=+orAudio.dataset.i+1;room.classList.remove("playing");if(nx<ROOM.songs.length){const btn=orBody.querySelector('[data-song="'+nx+'"]');if(btn&&!orPanel.hidden)btn.click();else{orAudio.src=ROOM.songs[nx].src;orAudio.dataset.i=nx;orAudio.play().then(()=>room.classList.add("playing")).catch(()=>{})}}})}
    const same=orAudio.dataset.i==String(i);
    if(same&&!orAudio.paused){orAudio.pause();room.classList.remove("playing");b.querySelector(".pp").textContent="▶";return}
    orBody.querySelectorAll(".or-track .tm").forEach((t,k)=>{const d=ROOM.songs[k].dur;t.textContent=d?fmt(d):"–"});
    if(!same){orAudio.src=ROOM.songs[i].src;orAudio.dataset.i=i}
    orAudio.play().then(()=>{room.classList.add("playing");remember("songs");orBody.querySelectorAll(".or-track").forEach(x=>{x.classList.toggle("on",x===b);x.querySelector(".pp").textContent=x===b?"❚❚":"▶"})}).catch(()=>toast("That track couldn't play."));
  }));
}
function closePanel(){orPanel.hidden=true;const v=$("#orVid");v&&v.pause();orBody.querySelectorAll("iframe").forEach(f=>f.remove());room.classList.remove("zoom");room.querySelectorAll(".or-fr.focus").forEach(x=>x.classList.remove("focus"));room.querySelectorAll(".bk.out").forEach(b=>{b.classList.remove("out");b.classList.add("read")})}
room.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{remember(b.dataset.open);openPanel(b.dataset.open)}));
$("#orX")?.addEventListener("click",closePanel);
orPanel&&orPanel.addEventListener("click",e=>{if(e.target===orPanel)closePanel()});
document.addEventListener("keydown",e=>{if(room.hidden)return;if(e.key==="Escape"){e.preventDefault();orPanel.hidden?closeRoom():closePanel()}});

// ---------- Welcome: Lor opens the doors ----------
const intro=$("#intro");let introT=[],introRunning=false;
function at(ms,fn){introT.push(setTimeout(fn,ms))}
function introFinish(){
  introT.forEach(clearTimeout);introT=[];
  intro.classList.add("done");
  setTimeout(()=>{document.documentElement.classList.remove("intro-on");intro.className="intro";introRunning=false;$("#main").focus({preventScroll:true})},460);
  try{sessionStorage.setItem("lor-intro","1")}catch(e){}
}
function introOpen(fast){
  intro.classList.add("out","open");if(fast)intro.classList.add("fast");
  const home=document.querySelector('[data-page="home"]');if(home&&!home.hidden)setTimeout(()=>replayAnims(home),fast?120:380);
  at(fast?420:1000,introFinish);
}
function runIntro(){
  if(reduced)return;
  introRunning=true;introT.forEach(clearTimeout);introT=[];
  intro.className="intro";document.documentElement.classList.add("intro-on");
  const imgs=[...intro.querySelectorAll("img")];
  const ready=Promise.race([Promise.all(imgs.map(i=>i.decode?i.decode().catch(()=>{throw 0}):Promise.resolve())),new Promise((_,r)=>setTimeout(()=>r(0),1200))]);
  at(80,()=>intro.classList.add("lit"));
  ready.then(()=>{
    at(420,()=>intro.classList.add("in"));
    at(950,()=>intro.classList.add("greet"));
    at(2300,()=>introOpen(false));
  }).catch(()=>{at(700,()=>introOpen(false))});
}
function skipIntro(){if(!introRunning||intro.classList.contains("open"))return;introT.forEach(clearTimeout);introT=[];introOpen(true)}
intro.addEventListener("click",skipIntro);
document.addEventListener("keydown",e=>{if(introRunning&&(e.key==="Escape"||e.key==="Enter"||e.key===" ")){e.preventDefault();skipIntro()}});
$("#replayIntro")?.addEventListener("click",()=>{const was=routeKey()==="home";if(!was)go("home");window.scrollTo(0,0);setTimeout(runIntro,was?0:200)});

// Work cards: motion-only reveal (cards are visible at rest)
let io=null;
function armReveal(){
  if(!("IntersectionObserver" in window)||reduced)return;
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove("pre");io.unobserve(en.target)}}),{threshold:.18});
  const cols=getComputedStyle(document.querySelector(".bc-grid")||document.body).gridTemplateColumns.split(" ").length;
  const nc=innerWidth>=1024?3:innerWidth>=768?2:1;const bcs=[...document.querySelectorAll(".page:not([hidden]) .bc")];bcs.forEach((el,i)=>{const last=nc===3&&i===bcs.length-1&&bcs.length%3===1,col=i%nc;const dir=nc===1?(i%2?-1:1):last?0:col===0?1:col===nc-1?-1:0;el.style.setProperty("--i",nc===1?0:col);el.style.setProperty("--dir",dir);el.style.setProperty("--dy",dir===0?"50px":"0px")});
  // Mark everything and let the observer decide what's on screen. Don't trust innerHeight:
  // inside some app viewers the page is laid out at full height and the app scrolls it.
  document.querySelectorAll(".page:not([hidden]) .rv,.page:not([hidden]) .bc").forEach(el=>{el.classList.add("pre");io.observe(el)});
}
maskHeads();renderFilters();renderPosts();route();widont();
(function(){const d=document.documentElement;d.classList.add('lzon');const mark=i=>i.classList.add('ld');document.addEventListener('load',e=>{const t=e.target;if(t.tagName==='IMG')mark(t)},true);document.addEventListener('error',e=>{const t=e.target;if(t.tagName==='IMG')mark(t)},true);document.querySelectorAll('img').forEach(i=>{if(i.complete)mark(i)})})();
if(document.documentElement.classList.contains("intro-on"))runIntro();
















// ---------- Websites page: hero index, scrolling previews, device toggle ----------
(function(){
  const pg=()=>document.querySelector('[data-page="websites"]');if(!pg())return;
  const hov=matchMedia("(hover:hover) and (pointer:fine)").matches,red=matchMedia("(prefers-reduced-motion:reduce)").matches;
  function run(s,on){const im=s.querySelector("img");if(!im)return;const d=Math.max(0,im.getBoundingClientRect().height-s.clientHeight);
    s.style.setProperty("--d",(-d)+"px");s.style.setProperty("--t",(on?Math.max(3,d/380):Math.min(1.6,.5+d/2400)).toFixed(2)+"s");
    s.classList.toggle("run",on&&!red);s.setAttribute("aria-pressed",String(on&&!red))}
  document.addEventListener("pointerenter",e=>{const s=e.target.closest&&e.target.closest(".ws-screen");if(s&&hov&&e.pointerType==="mouse")run(s,true)},true);
  document.addEventListener("pointerleave",e=>{const s=e.target.closest&&e.target.closest(".ws-screen");if(s&&hov&&e.pointerType==="mouse"&&e.target===s)run(s,false)},true);
  document.addEventListener("click",e=>{
    const s=e.target.closest(".ws-screen");if(s){if(!hov||e.detail===0)run(s,!s.classList.contains("run"));return}
    const t=e.target.closest(".ws-tog button");if(t){const g=t.closest(".ws"),st=g.querySelector(".ws-stage");st.dataset.v=t.dataset.v;
      g.querySelectorAll(".ws-tog button").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));
      st.querySelectorAll(".ws-screen.run").forEach(x=>run(x,false));return}
  });
  const fan=document.getElementById("wsxFan");
  const on=k=>{if(!fan)return;if(k){fan.dataset.on=k;fan.querySelectorAll("i").forEach(i=>i.classList.toggle("on",i.dataset.k===k))}else{delete fan.dataset.on;fan.querySelectorAll("i").forEach(i=>i.classList.remove("on"))}};
  document.addEventListener("mouseover",e=>{const b=e.target.closest(".wsx-index button");on(b?b.dataset.k:null)});
  document.addEventListener("focusin",e=>{const b=e.target.closest(".wsx-index button");if(b)on(b.dataset.k)});
})();
