/* export/export-mode.js — Mode export : pas de faux exemples de contact dans le PDF/impression */

// PDF / impression : on ré-affiche l'aperçu SANS faux exemples de contact, puis on remet comme avant
async function avecModeExport(fn){
  modeExport=true; render();
  const retour=()=>{ if(modeExport){ modeExport=false; render(); } };
  window.addEventListener("afterprint",retour,{once:true});
  try{ return await fn(); }
  finally{ retour(); }
}
