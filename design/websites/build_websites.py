"""Builds the Websites page (lorcan.space/websites) from websites.json and splices it into the site source.

Run:  python3 design/websites/build_websites.py [path/to/index.html]
Screenshots live in img/web/<key>-{desk,desk-sm,mob,top,top-sm,<detail>,<detail>-sm}.webp
(desktop shots at 1440 wide, mobile at 390 wide; see the capture notes in websites.json).
"""
import json, html, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/site/index.html'
IMG = os.path.join(os.path.dirname(SRC), 'img', 'web')
DATA = json.load(open(os.path.join(HERE, 'websites.json')))['projects']
E = html.escape

try:
    from PIL import Image
    def dims(n):
        with Image.open(os.path.join(IMG, n + '.webp')) as im: return im.size
except ImportError:
    def dims(n): return (1600, 1000)

ARROW = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>'

def img(n, alt, sizes, cls='', lazy=True, small=True):
    w, h = dims(n)
    ss = f' srcset="img/web/{n}-sm.webp {dims(n + "-sm")[0]}w, img/web/{n}.webp {w}w" sizes="{sizes}"' if small and os.path.exists(os.path.join(IMG, n + '-sm.webp')) else ''
    return (f'<img{" class=" + chr(34) + cls + chr(34) if cls else ""} src="img/web/{n}.webp"{ss} width="{w}" height="{h}" '
            f'alt="{E(alt)}"{" loading=" + chr(34) + "lazy" + chr(34) if lazy else ""} decoding="async">')

def hero():
    fan = ''.join(f'<i data-k="{p["key"]}" style="--n:{i}"><img src="img/web/{p["key"]}-top-sm.webp" width="900" height="563" alt="" decoding="async"></i>' for i, p in enumerate(DATA))
    idx = ''.join(f'''<li><button type="button" data-jump="ws-{p["key"]}" data-k="{p["key"]}"><b>{i+1:02d}</b><span class="wsx-nm">{E(p["name"])}</span><span class="wsx-ct">{E(p["category"])}</span><span class="wsx-lb">{E(p["label"])}</span>{ARROW}</button></li>''' for i, p in enumerate(DATA))
    return f'''  <section class="sec wsx-hero">
    <div class="wide wsx-hero-g">
      <div class="head rise">
        <span class="label">Websites</span>
        <h1 class="display">Selected <em class="acc">digital work.</em></h1>
        <p class="lede">Different industries. Different challenges. Websites built with character, clarity and a little ambition.</p>
      </div>
      <div class="wsx-fan" id="wsxFan" aria-hidden="true">{fan}</div>
    </div>
    <div class="wide"><ol class="wsx-index rv" aria-label="Projects on this page">{idx}</ol></div>
  </section>
'''

def project(i, p):
    k, n = p['key'], f'{i+1:02d}'
    dets = p.get('details', [])
    det_html = ''.join(f'<figure class="ws-df rv" style="--i:{j}">{img(d["img"], d["cap"], "(min-width:900px) 55vw, 94vw")}<figcaption>{E(d["cap"])}</figcaption></figure>' for j, d in enumerate(dets))
    dw, dh = dims(f'{k}-desk'); mw, mh = dims(f'{k}-mob')
    return f'''
  <article class="ws ws--{p["layout"]}" id="ws-{k}" style="--ws-acc:{p["accent"]}" aria-labelledby="ws-h-{k}">
    <div class="wide ws-g">
      <div class="ws-copy rv">
        <p class="ws-n"><span>{n}</span>{E(p["category"])}</p>
        <h2 class="ws-name" id="ws-h-{k}">{E(p["name"])}</h2>
        <p class="ws-tag"><i aria-hidden="true"></i>{E(p["label"])}</p>
        <p class="ws-sum">{E(p["summary"])}</p>
        <div class="ws-act">
          <a class="btn btn-primary ws-visit" href="{E(p["url"])}" target="_blank" rel="noopener">Visit the live site <svg class="ne" aria-hidden="true"><use href="#i-arrow"/></svg><span class="sr"> (opens in a new tab)</span></a>
          <div class="ws-tog" role="group" aria-label="{E(p["name"])} preview"><button type="button" data-v="d" aria-pressed="true">Desktop</button><button type="button" data-v="m" aria-pressed="false">Mobile</button></div>
        </div>
      </div>
      <div class="ws-stage rv" data-v="d">
        <figure class="ws-browser">
          <div class="ws-bar" aria-hidden="true"><i></i><i></i><i></i><span>{E(p["host"])}</span></div>
          <button type="button" class="ws-screen" aria-pressed="false" aria-label="Scroll through the {E(p["name"])} website, desktop view"><img src="img/web/{k}-desk.webp" srcset="img/web/{k}-desk-sm.webp 720w, img/web/{k}-desk.webp 1200w" sizes="(min-width:900px) 60vw, 94vw" width="{dw}" height="{dh}" alt="{E(p["name"])} website, full desktop page" loading="lazy" decoding="async"></button>
        </figure>
        <figure class="ws-phone">
          <button type="button" class="ws-screen" aria-pressed="false" aria-label="Scroll through the {E(p["name"])} website, mobile view"><img src="img/web/{k}-mob.webp" width="{mw}" height="{mh}" alt="{E(p["name"])} website, full mobile page" loading="lazy" decoding="async"></button>
        </figure>
        <p class="ws-hint" aria-hidden="true"><span class="h-f">Hover to scroll the page</span><span class="h-t">Tap the screen to scroll</span></p>
      </div>
    </div>
  </article>'''

