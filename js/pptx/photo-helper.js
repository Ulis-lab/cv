/* pptx/photo-helper.js — Photo du PPTX : forme ronde/carrée, coins arrondis, cadre « PHOTO » si pas de photo */

async function creerPhoto(pptx, d, H, templateId) {
  // forme de la photo : override perso ('rond'/'carre'), sinon signature du modèle (tous ronds sauf m2 carré adouci)
  const SIGNATURE_PHOTO = { m2: "carre" };
  const formeP = (d.formePhoto === "rond" || d.formePhoto === "carre") ? d.formePhoto : (SIGNATURE_PHOTO[templateId] || "rond");
  const photoRonde = formeP === "rond";
  // rectRadius ne doit JAMAIS être passé à une ellipse (XML invalide → PowerPoint "réparer").
  // -> on ne renvoie {rectRadius} que pour une photo carrée (forme roundRect).
  const rr = (v) => (photoRonde ? {} : { rectRadius: v });
  let photoSrc = d.photo;
  if (d.photo && !photoRonde && H && H.arrondirImage) {
    try { photoSrc = await H.arrondirImage(d.photo, 0.14); } catch (e) { photoSrc = d.photo; }
  }

  // helper image photo : si d.photo (dataURI), on l'insère ; sinon cadre placeholder
  function photo(s, x, y, w, h, ronde, couleurCadre, couleurTexte) {
    if (d.photo) {
      s.addImage({ data: photoSrc, x, y, w, h, rounding: photoRonde, sizing: { type: "cover", w, h } });
    } else {
      const shape = photoRonde ? pptx.ShapeType.ellipse : pptx.ShapeType.roundRect;
      s.addShape(shape, { x, y, w, h, fill: { color: couleurCadre }, line: { color: couleurTexte, width: 1.5 } });
      s.addText("PHOTO", { x, y: y + h / 2 - 0.15, w, h: 0.3, align: "center", fontSize: 10, bold: true, color: couleurTexte, fontFace: "Arial" });
    }
  }

  return { photo, photoRonde, rr, formeP };
}
