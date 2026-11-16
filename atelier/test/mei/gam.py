import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/meiose-cellules-reproductrices.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e)))
            await pg.goto(URL+"#p4"); await pg.reload(); await pg.wait_for_timeout(200)
            await pg.locator(".stepper button").nth(0).click(); await pg.wait_for_timeout(150)
            for who in ["m","p"]:
                await pg.locator(f'#wz [data-who="{who}"]').click()
                for t in [0.34,0.995]:
                    await pg.locator("#wz [data-sl]").evaluate(f"(e)=>{{e.value={t};e.dispatchEvent(new Event('input'))}}"); await pg.wait_for_timeout(60)
                    await pg.locator("#wz [data-fig]").screenshot(path=f"test/mei/g-{name}-{who}-{int(t*1000)}.png")
                print(name,who,await pg.locator("#wz [data-lab]").inner_text())
            await pg.locator(".stepper button").nth(1).click(); await pg.wait_for_timeout(150)
            await pg.locator(".part").first.screenshot(path=f"test/mei/g-{name}-grid.png")
            await pg.goto(URL+"#p2"); await pg.reload(); await pg.wait_for_timeout(200); await pg.locator(".stepper button").nth(0).click(); await pg.wait_for_timeout(150)
            await pg.locator("#livefig").screenshot(path=f"test/mei/g-{name}-schema.png")
            print(name,errs); await ctx.close()
        await b.close()
asyncio.run(main())