OFFER = ['Creative direction', 'Website design', 'Development', 'Responsive experiences', 'Thoughtful interactions']
STEPS = [
 ('Coffee &amp; Introductions', "We meet virtually for a relaxed coffee, discuss your business, your ideas and what you'd like to achieve."),
 ('Content &amp; Planning', 'I gather what we need, organise the content and map out the structure of your website.'),
 ('First Draft', 'I get to work on the design and build, turning our ideas into a working website you can explore.'),
 ('Review Together', 'We meet virtually, walk through the website and discuss any changes or refinements.'),
 ('Domain &amp; Setup', 'I handle the technical setup, including connecting your domain and getting everything ready to go live.'),
 ('Launch', 'Your new website goes live, ready for the world to see.'),
]

def tail():
    offer = ''.join(f'<li>{o}</li>' for o in OFFER)
    steps = ''.join(f'<li style="--k:{i}"><span class="wsp-n">{i+1:02d}</span><span class="wsp-dot" aria-hidden="true"></span><h3>{t}</h3><p>{d}</p></li>' for i, (t, d) in enumerate(STEPS))
    return f'''
  <section class="sec wso" aria-labelledby="wso-h">
    <div class="wide"><div class="wso-g rv">
      <h2 class="label" id="wso-h">What I bring</h2>
      <p class="wso-lead">One person from first idea to launch. The design, the build and the small details that make a website feel finished.</p>
      <ul class="wso-list">{offer}</ul>
    </div></div>
  </section>
  <section class="sec wsp" aria-labelledby="wsp-h">
    <div class="wide">
      <div class="wsp-head rv">
        <span class="label">How it works</span>
        <h2 class="title" id="wsp-h">From first coffee <em class="acc">to launch.</em></h2>
        <p class="lede">Getting a great website shouldn't be complicated. I take care of the creative and technical heavy lifting, keeping you involved where it matters.</p>
      </div>
      <ol class="wsp-steps rv">{steps}</ol>
      <div class="wsp-close rv">
        <p class="wsp-big">Your ideas. <em class="acc">My heavy lifting.</em></p>
        <p class="wsp-sub">You focus on running your business. I'll take care of bringing your website to life.</p>
      </div>
    </div>
  </section>
  <section class="sec wsc">
    <div class="wide">
      <div class="wsc-card rv">
        <h2 class="display wsc-h">Your website could be <em class="acc">next.</em></h2>
        <p class="lede">Have something in mind? Let's make something worth looking at.</p>
        <div class="wsc-act">
          <a class="btn btn-primary" href="#contact">Start a conversation {ARROW}</a>
          <a class="wsc-mail" href="mailto:lorcancreative@gmail.com">lorcancreative@gmail.com</a>
        </div>
      </div>
    </div>
  </section>
'''

