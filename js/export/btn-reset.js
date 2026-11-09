/* export/btn-reset.js — Bouton Effacer : efface tout, mais propose « Annuler » pendant 9 secondes */

document.getElementById("btn-reset").onclick=()=>{
  if(JSON.stringify(data)===JSON.stringify(defaultData)){ flash("Ton CV est déjà vide."); return; }
  const avant=JSON.stringify(data);
  data=JSON.parse(JSON.stringify(defaultData));
  buildForm(); render(); markSauve(); effacerAuto();
  toastAnnuler("CV effacé.","Annuler",()=>{
    data=nettoyerData(JSON.parse(avant));
    buildForm(); render(); markModifie();   // markModifie relance aussi la sauvegarde automatique
    flash("CV rétabli.");
  });
};
