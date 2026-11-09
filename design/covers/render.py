import asyncio,json,sys
from playwright.async_api import async_playwright
B=[
 dict(key="seers-of-the-north",num="I",title="Seers of the North",sub="Prophecy, Power and the O’Neill Dynasty",art="seers",bg="#0b0d0e",wash="rgba(120,140,150,.16)",acc="#B8473B",glow="rgba(180,60,50,.25)",ts=118),
 dict(key="honey-and-flies",num="II",title="Honey <em>&amp;</em> Flies",sub="The Art of Not Explaining Yourself",art="honey",bg="#0c0904",wash="rgba(217,164,65,.14)",acc="#D9A441",glow="rgba(217,164,65,.3)",ts=132),
 dict(key="never-leave-neverland",num="III",title="Never Leave Neverland",sub="The Boy Within and the Man Who Forgot His Face",art="neverland",bg="#060c10",wash="rgba(90,150,170,.14)",acc="#E3D3A0",glow="rgba(120,170,190,.22)",ts=114),
 dict(key="through-the-noise",num="IV",title="Through the Noise",sub="Seeing Clearly in an Age of Infinite Distraction",art="noise",bg="#07080a",wash="rgba(127,209,216,.10)",acc="#7FD1D8",glow="rgba(127,209,216,.22)",ts=118),
 dict(key="state",num="V",title="State",sub="",art="state",bg="#0c0605",wash="rgba(255,106,0,.13)",acc="#FF7A2A",glow="rgba(255,106,0,.3)",ts=170),
 dict(key="children-of-the-glow",num="VI",title="Children of the Glow",sub="",art="glow",bg="#070910",wash="rgba(111,178,255,.12)",acc="#8DB8F0",glow="rgba(111,178,255,.25)",ts=118),
 dict(key="killing-all-of-the-trees",num="VII",title="Killing All of the Trees",sub="",art="trees",bg="#060a07",wash="rgba(141,179,122,.11)",acc="#9DBF86",glow="rgba(141,179,122,.22)",ts=112),
 dict(key="whats-mine-is-yours",num="VIII",title="What’s Mine Is Yours",sub="",art="mine",bg="#0b0907",wash="rgba(201,162,122,.12)",acc="#C9A27A",glow="rgba(201,162,122,.25)",ts=114),
]
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={"width":1200,"height":1800})
    await pg.goto("file://./cover.html");await pg.evaluate("document.fonts.ready")
    only=sys.argv[1:] 
    for o in B:
      if only and o["key"] not in only:continue
      await pg.evaluate("o=>render(o)",o);await pg.wait_for_timeout(300)
      await pg.screenshot(path=f"./{o['key']}.png")
    await b.close()
  json.dump(B,open("./books.json","w"))
asyncio.run(m())
