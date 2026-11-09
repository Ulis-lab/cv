/* ui/form/wire-perso.js — Branche les réglages de personnalisation */

// câblage de l'onglet Personnalisation
function wirePerso(){
  const bindSc=(id,key,vid)=>{const el=document.getElementById(id);if(!el)return;el.addEventListener("input",()=>{data[key]=+el.value;const v=document.getElementById(vid);if(v)v.textContent=el.value+"%";markModifie();render();});};
  bindSc("sc-name","scaleName","val-name");
  bindSc("sc-title","scaleTitle","val-title");
  bindSc("sc-body","scaleBody","val-body");
  // remettre les 3 curseurs à 100 %
  const scR=document.getElementById("sc-reset");
  if(scR) scR.onclick=()=>{
    [["sc-name","scaleName","val-name"],["sc-title","scaleTitle","val-title"],["sc-body","scaleBody","val-body"]].forEach(([id,key,vid])=>{
      data[key]=100; document.getElementById(id).value=100; document.getElementById(vid).textContent="100%";
    });
    markModifie(); render();
  };
  // bouton thème (déplacé ici)
  // couleur libre
  const col=document.getElementById("cv-couleur");
  if(col) col.addEventListener("input",()=>{data.couleur=col.value;markModifie();render();});
  const colR=document.getElementById("cv-couleur-reset");
  if(colR) colR.onclick=()=>{data.couleur="";if(col)col.value="#2f5aa8";markModifie();render();};
  // police
  const pol=document.getElementById("cv-police");
  if(pol) pol.addEventListener("change",()=>{data.police=pol.value;markModifie();render();});
  // forme de la photo (rond / carré adouci)
  const majFormeBtns=()=>{ const f=formePhotoEffective();
    const br=document.getElementById("forme-rond"), bc=document.getElementById("forme-carre");
    if(br) br.classList.toggle("active",f==="rond");
    if(bc) bc.classList.toggle("active",f==="carre"); };
  const fr=document.getElementById("forme-rond");
  if(fr) fr.onclick=()=>{data.formePhoto="rond";markModifie();majFormeBtns();render();};
  const fc=document.getElementById("forme-carre");
  if(fc) fc.onclick=()=>{data.formePhoto="carre";markModifie();majFormeBtns();render();};
}
