/* ui/zoom.js — Zoom de l'aperçu (manuel + cadrage automatique sur petits écrans) */

// cadre l'aperçu sur la largeur de l'écran (mobile / tablette) ; sur grand écran on garde le zoom choisi
function zoomAuto(){
  if(window.innerWidth > 900) return false;
  const z = Math.floor((window.innerWidth - 20) / 794 * 100);
  zoom = Math.max(30, Math.min(100, z)); return true;
}

function applyZoom(){
  const w=document.getElementById("sheet-wrap"), k=zoom/100;
  w.style.transform=`scale(${k})`;
  // la feuille réduite garde sa taille d'origine dans la mise en page : on retire l'espace vide en dessous
  w.style.marginBottom=(-(w.offsetHeight*(1-k)))+"px";
  w.style.marginRight=w.style.marginLeft="";
}

// zoom qui fait tenir la feuille A4 entière dans la zone d'aperçu (bouton « Ajuster »)
function zoomPourFenetre(){
  const panel=document.querySelector(".preview-panel"), bar=document.getElementById("template-bar");
  const larg=panel.clientWidth-48;
  const haut=window.innerHeight-(bar?bar.offsetHeight:0)-90;
  const z=Math.floor(Math.min(larg/794, haut/1123)*100/5)*5;   // 794 x 1123 px = A4 à 96 dpi
  return Math.max(30, Math.min(120, z));
}
