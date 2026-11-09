/* pptx/formations.js — Bloc « Formation » du PPTX */

function addFormations(s, pptx, d, MX, MW, myStart, opts) {
  let my = myStart;
  const ab = opts.ab || 1;
  const fs = (d.formations && d.formations.length) ? d.formations : [{ diplome: "Intitulé du diplôme / de la classe", etablissement: "Nom de l'établissement, Ville", dates: "2024 - 2025", details: "" }];
  const CF = opts.cf || 1;
  fs.forEach(f => {
    addTitreDate(s, val(f.diplome, "Diplôme"), f.dates, opts, MX, my, MW);
    my += 0.27 * ab;
    if (f.etablissement) { s.addText(f.etablissement, { x: MX, y: my, w: MW, h: 0.28, fontSize: 10, bold: !opts.italicEnt, italic: !!opts.italicEnt, color: opts.italicEnt ? opts.accent : opts.ink, fontFace: opts.font, margin: 0 }); my += 0.27 * ab; }
    if (f.details) {
      const lh = LH(_ctx.sf(10.5));
      const en_plus = lignesEnPlus([f.details], MW - 0.1 - 0.2 - 0.375, 10.5, opts.font) * lh;
      const hTexte = lh + en_plus;
      const hBoite = CALCUL_LIGNES ? Math.max(hTexte + 0.05, 0.25 + en_plus) : 0.25;
      _ctx.hBas = hBoite / 2 + hTexte / 2;
      s.addText([{ text: f.details, options: { bullet: true } }], { x: MX + 0.1, y: my, w: MW - 0.1, h: hBoite, fontSize: 10.5, color: opts.ink, fontFace: opts.font });
      my += CALCUL_LIGNES ? Math.max(0.25 * ab + en_plus, hBoite / 2 + hTexte / 2 + 0.03) : 0.25 * ab;
    }
    my += 0.16 * CF;
  });
  return my;
}
