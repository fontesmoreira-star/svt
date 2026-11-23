# Réponses d'élèves plausibles : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/fiche-animee-metabolisme.html?version=exigeante"
T={"a2":["Je vois que le 1 pousse seulement dans le milieu A avec la lumiere et les sels mineraux, il passe de 0,1 a 8 millions. Le 2 pousse que avec du glucose dans C. Je sais qu'un autotrophe utilise de la matiere minerale et la lumiere et qu'un heterotrophe utilise de la matiere organique. Donc le 1 est autotrophe et le 2 est heterotrophe.",
     "Le micro-organisme ① se développe à la lumière dans un milieu minéral, le ② a besoin de glucose. ① est autotrophe car il fabrique sa matière avec des sels minéraux et de la lumière ; ② est hétérotrophe car il utilise de la matière organique (12 millions dans C)."],
   "b2":["Le CO2 et l'eau rentrent dans le chloroplaste et quand la lampe est éteinte il n'y a pas de glucose. Il faut 6 CO2 car le glucose a 6 carbones. Donc le carbone du glucose vient du CO2 et l'énergie vient de la lumière."],
   "d1":["La coccinelle mange des pucerons qui eux boivent la sève du tilleul. Le tilleul fabrique de la matière organique grâce à la photosynthèse et cette matière contient de l'énergie. Donc la matière passe du tilleul au puceron puis à la coccinelle."],
   "f1":["On mesure le dioxygène et le dioxyde de carbone. Avec les graines en germination le dioxygène diminue de 20,9 % à 19,3 % et le CO2 augmente jusqu'à 1,64 %. Les graines sèches restent stables. Je sais que la respiration consomme du dioxygène et rejette du CO2. Donc elles respirent.",
     "O2 baisse de 1,6 % en 20 min et CO2 augmente pour les graines qui germent, alors que pour le témoin rien ne change. La respiration absorbe l'O2 et rejette du CO2 donc les graines en germination font la respiration."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
