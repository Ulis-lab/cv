/* pptx/text-utils.js — Petits outils texte : découpe en puces, valeur par défaut, contacts remplis */

// découpe un texte multi-lignes en items pour puces
function lignes(txt) {
  return (txt || "").split("\n").map(t => t.trim()).filter(Boolean);
}

// Ligne « titre + date » d'une expérience / formation : la date est alignée à droite (comme l'aperçu et le PDF).
// Si le titre est trop long pour partager la ligne avec la date, on garde l'ancienne présentation (date juste après le titre).
function addTitreDate(s, titre, dates, opts, MX, y, MW) {
  const dt = String(dates || "").trim();
  const sf = (_ctx && _ctx.sf) ? _ctx.sf : (x => x);
  const wDate = dt ? largMot(dt) / 1000 * sf(9) / 72 * 1.1 + 0.1 : 0;               // largeur de la date en pouces (+ marge de sécurité)
  const wTitre = largMot(String(titre)) / 1000 * sf(11.5) / 72 * 1.2 * (COEF_POLICE[opts.font] || 1.1);  // titre en gras : un peu plus large
  if (dt && wTitre + wDate + 0.3 <= MW) {
    s.addText(titre, { x: MX, y, w: MW - wDate - 0.05, h: 0.3, fontSize: 11.5, bold: true, color: opts.ink, fontFace: opts.font, margin: 0 });
    s.addText(dt, { x: MX + MW - wDate, y: y + 0.03, w: wDate, h: 0.3, fontSize: 9, italic: true, color: "999999", align: "right", fontFace: opts.font, margin: 0 });
  } else {
    s.addText([
      { text: titre, options: { bold: true, color: opts.ink } },
      { text: "    " + dt, options: { italic: true, color: "999999", fontSize: 9 } },
    ], { x: MX, y, w: MW, h: 0.3, fontSize: 11.5, fontFace: opts.font, margin: 0 });
  }
}

function val(v, def) { return (v && String(v).trim()) ? v : def; }

// contacts à imprimer : uniquement ceux qui sont remplis (pas de faux exemple)
function contactItems(d) {
  const it = [["tel", d.tel], ["mail", d.email], ["ville", d.ville]];
  if (d.permis && String(d.permis).trim()) it.push(["permis", d.permis]);
  return it.filter(x => x[1] && String(x[1]).trim());
}

// listes (compétences, langues, intérêts) avec valeurs par défaut
function liste(d, champ, defaut) {
  const arr = (d[champ] && d[champ].length) ? d[champ] : defaut;
  return arr;
}
