/* photo/editor-zoom.js — Zoom et cadrage dans la fenêtre de recadrage */

// échelle d'affichage : px d'écran par px d'image (z=1 → le petit côté remplit la zone)
function _peScale(){ return PHOTO_VIEW / Math.min(_pst.iw, _pst.ih) * _pst.z; }

// garde le cadre dans l'image
function _peClamp(){
  const half = PHOTO_VIEW / 2 / _peScale();
  _pst.cx = Math.min(_pst.iw - half, Math.max(half, _pst.cx));
  _pst.cy = Math.min(_pst.ih - half, Math.max(half, _pst.cy));
}

function _peSetZoom(z){
  _pst.z = Math.min(PHOTO_ZMAX, Math.max(1, z));
  _peClamp(); _pePaint();
}

function _pePaint(){
  const s = _peScale();
  const im = _pe.img;
  im.style.width = (_pst.iw * s) + "px";
  im.style.height = (_pst.ih * s) + "px";
  im.style.left = (PHOTO_VIEW / 2 - _pst.cx * s) + "px";
  im.style.top = (PHOTO_VIEW / 2 - _pst.cy * s) + "px";
  _pe.range.value = Math.round(_pst.z * 100);
}
