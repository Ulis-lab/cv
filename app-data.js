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
let data = JSON.parse(JSON.stringify(defaultData));
let currentTemplate = "m1";
let zoom = 65;

const templates = [
  {id:"m1",name:"1. Gris"},{id:"m2",name:"2. Corail"},
  {id:"m4",name:"3. Teal moderne"},{id:"m5",name:"4. Sombre doré"},{id:"m6",name:"5. Violet"},
  {id:"m7",name:"6. Lavande"},{id:"m8",name:"7. Menthe"},{id:"m9",name:"8. Dégradé bleu"},
  {id:"m10",name:"9. Dégradé rosé"}
];

// icônes SVG inline (téléphone, email, ville) pour l'aperçu, couleur via currentColor
const ICO = {
  tel:'<svg class="ico" viewBox="0 0 512 512" fill="currentColor"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>',
  mail:'<svg class="ico" viewBox="0 0 512 512" fill="currentColor"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>',
  ville:'<svg class="ico" viewBox="0 0 384 512" fill="currentColor"><path d="M168.3 499.2C116.1 435 0 279.4 0 192 0 86 86 0 192 0s192 86 192 192c0 87.4-116.1 243-168.3 307.2-12.3 15.3-35.1 15.3-47.4 0zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/></svg>',
  permis:'<svg class="ico" viewBox="0 0 640 512" fill="currentColor"><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM160 464a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm320 0a48 48 0 1 1 0-96 48 48 0 1 1 0 96z"/></svg>'
};

function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function nl2br(t){return esc(t).replace(/\n/g,"<br>");}
function items(t){return (t||"").split("\n").map(x=>x.trim()).filter(Boolean);}
function liToHtml(t){const l=items(t);return l.length?"<ul>"+l.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>":"";}
// valeur réelle si remplie, sinon l'exemple (pour que le CV ne soit jamais vide)
function v(cle){ return (data[cle] && String(data[cle]).trim()) ? data[cle] : (exemples[cle]||""); }
// liste réelle si remplie, sinon liste d'exemple
function vListe(cle){ return (data[cle] && data[cle].length) ? data[cle] : items(exemples[cle]); }
// expériences réelles si au moins une remplie, sinon l'exemple
function vExp(){
  const remplies = (data.experiences||[]).filter(e=>e.poste||e.entreprise||e.dates||e.taches);
  return remplies.length ? remplies : [exemples.exp];
}
function vForm(){
  const remplies = (data.formations||[]).filter(f=>f.diplome||f.etablissement||f.dates||f.details);
  return remplies.length ? remplies : [exemples.form];
}

