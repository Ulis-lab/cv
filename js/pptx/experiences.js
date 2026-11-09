/* pptx/experiences.js — Bloc « Expérience » du PPTX (hauteur calculée d'après le texte réel) */

// ---- helpers de contenu communs ----
function addExperiences(s, pptx, d, MX, MW, myStart, opts) {
  let my = myStart;
  const ab = opts.ab || 1;
  const exps = (d.experiences && d.experiences.length) ? d.experiences : [{ poste: "Intitulé du poste / stage", entreprise: "Nom de l'entreprise, Ville", dates: "MM/AAAA - MM/AAAA", taches: "Mission ou tâche réalisée\nRéussite ou compétence acquise" }];
  exps.forEach(e => {
    addTitreDate(s, val(e.poste, "Poste"), e.dates, opts, MX, my, MW);
    my += 0.27 * ab;
    if (e.entreprise) { s.addText(e.entreprise, { x: MX, y: my, w: MW, h: 0.28, fontSize: 10, bold: !opts.italicEnt, italic: !!opts.italicEnt, color: opts.italicEnt ? opts.accent : opts.ink, fontFace: opts.font, margin: 0 }); my += 0.27 * ab; }
    const t = lignes(e.taches);
    if (t.length) {
      // largeur réellement disponible : boîte (MW-0.1) - marges internes 2x0.1 - retrait de puce 0.375
      const cfx = opts.cf || 1;
      const lh = LH(_ctx.sf(10.5));
      const en_plus = lignesEnPlus(t, MW - 0.1 - 0.2 - 0.375, 10.5, opts.font) * lh;  // hauteur des lignes en plus (puces longues)
      const hTexte = t.length * lh + en_plus;                                          // hauteur réelle du texte
      // anciennes valeurs conservées quand il y a de la place ; plancher physique quand ça se resserre (sinon chevauchement)
      const hBoite = CALCUL_LIGNES ? Math.max(hTexte + 0.05, (0.2 + t.length * 0.22) * cfx + en_plus) : 0.2 + t.length * 0.22;
      _ctx.hBas = hBoite / 2 + hTexte / 2;
      s.addText(t.map((x, i) => ({ text: x, options: { bullet: true, breakLine: i < t.length - 1 } })), { x: MX + 0.1, y: my, w: MW - 0.1, h: hBoite, fontSize: 10.5, color: opts.ink, fontFace: opts.font });
      const avance = (0.16 + t.length * 0.2 * ab) * cfx + 0.05 + en_plus;
      my += CALCUL_LIGNES ? Math.max(avance, hBoite / 2 + hTexte / 2 + 0.05) : (0.16 + t.length * 0.2 * ab) * cfx + 0.05;
    }
    my += 0.14 * (opts.cf || 1) + 0.05;
  });
  return my;
}
