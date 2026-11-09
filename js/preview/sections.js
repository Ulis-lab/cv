/* preview/sections.js — Blocs Expérience / Formation / listes de l'aperçu */

function expHtml(){const ex=vExp();
  const exemple=!modeExport&&!(data.experiences||[]).some(e=>e.poste||e.entreprise||e.dates||e.taches); // aucune expérience saisie : on montre un exemple grisé
  return ex.map(e=>`<div class="cv-entry fld${exemple?" ex":""}" data-f="experiences"><div class="row"><span class="ttl">${esc(e.poste||exemples.exp.poste)}</span><span class="dt">${esc(e.dates||exemples.exp.dates)}</span></div><div class="sub">${esc(e.entreprise||exemples.exp.entreprise)}</div>${liToHtml(e.taches||exemples.exp.taches)}</div>`).join("");}

function formHtml(){const fs=vForm();
  const exemple=!modeExport&&!(data.formations||[]).some(f=>f.diplome||f.etablissement||f.dates||f.details);
  return fs.map(f=>`<div class="cv-entry fld${exemple?" ex":""}" data-f="formations"><div class="row"><span class="ttl">${esc(f.diplome||exemples.form.diplome)}</span><span class="dt">${esc(f.dates||exemples.form.dates)}</span></div><div class="sub">${esc(f.etablissement||exemples.form.etablissement)}</div>${f.details?"<ul><li>"+esc(f.details)+"</li></ul>":""}</div>`).join("");}

function sideUl(arr,cle){return `<ul style='margin-left:4mm' data-f="${cle}" class="fld${cle?exCls(cle):""}">`+arr.map(x=>`<li style="font-size:10pt;margin-bottom:1mm">${esc(x)}</li>`).join("")+"</ul>";}
