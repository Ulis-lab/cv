/* ============================================================
   BOOTSTRAP — câblage des boutons, thème, onglets, init
   (chargé en DERNIER : exécution immédiate, accès DOM)
   ============================================================ */
/* ===== AVERTISSEMENT AVANT EXPORT =====
   Liste ce qui manque. Les contacts/métier vides ne seront PAS imprimés ; le reste affichera un texte d'exemple. */
function champsManquants(){
  const vide=x=>!x||!String(x).trim();
  const sans=[], exemple=[];
  if(vide(data.tel)) sans.push("Téléphone");
  if(vide(data.email)) sans.push("E-mail");
  if(vide(data.ville)) sans.push("Ville");
  if(vide(data.metier)) sans.push("Métier ou formation visée");
  if(vide(data.prenom)) exemple.push("Prénom");
  if(vide(data.nom)) exemple.push("Nom");
  if(vide(data.profil)) exemple.push("Profil");
  if(!data.competences.some(x=>String(x).trim())) exemple.push("Compétences");
  if(!data.langues.some(x=>String(x).trim())) exemple.push("Langues");
  if(!data.interets.some(x=>String(x).trim())) exemple.push("Centres d'intérêt");
  if(!data.experiences.some(e=>e.poste||e.entreprise||e.dates||e.taches)) exemple.push("Expériences");
  if(!data.formations.some(f=>f.diplome||f.etablissement||f.dates||f.details)) exemple.push("Formations");
  return {sans,exemple};
}
// résout true (exporter) / false (je complète)
function confirmerExport(){
  const {sans,exemple}=champsManquants();
  if(!sans.length && !exemple.length) return Promise.resolve(true);
  return new Promise(res=>{
    const ov=document.createElement("div");
    ov.className="pm-overlay"; ov.style.display="flex";
    const liste=a=>"<ul style='margin:4px 0 10px 20px'>"+a.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";
    ov.innerHTML='<div class="pm-box" role="dialog" aria-modal="true" aria-labelledby="ce-titre" style="width:420px">'
      +'<h3 id="ce-titre">Il manque des infos</h3>'
      +(sans.length?'<p style="font-size:13px">Ces infos sont vides, elles <b>ne seront pas sur ton CV</b> :</p>'+liste(sans):'')
      +(exemple.length?'<p style="font-size:13px">Ces parties sont vides, elles afficheront un <b>texte d\'exemple</b> :</p>'+liste(exemple):'')
      +'<div class="pm-actions" style="justify-content:flex-end"><button type="button" id="ce-non">Exporter quand même</button><button type="button" id="ce-oui" class="primary">Je complète</button></div></div>';
    document.body.appendChild(ov);
    const fin=ok=>{ document.removeEventListener("keydown",kd); if(ov.liberer) ov.liberer(); ov.remove(); res(ok); };
    const kd=e=>{ if(e.key==="Escape") fin(false); };
    document.addEventListener("keydown",kd);
    ov.querySelector("#ce-oui").onclick=()=>fin(false);
    ov.querySelector("#ce-non").onclick=()=>fin(true);
    const liberer=piegeFocus(ov);
    ov.querySelector("#ce-oui").focus();
    ov.liberer=liberer;
  });
}
// PDF / impression : on ré-affiche l'aperçu SANS faux exemples de contact, puis on remet comme avant
async function avecModeExport(fn){
  modeExport=true; render();
  const retour=()=>{ if(modeExport){ modeExport=false; render(); } };
  window.addEventListener("afterprint",retour,{once:true});
  try{ return await fn(); }
  finally{ retour(); }
}

