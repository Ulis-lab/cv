/* ============================================================
   ÉDITEUR DE PHOTO — recadrer (glisser) + zoomer
   Principe : on garde l'image ORIGINALE (data.photoOrig, réduite à 1000px max)
   + le réglage (data.photoCrop = {z, cx, cy}). La photo finale data.photo
   reste un carré 400x400, donc l'aperçu et les exports PPTX/PDF ne changent pas.
   Chargé après app-views.js et avant app.js (fonctions seulement, pas d'accès DOM au chargement).
   ============================================================ */

const PHOTO_OUT = 400;     // taille de la photo finale (carré)
const PHOTO_ORIG_MAX = 1000; // taille max de l'original conservé
const PHOTO_VIEW = 300;    // taille de la zone d'édition (px)
const PHOTO_ZMAX = 4;      // zoom max

/* ---- calcul pur : zone source (en px de l'image) visible pour un réglage donné ----
   z  = zoom (1 = l'image remplit juste le carré)
   cx,cy = centre de la zone visible, normalisé 0..1 sur l'image */
function photoCadre(iw, ih, crop){
  const z = Math.min(PHOTO_ZMAX, Math.max(1, (crop && crop.z) || 1));
  const side = Math.min(iw, ih) / z;                 // côté du carré source visible
  let cx = ((crop && typeof crop.cx === "number") ? crop.cx : 0.5) * iw;
  let cy = ((crop && typeof crop.cy === "number") ? crop.cy : 0.5) * ih;
  cx = Math.min(iw - side / 2, Math.max(side / 2, cx)); // on ne sort jamais de l'image
  cy = Math.min(ih - side / 2, Math.max(side / 2, cy));
  return { sx: cx - side / 2, sy: cy - side / 2, side, z, cx, cy };
}

/* ---- dessine le carré final 400x400 (fond blanc pour les PNG transparents) ---- */
function photoRecadree(img, crop){
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const f = photoCadre(iw, ih, crop);
  const cv = document.createElement("canvas"); cv.width = PHOTO_OUT; cv.height = PHOTO_OUT;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, PHOTO_OUT, PHOTO_OUT);
  ctx.drawImage(img, f.sx, f.sy, f.side, f.side, 0, 0, PHOTO_OUT, PHOTO_OUT);
  return cv.toDataURL("image/jpeg", 0.85);
}

/* ---- lit un fichier image, garde une copie réduite de l'original ----
   cb(origDataURL, imgElement) ; les erreurs affichent un message clair */
function photoDepuisFichier(file, cb){
  if(!file) return;
  if(file.type && file.type.indexOf("image/") !== 0){ alert("Ce fichier n'est pas une image. Choisis un fichier .jpg ou .png."); return; }
  const r = new FileReader();
  r.onload = ev => {
    const img = new Image();
    img.onload = () => {
      try{
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const k = Math.min(1, PHOTO_ORIG_MAX / Math.max(iw, ih));
        const cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(iw * k)); cv.height = Math.max(1, Math.round(ih * k));
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        const orig = cv.toDataURL("image/jpeg", 0.88);
        const small = new Image();
        small.onload = () => cb(orig, small);
        small.onerror = () => alert("Impossible de lire cette image. Essaie un autre fichier (.jpg ou .png).");
        small.src = orig;
      }catch(e){ console.error(e); alert("Impossible de lire cette image. Essaie un autre fichier (.jpg ou .png)."); }
    };
    img.onerror = () => alert("Impossible de lire cette image. Essaie un autre fichier (.jpg ou .png).");
    img.src = ev.target.result;
  };
  r.onerror = () => alert("Impossible de lire ce fichier.");
  r.readAsDataURL(file);
}

/* ============================================================
   MODALE
   ============================================================ */
let _pe = null; // éléments de la modale (créés au 1er usage)
let _pst = null; // état en cours : {orig, img, iw, ih, z, cx, cy} (cx,cy en PX de l'image source)

