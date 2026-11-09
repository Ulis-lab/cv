/* pptx/contacts.js — Contacts du PPTX : 3 mises en page (colonne, ligne, grille) */

// contacts en colonne (icône + texte)
async function contactsColonne(s, pptx, H, x, y, w, cIcone, cTexte, d, taille) {
  taille = taille || 10;
  const items = contactItems(d);
  const ic = 0.15;
  for (const [type, txt] of items) {
    const img = await H.icone(type, cIcone);
    s.addImage({ data: img, x: x + 0.02, y: y + 0.055, w: ic, h: ic });
    s.addText(txt, { x: x + ic + 0.14, y: y, w: w - ic - 0.14, h: 0.26, fontSize: taille, color: cTexte, fontFace: "Arial", margin: 0, valign: "middle" });
    y += 0.32;
  }
  return y;
}

// contacts en ligne horizontale (avec retour à la ligne si ça dépasse maxW)
async function contactsLigne(s, pptx, H, x, y, cIcone, cTexte, d, taille, maxW) {
  taille = taille || 10;
  maxW = maxW || 6.0; // largeur max avant retour à la ligne
  const items = contactItems(d);
  const ic = 0.15;
  let cx = x, cy = y;
  for (const [type, txt] of items) {
    const txtW = 0.18 + txt.length * 0.072;
    const largeurItem = ic + 0.12 + txtW;
    // si l'item dépasse la largeur max, on passe à la ligne suivante
    if (cx + largeurItem > x + maxW && cx > x) { cx = x; cy += 0.3; }
    const img = await H.icone(type, cIcone);
    s.addImage({ data: img, x: cx, y: cy + 0.03, w: ic, h: ic });
    s.addText(txt, { x: cx + ic + 0.12, y: cy - 0.02, w: txtW, h: 0.3, fontSize: taille, color: cTexte, fontFace: "Arial", margin: 0 });
    cx += largeurItem + 0.28;
  }
  return cy + 0.3; // renvoie la position Y après le contact
}

// contacts en grille fixe 2 colonnes (col2 toujours alignée verticalement)
async function contactsGrille(s, pptx, H, x, y, colW, cIcone, cTexte, d, taille) {
  taille = taille || 9.5;
  const items = contactItems(d);
  const ic = 0.15, cols = 2, rowH = 0.3;
  for (let i = 0; i < items.length; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = x + col * colW, cy = y + row * rowH;
    const img = await H.icone(items[i][0], cIcone);
    s.addImage({ data: img, x: cx, y: cy + 0.05, w: ic, h: ic });
    // la dernière colonne peut déborder à droite (rien après), on lui laisse de la marge
    const tw = (col === cols - 1) ? colW - ic - 0.12 + 0.6 : colW - ic - 0.12;
    s.addText(items[i][1], { x: cx + ic + 0.12, y: cy, w: tw, h: 0.3, fontSize: taille, color: cTexte, fontFace: "Arial", margin: 0, valign: "middle" });
  }
  return y + Math.ceil(items.length / cols) * rowH;
}
