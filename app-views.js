/* ============================================================
   VUES — formulaire, aperçu (rendus R.m*), personnalisation
   (chargé en 2e : fonctions de rendu + données d export)
   ============================================================ */
/* ---------- FORMULAIRE — ONGLET REMPLIR ---------- */
function buildForm(){ buildFormRemplir(); buildFormPerso(); }

function buildFormRemplir(){
  const p=document.getElementById("tab-remplir");
  p.innerHTML=`
    <h2>Ma photo</h2>
    <div class="photo-zone"><div id="photo-holder"></div>
      <div class="photo-actions">
        <button type="button" id="btn-photo" class="primary">Ajouter une photo</button>
        <button type="button" id="btn-photo-crop">✂ Recadrer / zoomer</button>
        <button type="button" id="btn-photo-del" style="background:transparent;border:none;color:#c0392b;text-decoration:underline;padding:0;font-size:12px;text-align:left;">Retirer</button>
      </div></div>
    <input type="file" id="photo-input" accept="image/*" style="display:none">
    <h2>Qui suis-je ?</h2>
    <label class="field"><span class="lab">Prénom</span><input type="text" data-k="prenom" value="${esc(data.prenom)}" placeholder="${esc(exemples.prenom)}"></label>
    <label class="field"><span class="lab">Nom</span><input type="text" data-k="nom" value="${esc(data.nom)}" placeholder="${esc(exemples.nom)}"></label>
    <label class="field"><span class="lab">Métier / formation visée</span><input type="text" data-k="metier" value="${esc(data.metier)}" placeholder="${esc(exemples.metier)}"></label>
    <h2>Pour me contacter</h2>
    <label class="field"><span class="lab">Téléphone</span><input type="text" data-k="tel" value="${esc(data.tel)}" placeholder="${esc(exemples.tel)}"></label>
    <label class="field"><span class="lab">E-mail</span><input type="text" data-k="email" value="${esc(data.email)}" placeholder="${esc(exemples.email)}"></label>
    <label class="field"><span class="lab">Ville</span><input type="text" data-k="ville" value="${esc(data.ville)}" placeholder="${esc(exemples.ville)}"></label>
    <label class="field"><span class="lab">Permis (optionnel)</span><input type="text" data-k="permis" value="${esc(data.permis)}" placeholder="${esc(exemples.permis)}"></label>
    <h2>Présentation / Profil</h2>
    <label class="field"><textarea data-k="profil" placeholder="${esc(exemples.profil)}">${esc(data.profil)}</textarea></label>
    <h2>Mes expériences</h2>
    <div id="exp-list"></div>
    <button type="button" class="add-btn" id="add-exp">+ Ajouter une expérience</button>
    <h2>Mes formations</h2>
    <div id="form-list"></div>
    <button type="button" class="add-btn" id="add-form">+ Ajouter une formation</button>
    <h2>Mes compétences</h2>
    <label class="field"><span class="lab">Une par ligne</span><textarea data-list="competences" placeholder="${esc(exemples.competences)}">${data.competences.join("\n")}</textarea></label>
    <h2>Langues</h2>
    <label class="field"><span class="lab">Une par ligne</span><textarea data-list="langues" placeholder="${esc(exemples.langues)}">${data.langues.join("\n")}</textarea></label>
    <h2>Loisirs / centres d'intérêt</h2>
    <label class="field"><span class="lab">Un par ligne</span><textarea data-list="interets" placeholder="${esc(exemples.interets)}">${data.interets.join("\n")}</textarea></label>
  `;
  renderPhotoHolder(); buildExpList(); buildFormList(); wireForm();
}

