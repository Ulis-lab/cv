/* export/save-json.js — Bouton Sauvegarder (fichier .json) */

document.getElementById("btn-save").onclick=()=>{
  const blob=new Blob([JSON.stringify({version:1,template:currentTemplate,data},null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=nomFichier()+".json";a.click();
  markSauve(); flash("CV sauvegardé ✓");
};
