import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/echelles-biodiversite/trois-echelles-biodiversite.html"
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
                await pg.locator(sel).first.scroll_into_view_if_needed(); await pg.locator(sel).first.screenshot(path=f"test/b/w-{name}-{tag}.png")
            # a1 volière
            await step("p1",0); await pg.locator('[data-h="0"]').click(); await pg.wait_for_timeout(200)
            for m,f,ts in [("A","D",[1500,2300,2300,1800,1500]),("C","B",[2500,3000,3800])]:
                await pg.locator(f'#wz [data-m="{m}"]').click(); await pg.locator(f'#wz [data-f="{f}"]').click(); await pg.locator('#wz [data-a="run"]').click()
                for k,t in enumerate(ts):
                    await pg.wait_for_timeout(t); await shot("#wz",f"vol-{m}{f}-{k}")
                    print(name,m,f,k,(await pg.locator("#wz .readout").inner_text())[:90])
            print(name,"table:",(await pg.locator("#wz .res").inner_text()).replace("\n"," | ")[:200])
            # a2 pré
            await step("p1",1)
            await pg.locator('#wz [data-m="D"]').click(); await pg.locator('#wz [data-f="J"]').click(); await pg.locator('#wz [data-a="run"]').click()
            for k,t in enumerate([1500,4000,2000,1800]):
                await pg.wait_for_timeout(t); await shot("#wz",f"pre-{k}"); print(name,"pre",k,(await pg.locator("#wz .readout").inner_text())[:110])
            # b1 emboîtés
            await step("p2",0)
            await pg.locator('.nbh[data-c="2"]').first.click(); await shot(".doc >> nth=0","embveg")
            await pg.locator('.doc >> nth=1').locator('.sp[data-s="3-0"]').click(); await shot(".doc >> nth=1","embvert")
            # b2 live boxes
            await step("p2",1)
            for i,j in enumerate([0,1,2,0]): await pg.locator(f'.part[data-k="0"] [data-i="{i}"][data-j="{j}"]').click()
            await shot("#livefig","boites")
            # b3 arbre
            await step("p2",2)
            await pg.locator('#wz [data-n="Gorille"]').click(); await pg.locator('#wz [data-n="Crocodile"]').click(); await shot("#wz","arbre"); print(name,"arbre:",await pg.locator("#wz .readout").inner_text())
            await pg.locator('#wz [data-n="Sardine"]').click(); print(name,"arbre:",await pg.locator("#wz .readout").inner_text())
            # c1 portraits
            await step("p3",0)
            for pi,vals in enumerate([(0,0,0,0),(3,3,1,8),(2,1,2,5)]):
                await pg.locator(f'#wz [data-p="{pi}"]').click()
                for k,j in zip("yctg",vals): await pg.locator(f'#wz [data-k="{k}"][data-j="{j}"]').click()
            await shot("#wz","portraits"); print(name,"task:",await pg.locator("[data-task]").inner_text())
            # c2 éco
            await step("p3",1)
            for e in ["lac","foret","champ"]:
                await pg.locator(f'#wz [data-e="{e}"]').click()
                for s in "tlh": await pg.locator(f'#wz [data-sn="{s}"]').click(); await pg.wait_for_timeout(150)
                ids=await pg.locator("#wz .ecosp").evaluate_all("ns=>ns.map(n=>n.dataset.id)")
                for i in ids[: (8 if e!="champ" else 3)]:
                    await pg.locator(f'#wz .ecosp[data-id="{i}"] .hit').click(force=True); await pg.wait_for_timeout(60)
                await pg.wait_for_timeout(1000); await shot("#wz",f"eco-{e}")
                print(name,e,"task:",await pg.locator("[data-task]").inner_text(),"|",(await pg.locator("#wz .readout").inner_text()))
            ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print(name,"overflow",ov)
            print(name,"errors:",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
