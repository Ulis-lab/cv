/* pptx/compaction.js — Compactage automatique : resserre les espaces (puis le texte) quand le CV est chargé, pour qu'il tienne sur une page */

function calculerCompactage(d, templateId, fBody, PROFIL, pas) {
  const nExp = (d.experiences && d.experiences.length) ? d.experiences.length : 1;
  const nForm = (d.formations && d.formations.length) ? d.formations.length : 1;
  let nbTaches = 0;
  (d.experiences && d.experiences.length ? d.experiences : [{ taches: "x\nx" }]).forEach(e => { nbTaches += Math.max(1, lignes(e.taches).length); });
  let nbDetails = 0;
  (d.formations && d.formations.length ? d.formations : [{ details: "x" }]).forEach(f => { if (f.details) nbDetails++; });

  // hauteur fixe (en-tête + profil + titres de sections + listes comp/langues/intérêts)
  // ces éléments ne sont PAS compactés. On réserve large pour être sûr que ça rentre.
  // lignes supplémentaires dues aux puces longues (texte qui passe à la ligne) : espace NON compressible
  const MW_EST = { m1: 4.57, m6: 4.47, m7: 4.47, m10: 4.47, m5: 6.47 }[templateId] || 6.87;
  const policeEst = d.police || "Arial";
  const ptEst = 10.5 * fBody;
  const largEst = MW_EST - 0.1 - 0.2 - 0.375;
  let lignesPlus = 0;
  (d.experiences || []).forEach(e => { lignes(e.taches).forEach(x => { lignesPlus += nbLignes(x, largEst, ptEst, policeEst) - 1; }); });
  (d.formations || []).forEach(f => { if (f.details) lignesPlus += nbLignes(f.details, largEst, ptEst, policeEst) - 1; });
  const lignesProfil = nbLignes(PROFIL, MW_EST, 10.5 * fBody, policeEst);
  const hauteurFixe = 6.6 + lignesPlus * LH(ptEst) + Math.max(0, lignesProfil - 3) * LH(ptEst);
  // hauteur "compactable" : expériences (0.65"/exp + 0.24"/tâche) + formations (0.65"/form + 0.3"/détail)
  const hExp = nExp * 0.65 + nbTaches * 0.24;
  const hForm = nForm * 0.65 + nbDetails * 0.30;
  const hGaps = (nExp + nForm) * 0.28; // espaces inter-blocs
  const hCompactable = hExp + hForm + hGaps;
  // place disponible pour la partie compactable
  const dispo = 11.69 - hauteurFixe - 0.3; // marge basse de sécurité
  let cf = 1;
  if (hCompactable > dispo && hCompactable > 0) {
    cf = Math.max(0.25, (dispo / hCompactable) * 0.9);
  }
  // si vraiment très chargé, on réduit AUSSI la taille du corps de texte
  let autoBody = 1;
  if (cf < 0.75) autoBody = Math.max(0.78, 0.72 + (cf - 0.25) * 0.6);
  if (pas > 0) { cf = cf * Math.pow(0.9, pas); autoBody = Math.max(0.66, autoBody * Math.pow(0.96, pas)); } // resserrage progressif si ça déborde

  return { cf, autoBody };
}
