# Réponses d'élèves plausibles (version exigeante) : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch3-diversite-evolution/comparaisons-adn.html?version=exigeante"
T={"b1":["Les mammiferes sont les plus proches : le chimpanze a 98,8 % et la souris 90 %. Ensuite le poisson zebre a 85 %. La mouche (36 %) et la bacterie (7 %) sont les plus eloignes.",
         "Plus l'être vivant est différent de l'Homme, plus le pourcentage est bas : chimpanzé et souris (mammifères) sont en haut, puis le poisson zèbre qui est un vertébré, puis l'insecte et la bactérie qui ont les pourcentages les plus faibles."],
   "c1":["Au debut les deux especes ont le meme ADN car il vient de l'ancetre commun. Apres il y a des mutations qui s'accumulent avec le temps. Donc si l'ADN se ressemble beaucoup elles se sont separees il y a peu de temps et ont un ancetre commun recent.",
         "L'ADN est hérité de l'ancêtre commun, puis des mutations apparaissent au fil du temps dans chaque espèce. Donc deux espèces très ressemblantes sont proches parentes car leur ancêtre commun est récent."],
   "c2":["La souris a 90 % et le poisson zebre 85 %. La souris est plus proche de l'Homme donc elle a un ancetre commun plus recent avec l'Homme, elle se separe apres.",
         "90 % c'est plus que 85 %, donc la souris ressemble plus à l'Homme, leur ancêtre commun est plus récent que celui du poisson zèbre."],
   "d1":["Il y a des differences dans 49 regions de l'ADN et dans une il y a un gene du developpement du cerveau. Donc meme si il y a peu de differences elles changent des caracteres importants.",
         "Les 1,2 % de différences sont dans 49 régions, dont un gène qui agit sur le cerveau : quelques différences peuvent changer beaucoup de caractères."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
