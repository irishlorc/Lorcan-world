"""Generates the Studio overview + four case-study pages and splices them into index.html."""
import json, html, os, re
LD={'wadden':(1742,197),'kindling':(924,271),'rune':(1580,293),'fold':(1593,307)}
HD={'hero-wadden':(2400,1350),'hero-kindling':(2400,1600),'hero-fold':(2400,1350),'hero-rune':(2400,1350),'pv-rune':(2061,2576)}
def ld(n):
    w,h=LD[n.split('-')[0]];return f'width="{w}" height="{h}"'
SITE = '/home/claude/site/'
D = json.load(open('/tmp/claude-0/dims3.json'))
E = html.escape

def srcset(k):
    d, w, h = D[k]
    parts = [f'img/{d}/{k}-thumb.webp 1000w']
    if os.path.exists(f'{SITE}img/{d}/{k}-md.webp'): parts.append(f'img/{d}/{k}-md.webp 1600w')
    parts.append(f'img/{d}/{k}-full.webp {w}w')
    return ', '.join(parts)

def fig(k, cap, sizes, cls=''):
    d, w, h = D[k]
    return (f'<figure class="cs-fig rv {cls}" style="--ar:{w/h:.4f}"><button type="button" class="st-open" aria-label="Enlarge: {E(cap)}">'
            f'<img src="img/{d}/{k}-thumb.webp" srcset="{srcset(k)}" sizes="{sizes}" width="{w}" height="{h}" alt="{E(cap)}, concept artwork" loading="lazy" decoding="async"></button>'
            f'<figcaption>{E(cap)}</figcaption></figure>')

def note(title, text):
    return f'<div class="cs-note rv"><p class="cs-note-k">{E(title)}</p><p>{E(text)}</p></div>'

