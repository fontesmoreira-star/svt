import asyncio, sys
from playwright.async_api import async_playwright
sys.path.insert(0,"test/simc"); 
URL="file:///home/claude/svt/terminale/theme-1/1-3-climat-futur/comment-sont-faits-les-modeles.html"
D="test/modl/"
import importlib.util
spec=importlib.util.spec_from_file_location("fl","test/simc/flow.py")
src=open("test/simc/flow.py").read().split("async def sim(")[0]  # réutilise rien : on redéfinit
G={"p1":["a1","a2","a3"],"p2":["b1","b2"],"p3":["c1","c2"],"p4":["d1"]}
BADTXT="Je pense que le climat va changer un peu mais je ne suis pas vraiment sûr de ce que montre ce logiciel de simulation sur la tablette, il faudrait demander au professeur ce qu'il en pense vraiment un jour prochain en classe, avec les autres élèves de la classe et tout le monde."
RL={"a1":"Un MCGOA couple l'atmosphère et l'océan, avec les glaces de mer et les continents. Un MST ajoute à ce MCGOA les rétroactions, notamment celles du cycle du carbone.",
"a2":"Dans chaque maille, le modèle n'a qu'une seule valeur : des mailles plus petites montrent mieux les détails comme le relief ou le Luxembourg. Mais diviser la maille par 2 donne 8 fois plus de calculs, donc il faut un compromis selon la puissance des supercalculateurs.",
"a3":"Les modèles climatiques sont des programmes informatiques qui traduisent les lois de la physique et de la chimie en équations. Ils couplent l'atmosphère, les océans, les continents et les glaces de mer, ainsi que des rétroactions. Ils calculent le climat sur plusieurs décennies, pas la météo d'un jour.",
"b1":"J'ai comparé les températures simulées aux observations et j'ai mesuré l'écart moyen. Puis j'ai modifié le transport de chaleur pour réduire l'écart jusqu'à 2 °C. Les vents et les courants transportent la chaleur de l'équateur vers les pôles.",
"b2":"On compare les résultats des modèles aux observations actuelles, par exemple des satellites, et aux climats passés connus grâce aux indices géologiques, comme il y a 21 000 ans. Quand il existe un écart, les chercheurs modifient le modèle pour l'améliorer.",
"c1":"Sans émissions anthropiques, les modèles ne reproduisent pas le réchauffement depuis 1980. Avec les émissions, ils reproduisent toute la courbe. Le réchauffement récent est donc dû aux émissions humaines de gaz à effet de serre, et les 12 modèles indépendants donnent la même conclusion.",
"c2":"Les modèles permettent de tester différents scénarios. Ils montrent que le réchauffement récent n'est reproduit qu'avec les émissions anthropiques. Selon le scénario, on obtient de 1,9 °C à 4,4 °C en 2100, avec une fourchette qui éclaire les décisions.",
"d1":"Les modèles climatiques sont des programmes informatiques qui simulent le climat à partir d'équations issues des lois physiques et chimiques. Ils couplent l'atmosphère, les océans, les continents et les glaces, avec les rétroactions. Pour vérifier leur fiabilité, on compare leurs résultats aux observations actuelles des satellites et aux climats passés connus par la géologie. Si des écarts apparaissent, les modèles sont corrigés et améliorés. Enfin, ils permettent de tester des scénarios et montrent que le réchauffement récent vient des émissions humaines."}
def answers(v):
    nat,al,p1,p5,lzs,pt,d0=v
    fr=lambda x,d=1: (f"{x:.{d}f}").replace(".",",")
    OKG={"r0":["c0","c0","c0"],"a1":["T","M01234","c0","c0","c0"],"a2":["T","c0","816000","c0","c0"],"a3":["T","c0",fr(lzs,0),"c0","c0","c0"],
         "b1":["T","0,36","c0","c0","c0"],"b2":["T","R012","3","c0","c0","c1"],"c1":["T","R0100",fr(nat,2),"c0","c0","c0"],"c2":["T",fr(p5),"R01","c0","c2"],"d1":["M01234","c0"]}
    BADG={"r0":["c1","c1","c2"],"a1":["T","M10234","c1","c2","c1"],"a2":["T","c1","20400000","c1","c1"],"a3":["T","c1","25","c1","c1","c1"],
          "b1":["T","0,8","c1","c1","c1"],"b2":["T","R210","4,5","c1","c1","c0"],"c1":["T","R0000","1,09","c1","c1","c1"],"c2":["T","1","R10","c2","c0"],"d1":["M10234","c1"]}
    OKL={"r0":["entrée","amplificatrice","1"],"a1":["T","M01234","76",RL["a1"]],"a2":["T","4,1","816000","1000",RL["a2"]],"a3":["T",fr(lzs,0),"c0",RL["a3"]],
         "b1":["T","0,36",fr(d0,0),RL["b1"]],"b2":["T","3",fr(-pt),RL["b2"]],"c1":["T",fr(nat,2),fr(al,2),fr(nat/1.09*100,0),RL["c1"]],"c2":["T",fr(p1),fr(p5),RL["c2"]],"d1":[RL["d1"],"c0"]}
    BADL={"r0":["sortie","négative","12"],"a1":["T","M10234","1950",BADTXT],"a2":["T","103","20400000","10",BADTXT],"a3":["T","25","c1",BADTXT],
          "b1":["T","0,8","26",BADTXT],"b2":["T","4,5","-5,6",BADTXT],"c1":["T","1,09","0,5","100",BADTXT],"c2":["T","4,4","1,8",BADTXT],"d1":[BADTXT+" "+BADTXT,"c1"]}
    return OKG,BADG,OKL,BADL
