/* ui/template-bar.js — Barre de choix du modèle + zoom */

/* ---------- SÉLECTEUR + ZOOM ---------- */
function buildTemplateBar(){
  const bar=document.getElementById("template-bar");
  bar.innerHTML=templates.map(t=>`<button class="tpl-chip ${t.id===currentTemplate?"active":""}" data-tpl="${t.id}">${t.name}</button>`).join("")
    +`<span class="zoom-ctl" role="group" aria-label="Zoom de l'aperçu"><button id="z-" aria-label="Dézoomer l'aperçu">-</button><b id="zv" aria-live="polite">${zoom}%</b><button id="z+" aria-label="Zoomer l'aperçu">+</button><button id="z-fit" title="Adapte la taille de l'aperçu à ta fenêtre">Ajuster</button></span>`;
  bar.querySelectorAll("[data-tpl]").forEach(b=>b.onclick=()=>{currentTemplate=b.dataset.tpl;try{localStorage.setItem("cv-modele",currentTemplate);}catch(e){}buildTemplateBar();render();});
  document.getElementById("z-").onclick=()=>{zoom=Math.max(30,zoom-10);applyZoom();buildTemplateBar();};
  document.getElementById("z-fit").onclick=()=>{zoom=zoomPourFenetre();applyZoom();buildTemplateBar();};
  document.getElementById("z+").onclick=()=>{zoom=Math.min(120,zoom+10);applyZoom();buildTemplateBar();};
}
