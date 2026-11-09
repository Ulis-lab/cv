/* core/autosave-restore.js — Lecture de la sauvegarde automatique + fenêtre « Reprendre ton CV ? » */

function lireAuto(){
  try{
    const o=JSON.parse(localStorage.getItem(CLE_AUTO)||"null");
    if(!o||typeof o.data!=="object"||o.data===null) return null;
    return {t:Number(o.t)||0,data:nettoyerData(o.data)}; // jamais confiance : même nettoyage qu'un fichier chargé
  }catch(_){ return null; }
}

function proposerReprise(){
  const a=lireAuto(); if(!a) return;
  const nom=((a.data.prenom||"")+" "+(a.data.nom||"")).trim();
  let quand=""; try{ if(a.t) quand=new Date(a.t).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"}); }catch(_){}
  const ov=document.createElement("div"); ov.className="pm-overlay"; ov.style.display="flex";
  ov.innerHTML='<div class="pm-box" role="dialog" aria-modal="true" aria-labelledby="rp-titre" style="width:430px">'
    +'<h3 id="rp-titre">Reprendre ton CV ?</h3>'
    +'<p style="font-size:14px;margin-bottom:8px">Un CV en cours a été gardé automatiquement sur cet ordinateur'+(nom?' : <b>'+esc(nom)+'</b>':'')+(quand?' <span style="color:var(--ui-muted)">('+esc(quand)+')</span>':'')+'.</p>'
    +'<p style="font-size:12px;color:var(--ui-muted);margin-bottom:14px">Il reste uniquement sur cet ordinateur, rien n\'est envoyé sur internet. Sur un ordinateur partagé, clique sur « Repartir de zéro » avant de partir.</p>'
    +'<div class="pm-actions" style="justify-content:flex-end"><button type="button" id="rp-non">Repartir de zéro</button><button type="button" id="rp-oui" class="primary">Reprendre mon CV</button></div></div>';
  document.body.appendChild(ov);
  const liberer=piegeFocus(ov);
  const fermer=()=>{ liberer(); ov.remove(); }; // pas de fermeture par Échap : il faut choisir (sinon la 1re frappe écraserait la sauvegarde)
  ov.querySelector("#rp-oui").onclick=()=>{ data=a.data; fermer(); buildForm(); buildTemplateBar(); render(); markSauve(); flash("CV repris ✓"); };
  ov.querySelector("#rp-non").onclick=()=>{ effacerAuto(); fermer(); };
  ov.querySelector("#rp-oui").focus();
}
