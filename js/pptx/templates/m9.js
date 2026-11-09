/* pptx/templates/m9.js — Modèle PPTX m9 (doit rester synchronisé avec preview/templates/m9.js) */

PPTX_MODELES.m9 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, photoRonde, rr, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const ACCENT = "5B4BC4", INK = "333333";
    const grad = await H.degrade("4A6CF7", "9B4BC4", PW, 2.1, "diagonal");
    s.addImage({ data: grad, x: 0, y: 0, w: PW, h: 2.1 });
    const ringM9 = photoRonde ? S.ellipse : S.roundRect;
    if (d.photo) { s.addImage({ data: photoSrc, x: PW - 1.641, y: 1.11, w: 1.34, h: 1.34, rounding: photoRonde, sizing: { type: "cover", w: 1.34, h: 1.34 } }); s.addShape(ringM9, { x: PW - 1.711, y: 1.04, w: 1.48, h: 1.48, ...rr(0.2), fill: { type: "none" }, line: { color: "FFFFFF", width: 2 } }); }
    else { s.addShape(ringM9, { x: PW - 1.711, y: 1.04, w: 1.48, h: 1.48, ...rr(0.2), fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 2 } }); s.addShape(ringM9, { x: PW - 1.641, y: 1.11, w: 1.34, h: 1.34, ...rr(0.18), fill: { color: "ECE9FB" }, line: { type: "none" } }); s.addText("PHOTO", { x: PW - 1.641, y: 1.66, w: 1.34, h: 0.3, align: "center", fontSize: 10, bold: true, color: ACCENT, fontFace: "Arial" }); }
    s.addText(NOM, { x: 0.7, y: 0.25, w: 5, h: 0.6, fontSize: 30, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 });
    s.addText(METIER, { x: 0.7, y: 0.87, w: 5, h: 0.3, fontSize: 12.5, italic: true, color: "EDE9FB", fontFace: "Arial", margin: 0 });
    await contactsGrille(s, pptx, H, 0.7, 1.28, 1.954, "EDE9FB", "FFFFFF", d, 9.5);
    const MX = 0.7, MW = PW - 1.4; let my = 2.28;
    const h3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.03, w: 0.2, h: 0.2, fill: { color: ACCENT }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.04, w: MW - 0.35, h: 0.35, fontSize: 14, bold: true, color: ACCENT, fontFace: "Arial", margin: 0 }); my += 0.46; };
    h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: INK, fontFace: "Arial", margin: 0 }); my += 0.72 + (ph - 0.5); }
    h3("Compétences"); s.addText(COMP.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 11, color: INK, fontFace: "Arial", margin: 0 }); my += 0.5;
    h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
    h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: ACCENT, font: "Arial" });
    h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.46;
    h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 });
};
