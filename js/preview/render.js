/* preview/render.js — Dessine l'aperçu, resserre pour tenir sur UNE page */

function render(){
  const sheet=document.getElementById("cv-sheet");
  sheet.className="cv-sheet "+currentTemplate;
  sheet.innerHTML=(R[currentTemplate]||R.m1)();
  sheet.style.setProperty("--sc-name",(data.scaleName||100)/100);
  sheet.style.setProperty("--sc-title",(data.scaleTitle||100)/100);
  sheet.style.setProperty("--sc-body",(data.scaleBody||100)/100);
  // POLICE personnalisée (si choisie)
  sheet.style.fontFamily = data.police ? `"${data.police}", Arial, sans-serif` : "";
  // COULEUR personnalisée (si choisie) : surcharge les accents du modèle
  appliquerCouleurApercu(sheet);
  // FORME de la photo (rond / carré adouci)
  appliquerFormePhoto();
  // compactage auto identique au pptx : basé sur la hauteur estimée
  const ex=vExp(), fo=vForm();
  const nExp=ex.length, nForm=fo.length;
  let nbTaches=0; ex.forEach(e=>{nbTaches+=Math.max(1,items(e.taches||exemples.exp.taches).length);});
  let nbDetails=0; fo.forEach(f=>{if(f.details)nbDetails++;});
  const hauteurFixe=6.0;
  const hExp=nExp*0.65+nbTaches*0.24, hForm=nForm*0.65+nbDetails*0.30, hGaps=(nExp+nForm)*0.28;
  const hCompactable=hExp+hForm+hGaps;
  const dispo=11.69-hauteurFixe-0.3;
  let cf=1; if(hCompactable>dispo&&hCompactable>0) cf=Math.max(0.25,(dispo/hCompactable)*0.9);
  let autoBody=1; if(cf<0.75) autoBody=Math.max(0.78,0.72+(cf-0.25)*0.6);
  sheet.style.setProperty("--cf",cf);
  sheet.style.setProperty("--ab",autoBody);
  // UNE seule page : on mesure la vraie hauteur de la feuille (A4 = 297 mm) et on resserre tant que ça dépasse
  const hMax=297*96/25.4;
  let pas=0;
  while(sheet.scrollHeight>hMax+1 && pas<14){
    pas++;
    sheet.style.setProperty("--cf",cf*Math.pow(0.9,pas));
    sheet.style.setProperty("--ab",Math.max(0.66,autoBody*Math.pow(0.96,pas)));
  }
  pageTropLongue = sheet.scrollHeight>hMax+1;
  const al=document.getElementById("alerte-page"); if(al) al.hidden=!pageTropLongue;
  applyZoom();
}
