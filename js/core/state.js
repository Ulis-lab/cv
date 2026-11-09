/* core/state.js — État global de l'appli (le CV en cours, le modèle choisi, le zoom, les drapeaux) */

let data = JSON.parse(JSON.stringify(defaultData));

let currentTemplate = "m1";

let zoom = 65;

// mode export : pendant PDF/impression, les infos de contact vides ne montrent PAS d'exemple
let modeExport=false;

const SANS_EXEMPLE_EXPORT=["metier","tel","email","ville"];

let pageTropLongue=false; // vrai si le CV dépasse une page même après resserrage

// ===== SUIVI "MODIFIÉ NON SAUVEGARDÉ" =====
let modifie=false;
