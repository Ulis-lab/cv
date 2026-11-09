# 🎓 Créateur de CV — Guide d'installation (pour faire le .exe)

Salut ! Ce dossier contient **tout le projet** de ton application Créateur de CV.
Il ne reste qu'à le transformer en `.exe`. Suis les étapes dans l'ordre, c'est expliqué simplement.

⏱️ Compte environ 20-30 minutes la première fois (surtout du téléchargement).

---

## ÉTAPE 1 — Installer Node.js (à faire une seule fois)

Node.js est l'outil qui va construire ton application.

1. Va sur **https://nodejs.org**
2. Clique sur le gros bouton **« LTS »** (version recommandée)
3. Lance le fichier téléchargé et installe (clique « Suivant » partout, laisse les options par défaut)
4. **Redémarre ton PC** après l'installation (important)

### Vérifier que c'est bon
1. Appuie sur les touches **Windows + R**
2. Tape `cmd` et appuie sur Entrée → une fenêtre noire s'ouvre
3. Tape exactement : `node --version` puis Entrée
4. Si ça affiche quelque chose comme `v20.xx.x` → c'est bon ✅
   Si ça dit « commande introuvable » → Node n'est pas bien installé, recommence l'étape 1.

---

## ÉTAPE 2 — Préparer le dossier du projet

1. **Décompresse** ce dossier ZIP quelque part de simple, par exemple sur ton **Bureau**.
   Tu dois obtenir un dossier nommé `createur-cv-ulis` (ou similaire) qui contient
   un fichier `package.json`, des dossiers `electron`, `js`, `css`, etc.

2. **Note bien l'emplacement** de ce dossier. Par exemple :
   `C:\Users\TonNom\Desktop\createur-cv-ulis`

---

## ÉTAPE 3 — Ouvrir l'invite de commande DANS le dossier

C'est l'étape qui peut sembler bizarre, mais c'est simple :

1. Ouvre le dossier `createur-cv-ulis` dans l'explorateur de fichiers Windows
2. Clique dans la **barre d'adresse** en haut (là où c'est écrit le chemin du dossier)
3. Efface tout, tape `cmd` et appuie sur **Entrée**
4. → Une fenêtre noire s'ouvre, déjà positionnée dans ton dossier ✅

> Astuce : tu dois voir le chemin de ton dossier au début de la ligne, par ex.
> `C:\Users\TonNom\Desktop\createur-cv-ulis>`

---

## ÉTAPE 4 — Installer les composants (à faire une seule fois)

Dans la fenêtre noire, tape exactement cette commande puis Entrée :

```
npm install
```

⏳ Ça télécharge ce qu'il faut (1 à 3 minutes selon ta connexion). Des lignes vont défiler,
c'est normal. Attends que ça revienne à la ligne `...createur-cv-ulis>`.

> S'il y a des messages jaunes (warnings), ce n'est PAS grave.
> S'il y a des messages rouges (errors) qui bloquent, note-les et envoie-les moi.

---

## ÉTAPE 5 — Tester l'application AVANT de faire le .exe

Pour vérifier que tout marche, tape :

```
npm start
```

→ L'application devrait s'ouvrir dans une fenêtre. Teste-la :
- remplis le formulaire
- change de modèle
- ajoute une photo
- clique sur « PowerPoint (.pptx) » et « PDF » pour voir si les fichiers s'enregistrent

Pour fermer, ferme simplement la fenêtre de l'app.

> Si l'app s'ouvre et marche → 🎉 le plus dur est fait, passe à l'étape 6 !
> Si ça plante → note le message d'erreur dans la fenêtre noire et envoie-le moi.

---

## ÉTAPE 6 — Créer le .exe portable (le fichier final à distribuer)

Tape :

```
npm run build
```

⏳ Ça prend 2 à 5 minutes. À la fin, un nouveau dossier **`dist`** apparaît dans ton projet.

Dedans, tu trouveras :
- **`CreateurCV-Beta0.5-Portable.exe`** → c'est **ton application portable** ! 🎉

### 💡 C'est une version PORTABLE — voici ce que ça veut dire :
- **Rien ne s'installe** sur le PC. C'est un seul fichier .exe autonome.
- Tu peux le mettre sur une **clé USB** et le lancer depuis n'importe quel PC Windows.
- **Pas besoin de droits administrateur** → pratique pour les PC du lycée.
- Pour l'utiliser : il suffit de **double-cliquer dessus**, l'application s'ouvre directement.
- Pour le donner à quelqu'un : envoie simplement ce fichier .exe (par clé USB, mail, etc.).

> Note : au premier lancement, l'app peut mettre quelques secondes à démarrer (elle se décompresse en mémoire). C'est normal.

---

## ❓ Problèmes fréquents

**« npm n'est pas reconnu »** → Node.js n'est pas installé ou le PC n'a pas redémarré. Refais l'étape 1.

**L'antivirus bloque le .exe** → C'est un faux positif courant pour les .exe « faits maison »
(non signés numériquement). Sur les PC du lycée ça peut poser souci ; teste d'abord sur ton PC perso.
Tu peux ajouter une exception dans l'antivirus, ou me demander des pistes.

**L'app s'ouvre toute blanche** → note ce qui se passe et envoie-moi une capture, on debug ensemble.

**Une erreur rouge pendant `npm install` ou `npm run build`** → copie-colle le texte de l'erreur
et envoie-le moi, je te dirai quoi faire.

---

## 📁 Ce que contient le projet (pour info, tu n'as pas à y toucher)

- `package.json` → la « recette » de l'application
- `electron/main.js` → le programme qui ouvre la fenêtre et gère les enregistrements
- `electron/preload.js` → le pont sécurisé entre l'interface et l'enregistrement des fichiers
- `index.html` → la page (formulaire + aperçu)
- `css/` → les styles ; `js/` → le code, rangé en petits fichiers (voir `ARCHITECTURE.md`)
- `vendor/pptxgen.bundle.js` → la librairie qui fabrique les PowerPoint

Bonne compilation ! 💪