/* ---------- FORMULAIRE — ONGLET PERSONNALISATION ---------- */
const POLICES = [
  {id:"", nom:"Par défaut (selon modèle)"},
  {id:"Arial", nom:"Arial (classique)"},
  {id:"Calibri", nom:"Calibri (moderne)"},
  {id:"Georgia", nom:"Georgia (élégante)"},
  {id:"Verdana", nom:"Verdana (très lisible)"},
  {id:"Comic Sans MS", nom:"Comic Sans (ludique / dys)"}
];
function buildFormPerso(){
  const p=document.getElementById("tab-perso");
  p.innerHTML=`
    <h2>Apparence de l'application</h2>
    <label class="field"><span class="lab">Mode d'affichage</span>
      <button type="button" id="btn-theme2" class="primary" style="width:100%">🌙 Activer le mode nuit</button></label>

    <h2>Couleur du CV</h2>
    <label class="field"><span class="lab">Couleur principale du modèle</span>
      <div style="display:flex;gap:10px;align-items:center">
        <input type="color" id="cv-couleur" value="${data.couleur||"#2f5aa8"}" style="width:50px;height:38px;border:1px solid var(--ui-border);border-radius:8px;cursor:pointer;background:none">
        <button type="button" id="cv-couleur-reset" style="font-size:12px">Couleur d'origine</button>
      </div>
      <small style="color:var(--ui-muted);font-size:11px">Laisse vide pour garder la couleur d'origine du modèle choisi.</small>
    </label>

    <h2>Police du CV</h2>
    <label class="field"><span class="lab">Style d'écriture</span>
      <select id="cv-police" style="width:100%;padding:9px 11px;border:1px solid var(--ui-border);border-radius:8px;font:inherit;font-size:14px;background:var(--ui-input);color:var(--ui-text)">
        ${POLICES.map(f=>`<option value="${f.id}" ${data.police===f.id?"selected":""}>${f.nom}</option>`).join("")}
      </select></label>

    <h2>Forme de la photo</h2>
    <label class="field"><span class="lab">Style du cadre photo</span>
      <div style="display:flex;gap:8px">
        <button type="button" id="forme-rond" class="forme-btn ${formePhotoEffective()==="rond"?"active":""}">⬤ Ronde</button>
        <button type="button" id="forme-carre" class="forme-btn ${formePhotoEffective()==="carre"?"active":""}">▢ Carré adouci</button>
      </div>
      <small style="color:var(--ui-muted);font-size:11px">S'applique à la photo du modèle affiché (aperçu + export).</small>
    </label>

    <h2>Taille du texte</h2>
    <label class="field"><span class="lab">Nom & Prénom : <b id="val-name">${data.scaleName}%</b></span>
      <input type="range" id="sc-name" min="50" max="150" step="5" value="${data.scaleName}" style="width:100%"></label>
    <label class="field"><span class="lab">Titres de sections : <b id="val-title">${data.scaleTitle}%</b></span>
      <input type="range" id="sc-title" min="50" max="150" step="5" value="${data.scaleTitle}" style="width:100%"></label>
    <label class="field"><span class="lab">Texte courant : <b id="val-body">${data.scaleBody}%</b></span>
      <input type="range" id="sc-body" min="70" max="140" step="5" value="${data.scaleBody}" style="width:100%"></label>
  `;
  wirePerso();
}
function renderPhotoHolder(){
  document.getElementById("photo-holder").innerHTML = data.photo?`<img class="photo-preview" src="${data.photo}" title="Clique pour recadrer">`:`<div class="photo-empty">Aucune</div>`;
  const bc=document.getElementById("btn-photo-crop"); if(bc) bc.style.display=data.photo?"":"none";
}
function buildExpList(){
  const n=data.experiences.length;
  document.getElementById("exp-list").innerHTML=data.experiences.map((e,i)=>`
    <div class="repeat-item">
      <div class="item-head"><span class="item-num">Expérience ${i+1}</span>
        <span class="item-tools">
          <button type="button" class="mv-btn" data-mv-exp="${i}" data-dir="-1" ${i===0?"disabled":""} title="Monter">↑</button>
          <button type="button" class="mv-btn" data-mv-exp="${i}" data-dir="1" ${i===n-1?"disabled":""} title="Descendre">↓</button>
          <button type="button" class="remove-btn" data-rm-exp="${i}" title="Supprimer">×</button>
        </span></div>
      <label class="field"><span class="lab">Poste / stage</span><input type="text" data-exp="${i}" data-f="poste" value="${esc(e.poste)}" placeholder="${esc(exemples.exp.poste)}"></label>
      <label class="field"><span class="lab">Entreprise, ville</span><input type="text" data-exp="${i}" data-f="entreprise" value="${esc(e.entreprise)}" placeholder="${esc(exemples.exp.entreprise)}"></label>
      <label class="field"><span class="lab">Dates</span><input type="text" data-exp="${i}" data-f="dates" value="${esc(e.dates)}" placeholder="${esc(exemples.exp.dates)}"></label>
      <label class="field"><span class="lab">Missions (une par ligne)</span><textarea data-exp="${i}" data-f="taches" placeholder="${esc(exemples.exp.taches)}">${esc(e.taches)}</textarea></label>
    </div>`).join("");
}
function buildFormList(){
  const n=data.formations.length;
  document.getElementById("form-list").innerHTML=data.formations.map((f,i)=>`
    <div class="repeat-item">
      <div class="item-head"><span class="item-num">Formation ${i+1}</span>
        <span class="item-tools">
          <button type="button" class="mv-btn" data-mv-form="${i}" data-dir="-1" ${i===0?"disabled":""} title="Monter">↑</button>
          <button type="button" class="mv-btn" data-mv-form="${i}" data-dir="1" ${i===n-1?"disabled":""} title="Descendre">↓</button>
          <button type="button" class="remove-btn" data-rm-form="${i}" title="Supprimer">×</button>
        </span></div>
      <label class="field"><span class="lab">Diplôme / classe</span><input type="text" data-form="${i}" data-f="diplome" value="${esc(f.diplome)}" placeholder="${esc(exemples.form.diplome)}"></label>
      <label class="field"><span class="lab">Établissement, ville</span><input type="text" data-form="${i}" data-f="etablissement" value="${esc(f.etablissement)}" placeholder="${esc(exemples.form.etablissement)}"></label>
      <label class="field"><span class="lab">Dates</span><input type="text" data-form="${i}" data-f="dates" value="${esc(f.dates)}" placeholder="${esc(exemples.form.dates)}"></label>
      <label class="field"><span class="lab">Détails (optionnel)</span><input type="text" data-form="${i}" data-f="details" value="${esc(f.details)}" placeholder="${esc(exemples.form.details)}"></label>
    </div>`).join("");
}
function wireForm(){
  document.querySelectorAll("[data-k]").forEach(el=>el.addEventListener("input",()=>{data[el.dataset.k]=el.value;markModifie();render();}));
  document.querySelectorAll("[data-list]").forEach(el=>el.addEventListener("input",()=>{data[el.dataset.list]=el.value.split("\n").map(x=>x.trim()).filter(Boolean);markModifie();render();}));
  const rew=()=>{
    document.querySelectorAll("[data-exp]").forEach(el=>el.oninput=()=>{data.experiences[+el.dataset.exp][el.dataset.f]=el.value;markModifie();render();});
    document.querySelectorAll("[data-form]").forEach(el=>el.oninput=()=>{data.formations[+el.dataset.form][el.dataset.f]=el.value;markModifie();render();});
    document.querySelectorAll("[data-rm-exp]").forEach(b=>b.onclick=()=>{data.experiences.splice(+b.dataset.rmExp,1);if(!data.experiences.length)data.experiences.push({poste:"",entreprise:"",dates:"",taches:""});buildExpList();rew();markModifie();render();});
    document.querySelectorAll("[data-rm-form]").forEach(b=>b.onclick=()=>{data.formations.splice(+b.dataset.rmForm,1);if(!data.formations.length)data.formations.push({diplome:"",etablissement:"",dates:"",details:""});buildFormList();rew();markModifie();render();});
    // flèches de réorganisation
    document.querySelectorAll("[data-mv-exp]").forEach(b=>b.onclick=()=>{const i=+b.dataset.mvExp,dir=+b.dataset.dir,j=i+dir;if(j<0||j>=data.experiences.length)return;[data.experiences[i],data.experiences[j]]=[data.experiences[j],data.experiences[i]];buildExpList();rew();markModifie();render();});
    document.querySelectorAll("[data-mv-form]").forEach(b=>b.onclick=()=>{const i=+b.dataset.mvForm,dir=+b.dataset.dir,j=i+dir;if(j<0||j>=data.formations.length)return;[data.formations[i],data.formations[j]]=[data.formations[j],data.formations[i]];buildFormList();rew();markModifie();render();});
  };
  rew();
  document.getElementById("add-exp").onclick=()=>{data.experiences.push({poste:"",entreprise:"",dates:"",taches:""});buildExpList();rew();markModifie();render();};
  document.getElementById("add-form").onclick=()=>{data.formations.push({diplome:"",etablissement:"",dates:"",details:""});buildFormList();rew();markModifie();render();};
  document.getElementById("btn-photo").onclick=()=>document.getElementById("photo-input").click();
  document.getElementById("photo-input").onchange=handlePhoto;
  document.getElementById("btn-photo-crop").onclick=ouvrirEditeurPhoto;
  document.getElementById("photo-holder").onclick=ouvrirEditeurPhoto;
  document.getElementById("btn-photo-del").onclick=()=>{data.photo="";data.photoOrig="";data.photoCrop=null;renderPhotoHolder();markModifie();render();};
}
// câblage de l'onglet Personnalisation
function wirePerso(){
  const bindSc=(id,key,vid)=>{const el=document.getElementById(id);if(!el)return;el.addEventListener("input",()=>{data[key]=+el.value;const v=document.getElementById(vid);if(v)v.textContent=el.value+"%";markModifie();render();});};
  bindSc("sc-name","scaleName","val-name");
  bindSc("sc-title","scaleTitle","val-title");
  bindSc("sc-body","scaleBody","val-body");
  // bouton thème (déplacé ici)
  const bt=document.getElementById("btn-theme2");
  if(bt){ majBoutonTheme(); bt.onclick=()=>{const dark=document.body.getAttribute("data-theme")!=="dark";appliquerTheme(dark);try{localStorage.setItem("cv-theme",dark?"dark":"light");}catch(e){}}; }
  // couleur libre
  const col=document.getElementById("cv-couleur");
  if(col) col.addEventListener("input",()=>{data.couleur=col.value;markModifie();render();});
  const colR=document.getElementById("cv-couleur-reset");
  if(colR) colR.onclick=()=>{data.couleur="";markModifie();render();};
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
function majBoutonTheme(){
  const bt=document.getElementById("btn-theme2");if(!bt)return;
  const dark=document.body.getAttribute("data-theme")==="dark";
  bt.textContent=dark?"☀️ Revenir au mode jour":"🌙 Activer le mode nuit";
}
function handlePhoto(e){
  const file=e.target.files[0]; if(!file)return;
  e.target.value="";
  // garde l'original (réduit) pour pouvoir recadrer / zoomer ensuite ; photo centrée par défaut
  photoDepuisFichier(file,(orig,img)=>{
    data.photoOrig=orig; data.photoCrop=null;
    data.photo=photoRecadree(img,null);
    renderPhotoHolder();markModifie();render();
  });
}

/* ---------- SÉLECTEUR + ZOOM ---------- */
function buildTemplateBar(){
  const bar=document.getElementById("template-bar");
  bar.innerHTML=templates.map(t=>`<button class="tpl-chip ${t.id===currentTemplate?"active":""}" data-tpl="${t.id}">${t.name}</button>`).join("")
    +`<span class="zoom-ctl">Zoom <button id="z-">-</button><b id="zv">${zoom}%</b><button id="z+">+</button></span>`;
  bar.querySelectorAll("[data-tpl]").forEach(b=>b.onclick=()=>{currentTemplate=b.dataset.tpl;try{localStorage.setItem("cv-modele",currentTemplate);}catch(e){}buildTemplateBar();render();});
  document.getElementById("z-").onclick=()=>{zoom=Math.max(30,zoom-10);applyZoom();buildTemplateBar();};
  document.getElementById("z+").onclick=()=>{zoom=Math.min(120,zoom+10);applyZoom();buildTemplateBar();};
}
function applyZoom(){document.getElementById("sheet-wrap").style.transform=`scale(${zoom/100})`;}

/* ---------- APERÇUS (fidèles aux pptx) ---------- */
function photoBox(cls){ return data.photo?`<img class="cv-photo ${cls}" src="${data.photo}" title="Clique pour recadrer la photo">`:`<div class="ph ${cls}" title="Clique pour ajouter une photo">PHOTO</div>`; }
function contact(sep){ // sep = "row" (icônes en ligne) ou "col" (en colonne)
  const c=[["tel",v("tel")],["mail",v("email")],["ville",v("ville")]];
  if(data.permis && data.permis.trim()) c.push(["permis",data.permis]); // permis seulement si rempli
  const cc=c.filter(x=>x[1]);
  if(sep==="row") return cc.map(([t,val])=>`<span>${ICO[t]}${esc(val)}</span>`).join("");
  return cc.map(([t,val])=>`<div class="ln">${ICO[t]}${esc(val)}</div>`).join("");
}
function expHtml(){const ex=vExp();
  return ex.map(e=>`<div class="cv-entry"><div class="row"><span class="ttl">${esc(e.poste||exemples.exp.poste)}</span><span class="dt">${esc(e.dates||exemples.exp.dates)}</span></div><div class="sub">${esc(e.entreprise||exemples.exp.entreprise)}</div>${liToHtml(e.taches||exemples.exp.taches)}</div>`).join("");}
function formHtml(){const fs=vForm();
  return fs.map(f=>`<div class="cv-entry"><div class="row"><span class="ttl">${esc(f.diplome||exemples.form.diplome)}</span><span class="dt">${esc(f.dates||exemples.form.dates)}</span></div><div class="sub">${esc(f.etablissement||exemples.form.etablissement)}</div>${f.details?"<ul><li>"+esc(f.details)+"</li></ul>":""}</div>`).join("");}
function sideUl(arr){return "<ul style='margin-left:4mm'>"+arr.map(x=>`<li style="font-size:10pt;margin-bottom:1mm">${esc(x)}</li>`).join("")+"</ul>";}

const R = {
  m1:()=>`<div class="twocol"><div class="col-side">${photoBox("ph-photo")}
    <h3>Contact</h3>${contact("col")}
    <h3>Compétences</h3>${sideUl(vListe("competences"))}
    <h3>Langues</h3>${sideUl(vListe("langues"))}
    <h3>Centres d'intérêt</h3>${sideUl(vListe("interets"))}</div>
    <div class="col-main"><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div><div class="role">${esc(v("metier"))}</div>
    <h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Formation</h3>${formHtml()}<h3>Expérience</h3>${expHtml()}</div></div>`,

  m2:()=>`<div class="hd"><div><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div><div class="role">${esc(v("metier"))}</div>
    <div class="contact-row">${contact("row")}</div></div>${photoBox("ph-photo")}</div>
    <div class="bd"><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Compétences</h3><div class="prof">${vListe("competences").join("  •  ")}</div>
    <h3>Langues</h3><div class="prof">${vListe("langues").join("  •  ")}</div>
    <h3>Centres d'intérêt</h3><div class="prof">${vListe("interets").join("  •  ")}</div></div>`,

  m4:()=>`<div class="hd"><div class="inner"><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div>
    <div class="role">${esc(v("metier"))}</div><div class="contact-row">${contact("row")}</div></div>${photoBox("ph-photo")}</div>
    <div class="bd"><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Compétences</h3><div class="tags">${vListe("competences").map(c=>`<span class="tag">${esc(c)}</span>`).join("")}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Langues</h3><div class="prof">${vListe("langues").join("  •  ")}</div>
    <h3>Centres d'intérêt</h3><div class="prof">${vListe("interets").join("  •  ")}</div></div>`,

  m5:()=>`<div>${photoBox("ph-photo")}<div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div>
    <div class="role">${esc(v("metier"))}</div><div class="contact-center">${contact("row")}</div>
    <h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Compétences</h3><div class="compact">${vListe("competences").join("  •  ")}</div>
    <h3>Langues</h3><div class="compact">${vListe("langues").join("  •  ")}</div>
    <h3>Centres d'intérêt</h3><div class="compact">${vListe("interets").join("  •  ")}</div></div>`,

  m6:()=>`<div class="twocol"><div class="col-side">${photoBox("ph-photo")}
    <h3>Contact</h3>${contact("col")}<h3>Compétences</h3>${sideUl(vListe("competences"))}
    <h3>Langues</h3>${sideUl(vListe("langues"))}<h3>Centres d'intérêt</h3>${sideUl(vListe("interets"))}</div>
    <div class="col-main"><div class="cv-name"><span class="p">${esc(v("prenom"))}</span> <span class="n">${esc(v("nom"))}</span></div>
    <div class="role">${esc(v("metier"))}</div><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Expérience</h3>${expHtml()}<h3>Formation</h3>${formHtml()}</div></div>`,

  m7:()=>`<div class="twocol"><div class="col-side">${photoBox("ph-photo")}
    <h3>Contact</h3>${contact("col")}<h3>Compétences</h3>${sideUl(vListe("competences"))}
    <h3>Langues</h3>${sideUl(vListe("langues"))}<h3>Centres d'intérêt</h3>${sideUl(vListe("interets"))}</div>
    <div class="col-main"><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div>
    <div class="role">${esc(v("metier"))}</div><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Expérience</h3>${expHtml()}<h3>Formation</h3>${formHtml()}</div></div>`,

  m8:()=>`<div class="hd"><div><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div><div class="role">${esc(v("metier"))}</div>
    <div class="contact-row">${contact("row")}</div></div>${photoBox("ph-photo")}</div>
    <div class="bd"><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Compétences</h3><div class="tags">${vListe("competences").map(c=>`<span class="tag">${esc(c)}</span>`).join("")}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Langues</h3><div class="prof">${vListe("langues").join("  •  ")}</div>
    <h3>Centres d'intérêt</h3><div class="prof">${vListe("interets").join("  •  ")}</div></div>`,

  m9:()=>`<div class="hd"><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div><div class="role">${esc(v("metier"))}</div>
    <div class="contact-row">${contact("row")}</div>${photoBox("ph-photo")}</div>
    <div class="bd"><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Compétences</h3><div class="prof">${vListe("competences").join("  •  ")}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Langues</h3><div class="prof">${vListe("langues").join("  •  ")}</div>
    <h3>Centres d'intérêt</h3><div class="prof">${vListe("interets").join("  •  ")}</div></div>`,

  m10:()=>`<div class="twocol"><div class="col-side">${photoBox("ph-photo")}
    <h3>Contact</h3>${contact("col")}<h3>Compétences</h3>${sideUl(vListe("competences"))}
    <h3>Langues</h3>${sideUl(vListe("langues"))}<h3>Centres d'intérêt</h3>${sideUl(vListe("interets"))}</div>
    <div class="col-main"><div class="cv-name">${esc(v("prenom"))} ${esc(v("nom"))}</div>
    <div class="role">${esc(v("metier"))}</div><h3>Profil</h3><div class="prof">${nl2br(v("profil"))}</div>
    <h3>Expérience</h3>${expHtml()}<h3>Formation</h3>${formHtml()}</div></div>`
};

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
  applyZoom();
}
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
// applique la couleur personnalisée aux éléments d'accent de l'aperçu
function appliquerCouleurApercu(sheet){
  // retire l'ancien style éventuel
  let st=document.getElementById("cv-couleur-style");
  if(!data.couleur){ if(st) st.remove(); return; }
  if(!st){ st=document.createElement("style"); st.id="cv-couleur-style"; document.head.appendChild(st); }
  const c=data.couleur;
  // Principe : on colore les accents qui sont sur fond BLANC (titres du corps, rôle, etc.)
  // MAIS le contenu posé sur un fond coloré (colonnes .col-side, bandeaux .hd) doit rester BLANC
  // sinon il devient invisible (texte/icône de la couleur du fond).
  st.textContent=`
    /* fonds colorés prennent la couleur perso */
    #cv-sheet.m1 .col-side, #cv-sheet.m6 .col-side, #cv-sheet.m10 .col-side { background:${c} !important; }
    #cv-sheet.m2 .hd, #cv-sheet.m4 .hd, #cv-sheet.m9 .hd { background:${c} !important; }

    /* accents sur fond BLANC -> prennent la couleur perso */
    #cv-sheet .col-main h3, #cv-sheet .bd h3, #cv-sheet.m5 h3 { color:${c} !important; border-color:${c} !important; }
    #cv-sheet .col-main h3::before, #cv-sheet .bd h3::before { background:${c} !important; }
    #cv-sheet .role { color:${c} !important; }
    #cv-sheet .cv-entry .sub { color:${c} !important; }
    #cv-sheet.m1 .cv-name, #cv-sheet.m7 .cv-name, #cv-sheet.m8 .cv-name, #cv-sheet.m10 .cv-name { color:${c} !important; }
    #cv-sheet .rule { border-color:${c} !important; }
    #cv-sheet .tag { background:${c}22 !important; color:${c} !important; }
    /* icônes : colorées seulement sur fond blanc (contact en ligne des modèles à corps blanc) */
    #cv-sheet.m5 .ico { color:${c}; }

    /* contenu SUR fond coloré -> forcé en BLANC pour rester visible */
    #cv-sheet.m1 .col-side, #cv-sheet.m1 .col-side h3, #cv-sheet.m1 .col-side .ln, #cv-sheet.m1 .col-side li,
    #cv-sheet.m6 .col-side, #cv-sheet.m6 .col-side h3, #cv-sheet.m6 .col-side .ln, #cv-sheet.m6 .col-side li,
    #cv-sheet.m10 .col-side, #cv-sheet.m10 .col-side h3, #cv-sheet.m10 .col-side .ln, #cv-sheet.m10 .col-side li { color:#fff !important; }
    #cv-sheet.m1 .col-side .ico, #cv-sheet.m6 .col-side .ico, #cv-sheet.m10 .col-side .ico { color:#fff !important; }
    #cv-sheet.m2 .hd, #cv-sheet.m2 .hd *, #cv-sheet.m4 .hd, #cv-sheet.m4 .hd *,
    #cv-sheet.m9 .hd, #cv-sheet.m9 .hd * { color:#fff !important; }
    #cv-sheet.m2 .hd .ico, #cv-sheet.m4 .hd .ico, #cv-sheet.m9 .hd .ico { color:#fff !important; }
  `;
}

