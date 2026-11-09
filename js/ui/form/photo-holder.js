/* ui/form/photo-holder.js — Vignette de la photo dans le formulaire + envoi d'un fichier photo */

function renderPhotoHolder(){
  const ps=imgSure(data.photo);
  document.getElementById("photo-holder").innerHTML = ps?`<img class="photo-preview" src="${ps}" alt="Ta photo" title="Clique pour recadrer">`:`<div class="photo-empty">Aucune</div>`;
  document.getElementById("photo-holder").setAttribute("aria-label", ps?"Photo : ouvrir le recadrage":"Aucune photo : en ajouter une");
  const bc=document.getElementById("btn-photo-crop"); if(bc) bc.style.display=data.photo?"":"none";
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
