/* pptx/templates/m2.js — Modèle PPTX m2 (doit rester synchronisé avec preview/templates/m2.js) */

PPTX_MODELES.m2 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const DARK = "2B2B2B", ACCENT = "C2492B";
    s.addShape(S.rect, { x: 0, y: 0, w: PW, h: 1.95, fill: { color: DARK }, line: { type: "none" } });
    photo(s, PW - 2.0, 0.35, 1.25, 1.25, false, "3D3D3D", "FFFFFF");
    s.addText(NOM, { x: 0.7, y: 0.4, w: 5, h: 0.55, fontSize: 27, bold: true, color: "FFFFFF", fontFace: "Cambria", margin: 0 });
    s.addText(METIER, { x: 0.7, y: 0.98, w: 5, h: 0.3, fontSize: 12.5, italic: true, color: "F2D7CC", fontFace: "Arial", margin: 0 });
    await contactsGrille(s, pptx, H, 0.7, 1.31, 2.026, "F2D7CC", "FFFFFF", d, 9.5);
    const MX = 0.7, MW = PW - 1.4; let my = 2.15;
    const h3 = (t) => { s.addText(t.toUpperCase(), { x: MX, y: my, w: MW, h: 0.32, fontSize: 14, bold: true, color: ACCENT, fontFace: "Cambria", margin: 0 }); my += 0.39; };
    h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.64 + (ph - 0.5); }
    h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: ACCENT, font: "Arial" });
    h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: ACCENT, font: "Arial" });
    h3("Compétences"); s.addText(COMP.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.46;
    h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.46;
    h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 });
};
