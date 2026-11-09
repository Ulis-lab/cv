/* export/missing-fields.js — Liste des champs vides avant export */

/* ============================================================
   BOOTSTRAP — câblage des boutons, thème, onglets, init
   (chargé en DERNIER : exécution immédiate, accès DOM)
   ============================================================ */
/* ===== AVERTISSEMENT AVANT EXPORT =====
   Liste ce qui manque. Les contacts/métier vides ne seront PAS imprimés ; le reste affichera un texte d'exemple. */
function champsManquants(){
  const vide=x=>!x||!String(x).trim();
  const sans=[], exemple=[];
  if(vide(data.tel)) sans.push("Téléphone");
  if(vide(data.email)) sans.push("E-mail");
  if(vide(data.ville)) sans.push("Ville");
  if(vide(data.metier)) sans.push("Métier ou formation visée");
  if(vide(data.prenom)) exemple.push("Prénom");
  if(vide(data.nom)) exemple.push("Nom");
  if(vide(data.profil)) exemple.push("Profil");
  if(!data.competences.some(x=>String(x).trim())) exemple.push("Compétences");
  if(!data.langues.some(x=>String(x).trim())) exemple.push("Langues");
  if(!data.interets.some(x=>String(x).trim())) exemple.push("Centres d'intérêt");
  if(!data.experiences.some(e=>e.poste||e.entreprise||e.dates||e.taches)) exemple.push("Expériences");
  if(!data.formations.some(f=>f.diplome||f.etablissement||f.dates||f.details)) exemple.push("Formations");
  return {sans,exemple};
}
