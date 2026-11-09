/* pptx/templates/m1.js — Modèle PPTX m1 (doit rester synchronisé avec preview/templates/m1.js) */

PPTX_MODELES.m1 = async function (c) {
  const { pptx, H, S, d, NOM, METIER, PROFIL, COMP, LANG, INT, cf, autoBody, photo, hProfil } = c;
  let s;
    s = pptx.addSlide(); s.background = { color: "FFFFFF" };
    const SIDE = 2.9, NAVY = "33373D", LIGHT = "C9CDD3";
    s.addShape(S.rect, { x: 0, y: 0, w: SIDE, h: PH, fill: { color: NAVY }, line: { type: "none" } });
    photo(s, (SIDE - 1.7) / 2, 0.6, 1.7, 1.7, true, "474C54", "FFFFFF");
    let y = 2.7;
    const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 }); s.addShape(S.line, { x: 0.35, y: y + 0.32, w: SIDE - 0.7, h: 0, line: { color: LIGHT, width: 1 } }); y += 0.5; };
    const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.32; };
    if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "D9E2F3", "FFFFFF", d); }
    y += 0.2; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
    y += 0.2; h3("Langues"); LANG.forEach(l => tx(l));
    y += 0.2; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
    const MX = SIDE + 0.4, MW = PW - MX - 0.4;
    s.addText(NOM, { x: MX, y: 0.7, w: MW, h: 0.6, fontSize: 30, bold: true, color: NAVY, fontFace: "Arial", margin: 0 });
    s.addText(METIER, { x: MX, y: 1.32, w: MW, h: 0.35, fontSize: 13, italic: true, color: "555555", fontFace: "Arial", margin: 0 });
    let my = 2.0;
    const mh3 = (t) => { s.addText(t.toUpperCase(), { x: MX, y: my, w: MW, h: 0.35, fontSize: 15, bold: true, color: NAVY, fontFace: "Arial", margin: 0 }); s.addShape(S.line, { x: MX, y: my + 0.38, w: MW, h: 0, line: { color: NAVY, width: 1.5 } }); my += 0.55; };
    mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.7); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.95 + (ph - 0.7); }
    mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: NAVY, font: "Arial" });
    mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "333333", accent: NAVY, font: "Arial" });
};
