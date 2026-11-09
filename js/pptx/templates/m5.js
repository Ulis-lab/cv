/* pptx/templates/m5.js — Modèle PPTX m5 (doit rester synchronisé avec preview/templates/m5.js) */

PPTX_MODELES.m5 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, hProfil } = c;
  let s;
    s = pptx.addSlide();
    const BG = "1C1C24", GOLD = "C9A24B", LIGHT = "EDEDED", MUTED = "9A9AA5";
    s.background = { color: BG };
    photo(s, (PW - 1.35) / 2, 0.3, 1.35, 1.35, true, "2A2A33", GOLD);
    s.addText(NOM, { x: 0.7, y: 1.75, w: PW - 1.4, h: 0.55, fontSize: 28, bold: true, color: LIGHT, align: "center", charSpacing: 2, fontFace: "Cambria", margin: 0 });
    s.addText(METIER, { x: 0.7, y: 2.28, w: PW - 1.4, h: 0.3, fontSize: 12.5, italic: true, color: GOLD, align: "center", fontFace: "Cambria", margin: 0 });
    await contactsLigne(s, pptx, H, 0.9, 2.62, "C9A24B", "9A9AA5", d, 9.5, 6.8);
    const MX = 0.9, MW = PW - 1.8; let my = 3.1;
    const h3 = (t) => { s.addText(t.toUpperCase(), { x: MX, y: my, w: MW, h: 0.3, fontSize: 13, bold: true, color: GOLD, charSpacing: 3, fontFace: "Cambria", margin: 0 }); s.addShape(S.line, { x: MX, y: my + 0.34, w: MW, h: 0, line: { color: "3A3A44", width: 0.75 } }); my += 0.5; };
    h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Cambria", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: LIGHT, fontFace: "Cambria", margin: 0 }); my += 0.7 + (ph - 0.5); }
    h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: LIGHT, accent: GOLD, font: "Cambria", italicEnt: true });
    h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: LIGHT, accent: GOLD, font: "Cambria", italicEnt: true });
    h3("Compétences"); s.addText(COMP.join("   •   "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: LIGHT, fontFace: "Cambria", margin: 0 }); my += 0.46;
    h3("Langues"); s.addText(LANG.join("   •   "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: LIGHT, fontFace: "Cambria", margin: 0 }); my += 0.46;
    h3("Centres d'intérêt"); s.addText(INT.join("   •   "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: LIGHT, fontFace: "Cambria", margin: 0 });
};
