import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/multiplication-cellulaire.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":390,"height":844},color_scheme="dark",device_scale_factor=2,has_touch=True,is_mobile=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("dialog",lambda d: errs.append("DIALOG "+d.message))
        for v,i in [("p1",1),("p2",0),("p4",0),("p3",0)]:
            await pg.goto(URL+"#"+v); await pg.reload(); await pg.wait_for_timeout(200); await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
            small=await pg.evaluate("""Array.from(document.querySelectorAll('button,input,[role=radio]')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.height<44)&&e.type!=='range'}).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().height))""")
            print(v,i,"cibles < 44px:",small,"overflow",await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"))
        for _ in range(9): await pg.locator("#fsPlus").click()
        print("fs max overflow",await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"))
        await pg.goto(URL+"#p4"); await pg.wait_for_timeout(200); await pg.locator("#livefig").screenshot(path="test/m/p-schema.png")
        await pg.goto(URL+"#p2"); await pg.wait_for_timeout(200); await pg.locator(".part").first.screenshot(path="test/m/p-order.png")
        await ctx.close()
        ctx=await b.new_context(viewport={"width":1280,"height":800}); pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(URL+"#p1"); await pg.locator("#projBtn").click(); await pg.locator(".stepper button").nth(1).click(); await pg.wait_for_timeout(300)
        print("proj overflow",await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"))
        ctx2=await b.new_context(viewport={"width":820,"height":1180}); await ctx2.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('bloqué')}})")
        p2=await ctx2.new_page(); e2=[]; p2.on("pageerror",lambda e:e2.append(str(e))); await p2.goto(URL+"#p1"); await p2.wait_for_timeout(300)
        await p2.locator('[data-a="run"]').first.click(); await p2.wait_for_timeout(500); print("sans localStorage:",e2, await p2.locator(".part").count())
        print("errors:",errs); await b.close()
asyncio.run(main())
