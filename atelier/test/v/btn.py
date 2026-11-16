import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-5/mouvement/vitesses-mouvements.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":390,"height":844},color_scheme="dark",device_scale_factor=2,has_touch=True,is_mobile=True)
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("dialog",lambda d: errs.append("DIALOG"))
        for v,n in [("p1",3),("p2",2),("p3",3),("p4",1)]:
            for i in range(n):
                await pg.goto(URL+"#"+v); await pg.reload(); await pg.wait_for_timeout(150); await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                small=await pg.evaluate("""Array.from(document.querySelectorAll('button,input')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height<44&&e.type!=='range'}).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().height))""")
                if small: print(v,i,"cibles<44:",small)
        await pg.goto(URL+"#p1"); await pg.reload(); await pg.wait_for_timeout(200); await pg.locator(".stepper button").nth(0).click()
        await pg.locator('[data-mj="6"]').click(); await pg.locator('[data-mj="1"]').click(); await pg.locator('[data-mi="0"]').click(); await pg.wait_for_timeout(100)
        await pg.locator(".part").first.screenshot(path="test/v/p-match.png")
        await pg.goto(URL+"#p2"); await pg.reload(); await pg.wait_for_timeout(200); await pg.locator(".stepper button").nth(0).click()
        await pg.locator('[data-a="run"]').click(); await pg.wait_for_timeout(2500); await pg.locator('[data-a="up"]').click(); await pg.locator('[data-a="up"]').click(); await pg.wait_for_timeout(3000); await pg.locator('[data-a="down"]').click(); await pg.locator('[data-a="down"]').click(); await pg.locator('[data-a="down"]').click(); await pg.wait_for_timeout(2500)
        await pg.locator('[data-a="run"]').click(); print("rover:",await pg.locator("#wz .readout").inner_text(),"|",await pg.locator('[data-a="run"]').inner_text())
        await pg.locator("#wz").screenshot(path="test/v/p-rover.png")
        await pg.locator(".stepper button").nth(1).click(); await pg.wait_for_timeout(200); await pg.locator(".doc").first.screenshot(path="test/v/p-chrono.png")
        await ctx.close()
        ctx=await b.new_context(viewport={"width":1280,"height":800}); pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(URL+"#p3"); await pg.locator("#projBtn").click(); await pg.locator(".stepper button").nth(1).click(); await pg.wait_for_timeout(300)
        print("proj overflow",await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"))
        ctx2=await b.new_context(viewport={"width":820,"height":1180}); await ctx2.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('x')}})")
        p2=await ctx2.new_page(); e2=[]; p2.on("pageerror",lambda e:e2.append(str(e))); await p2.goto(URL+"#p1"); await p2.wait_for_timeout(300); await p2.locator('[data-mj="0"]').click(); print("sans localStorage:",e2,await p2.locator(".mv.has").count())
        print("errors:",errs); await b.close()
asyncio.run(main())
