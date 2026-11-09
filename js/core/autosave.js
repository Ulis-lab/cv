/* core/autosave.js — Sauvegarde automatique du CV dans ce navigateur (localStorage) */

/* ===== SAUVEGARDE AUTOMATIQUE (dans CE navigateur / CET ordinateur uniquement, rien n'est envoyé) =====
   - enregistre le CV ~1 s après chaque modification
   - au démarrage suivant : fenêtre « Reprendre mon CV ? » (jamais de restauration silencieuse) */
const CLE_AUTO="cv-auto";

let _auto=0,_autoPrevenu=false;

// affiche l'état dans la barre du haut : "ok" = enregistré, "err" = impossible, "" = rien
function majEtatAuto(etat){
  const e=document.getElementById("etat-auto"); if(!e) return;
  e.className="etat-auto"+(etat?" "+etat:"");
  e.textContent = etat==="ok" ? "✓ Enregistré automatiquement" : etat==="err" ? "⚠ Sauvegarde auto impossible" : "";
}

function planifierAuto(){ clearTimeout(_auto); _auto=setTimeout(sauverAuto,800); }

function effacerAuto(){ clearTimeout(_auto); try{localStorage.removeItem(CLE_AUTO);}catch(_){} }

function sauverAuto(){
  clearTimeout(_auto); _auto=0;
  try{
    if(JSON.stringify(data)===JSON.stringify(defaultData)){ localStorage.removeItem(CLE_AUTO); majEtatAuto(""); return; } // CV vide : rien à garder
    localStorage.setItem(CLE_AUTO,JSON.stringify({v:1,t:Date.now(),data}));
    majEtatAuto("ok");
    // version web : CV déjà gardé → plus besoin de l'alerte « quitter la page ? » (elle revient si la sauvegarde auto échoue)
    if(window.cvApp&&window.cvApp.web&&window.cvApp.setModifie) window.cvApp.setModifie(false);
  }catch(e){
    majEtatAuto("err");
    if(!_autoPrevenu){ _autoPrevenu=true; alerter("Sauvegarde automatique impossible ici : pense à utiliser « Enregistrer un fichier »."); }
  }
}

// à la fermeture / changement d'onglet : on n'attend pas le délai
window.addEventListener("pagehide",()=>{ if(_auto) sauverAuto(); });

document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden"&&_auto) sauverAuto(); });
