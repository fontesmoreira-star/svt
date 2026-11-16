import sys, asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for app in ["fiches","qcm","entrainement"]:
            f=f"/home/claude/svt/terminale/theme-1/{app}-atmosphere-climat.html"
            for vp in [{"width":820,"height":1180},{"width":390,"height":844}]:
                ctx = await b.new_context(viewport=vp); pg = await ctx.new_page(); errs=[]
                pg.on("pageerror", lambda e: errs.append(str(e)))
                await pg.goto("file://"+f); await pg.wait_for_timeout(250)
                fs0 = await pg.evaluate("getComputedStyle(document.documentElement).fontSize")
                await pg.click("#fsPlus"); fs1 = await pg.evaluate("getComputedStyle(document.documentElement).fontSize")
                await pg.click("#fsMinus"); await pg.click("#fsMinus"); fs2 = await pg.evaluate("getComputedStyle(document.documentElement).fontSize")
                await pg.click("#themeBtn"); th = await pg.evaluate("document.documentElement.dataset.theme")
                await pg.click("#projBtn"); pj = await pg.evaluate("[document.documentElement.classList.contains('proj'), getComputedStyle(document.documentElement).fontSize]")
                views = await pg.evaluate("VIEWS"); ov=[]
                for v in views:
                    await pg.evaluate(f"go('{v}')"); await pg.wait_for_timeout(80)
                    o = await pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                    if o>0: ov.append((v,o))
                small = await pg.evaluate("""Array.from(document.querySelectorAll('button,input,select,textarea,summary')).filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && r.height>0 && (r.height<44 || r.width<44) && !e.classList.contains('linkbtn')}).map(e=>(e.className||e.tagName)+':'+Math.round(e.getBoundingClientRect().height)).slice(0,5)""")
                tm = ""
                if app=="entrainement":
                    await pg.click("#timerBtn"); tm = await pg.inner_text("#tabx")
                print(app, vp["width"], "font", fs0, "→", fs1, "→", fs2, "| theme", th, "| proj", pj, "| overflow(proj)", ov, "| small", small, "| timer", tm.replace("\n"," "), "| err", errs)
                await ctx.close()
        await b.close()
asyncio.run(main())