function _peEnsure(){
  if(_pe) return _pe;
  const ov = document.createElement("div");
  ov.id = "photo-modal"; ov.className = "pm-overlay"; ov.style.display = "none";
  ov.innerHTML = `
    <div class="pm-box" role="dialog" aria-label="Recadrer la photo">
      <h3>Recadrer la photo</h3>
      <div class="pm-view" id="pm-view"><img id="pm-img" alt="" draggable="false"><div class="pm-mask" id="pm-mask"></div></div>
      <div class="pm-zoom"><span>−</span><input type="range" id="pm-range" min="100" max="${PHOTO_ZMAX * 100}" step="1" value="100"><span>+</span></div>
      <small class="pm-hint">Glisse la photo pour la déplacer · curseur ou molette pour zoomer</small>
      <div class="pm-actions">
        <div class="pm-left">
          <button type="button" id="pm-change">Changer d'image</button>
          <button type="button" id="pm-reset">Recentrer</button>
        </div>
        <div class="pm-right">
          <button type="button" id="pm-cancel">Annuler</button>
          <button type="button" id="pm-ok" class="primary">Valider</button>
        </div>
      </div>
      <input type="file" id="pm-file" accept="image/*" style="display:none">
    </div>`;
  document.body.appendChild(ov);
  const q = id => ov.querySelector("#" + id);
  _pe = { ov, view: q("pm-view"), img: q("pm-img"), mask: q("pm-mask"), range: q("pm-range"), file: q("pm-file") };

  // --- glisser pour déplacer ---
  let drag = null;
  _pe.view.addEventListener("pointerdown", e => {
    if(!_pst) return;
    drag = { x: e.clientX, y: e.clientY, cx: _pst.cx, cy: _pst.cy };
    try{ _pe.view.setPointerCapture(e.pointerId); }catch(_){}
    _pe.view.classList.add("drag");
  });
  _pe.view.addEventListener("pointermove", e => {
    if(!drag || !_pst) return;
    const s = _peScale();
    _pst.cx = drag.cx - (e.clientX - drag.x) / s;
    _pst.cy = drag.cy - (e.clientY - drag.y) / s;
    _peClamp(); _pePaint();
  });
  const fin = () => { drag = null; _pe.view.classList.remove("drag"); };
  _pe.view.addEventListener("pointerup", fin);
  _pe.view.addEventListener("pointercancel", fin);
  // --- zoom molette + curseur ---
  _pe.view.addEventListener("wheel", e => {
    e.preventDefault();
    if(_pst) _peSetZoom(_pst.z * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
  }, { passive: false });
  _pe.range.addEventListener("input", () => _peSetZoom(_pe.range.value / 100));
  // --- boutons ---
  q("pm-cancel").onclick = photoFermerEditeur;
  q("pm-ok").onclick = _peValider;
  q("pm-reset").onclick = () => { if(!_pst) return; _pst.z = 1; _pst.cx = _pst.iw / 2; _pst.cy = _pst.ih / 2; _peClamp(); _pePaint(); };
  q("pm-change").onclick = () => _pe.file.click();
  _pe.file.onchange = e => {
    const f = e.target.files[0]; e.target.value = "";
    photoDepuisFichier(f, (orig, img) => { if(_pst) _peInit(orig, img, null); });
  };
  // clic sur le fond sombre = annuler ; Échap = annuler
  ov.addEventListener("mousedown", e => { if(e.target === ov) photoFermerEditeur(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape" && _pst) photoFermerEditeur(); });
  return _pe;
}

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
  }catch(e){ console.error(e); alert("Impossible de recadrer cette photo."); return; }
  photoFermerEditeur();
  renderPhotoHolder(); markModifie(); render();
}

function photoFermerEditeur(){
  if(_pe) _pe.ov.style.display = "none";
  _pst = null;
}

/* ---- point d'entrée : clic sur une photo (aperçu ou formulaire) ----
   pas de photo → ouvre le choix de fichier ; sinon → ouvre l'éditeur */
function ouvrirEditeurPhoto(){
  if(!data.photo && !data.photoOrig){ document.getElementById("photo-input").click(); return; }
  const m = _peEnsure();
  const src = data.photoOrig || data.photo; // anciens fichiers : on retombe sur la photo déjà recadrée
  const img = new Image();
  img.onload = () => {
    m.mask.style.borderRadius = (formePhotoEffective() === "carre") ? "14%" : "50%";
    m.ov.style.display = "flex";
    _peInit(src, img, data.photoOrig ? data.photoCrop : null);
  };
  img.onerror = () => alert("Impossible d'ouvrir la photo pour la recadrer.");
  img.src = src;
}

// câblage du clic sur la photo de l'aperçu (délégation : l'aperçu est ré-écrit à chaque render)
function cablerEditeurPhoto(){
  const sheet = document.getElementById("cv-sheet");
  sheet.addEventListener("click", e => {
    if(e.target.closest && e.target.closest(".cv-photo, .ph")) ouvrirEditeurPhoto();
  });
}
