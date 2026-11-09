/* photo/crop-math.js — Calcul pur de la zone recadrée */

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
