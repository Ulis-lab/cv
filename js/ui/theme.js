/* ui/theme.js — Mode jour / nuit (bouton rond dans la barre du haut) */

const ICONE_LUNE='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const ICONE_SOLEIL='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

function majBoutonTheme(){
  const bt=document.getElementById("btn-theme"); if(!bt) return;
  const dark=document.body.getAttribute("data-theme")==="dark";
  bt.innerHTML=dark?ICONE_SOLEIL:ICONE_LUNE;
  bt.setAttribute("aria-pressed",dark?"true":"false");
  bt.setAttribute("aria-label",dark?"Revenir au mode jour":"Activer le mode nuit");
  bt.title=dark?"Mode jour":"Mode nuit";
}

// ===== THÈME jour/nuit (mémorisé) =====
function appliquerTheme(dark){
  const b=document.body;
  if(dark) b.setAttribute("data-theme","dark"); else b.removeAttribute("data-theme");
  majBoutonTheme();
}

document.getElementById("btn-theme").onclick=()=>{
  const dark=document.body.getAttribute("data-theme")!=="dark";
  appliquerTheme(dark);
  try{localStorage.setItem("cv-theme",dark?"dark":"light");}catch(e){}
};
majBoutonTheme();
