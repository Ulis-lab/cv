/* preview/templates/m8.js — Aperçu HTML du modèle m8 (doit rester synchronisé avec pptx/templates/m8.js) */

R.m8 = ()=>`<div class="hd"><div><div class="cv-name">${vh("prenom")} ${vh("nom")}</div><div class="role">${vh("metier")}</div>
    <div class="contact-row">${contact("row")}</div></div>${photoBox("ph-photo")}</div>
    <div class="bd"><h3>Profil</h3><div class="prof">${vhBr("profil")}</div>
    <h3>Compétences</h3><div class="tags${exCls("competences")}" data-f="competences">${vListe("competences").map(c=>`<span class="tag">${esc(c)}</span>`).join("")}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Langues</h3><div class="prof">${listeInline("langues")}</div>
    <h3>Centres d'intérêt</h3><div class="prof">${listeInline("interets")}</div></div>`;
