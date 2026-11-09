/* photo/editor-validate.js — Valider / fermer la fenêtre de recadrage */

// (ré)initialise l'éditeur sur une image ; crop = {z,cx,cy} normalisé ou null (centré)
function _peInit(orig, img, crop){
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const f = photoCadre(iw, ih, crop);
  _pst = { orig, img, iw, ih, z: f.z, cx: f.cx, cy: f.cy };
  _pe.img.src = orig;
  _peClamp(); _pePaint();
}

function _peValider(){
  if(!_pst) return;
  const crop = { z: _pst.z, cx: _pst.cx / _pst.iw, cy: _pst.cy / _pst.ih };
  try{
    data.photo = photoRecadree(_pst.img, crop);
    data.photoOrig = _pst.orig;
    data.photoCrop = crop;
  }catch(e){ console.error(e); alerter("Impossible de recadrer cette photo."); return; }
  photoFermerEditeur();
  renderPhotoHolder(); markModifie(); render();
}

function photoFermerEditeur(){
  if(_pe) _pe.ov.style.display = "none";
  _pst = null;
  if(_peLiberer){ _peLiberer(); _peLiberer = null; } // rend le focus au bouton qui avait ouvert la fenêtre
}
