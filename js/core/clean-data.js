/* core/clean-data.js — Reconstruit un CV propre à partir d'un fichier (liste blanche de champs, types et tailles vérifiés) */

// reconstruit un objet "data" propre à partir d'un fichier : liste blanche de champs, types et tailles vérifiés
function nettoyerData(o){
  const d=JSON.parse(JSON.stringify(defaultData));
  if(!o || typeof o!=="object") return d;
  const txt=(x,max)=>typeof x==="string" ? x.slice(0,max) : "";
  ["prenom","nom","metier","tel","email","ville","naissance","permis"].forEach(k=>{ d[k]=txt(o[k],200); });
  d.profil=txt(o.profil,3000);
  d.photo=imgSure(o.photo);
  d.photoOrig=d.photo ? imgSure(o.photoOrig) : "";
  const c=o.photoCrop;
  d.photoCrop=(d.photoOrig && c && typeof c==="object") ? {z:nombreSur(c.z,1,4,1),cx:nombreSur(c.cx,0,1,0.5),cy:nombreSur(c.cy,0,1,0.5)} : null;
  const tab=(a,max)=>Array.isArray(a)?a.slice(0,max):[];
  const exps=tab(o.experiences,12).filter(e=>e&&typeof e==="object").map(e=>({poste:txt(e.poste,200),entreprise:txt(e.entreprise,200),dates:txt(e.dates,100),taches:txt(e.taches,3000)}));
  if(exps.length) d.experiences=exps;
  const fos=tab(o.formations,12).filter(f=>f&&typeof f==="object").map(f=>({diplome:txt(f.diplome,200),etablissement:txt(f.etablissement,200),dates:txt(f.dates,100),details:txt(f.details,500)}));
  if(fos.length) d.formations=fos;
  ["competences","langues","interets"].forEach(k=>{ d[k]=tab(o[k],30).filter(x=>typeof x==="string").map(x=>x.slice(0,200)); });
  d.scaleName=nombreSur(o.scaleName,50,150,100); d.scaleTitle=nombreSur(o.scaleTitle,50,150,100); d.scaleBody=nombreSur(o.scaleBody,70,140,100);
  d.couleur=couleurSure(o.couleur);
  d.police=(typeof POLICES!=="undefined" && POLICES.some(p=>p.id===o.police)) ? o.police : "";
  d.formePhoto=(o.formePhoto==="rond"||o.formePhoto==="carre") ? o.formePhoto : "";
  return d;
}
