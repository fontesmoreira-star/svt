import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-4/revision-mission-4.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            async def step(g,i):
                await pg.goto(URL+"#"+g); await pg.reload(); await pg.wait_for_timeout(200)
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
            async def shot(sel,tag):
                await pg.locator(sel).first.scroll_into_view_if_needed(); await pg.locator(sel).first.screenshot(path=f"test/m4b/w-{name}-{tag}.png")
            await step("p1",0)
            await pg.locator('#wz [data-m="1"]').click(); await pg.wait_for_timeout(2500); await shot("#wz","part-a"); print(name,"part:",await pg.locator("#wz .readout").inner_text())
            await pg.wait_for_timeout(4000); await shot("#wz","part-b"); print(name,"part:",await pg.locator("#wz .readout").inner_text())
            await pg.wait_for_timeout(5000); await shot("#wz","part-c"); print(name,"part:",await pg.locator("#wz .readout").inner_text())
            await step("p1",1); await pg.wait_for_timeout(2500); await shot("#wz","scenes")
            await step("p1",2)
            for r in await pg.locator('#wz [data-a="run"]').all(): await r.click()
            await pg.wait_for_timeout(3500); await shot("#wz","masse-mid"); await pg.wait_for_timeout(4000); await shot("#wz","masse")
            await step("p2",0); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(14000); await shot("#wz","tp-mid"); print(name,"tp:",await pg.locator("#wz [data-rd]").inner_text())
            await pg.wait_for_timeout(13500); await shot("#wz","tp-end")
            await step("p2",1); await pg.locator(".part").nth(1).screenshot(path=f"test/m4b/w-{name}-plot.png")
            await step("p3",0)
            for sl,f in [("yaourt",58),("levure",41),("pain",70)]:
                await pg.locator(f'#wz [data-sl="{sl}"]').click(); await pg.locator('#wz [data-z="400"]').click()
                await pg.locator("#wz [data-f]").evaluate(f"(e)=>{{e.value={f};e.dispatchEvent(new Event('input'))}}"); await pg.wait_for_timeout(100); await shot("#wz .figbox",f"mic-{sl}")
            await pg.locator('#wz [data-z="40"]').click(); await pg.locator("#wz [data-f]").evaluate("(e)=>{e.value=20;e.dispatchEvent(new Event('input'))}"); await shot("#wz .figbox","mic-blur")
            print(name,"mic:",await pg.locator("#wz .readout").inner_text(),"|",await pg.locator("[data-task]").inner_text())
            await step("p3",1); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(12500); await shot("#wz","petri")
            await pg.locator('#wz [data-pl="frigo"]').click(); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(12500); print(name,"petri:",(await pg.locator("#wz .res").inner_text()).replace("\n"," | "))
            await step("p3",2)
            for te in ["congel","pasteur","vide"]:
                await pg.locator(f'#wz [data-te="{te}"]').click(); await pg.wait_for_timeout(600); await shot("#wz",f"bou-{te}")
            await step("p3",3)
            for k in ["poulet","yaourt","mayo","confiture","jus","pain"]: await pg.locator(f'#wz [data-pi="{k}"]').click()
            await shot("#wz","pic"); print(name,"pic task:",await pg.locator("[data-task]").inner_text())
            ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print(name,"overflow",ov)
            print(name,"errors:",errs); await ctx.close()
        await b.close()
asyncio.run(main())
