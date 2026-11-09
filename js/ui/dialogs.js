/* ui/dialogs.js — Messages à l'écran (remplacent les alert/confirm du navigateur) :
   flash(msg)                  → petit message vert « c'est fait »
   alerter(msg)                → message rouge d'erreur (reste 8 s, fermable)
   toastAnnuler(msg, bouton, fn) → message avec un bouton (ex. « Annuler » après Effacer) */

function _zoneToasts(){
  let z=document.getElementById("toasts");
  if(!z){ z=document.createElement("div"); z.id="toasts"; z.className="toasts"; document.body.appendChild(z); }
  return z;
}

// crée un toast ; renvoie une fonction pour le fermer
function _toast(msg, type, duree, actionLib, actionFn){
  const t=document.createElement("div");
  t.className="toast "+type;
  t.setAttribute("role", type==="err" ? "alert" : "status");
  const m=document.createElement("span"); m.className="toast-msg"; m.textContent=msg; t.appendChild(m);
  const fermer=()=>{ clearTimeout(tm); if(t.parentNode) t.remove(); };
  if(actionLib){
    const b=document.createElement("button"); b.type="button"; b.className="toast-btn"; b.textContent=actionLib;
    b.onclick=()=>{ fermer(); actionFn(); }; t.appendChild(b);
  }
  if(type==="err"){
    const x=document.createElement("button"); x.type="button"; x.className="toast-x"; x.setAttribute("aria-label","Fermer le message"); x.textContent="×";
    x.onclick=fermer; t.appendChild(x);
  }
  _zoneToasts().appendChild(t);
  const tm=setTimeout(fermer,duree);
  return fermer;
}

function flash(msg){ _toast(msg,"ok",2400); }

function alerter(msg){ _toast(msg,"err",8000); }

function toastAnnuler(msg, libelle, fn){ return _toast(msg,"ok",9000,libelle,fn); }
