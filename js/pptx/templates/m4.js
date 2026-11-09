/* pptx/templates/m4.js — Modèle PPTX m4 (doit rester synchronisé avec preview/templates/m4.js) */

PPTX_MODELES.m4 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, photoRonde, rr, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const TEAL = "0E7C7B", DARK = "17252A", SOFT = "DEF2F1";
    s.addShape(S.rect, { x: 0, y: 0, w: PW, h: 1.943, fill: { color: TEAL }, line: { type: "none" } });
    s.addText(NOM, { x: 0.7, y: 0.236, w: 5.2, h: 0.6, fontSize: 29, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 });
    s.addText(METIER, { x: 0.7, y: 0.782, w: 5.2, h: 0.3, fontSize: 12.5, italic: true, color: "DEF2F1", fontFace: "Arial", margin: 0 });
    await contactsGrille(s, pptx, H, 0.7, 1.147, 1.738, "DEF2F1", "FFFFFF", d, 9.5);
    // photo qui chevauche
    const ringM4 = photoRonde ? S.ellipse : S.roundRect;
    if (d.photo) { s.addImage({ data: photoSrc, x: PW - 2.165, y: 1.082, w: 1.44, h: 1.44, rounding: photoRonde, sizing: { type: "cover", w: 1.44, h: 1.44 } }); s.addShape(ringM4, { x: PW - 2.235, y: 1.012, w: 1.58, h: 1.58, ...rr(0.22), fill: { type: "none" }, line: { color: "FFFFFF", width: 3 } }); }
    else { s.addShape(ringM4, { x: PW - 2.235, y: 1.012, w: 1.58, h: 1.58, ...rr(0.22), fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 3 } }); s.addShape(ringM4, { x: PW - 2.165, y: 1.082, w: 1.44, h: 1.44, ...rr(0.2), fill: { color: SOFT }, line: { type: "none" } }); s.addText("PHOTO", { x: PW - 2.165, y: 1.682, w: 1.44, h: 0.3, align: "center", fontSize: 10, bold: true, color: TEAL, fontFace: "Arial" }); }
    const MX = 0.7, MW = PW - 1.4; let my = 2.24;
    const h3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.02, w: 0.2, h: 0.2, fill: { color: TEAL }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.05, w: MW - 0.35, h: 0.35, fontSize: 14, bold: true, color: DARK, fontFace: "Arial", margin: 0 }); my += 0.46; };
    h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.55); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.72 + (ph - 0.55); }
    h3("Compétences");
    let cx = MX; COMP.forEach(c => { const w = 0.25 + c.length * 0.075; s.addShape(S.roundRect, { x: cx, y: my, w, h: 0.34, rectRadius: 0.17, fill: { color: SOFT }, line: { type: "none" } }); s.addText(c, { x: cx, y: my, w, h: 0.34, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: TEAL, fontFace: "Arial", margin: 0 }); cx += w + 0.15; }); my += 0.62;
    h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "333333", accent: TEAL, font: "Arial" });
    h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: TEAL, font: "Arial" });
    h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.46;
    h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 });
};
