/* preview/photo-box.js — Photo (ou cadre « PHOTO ») dans l'aperçu */

/* ---------- APERÇUS (fidèles aux pptx) ---------- */
function photoBox(cls){ const ps=imgSure(data.photo); return ps?`<img class="cv-photo ${cls}" src="${ps}" alt="Photo du CV" title="Clique pour recadrer la photo">`:`<div class="ph ${cls}" title="Clique pour ajouter une photo">PHOTO</div>`; }
