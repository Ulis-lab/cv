/* ui/preview-click.js — Clic sur un texte de l'aperçu = on saute au champ du formulaire correspondant */

function allerAuChamp(f){
  if(document.body.classList.contains("vue-apercu")) choisirVue(false); // mobile : revenir au formulaire
  const tab=document.querySelector('.tab[data-tab="remplir"]');
  if(tab && tab.getAttribute("aria-selected")!=="true") tab.click();
  let el=document.querySelector('#tab-remplir [data-k="'+f+'"]') || document.querySelector('#tab-remplir [data-list="'+f+'"]');
  if(!el && f==="experiences") el=document.querySelector("#exp-list input, #exp-list textarea");
  if(!el && f==="formations") el=document.querySelector("#form-list input, #form-list textarea");
  if(!el) return;
  setTimeout(()=>{
    el.scrollIntoView({block:"center",behavior:"smooth"});
    el.focus({preventScroll:true});
    el.classList.add("champ-pointe"); setTimeout(()=>el.classList.remove("champ-pointe"),1600);
  },60);
}

// l'aperçu est réécrit à chaque modification : on écoute sur le conteneur (délégation)
document.getElementById("cv-sheet").addEventListener("click",e=>{
  const t=e.target.closest("[data-f]");
  if(t) allerAuChamp(t.dataset.f);
});
