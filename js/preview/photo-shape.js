/* preview/photo-shape.js — Forme de la photo (rond / carré adouci) */

// forme effective de la photo : override perso sinon signature du modèle (m2 = carré adouci, sinon rond)
function formePhotoEffective(){
  return (data.formePhoto==="rond"||data.formePhoto==="carre") ? data.formePhoto : (currentTemplate==="m2"?"carre":"rond");
}

// applique la forme photo à l'aperçu (surcharge le border-radius du modèle)
function appliquerFormePhoto(){
  let st=document.getElementById("cv-forme-style");
  if(!st){ st=document.createElement("style"); st.id="cv-forme-style"; document.head.appendChild(st); }
  const radius = formePhotoEffective()==="carre" ? "14%" : "50%";
  st.textContent=`#cv-sheet .cv-photo, #cv-sheet .ph { border-radius:${radius} !important; }`;
}
