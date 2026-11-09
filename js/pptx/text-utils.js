/* pptx/text-utils.js — Petits outils texte : découpe en puces, valeur par défaut, contacts remplis */

// découpe un texte multi-lignes en items pour puces
function lignes(txt) {
  return (txt || "").split("\n").map(t => t.trim()).filter(Boolean);
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
