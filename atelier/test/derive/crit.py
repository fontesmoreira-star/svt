# Réponses d'élèves plausibles : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/forces-evolutives/derive-genetique.html?version=exigeante"
T={"a1":["La fréquence de A1 a monté et baissé plusieurs fois, puis A1 a disparu à la génération 33. C'est parce qu'à chaque reproduction les allèles transmis sont tirés au hasard. C'est la dérive génétique.",
     "Au début A1 était à 50 % puis ça a changé car les parents ne donnent pas tous leurs allèles aux enfants, c'est le hasard. A la fin A2 est fixé."],
   "b1":["Les courbes sont toutes différentes et souvent A1 arrive à 0 % ou 100 %. La dérive génétique c'est quand la fréquence des allèles change au hasard d'une génération à l'autre.",
     "Je vois que les 10 simulations ne donnent pas le même résultat, un allèle disparait presque toujours. La dérive génétique est un changement aléatoire de la fréquence des allèles au cours des générations."],
   "b2":["Avec 10 individus la fréquence finale va de 0 à 100 % et un allèle disparaît, alors qu'avec 10 000 individus les courbes restent proches de 50 %. Le hasard a plus d'effet quand il y a peu d'allèles. Donc plus la population est petite, plus la dérive est forte.",
     "Dans la petite population un allèle est fixé dans toutes les simulations mais dans la grande population la fréquence reste stable vers 50 %. La dérive est donc plus importante dans une petite population car le tirage aléatoire compte beaucoup."],
   "b3":["Pendant la crise à 5 guépards, 4 allèles ont disparu et ils ne réapparaissent pas après. La dérive est forte dans les petites populations. Elle diminue donc la diversité génétique. Les guépards risquent de ne pas pouvoir s'adapter à une maladie.",
     "Il reste 2 allèles sur 6 après la crise. La dérive génétique réduit la biodiversité surtout quand la population est petite et les guépards auront du mal à survivre à un changement du milieu."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