P = [
 dict(key='wadden', dirn='WADDEN is built to be trusted by people who inspect dikes for a living. The identity borrows from engineering drawings and safety signage: a navy field, a single warning yellow, mono type for anything measured. Photography stays documentary, shot in the flat light of the Wadden coast, so the robot reads as working equipment rather than a gadget.', n='01', name='WADDEN', logo='wadden-light', acc='#FEC104', hero='hero-wadden', hpos='60% 55%',
  ind='Maritime robotics', line='Eyes on the water line.',
  intro='A fictional Dutch engineering company whose autonomous robots inspect dikes, flood defences and the water infrastructure that keeps a low country dry.',
  aud='Water boards, infrastructure operators, engineering firms and municipalities.',
  disc=['Identity','Campaign','Print','Social','Web'],
  pal=['#012653','#1E6BFF','#FEC104','#FFFFFF'],
  feat=[
   ('full','w4','Photography campaign · "The night shift on the sea dike."', ('Photography','Documentary, never staged. Flat North Sea light, wet basalt and real weather, because the people buying this inspect dikes for a living and can spot a set-up shot instantly.')),
   ('split','w1','Identity system', ('Identity','The W reads as two folds of water running down a dike. Yellow means caution on a dike, so it is rationed: the flag in the logo, the bumpers on the machine and very little else.')),
   ('full','w3','Technology campaign · WD-07 launch', None),
   ('pair',('w5','w2'),('Technical brochure · spread','Business stationery'), ('Print','Brochure and stationery share one grid and one voice: plain engineering language, big photography, specification in mono. Documents that will be photocopied, filed and read on site.')),
   ('full','w8c','Website concept', ('Web','The site behaves like a control room: a live inspection feed, the run explained in three steps and a cross-section of the dike that shows what each sensor finds. It sells the outcome, an engineer who knows the state of every metre.')),
  ],
  more=[('w6','LinkedIn campaign')]),
 dict(key='kindling', dirn='Kindling had to feel like a helpful colleague, not another dashboard. The brand pairs a confident sans with an italic serif for the human aside, and speaks in the words a tradesperson would actually send. Photography shows the end of a working day, warm and unposed, so the product is always about the person it gives time back to.', n='02', name='Kindling', logo='kindling-light', acc='#00AE1D', hero='hero-kindling', hpos='50% 40%',
  ind='Small-business software', line='Less administration. More room to run your business.',
  intro='Fictional software that takes invoices, payment reminders, follow-ups and everyday admin off the people running small businesses, without adding another thing to learn.',
  aud='Freelancers, tradespeople, café owners and independent professionals.',
  disc=['Identity','Editorial','Advertising','Product UI','Web'],
  pal=['#2A1150','#00AE1D','#CDBEF5','#FBF4E6'],
  feat=[
   ('pair',('k1','k3'),('Advertising campaign','Product interface · payment reminder'), ('Voice','Small-business owners don\'t want software, they want their evenings back. So the brand shows real people at the end of a working day and the actual words a reminder would say, never a floating dashboard.')),
   ('full','k5','Poster campaign', None),
   ('split','k-identity','Identity system', ('Identity','A bold sans for the plain facts and an italic serif for the human aside. Purple and cream are the paper; green only ever means something got done.')),
   ('full','k4','Newsletter · The Weekly Kindling', ('Editorial','The newsletter reads like a small magazine rather than a product update: one lead story, a line to copy, three things to do before Friday. Its readers owe it nothing, so it has to earn the open.')),
   ('full','k6c','Website concept', ('Web','A masthead, a big headline and a collage of real moments. The website is set like the newsletter, so the brand feels the same wherever you meet it.')),
  ],
  more=[('k-social','Social campaign')]),
 dict(key='rune', dirn='RUNE is about restraint. Charcoal, off-white and real metal carry the brand, and violet is allowed once per layout, the way the light ring sits on the headphones. Every image is lit with one hard source on stone, plaster or fabric, so materials do the persuading and the typography stays quiet.', n='03', name='RUNE', logo='rune-light', acc='#5E21F2', hero='hero-rune', hpos='70% 50%',
  ind='Premium audio', line='Sound, without compromise.',
  intro='A fictional premium audio company making wireless headphones and home speakers that feel considered, tactile and effortless, and desirable before they are switched on.',
  aud='Music lovers, designers and people who care how their things are made.',
  disc=['Identity','Product imagery','Packaging','Outdoor','Web'],
  pal=['#161618','#EEECE7','#C9CBCF','#5E21F2'],
  feat=[
   ('pair',('ra','rb'),('Product hero campaign','Product detail'), ('Campaign','The object first, then the craft: the headphones on stone in one hard light, then the machined yoke up close. The type stays quiet so the product is the loudest thing in the frame.')),
   ('full','rf','Outdoor advertising', None),
   ('split','r1','Identity system', ('Identity','Charcoal, off-white and real metal. Violet appears once per layout, the way the light ring sits on the headphones, and nowhere else.')),
   ('full','rd','Speaker collection', None),
   ('full','rc','Editorial · magazine spread', ('Editorial','The brand earns its place in a magazine by being about listening, not specifications. A concrete room, a slice of winter sun and one record played start to finish.')),
   ('full','rg','Website concept', None),
  ],
  more=[('re','Packaging')]),
 dict(key='fold', dirn='FOLD sells a system, not a sofa. The logo is drawn from the same folded blocks as the furniture, and the language is about planning a room rather than buying a product. The photography lives in real Dutch rooms with low sun and lived-in props, and terracotta carries from the bouclé through to the box tape.', n='04', name='FOLD', logo='fold-light', acc='#B4553A', hero='hero-fold', hpos='55% 60%',
  ind='Modular furniture', line='Build the room. Rebuild it later.',
  intro='A fictional Dutch furniture company making modular pieces for modern homes: sofas, shelving and blocks that grow, shrink and move house with you.',
  aud='Design-conscious renters and homeowners in city apartments.',
  disc=['Identity','Catalogue','Retail','Packaging','E-commerce'],
  pal=['#B4553A','#2E4A3B','#8C6239','#2A2724','#F3ECDF'],
  feat=[
   ('full','fb','Product catalogue · seating spread', ('Catalogue','Every sofa starts as a single seat. The catalogue sells the system rather than the sofa, so the language is about planning a room in blocks.')),
   ('pair',('fc','fe'),('Furniture collection · The Stack','Packaging'), ('Retail and packaging','Terracotta and forest green carry from the bouclé to the box tape. The flat-pack boxes are numbered like the modules inside, so delivery day is part of the brand.')),
   ('split','f1','Identity system', ('Identity','The logo is built the way the furniture is: four letters made of folded, interlocking blocks.')),
   ('pair',('ff','fg'),('Showroom branding','Digital storefront · mobile'), None),
   ('full','fw','Website concept', ('Web','An architectural catalogue: an index down one side, one room at a time, and every piece shown as part of a set you can configure.')),
     ],
  more=[('fh','Social campaign')]),
]
WIDE = '(min-width:1700px) 1600px, 94vw'
HALF = '(min-width:900px) 48vw, 94vw'

