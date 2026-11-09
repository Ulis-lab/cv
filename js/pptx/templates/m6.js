/* pptx/templates/m6.js — Modèle PPTX m6 (doit rester synchronisé avec preview/templates/m6.js) */

PPTX_MODELES.m6 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const SIDE = 2.95, PURPLE = "5B2C6F", YELLOW = "F2C14E";
    s.addShape(S.rect, { x: 0, y: 0, w: SIDE, h: PH, fill: { color: PURPLE }, line: { type: "none" } });
    photo(s, (SIDE - 1.8) / 2, 0.55, 1.8, 1.8, true, "744086", YELLOW);
    let y = 2.7;
    const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: YELLOW, fontFace: "Arial", margin: 0 }); y += 0.42; };
    const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.32; };
    if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "F2C14E", "FFFFFF", d); }
    y += 0.25; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
    y += 0.25; h3("Langues"); LANG.forEach(l => tx(l));
    y += 0.25; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
    const MX = SIDE + 0.45, MW = PW - MX - 0.4;
    s.addText(val(d.prenom, "PRÉNOM"), { x: MX, y: 0.7, w: MW, h: 0.55, fontSize: 30, bold: true, color: PURPLE, fontFace: "Arial", margin: 0 });
    s.addText(val(d.nom, "NOM"), { x: MX, y: 1.25, w: MW, h: 0.55, fontSize: 30, bold: true, color: YELLOW, fontFace: "Arial", margin: 0 });
    s.addText(METIER, { x: MX, y: 1.9, w: MW, h: 0.35, fontSize: 12, italic: true, color: "555555", fontFace: "Arial", margin: 0 });
    let my = 2.6;
    const mh3 = (t) => { s.addShape(S.roundRect, { x: MX, y: my, w: 0.18, h: 0.3, rectRadius: 0.05, fill: { color: YELLOW }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.32, y: my - 0.02, w: MW - 0.32, h: 0.35, fontSize: 15, bold: true, color: PURPLE, fontFace: "Arial", margin: 0 }); my += 0.5; };
    mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.6); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.85 + (ph - 0.6); }
    mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: PURPLE, font: "Arial" });
    mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: PURPLE, font: "Arial" });
};
