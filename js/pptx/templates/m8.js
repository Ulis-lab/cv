/* pptx/templates/m8.js — Modèle PPTX m8 (doit rester synchronisé avec preview/templates/m8.js) */

PPTX_MODELES.m8 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const MINT = "CDEDE3", MINT_DARK = "2E8B73", PEACH = "FBE3D6", INK = "333333";
    s.addShape(S.rect, { x: 0, y: 0, w: PW, h: 2.0, fill: { color: MINT }, line: { type: "none" } });
    photo(s, PW - 2.05, 0.4, 1.3, 1.3, true, "FFFFFF", MINT_DARK);
    s.addText(NOM, { x: 0.7, y: 0.233, w: 5, h: 0.55, fontSize: 28, bold: true, color: MINT_DARK, fontFace: "Arial", margin: 0 });
    s.addText(METIER, { x: 0.7, y: 0.833, w: 5, h: 0.3, fontSize: 12.5, italic: true, color: "5A6B66", fontFace: "Arial", margin: 0 });
    await contactsGrille(s, pptx, H, 0.7, 1.243, 1.954, "2E8B73", "5A6B66", d, 9.5);
    const MX = 0.7, MW = PW - 1.4; let my = 2.14;
    const h3 = (t) => { s.addShape(S.roundRect, { x: MX, y: my, w: 0.18, h: 0.3, rectRadius: 0.05, fill: { color: PEACH }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.32, y: my - 0.02, w: MW - 0.32, h: 0.35, fontSize: 14, bold: true, color: MINT_DARK, fontFace: "Arial", margin: 0 }); my += 0.46; };
    h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: INK, fontFace: "Arial", margin: 0 }); my += 0.72 + (ph - 0.5); }
    h3("Compétences");
    let cx = MX; COMP.forEach(c => { const w = 0.25 + c.length * 0.075; s.addShape(S.roundRect, { x: cx, y: my, w, h: 0.34, rectRadius: 0.17, fill: { color: MINT }, line: { type: "none" } }); s.addText(c, { x: cx, y: my, w, h: 0.34, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: MINT_DARK, fontFace: "Arial", margin: 0 }); cx += w + 0.15; }); my += 0.62;
    h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: MINT_DARK, font: "Arial" });
    h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: MINT_DARK, font: "Arial" });
    h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.46;
    h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 });
};
