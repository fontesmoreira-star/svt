import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/tp-amylase-amidon-note.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1,accept_downloads=True)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto(URL+"#consignes"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f"test/tpa/{name}-consignes.png",full_page=True)
            async def tool(t): await pg.locator(f'#bench [data-tool="{t}"]').click()
            async def tgt(s,wait=120): await pg.locator(f'#bench [data-tgt="{s}"]').click(); await pg.wait_for_timeout(wait)
            async def act(a,wait=120): await pg.locator(f'#bench [data-act="{a}"]').click(); await pg.wait_for_timeout(wait)
            async def log(): return (await pg.locator("#blog").inner_text())
            async def ov(tag):
                o=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                if o>1: print(name,tag,"OVERFLOW",o)
            # PARTIE 1 · erreurs de manipulation
            await pg.locator('#tabs [data-v="p1"]').click(); await pg.wait_for_timeout(200)
            print(name,"locked rows:",await pg.locator("#rows [data-k]:disabled").count())
            await tool("gluco"); await tgt("plate"); print(name,"reactif:",await log())
            await tool("empois"); await tgt("t2",900); await act("bath"); print(name,"temoin:",await log())
            await act("wait"); print(name,"ordre:",await log())
            await tool("empois"); await tgt("t1",900)
            await tool("amyl"); await tgt("t1"); print(name,"contam:",await log())
            await pg.locator("#bench").screenshot(path=f"test/tpa/{name}-bench-ruin.png")
            await act("clean"); print(name,"clean:",await log(), "| chip:",await pg.locator("#bchip").inner_text())
            # PARTIE 1 · protocole correct
            await tool("empois"); await tgt("t1",900); await tgt("t2",900)
            await tool("amyl"); await tgt("t2",1100); await act("bath",1100)
            await tool("iode")
            for i in range(5):
                await tgt("plate",2100)
                if i<4: await act("wait",1600)
            print(name,"p1 done:",await log(),"| chip:",await pg.locator("#bchip").inner_text())
            await pg.locator("#bench").screenshot(path=f"test/tpa/{name}-bench-p1.png")
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); print(name,"val incomplete:",(await pg.locator("#vmsg").inner_text())[:60])
            for k,j in [("a",0),("b",1),("e",1)]: await pg.locator(f'#rows [data-k="{k}"][data-j="{j}"]').click()
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); print(name,"val no text:",(await pg.locator("#vmsg").inner_text())[:60])
            await pg.locator('#rows [data-tx="j"]').fill("L'eau iodée reste jaune : il n'y a plus d'amidon.")
            await pg.locator("#valBtn").click(); await pg.wait_for_timeout(100); print(name,"arm:",await pg.locator("#valBtn").inner_text()); await pg.locator("#valBtn").click(); await pg.wait_for_timeout(150)
            print(name,"P1:",(await pg.locator("#vmsg").inner_text()).replace("\n"," | "),"| disabled:",await pg.locator("#rows [data-k]:disabled").count())
            await pg.screenshot(path=f"test/tpa/{name}-p1.png",full_page=True); await ov("p1")
            # PARTIE 2
            await pg.locator('#tabs [data-v="p2"]').click(); await pg.wait_for_timeout(300)
            await tool("amyl"); await tgt("t1"); print(name,"p2 refused:",await log())
            await tool("gluco"); await tgt("t1",1900); print(name,"p2 done:",await log(),"| chip:",await pg.locator("#bchip").inner_text())
            for k,j in [("a",1),("b",0),("c",0)]: await pg.locator(f'#rows [data-k="{k}"][data-j="{j}"]').click()
            await pg.locator('#rows [data-tx="j"]').fill("Le tube 1 sert de témoin.")
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); await pg.wait_for_timeout(150)
            print(name,"P2:",(await pg.locator("#vmsg").inner_text()).replace("\n"," | "))
            await pg.screenshot(path=f"test/tpa/{name}-p2.png",full_page=True); await ov("p2")
            # CONCLUSION
            await pg.locator('#tabs [data-v="conc"]').click(); await pg.wait_for_timeout(200)
            for c,j in [("c1",0),("c2",0),("c3",2)]: await pg.locator(f'[data-c="{c}"][data-j="{j}"]').click()
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); print(name,"no text:",(await pg.locator("#vmsg").inner_text())[:60])
            await pg.locator('[data-tx="c4"]').fill("Donc l'amylase transforme l'amidon en glucose.")
            await pg.locator('[data-tx="c5"]').fill("Mais on ne l'a fait qu'une seule fois.")
            await pg.locator("#valBtn").click(); await pg.locator("#valBtn").click(); await pg.wait_for_timeout(150)
            print(name,"C:",(await pg.locator("#vmsg").inner_text()).replace("\n"," | "))
            await pg.screenshot(path=f"test/tpa/{name}-conc.png",full_page=True); await ov("conc")
            # COPIE
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(200)
            await pg.locator("#rendre").click(); await pg.locator("#rendre").click(); await pg.wait_for_timeout(250)
            print(name,"note:",await pg.locator(".score-big").inner_text())
            await pg.locator("#eleve").fill("Élève Test")
            async with pg.expect_download() as d: await pg.locator("#bDl").click()
            dl=await d.value; await dl.save_as(f"test/tpa/{name}-copie.txt"); print(name,"download:",dl.suggested_filename)
            await pg.screenshot(path=f"test/tpa/{name}-copie.png",full_page=True); await ov("copie")
            if name=="ipad": print(open(f"test/tpa/{name}-copie.txt",encoding="utf-8-sig").read())
            await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path=f"test/tpa/{name}-show.png"); await pg.locator("#ovClose").click()
            for v in ["p1","p2","conc"]:
                await pg.locator(f'#tabs [data-v="{v}"]').click(); await pg.wait_for_timeout(250); await pg.screenshot(path=f"test/tpa/{name}-{v}-corr.png",full_page=True); await ov(v+"-corr")
            # rechargement : copie toujours verrouillée
            await pg.reload(); await pg.wait_for_timeout(300); print(name,"after reload score:",await pg.evaluate("S.rendu&&S.rendu.note"), "| editable textareas:",await pg.locator("textarea:not([readonly])").count())
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(150)
            await pg.locator("#reset").click(); await pg.locator("#reset").click(); await pg.wait_for_timeout(200)
            print(name,"after reset:",await pg.evaluate("location.hash"),"meta:",await pg.evaluate("localStorage.getItem('svt2-tp-amylase-note-meta')"))
            await pg.reload(); await pg.wait_for_timeout(200)
            print(name,"errors:",errs); await ctx.close()
        await b.close()
asyncio.run(main())
