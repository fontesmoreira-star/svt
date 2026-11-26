# Réponses d'élèves plausibles (version exigeante) : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch3-diversite-evolution/apparition-nouveau-caractere.html?version=exigeante"
T={"a1":["Toutes les mouches ont le meme caryotype avec 4 paires de chromosomes et elles ont les memes genes au meme endroit. Mais les alleles sont differents, par exemple yeux rouges ou blancs.",
          "Elles ont les mêmes chromosomes et les mêmes gènes, mais pas les mêmes allèles, donc elles ont des caractères différents comme la couleur des yeux."],
   "b1":["La mouche a 4 ailes car le segment T3 est devenu comme le T2. C'est une mutation d'un gène qui a donné un nouvel allèle.",
         "Il y a eu une mutation dans le gene qui fait les segments, ca a cree un nouvel allele et la mouche a une deuxieme paire d'ailes."],
   "b2":["Quand la mutation est dans l'aile elle n'est pas transmise mais dans le spermatozoide oui. Car le spermatozoide feconde l'ovule et donne la cellule oeuf qui fait toutes les cellules par mitose.",
         "La mutation du spermatozoïde est transmise car il participe à la fécondation, la cellule-œuf se divise et toutes les cellules du bébé ont la mutation, alors que l'aile ne sert pas à la reproduction."],
   "c1":["Pour Lamarck la girafe fait des efforts pour attraper les feuilles en haut des arbres, son cou s'allonge petit a petit pendant sa vie et elle le transmet a ses petits.",
         "Selon Lamarck, à force de s'étirer pour brouter les arbres, le cou devient plus long et ce caractère passe à tous les individus de sa race."],
   "c2":["Chez Lamarck le cou s'allonge pendant la vie grace a l'effort. Chez Darwin les girafes sont deja differentes a la naissance et pendant la famine celles qui ont un petit cou meurent.",
         "Pour Lamarck c'est l'effort qui allonge le cou alors que pour Darwin certaines naissent plus grandes et survivent pendant les disettes."],
   "d1":["Avec famine la hauteur passe de 4,47 a 4,85 m et sans famine elle reste stable. Les girafes les plus grandes atteignent les feuilles et survivent, puis elles font des petits qui heritent de leur taille.",
         "La moyenne augmente avec les famines car les petites meurent et les grandes survivent et transmettent leur taille a leurs bebes. Dans le temoin ca ne change presque pas."],
   "d2":["Lamarck dit que l'effort allonge le cou et que c'est transmis. Or seules les mutations des gametes sont transmises et elles arrivent au hasard. Donc Darwin a raison : des girafes naissent avec un long cou grace a leurs alleles et survivent aux famines.",
         "J'observe que pour Lamarck le cou s'allonge en s'étirant. Or les mutations se font au hasard et seulement celles des cellules reproductrices passent aux enfants. Donc Lamarck a tort, les girafes au long cou existaient déjà à la naissance et ont survécu."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
