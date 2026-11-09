/* ui/form/wire-form.js — Branche les champs du formulaire sur les données */

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
  const ph=document.getElementById("photo-holder");
  ph.onclick=ouvrirEditeurPhoto; ph.tabIndex=0; ph.setAttribute("role","button"); 
  ph.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); ouvrirEditeurPhoto(); } };
  document.getElementById("btn-photo-del").onclick=()=>{data.photo="";data.photoOrig="";data.photoCrop=null;renderPhotoHolder();markModifie();render();};
}