def project(i, p):
    prv, nxt = P[i-1], P[(i+1) % 4]
    out = [f'''
<!-- =================== STUDIO {p["key"].upper()} =================== -->
<div class="page cs cs-{p["key"]}" data-page="studio-{p["key"]}" style="--cs-acc:{p["acc"]}" hidden>
  <section class="cs-hero">
    <img class="cs-hero-img" width="{HD[p["hero"]][0]}" height="{HD[p["hero"]][1]}" src="img/studio3/{p["hero"]}.webp" srcset="img/studio3/{p["hero"]}-sm.webp 1200w, img/studio3/{p["hero"]}.webp 2400w" sizes="100vw" alt="" style="object-position:{p["hpos"]}" fetchpriority="high">
    <div class="cs-hero-in wide">
      <a class="cs-back" href="#studio"><svg aria-hidden="true"><use href="#i-arrow"/></svg> The Studio</a>
      <div class="cs-hero-b">
        <p class="cs-k">{p["n"]} · {E(p["ind"])} · Independent work</p>
        <h1 class="cs-h"><img {ld(p["logo"])} src="img/studio2/logos/{p["logo"]}.svg" alt="{E(p["name"])}" class="cs-logo cs-logo-{p["key"]}"></h1>
        <p class="cs-line">{E(p["line"])}</p>
      </div>
    </div>
  </section>
  <section class="cs-intro wide">
    <div class="cs-intro-t rv">
      <p class="cs-lede">{E(p["intro"])}</p>
      <p class="cs-dir">{E(p["dirn"])}</p>
    </div>
    <dl class="cs-facts rv">
      <div><dt>Industry</dt><dd>{E(p["ind"])}</dd></div>
      <div><dt>Audience</dt><dd>{E(p["aud"])}</dd></div>
      <div><dt>Status</dt><dd>Self-initiated, fictional brand</dd></div>
      <div><dt>Disciplines</dt><dd>{" · ".join(p["disc"])}</dd></div>
      <div><dt>Palette</dt><dd class="cs-pal">{"".join(f'<i style="background:{c}" title="{c}"></i>' for c in p["pal"])}</dd></div>
    </dl>
  </section>''']
    side = 0
    for t, k, cap, nt in p['feat']:
        if t == 'full':
            out.append(f'  <section class="cs-ch wide">{fig(k,cap,WIDE)}{note(*nt) if nt else ""}</section>')
        elif t == 'pair':
            a, b = k; ca, cb = cap
            fr = ' '.join(f'{D[x][1]/D[x][2]:.4f}fr' for x in k)
            out.append(f'  <section class="cs-ch wide"><div class="cs-pair" style="grid-template-columns:{fr}">{fig(a,ca,HALF)}{fig(b,cb,HALF)}</div>{note(*nt) if nt else ""}</section>')
        elif t == 'split':
            side ^= 1
            out.append(f'  <section class="cs-ch wide cs-split{" rev" if side==0 else ""}">{note(*nt)}{fig(k,cap,"(min-width:900px) 62vw, 94vw")}</section>')
    one = len(p['more']) == 1
    gal = ''.join(fig(k, c, WIDE if one else '(min-width:900px) 46vw, 94vw', 'cs-g') for k, c in p['more'])
    out.append(f'''  <section class="cs-more wide">
    <h2 class="cs-more-h rv">More applications</h2>
    <div class="cs-gallery{" one" if one else ""}">{gal}</div>
  </section>
  <nav class="cs-nav wide" aria-label="Projects">
    <a class="cs-nav-p" href="#studio-{prv["key"]}"><span class="cs-k">← Previous</span><img {ld(prv["logo"])} src="img/studio2/logos/{prv["logo"]}.svg" alt="{E(prv["name"])}"></a>
    <a class="cs-nav-o" href="#studio"><span class="cs-k">All projects</span><span class="cs-nav-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></span></a>
    <a class="cs-nav-n" href="#studio-{nxt["key"]}"><span class="cs-k">Next →</span><img {ld(nxt["logo"])} src="img/studio2/logos/{nxt["logo"]}.svg" alt="{E(nxt["name"])}"></a>
  </nav>
</div>
''')
    return '\n'.join(out)

