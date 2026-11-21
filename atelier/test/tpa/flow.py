import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/tp-amylase-amidon-note.html"
RUNS={"ipad":((820,1180,False),{"t1":[0,0,0,0,0],"t2":[0,1,2,3,4],"g1":0,"g2":2}),
      "phone":((390,844,True),{"t1":[0,0,0,0,0],"t2":[0,0,1,1,2],"g1":0,"g2":1})}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,((w,h,dark),OBS) in RUNS.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1,accept_downloads=True)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            async def ov(tag):
                o=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                if o>1: print(name,tag,"OVERFLOW",o)
            async def val(sel="#valBtn"): await pg.locator(sel).click(); await pg.locator(sel).click(); await pg.wait_for_timeout(200)
            async def vmsg(): return (await pg.locator("#vmsg").inner_text()).replace("\n"," | ")[:110]
            await pg.goto(URL+"#consignes"); await pg.wait_for_timeout(300)
            if name=="ipad":
                await pg.locator('[data-g="0"]').fill("Léa"); await pg.locator('[data-g="1"]').fill("Hugo")
            await pg.screenshot(path=f"test/tpa/{name}-consignes.png",full_page=True); await ov("consignes")
            # PARTIE 1
            await pg.locator('#tabs [data-v="p1"]').click(); await pg.wait_for_timeout(300)
            print(name,"before hyp:",await pg.locator(".pstep.now .locked").inner_text())
            await pg.locator("#hyp").fill("Nous pensons que l'amylase va faire disparaître l'amidon du tube 2.")
            await pg.wait_for_timeout(200); await pg.screenshot(path=f"test/tpa/{name}-p1-step1.png",full_page=True); await ov("p1-step1")
            await pg.locator("#stepok").click(); await pg.wait_for_timeout(300)
            print(name,"hyp readonly:",await pg.locator("#hyp").get_attribute("readonly") is not None)
            await pg.locator("#stepok").click(); await pg.wait_for_timeout(300)
            await pg.locator("#stepok").click(); await pg.wait_for_timeout(300)
            print(name,"chrono set:",await pg.evaluate("!!S.chrono"))
            await pg.locator('#rows [data-k="c"][data-j="0"]').click()
            await val(); print(name,"p1 no text:",await vmsg())
            await pg.locator('#rows [data-tx="j"]').fill("Le tube 1 n'a pas d'amylase : il sert à comparer.")
            await val(); print(name,"P1:",await vmsg())
            await pg.screenshot(path=f"test/tpa/{name}-p1.png",full_page=True); await ov("p1")
            # PARTIE 2 · prélèvements
            await pg.locator('#tabs [data-v="p2"]').click(); await pg.wait_for_timeout(700)
            print(name,"chip:",await pg.locator("#nextc").inner_text())
            async def pick(k,j): await pg.locator(f'[data-o="{k}"][data-j="{j}"]').click(); await pg.wait_for_timeout(120)
            await pick("t1-0",OBS["t1"][0]); await pick("t2-0",OBS["t2"][0]); await pg.wait_for_timeout(300)
            print(name,"3 min locked:",await pg.locator(".obsrow.now .locked").inner_text(), "| chip:",await pg.locator("#nextc").inner_text())
            await pg.screenshot(path=f"test/tpa/{name}-p2-wait.png",full_page=True); await ov("p2-wait")
            await pg.evaluate("S.chrono=Date.now()-13*60*1000;save()"); await pg.wait_for_timeout(900)
            for c in range(1,5):
                await pick(f"t1-{c}",OBS["t1"][c] if not (name=="phone" and c==2) else 3); await pick(f"t2-{c}",OBS["t2"][c]); await pg.wait_for_timeout(250)
            if name=="phone":   # correction d'une observation mal saisie
                await pg.locator('[data-edit="2"]').click(); await pg.wait_for_timeout(200); await pick("t1-2",0); await pg.locator("#edok").click(); await pg.wait_for_timeout(200)
            await pg.wait_for_timeout(600); await pg.locator("#gfig").screenshot(path=f"test/tpa/{name}-gluco-anim.png")
            await pick("g1",OBS["g1"]); await pick("g2",OBS["g2"])
            print(name,"obs:",await pg.evaluate("JSON.stringify(S.obs)"), "| chip:",await pg.locator("#nextc").inner_text())
            for k,j in [("a",0),("b",2),("g1",1),("g2",0)]: await pg.locator(f'#rows [data-k="{k}"][data-j="{j}"]').click()
            await val(); print(name,"p2 no text:",await vmsg())
            await pg.locator('#rows [data-tx="j"]').fill("Dans le tube 2 l'eau iodée devient jaune : il n'y a plus d'amidon.")
            await val(); print(name,"P2:",await vmsg())
            await pg.screenshot(path=f"test/tpa/{name}-p2.png",full_page=True); await ov("p2")
            # CONCLUSION
            await pg.locator('#tabs [data-v="conc"]').click(); await pg.wait_for_timeout(250)
            for c,j in [("c1",0),("c2",0),("c3",1)]: await pg.locator(f'[data-c="{c}"][data-j="{j}"]').click()
            await val(); print(name,"conc missing:",await vmsg())
            await pg.locator('[data-c="hv"][data-j="0"]').click()
            await pg.locator('[data-tx="c4"]').fill("Donc l'amylase transforme l'amidon en glucose.")
            await pg.locator('[data-tx="c5"]').fill("Mais on ne l'a fait qu'une seule fois.")
            await pg.locator('[data-tx="c6"]').fill("Elle est validée car l'amidon a disparu dans le tube 2.")
            await val(); print(name,"C:",await vmsg())
            await pg.screenshot(path=f"test/tpa/{name}-conc.png",full_page=True); await ov("conc")
            # REMISE
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(250)
            await val("#rendre")
            if name=="phone":
                print(name,"no names:",(await pg.locator("#rmsg").inner_text())[:60])
                await pg.locator('[data-g="0"]').fill("Inès"); await pg.locator('[data-g="2"]').fill("Tom"); await val("#rendre")
            print(name,"note:",await pg.locator(".score-big").inner_text(), "| tabs:",await pg.locator("#tabs").inner_text())
            async with pg.expect_download() as d: await pg.locator("#bDl").click()
            dl=await d.value; await dl.save_as(f"test/tpa/{name}-cr.txt"); print(name,"download:",dl.suggested_filename)
            await pg.screenshot(path=f"test/tpa/{name}-copie.png",full_page=True); await ov("copie")
            await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path=f"test/tpa/{name}-show.png"); await pg.locator("#ovClose").click()
            for v in ["p1","p2","conc"]:
                await pg.locator(f'#tabs [data-v="{v}"]').click(); await pg.wait_for_timeout(300); await pg.screenshot(path=f"test/tpa/{name}-{v}-corr.png",full_page=True); await ov(v+"-corr")
            # SIMULATION
            await pg.locator('#tabs [data-v="sim"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(9000)
            await pg.screenshot(path=f"test/tpa/{name}-sim.png",full_page=True); await ov("sim")
            await pg.locator("#apres").fill("Nos résultats sont proches de la simulation.")
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(250)
            async with pg.expect_download() as d: await pg.locator("#bDl").click()
            dl=await d.value; await dl.save_as(f"test/tpa/{name}-cr2.txt")
            print(name,"après in txt:", "APRÈS LA REMISE" in open(f"test/tpa/{name}-cr2.txt",encoding="utf-8-sig").read())
            await pg.reload(); await pg.wait_for_timeout(300)
            print(name,"after reload:",await pg.evaluate("[S.rendu&&S.rendu.note,location.hash]"),"| editable:",await pg.locator("textarea:not([readonly])").count())
            await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(150)
            await val("#reset")
            print(name,"after reset:",await pg.evaluate("[location.hash,JSON.stringify(S.groupe),S.rendu]"),"meta:",await pg.evaluate("localStorage.getItem('svt2-tp-amylase-note-meta')"), "| tabs:",await pg.locator("#tabs").inner_text())
            await pg.reload(); await pg.wait_for_timeout(200)
            print(name,"errors:",errs); await ctx.close()
        await b.close()
asyncio.run(main())
