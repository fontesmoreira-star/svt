# Parcours complet des deux activités notées : validation incomplète, confirmation en deux temps, parties verrouillées,
# aucune note ni correction côté élève, copie rendue, export .txt, espace professeur (code), décodage, rechargement.
import asyncio, os, re, sys
from playwright.async_api import async_playwright
BASE="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/"
PIN=os.environ.get("PROF_PIN", "")  # code professeur : jamais écrit dans le dépôt public (PROF_PIN=… python3 test/note/flow.py)
LEAK=re.compile(r"✗|✓ Juste|Faux|Attendu|attendu :|Exemple de réponse|/ ?10\b|Note|note provisoire")

async def tap(pg, sel, n=1):
    for _ in range(n): await pg.locator(sel).first.click()

async def validate(pg, part):
    await pg.locator("#valBtn").click(); await pg.wait_for_timeout(80)
    arm=await pg.locator("#valBtn").inner_text()
    await pg.locator("#valBtn").click(); await pg.wait_for_timeout(250)
    st=(await pg.locator("#main .fb").first.inner_text()).split("\n")[0]
    print("   ",part,"| armé :",arm,"|",st)

async def leak(pg, where):
    txt=await pg.evaluate("(()=>{const m=document.querySelector('#main').cloneNode(true);const p=m.querySelector('#prof');if(p)p.remove();return m.innerText})()")
    bad=LEAK.findall(txt)
    if bad: print("   !! FUITE", where, bad[:5])

async def jean(pg):
    # partie 1
    await pg.locator('#tabs [data-v="p2"]').click(); await pg.wait_for_timeout(150)
    print("   p2 avant p1 :", (await pg.locator("#main .locked").inner_text())[:60])
    await pg.locator('#tabs [data-v="p1"]').click(); await pg.wait_for_timeout(200)
    await tap(pg,'[data-fac="1"]',2); print("   fabrique :", await pg.locator(".cellout .grp").inner_text())
    await pg.locator("#valBtn").click(); await pg.wait_for_timeout(100); print("   vide :", (await pg.locator("#vmsg").inner_text())[:70])
    for i,js in [(0,[0,2]),(1,[5]),(2,[4]),(3,[1])]:
        for j in js: await tap(pg,f'#q-j1 [data-i="{i}"][data-j="{j}"]')
    await tap(pg,'#q-j2 [data-j="1"]'); await tap(pg,'#q-j3 [data-j="0"]')
    await leak(pg,"p1 rempli"); await validate(pg,"p1"); await leak(pg,"p1 validée")
    # partie 2 : clics = 1 → A, 2 → B, 3 → O
    await pg.locator('[data-next="p2"]').click(); await pg.wait_for_timeout(200)
    print("   rappel tableau :", (await pg.locator(".gtab").inner_text()).replace("\n"," | ")[:120])
    for k,n in {"dad0":2,"dad1":3,"mom0":3,"mom1":1,"sis0":1,"sis1":2,"jean0":3,"jean1":3,"bro0":2,"bro1":3}.items(): await tap(pg,f'[data-ts="{k}"]',n)
    await validate(pg,"p2")
    # partie 3
    await pg.locator('[data-next="p3"]').click(); await pg.wait_for_timeout(200)
    await tap(pg,"[data-one]"); await tap(pg,"[data-hundred]"); await pg.wait_for_timeout(900)
    print("   simulateur :", (await pg.locator("[data-tab]").inner_text()).replace("\n"," ").replace("\t"," ")[:120])
    for i,j in [(0,2),(1,1),(2,0),(3,0)]: await tap(pg,f'#q-j5 [data-i="{i}"][data-j="{j}"]')
    await tap(pg,'#q-j6 [data-j="1"]'); await validate(pg,"p3")
    # partie 4
    await pg.locator('[data-next="p4"]').click(); await pg.wait_for_timeout(200)
    await pg.locator("#q-j7 textarea").fill("L'avocat a tort.")
    await pg.locator("#valBtn").click(); await pg.wait_for_timeout(100); print("   texte court :", (await pg.locator("#vmsg").inner_text()).replace("\n"," | ")[:110])
    await pg.locator("#q-j7 textarea").fill("L'avocat a tort car Jean est O/O. Il a reçu un allèle O de son père et un de sa mère.")
    await validate(pg,"p4")
    # partie 5
    await pg.locator('[data-next="p5"]').click(); await pg.wait_for_timeout(200)
    for w in [0,1,2,3,5,4,6,7]: await tap(pg,f'[data-word="{w}"]')
    await leak(pg,"p5 rempli"); await validate(pg,"p5")
    return 7.5

