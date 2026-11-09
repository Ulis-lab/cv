/* photo/editor-modal.js — Construit la fenêtre de recadrage (glisser, zoom, clavier) */

function _peEnsure(){
  if(_pe) return _pe;
  const ov = document.createElement("div");
  ov.id = "photo-modal"; ov.className = "pm-overlay"; ov.style.display = "none";
  ov.innerHTML = `
    <div class="pm-box" role="dialog" aria-modal="true" aria-labelledby="pm-titre">
      <h3 id="pm-titre">Recadrer la photo</h3>
      <div class="pm-view" id="pm-view" tabindex="0" role="group" aria-label="Zone de cadrage : flèches pour déplacer, plus et moins pour zoomer"><img id="pm-img" alt="" draggable="false"><div class="pm-mask" id="pm-mask"></div></div>
      <div class="pm-zoom"><span>−</span><input type="range" id="pm-range" aria-label="Zoom" min="100" max="${PHOTO_ZMAX * 100}" step="1" value="100"><span>+</span></div>
      <small class="pm-hint">Glisse la photo pour la déplacer · curseur ou molette pour zoomer · au clavier : flèches et + / −</small>
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
  // --- clavier : flèches = déplacer, + / - = zoomer ---
  _pe.view.addEventListener("keydown", e => {
    if(!_pst) return;
    const pas = (e.shiftKey ? 30 : 8) / _peScale();
    if(e.key === "ArrowLeft") _pst.cx -= pas; else if(e.key === "ArrowRight") _pst.cx += pas;
    else if(e.key === "ArrowUp") _pst.cy -= pas; else if(e.key === "ArrowDown") _pst.cy += pas;
    else if(e.key === "+" || e.key === "=") { _peSetZoom(_pst.z * 1.1); e.preventDefault(); return; }
    else if(e.key === "-" || e.key === "_") { _peSetZoom(_pst.z / 1.1); e.preventDefault(); return; }
    else return;
    e.preventDefault(); _peClamp(); _pePaint();
  });
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
