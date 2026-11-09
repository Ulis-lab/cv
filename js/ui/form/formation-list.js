/* ui/form/formation-list.js — Cartes « Mes formations » */

function buildFormList(){
  const n=data.formations.length;
  document.getElementById("form-list").innerHTML=data.formations.map((f,i)=>`
    <div class="repeat-item">
      <div class="item-head"><span class="item-num">Formation ${i+1}</span>
        <span class="item-tools">
          <button type="button" class="mv-btn" data-mv-form="${i}" data-dir="-1" ${i===0?"disabled":""} title="Monter" aria-label="Monter">↑</button>
          <button type="button" class="mv-btn" data-mv-form="${i}" data-dir="1" ${i===n-1?"disabled":""} title="Descendre" aria-label="Descendre">↓</button>
          <button type="button" class="remove-btn" data-rm-form="${i}" title="Supprimer" aria-label="Supprimer">×</button>
        </span></div>
      <label class="field"><span class="lab">Diplôme / classe</span><input type="text" data-form="${i}" data-f="diplome" value="${esc(f.diplome)}" placeholder="${esc(exemples.form.diplome)}"></label>
      <label class="field"><span class="lab">Établissement, ville</span><input type="text" data-form="${i}" data-f="etablissement" value="${esc(f.etablissement)}" placeholder="${esc(exemples.form.etablissement)}"></label>
      <label class="field"><span class="lab">Dates</span><input type="text" data-form="${i}" data-f="dates" value="${esc(f.dates)}" placeholder="${esc(exemples.form.dates)}"></label>
      <label class="field"><span class="lab">Détails (optionnel)</span><input type="text" data-form="${i}" data-f="details" value="${esc(f.details)}" placeholder="${esc(exemples.form.details)}"></label>
    </div>`).join("");
}
