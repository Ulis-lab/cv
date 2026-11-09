/* app.js — Démarrage de l'appli (chargé en dernier : tous les autres fichiers sont déjà là) */

// thème : restaurer le dernier choix (clair / sombre)
try { if (localStorage.getItem("cv-theme") === "dark") document.body.setAttribute("data-theme", "dark"); } catch (e) {}

// modèle : restaurer le dernier modèle choisi
try { const m = localStorage.getItem("cv-modele"); if (modeleValide(m)) currentTemplate = m; } catch (e) {}

zoomAuto();
buildForm();
buildTemplateBar();
render();
cablerEditeurPhoto(); // clic sur la photo de l'aperçu = ouvre l'éditeur
proposerReprise();    // un CV gardé automatiquement ? on propose de le reprendre