document.getElementById("btn-pptx").onclick=async()=>{
  if(!await confirmerExport()) return;
  const btn=document.getElementById("btn-pptx");const old=btn.textContent;
  btn.disabled=true;btn.textContent="Génération...";
  try{
    const pptx=await construirePPTX(PptxGenJS,dataPourExport(),currentTemplate,window.cvHelpers);
    const b64=await pptx.write({outputType:"base64"});
    const res=await window.cvApp.savePptx(b64,nomFichier());
    if(res&&res.ok) flash("PowerPoint enregistré ✓");
    else if(res&&res.error) alert(res.error);
  }catch(e){alert("Erreur PPTX : "+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=old;}
};
document.getElementById("btn-pdf").onclick=async()=>{
  if(!await confirmerExport()) return;
  const btn=document.getElementById("btn-pdf");const old=btn.textContent;
  btn.disabled=true;btn.textContent="Génération...";
  try{
    const res=await avecModeExport(()=>window.cvApp.savePdf(nomFichier()));
    if(res&&res.ok) flash("PDF enregistré ✓");
    else if(res&&res.error) alert(res.error);
  }catch(e){alert("Erreur PDF : "+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=old;}
};
document.getElementById("btn-print").onclick=async()=>{
  if(!await confirmerExport()) return;
  try{ const res=await avecModeExport(()=>window.cvApp.printCv()); if(res&&!res.ok&&res.error) alert(res.error); }
  catch(e){alert("Erreur impression : "+e.message);console.error(e);}
};
document.getElementById("btn-reset").onclick=()=>{if(confirm("Tout effacer ? (le CV gardé automatiquement sur cet ordinateur sera effacé aussi)")){data=JSON.parse(JSON.stringify(defaultData));buildForm();render();markSauve();effacerAuto();}};

document.getElementById("btn-save").onclick=()=>{
  const blob=new Blob([JSON.stringify({version:1,template:currentTemplate,data},null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=nomFichier()+".json";a.click();
  markSauve(); flash("CV sauvegardé ✓");
};
document.getElementById("btn-load").onclick=()=>document.getElementById("load-input").click();
document.getElementById("load-input").onchange=e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(f.size>12*1024*1024){alert("Ce fichier est trop gros pour être un CV (12 Mo maximum).");return;}
  const r=new FileReader();
  r.onload=ev=>{try{
    const o=JSON.parse(ev.target.result);
    if(!o||typeof o.data!=="object"||o.data===null)throw 0;
    // on ne fait JAMAIS confiance au fichier : liste blanche de champs, types et tailles vérifiés
    data=nettoyerData(o.data);
    if(modeleValide(o.template))currentTemplate=o.template;
    buildForm();buildTemplateBar();render();markSauve();planifierAuto();
  }catch(_){alert("Fichier CV invalide.");}};
  r.readAsText(f);
};

function flash(msg){
  const d=document.createElement("div");
  d.textContent=msg; d.setAttribute("role","status"); d.setAttribute("aria-live","polite");
  d.style.cssText="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e8e5a;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.2)";
  document.body.appendChild(d);setTimeout(()=>d.remove(),2200);
}

// ===== THÈME jour/nuit (mémorisé) =====
function appliquerTheme(dark){
  const b=document.body;
  if(dark) b.setAttribute("data-theme","dark"); else b.removeAttribute("data-theme");
  majBoutonTheme();
}
// au démarrage : restaurer le dernier thème choisi
try{ if(localStorage.getItem("cv-theme")==="dark") document.body.setAttribute("data-theme","dark"); }catch(e){}

// ===== BASCULEMENT DES ONGLETS =====
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  document.querySelectorAll(".tab").forEach(x=>x.setAttribute("aria-selected",x===t?"true":"false"));
  const cible=t.dataset.tab;
  document.getElementById("tab-remplir").style.display = cible==="remplir"?"":"none";
  document.getElementById("tab-perso").style.display = cible==="perso"?"":"none";
});

// ===== SUIVI "MODIFIÉ NON SAUVEGARDÉ" =====
let modifie=false;
function markModifie(){ modifie=true; if(window.cvApp&&window.cvApp.setModifie) window.cvApp.setModifie(true); planifierAuto(); }
function markSauve(){ modifie=false; if(window.cvApp&&window.cvApp.setModifie) window.cvApp.setModifie(false); }

// mémoriser le dernier modèle choisi
try{ const m=localStorage.getItem("cv-modele"); if(modeleValide(m)) currentTemplate=m; }catch(e){}

/* ===== SAUVEGARDE AUTOMATIQUE (dans CE navigateur / CET ordinateur uniquement, rien n'est envoyé) =====
   - enregistre le CV ~1 s après chaque modification
   - au démarrage suivant : fenêtre « Reprendre mon CV ? » (jamais de restauration silencieuse) */
const CLE_AUTO="cv-auto";
let _auto=0,_autoPrevenu=false;
function planifierAuto(){ clearTimeout(_auto); _auto=setTimeout(sauverAuto,800); }
function effacerAuto(){ clearTimeout(_auto); try{localStorage.removeItem(CLE_AUTO);}catch(_){} }
function sauverAuto(){
  clearTimeout(_auto); _auto=0;
  try{
    if(JSON.stringify(data)===JSON.stringify(defaultData)){ localStorage.removeItem(CLE_AUTO); return; } // CV vide : rien à garder
    localStorage.setItem(CLE_AUTO,JSON.stringify({v:1,t:Date.now(),data}));
    // version web : CV déjà gardé → plus besoin de l'alerte « quitter la page ? » (elle revient si la sauvegarde auto échoue)
    if(window.cvApp&&window.cvApp.web&&window.cvApp.setModifie) window.cvApp.setModifie(false);
  }catch(e){
    if(!_autoPrevenu){ _autoPrevenu=true; flash("Sauvegarde automatique impossible ici : pense à utiliser « Sauvegarder »."); }
  }
}
// à la fermeture / changement d'onglet : on n'attend pas le délai
window.addEventListener("pagehide",()=>{ if(_auto) sauverAuto(); });
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden"&&_auto) sauverAuto(); });

function lireAuto(){
  try{
    const o=JSON.parse(localStorage.getItem(CLE_AUTO)||"null");
    if(!o||typeof o.data!=="object"||o.data===null) return null;
    return {t:Number(o.t)||0,data:nettoyerData(o.data)}; // jamais confiance : même nettoyage qu'un fichier chargé
  }catch(_){ return null; }
}
function proposerReprise(){
  const a=lireAuto(); if(!a) return;
  const nom=((a.data.prenom||"")+" "+(a.data.nom||"")).trim();
  let quand=""; try{ if(a.t) quand=new Date(a.t).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"}); }catch(_){}
  const ov=document.createElement("div"); ov.className="pm-overlay"; ov.style.display="flex";
  ov.innerHTML='<div class="pm-box" role="dialog" aria-modal="true" aria-labelledby="rp-titre" style="width:430px">'
    +'<h3 id="rp-titre">Reprendre ton CV ?</h3>'
    +'<p style="font-size:14px;margin-bottom:8px">Un CV en cours a été gardé automatiquement sur cet ordinateur'+(nom?' : <b>'+esc(nom)+'</b>':'')+(quand?' <span style="color:var(--ui-muted)">('+esc(quand)+')</span>':'')+'.</p>'
    +'<p style="font-size:12px;color:var(--ui-muted);margin-bottom:14px">Il reste uniquement sur cet ordinateur, rien n\'est envoyé sur internet. Sur un ordinateur partagé, clique sur « Repartir de zéro » avant de partir.</p>'
    +'<div class="pm-actions" style="justify-content:flex-end"><button type="button" id="rp-non">Repartir de zéro</button><button type="button" id="rp-oui" class="primary">Reprendre mon CV</button></div></div>';
  document.body.appendChild(ov);
  const liberer=piegeFocus(ov);
  const fermer=()=>{ liberer(); ov.remove(); }; // pas de fermeture par Échap : il faut choisir (sinon la 1re frappe écraserait la sauvegarde)
  ov.querySelector("#rp-oui").onclick=()=>{ data=a.data; fermer(); buildForm(); buildTemplateBar(); render(); markSauve(); flash("CV repris ✓"); };
  ov.querySelector("#rp-non").onclick=()=>{ effacerAuto(); fermer(); };
  ov.querySelector("#rp-oui").focus();
}

// ===== MOBILE : bascule Formulaire / Aperçu + aperçu cadré sur la largeur de l'écran =====
function choisirVue(apercu){
  document.body.classList.toggle("vue-apercu",apercu);
  document.getElementById("vue-form").setAttribute("aria-pressed",apercu?"false":"true");
  document.getElementById("vue-apercu").setAttribute("aria-pressed",apercu?"true":"false");
  window.scrollTo(0,0);
  if(apercu) setTimeout(applyZoom,0);
}
document.getElementById("vue-form").onclick=()=>choisirVue(false);
document.getElementById("vue-apercu").onclick=()=>choisirVue(true);
let _rz=0;
window.addEventListener("resize",()=>{ clearTimeout(_rz); _rz=setTimeout(()=>{ if(zoomAuto()){ buildTemplateBar(); applyZoom(); } },150); });
zoomAuto();

buildForm(); buildTemplateBar(); render();
cablerEditeurPhoto(); // clic sur la photo de l'aperçu → recadrage
proposerReprise();   // CV gardé automatiquement ? on propose de le reprendre
