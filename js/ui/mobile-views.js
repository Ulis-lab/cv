/* ui/mobile-views.js — Mobile : bascule Remplir / Aperçu / Exporter */

// ===== MOBILE : trois vues (Remplir, Aperçu, Exporter) + aperçu cadré sur la largeur de l'écran =====
function choisirVue(apercu,exporter){
  document.body.classList.toggle("vue-apercu",!!apercu);
  document.body.classList.toggle("vue-export",!!exporter);
  document.getElementById("vue-form").setAttribute("aria-pressed",(!apercu&&!exporter)?"true":"false");
  document.getElementById("vue-apercu").setAttribute("aria-pressed",apercu?"true":"false");
  document.getElementById("vue-export").setAttribute("aria-pressed",exporter?"true":"false");
  window.scrollTo(0,0);
  if(apercu) setTimeout(render,0); // l'aperçu était caché : on le recalcule (mesure de la page) maintenant qu'il est visible
}

document.getElementById("vue-form").onclick=()=>choisirVue(false);

document.getElementById("vue-apercu").onclick=()=>choisirVue(true);

document.getElementById("vue-export").onclick=()=>choisirVue(false,true);

let _rz=0;

window.addEventListener("resize",()=>{ clearTimeout(_rz); _rz=setTimeout(()=>{ if(zoomAuto()){ buildTemplateBar(); applyZoom(); } },150); });
