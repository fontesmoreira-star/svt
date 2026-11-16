import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/revision-genetique-activites-1-10.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(viewport={"width":900,"height":300})
        await pg.goto(URL); await pg.wait_for_timeout(200)
        await pg.evaluate("""()=>{document.body.innerHTML='<div id=z style="display:flex;gap:6px;background:#fff">'+[0.76,0.8,0.83,0.86,0.9].map(t=>mitoSVG(170,110,t,'x')).join('')+'</div>'}""")
        await pg.locator("#z").screenshot(path="test/r10/mt.png"); await b.close()
asyncio.run(main())
