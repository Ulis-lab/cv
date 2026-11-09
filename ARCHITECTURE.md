# Architecture du Créateur de CV (Beta 0.5.1)

Le même code sert pour **la version web** (GitHub Pages) **et l'appli Windows** (Electron).
Il n'y a plus de gros fichiers : chaque morceau a son petit fichier, avec une ligne en haut qui dit à quoi il sert.

## Règle d'or
**L'aperçu à l'écran et le PowerPoint doivent toujours rester identiques.**
Quand tu changes un modèle, change les deux : `js/preview/templates/mX.js` + `css/templates/mX.css` (aperçu) **et** `js/pptx/templates/mX.js` (PowerPoint).

## Vue d'ensemble
```
index.html          la page (liens vers css/ et js/, dans l'ordre)
css/                les styles
js/                 le code (voir plus bas)
vendor/             pptxgen.bundle.js = la bibliothèque qui fabrique le .pptx (NE PAS MODIFIER)
assets/             icônes de l'appli Windows
electron/           main.js + preload.js = uniquement pour l'appli Windows
package.json        configuration de la construction du .exe
sauvegardes/        anciennes versions gardées pour pouvoir revenir en arrière
```

## Comment ça marche (en 4 lignes)
1. Tu remplis le formulaire → les infos vont dans la variable `data` (`js/core/state.js`).
2. À chaque frappe, `render()` (`js/preview/render.js`) redessine l'aperçu avec le modèle choisi.
3. Au clic sur « PowerPoint », `construirePPTX()` (`js/pptx/build.js`) dessine le même CV en PowerPoint, et le resserre tant qu'il dépasse une page.
4. Le CV est gardé automatiquement dans le navigateur (`js/core/autosave.js`), rien n'est envoyé sur internet.

