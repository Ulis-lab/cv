/* photo/editor-open.js — Ouvre l'éditeur au clic sur une photo */

/* ---- point d'entrée : clic sur une photo (aperçu ou formulaire) ----
   pas de photo → ouvre le choix de fichier ; sinon → ouvre l'éditeur */
function ouvrirEditeurPhoto(){
  if(!imgSure(data.photo) && !imgSure(data.photoOrig)){ document.getElementById("photo-input").click(); return; }
  const m = _peEnsure();
  const src = imgSure(data.photoOrig) || imgSure(data.photo); // anciens fichiers : on retombe sur la photo déjà recadrée
  const img = new Image();
  img.onload = () => {
    m.mask.style.borderRadius = (formePhotoEffective() === "carre") ? "14%" : "50%";
    if(_peLiberer) _peLiberer();
    _peLiberer = piegeFocus(m.ov);
    m.ov.style.display = "flex";
    _peInit(src, img, data.photoOrig ? data.photoCrop : null);
    m.view.focus();
  };
  img.onerror = () => alerter("Impossible d'ouvrir la photo pour la recadrer.");
  img.src = src;
}

// câblage du clic sur la photo de l'aperçu (délégation : l'aperçu est ré-écrit à chaque render)
function cablerEditeurPhoto(){
  const sheet = document.getElementById("cv-sheet");
  sheet.addEventListener("click", e => {
    if(e.target.closest && e.target.closest(".cv-photo, .ph")) ouvrirEditeurPhoto();
  });
}
