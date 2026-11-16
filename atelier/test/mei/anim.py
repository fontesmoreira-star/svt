import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/meiose-cellules-reproductrices.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto(URL+"#p1"); await pg.wait_for_timeout(200)
            await pg.locator('[data-h="1"]').click(); await pg.wait_for_timeout(200)
            for t in [0.03,0.12,0.2,0.34,0.43,0.52,0.62,0.73,0.82,0.995]:
                await pg.locator("#wz [data-sl]").evaluate(f"(e)=>{{e.value={t};e.dispatchEvent(new Event('input'))}}")
                await pg.wait_for_timeout(60)
                await pg.locator("#wz [data-fig]").screenshot(path=f"test/mei/{name}-t{int(t*1000):03d}.png")
            print(name,"errors",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
