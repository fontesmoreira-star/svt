"""Phases de la Lune : erreurs, débordements, cibles tactiles, sur iPad, téléphone (sombre) et paysage, dans les deux versions."""
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-5/soleil-terre-lune/phases-of-the-moon-dnl.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for ver in ["guided","expert"]:
            for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True),"land":(1180,820,False)}.items():
                ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
                pg=await ctx.new_page(); errs=[]
                pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
                await pg.goto(URL+f"?version={ver}#accueil"); await pg.wait_for_timeout(200)
                await pg.evaluate("()=>{S.x.ray={free:1,screen:1,hand:1};S.x.wk={1:1,2:1,3:1,4:1};save()}")
                for v in ["accueil","p1","p2","p3","bilan"]:
                    await pg.goto(URL+f"?version={ver}#"+v); await pg.reload(); await pg.wait_for_timeout(250)
                    n=await pg.locator(".stepper button").count()
                    for i in range(max(n,1)):
                        if n: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(250)
                        if await pg.locator("#hypo [data-h]").count(): await pg.locator('#hypo [data-h="1"]').click(); await pg.wait_for_timeout(200)
                        ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                        if ov>1: print(ver,name,v,i,"OVERFLOW",ov)
                        small=await pg.evaluate("()=>[...document.querySelectorAll('#main button, #tabx button, #main input[type=range]')].filter(b=>b.offsetParent&&(b.getBoundingClientRect().height<47.5||b.getBoundingClientRect().width<47.5)).map(b=>(b.className||b.tagName)+':'+b.textContent.trim().slice(0,18))")
                        if small: print(ver,name,v,i,"cibles < 48 px :",small[:5])
                        if name!="land" or i==0: await pg.screenshot(path=f"test/lunednl/s-{ver[0]}-{name}-{v}-{i}.png",full_page=True)
                print(ver,name,"errors:",errs)
                await ctx.close()
        await b.close()
asyncio.run(main())
