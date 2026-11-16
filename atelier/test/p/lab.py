import asyncio,sys
from playwright.async_api import async_playwright
lang=sys.argv[1]; URL="file:///home/claude/svt/2nde/theme-1/metabolisme/"+("potato-metabolism-dnl.html" if lang=="en" else "pomme-de-terre-metabolisme.html")
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light"); pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
            await pg.goto(URL+"#p1"); await pg.wait_for_timeout(200); await pg.locator('[data-h="1"]').click(); await pg.wait_for_timeout(200)
            say=lambda: pg.locator("#wz .readout").inner_text()
            async def act(k,wait=2300):
                await pg.locator(f'[data-act="{k}"]').click(); await pg.wait_for_timeout(wait); return (await say())[:70]
            print(name,"1",await act("sample",200)); print(name,"2",await act("amyl",200)); print(name,"3",await act("amyl2",1200)); print(name,"4",await act("wait",200)); print(name,"5",await act("bath",1200)); print(name,"6",await act("gluco",200))
            for i in range(5):
                await pg.locator('[data-act="sample"]').click(); await pg.wait_for_timeout(900 if i==2 else 2200)
                if i==2: await pg.locator("#wz").screenshot(path=f"test/p/{lang}-{name}-lab-mid.png"); await pg.wait_for_timeout(1400)
                if i<4: await act("wait",1700)
            print(name,"7",await act("wait",200)); print(name,"8",await act("gluco",1900))
            await pg.locator("#wz").screenshot(path=f"test/p/{lang}-{name}-lab-end.png")
            print(name,"rows",await pg.locator("#wz .res tr").count(),"overflow",await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"),"small",await pg.evaluate("Array.from(document.querySelectorAll('button')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height<44}).length"),"errs",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
