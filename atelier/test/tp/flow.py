import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/labo-agglutination-tp-note.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1,accept_downloads=True)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto(URL+"#consignes"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f"test/tp/{name}-consignes.png",full_page=True)
            async def tool(t): await pg.locator(f'#bench [data-tool="{t}"]').click()
            async def well(s,wait=0): await pg.locator(f'#bench [data-well="{s}"]').click(); await pg.wait_for_timeout(wait or 80)
            async def log(): return (await pg.locator("#bench .log").inner_text())
            # PARTIE 1
            await pg.locator('#tabs [data-v="p1"]').click(); await pg.wait_for_timeout(200)
            print(name,"locked rows:",await pg.locator("#rows [data-k]:disabled").count())
            await tool("blood"); await well("A"); await well("B")
            await tool("sB"); await well("A"); print(name,"err:",await log())
            await tool("sA"); await well("A"); await tool("sB"); await well("B")
            await tool("pick"); await well("A",1800); await well("B",300); print(name,"contam:",await log())
            await pg.locator("#bench [data-clean]").click(); print(name,"clean:",await log())
            await tool("blood"); await well("A"); await well("B"); await tool("sA"); await well("A"); await tool("sB"); await well("B")
            await tool("pick"); await well("A",1800); await tool("pick"); await well("B",1800)
            print(name,"done:",await log(), "| errors chip:",await pg.locator("#bench .chip").inner_text())
            await pg.locator("#bench").screenshot(path=f"test/tp/{name}-bench-p1.png")
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); print(name,"val incomplete:",(await pg.locator("#vmsg").inner_text())[:60])
            for k,j in [("a",0),("b",1),("g",0)]: await pg.locator(f'#rows [data-k="{k}"][data-j="{j}"]').click()
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); print(name,"val no text:",(await pg.locator("#vmsg").inner_text())[:60])
            await pg.locator('#rows [data-tx="j"]').fill("Son sang agglutine avec le sérum anti-A seulement : elle porte l'antigène A.")
            await pg.locator("#valBtn").click(); await pg.wait_for_timeout(100); print(name,"arm:",await pg.locator("#valBtn").inner_text()); await pg.locator("#valBtn").click(); await pg.wait_for_timeout(150)
            print(name,"P1:",(await pg.locator("#vmsg").inner_text()).replace("\n"," | "), "| disabled:",await pg.locator("#rows [data-k]:disabled").count())
            await pg.screenshot(path=f"test/tp/{name}-p1.png",full_page=True)
            # PARTIE 2
            await pg.locator('#tabs [data-v="p2"]').click(); await pg.wait_for_timeout(200)
            await tool("blood"); await well("A"); await well("B"); await tool("sA"); await well("A"); await tool("sB"); await well("B")
            await tool("pick"); await well("A",1800); await tool("pick"); await well("B",1800)
            for k,j in [("a",1),("b",0),("g",3)]: await pg.locator(f'#rows [data-k="{k}"][data-j="{j}"]').click()
            await pg.locator('#rows [data-tx="j"]').fill("Il est du groupe O.")
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); await pg.wait_for_timeout(150)
            print(name,"P2:",(await pg.locator("#vmsg").inner_text()).replace("\n"," | "))
            # CONCLUSION
            await pg.locator('#tabs [data-v="conc"]').click(); await pg.wait_for_timeout(200)
            for c,j in [("c1",0),("c2",0),("c3",1)]: await pg.locator(f'[data-c="{c}"][data-j="{j}"]').click()
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); print(name,"no text:",(await pg.locator("#vmsg").inner_text())[:60])
            await pg.locator('[data-tx="c4"]').fill("Donc Jean NEYMAR peut être le coupable car il est du groupe O. Djamal et Max sont innocentés car ils sont A et AB.")
            await pg.locator('[data-tx="c5"]').fill("Mais beaucoup de gens sont du groupe O.")
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); await pg.wait_for_timeout(150)
            print(name,"C:",(await pg.locator("#vmsg").inner_text()).replace("\n"," | "))
            await pg.screenshot(path=f"test/tp/{name}-conc.png",full_page=True)
            # COPIE
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(200)
            await pg.locator("#rendre").click(); await pg.locator("#rendre").click(); await pg.wait_for_timeout(250)
            print(name,"note:",await pg.locator(".score-big").inner_text())
            await pg.locator("#eleve").fill("Élève Test")
            async with pg.expect_download() as d: await pg.locator("#bDl").click()
            dl=await d.value; await dl.save_as(f"test/tp/{name}-copie.txt"); print(name,"download:",dl.suggested_filename)
            await pg.screenshot(path=f"test/tp/{name}-copie.png",full_page=True)
            print(open(f"test/tp/{name}-copie.txt",encoding="utf-8-sig").read()[:1800]) if name=="ipad" else None
            await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path=f"test/tp/{name}-show.png"); await pg.locator("#ovClose").click()
            for v in ["p1","p2","conc"]:
                await pg.locator(f'#tabs [data-v="{v}"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=f"test/tp/{name}-{v}-corr.png",full_page=True)
                ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                if ov>1: print(name,v,"OVERFLOW",ov)
            # reset keeps the counter
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(150)
            await pg.locator("#reset").click(); await pg.locator("#reset").click(); await pg.wait_for_timeout(200)
            print(name,"after reset view:",await pg.evaluate("location.hash"), "meta:",await pg.evaluate("localStorage.getItem('svt3-tp-agglutination-note-meta')"))
            await pg.reload(); await pg.wait_for_timeout(200)
            print(name,"errors:",errs); await ctx.close()
        await b.close()
asyncio.run(main())
