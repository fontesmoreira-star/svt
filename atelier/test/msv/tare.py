# Balance (exercice 5) : enchaînements rapides de boutons, tare pendant le versement, rechargement
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-4/masse-volume/masse-et-volume.html"
async def disp(pg): return await pg.evaluate("document.querySelector('#wz svg').getAttribute('aria-label')")
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); ctx=await b.new_context(viewport={"width":820,"height":1180})
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        async def go():
            await pg.goto(URL+"#p3"); await pg.wait_for_timeout(300); await pg.locator(".stepper button").nth(0).click(); await pg.wait_for_timeout(200)
        async def seq(name, steps, wait=2500):
            await go(); w=pg.locator("#wz")
            await w.locator('[data-a="rien"]').click(); await pg.wait_for_timeout(600)
            for a,t in steps: await w.locator(f'[data-a="{a}"]').click(); await pg.wait_for_timeout(t)
            await pg.wait_for_timeout(wait); print(f"{name:42s} →", await disp(pg), "|", (await w.locator("[data-ro]").inner_text())[:110])
        await seq("gobelet, tare, jus (lent)", [("gob",800),("tare",800),("jus",0)])
        await seq("gobelet, tare, jus (rapide)", [("gob",50),("tare",50),("jus",0)])
        await seq("gobelet, jus, tare pendant le versement", [("gob",600),("jus",400),("tare",0)])
        await seq("gobelet, jus, puis tare (jus versé)", [("gob",600),("jus",2500),("tare",0)])
        await seq("gobelet, tare, jus, jus", [("gob",600),("tare",300),("jus",2200),("jus",0)])
        await seq("jus sans gobelet", [("jus",0)])
        await seq("gobelet, tare, gobelet", [("gob",600),("tare",300),("gob",0)])
        await go(); print("après rechargement                         →", await disp(pg))
        print("errors:",errs); await b.close()
asyncio.run(main())
