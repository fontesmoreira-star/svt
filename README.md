# Activités interactives SVT, EIST et Enseignement scientifique

Site : https://fontesmoreira-star.github.io/svt/

Applications HTML autonomes (un fichier par activité, sans dépendance externe), rangées par niveau, thème et chapitre.

| Niveau | Dossier | Page à donner aux élèves |
|---|---|---|
| 5e EIST | `5e/` | https://fontesmoreira-star.github.io/svt/5e/ |
| 4e SVT | `4e/` | https://fontesmoreira-star.github.io/svt/4e/ |
| 3e SVT | `3e/` | https://fontesmoreira-star.github.io/svt/3e/ |
| 2nde SVT | `2nde/` | https://fontesmoreira-star.github.io/svt/2nde/ |
| Terminale ES | `terminale/` | https://fontesmoreira-star.github.io/svt/terminale/ |
| Terminale spé SVT | `terminale-spe/` | https://fontesmoreira-star.github.io/svt/terminale-spe/ |

Chaque thème et chaque chapitre qui contient une activité a aussi sa propre page, par exemple `3e/vivant-evolution/ch2-transmission/`.

Aucune collecte de données : la progression reste dans le navigateur de l'élève, et le bilan ne sort que par une action de l'élève (téléchargement .txt, copie, écran « Montrer au professeur »).

## Ajouter une activité
1. Adapter l'app écrite pour claude.ai : `python3 outils/adapter.py source.html <niveau>/<thème>/<chapitre>/nom.html`
2. Ajouter l'activité dans `outils/catalogue.json` (au niveau, au thème ou au chapitre).
3. Régénérer les pages : `python3 outils/generer_pages.py`
4. Publier (commit + push) : le site est à jour en 1 à 2 minutes.

Pour afficher une app déjà en ligne dans une autre rubrique sans la copier (par exemple les activités de 2nde dans « Cours Miya »), mettre dans le catalogue une clé `chemin` (chemin depuis la racine du site) à la place de `fichier`.

## Rubriques cachées
Un niveau du catalogue marqué `"cache": true` n'apparaît pas sur l'accueil, et ses pages et ses apps portent `noindex` (non référencées par les moteurs de recherche). L'adresse n'est connue que de ceux à qui on la donne, mais le dépôt reste public : n'y mettre ni nom de famille, ni note, ni adresse personnelle.
Une thématique peut avoir sa propre couleur (`"couleur": "pc"` = bleu physique-chimie).

## Atelier
Le dossier `atelier/` contient les sources de toutes les apps, le script de construction, les tests et la charte commune (`atelier/CHARTE.md`). Mode d'emploi : `atelier/README.md`.
