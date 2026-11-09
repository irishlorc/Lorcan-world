import asyncio
from playwright.async_api import async_playwright
R='/home/claude/lorcan-world'
F=f'file://{R}/fonts'
I=f'file://{R}/img'
CARDS=[('home','Hello,','I&rsquo;m <em>Lor.</em>','Creative, business &amp; AI. From Dublin, by way of the Netherlands.','<img class="fig" src="%s/tablet-bust.webp" style="height:610px;right:40px;bottom:-40px">'%I),
('about','A little','<em>about me.</em>','Dublin, nearly nine years in the Netherlands, eight books, and now Arkintel.','<img class="fig" src="%s/coffee-crop.webp" style="width:560px;right:20px;bottom:40px;border-radius:28px">'%I),
('experience','A few','<em>different hats.</em>','13+ years across design, communications, business and technology.','<img class="fig" src="%s/backpack-bust.webp" style="height:640px;right:30px;bottom:-60px">'%I),
('work','Some','<em>familiar names.</em>','Brands and organisations I&rsquo;ve worked for and with.',''.join('<img class="card" src="%s/work-%s-800.webp" style="%s">'%(I,n,st) for n,st in [('uefa','right:-30px;top:60px;width:340px;transform:rotate(9deg);filter:brightness(.7)'),('heineken','right:120px;top:150px;width:340px;transform:rotate(-7deg);filter:brightness(.82)'),('f1','right:10px;top:290px;width:360px;transform:rotate(-2deg)')])),
('thoughts','Things on','<em>my mind.</em>','Notes on AI, creativity, business and everyday life.','<img class="fig" src="%s/notebook-bust.webp" style="height:600px;right:40px;bottom:-30px">'%I),
('studio','Have a','<em>look.</em>','Four brand concepts: robotics, software, audio and furniture.',''.join('<img class="card" src="%s/%s" style="%s">'%(I,n,st) for n,st in [('studio2/k-ads-thumb.webp','right:250px;top:60px;width:380px;transform:rotate(-7deg);filter:brightness(.8)'),('studio3/w4-thumb.webp','right:-40px;top:40px;width:430px;transform:rotate(5deg)'),('studio3/w2-thumb.webp','right:80px;top:290px;width:360px;transform:rotate(-2deg)')])),
('contact','Let&rsquo;s','<em>talk.</em>','lorcancreative@gmail.com','<div class="fig" style="height:640px;width:427px;right:60px;bottom:-110px"><img src="%s/hi-arm.webp" style="position:absolute;inset:0;height:100%%;width:100%%"><img src="%s/hi-base.webp" style="position:absolute;inset:0;height:100%%;width:100%%"></div>'%(I,I)),
]
CSS=f'''@font-face{{font-family:B;src:url({F}/bricolage-latin.woff2);font-weight:200 800}}
@font-face{{font-family:Fr;font-style:italic;src:url({F}/fraunces-latin-italic.woff2);font-weight:100 900}}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;overflow:hidden;background:#090909;font-family:B;color:#F8F8F6;position:relative}}
.glow{{position:absolute;right:-120px;bottom:-200px;width:900px;height:760px;background:radial-gradient(closest-side,rgba(255,106,0,.30),rgba(255,69,0,.08) 60%,transparent)}}
.grain{{position:absolute;inset:0;background:radial-gradient(60% 80% at 0% 0%,rgba(255,255,255,.035),transparent 70%)}}
.txt{{position:absolute;left:80px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center}}
.k{{display:flex;align-items:center;gap:14px;font-size:22px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#A3A3A3;margin-bottom:34px}}
.k i{{width:36px;height:3px;background:linear-gradient(90deg,#FF4500,#FFB347);border-radius:2px}}
h1{{font-size:104px;font-weight:600;letter-spacing:-.045em;line-height:.98}}
h1 span{{display:block}}
em{{font-family:Fr;font-style:italic;font-weight:400;font-variation-settings:"opsz" 144;letter-spacing:-.02em;background:linear-gradient(135deg,#FF4500,#FF6A00 50%,#FFB347);-webkit-background-clip:text;color:transparent;padding-right:.08em}}
p{{margin-top:30px;font-size:27px;text-wrap:balance;line-height:1.35;color:#A3A3A3;max-width:520px}}
.url{{position:absolute;left:80px;bottom:44px;font-size:21px;color:#F8F8F6;letter-spacing:.01em}}
.url b{{color:#FF6A00;font-weight:500}}
.fig{{position:absolute;filter:drop-shadow(0 30px 40px rgba(0,0,0,.55))}}
.card{{position:absolute;width:420px;border-radius:22px;box-shadow:0 30px 50px rgba(0,0,0,.6)}}
.rule{{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#FF4500,#FF6A00,#FFB347)}}'''
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1200,'height':630})
        for key,a,c,sub,art in CARDS:
            open('/tmp/claude-0/og/t.html','w').write(f'<meta charset=utf-8><style>{CSS}</style><div class="glow"></div><div class="grain"></div>{art}<div class="txt"><div class="k"><i></i>Lorcán O&rsquo;Neill</div><h1><span>{a}</span><span>{c}</span></h1><p>{sub}</p></div><div class="url">lorcan<b>.space</b></div><div class="rule"></div>')
            await pg.goto('file:///tmp/claude-0/og/t.html')
            await pg.evaluate("document.fonts.ready");await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'{R}/og/{key}.jpg',type='jpeg',quality=86)
        # icons
        svg=open(f'{R}/static/favicon.svg').read()
        for n,sz in [('icon-192.png',192),('apple-touch-icon.png',180)]:
            await pg.set_viewport_size({'width':sz,'height':sz})
            await pg.set_content(f'<style>*{{margin:0}}svg{{width:{sz}px;height:{sz}px;display:block}}</style>'+svg)
            await pg.screenshot(path=f'{R}/static/{n}',omit_background=True)
        await b.close()
asyncio.run(m())
