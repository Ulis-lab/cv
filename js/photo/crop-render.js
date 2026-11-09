/* photo/crop-render.js — Dessine la photo finale 400×400 */

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
