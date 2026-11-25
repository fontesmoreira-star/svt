# Réponses d'élèves plausibles : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/biodiversite-temps/evolution-biodiversite-temps.html?version=exigeante"
T={"a1":["Aujourd'hui il y a des fougères, des arbres à fleurs comme le fromager, des colibris et un raton laveur. Au Carbonifère il y avait des fougères mais aussi des prêles géantes et une libellule géante. Il n'y avait pas d'oiseaux. Donc les espèces sont différentes et la biodiversité change au cours du temps.",
     "Dans les deux forets on voit des fougeres. Mais au carbonifere il y a des lepidodendrons et des amphibiens primitifs alors qu'aujourd'hui il y a des oiseaux et des mammiferes. Les especes ne sont pas les memes donc la biodiversite a evolue."],
   "b1":["Dans le sable du Maastrichtien il y a des globotruncanidés et des hétérohélicidés. Dans le Danien il y a des hétérohélicidés et des globigérinidés. Les globotruncanidés ont disparu à la crise et les globigérinidés sont apparus après, les hétérohélicidés ont survécu."],
   "b2":["On voit un pic d'iridium et de magnétite à -66 Ma. L'iridium vient des météorites donc il y a eu l'impact de Chicxulub. Le volcanisme du Deccan commence 0,4 Ma avant. La productivité et le CaCO3 chutent car le plancton meurt."],
   "c2":["La destruction de l'habitat est la cause principale pour 82 % des mammifères menacés. Il y a aussi la pollution et la surpêche. En Amazonie 40 millions d'hectares ont été détruits. L'Homme fait de la sélection artificielle avec la téosinte pour avoir du maïs mais on cultive peu de variétés donc la diversité génétique diminue."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
