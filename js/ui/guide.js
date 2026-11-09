/* ui/guide.js — Mode « Guidé » (5 étapes) + panneau « Exporter » (aussi utilisé par l'onglet Exporter du mobile)
   Principe : AUCUN champ n'est dupliqué. Les champs du formulaire « complet » sont simplement affichés
   étape par étape (CSS), donc ce qui est tapé dans un mode est déjà dans l'autre. */

const GUIDE_ETAPES=[
  {nom:"Photo",       titre:"Ajoute ta photo",            aide:"Une photo de face, sur fond uni, avec un beau sourire. C'est facultatif : tu peux passer cette étape."},
  {nom:"Toi",         titre:"Comment tu t'appelles ?",    aide:"Ton prénom et ton nom seront en gros en haut de ton CV. Tu pourras les changer quand tu veux."},
  {nom:"Expériences", titre:"Ton parcours",               aide:"Stages, petits jobs, formations, compétences : écris ce que tu veux. Les textes en gris dans l'aperçu sont des exemples : remplace-les par les tiens."},
  {nom:"Style",       titre:"Choisis ton style",          aide:"Change le modèle, la couleur et la police autant de fois que tu veux : l'aperçu se met à jour tout de suite."},
  {nom:"Export",      titre:"Ton CV est prêt !",          aide:"Télécharge-le en PowerPoint pour le modifier, ou en PDF pour l'envoyer. Tu peux revenir à n'importe quelle étape."}
];

let guideMode="guide";   // "guide" (par défaut) ou "complet" — mémorisé sur cet appareil
let guideEtape=1;
try{ if(localStorage.getItem("cv-mode")==="complet") guideMode="complet"; }catch(e){}

function guideActif(){ return guideMode==="guide" && window.innerWidth>900; }

// range chaque bloc du formulaire « Remplir » dans son étape (appelé par buildForm à chaque reconstruction)
function guideEtiqueter(){
  const p=document.getElementById("tab-remplir"); if(!p) return;
  let e=1;
  Array.from(p.children).forEach(el=>{
    if(el.tagName==="H2"){
      const t=el.textContent;
      e = /photo/i.test(t) ? 1 : /Qui suis|contacter|Profil/i.test(t) ? 2 : 3;
    }
    el.dataset.step=String(e);
  });
}

function guideBarreEtapes(){
  return `<nav class="gs-steps" aria-label="Étapes du CV">`+GUIDE_ETAPES.map((s,i)=>{
    const n=i+1, etat=n<guideEtape?"done":n===guideEtape?"now":"";
    return (i?`<span class="gs-line ${n<=guideEtape?"done":""}" aria-hidden="true"></span>`:"")
      +`<button type="button" class="gs-st ${etat}" data-etape="${n}" ${n===guideEtape?'aria-current="step"':""}><span class="gs-dot">${n<guideEtape?"✓":n}</span><span class="gs-lab">${s.nom}</span></button>`;
  }).join("")+`</nav>`;
}

function guideRendre(){
  const s=GUIDE_ETAPES[guideEtape-1];
  const tete=document.getElementById("guide-head");
  tete.innerHTML=guideBarreEtapes()
    +`<div class="gs-eyebrow">Étape ${guideEtape} sur ${GUIDE_ETAPES.length}</div>`
    +`<h1 class="gs-titre" id="gs-titre" tabindex="-1">${esc(s.titre)}</h1><p class="gs-aide">${esc(s.aide)}</p>`;
  tete.querySelectorAll("[data-etape]").forEach(b=>b.onclick=()=>guideAller(+b.dataset.etape));
  const nav=document.getElementById("guide-nav");
  nav.innerHTML=(guideEtape>1?`<button type="button" class="gs-back" id="gs-retour">Retour</button>`:"")
    +(guideEtape<GUIDE_ETAPES.length?`<button type="button" class="gs-next" id="gs-suite">Continuer</button>`:"")
    +(guideEtape<GUIDE_ETAPES.length-1?`<button type="button" class="gs-skip" id="gs-passer">Passer cette étape</button>`:"");
  const r=document.getElementById("gs-retour"), c=document.getElementById("gs-suite"), q=document.getElementById("gs-passer");
  if(r) r.onclick=()=>guideAller(guideEtape-1);
  if(c) c.onclick=()=>guideAller(guideEtape+1);
  if(q) q.onclick=()=>guideAller(guideEtape+1);
  guideRendreModeles();
}

