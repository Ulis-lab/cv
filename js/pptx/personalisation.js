/* pptx/personalisation.js — Personnalisation appliquée au PPTX : tailles de texte, couleur d'accent, police, hauteur du bloc Profil */

function creerPersonnalisation(d, templateId, fName, fTitle, fBody, autoBody) {
  // classe une taille de police par catégorie et applique le bon facteur
  function scaleFont(sz) {
    if (typeof sz !== "number") return sz;
    if (sz >= 20) return Math.round(sz * fName * 10) / 10;        // nom / prénom
    if (sz >= 12) return Math.round(sz * fTitle * 10) / 10;       // titres de sections + métier
    return Math.round(sz * fBody * autoBody * 10) / 10;           // texte courant (+ réduction auto)
  }

  // ===== PERSONNALISATION couleur + police =====
  // couleur d'accent de référence pour chaque modèle (celle qu'on remplace si l'utilisateur choisit une couleur)
  const ACCENT_REF = { m1:"33373D", m2:"C2492B", m4:"0E7C7B", m5:"C9A24B", m6:"5B2C6F", m7:"6B5B95", m8:"2E8B73", m9:"5B4BC4", m10:"C75B7A" };
  const couleurPerso = (d.couleur || "").replace("#", "").toUpperCase();
  const refAccent = (ACCENT_REF[templateId] || "").toUpperCase();
  const policePerso = d.police || "";
  function subCouleur(c) {
    if (!couleurPerso || !c) return c;
    if (String(c).toUpperCase() === refAccent) return couleurPerso;
    return c;
  }
  function subPolice(f) { return policePerso || f; }
  _ctx.sf = scaleFont; _ctx.sp = subPolice;
  // hauteur du bloc "Profil" d'après la longueur réelle du texte (pas de marge interne : margin 0)
  function hProfil(txt, w, pt, font, hBase) {
    const L = nbLignes(txt, w, scaleFont(pt), subPolice(font));
    return Math.max(hBase, L * LH(scaleFont(pt)) + 0.06);
  }

  return { scaleFont, subCouleur, subPolice, couleurPerso, refAccent, hProfil };
}
