import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/revision-genetique-activites-1-10.html"
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
                await pg.locator(sel).first.scroll_into_view_if_needed(); await pg.locator(sel).first.screenshot(path=f"test/r10/w-{name}-{tag}.png")
            await step("p1",1)
            for k in ["sun","sport","alt"]: await pg.locator(f'#wz [data-env="{k}"]').click()
            await pg.locator("#wz [data-baby]").click(); await pg.wait_for_timeout(1500); await shot("#wz","jum")
            print(name,"task a2:",await pg.locator("[data-task]").inner_text())
            await step("p2",0)
            await pg.locator('#wz [data-cn="ro"]').click(); await pg.locator('#wz [data-co="nb"]').click()
            await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(3000); await shot("#wz","clo-mid"); await pg.wait_for_timeout(4500); await shot("#wz","clo")
            print(name,"clo:",await pg.locator("#wz .readout").inner_text())
            await step("p2",1)
            for k in ["eau","broy","liq","sel","broy","trans","agit","eth","wait"]:
                await pg.locator(f'#wz [data-act="{k}"]').click(); await pg.wait_for_timeout(2300)
                print(name,"tp",k,(await pg.locator("#wz .readout").inner_text())[:90])
            await shot("#wz","tp-fil")
            for k in ["agit"]:
                await pg.locator(f'#wz [data-act="{k}"]').click(); await pg.wait_for_timeout(300); print(name,"tp",k,(await pg.locator("#wz .readout").inner_text())[:90])
            await shot("#wz","tp-err")
            await pg.locator('#wz [data-act="reset"]').click()
            for k in ["eau","liq","sel","broy","trans","eth","wait","peche","vert"]:
                await pg.locator(f'#wz [data-act="{k}"]').click(); await pg.wait_for_timeout(2300)
            await shot("#wz","tp-end"); print(name,"tp end:",await pg.locator("[data-task]").inner_text())
            await step("p3",0); await shot("#wz","chromo")
            await step("p3",1); await pg.locator('#wz [data-k="1"]').click(); await pg.locator('#wz [data-p="21"]').click(); print(name,"caryo:",await pg.locator("#wz .readout").inner_text()); await shot("#wz","caryo")
            await pg.locator('#wz [data-p="sx"]').click(); print(name,"caryo:",await pg.locator("#wz .readout").inner_text())
            await step("p4",0)
            for s in ["lucie","coup","m1","m2"]:
                await pg.locator(f'#wz [data-s="{s}"]').click()
                for ab in "AB": await pg.locator(f'#wz [data-sa="{ab}"]').click(); await pg.wait_for_timeout(1800)
            await shot("#wz","aggl")
            await step("p4",1); await pg.locator('#wz [data-a1="A"]').click(); await pg.locator('#wz [data-a2="B"]').click(); await shot("#wz","allele"); print(name,"allele:",await pg.locator("#wz .readout").inner_text())
            await step("p4",2)
            for i,j in enumerate([1,1,0,0,1]): await pg.locator(f'.part[data-k="0"] [data-i="{i}"][data-j="{j}"]').click()
            await shot("#livefig","fam")
            await step("p5",1); await pg.locator(".part").first.screenshot(path=f"test/r10/w-{name}-imgs.png")
            ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print(name,"overflow",ov)
            print(name,"errors:",errs); await ctx.close()
        await b.close()
asyncio.run(main())