def pv(p, img, pos, posm, kind, sizes):
    return f"""      <a class="sw-pj sw-{kind} rv" href="#studio-{p["key"]}">
        <span class="sw-ph">
          <img class="sw-img" width="{HD[img][0]}" height="{HD[img][1]}" src="img/studio3/{img}-sm.webp" srcset="img/studio3/{img}-sm.webp 1200w, img/studio3/{img}.webp 2400w" sizes="{sizes}" alt="" loading="lazy" decoding="async" style="--pos:{pos};--posm:{posm}">
          <span class="sw-top"><span class="sw-n">{p["n"]}</span><span class="sw-ind">{E(p["ind"])}</span></span>
          <img {ld(p["logo"])} class="sw-logo sw-logo-{p["key"]}" src="img/studio2/logos/{p["logo"]}.svg" alt="{E(p["name"])}">
          <span class="sw-go" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
        </span>
        <span class="sw-cap"><span class="sw-line">{E(p["line"])}</span><span class="sw-disc">{" · ".join(p["disc"])}</span><span class="sr"> View project</span></span>
      </a>"""

W, K, R, F = P
overview = f'''<!-- =================== STUDIO =================== -->
<div class="page" data-page="studio" hidden>
  <section class="sec st-hero">
    <div class="wrap">
      <div class="head rise">
        <span class="label">The Possibilities Studio</span>
        <h1 class="display">Ideas without <em class="acc">a brief.</em></h1>
        <p class="lede">Most of my professional work has been created for companies and clients, where the finished work belongs.</p>
        <p class="st-sub">This is a separate space for my own ideas. Original brands, identities and creative projects, developed independently from concept through to execution.</p>
      </div>
    </div>
  </section>
  <section class="sw-list wide" aria-label="Projects">
    <div class="sw-head rv"><span class="label">Projects</span><span class="sw-count"><i>01</i> to <i>04</i></span></div>
{pv(W,'hero-wadden','60% 60%','80% 60%','feat','(min-width:1440px) 1360px, 100vw')}
    <div class="sw-pair">
{pv(K,'hero-kindling','100% 50%','92% 50%','card','(min-width:600px) 50vw, 100vw')}
{pv(R,'pv-rune','50% 62%','50% 62%','card','(min-width:600px) 50vw, 100vw')}
    </div>
{pv(F,'hero-fold','55% 62%','38% 62%','feat','(min-width:1440px) 1360px, 100vw')}
  </section>
  <section class="sec">
    <div class="wrap">
      <div class="hello-row rv">
        <div><p>Have something that needs building?</p></div>
        <a class="btn btn-primary" href="#contact">Let's talk <svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
      </div>
    </div>
  </section>
</div>
'''