CSS = r'''
/* ================= Websites page ================= */
.page[data-page="websites"]{--ws-gap:clamp(96px,12vw,200px)}
.wsx-hero-g{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(32px,5vw,96px);align-items:center}
.wsx-hero .head{max-width:34rem}
.wsx-fan{position:relative;aspect-ratio:16/12;max-width:760px;width:100%;justify-self:end}
.wsx-fan i{position:absolute;width:72%;left:calc(var(--n) * 9.3%);top:calc(var(--n) * 11%);border-radius:10px;overflow:hidden;box-shadow:0 30px 60px -28px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.08);transition:transform .7s var(--e-out),opacity .5s,filter .5s;animation:wsxIn 1.1s var(--e-out) both;animation-delay:calc(.15s + var(--n) * .12s);z-index:calc(var(--n) + 1)}
.wsx-fan i img{display:block;width:100%;height:auto}
.wsx-fan[data-on] i{opacity:.35;filter:saturate(.6)}
.wsx-fan[data-on] i.on{opacity:1;filter:none;transform:translateY(-14px) scale(1.03);z-index:9}
@keyframes wsxIn{from{opacity:0;transform:translate(40px,30px) rotate(1.5deg)}to{opacity:1;transform:none}}
.wsx-index{list-style:none;margin:clamp(48px,6vw,88px) 0 0;padding:0;border-top:1px solid var(--line-2)}
.wsx-index button{width:100%;display:grid;grid-template-columns:52px minmax(0,1.1fr) minmax(0,1.6fr) auto 24px;gap:18px;align-items:center;padding:20px 0;border:0;border-bottom:1px solid var(--line-2);background:none;color:var(--ink);font:inherit;text-align:left;cursor:pointer;transition:padding .35s var(--e-out),color .25s}
.wsx-index b{font-family:var(--f-serif);font-style:italic;font-weight:400;color:var(--accent);font-size:18px}
.wsx-nm{font-family:var(--f-display);font-size:clamp(22px,2vw,30px);letter-spacing:-.03em}
.wsx-ct{color:var(--muted);font-size:var(--fs-small)}
.wsx-lb{font-size:var(--fs-label);letter-spacing:.14em;text-transform:uppercase;color:var(--faint);white-space:nowrap}
.wsx-index svg{width:18px;height:18px;transform:rotate(90deg);color:var(--faint);transition:transform .35s var(--e-out),color .25s}
.wsx-index button:hover,.wsx-index button:focus-visible{padding-left:10px}
.wsx-index button:hover svg,.wsx-index button:focus-visible svg{color:var(--accent);transform:rotate(90deg) translateX(4px)}
.wsx-index button:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
/* project */
.ws{padding-top:var(--ws-gap);scroll-margin-top:84px}
.ws-g{display:grid;gap:clamp(32px,4.5vw,80px);align-items:center}
.ws--split .ws-g{grid-template-columns:minmax(0,4fr) minmax(0,8fr)}
.ws--mirror .ws-g{grid-template-columns:minmax(0,8fr) minmax(0,4fr)}
.ws--mirror .ws-copy{order:2}
.ws--stage .ws-g,.ws--cinema .ws-g{grid-template-columns:minmax(0,1fr)}
.ws--stage .ws-copy,.ws--cinema .ws-copy{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);column-gap:clamp(32px,6vw,120px);align-items:end}
.ws--stage .ws-copy>*,.ws--cinema .ws-copy>*{grid-column:1;justify-self:start}
.ws--stage .ws-copy>.ws-sum,.ws--stage .ws-copy>.ws-think,.ws--stage .ws-copy>.ws-built,.ws--stage .ws-copy>.ws-act,
.ws--cinema .ws-copy>.ws-sum,.ws--cinema .ws-copy>.ws-think,.ws--cinema .ws-copy>.ws-built,.ws--cinema .ws-copy>.ws-act{grid-column:2}
.ws--stage .ws-copy>.ws-sum,.ws--cinema .ws-copy>.ws-sum{grid-row:1 / span 2;align-self:end;margin-top:0}
.ws--cinema .ws-stage{order:-1}
.ws-n{display:flex;gap:14px;align-items:baseline;margin:0;font-size:var(--fs-small);color:var(--muted)}
.ws-n span{font-family:var(--f-serif);font-style:italic;color:var(--accent);font-size:20px}
.ws-name{margin:14px 0 0;font-family:var(--f-display);font-weight:600;font-size:clamp(52px,7vw,112px);letter-spacing:-.05em;line-height:.92;color:var(--ink)}
.ws-tag{display:inline-flex;align-items:center;gap:10px;margin:22px 0 0;padding:7px 14px;border:1px solid var(--line-2);border-radius:999px;font-size:var(--fs-label);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.ws-tag i{width:7px;height:7px;border-radius:50%;background:var(--ws-acc)}
.ws-sum{margin:26px 0 0;font-size:clamp(19px,1.6vw,24px);line-height:1.45;color:var(--ink);max-width:30ch;text-wrap:pretty}
.ws-think{margin:16px 0 0;color:var(--muted);line-height:1.7;max-width:46ch;text-wrap:pretty}
.ws-built{margin:16px 0 0;font-size:var(--fs-small);color:var(--faint)}
.ws-act{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;margin-top:30px}
.ws-visit svg.ne{transform:rotate(-45deg)}
.ws-tog{display:inline-flex;padding:4px;border:1px solid var(--line-2);border-radius:999px}
.ws-tog button{border:0;background:none;color:var(--muted);font:inherit;font-size:14px;font-weight:500;padding:9px 16px;border-radius:999px;cursor:pointer;transition:background .25s,color .25s;min-height:40px}
.ws-tog button[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
.ws-tog button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
/* devices */
.ws-stage{position:relative;padding:0 9% 9% 0;margin:0}
.ws--mirror .ws-stage{padding:0 0 9% 9%}
.ws-stage::before{content:"";position:absolute;inset:10% 4% 0 8%;background:radial-gradient(closest-side,color-mix(in srgb,var(--ws-acc) 26%,transparent),transparent);filter:blur(30px);opacity:.55;pointer-events:none;z-index:0}
.ws-browser,.ws-phone{margin:0;position:relative;z-index:1}
.ws-browser{border-radius:14px;overflow:hidden;background:#141414;box-shadow:0 50px 100px -40px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.09);transition:transform 1.1s var(--e-out),opacity .9s var(--e-out),filter .5s}
.ws-bar{display:flex;align-items:center;gap:7px;height:34px;padding:0 14px;background:#1c1c1c;border-bottom:1px solid rgba(255,255,255,.06)}
.ws-bar i{width:10px;height:10px;border-radius:50%;background:#3a3a3a}
.ws-bar span{margin:0 auto;padding:4px 16px;border-radius:7px;background:#262626;color:#9a9a9a;font-size:12px;letter-spacing:.01em;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ws-screen{display:block;width:100%;padding:0;border:0;margin:0;background:#0d0d0d;overflow:hidden;cursor:ns-resize;position:relative;aspect-ratio:16/10}
.ws-screen img{display:block;width:100%;height:auto;transform:translateY(0);transition:transform var(--t,1.2s) cubic-bezier(.45,.05,.25,1);will-change:transform}
.ws-screen.run img{transform:translateY(var(--d,0px))}
.ws-screen:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.ws-phone{position:absolute;right:0;bottom:0;width:23%;padding:7px;border-radius:30px;background:#0b0b0b;box-shadow:0 40px 80px -30px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.12),inset 0 0 0 1px rgba(255,255,255,.04);transform-origin:100% 100%;transition:transform .9s var(--e-out) .15s,opacity .8s var(--e-out) .15s}
.ws--mirror .ws-phone{right:auto;left:0;transform-origin:0 100%}
.ws-phone .ws-screen{aspect-ratio:390/844;border-radius:23px}
.ws-hint{position:absolute;left:0;bottom:0;margin:0;font-size:12px;letter-spacing:.06em;color:var(--faint);display:flex;align-items:center;gap:8px}
.ws--mirror .ws-hint{left:auto;right:0}
.ws-hint::before{content:"";width:16px;height:1px;background:var(--faint)}
.ws-hint .h-t{display:none}
@media (hover:none){.ws-hint .h-f{display:none}.ws-hint .h-t{display:inline}}
.ws-stage.pre .ws-browser{transform:translateY(56px);opacity:0}
.ws-stage.pre .ws-phone{transform:translate(28px,90px) rotate(3deg);opacity:0}
.ws-stage[data-v="m"] .ws-browser{opacity:.28;filter:saturate(.4);transform:scale(.97)}
.ws-stage[data-v="m"] .ws-phone{transform:scale(1.45) translate(-12%,-6%)}
.ws--mirror .ws-stage[data-v="m"] .ws-phone{transform:scale(1.45) translate(12%,-6%)}
/* stage + cinema: wide devices */
.ws--stage .ws-stage{padding:0 7% 7% 0;margin-top:clamp(36px,4vw,64px)}
.ws--stage .ws-phone{width:18%}
.ws--stage .ws-stage[data-v="m"] .ws-phone{transform:scale(1.5) translate(-10%,-8%)}
.ws--cinema .ws-stage{width:calc(100vw - 2 * clamp(14px,1.6vw,28px));max-width:none;margin-left:calc(50% - 50vw + clamp(14px,1.6vw,28px));padding:0 clamp(60px,6vw,110px) clamp(56px,5vw,90px) 0;margin-bottom:clamp(24px,3vw,48px)}
.ws--cinema .ws-browser{border-radius:22px}
.ws--cinema .ws-browser .ws-screen{aspect-ratio:16/8.2}
.ws--cinema .ws-phone{right:0;bottom:0;width:clamp(170px,15vw,250px)}
.ws--cinema .ws-stage[data-v="m"] .ws-phone{transform:scale(1.5) translate(-18%,-10%)}
.ws--cinema .ws-hint{left:clamp(16px,2vw,28px)}
.ws--cinema .ws-stage.pre .ws-browser{transform:scale(.97);opacity:0}
/* details */
.ws-det{display:grid;gap:clamp(20px,2.4vw,40px);margin-top:clamp(48px,6vw,96px);align-items:start}
.ws-det-2{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}
.ws-det-2 .ws-df:nth-child(2){margin-top:clamp(48px,8vw,140px)}
.ws--stage .ws-det-2{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
.ws--stage .ws-det-2 .ws-df:nth-child(1){margin-top:clamp(48px,8vw,140px)}
.ws--stage .ws-det-2 .ws-df:nth-child(2){margin-top:0}
.ws--cinema .ws-det-2{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.ws--cinema .ws-det-2 .ws-df:nth-child(2){margin-top:0}
.ws-det-1{grid-template-columns:minmax(0,1fr)}
.ws-det-1 .ws-df{display:grid;grid-template-columns:minmax(0,9fr) minmax(0,3fr);gap:clamp(20px,3vw,48px);align-items:end}
.ws-df{margin:0}
.ws-df img{display:block;width:100%;height:auto;border-radius:10px;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 30px 70px -40px #000}
.ws-df figcaption{margin-top:14px;font-size:var(--fs-small);color:var(--faint);max-width:44ch}
/* offer */
.wso{padding-top:var(--ws-gap)}
.wso-g{border-top:1px solid var(--line-2);padding-top:clamp(36px,4vw,56px);display:grid;grid-template-columns:minmax(0,3fr) minmax(0,9fr);gap:20px clamp(24px,5vw,96px)}
.wso .label{margin:0;padding-top:10px;align-self:start}
.wso-lead{margin:0;font-size:clamp(22px,2.3vw,34px);line-height:1.3;letter-spacing:-.02em;color:var(--ink);max-width:28ch;text-wrap:balance}
.wso-list{grid-column:2;list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:10px 0;color:var(--muted);font-size:clamp(15px,1.15vw,17px)}
.wso-list li{display:inline-flex;align-items:center}
.wso-list li:not(:last-child)::after{content:"";width:5px;height:5px;border-radius:50%;background:var(--accent);margin:0 14px;opacity:.85}
/* process */
.wsp{padding-top:var(--ws-gap)}
.wsp-head{max-width:46rem}
.wsp-head .lede{margin-top:20px}
.wsp-steps{list-style:none;margin:clamp(56px,7vw,100px) 0 0;padding:0;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0 clamp(14px,1.6vw,28px);position:relative}
.wsp-steps::before,.wsp-steps::after{content:"";position:absolute;left:0;right:0;top:66px;height:1px;background:var(--line-2)}
.wsp-steps::after{background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 50%,transparent));transform-origin:0 50%;transition:transform 1.8s cubic-bezier(.6,.05,.2,1) .2s}
.wsp-steps.pre::after{transform:scaleX(0)}
.wsp-steps li{position:relative;padding-right:8px;transition:opacity .7s var(--e-out),transform .7s var(--e-out);transition-delay:calc(.25s + var(--k) * .22s)}
.wsp-steps.pre li{opacity:0;transform:translateY(18px)}
.wsp-n{display:block;height:48px;font-family:var(--f-serif);font-style:italic;font-weight:300;font-size:44px;line-height:1;color:color-mix(in srgb,var(--accent) 80%,var(--ink));letter-spacing:-.02em}
.wsp-dot{display:block;width:11px;height:11px;margin:13px 0 0 2px;border-radius:50%;background:var(--bg);box-shadow:0 0 0 1.5px var(--accent);position:relative;z-index:1}
.wsp-steps li:last-child .wsp-dot{background:var(--accent);box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 22%,transparent)}
.wsp-steps h3{margin:26px 0 0;font-family:var(--f-display);font-size:clamp(18px,1.35vw,21px);font-weight:600;letter-spacing:-.02em;line-height:1.2;color:var(--ink);text-wrap:balance}
.wsp-steps p{margin:10px 0 0;font-size:var(--fs-small);line-height:1.6;color:var(--muted);text-wrap:pretty}
.wsp-close{margin-top:clamp(72px,9vw,140px);display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:20px clamp(24px,5vw,80px);align-items:end}
.wsp-big{margin:0;font-family:var(--f-display);font-weight:600;font-size:clamp(46px,6.4vw,104px);letter-spacing:-.05em;line-height:.95;color:var(--ink);text-wrap:balance}
.wsp-sub{margin:0;color:var(--muted);font-size:clamp(17px,1.3vw,20px);line-height:1.6;max-width:30ch}
/* cta */
.wsc{padding-top:var(--ws-gap);padding-bottom:clamp(40px,6vw,96px)}
.wsc-card{position:relative;overflow:hidden;border-radius:var(--r-lg);border:1px solid var(--line-2);padding:clamp(40px,7vw,120px) clamp(24px,6vw,110px);background:radial-gradient(60% 90% at 100% 100%,rgba(255,106,0,.16),transparent 70%),radial-gradient(50% 60% at 0% 0%,rgba(255,255,255,.035),transparent 70%),var(--bg-2)}
.wsc-h{margin:0;max-width:12ch}
.wsc-card .lede{margin-top:22px;max-width:34ch}
.wsc-act{display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px;margin-top:36px}
.wsc-mail{color:var(--ink);text-decoration:none;font-size:clamp(17px,1.4vw,20px);border-bottom:1px solid var(--accent);padding-bottom:3px}
.wsc-mail:hover{color:var(--accent)}
@media (max-width:1100px){
  .wsp-steps{grid-template-columns:repeat(3,minmax(0,1fr));row-gap:48px}
  .wsp-steps::before,.wsp-steps::after{display:none}
  .wsp-steps li{border-top:1px solid var(--line-2);padding-top:18px}
  .wsp-dot{display:none}
  .wsp-n{height:auto;font-size:36px}
  .wsp-steps h3{margin-top:12px}
}
@media (max-width:899px){
  .wsx-hero-g{grid-template-columns:minmax(0,1fr)}
  .wsx-fan{justify-self:stretch;max-width:none;aspect-ratio:16/11.5;margin-top:8px}
  .wsx-index button{grid-template-columns:40px minmax(0,1fr) 20px;gap:4px 12px;padding:16px 0}
  .wsx-ct{grid-column:2;grid-row:2}.wsx-lb{display:none}.wsx-index svg{grid-row:1 / span 2;grid-column:3}
  .ws-g,.ws--split .ws-g,.ws--mirror .ws-g{grid-template-columns:minmax(0,1fr)}
  .ws--mirror .ws-copy{order:0}
  .ws--stage .ws-copy,.ws--cinema .ws-copy{display:block}
  .ws--cinema .ws-stage{order:0;width:auto;margin-left:0;margin-bottom:0}
  .ws-stage,.ws--mirror .ws-stage,.ws--stage .ws-stage{padding:0 0 12% 0;margin-top:8px}
  .ws-phone,.ws--mirror .ws-phone,.ws--stage .ws-phone,.ws--cinema .ws-phone{left:auto;right:4px;bottom:0;width:27%;border-radius:20px;padding:5px;transform-origin:100% 100%}
  .ws-phone .ws-screen{border-radius:16px}
  .ws-hint,.ws--mirror .ws-hint,.ws--stage .ws-hint,.ws--cinema .ws-hint{left:0;right:auto;bottom:0}
  .ws-stage[data-v="m"]{padding-bottom:0}
  .ws-stage[data-v="m"] .ws-browser{display:none}
  .ws-stage[data-v="m"] .ws-phone,.ws--mirror .ws-stage[data-v="m"] .ws-phone,.ws--stage .ws-stage[data-v="m"] .ws-phone,.ws--cinema .ws-stage[data-v="m"] .ws-phone{position:relative;right:auto;width:min(68%,300px);margin:0 auto;transform:none}
  .ws-stage[data-v="m"] .ws-hint{position:relative;justify-content:center;margin-top:18px}
  .ws--cinema .ws-browser .ws-screen{aspect-ratio:16/10}
  .ws-det-2,.ws--stage .ws-det-2,.ws--cinema .ws-det-2,.ws-det-1{grid-template-columns:minmax(0,1fr)}
  .ws-det-2 .ws-df:nth-child(n),.ws--stage .ws-det-2 .ws-df:nth-child(n){margin-top:0}
  .ws-det-1 .ws-df{grid-template-columns:minmax(0,1fr)}
  .wso-g{grid-template-columns:minmax(0,1fr)}.wso-list{grid-column:1}
  .wsp-close{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .wsp-steps{grid-template-columns:minmax(0,1fr);row-gap:0;padding-left:34px}
  .wsp-steps::before{display:block;left:5px;right:auto;top:8px;bottom:8px;width:1px;height:auto}
  .wsp-steps::after{display:block;left:5px;right:auto;top:8px;bottom:8px;width:1px;height:auto;transform-origin:50% 0;background:linear-gradient(180deg,var(--accent),color-mix(in srgb,var(--accent) 40%,transparent))}
  .wsp-steps.pre::after{transform:scaleY(0)}
  .wsp-steps li{border-top:0;padding:0 0 30px}
  .wsp-dot{display:block;position:absolute;left:-34px;top:9px;margin:0}
  .wsp-n{font-size:30px}
  .wsp-steps h3{margin-top:8px}
  .wso-list{flex-direction:column;gap:12px}.wso-list li::after{display:none}
  .wso-list li::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--accent);margin-right:14px}
}
@media (prefers-reduced-motion:reduce){
  .wsx-fan i{animation:none}
  .ws-screen img{transition:none}
  .ws-stage.pre .ws-browser,.ws-stage.pre .ws-phone,.wsp-steps.pre li{transform:none;opacity:1}
  .wsp-steps.pre::after{transform:none}
}
'''

