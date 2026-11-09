/* preview/templates/m5.js — Aperçu HTML du modèle m5 (doit rester synchronisé avec pptx/templates/m5.js) */

R.m5 = ()=>`<div>${photoBox("ph-photo")}<div class="cv-name">${vh("prenom")} ${vh("nom")}</div>
    <div class="role">${vh("metier")}</div><div class="contact-center">${contact("row")}</div>
    <h3>Profil</h3><div class="prof">${vhBr("profil")}</div>
    <h3>Expérience professionnelle</h3>${expHtml()}<h3>Formation</h3>${formHtml()}
    <h3>Compétences</h3><div class="compact">${listeInline("competences")}</div>
    <h3>Langues</h3><div class="compact">${listeInline("langues")}</div>
    <h3>Centres d'intérêt</h3><div class="compact">${listeInline("interets")}</div></div>`;
