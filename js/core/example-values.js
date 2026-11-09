/* core/example-values.js — Valeurs affichées dans l'aperçu : le texte saisi, ou un exemple si le champ est vide */

function nl2br(t){return esc(t).replace(/\n/g,"<br>");}

function items(t){return (t||"").split("\n").map(x=>x.trim()).filter(Boolean);}

function liToHtml(t){const l=items(t);return l.length?"<ul>"+l.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>":"";}

// valeur réelle si remplie, sinon l'exemple (pour que le CV ne soit jamais vide)
function v(cle){
  if(data[cle] && String(data[cle]).trim()) return data[cle];
  if(modeExport && SANS_EXEMPLE_EXPORT.indexOf(cle)>=0) return "";
  return exemples[cle]||"";
}

// liste réelle si remplie, sinon liste d'exemple
function vListe(cle){ return (data[cle] && data[cle].length) ? data[cle] : items(exemples[cle]); }

// expériences réelles si au moins une remplie, sinon l'exemple
function vExp(){
  const remplies = (data.experiences||[]).filter(e=>e.poste||e.entreprise||e.dates||e.taches);
  return remplies.length ? remplies : [exemples.exp];
}

function vForm(){
  const remplies = (data.formations||[]).filter(f=>f.diplome||f.etablissement||f.dates||f.details);
  return remplies.length ? remplies : [exemples.form];
}

// ----- aperçu : repérer le texte d'exemple (grisé) et savoir quel champ du formulaire il représente -----

// vrai si le champ est vide et que l'aperçu affiche donc un exemple (jamais en mode export : l'exemple n'est alors pas grisé)
function estExemple(cle){
  if(modeExport) return false;
  const x=data[cle];
  return !(x && (Array.isArray(x) ? x.length : String(x).trim()));
}

// classe CSS « ex » (exemple grisé) à ajouter si besoin
function exCls(cle){ return estExemple(cle) ? " ex" : ""; }

// texte d'un champ simple, échappé, avec le repère du champ (clic dans l'aperçu = va au champ)
function vh(cle){ const h=esc(v(cle)); return h ? `<span data-f="${cle}" class="fld${exCls(cle)}">${h}</span>` : ""; }

// idem pour un texte sur plusieurs lignes (le profil)
function vhBr(cle){ const h=nl2br(v(cle)); return h ? `<span data-f="${cle}" class="fld${exCls(cle)}">${h}</span>` : ""; }

// liste sur une seule ligne : « a  •  b  •  c » (chaque élément est échappé)
function listeInline(cle){ return `<span data-f="${cle}" class="fld${exCls(cle)}">${vListe(cle).map(esc).join("  •  ")}</span>`; }
