/* core/export-data.js — Prépare les données du CV pour l'export (PPTX/PDF) */

// prépare les données pour l'export : remplit les champs vides avec les exemples
// (pour que le pptx montre la même chose que l'aperçu)
function dataPourExport(){
  const d=JSON.parse(JSON.stringify(data));
  d.prenom=v("prenom"); d.nom=v("nom"); d.profil=v("profil");
  // contact + métier : si vides, on n'imprime RIEN (pas de faux exemple sur un vrai CV)
  d.metier=(data.metier||"").trim(); d.tel=(data.tel||"").trim(); d.email=(data.email||"").trim(); d.ville=(data.ville||"").trim();
  d.photo=imgSure(data.photo);
  d.permis=(data.permis&&data.permis.trim())?data.permis:""; // optionnel
  d.competences=vListe("competences"); d.langues=vListe("langues"); d.interets=vListe("interets");
  d.experiences=vExp().map(e=>({poste:e.poste||exemples.exp.poste,entreprise:e.entreprise||exemples.exp.entreprise,dates:e.dates||exemples.exp.dates,taches:e.taches||exemples.exp.taches}));
  d.formations=vForm().map(f=>({diplome:f.diplome||exemples.form.diplome,etablissement:f.etablissement||exemples.form.etablissement,dates:f.dates||exemples.form.dates,details:f.details||""}));
  d.couleur=couleurSure(data.couleur); d.police=data.police||"";
  delete d.photoOrig; delete d.photoCrop; // inutiles pour l'export (la photo finale est déjà recadrée)
  return d;
}
