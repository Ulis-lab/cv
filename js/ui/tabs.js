/* ui/tabs.js — Onglets Remplir / Personnalisation */

// ===== BASCULEMENT DES ONGLETS =====
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  document.querySelectorAll(".tab").forEach(x=>x.setAttribute("aria-selected",x===t?"true":"false"));
  const cible=t.dataset.tab;
  document.getElementById("tab-remplir").style.display = cible==="remplir"?"":"none";
  document.getElementById("tab-perso").style.display = cible==="perso"?"":"none";
});
