/* data/default-data.js — Valeurs par défaut d'un CV vide + textes d'exemple affichés quand un champ est vide */

/* ============================================================
   DONNEES & VALEURS — config, etat, helpers de valeur
   (chargé en 1er : aucune dépendance, aucun accès DOM)
   ============================================================ */
// Exemples affichés en gris (placeholders). Ils disparaissent quand on écrit
// et reviennent si le champ est laissé vide.
const exemples = {
  prenom:"Prénom", nom:"Nom", metier:"Métier ou Formation visée",
  tel:"06 12 34 56 78", email:"prenom.nom@email.com", ville:"Ville, Code postal",
  permis:"Permis B",
  profil:"Je suis à la recherche d'un stage ou d'une alternance pour découvrir le monde professionnel. Sérieux(se) et motivé(e), j'aime apprendre et travailler en équipe.",
  exp:{poste:"Stage d'observation",entreprise:"Magasin ou Entreprise, Ville",dates:"Déc 2025",taches:"Découverte des métiers\nObservation du travail en équipe"},
  form:{diplome:"Brevet des collèges / Scolarité",etablissement:"Collège ou Lycée, Ville",dates:"2023 - 2026",details:"Classe d'ULIS Lycée"},
  competences:"Ponctualité\nÉcoute des consignes\nTravail d'équipe",
  langues:"Français (maternelle)",
  interets:"Activités sportives\nJeux vidéo\nCinéma"
};

// Données réelles : VIDES au départ (les exemples ne servent que de placeholder)
const defaultData = {
  prenom:"", nom:"", metier:"", photo:"", photoOrig:"", photoCrop:null,
  tel:"", email:"", ville:"",
  naissance:"", permis:"",
  profil:"",
  experiences:[{poste:"",entreprise:"",dates:"",taches:""}],
  formations:[{diplome:"",etablissement:"",dates:"",details:""}],
  competences:[],
  langues:[],
  interets:[],
  scaleName:100, scaleTitle:100, scaleBody:100,
  couleur:"", police:"", formePhoto:""
};
