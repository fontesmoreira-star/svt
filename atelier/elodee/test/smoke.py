import sys, asyncio
from playwright.async_api import async_playwright
f=sys.argv[1]; shots=sys.argv[2] if len(sys.argv)>2 else None
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for name, vp, scheme in [("ipad",{"width":820,"height":1180},"light"),("phone",{"width":390,"height":844},"dark"),("land",{"width":1180,"height":820},"light")]:
            ctx = await b.new_context(viewport=vp, color_scheme=scheme); pg = await ctx.new_page(); errs=[]
            pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto("file://"+f); await pg.wait_for_timeout(300)
            views = await pg.evaluate("VIEWS"); bad=[]
            for v in views:
                await pg.evaluate(f"go('{v}')"); await pg.wait_for_timeout(150)
                ov = await pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                if ov>0: bad.append((v,ov))
                if shots and name!="land": await pg.screenshot(path=f"{shots}-{name}-{v}.png", full_page=True)
            print(name, "views", views, "overflow", bad, "errors", errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
