/* export/load-json.js — Bouton Charger (fichier .json) */

document.getElementById("btn-load").onclick=()=>document.getElementById("load-input").click();

document.getElementById("load-input").onchange=e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(f.size>12*1024*1024){alerter("Ce fichier est trop gros pour être un CV (12 Mo maximum).");return;}
  const r=new FileReader();
  r.onload=ev=>{try{
    const o=JSON.parse(ev.target.result);
    if(!o||typeof o.data!=="object"||o.data===null)throw 0;
    // on ne fait JAMAIS confiance au fichier : liste blanche de champs, types et tailles vérifiés
    data=nettoyerData(o.data);
    if(modeleValide(o.template))currentTemplate=o.template;
    buildForm();buildTemplateBar();render();markSauve();planifierAuto();
  }catch(_){alerter("Fichier CV invalide.");}};
  r.readAsText(f);
};
