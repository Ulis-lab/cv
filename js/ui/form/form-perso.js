/* ui/form/form-perso.js — Onglet « Personnalisation » (HTML) */

function buildFormPerso(){
  const p=document.getElementById("tab-perso");
  p.innerHTML=`
    <h2>Couleur du CV</h2>
    <label class="field"><span class="lab">Couleur principale du modèle</span>
      <div style="display:flex;gap:10px;align-items:center">
        <input type="color" id="cv-couleur" value="${couleurSure(data.couleur)||"#2f5aa8"}" style="width:50px;height:38px;border:1px solid var(--ui-border);border-radius:8px;cursor:pointer;background:none">
        <button type="button" id="cv-couleur-reset" style="font-size:12px">Couleur d'origine</button>
      </div>
      <small style="color:var(--ui-muted);font-size:11px">Laisse vide pour garder la couleur d'origine du modèle choisi.</small>
    </label>

    <h2>Police du CV</h2>
    <label class="field"><span class="lab">Style d'écriture</span>
      <select id="cv-police" style="width:100%;padding:9px 11px;border:1px solid var(--ui-border);border-radius:8px;font:inherit;font-size:14px;background:var(--ui-input);color:var(--ui-text)">
        ${POLICES.map(f=>`<option value="${f.id}" ${data.police===f.id?"selected":""}>${f.nom}</option>`).join("")}
      </select></label>

    <h2>Forme de la photo</h2>
    <label class="field"><span class="lab">Style du cadre photo</span>
      <div style="display:flex;gap:8px">
        <button type="button" id="forme-rond" class="forme-btn ${formePhotoEffective()==="rond"?"active":""}">⬤ Ronde</button>
        <button type="button" id="forme-carre" class="forme-btn ${formePhotoEffective()==="carre"?"active":""}">▢ Carré adouci</button>
      </div>
      <small style="color:var(--ui-muted);font-size:11px">S'applique à la photo du modèle affiché (aperçu + export).</small>
    </label>

    <h2>Taille du texte</h2>
    <label class="field"><span class="lab">Nom & Prénom : <b id="val-name">${nombreSur(data.scaleName,50,150,100)}%</b></span>
      <input type="range" id="sc-name" min="50" max="150" step="5" value="${nombreSur(data.scaleName,50,150,100)}" style="width:100%"></label>
    <label class="field"><span class="lab">Titres de sections : <b id="val-title">${nombreSur(data.scaleTitle,50,150,100)}%</b></span>
      <input type="range" id="sc-title" min="50" max="150" step="5" value="${nombreSur(data.scaleTitle,50,150,100)}" style="width:100%"></label>
    <label class="field"><span class="lab">Texte courant : <b id="val-body">${nombreSur(data.scaleBody,70,140,100)}%</b></span>
      <input type="range" id="sc-body" min="70" max="140" step="5" value="${nombreSur(data.scaleBody,70,140,100)}" style="width:100%"></label>

    <button type="button" id="sc-reset" style="font-size:12px;margin-bottom:6px">↺ Tailles d'origine</button>

    <h2>Apparence de l'application</h2>
    <label class="field"><span class="lab">Mode d'affichage</span>
      <button type="button" id="btn-theme2" class="primary" style="width:100%">🌙 Activer le mode nuit</button></label>
  `;
  wirePerso();
}