async def task(pg,iid):
    w=pg.locator("#wz")
    if iid=="a1":
        for m in ["oce","gla","con","ret"]: await w.locator(f'[data-m="{m}"]').click()
        await w.screenshot(path=D+"f-mst.png")
    if iid=="a2":
        for km in [250,100,50,25,10]: await w.locator(f'[data-km="{km}"]').click(); await pg.wait_for_timeout(80)
        await w.locator('[data-km="25"]').click(); await w.screenshot(path=D+"f-maille25.png")
    if iid=="a3":
        await w.locator('[data-ctl] [data-a="run"]').click(); await pg.wait_for_timeout(9600)
        await w.locator("[data-clim]").click(); await pg.wait_for_timeout(500); await w.screenshot(path=D+"f-lorenz.png")
    if iid=="b1":
        await w.locator("[data-d]").evaluate("e=>{e.value=0.36;e.dispatchEvent(new Event('input'))}"); await pg.wait_for_timeout(200); await w.screenshot(path=D+"f-profil.png")
    if iid=="b2":
        for s in [2,4.5,3]:
            await w.locator("[data-s]").evaluate(f"e=>{{e.value={s};e.dispatchEvent(new Event('input'))}}"); await w.locator("[data-run]").click(); await pg.wait_for_timeout(5600)
        await w.screenshot(path=D+"f-paleo.png")
    if iid=="c1":
        await w.locator('[data-pre="nat"]').click(); await pg.wait_for_timeout(300); await w.locator('[data-pre="all"]').click(); await pg.wait_for_timeout(5000); await w.screenshot(path=D+"f-attrib.png")
    if iid=="c2":
        for k in ["1-2.6","2-4.5","5-8.5"]: await w.locator(f'[data-k="{k}"]').click()
        await pg.wait_for_timeout(200); await w.screenshot(path=D+"f-proj.png")
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
        elif v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)
async def check_item(pg,mode,iid,OK,BAD,root=""):
    await pg.locator(f"{root} [data-check]").click()
    t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (mode,iid,t)
    for _ in range(3): await pg.locator(f"{root} [data-hint]").click()
    await fill(pg,iid,BAD[iid],root)
    if "T" in OK[iid] and mode=="g":
        await pg.locator(f"{root} [data-check]").click(); t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (iid,"tâche",t)
        await task(pg,iid)
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    print(mode,iid,"BAD →",(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:60])
    assert await pg.locator(f"{root} .corr").count()==0, iid+" corr trop tôt"
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator(f"{root} .corr").count()==1, iid+" corr absent"
    await fill(pg,iid,OK[iid],root); await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(250)
    bad=await pg.locator(f"{root} .pfb.bad,{root} .pfb.mid").all_inner_texts()
    g=(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:50]
    print(mode,iid,"OK →",g,bad); assert "Tout est juste" in g, (mode,iid,bad)
async def run(pg,mode,OK,BAD):
    await pg.locator('#tabs [data-v="accueil"]').click(); await pg.wait_for_timeout(150)
    await check_item(pg,mode,"r0",OK,BAD,"#item")
    for g,items in G.items():
        await pg.locator(f'#tabs [data-v="{g}"]').click()
        for i,iid in enumerate(items):
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
            await check_item(pg,mode,iid,OK,BAD)
            if iid=="d1": await pg.screenshot(path=D+f"f-{mode}-d1.png",full_page=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(300)
        v=await pg.evaluate("[NAT15,ALL15,P1,P5,LZS,PAL3.T,D0[0]]"); print("valeurs",v)
        OKG,BADG,OKL,BADL=answers(v)
        await run(pg,"g",OKG,BADG)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-g.png",full_page=True)
        print("PARA g:", await pg.evaluate("myPara()"))
        await pg.goto(URL+"?version=exigeante#accueil"); await pg.wait_for_timeout(300)
        await run(pg,"l",OKL,BADL)
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-l.png",full_page=True)
        txt=await pg.evaluate("bilanText('Test')"); open(D+"bilan-l.txt","w").write(txt); print(txt[-1400:])
        print("errors:",errs)
        await b.close()
asyncio.run(main())
