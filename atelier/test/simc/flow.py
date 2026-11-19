import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/terminale/theme-1/1-3-climat-futur/simulateur-climat-futur.html"
D="test/simc/"
G={"p1":["a1"],"p2":["b1","b2","b3"],"p3":["c1","c2"],"p4":["d1","d2","d3"]}
OKG={"r0":["c0","c0","c0"],"a1":["T","382","14,6","R010101","c0"],"b1":["T","R022","R122","16,1","c0"],"b2":["1,5","2,7","c0","c0","c0"],"b3":["T","1","c0","c0","c0"],
     "c1":["T","424","14,9","c0","X012"],"c2":["R01011010","c0"],"d1":["T","R222","0,7","c0","c0"],"d2":["51 000","c0","X01234","c0"],"d3":["M0123","c0"]}
BADG={"r0":["c1","c2","c1"],"a1":["T","593","16,1","R101010","c1"],"b1":["T","R211","R022","17,3","c2"],"b2":["16,1","17,3","c1","c1","c1"],"b3":["T","8","c1","c1","c1"],
     "c1":["T","426","15,1","c1","X34"],"c2":["R10100101","c1"],"d1":["T","R000","15,4","c1","c1"],"d2":["5 100 000","c1","X56","c1"],"d3":["M1032","c1"]}
RL={"a1":"Un paramètre d'entrée est une valeur choisie par l'utilisateur, par exemple les émissions de CO₂. Une variable de sortie est calculée par le modèle, par exemple la température en 2107.",
 "b1":"Avec des émissions nulles, le CO₂ diminue lentement jusqu'à 351 ppm et la température reste presque stable. Plus les émissions sont fortes, plus le CO₂ et la température augmentent : 16,1 °C comme aujourd'hui et 17,3 °C si elles doublent. Le niveau de la mer continue de monter même sans émissions.",
 "b2":"Le réchauffement est de 1,5 °C puis de 2,7 °C : le rapport vaut 1,7, donc un peu moins que le double. Le modèle contient l'effet de serre du CO₂ : c'est une relation de cause à effet, une causalité.",
 "b3":"Il faut émettre seulement 1 GtC par an, soit une baisse de 87 %, car les puits comme l'océan n'absorbent qu'une partie du CO₂. Il faut donc réduire très fortement les émissions, et la température continue d'augmenter un peu.",
 "c1":"Le modèle sous-estime : 424 ppm et 14,9 °C contre 426 ppm et 15,1 °C observés. Les émissions réelles ont augmenté jusqu'à 11,5 GtC par an, et le modèle ne prend que le CO₂, pas le méthane.",
 "c2":"Points forts : il repose sur des lois physiques et il calcule vite, on peut comparer plusieurs scénarios. Limites : il ne donne qu'une moyenne mondiale, sans régions, et il ne prend que le CO₂ avec des émissions constantes.",
 "d1":"Sans ces rétroactions la température de 2107 est plus basse, donc elles renforcent le réchauffement : elles sont amplificatrices. Un air plus chaud contient plus de vapeur d'eau, un gaz à effet de serre. La fonte des glaces diminue l'albédo.",
 "d2":"Le climat dépend de l'atmosphère, de l'océan et des glaces en interaction, avec des rétroactions. Les échelles de temps sont différentes à cause de l'inertie de l'océan. Les émissions futures sont inconnues : il faut des scénarios. Il faut aussi des millions de calculs dans les mailles.",
 "d3":"Un modèle climatique met en équations les mécanismes du climat puis les résout par ordinateur, année après année. Avec mon simulateur, la température passe de 14,6 °C à 16,1 °C si les émissions restent comme aujourd'hui et 17,3 °C si elles doublent : le réchauffement dépend des émissions. Ce modèle est simplifié, il ne calcule qu'une moyenne. Les vrais modèles sont complexes et donnent une fourchette."}
BADTXT="Je pense que le climat va changer un peu mais je ne suis pas vraiment sûr de ce que montre ce logiciel de simulation sur la tablette, il faudrait demander au professeur ce qu'il en pense vraiment un jour."
OKL={"r0":["infrarouge","52","amplificatrice"],"a1":["T","382","14,6","29,4",RL["a1"]],"b1":["T","351","853","16,1",RL["b1"]],"b2":["1,5","2,7","1,7",RL["b2"]],"b3":["T","1","87",RL["b3"]],
     "c1":["T","424","14,9","0,2",RL["c1"]],"c2":[RL["c2"],"c0"],"d1":["T","0,7","0,3","22",RL["d1"]],"d2":["51000","2,55",RL["d2"],"c0"],"d3":[RL["d3"],"c0"]}
