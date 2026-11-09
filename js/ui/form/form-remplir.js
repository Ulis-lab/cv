/* ui/form/form-remplir.js — Onglet « Remplir mon CV » (HTML) */

function buildFormRemplir(){
  const p=document.getElementById("tab-remplir");
  p.innerHTML=`
    <h2>Ma photo</h2>
    <div class="photo-zone"><div id="photo-holder"></div>
      <div class="photo-actions">
        <button type="button" id="btn-photo" class="primary">Ajouter une photo</button>
        <button type="button" id="btn-photo-crop">✂ Recadrer / zoomer</button>
        <button type="button" id="btn-photo-del" style="background:transparent;border:none;color:var(--ui-danger);text-decoration:underline;padding:0;font-size:12px;text-align:left;">Retirer</button>
      </div></div>
    <input type="file" id="photo-input" accept="image/*" style="display:none">
    <h2>Qui suis-je ?</h2>
    <label class="field"><span class="lab">Prénom</span><input type="text" data-k="prenom" value="${esc(data.prenom)}" placeholder="${esc(exemples.prenom)}"></label>
    <label class="field"><span class="lab">Nom</span><input type="text" data-k="nom" value="${esc(data.nom)}" placeholder="${esc(exemples.nom)}"></label>
    <label class="field"><span class="lab">Métier / formation visée</span><input type="text" data-k="metier" value="${esc(data.metier)}" placeholder="${esc(exemples.metier)}"></label>
    <h2>Pour me contacter</h2>
    <label class="field"><span class="lab">Téléphone</span><input type="text" data-k="tel" value="${esc(data.tel)}" placeholder="${esc(exemples.tel)}"></label>
    <label class="field"><span class="lab">E-mail</span><input type="text" data-k="email" value="${esc(data.email)}" placeholder="${esc(exemples.email)}"></label>
    <label class="field"><span class="lab">Ville</span><input type="text" data-k="ville" value="${esc(data.ville)}" placeholder="${esc(exemples.ville)}"></label>
    <label class="field"><span class="lab">Permis (optionnel)</span><input type="text" data-k="permis" value="${esc(data.permis)}" placeholder="${esc(exemples.permis)}"></label>
    <h2>Présentation / Profil</h2>
    <label class="field"><textarea data-k="profil" placeholder="${esc(exemples.profil)}">${esc(data.profil)}</textarea></label>
    <h2>Mes expériences</h2>
    <div id="exp-list"></div>
    <button type="button" class="add-btn" id="add-exp">+ Ajouter une expérience</button>
    <h2>Mes formations</h2>
    <div id="form-list"></div>
    <button type="button" class="add-btn" id="add-form">+ Ajouter une formation</button>
    <h2>Mes compétences</h2>
    <label class="field"><span class="lab">Une par ligne</span><textarea data-list="competences" placeholder="${esc(exemples.competences)}">${esc(data.competences.join("\n"))}</textarea></label>
    <h2>Langues</h2>
    <label class="field"><span class="lab">Une par ligne</span><textarea data-list="langues" placeholder="${esc(exemples.langues)}">${esc(data.langues.join("\n"))}</textarea></label>
    <h2>Loisirs / centres d'intérêt</h2>
    <label class="field"><span class="lab">Un par ligne</span><textarea data-list="interets" placeholder="${esc(exemples.interets)}">${esc(data.interets.join("\n"))}</textarea></label>
  `;
  renderPhotoHolder(); buildExpList(); buildFormList(); wireForm();
}