## Ajouter un nouveau modèle (ex. « m11 »)
1. `js/preview/templates/m11.js` : `R.m11 = () => ...` (copie `m4.js` comme base)
2. `css/templates/m11.css` : les styles du modèle + une ligne `<link>` dans `index.html`
3. `js/pptx/templates/m11.js` : `PPTX_MODELES.m11 = async function (c) { ... }` (copie `m4.js`)
4. `js/data/templates-list.js` : ajouter `{ id:"m11", name:"10. Mon modèle" }`
5. `js/pptx/text-metrics.js` n'a rien à changer ; si la colonne de texte a une largeur particulière, ajouter la largeur dans `js/pptx/compaction.js` (liste `MW_EST`)
6. Ajouter les deux `<script>` dans `index.html` (l'ordre entre les modèles n'a pas d'importance)
7. Pour la couleur d'accent personnalisable : ajouter l'id dans `ACCENT_REF` de `js/pptx/personalisation.js`

## Revenir en arrière
- **Calcul des lignes longues (PowerPoint)** : dans `js/pptx/constants.js`, mettre `const CALCUL_LIGNES = false;` → le PowerPoint redevient comme en Beta 0.3.4.
- **Toute l'ancienne structure (Beta 0.3.5)** : le dossier `sauvegardes/Beta0.3.5_avant_refonte/` contient les anciens fichiers. Sur GitHub, le commit `f61235d` est la Beta 0.3.5 complète.
- **Ancien calcul (Beta 0.3.4)** : `sauvegardes/SAUVEGARDE_modeles_Beta0.3.4.js`.

## Changer le numéro de version (5 endroits)
`electron/main.js` (titre de la fenêtre) · `index.html` (`<small>Beta x</small>`) · `package.json` (`version`, `productName`, et les 2 `artifactName`).

## Tests
Les tests automatiques ne sont pas dans ce dossier (ils tournent à part). Après une modification, vérifie à la main : un CV vide, un CV rempli, les 9 modèles, un export PowerPoint ouvert dans PowerPoint ou Google Slides, et un PDF.

## Liste des fichiers

### `js/data/` — Données de départ (modèles disponibles, polices, icônes, CV par défaut)

- `default-data.js` — Valeurs par défaut d'un CV vide + textes d'exemple affichés quand un champ est vide
- `fonts-list.js` — Polices proposées dans l'onglet Personnalisation
- `icons.js` — Icônes SVG (téléphone, mail, ville, permis) utilisées dans l'aperçu
- `templates-list.js` — Liste des modèles de CV (id + nom affiché dans la barre de modèles)

### `js/core/` — Cœur : état du CV, sécurité/validation, sauvegarde auto, valeurs d'exemple

- `autosave-restore.js` — Lecture de la sauvegarde automatique + fenêtre « Reprendre ton CV ? »
- `autosave.js` — Sauvegarde automatique du CV dans ce navigateur (localStorage)
- `clean-data.js` — Reconstruit un CV propre à partir d'un fichier (liste blanche de champs, types et tailles vérifiés)
- `dirty-state.js` — Suivi « modifié / sauvegardé » du CV (pour l'alerte de fermeture)
- `escape.js` — Échappe le texte avant de l'afficher en HTML (protection XSS)
- `example-values.js` — Valeurs affichées dans l'aperçu : le texte saisi, ou un exemple si le champ est vide
- `export-data.js` — Prépare les données du CV pour l'export (PPTX/PDF)
- `filename.js` — Nom de fichier proposé pour les exports (prénom_nom)
- `focus-trap.js` — Garde le focus clavier dans une fenêtre modale et le rend à la fermeture
- `state.js` — État global de l'appli (le CV en cours, le modèle choisi, le zoom, les drapeaux)
- `validate-color.js` — Accepte uniquement une couleur #rrggbb
- `validate-image.js` — Accepte uniquement de vraies images jpeg/png (data-URL) de taille raisonnable
- `validate-number.js` — Borne un nombre entre un min et un max
- `validate-template.js` — Vérifie qu'un id de modèle existe (évite __proto__, constructor...)

### `js/pptx/` — Export PowerPoint (calcul de la mise en page, une page garantie)

- `build-pass.js` — Une passe de construction du PPTX (assemble photo, compactage, personnalisation, puis dessine le modèle)
- `build.js` — Construit le PPTX complet : resserre et recommence tant que ça déborde de la page (UNE page garantie)
- `compaction.js` — Compactage automatique : resserre les espaces (puis le texte) quand le CV est chargé, pour qu'il tienne sur une page
- `constants.js` — Dimensions de la page A4 (en pouces) + interrupteur du calcul des lignes
- `contacts.js` — Contacts du PPTX : 3 mises en page (colonne, ligne, grille)
- `experiences.js` — Bloc « Expérience » du PPTX (hauteur calculée d'après le texte réel)
- `formations.js` — Bloc « Formation » du PPTX
- `image-helpers.js` — Images pour le PPTX : dégradés, icônes colorées, photo aux coins arrondis
- `personalisation.js` — Personnalisation appliquée au PPTX : tailles de texte, couleur d'accent, police, hauteur du bloc Profil
- `photo-helper.js` — Photo du PPTX : forme ronde/carrée, coins arrondis, cadre « PHOTO » si pas de photo
- `slide-intercept.js` — Intercepte addText/addShape de chaque diapo : applique tailles, couleurs, police et mesure le bas du contenu
- `text-metrics.js` — Mesure du texte (largeur des lettres d'Arial) pour compter les lignes d'une puce longue
- `text-utils.js` — Petits outils texte : découpe en puces, valeur par défaut, contacts remplis

### `js/pptx/templates/` — Un fichier par modèle PowerPoint

- `_registry.js` — Registre des modèles PPTX (PPTX_MODELES.m1, m2...) — un fichier par modèle dans ce dossier
- `m1.js` — Modèle PPTX m1 (doit rester synchronisé avec preview/templates/m1.js)
- `m10.js` — Modèle PPTX m10 (doit rester synchronisé avec preview/templates/m10.js)
- `m2.js` — Modèle PPTX m2 (doit rester synchronisé avec preview/templates/m2.js)
- `m4.js` — Modèle PPTX m4 (doit rester synchronisé avec preview/templates/m4.js)
- `m5.js` — Modèle PPTX m5 (doit rester synchronisé avec preview/templates/m5.js)
- `m6.js` — Modèle PPTX m6 (doit rester synchronisé avec preview/templates/m6.js)
- `m7.js` — Modèle PPTX m7 (doit rester synchronisé avec preview/templates/m7.js)
- `m8.js` — Modèle PPTX m8 (doit rester synchronisé avec preview/templates/m8.js)
- `m9.js` — Modèle PPTX m9 (doit rester synchronisé avec preview/templates/m9.js)

### `js/preview/` — Aperçu à l'écran (HTML)

- `color.js` — Couleur personnalisée appliquée à l'aperçu
- `contact.js` — Bloc contact de l'aperçu (téléphone, mail, ville, permis)
- `photo-box.js` — Photo (ou cadre « PHOTO ») dans l'aperçu
- `photo-shape.js` — Forme de la photo (rond / carré adouci)
- `render.js` — Dessine l'aperçu, resserre pour tenir sur UNE page
- `sections.js` — Blocs Expérience / Formation / listes de l'aperçu

### `js/preview/templates/` — Un fichier par modèle d'aperçu

- `_registry.js` — Registre des aperçus de modèles (R.m1, R.m2...) — un fichier par modèle dans ce dossier
- `m1.js` — Aperçu HTML du modèle m1 (doit rester synchronisé avec pptx/templates/m1.js)
- `m10.js` — Aperçu HTML du modèle m10 (doit rester synchronisé avec pptx/templates/m10.js)
- `m2.js` — Aperçu HTML du modèle m2 (doit rester synchronisé avec pptx/templates/m2.js)
- `m4.js` — Aperçu HTML du modèle m4 (doit rester synchronisé avec pptx/templates/m4.js)
- `m5.js` — Aperçu HTML du modèle m5 (doit rester synchronisé avec pptx/templates/m5.js)
- `m6.js` — Aperçu HTML du modèle m6 (doit rester synchronisé avec pptx/templates/m6.js)
- `m7.js` — Aperçu HTML du modèle m7 (doit rester synchronisé avec pptx/templates/m7.js)
- `m8.js` — Aperçu HTML du modèle m8 (doit rester synchronisé avec pptx/templates/m8.js)
- `m9.js` — Aperçu HTML du modèle m9 (doit rester synchronisé avec pptx/templates/m9.js)

### `js/photo/` — Éditeur de photo (recadrer / zoomer)

- `constants.js` — Constantes de l'éditeur de photo
- `crop-math.js` — Calcul pur de la zone recadrée
- `crop-render.js` — Dessine la photo finale 400×400
- `editor-modal.js` — Construit la fenêtre de recadrage (glisser, zoom, clavier)
- `editor-open.js` — Ouvre l'éditeur au clic sur une photo
- `editor-state.js` — État de la fenêtre de recadrage
- `editor-validate.js` — Valider / fermer la fenêtre de recadrage
- `editor-zoom.js` — Zoom et cadrage dans la fenêtre de recadrage
- `photo-file.js` — Lit un fichier image, garde une copie réduite

### `js/ui/` — Interface : onglets, thème, zoom, barre de modèles, messages

- `dialogs.js` — Messages à l'écran (remplacent les alert/confirm du navigateur) :
- `mobile-views.js` — Mobile : bascule Formulaire / Aperçu
- `preview-click.js` — Clic sur un texte de l'aperçu = on saute au champ du formulaire correspondant
- `tabs.js` — Onglets Remplir / Personnalisation
- `template-bar.js` — Barre de choix du modèle + zoom
- `theme.js` — Mode jour / nuit
- `zoom.js` — Zoom de l'aperçu (manuel + cadrage automatique sur petits écrans)

### `js/ui/form/` — Le formulaire (onglets « Remplir » et « Personnalisation »)

- `build-form.js` — Construit tout le formulaire (onglets Remplir + Personnalisation)
- `exp-list.js` — Cartes « Mes expériences » (ajout, déplacement, suppression)
- `form-perso.js` — Onglet « Personnalisation » (HTML)
- `form-remplir.js` — Onglet « Remplir mon CV » (HTML)
- `formation-list.js` — Cartes « Mes formations »
- `photo-holder.js` — Vignette de la photo dans le formulaire + envoi d'un fichier photo
- `wire-form.js` — Branche les champs du formulaire sur les données
- `wire-perso.js` — Branche les réglages de personnalisation

### `js/export/` — Boutons d'export, enregistrer/ouvrir un fichier, effacer

- `btn-pdf.js` — Bouton PDF
- `btn-pptx.js` — Bouton PowerPoint
- `btn-print.js` — Bouton Imprimer
- `btn-reset.js` — Bouton Effacer : efface tout, mais propose « Annuler » pendant 9 secondes
- `confirm-export.js` — Fenêtre « Il manque des infos » avant export
- `export-mode.js` — Mode export : pas de faux exemples de contact dans le PDF/impression
- `load-json.js` — Bouton Charger (fichier .json)
- `missing-fields.js` — Liste des champs vides avant export
- `save-json.js` — Bouton Sauvegarder (fichier .json)
- `too-long.js` — Détecte un CV trop long pour une page

### `js/bridge/` — Pont pour la version web (remplace Electron)

- `web-bridge.js` — 

### `css/` — Styles de l'interface et de l'aperçu

- `base.css` — Base : variables de couleurs, thème sombre, barre du haut, formulaire, boutons, onglets, zoom
- `contrast.css` — Contrastes des boutons et textes (WCAG AA)
- `photo-editor.css` — Fenêtre de recadrage de la photo + boîtes de dialogue
- `preview-base.css` — Aperçu du CV : base commune à tous les modèles (feuille A4, curseurs de taille, colonnes)
- `print.css` — Impression / PDF : seule la feuille A4 est imprimée
- `responsive.css` — Tablette et mobile
- `toasts.css` — Messages à l'écran (succès, erreur, « Annuler »)

### `css/templates/` — Un fichier de style par modèle

- `m1.css` — Aperçu du modèle m1 (doit rester synchronisé avec js/preview/templates/m1.js et js/pptx/templates/m1.js)
- `m10.css` — Aperçu du modèle m10 (doit rester synchronisé avec js/preview/templates/m10.js et js/pptx/templates/m10.js)
- `m2.css` — Aperçu du modèle m2 (doit rester synchronisé avec js/preview/templates/m2.js et js/pptx/templates/m2.js)
- `m4.css` — Aperçu du modèle m4 (doit rester synchronisé avec js/preview/templates/m4.js et js/pptx/templates/m4.js)
- `m5.css` — Aperçu du modèle m5 (doit rester synchronisé avec js/preview/templates/m5.js et js/pptx/templates/m5.js)
- `m6.css` — Aperçu du modèle m6 (doit rester synchronisé avec js/preview/templates/m6.js et js/pptx/templates/m6.js)
- `m7.css` — Aperçu du modèle m7 (doit rester synchronisé avec js/preview/templates/m7.js et js/pptx/templates/m7.js)
- `m8.css` — Aperçu du modèle m8 (doit rester synchronisé avec js/preview/templates/m8.js et js/pptx/templates/m8.js)
- `m9.css` — Aperçu du modèle m9 (doit rester synchronisé avec js/preview/templates/m9.js et js/pptx/templates/m9.js)