BADL={"r0":["visible","145","négative"],"a1":["T","593","16","2,18",BADTXT],"b1":["T","382","593","14,6",BADTXT],"b2":["16,1","17,3","2",BADTXT],"b3":["T","8","10",BADTXT],
     "c1":["T","426","15,1","1",BADTXT],"c2":[BADTXT,"c1"],"d1":["T","15,4","15,8","593",BADTXT],"d2":["5100000","2550000",BADTXT,"c1"],"d3":[BADTXT+" "+BADTXT,"c1"]}
async def sim(pg,emi,off=None,other=None):
    w=pg.locator("#wz")
    await w.locator(f'[data-emi="{emi}"]').click()
    if other is not None: await w.locator("[data-or]").evaluate(f"e=>{{e.value={other};e.dispatchEvent(new Event('input'))}}")
    if off:
        if not await w.locator("[data-fbx]").evaluate("d=>d.open"): await w.locator("[data-fbx] summary").click()
        await w.locator(f'[data-fb="{off}"]').click()
    await w.locator("[data-run]").click(); await pg.wait_for_timeout(120)
    if off: await w.locator(f'[data-fb="{off}"]').click()
async def task(pg,iid):
    if iid=="a1": await sim(pg,"8")
    if iid=="b1":
        for e in ["0","8","16"]: await sim(pg,e)
        await pg.wait_for_timeout(3700); await pg.locator("#wz").screenshot(path=D+"f-b1-T.png")
        await pg.locator('#wz [data-q="C"]').click(); await pg.wait_for_timeout(200); await pg.locator("#wz").screenshot(path=D+"f-b1-C.png")
        await pg.locator('#wz [data-q="T"]').click()
    if iid=="b3":
        for v in [4,2,1]: await sim(pg,"o",other=v)
    if iid=="d1":
        for k in ["wv","alb","carb"]: await sim(pg,"8",off=k)
        await pg.wait_for_timeout(3700); await pg.locator("#wz").screenshot(path=D+"f-d1.png")
async def fill(pg,iid,vals,root=""):
    for k,v in enumerate(vals):
        part=pg.locator(f'{root} .part[data-k="{k}"]')
        if v=="T": continue
        if v[0]=="M" and v[1:].isdigit():
            for i in range(len(v)-1):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i,j in enumerate(v[1:]):
                await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
        elif v[0]=="R" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'.seg button[data-i="{i}"][data-j="{j}"]').click()
        elif v[0]=="X" and (v[1:].isdigit() or v=="X"):
            n=await part.locator('.opt').count()
            for j in range(n):
                if await part.locator(f'.opt[data-j="{j}"][aria-pressed="true"]').count(): await part.locator(f'.opt[data-j="{j}"]').click()
            for j in v[1:]: await part.locator(f'.opt[data-j="{j}"]').click()
        elif v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)
async def check_item(pg,mode,iid,OK,BAD,root=""):
    await pg.locator(f"{root} [data-check]").click()
    t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (mode,iid,t)
    for _ in range(3): await pg.locator(f"{root} [data-hint]").click()
    await fill(pg,iid,BAD[iid],root)
    if "T" in OK[iid] and mode=="g":
        if iid!="c1":
            await pg.locator(f"{root} [data-check]").click(); t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (iid,"tâche",t)
        await task(pg,iid)
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    print(mode,iid,"BAD →",(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:70])
    assert await pg.locator(f"{root} .corr").count()==0, iid+" corr trop tôt"
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator(f"{root} .corr").count()==1, iid+" corr absent"
    await fill(pg,iid,OK[iid],root); await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(250)
    bad=await pg.locator(f"{root} .pfb.bad,{root} .pfb.mid").all_inner_texts()
    g=(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:60]
    print(mode,iid,"OK →",g,bad); assert "Tout est juste" in g, (mode,iid,bad)
async def run(pg,mode,OK,BAD):
    await pg.locator('#tabs [data-v="accueil"]').click(); await pg.wait_for_timeout(150)
    await check_item(pg,mode,"r0",OK,BAD,"#item")
    for g,items in G.items():
        await pg.locator(f'#tabs [data-v="{g}"]').click()
        for i,iid in enumerate(items):
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
            await check_item(pg,mode,iid,OK,BAD)
            if iid=="d3":
                await pg.wait_for_timeout(4500); await pg.screenshot(path=D+f"f-{mode}-d3.png",full_page=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        await run(pg,"g",OKG,BADG)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-g.png",full_page=True)
        await pg.goto(URL+"?version=exigeante#accueil"); await pg.wait_for_timeout(300)
        await run(pg,"l",OKL,BADL)
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-l.png",full_page=True)
        txt=await pg.evaluate("bilanText('Test')"); open(D+"bilan-l.txt","w").write(txt); print(txt[:1800]); print("…"); print(txt[-900:])
        print("errors:",errs)
        await b.close()
asyncio.run(main())
