# Créateur de CV — version web (Beta 0.4.0)

Un outil simple pour aider les élèves à faire leur CV : on remplit un formulaire, on choisit un modèle, on personnalise (couleur, police, forme et cadrage de la photo), puis on enregistre.

**Rien à installer** : ça marche directement dans Chrome ou Edge.

## Utilisation
- **Remplir mon CV** : le formulaire à gauche, l'aperçu à droite. Les textes grisés en italique sont des **exemples** (champ vide) ; clique sur un texte de l'aperçu pour aller directement au bon champ.
- **Photo** : clique sur la photo du CV pour la déplacer et zoomer.
- **Enregistrer un fichier / Ouvrir un fichier** : garde le CV dans un petit fichier `.json` pour le reprendre plus tard ou sur un autre ordinateur.
- **PowerPoint (.pptx)** : télécharge le CV en PowerPoint (toujours sur une seule page).
- **PDF** : ouvre l'impression, choisir « Enregistrer au format PDF ».
- **Imprimer** : impression directe.
- **Effacer tout** : vide le CV ; un bouton « Annuler » apparaît quelques secondes.

## Vie privée
Tout se passe dans le navigateur de l'élève. Aucune information (nom, photo, etc.) n'est envoyée sur internet ni stockée ici.

**Sauvegarde automatique** : le CV en cours est gardé dans le navigateur de l'ordinateur utilisé (pas sur internet) — l'indicateur « ✓ Enregistré automatiquement » le confirme. Au lancement suivant, l'appli propose de le reprendre ou de repartir de zéro. Sur un ordinateur partagé, cliquer sur « Repartir de zéro » ou « Effacer tout » avant de partir.

## Pour les curieux
Le même code peut aussi devenir une application Windows portable (Electron 45, testée au lancement) ; cette version .exe est **en pause** : la version web suffit pour l'instant. Seul `js/bridge/web-bridge.js` change : il remplace l'enregistrement par des téléchargements et l'impression du navigateur. Le code est rangé en petits fichiers : voir [ARCHITECTURE.md](ARCHITECTURE.md).
