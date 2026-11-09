/* preview/templates/m1.js — Aperçu HTML du modèle m1 (doit rester synchronisé avec pptx/templates/m1.js) */

R.m1 = ()=>`<div class="twocol"><div class="col-side">${photoBox("ph-photo")}
    ${contactBloc()}
    <h3>Compétences</h3>${sideUl(vListe("competences"),"competences")}
    <h3>Langues</h3>${sideUl(vListe("langues"),"langues")}
    <h3>Centres d'intérêt</h3>${sideUl(vListe("interets"),"interets")}</div>
    <div class="col-main"><div class="cv-name">${vh("prenom")} ${vh("nom")}</div><div class="role">${vh("metier")}</div>
    <h3>Profil</h3><div class="prof">${vhBr("profil")}</div>
    <h3>Formation</h3>${formHtml()}<h3>Expérience</h3>${expHtml()}</div></div>`;
