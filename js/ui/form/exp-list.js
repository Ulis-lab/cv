/* ui/form/exp-list.js — Cartes « Mes expériences » (ajout, déplacement, suppression) */

function buildExpList(){
  const n=data.experiences.length;
  document.getElementById("exp-list").innerHTML=data.experiences.map((e,i)=>`
    <div class="repeat-item">
      <div class="item-head"><span class="item-num">Expérience ${i+1}</span>
        <span class="item-tools">
          <button type="button" class="mv-btn" data-mv-exp="${i}" data-dir="-1" ${i===0?"disabled":""} title="Monter" aria-label="Monter">↑</button>
          <button type="button" class="mv-btn" data-mv-exp="${i}" data-dir="1" ${i===n-1?"disabled":""} title="Descendre" aria-label="Descendre">↓</button>
          <button type="button" class="remove-btn" data-rm-exp="${i}" title="Supprimer" aria-label="Supprimer">×</button>
        </span></div>
      <label class="field"><span class="lab">Poste / stage</span><input type="text" data-exp="${i}" data-f="poste" value="${esc(e.poste)}" placeholder="${esc(exemples.exp.poste)}"></label>
      <label class="field"><span class="lab">Entreprise, ville</span><input type="text" data-exp="${i}" data-f="entreprise" value="${esc(e.entreprise)}" placeholder="${esc(exemples.exp.entreprise)}"></label>
      <label class="field"><span class="lab">Dates</span><input type="text" data-exp="${i}" data-f="dates" value="${esc(e.dates)}" placeholder="${esc(exemples.exp.dates)}"></label>
      <label class="field"><span class="lab">Missions (une par ligne)</span><textarea data-exp="${i}" data-f="taches" placeholder="${esc(exemples.exp.taches)}">${esc(e.taches)}</textarea></label>
    </div>`).join("");
}
