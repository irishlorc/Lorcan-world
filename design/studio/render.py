import asyncio,sys
from playwright.async_api import async_playwright
async def m(f):
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={"width":3500,"height":1500})
    await pg.goto("file:///tmp/claude-0/studio/"+f);await pg.evaluate("document.fonts.ready");await pg.wait_for_timeout(500)
    ids=await pg.evaluate("[...document.querySelectorAll('.ab')].map(e=>e.id)")
    for i in ids:
      await (await pg.query_selector('#'+i)).screenshot(path=f"/tmp/claude-0/studio/out/{i}.png")
    print(ids)
    await b.close()
asyncio.run(m(sys.argv[1]))
