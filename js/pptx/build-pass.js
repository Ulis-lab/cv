/* pptx/build-pass.js — Une passe de construction du PPTX (assemble photo, compactage, personnalisation, puis dessine le modèle) */

async function construirePASSE(PptxGenJS, d, templateId, H, pas) {
  pas = pas || 0; // nombre de resserrages supplémentaires (0 = normal) pour faire tenir le CV sur UNE page
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "A4P", width: PW, height: PH });
  pptx.layout = "A4P";

  // propriétés du fichier (visibles dans PowerPoint > Fichier > Informations)
  pptx.title = "CV " + (d.prenom || "") + " " + (d.nom || "");
  pptx.subject = "Curriculum vitae";
  pptx.author = ((d.prenom || "") + " " + (d.nom || "")).trim() || "Créateur de CV";

  // textes avec valeurs d'exemple si champ vide
  const NOM = (val(d.prenom, "Prénom") + " " + val(d.nom, "Nom")).trim();
  const METIER = (d.metier && String(d.metier).trim()) ? d.metier : "";
  const PROFIL = val(d.profil, "Quelques phrases pour te présenter : qui tu es, ce que tu recherches et ce qui te motive.");
  const COMP = liste(d, "competences", ["Compétence 1", "Compétence 2", "Compétence 3"]);
  const LANG = liste(d, "langues", ["Français — maternelle", "Anglais — niveau B1"]);
  const INT = liste(d, "interets", ["Loisir 1", "Loisir 2"]);

  // 1) photo (forme, arrondi, cadre vide)
  const { photo, photoRonde, rr, formeP } = await creerPhoto(pptx, d, H, templateId);

  const S = pptx.ShapeType;

  // 2) facteurs de taille (curseurs) — appliqués à toutes les tailles de police
  const fName = (d.scaleName || 100) / 100;
  const fTitle = (d.scaleTitle || 100) / 100;
  const fBody = (d.scaleBody || 100) / 100;

  // 3) compactage automatique (une seule page)
  const { cf, autoBody } = calculerCompactage(d, templateId, fBody, PROFIL, pas);

  // 4) personnalisation (taille, couleur, police)
  const perso = creerPersonnalisation(d, templateId, fName, fTitle, fBody, autoBody);

  // 5) interception des textes/formes de chaque diapo (mesure aussi le point le plus bas)
  const etat = { bas: 0 };
  installerInterception(pptx, perso, etat);

  // 6) dessin du modèle choisi (fichier pptx/templates/<id>.js)
  const modele = PPTX_MODELES[templateId];
  if (modele) {
    await modele(Object.assign({ pptx, d, H, S, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, photoRonde, rr, formeP, fName, fTitle, fBody }, perso));
  }

  pptx.__bas = etat.bas;
  return pptx;
}