async def mito(pg):
    await pg.locator('#tabs [data-v="p1"]').click(); await pg.wait_for_timeout(250)
    for k,t in [("pro",0.36),("meta",0.49),("ana",0.6),("telo",0.4)]:
        await pg.evaluate("t=>{const s=document.querySelector('[data-sl]');s.value=t;s.dispatchEvent(new Event('input'))}", t)
        await tap(pg,f'[data-shot="{k}"]')
    await pg.locator("#q-m1 input").fill("4"); await tap(pg,'#q-m2 [data-j="0"]')
    await leak(pg,"p1 rempli"); await pg.locator("#q-m3").screenshot(path="test/note/mito-shots.png")
    await validate(pg,"p1")
    await pg.locator('[data-next="p2"]').click(); await pg.wait_for_timeout(200)
    print("   doc étapes absent :", await pg.locator(".phases").count()==0)
    for j in [0,1,2,4,3,5]: await tap(pg,f'#q-m4 .order-item[data-j="{j}"]')
    for i,w in enumerate(["anaphase","profase","metaphase","métaphase"]): await pg.locator(f'#q-m5 [data-w="{i}"]').fill(w)
    await validate(pg,"p2")
    await pg.locator('[data-next="p3"]').click(); await pg.wait_for_timeout(200)
    await pg.locator("#q-m6 input").fill("8 h"); await pg.locator("#q-m7 input").fill("18")
    await pg.locator("#q-m8 textarea").fill("Avant la division chaque chromosome se copie, c'est la duplication. Ensuite les chromatides se séparent dans les deux cellules.")
    await validate(pg,"p3")
    await pg.locator('[data-next="p4"]').click(); await pg.wait_for_timeout(200)
    for i,j in [(0,0),(1,1),(2,1),(3,0)]: await tap(pg,f'#q-m9 [data-i="{i}"][data-j="{j}"]')
    for k,w in zip(["g1","g2","g3","g4","g5","g6"],["simples","duplication","doubles","2","simples","différents"]): await pg.locator(f'[data-g="{k}"]').fill(w)
    await leak(pg,"p4 rempli"); await pg.locator("#q-m9").screenshot(path="test/note/mito-schema.png")
    await validate(pg,"p4")
    return 6.75

APPS={"jean":("arbre-jean-note.html",jean,"svt3-arbre-jean-note-v1"),"mito":("multiplication-cellulaire-note.html",mito,"svt3-mitose-note-v1")}
async def main():
    only=sys.argv[1:]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for app,(f,run,key) in APPS.items():
            if only and app not in only: continue
            for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True)}.items():
                ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",accept_downloads=True)
                pg=await ctx.new_page(); errs=[]
                pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
                await pg.goto(BASE+f+"#consignes"); await pg.wait_for_timeout(300)
                print(app,name)
                exp=await run(pg)
                await pg.locator('[data-next="copie"]').click(); await pg.wait_for_timeout(200)
                await leak(pg,"copie avant remise")
                await pg.locator("#rendre").click(); await pg.locator("#rendre").click(); await pg.wait_for_timeout(250)
                await leak(pg,"copie rendue")
                print("   rendue :", (await pg.locator("#main .fb").first.inner_text()).split("\n")[0])
                await pg.locator("#eleve").fill("Élève Test")
                async with pg.expect_download() as d: await pg.locator("#bDl").click()
                dl=await d.value; path=f"test/note/{app}-{name}-copie.txt"; await dl.save_as(path)
                txt=open(path,encoding="utf-8-sig").read(); code=re.search(r"Code de correction \(professeur\) : ([0-9A-Z-]+)",txt).group(1)
                print("   .txt :", dl.suggested_filename, "| code", code, "| fuite note :", bool(re.search(r"/ ?10\b|NOTE\b(?! ·)", txt.split("\n",1)[1])))
                if name=="ipad": print(txt[:900])
                await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path=f"test/note/{app}-{name}-show.png")
                ov=await pg.locator(".overlay").inner_text(); print("   montrer :", "fuite" if re.search(r"/ ?10\b",ov) else "pas de note", "|", code in ov)
                await pg.locator("#ovClose").click()
                await pg.screenshot(path=f"test/note/{app}-{name}-copie.png",full_page=True)
                # espace professeur
                await pg.locator("#pin").fill("0000"); await pg.locator("#pinBtn").click(); print("   mauvais code :", await pg.locator("#pinMsg").inner_text())
                await pg.locator("#pin").fill(PIN); await pg.locator("#pin").press("Enter"); await pg.wait_for_timeout(150)
                sc=await pg.locator("#prof .score-big").first.inner_text(); print("   prof :", sc, "| attendu", str(exp).replace(".",","))
                await pg.locator("#prof details.recap summary").first.click(); await pg.wait_for_timeout(100)
                await pg.screenshot(path=f"test/note/{app}-{name}-prof.png",full_page=True)
                await pg.locator("#dec").fill(code.lower().replace("-"," ")); await pg.locator("#decBtn").click(); await pg.wait_for_timeout(100)
                print("   décodé :", await pg.locator("#decOut .score-big").inner_text())
                bad=code[:-1]+("2" if code[-1]!="2" else "3")
                await pg.locator("#dec").fill(bad); await pg.locator("#decBtn").click(); print("   code altéré :", (await pg.locator("#decOut").inner_text())[:40])
                await pg.locator("#ficheBtn").click(); await pg.wait_for_timeout(150); await pg.screenshot(path=f"test/note/{app}-{name}-fiche.png"); await pg.locator("#ovClose").click()
                ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print("   débordement :", ov)
                # rechargement : copie conservée, espace prof reverrouillé
                await pg.reload(); await pg.wait_for_timeout(300)
                print("   après rechargement :", await pg.evaluate("location.hash"), "| prof verrouillé :", await pg.locator("#pin").count()==1, "| rendue :", await pg.evaluate("!!S.rendu"))
                for v in ["p1","p3"]:
                    await pg.locator(f'#tabs [data-v="{v}"]').click(); await pg.wait_for_timeout(150); await leak(pg,"onglet "+v+" après remise")
                await pg.locator('#tabs [data-v="copie"]').click(); await pg.wait_for_timeout(150)
                await pg.locator("#pin").fill(PIN); await pg.locator("#pinBtn").click(); await pg.wait_for_timeout(100)
                await pg.locator("#wipeBtn").click(); await pg.locator("#wipeBtn").click(); await pg.wait_for_timeout(200)
                print("   effacé :", await pg.evaluate("location.hash"), await pg.evaluate("Object.keys(S.ans).length"), await pg.evaluate(f"localStorage.getItem('{key}-meta')"))
                print("   erreurs :", errs); await ctx.close()
        await b.close()
asyncio.run(main())
