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

def pv(p, img, w, h, pos, cls):
    return f'''      <a class="sx-pv rv {cls}" href="#studio-{p["key"]}">
        <span class="sx-img" style="--ar:{w}/{h}"><img width="{HD[img][0]}" height="{HD[img][1]}" src="img/studio3/{img}-sm.webp" srcset="img/studio3/{img}-sm.webp 1200w, img/studio3/{img}.webp 2400w" sizes="(min-width:900px) 70vw, 100vw" alt="" loading="lazy" style="object-position:{pos}"><img {ld(p["logo"])} class="sx-logo sx-logo-{p["key"]}" src="img/studio2/logos/{p["logo"]}.svg" alt="{E(p["name"])}"></span>
        <span class="sx-meta"><span class="sx-n">{p["n"]}</span><span class="sx-ind">{E(p["ind"])}</span><span class="sx-disc">{" · ".join(p["disc"])}</span><span class="sx-go">View project <svg aria-hidden="true"><use href="#i-arrow"/></svg></span></span>
      </a>'''

W, K, R, F = P
overview = f'''<!-- =================== STUDIO =================== -->
<div class="page" data-page="studio" hidden>
  <section class="sec st-hero">
    <div class="wrap">
      <div class="head rise">
        <span class="label">Studio / Independent work</span>
        <h1 class="display">An idea is just <em class="acc">the beginning.</em></h1>
        <p class="lede">Four original brands, each developed with its own identity, visual language and creative direction.</p>
        <p class="st-sub">From industrial engineering to software, audio and furniture, these projects explore how a concept becomes something distinctive, coherent and believable.</p>
        <p class="st-fine">Self-initiated work. Fictional brands, independently conceived and designed.</p>
      </div>
    </div>
  </section>
  <section class="sx wide" aria-label="Projects">
{pv(W,'hero-wadden',21,9,'60% 55%','sx-a')}
    <div class="sx-row">
{pv(K,'hero-kindling',4,3,'50% 40%','sx-b')}
{pv(R,'pv-rune',4,5,'50% 55%','sx-c')}
    </div>
    <div class="sx-d-wrap">
{pv(F,'hero-fold',16,10,'55% 60%','sx-d')}
    </div>
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
.wide{max-width:calc(1600px + var(--gutter) + var(--gutter-r));margin:0 auto;padding-left:var(--gutter);padding-right:var(--gutter-r)}
.sx{display:grid;gap:clamp(56px,7vw,120px);padding-bottom:clamp(40px,6vw,96px)}
.sx-row{display:grid;grid-template-columns:7fr 5fr;gap:clamp(24px,3vw,48px);align-items:start}
.sx-pv{display:grid;gap:22px;text-decoration:none;color:var(--ink)}
.sx-img{position:relative;display:block;aspect-ratio:var(--ar);overflow:hidden;border-radius:6px;background:var(--bg-2)}
.sx-img img:first-child{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--e-out)}
.sx-img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.55));pointer-events:none}
.sx-pv:hover .sx-img img:first-child,.sx-pv:focus-visible .sx-img img:first-child{transform:scale(1.025)}
.sx-logo{position:absolute;z-index:1;left:clamp(20px,3vw,44px);bottom:clamp(20px,3vw,40px);height:auto;width:clamp(150px,22vw,360px)}
.sx-logo-kindling{width:clamp(130px,16vw,250px)}.sx-logo-rune{width:clamp(120px,14vw,220px)}.sx-logo-fold{width:clamp(140px,18vw,300px)}
.sx-meta{display:grid;grid-template-columns:auto auto 1fr auto;gap:8px 26px;align-items:baseline;padding-bottom:18px;border-bottom:1px solid var(--line-2)}
.sx-n{font-family:var(--f-serif);font-style:italic;color:var(--accent);font-size:20px}
.sx-ind{font-size:clamp(18px,1.5vw,22px);font-weight:500;color:var(--ink)}
.sx-disc{font-size:var(--fs-small);color:var(--muted)}
.sx-go{display:inline-flex;align-items:center;gap:10px;font-size:15px;font-weight:600;color:var(--ink);white-space:nowrap}
.sx-go svg{width:16px;height:16px;transition:transform .35s var(--e-out)}
.sx-pv:hover .sx-go svg,.sx-pv:focus-visible .sx-go svg{transform:translateX(5px)}
.sx-pv:hover .sx-go,.sx-pv:focus-visible .sx-go{color:var(--accent)}
.sx-c .sx-meta,.sx-b .sx-meta{grid-template-columns:auto 1fr auto}
.sx-c .sx-disc,.sx-b .sx-disc{grid-column:2/-1;grid-row:2}
.sx-d{grid-template-columns:8fr 4fr;align-items:end;gap:clamp(24px,3vw,48px)}
.sx-d .sx-meta{grid-template-columns:1fr;border-bottom:0;border-top:1px solid var(--line-2);padding:22px 0 0;gap:12px}
.sx-d .sx-ind{font-size:clamp(24px,2.2vw,34px);font-family:var(--f-display);letter-spacing:-.02em}
@media (max-width:899px){
  .sx-row,.sx-d{grid-template-columns:minmax(0,1fr)}
  .sx-a .sx-img{aspect-ratio:16/10}
  .sx-c .sx-img{aspect-ratio:4/3}
  .sx-meta,.sx-c .sx-meta,.sx-b .sx-meta{grid-template-columns:auto 1fr}
  .sx-disc,.sx-c .sx-disc,.sx-b .sx-disc{grid-column:1/-1;grid-row:auto}
  .sx-go{grid-column:1/-1}
}
@media (max-width:599px){.sx-a .sx-img{aspect-ratio:4/3}.sx-c .sx-img{aspect-ratio:4/5}}
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
html.lzon .cs-fig img,html.lzon .sx-img img:first-child{opacity:0;transition:opacity .6s var(--e-out),transform 1.2s var(--e-out)}
html.lzon .cs-fig img.ld,html.lzon .sx-img img.ld{opacity:1}
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