function guideRendreModeles(){
  const z=document.getElementById("guide-modeles"); if(!z) return;
  z.innerHTML=`<h2>Modèle de CV</h2><div class="gs-chips" role="group" aria-label="Modèle de CV">`
    +templates.map(t=>`<button type="button" class="tpl-chip ${t.id===currentTemplate?"active":""}" data-tpl="${t.id}" aria-pressed="${t.id===currentTemplate}">${esc(t.name)}</button>`).join("")+`</div>`;
  z.querySelectorAll("[data-tpl]").forEach(b=>b.onclick=()=>{
    currentTemplate=b.dataset.tpl;
    try{localStorage.setItem("cv-modele",currentTemplate);}catch(e){}
    buildTemplateBar(); render(); guideRendreModeles();
  });
}

function guideAller(n,opts){
  n=Math.max(1,Math.min(GUIDE_ETAPES.length,n));
  guideEtape=n;
  document.body.dataset.etape=String(n);
  guideRendre();
  if(opts&&opts.sansFocus) return;
  const fp=document.querySelector(".form-panel"); if(fp) fp.scrollTop=0;
  window.scrollTo(0,0);
  const h=document.getElementById("gs-titre"); if(h) h.focus({preventScroll:true});
}

function guideAjusterZoom(){
  if(!guideActif()) return;
  zoom=zoomPourFenetre(); applyZoom();
}

function guideAppliquerMode(){
  const g=guideMode==="guide";
  document.body.classList.toggle("mode-guide",g);
  document.body.dataset.etape=String(guideEtape);
  const b=document.getElementById("btn-mode");
  if(b){
    b.textContent=g?"Passer en mode complet":"Passer en mode guidé";
    b.title=g?"Affiche tout le formulaire d'un coup (pour les habitués)":"Revient au pas-à-pas en 5 étapes";
  }
  if(g) guideRendre();
  setTimeout(()=>{ guideAjusterZoom(); buildTemplateBar(); },0);
}

// ----- panneau « Exporter » : mêmes actions que les boutons du haut (qui restent la référence) -----
function guideConstruireExport(){
  const z=document.getElementById("guide-export"); if(!z) return;
  z.innerHTML=`
    <h2>Télécharger mon CV</h2>
    <div class="gx-btns">
      <button type="button" class="green gx-big" data-proxy="btn-pptx">PowerPoint (.pptx)</button>
      <button type="button" class="gx-big" data-proxy="btn-pdf">PDF</button>
      <button type="button" class="gx-big" data-proxy="btn-print">Imprimer</button>
    </div>
    <p class="gx-note">PowerPoint : tu peux encore tout modifier. PDF : prêt à envoyer par e-mail.</p>
    <h2>Garder mon CV</h2>
    <div class="gx-btns">
      <button type="button" data-proxy="btn-save">Enregistrer un fichier</button>
      <button type="button" data-proxy="btn-load">Ouvrir un fichier</button>
    </div>
    <p class="gx-note">Ton CV est aussi gardé automatiquement dans ce navigateur, sur cet appareil uniquement.</p>
    <h2>Recommencer</h2>
    <div class="gx-btns"><button type="button" class="danger" data-proxy="btn-reset">Effacer tout</button></div>`;
  z.querySelectorAll("[data-proxy]").forEach(p=>{
    const orig=document.getElementById(p.dataset.proxy);
    p.onclick=()=>orig.click();
    // le bouton d'origine affiche « Création… » pendant l'export : on recopie son texte et son état
    const sync=()=>{ p.textContent=orig.textContent; p.disabled=orig.disabled; };
    new MutationObserver(sync).observe(orig,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:["disabled"]});
  });
}

function guideInit(){
  const fp=document.querySelector(".form-panel");
  const tete=document.createElement("div"); tete.id="guide-head"; tete.className="guide-head";
  const sty=document.createElement("div"); sty.id="guide-modeles"; sty.className="guide-modeles";
  const exp=document.createElement("div"); exp.id="guide-export"; exp.className="guide-export";
  const nav=document.createElement("div"); nav.id="guide-nav"; nav.className="guide-nav";
  fp.insertBefore(tete,document.querySelector(".tabs"));
  fp.insertBefore(sty,document.getElementById("tab-perso"));
  fp.appendChild(exp); fp.appendChild(nav);
  guideConstruireExport();
  document.getElementById("btn-mode").onclick=()=>{
    guideMode=guideMode==="guide"?"complet":"guide";
    try{localStorage.setItem("cv-mode",guideMode);}catch(e){}
    guideAppliquerMode();
  };
  let t=0;
  window.addEventListener("resize",()=>{ clearTimeout(t); t=setTimeout(()=>{ if(guideActif()){ guideAjusterZoom(); buildTemplateBar(); } },160); });
  guideAppliquerMode();
}
