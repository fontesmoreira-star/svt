"""Phases de la Lune : parcours complet d'une version (python3 test/lune/flow.py guidee|experte).
Réponses fausses → corrigé au 2e essai → réponses justes, tâches, hypothèse, déblocage, bilan, export, rechargement."""
import asyncio, sys
from playwright.async_api import async_playwright
VER=sys.argv[1] if len(sys.argv)>1 else "guided"
URL="file:///home/claude/svt/5e/mission-5/soleil-terre-lune/phases-of-the-moon-dnl.html"
D="test/lunednl/"
G={"p1":["a1"],"p2":["b1","b2"],"p3":["c0","c1"]}
W="I do not really know what to answer but here is a rather long sentence to fill the box with enough written words to pass the word counter without any problem today in class."
if VER=="guided":
    R0=(["c1","c1"],["c0","c0"])
    OK={"a1":["T","r012","r0110"],"b1":["T","P1320","r1230"],"b2":["P2222","c0","r010"],"c0":["X012345","full"],"c1":["r102","c0","c0"]}
    BAD={"a1":["T","r102","r1001"],"b1":["T","P3102","r0123"],"b2":["P1320","c1","r101"],"c0":["X123450","new"],"c1":["r012","c1","c1"]}
else:
    R0=(["secondary","Mars"],["primary","Earth"])
    OK={"a1":["T","Sun","the Moon","our eye","M"],"b1":["T","P1320","14","grows"],"b2":["P2222","M"],"c0":["new moon","full moon","first quarter","lunar month","frame of reference"],"c1":["M","dark"]}
    BAD={"a1":["T","Moon","Sun","the hand",W],"b1":["T","P3102","28","shrinks"],"b2":["P1320",W],"c0":["moon new","quarter","half moon","month","place"],"c1":[W,"lit"]}
async def task(pg,iid):
    if iid=="a1":
        await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(5500)
        await pg.locator('#wz [data-s="1"]').click(); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(5500)
        await pg.locator('#wz [data-h="1"]').click(); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(5500)
    if iid=="b1":
        for w in [1,2,3,4]: await pg.locator(f'#wz [data-wk="{w}"]').click(); await pg.wait_for_timeout(80)
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v=="M": v=await pg.evaluate("([i,k])=>EXPERT[i].parts[k].model.replace(/\\u00a0|\\u202f/g,' ')",[iid,k])
        if v[0]=="X" and v[1:].isdigit():
            for i in range(len(v)-1):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i,j in enumerate(v[1:]):
                await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
            continue
        if v[0]=="P" and v[1:].isdigit():
            for i,c in enumerate(v[1:]):
                t=int(c); await part.locator(f'.phz[data-i="{i}"]').click()
                if t&2: await part.locator(f'[data-i="{i}"][data-b="2"]').click()
                if t&1: await part.locator(f'[data-i="{i}"][data-b="1"]').click()
        elif v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif v[0]=="r" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'.seg [data-i="{i}"][data-j="{j}"]').click()
        elif await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1,accept_downloads=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        assert await pg.locator('#vers [data-mode="g"]').get_attribute("aria-checked")=="true", "version guidée par défaut"
        if VER=="expert":
            await pg.locator('#vers [data-mode="l"]').click(); await pg.wait_for_timeout(200)
            assert await pg.locator("#item .opt").count()==0
        print("puce:",await pg.locator("#tabx").inner_text())
        await pg.screenshot(path=D+f"f-{VER}-accueil.png",full_page=True)
        await fill(pg,"r0",R0[0]); await pg.locator("#item [data-check]").click(); await pg.locator("#item [data-check]").click(); await fill(pg,"r0",R0[1]); await pg.locator("#item [data-check]").click()
        print("rappel:",(await pg.locator("#item .gfb .h").inner_text()))
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                if iid=="b2":
                    assert await pg.locator(".parts").is_hidden(), "parties cachées avant l'hypothèse"
                    await pg.locator('#hypo [data-h="0"]').click(); await pg.wait_for_timeout(200)
                await pg.locator("[data-check]").click()
                t=await pg.locator(".gfb").inner_text(); assert "Answer every" in t, (iid,t)
                for _ in range(3): await pg.locator("[data-hint]").click()
                assert await pg.locator(".hz .hint").count()==3 and await pg.locator("[data-hint]").count()==0, iid
                if "T" in OK[iid]:
                    await fill(pg,iid,BAD[iid]); await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "Answer every" in t, (iid,"tâche non faite mais validée",t)
                    await task(pg,iid); print(iid,"task:",await pg.locator("[data-task]").first.inner_text())
                if await pg.locator(".part textarea").count():
                    await fill(pg,iid,[("Trop court." if x in (W,"M") else x) for x in BAD[iid]])
                    await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "too short" in t, (iid,t)
                await fill(pg,iid,BAD[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                msgs=await pg.locator(".part .pfb.bad, .part .pfb.mid").all_inner_texts()
                print(iid,"BAD →",[m[:100] for m in msgs],"|",await pg.locator(".gfb .h").inner_text())
                assert await pg.locator(".corr").count()==0, iid+" corrigé trop tôt"
                assert await pg.locator(".unlockz").count()==0, iid
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                assert await pg.locator(".corr").count()==1, iid+" corrigé absent au 2e essai"
                await pg.screenshot(path=D+f"f-{VER}-{iid}-bad.png",full_page=True)
                await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                assert not await pg.locator(".part .pfb.bad, .part .pfb.mid").count(), (iid, await pg.locator(".part .pfb.bad, .part .pfb.mid").all_inner_texts())
                print(iid,"OK →",(await pg.locator(".gfb").inner_text()).replace("\n"," | ")[:110])
                if await pg.locator("#hypo .pfb").count(): print("   hypo:",await pg.locator("#hypo .pfb").inner_text())
                if await pg.locator(".unlockz").count():
                    print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
                    for wk in [1,2,4]:
                        await pg.locator(f'.unlockz [data-wk="{wk}"]').click(); await pg.wait_for_timeout(150)
                        await pg.locator(".unlockz").screenshot(path=D+f"f-{VER}-unl-w{wk}.png"); print("   ",wk,(await pg.locator(".unlockz .readout").inner_text())[:130])
                if iid=="c1": assert await pg.locator(".after .recop").count()==1, "bilan à recopier affiché en fin d'activité"
                await pg.screenshot(path=D+f"f-{VER}-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200)
        assert await pg.locator(".recop").count()==1 and await pg.locator(".phtab").count()==1
        await pg.locator("#eleve").fill("Test Student")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as(D+f"bilan-{VER}.txt"); print("download:",dl.suggested_filename)
        txt=open(D+f"bilan-{VER}.txt").read(); assert "MY PHASES TABLE" in txt and "Summary to copy" in txt and "My glossary" in txt
        if VER=="expert": assert "MY WRITTEN ANSWERS" in txt
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        await pg.screenshot(path=D+f"f-{VER}-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+f"f-{VER}-show.png"); await pg.locator("#ovClose").click()
        sc=await pg.locator(".score-big").inner_text()
        await pg.reload(); await pg.wait_for_timeout(300); assert await pg.locator(".score-big").inner_text()==sc; print("score:",sc,"· après rechargement identique")
        print("errors:",errs)
        await b.close()
asyncio.run(main())
