import sys, asyncio
from playwright.async_api import async_playwright
f=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":390,"height":844}, permissions=["clipboard-read","clipboard-write"]); pg = await ctx.new_page(); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://"+f); await pg.wait_for_timeout(300)
        await pg.evaluate("S.lv.e5='easy'; go('e5', true)")
        await pg.fill("#item .part[data-k='0'] input", "-7"); await pg.fill("#item .part[data-k='1'] input", "5")
        for w in ["Interglacière", "glaciaire", "periode interglaciaire", "inter glaciaire"]:
            await pg.fill("#item .part[data-k='2'] input", w); await pg.click("#item [data-check]"); await pg.wait_for_timeout(50)
            print(w, "→", (await pg.inner_text("#item .part[data-k='2'] .pfbw")).strip())
        await pg.screenshot(path="test/e-phone-e5.png", full_page=True)
        await pg.evaluate("go('bilan')"); await pg.click("#bCp"); await pg.wait_for_timeout(200); print("copy:", await pg.inner_text("#bMsg"))
        print("errors", errs); await b.close()
asyncio.run(main())
