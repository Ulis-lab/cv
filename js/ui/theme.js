/* ui/theme.js — Mode jour / nuit */

function majBoutonTheme(){
  const bt=document.getElementById("btn-theme2");if(!bt)return;
  const dark=document.body.getAttribute("data-theme")==="dark";
  bt.textContent=dark?"☀️ Revenir au mode jour":"🌙 Activer le mode nuit";
}

// ===== THÈME jour/nuit (mémorisé) =====
function appliquerTheme(dark){
  const b=document.body;
  if(dark) b.setAttribute("data-theme","dark"); else b.removeAttribute("data-theme");
  majBoutonTheme();
}