JS = r'''
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
'''

def main():
    s = open(SRC).read()
    page = ('<!-- =================== WEBSITES =================== -->\n<div class="page" data-page="websites" hidden>\n'
            + hero() + ''.join(project(i, p) for i, p in enumerate(DATA)) + tail() + '</div>\n\n')
    a = '<!-- =================== WEBSITES =================== -->'
    if a in s:
        i = s.index(a); j = s.index('<!-- ===================', i + len(a)); s = s[:i] + page + s[j:]
    else:
        j = s.index('<!-- =================== STUDIO =================== -->'); s = s[:j] + page + s[j:]
    s = re.sub(r'\n/\* ================= Websites page ================= \*/.*?(?=\n/\* =+ end websites =+ \*/)', '', s, flags=re.S)
    s = s.replace('\n/* ===== end websites ===== */', '')
    i = s.index('</style>'); s = s[:i] + CSS + '/* ===== end websites ===== */\n' + s[i:]
    s = re.sub(r'\n// ---------- Websites page:.*?\n\}\)\(\);\n', '\n', s, flags=re.S)
    k = s.rindex('</script>'); s = s[:k] + JS + s[k:]
    open(SRC, 'w').write(s)
    print('websites page written:', len(DATA), 'projects')

if __name__ == '__main__':
    main()