CSS = r'''
/* ---- Studio: overview ---- */
.page[data-page="studio"] .st-hero{padding-bottom:clamp(28px,3.4vw,52px)}
.st-sub{margin:18px 0 0;max-width:44rem;color:var(--muted);line-height:1.65}
.st-fine{margin:26px 0 0;font-family:var(--f-serif);font-style:italic;font-size:var(--fs-small);color:var(--faint)}
.cs-dir{margin:28px 0 0;max-width:62ch;color:var(--muted);font-size:clamp(17px,1.25vw,19px);line-height:1.7}
.wide{max-width:calc(var(--max) + var(--gutter) + var(--gutter-r));margin:0 auto;padding-left:var(--gutter);padding-right:var(--gutter-r)}
.sw-list{display:grid;gap:clamp(44px,5.4vw,88px);padding-bottom:clamp(64px,8vw,128px)}
.sw-head{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-top:22px;border-top:1px solid var(--line-2);margin-bottom:calc(clamp(44px,5.4vw,88px) * -.55)}
.sw-count{font-size:var(--fs-label);letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.sw-count i{font-family:var(--f-serif);font-style:italic;font-size:17px;letter-spacing:0;text-transform:none;color:var(--accent)}
.sw-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(20px,2.4vw,40px)}
.sw-pj{display:grid;grid-template-rows:auto 1fr;gap:20px;min-width:0;color:var(--ink);text-decoration:none;transition:opacity .5s var(--e-out)}
.sw-pj.rv.pre{opacity:1;transform:none}
.sw-ph{position:relative;display:block;overflow:hidden;border-radius:10px;background:var(--bg-2);aspect-ratio:21/9;clip-path:inset(0 round 10px);transition:clip-path 1.3s var(--e-out),opacity .6s var(--e-out);transition-delay:var(--d,0s)}
.sw-card .sw-ph{aspect-ratio:1}
.sw-img{position:absolute;left:0;top:-9%;width:100%;height:118%;max-width:none;object-fit:cover;object-position:var(--pos,50% 50%);translate:0 calc(var(--p,0) * 1%);scale:1;will-change:translate;transition:scale 1.5s var(--e-out),opacity .6s var(--e-out);transition-delay:var(--d,0s)}
.sw-ph::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 26%,rgba(0,0,0,0) 48%,rgba(0,0,0,.66) 100%);transition:opacity .6s var(--e-out);opacity:.9}
.sw-top{position:absolute;z-index:1;left:clamp(18px,2.4vw,36px);top:clamp(16px,2.2vw,30px);display:flex;align-items:baseline;gap:14px;font-size:var(--fs-label);letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.86)}
.sw-n{font-family:var(--f-serif);font-style:italic;font-size:19px;letter-spacing:0;color:var(--accent)}
.sw-logo{position:absolute;z-index:1;left:clamp(18px,2.4vw,36px);bottom:clamp(20px,2.6vw,36px);height:auto;max-width:60%}
.sw-logo-wadden{width:clamp(180px,26vw,400px)}.sw-logo-fold{width:clamp(150px,19vw,300px)}
.sw-logo-kindling{width:clamp(130px,15vw,220px)}.sw-logo-rune{width:clamp(120px,13vw,200px)}
.sw-go{position:absolute;z-index:1;right:clamp(18px,2.4vw,36px);bottom:clamp(18px,2.4vw,32px);width:56px;height:56px;border-radius:50%;display:grid;place-items:center;color:#fff;border:1px solid rgba(255,255,255,.4);background:rgba(10,10,10,.28);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .45s var(--e-out),color .45s var(--e-out),border-color .45s var(--e-out),scale .45s var(--e-out),opacity .7s var(--e-out),translate .7s var(--e-out)}
.sw-go svg{width:20px;height:20px;rotate:-45deg;transition:rotate .5s var(--e-out)}
.sw-top,.sw-logo{transition:opacity .8s var(--e-out),translate .8s var(--e-out);transition-delay:calc(var(--d,0s) + .35s)}
.sw-go{transition-delay:0s,0s,0s,0s,calc(var(--d,0s) + .45s),calc(var(--d,0s) + .45s)}
.sw-cap{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 40px;align-items:baseline;align-content:start;padding-bottom:20px;border-bottom:1px solid var(--line-2);transition:opacity .8s var(--e-out),transform .8s var(--e-out);transition-delay:calc(var(--d,0s) + .5s)}
.sw-cap::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--accent);transform:scaleX(0);transform-origin:0 50%;transition:transform .8s var(--e-out)}
.sw-line{font-family:var(--f-serif);font-style:italic;font-weight:400;font-variation-settings:"opsz" 144;letter-spacing:-.01em;font-size:clamp(21px,2vw,30px);line-height:1.22;color:var(--ink);text-wrap:balance}
.sw-disc{font-size:var(--fs-small);color:var(--muted);transition:color .4s}
.sw-card .sw-cap{grid-template-columns:minmax(0,1fr)}
.sw-card .sw-line{font-size:clamp(20px,1.7vw,25px)}
.sw-pair .sw-pj:nth-child(2){--d:.14s}
/* reveal */
.sw-pj.pre .sw-ph{clip-path:inset(8% 5% 8% 5% round 10px);opacity:0}
.sw-pj.pre .sw-img{scale:1.16}
.sw-pj.pre .sw-top,.sw-pj.pre .sw-logo,.sw-pj.pre .sw-go{opacity:0;translate:0 14px}
.sw-pj.pre .sw-cap{opacity:0;transform:translateY(16px)}
/* hover and focus */
.sw-pj:focus-visible{outline:none}
.sw-pj:focus-visible .sw-ph{outline:2px solid var(--accent);outline-offset:4px}
@media (hover:hover){
  .sw-pj:hover .sw-img{scale:1.045}
  .sw-pj:hover .sw-ph::after{opacity:1}
  .sw-pj:hover .sw-go{background:var(--accent);border-color:var(--accent);color:#0A0A0A;scale:1.08}
  .sw-pj:hover .sw-go svg{rotate:0deg}
  .sw-pj:hover .sw-cap::after{transform:scaleX(1)}
  .sw-pj:hover .sw-disc{color:var(--ink)}
  .sw-pair:hover .sw-pj:not(:hover){opacity:.5}
}
.sw-pj:focus-visible .sw-go{background:var(--accent);border-color:var(--accent);color:#0A0A0A}
.sw-pj:focus-visible .sw-go svg{rotate:0deg}
.sw-pj:focus-visible .sw-cap::after{transform:scaleX(1)}
@media (max-width:899px){
  .sw-ph{aspect-ratio:16/9}
  .sw-card .sw-ph{aspect-ratio:4/5}
  .sw-cap{grid-template-columns:minmax(0,1fr);padding-bottom:18px}
  .sw-go{width:48px;height:48px}
}
@media (max-width:599px){
  .sw-list{gap:40px}
  .sw-head{margin-bottom:-14px}
  .sw-pair{grid-template-columns:minmax(0,1fr);gap:40px}
  .sw-ph,.sw-card .sw-ph{aspect-ratio:4/5}
  .sw-img{object-position:var(--posm,var(--pos,50% 50%))}
  .sw-pj{gap:16px}
  .sw-logo-wadden{width:min(72%,260px)}.sw-logo-fold{width:min(56%,210px)}.sw-logo-kindling{width:min(50%,190px)}.sw-logo-rune{width:min(46%,170px)}
  .sw-pair .sw-pj:nth-child(2){--d:0s}
}
@media (prefers-reduced-motion:reduce){
  .sw-img{translate:none;scale:1!important;transition:opacity .3s}
  .sw-pj.pre .sw-ph{clip-path:inset(0 round 10px);opacity:1}
  .sw-pj.pre .sw-top,.sw-pj.pre .sw-logo,.sw-pj.pre .sw-go,.sw-pj.pre .sw-cap{opacity:1;translate:none;transform:none}
}
/* ---- Studio: case studies ---- */
.cs-hero{position:relative;height:clamp(460px,82vh,940px);overflow:hidden;background:#000;margin-top:14px}
.cs-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cs-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 45%,rgba(0,0,0,.72) 100%)}
.cs-hero-in{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:clamp(20px,3vw,40px);padding-bottom:clamp(32px,5vw,72px)}
.cs-back{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-size:15px;font-weight:500;padding:10px 16px;border-radius:999px;background:rgba(0,0,0,.35);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.cs-back svg{width:16px;height:16px;transform:rotate(180deg)}
.cs-back:hover{background:rgba(0,0,0,.55)}
.cs-k{font-size:var(--fs-label);letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.78)}
.cs-h{margin:18px 0 0;line-height:0}
.cs-logo{width:clamp(220px,34vw,560px);height:auto}
.cs-logo-kindling{width:clamp(190px,24vw,380px)}.cs-logo-rune{width:clamp(160px,18vw,300px)}.cs-logo-fold{width:clamp(200px,26vw,440px)}
.cs-line{margin:22px 0 0;color:#fff;font-family:var(--f-serif);font-style:italic;font-weight:300;font-size:clamp(22px,2.4vw,36px);line-height:1.2;max-width:30ch}
.cs-intro{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(32px,6vw,120px);padding-top:clamp(56px,7vw,112px);padding-bottom:clamp(56px,7vw,112px)}
.cs-lede{margin:0;font-size:clamp(22px,2vw,30px);line-height:1.45;color:var(--ink);max-width:34ch;text-wrap:pretty}
.cs-facts{margin:0;display:grid;gap:22px;align-content:start}
.cs-facts div{display:grid;grid-template-columns:120px 1fr;gap:16px;padding-bottom:18px;border-bottom:1px solid var(--line-2)}
.cs-facts dt{font-size:var(--fs-label);letter-spacing:.16em;text-transform:uppercase;color:var(--faint);padding-top:4px}
.cs-facts dd{margin:0;color:var(--muted);line-height:1.6}
.cs-pal{display:flex;gap:8px}.cs-pal i{width:30px;height:30px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
.cs-ch{padding-bottom:clamp(64px,8vw,140px)}
.cs-fig{margin:0;min-width:0}
.cs-fig .st-open{border-radius:4px}
.cs-fig .st-open img{aspect-ratio:var(--ar);width:100%;height:auto}
.cs-fig figcaption{margin-top:14px;font-size:14px;color:var(--faint)}
.cs-pair{display:grid;gap:clamp(16px,2vw,32px);align-items:start}
.cs-note{margin-top:clamp(28px,3vw,44px);display:grid;grid-template-columns:minmax(0,3fr) minmax(0,7fr);gap:clamp(16px,4vw,80px);max-width:1180px}
.cs-note p{margin:0}
.cs-note p:last-child{font-size:clamp(18px,1.4vw,21px);line-height:1.6;color:var(--muted);max-width:60ch}
.cs-note-k{font-size:var(--fs-label);letter-spacing:.16em;text-transform:uppercase;color:var(--ink);padding-top:5px;display:flex;gap:12px;align-items:center}
.cs-note-k::before{content:"";width:22px;height:2px;background:var(--cs-acc,var(--accent))}
.cs-split{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:clamp(28px,5vw,96px);align-items:center}
.cs-split.rev{grid-template-columns:minmax(0,8fr) minmax(0,4fr)}.cs-split.rev .cs-note{order:2}
.cs-split .cs-note{margin:0;grid-template-columns:1fr;gap:16px}
.cs-more{padding-bottom:clamp(64px,8vw,120px);border-top:1px solid var(--line-2);padding-top:clamp(40px,5vw,72px)}
.cs-more-h{margin:0 0 clamp(24px,3vw,40px);font-size:var(--fs-label);letter-spacing:.16em;text-transform:uppercase;color:var(--ink);font-weight:600}
.cs-gallery{columns:2;column-gap:clamp(16px,2vw,32px)}
.cs-gallery.one{columns:1}
.cs-gallery .cs-fig{break-inside:avoid;margin-bottom:clamp(24px,3vw,44px)}
.cs-nav{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:stretch;padding-bottom:clamp(56px,7vw,110px)}
.cs-nav a{display:grid;gap:18px;align-content:space-between;padding:clamp(22px,2.6vw,36px);border:1px solid var(--line-2);border-radius:var(--r-lg);text-decoration:none;color:var(--ink);transition:border-color .3s,background .3s}
.cs-nav a:hover,.cs-nav a:focus-visible{border-color:var(--accent);background:rgba(255,106,0,.05)}
.cs-nav .cs-k{color:var(--faint)}
.cs-nav img{height:clamp(22px,2.6vw,36px);width:auto;max-width:100%}
.cs-nav-n{justify-items:end;text-align:right}
.cs-nav-o{justify-items:center;text-align:center}
.cs-nav-grid{display:grid;grid-template-columns:repeat(2,12px);gap:5px}.cs-nav-grid i{width:12px;height:12px;border-radius:2px;background:var(--ink);opacity:.8}
html.lzon .cs-fig img{opacity:0;transition:opacity .6s var(--e-out),transform 1.2s var(--e-out)}
html.lzon .cs-fig img.ld{opacity:1}
html.lzon .sw-img:not(.ld){opacity:0}
@media (max-width:899px){
  .cs-hero{height:clamp(420px,72vh,640px)}
  .cs-intro,.cs-split,.cs-split.rev{grid-template-columns:minmax(0,1fr)}
  .cs-split.rev .cs-note{order:0}
  .cs-note{grid-template-columns:1fr;gap:12px}
  .cs-gallery{columns:1}
  .cs-facts div{grid-template-columns:100px 1fr}
  .cs-nav{grid-template-columns:1fr 1fr}.cs-nav-o{grid-column:1/-1;grid-row:2}
}
@media (max-width:599px){.cs-pair{grid-template-columns:minmax(0,1fr)!important;gap:32px}}
'''

if __name__ == '__main__':
    p = SITE + 'index.html'; s = open(p).read()
    a = s.index('<!-- =================== STUDIO =================== -->'); b = s.index('<!-- =================== THOUGHTS =================== -->')
    s = s[:a] + overview + ''.join(project(i, x) for i, x in enumerate(P)) + '\n' + s[b:]
    # CSS: drop previous generated block, insert new before lightbox rules
    s = re.sub(r'\n/\* ---- Studio: overview ---- \*/.*?(?=\n\.st-lb\{)', '\n', s, flags=re.S)
    s = s.replace('\n.st-lb{', CSS.rstrip() + '\n.st-lb{', 1)
    open(p, 'w').write(s)
    print('ok')
