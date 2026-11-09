/* pptx/build.js — Construit le PPTX complet : resserre et recommence tant que ça déborde de la page (UNE page garantie) */

async function construirePPTX(PptxGenJS, d, templateId, H) {
  let p = await construirePASSE(PptxGenJS, d, templateId, H, 0);
  if (!CALCUL_LIGNES) return p; // ancien comportement
  for (let pas = 1; pas <= 14 && p.__bas > BAS_MAX; pas++) p = await construirePASSE(PptxGenJS, d, templateId, H, pas);
  p.__tient = p.__bas <= BAS_MAX;
  return p;
}
