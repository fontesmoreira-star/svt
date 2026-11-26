# Réponses d'élèves plausibles : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/biodiversite-temps/organisation-vertebres.html?version=exigeante"
T={"a1":["La carpe et la grenouille ont deux axes de polarité : un axe antéro-postérieur qui va de la tête à la queue et un axe dorso-ventral du dos au ventre. Elles ont aussi un plan de symétrie qui sépare la droite et la gauche. Les deux ont donc la même organisation.",
     "Je vois que la tete est a l'avant et la queue a l'arriere, le dos en haut et le ventre en bas. Quand on plie selon la ligne A les moities droite et gauche se superposent, c'est un plan de symetrie bilaterale. C'est pareil chez la carpe et la grenouille."],
   "a2":["Sur la radiographie le squelette de la carpe et de la grenouille est bien blanc, 88 % et 85 %, alors que la roussette est à 21 %. Les rayons X sont arrêtés par les minéraux de l'os. Donc leur squelette est osseux.",
     "Le squelette est très contrasté chez la carpe alors que chez le requin on le voit à peine car c'est du cartilage. Donc la carpe a un squelette osseux."],
   "a3":["Le crâne est à l'avant, la colonne vertébrale est du côté du dos le long de l'axe antéro-postérieur et les 4 membres sont du côté ventral, 2 antérieurs et 2 postérieurs. Cela suggère que la carpe et la grenouille ont un ancêtre commun.",
     "Le crane est anterieur, la colonne est dorsale et les membres sont ventraux de part et d'autre du plan de symetrie. Ils sont donc apparentés."],
   "b2":["Les quatre membres ont une ceinture scapulaire, un humérus, un radius et un cubitus puis les os de la main, même si la mésange et l'oreillard volent et la tortue marche. Le papillon vole aussi mais n'a pas d'os, donc ce n'est pas la fonction qui compte. Ces vertébrés sont apparentés, ils ont un ancêtre commun.",
     "On retrouve chez les 4 la même organisation : ceinture, humérus, radius, cubitus, phalanges. Pourtant leurs formes sont différentes. Ils descendent donc d'un ancêtre commun."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
