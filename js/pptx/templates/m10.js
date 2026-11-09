/* pptx/templates/m10.js — Modèle PPTX m10 (doit rester synchronisé avec preview/templates/m10.js) */

PPTX_MODELES.m10 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const SIDE = 2.95, ACCENT = "C75B7A", INK = "3A3A4A";
    const grad = await H.degrade("F7B7A3", "D98AAE", SIDE, PH, "vertical");
    s.addImage({ data: grad, x: 0, y: 0, w: SIDE, h: PH });
    photo(s, (SIDE - 1.8) / 2, 0.55, 1.8, 1.8, true, "FFFFFF", ACCENT);
    let y = 2.7;
    const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.42; };
    const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.32; };
    if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "FFFFFF", "FFFFFF", d); }
    y += 0.25; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
    y += 0.25; h3("Langues"); LANG.forEach(l => tx(l));
    y += 0.25; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
    const MX = SIDE + 0.45, MW = PW - MX - 0.4;
    s.addText(NOM, { x: MX, y: 0.75, w: MW, h: 0.6, fontSize: 28, bold: true, color: ACCENT, fontFace: "Arial", margin: 0 });
    s.addText(METIER, { x: MX, y: 1.4, w: MW, h: 0.35, fontSize: 12, italic: true, color: "777777", fontFace: "Arial", margin: 0 });
    let my = 2.2;
    const mh3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.03, w: 0.2, h: 0.2, fill: { color: ACCENT }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.04, w: MW - 0.35, h: 0.35, fontSize: 15, bold: true, color: ACCENT, fontFace: "Arial", margin: 0 }); my += 0.5; };
    mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.6); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.85 + (ph - 0.6); }
    mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
    mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
};
