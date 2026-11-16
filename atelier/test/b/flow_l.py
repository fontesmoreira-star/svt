"""Version lycée : parcours complet (choix de la version, réponses trop courtes, faibles, modèles, auto-validation, bilan, retour à la version guidée)."""
import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/echelles-biodiversite/trois-echelles-biodiversite.html"
D="test/b/"
G={"p1":["a1","a2"],"p2":["b1","b2","b3"],"p3":["c1","c2","c3"]}
W="Je ne sais pas trop quoi dire ici mais voici quand même une longue phrase pour remplir la case de réponse comme il faut avec assez de mots pour que cela passe le compteur."
M="MODEL"
OK={"a1":["T","2",M],"a2":["T",M,M],"b1":["chlorophylle, tige et feuilles, racines et vaisseaux","crâne et vertèbres, mâchoires, squelette osseux, doigts","graines"],"b2":["r012012","mâchoires, doigts, mamelles"],"b3":["crocodile","2",M],"c1":["T",M],"c2":["T","4",M],"c3":[M]}
BAD={"a1":["T","5",W],"a2":["T",W,W],"b1":["chlorophylle, graines","mâchoires, amnios","fleurs"],"b2":["r210210","mamelles"],"b3":["sardine","3",W],"c1":["T",W],"c2":["T","60000",W],"c3":[W]}
SELF={"c1"}   # étape où l'on teste « Ma réponse le contient » au lieu de récrire
async def task(pg,iid):
    if iid=="a1":
        for m in "AC":
            for f in "BDE":
                await pg.locator(f'#wz [data-m="{m}"]').click(); await pg.locator(f'#wz [data-f="{f}"]').click(); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(9400)
    if iid=="a2":
        for m in "HD":
            for f in "JN":
                await pg.locator(f'#wz [data-m="{m}"]').click(); await pg.locator(f'#wz [data-f="{f}"]').click(); await pg.locator('#wz [data-a="run"]').click(); await pg.wait_for_timeout(9400)
    if iid=="c1":
        for pi,vals in enumerate([(0,0,0,0),(3,3,1,8),(2,1,2,5)]):
            await pg.locator(f'#wz [data-p="{pi}"]').click()
            for k,j in zip("yctg",vals): await pg.locator(f'#wz [data-k="{k}"][data-j="{j}"]').click()
    if iid=="c2":
        for e in ["lac","champ"]:
            await pg.locator(f'#wz [data-e="{e}"]').click()
            for s in "tlh": await pg.locator(f'#wz [data-sn="{s}"]').click()
            ids=await pg.locator("#wz .ecosp").evaluate_all("ns=>ns.map(n=>n.dataset.id)")
            for i in ids[:5]: await pg.locator(f'#wz .ecosp[data-id="{i}"] .hit').click(force=True)
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v==M:
            v=await pg.evaluate("([i,k])=>LYCEE[i].parts[k].model.replace(/\\u00a0|\\u202f/g,' ')",[iid,k])
        if await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        elif v[0]=="r" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'[data-i="{i}"][data-j="{j}"]').click()
        else: await part.locator("input").fill(v)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1,accept_downloads=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        assert await pg.locator('#vers [data-mode="g"]').get_attribute("aria-checked")=="true", "la version guidée doit rester la version par défaut"
        assert await pg.locator("#item .opt").count()>0
        await pg.locator('#vers [data-mode="l"]').click(); await pg.wait_for_timeout(200)
        assert await pg.locator('#vers [data-mode="l"]').get_attribute("aria-checked")=="true"
        assert await pg.locator("#item .opt").count()==0, "plus de QCM dans l'échauffement lycée"
        print("puce:",await pg.locator("#tabx").inner_text())
        await pg.screenshot(path=D+"l-accueil.png",full_page=True)
        await fill(pg,"r0",["diversité biologique","caractères"]); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:40])
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                assert await pg.locator("#item .opt").count()==0, iid+" : QCM présent en version lycée"
                if iid=="a1":
                    assert await pg.locator(".parts").is_hidden()
                    await pg.locator("[data-preok]").click(); assert "nombre" in await pg.locator("#preE").inner_text()
                    await pg.locator("#preN").fill("5"); await pg.locator("[data-preok]").click(); await pg.wait_for_timeout(200)
                    assert await pg.locator(".parts").is_visible()
                await pg.locator("[data-check]").click()
                t=await pg.locator(".gfb").inner_text(); assert "Complète" in t, (iid,t)
                for _ in range(3): await pg.locator("[data-hint]").click()
                assert await pg.locator(".hz .hint").count()==3 and await pg.locator("[data-hint]").count()==0, iid
                if "T" in OK[iid]: await task(pg,iid); print(iid,"task:",await pg.locator("[data-task]").inner_text())
                # réponse rédigée trop courte : le premier essai n'est pas consommé
                if await pg.locator(".part textarea").count():
                    await fill(pg,iid,[("Trop court." if x in (W,M) else x) for x in BAD[iid]])
                    await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "trop courte" in t, (iid,t)
                await fill(pg,iid,BAD[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                msgs=await pg.locator(".part .pfb.bad, .part .pfb.mid").all_inner_texts()
                print(iid,"BAD →",[m[:95] for m in msgs],"|",(await pg.locator(".gfb .h").inner_text()))
                assert await pg.locator(".corr").count()==0 and await pg.locator(".box.info:has-text('Réponse modèle')").count()==0, iid+" corrigé trop tôt"
                assert await pg.locator("[data-self]").count()==0, iid+" auto-validation trop tôt"
                assert await pg.locator(".unlockz").count()==0, iid
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                assert await pg.locator(".corr").count()==1, iid+" corrigé absent au 2e essai"
                await pg.screenshot(path=D+f"l-{iid}-bad.png",full_page=True)
                if iid in SELF:
                    n=await pg.locator("[data-self]").count(); assert n>0
                    for _ in range(n): await pg.locator("[data-self]").first.click(); await pg.wait_for_timeout(80)
                    print(iid,"auto-validation de",n,"élément(s) →",await pg.locator(".grille .gt").all_inner_texts())
                else:
                    await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                assert not await pg.locator(".part .pfb.bad, .part .pfb.mid").count(), (iid, await pg.locator(".part .pfb.bad, .part .pfb.mid").all_inner_texts())
                gf=await pg.locator(".gfb").inner_text()
                print(iid,"OK →",gf.replace("\n"," | ")[:105])
                if await pg.locator(".unlockz").count(): print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
                if await pg.locator("#hypo .pfb:not(#preE)").count(): print("   hypo:",await pg.locator("#hypo .pfb:not(#preE)").inner_text())
                await pg.screenshot(path=D+f"l-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as(D+"bilan-lycee.txt"); print("download:",dl.suggested_filename)
        txt=open(D+"bilan-lycee.txt").read(); assert "Version : lycée" in txt and "MES RÉPONSES RÉDIGÉES" in txt and "Je ne sais pas trop" in txt
        await pg.screenshot(path=D+"l-bilan.png",full_page=True)
        lyc=await pg.locator(".score-big").inner_text(); print("score lycée:",lyc)
        await pg.reload(); await pg.wait_for_timeout(300); assert await pg.locator(".score-big").inner_text()==lyc; print("après rechargement:",lyc, await pg.locator("#tabx").inner_text())
        # retour à la version guidée : score séparé, manipulations conservées
        await pg.locator("#tabx button").click(); await pg.wait_for_timeout(200); await pg.locator('#vers [data-mode="g"]').click(); await pg.wait_for_timeout(200)
        assert await pg.locator("#item .opt").count()>0
        await pg.locator('#tabs [data-v="p1"]').click(); await pg.wait_for_timeout(200); await pg.locator(".stepper button").nth(0).click(); await pg.wait_for_timeout(200)
        assert await pg.locator("#hypo [data-h]").count()==4, "hypothèse en QCM en version guidée"
        await pg.locator('#hypo [data-h="1"]').click(); await pg.wait_for_timeout(200)
        assert await pg.locator("#wz .res td:has-text('petits fertiles')").count()>0, "croisements conservés d'une version à l'autre"
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); print("score guidé (séparé):",await pg.locator(".score-big").inner_text(),"|",(await pg.locator(".view .lead").first.inner_text())[:60])
        # lien direct ?version=lycee
        await pg.goto(URL+"?version=lycee#bilan"); await pg.wait_for_timeout(300); assert await pg.locator(".score-big").inner_text()==lyc; print("lien ?version=lycee → score",lyc)
        print("errors:",errs)
        await b.close()
asyncio.run(main())
