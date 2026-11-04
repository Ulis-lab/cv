/* ============================================================
   BOOTSTRAP — câblage des boutons, thème, onglets, init
   (chargé en DERNIER : exécution immédiate, accès DOM)
   ============================================================ */
document.getElementById("btn-pptx").onclick=async()=>{
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
  const btn=document.getElementById("btn-pdf");const old=btn.textContent;
  btn.disabled=true;btn.textContent="Génération...";
  try{
    const res=await window.cvApp.savePdf(nomFichier());
    if(res&&res.ok) flash("PDF enregistré ✓");
    else if(res&&res.error) alert(res.error);
  }catch(e){alert("Erreur PDF : "+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=old;}
};
document.getElementById("btn-print").onclick=async()=>{
  try{ const res=await window.cvApp.printCv(); if(res&&!res.ok&&res.error) alert(res.error); }
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
  const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=ev=>{try{
    const o=JSON.parse(ev.target.result);
    if(!o||typeof o.data!=="object"||o.data===null)throw 0;
    // fusion défensive : on part des valeurs par défaut et on écrase avec le fichier,
    // pour qu'un fichier incomplet (ancien format, édité à la main) ne casse pas l'affichage
    const base=JSON.parse(JSON.stringify(defaultData));
    data=Object.assign(base,o.data);
    // garde-fous : ces champs DOIVENT rester des tableaux non vides côté formulaire
    if(!Array.isArray(data.experiences)||!data.experiences.length) data.experiences=[{poste:"",entreprise:"",dates:"",taches:""}];
    if(!Array.isArray(data.formations)||!data.formations.length) data.formations=[{diplome:"",etablissement:"",dates:"",details:""}];
    ["competences","langues","interets"].forEach(k=>{ if(!Array.isArray(data[k])) data[k]=[]; });
    if(o.template&&R[o.template])currentTemplate=o.template;
    buildForm();buildTemplateBar();render();markSauve();
  }catch(_){alert("Fichier CV invalide.");}
  e.target.value="";};
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
try{ const m=localStorage.getItem("cv-modele"); if(m&&R[m]) currentTemplate=m; }catch(e){}

buildForm(); buildTemplateBar(); render();
cablerEditeurPhoto(); // clic sur la photo de l'aperçu → recadrage
