import sys, asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":820,"height":1180}); pg = await ctx.new_page()
        await pg.goto("file:///home/claude/svt/terminale/theme-1/entrainement-atmosphere-climat.html"); await pg.wait_for_timeout(300)
        await pg.evaluate("go('accueil')"); await pg.screenshot(path="test/s-home.png")
        await pg.evaluate("S.lv.e6='hard'; go('e6')"); await pg.wait_for_timeout(200); await pg.screenshot(path="test/s-e6.png", full_page=True)
        ctx2 = await b.new_context(viewport={"width":390,"height":844}, color_scheme="dark"); pg2 = await ctx2.new_page()
        await pg2.goto("file:///home/claude/svt/terminale/theme-1/qcm-atmosphere-climat.html#p1"); await pg2.wait_for_timeout(300)
        el = pg2.locator("#p1q1"); await el.locator(".opt").nth(0).click(); await el.locator("[data-v]").click(); await el.locator("[data-h]").click(); await el.locator("[data-h]").click()
        await el.screenshot(path="test/s-qphone.png")
        await b.close()
asyncio.run(main())
