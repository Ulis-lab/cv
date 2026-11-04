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
    const fin=ok=>{ document.removeEventListener("keydown",kd); ov.remove(); res(ok); };
    const kd=e=>{ if(e.key==="Escape") fin(false); };
    document.addEventListener("keydown",kd);
    ov.querySelector("#ce-oui").onclick=()=>fin(false);
    ov.querySelector("#ce-non").onclick=()=>fin(true);
    ov.querySelector("#ce-oui").focus();
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
document.getElementById("btn-reset").onclick=()=>{if(confirm("Tout effacer ?")){data=JSON.parse(JSON.stringify(defaultData));buildForm();render();markSauve();}};

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
    buildForm();buildTemplateBar();render();markSauve();
  }catch(_){alert("Fichier CV invalide.");}};
  r.readAsText(f);
};

function flash(msg){
  const d=document.createElement("div");
  d.textContent=msg;
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
  const cible=t.dataset.tab;
  document.getElementById("tab-remplir").style.display = cible==="remplir"?"":"none";
  document.getElementById("tab-perso").style.display = cible==="perso"?"":"none";
});

// ===== SUIVI "MODIFIÉ NON SAUVEGARDÉ" =====
let modifie=false;
function markModifie(){ modifie=true; if(window.cvApp&&window.cvApp.setModifie) window.cvApp.setModifie(true); }
function markSauve(){ modifie=false; if(window.cvApp&&window.cvApp.setModifie) window.cvApp.setModifie(false); }

// mémoriser le dernier modèle choisi
try{ const m=localStorage.getItem("cv-modele"); if(modeleValide(m)) currentTemplate=m; }catch(e){}

buildForm(); buildTemplateBar(); render();
cablerEditeurPhoto(); // clic sur la photo de l'aperçu → recadrage
