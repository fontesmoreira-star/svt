"""Version lycée : contrôle du repérage par mots-clés sur des réponses types (modèles, réponses d'élèves plausibles, réponses fausses)."""
import asyncio, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/echelles-biodiversite/trois-echelles-biodiversite.html?version=lycee"
CASES={
 ("a1",2):[("MODEL",5),
   ("Le canard A a eu des canetons avec B et avec D et ces canetons ont pu avoir des petits. Avec E ça ne marche pas. C marche seulement avec E. Donc il y a 2 espèces. D et E se ressemblent mais ils ne peuvent pas se reproduire ensemble donc la ressemblance ne suffit pas.",4),
   ("Il y a deux espèces parce que certains canards ont le même plumage et d'autres non, on le voit bien sur le dessin des cinq canards au bord de l'étang.",1),
   ("Je vois que A x B donne des petits fertiles et que C x D ne donne rien. Je sais que deux individus de la même espèce sont interféconds et que leur descendance est fertile. J'en déduis deux espèces : ABD et CE. D et E ont le même plumage brun pourtant elles ne sont pas de la même espèce.",5)],
 ("a2",1):[("MODEL",4),
   ("Non, parce que quand on croise un âne et une jument on obtient un mulet qui ne peut pas avoir de petits. Or pour être de la même espèce il faut une descendance fertile. Ce sont donc deux espèces différentes.",4),
   ("Oui ils sont de la même espèce car ils se ressemblent beaucoup et ils peuvent avoir un petit ensemble dans le pré comme on le voit.",0),
   ("Le petit du cheval et de l'âne est stérile, il n'est pas fertile, donc ils ne sont pas de la même espèce tous les deux.",2)],
 ("a2",2):[("MODEL",3),
   ("Une espèce est un groupe d'êtres vivants qui se ressemblent, qui peuvent se reproduire entre eux et dont les petits sont fertiles.",3),
   ("Une espèce c'est des animaux qui se ressemblent et qui vivent au même endroit toute leur vie.",1)],
 ("b3",2):[("MODEL",4),
   ("Le crocodile est plus proche du gorille car ils ont un ancêtre commun plus récent que celui avec la sardine, et cet ancêtre leur a donné les doigts.",4),
   ("Le crocodile car il vit sur terre comme le gorille alors que la sardine vit dans l'eau, donc ils sont plus proches tous les deux.",1)],
 ("c1",1):[("MODEL",4),
   ("Mon tableau montre que mes trois personnes n'ont pas les mêmes yeux ni les mêmes cheveux. Pourtant elles sont de la même espèce. C'est parce qu'elles ont les mêmes gènes mais des allèles différents.",4),
   ("Les trois personnes sont différentes parce qu'elles ne vivent pas au même endroit et n'ont pas les mêmes parents ni la même famille.",1)],
 ("c2",2):[("MODEL",4),
   ("Dans le lac il fait 16 °C et dans le champ 25 °C, la luminosité aussi change : les milieux de vie sont différents. Dans le lac j'ai trouvé la perche, le cygne et la limnée, dans le champ le lapin et l'abeille : il y a plusieurs espèces dans chaque milieu.",4),
   ("Le tableau montre des nombres et des noms pour le lac et pour le champ, on voit bien que tout est rangé dans les colonnes correctement.",0)],
 ("c3",0):[("MODEL",5),
   ("La biodiversité c'est la diversité des écosystèmes comme le lac et la forêt, la diversité des espèces qui y vivent (cygne, perche, chêne) et la diversité génétique : dans l'espèce humaine on n'a pas tous les mêmes yeux.",5),
   ("La biodiversité c'est le nombre d'animaux qu'il y a sur la Terre, il y en a beaucoup et il faut les protéger car certains sont en train de disparaître.",0)],
}
LISTS={("b1",0):[("chlorophylle, tige et feuilles, racines et vaisseaux conducteurs",True),("Chlorophylle ; tiges ; racines",True),("chlorophylle, tige et feuilles, graines",False),("chlorophylle",False)],
 ("b1",1):[("crâne et vertèbres, mâchoires, squelette osseux, doigts",True),("vertebres machoires os doigts",True),("mâchoires, doigts, amnios",False)],
 ("b2",1):[("mâchoires, doigts, mamelles",True),("mamelles",False)]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(200); bad=0
        for (iid,k),cs in CASES.items():
            for txt,exp in cs:
                r=await pg.evaluate("([i,k,t])=>{const p=LYCEE[i].parts[k];const v=t==='MODEL'?p.model.replace(/\\u00a0|\\u202f/g,' '):t;const r=checkPart(p,v);return {pts:r.pts,max:p.crit.length,auto:r.auto,empty:!!r.empty,msg:r.msg}}",[iid,k,txt])
                flag="" if r["pts"]==exp else "   <<< attendu %d"%exp
                if flag: bad+=1
                print(f'{iid}.{k} {r["pts"]}/{r["max"]} {r.get("auto")} {txt[:60]!r}{flag}')
        for (iid,k),cs in LISTS.items():
            for txt,exp in cs:
                r=await pg.evaluate("([i,k,t])=>checkPart(LYCEE[i].parts[k],t)",[iid,k,txt])
                flag="" if r["ok"]==exp else "   <<< attendu %s"%exp
                if flag: bad+=1
                print(f'{iid}.{k} list ok={r["ok"]} {txt[:50]!r} · {r["msg"]}{flag}')
        print("écarts:",bad,"errors:",errs); await b.close()
asyncio.run(main())