/* ---------- EXPORTS ---------- */
function nomFichier(){return ((data.prenom||"CV")+"_"+(data.nom||"")).replace(/[^a-zA-Z0-9_-]/g,"_").replace(/_+/g,"_")||"CV";}

// prépare les données pour l'export : remplit les champs vides avec les exemples
// (pour que le pptx montre la même chose que l'aperçu)
function dataPourExport(){
  const d=JSON.parse(JSON.stringify(data));
  d.prenom=v("prenom"); d.nom=v("nom"); d.metier=v("metier");
  d.tel=v("tel"); d.email=v("email"); d.ville=v("ville"); d.profil=v("profil");
  d.permis=(data.permis&&data.permis.trim())?data.permis:""; // optionnel
  d.competences=vListe("competences"); d.langues=vListe("langues"); d.interets=vListe("interets");
  d.experiences=vExp().map(e=>({poste:e.poste||exemples.exp.poste,entreprise:e.entreprise||exemples.exp.entreprise,dates:e.dates||exemples.exp.dates,taches:e.taches||exemples.exp.taches}));
  d.formations=vForm().map(f=>({diplome:f.diplome||exemples.form.diplome,etablissement:f.etablissement||exemples.form.etablissement,dates:f.dates||exemples.form.dates,details:f.details||""}));
  d.couleur=data.couleur||""; d.police=data.police||"";
  delete d.photoOrig; delete d.photoCrop; // inutiles pour l'export (la photo finale est déjà recadrée)
  return d;
}
