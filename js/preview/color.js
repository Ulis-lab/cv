/* preview/color.js — Couleur personnalisée appliquée à l'aperçu */

// applique la couleur personnalisée aux éléments d'accent de l'aperçu
function appliquerCouleurApercu(sheet){
  // retire l'ancien style éventuel
  let st=document.getElementById("cv-couleur-style");
  if(!couleurSure(data.couleur)){ if(st) st.remove(); return; }
  if(!st){ st=document.createElement("style"); st.id="cv-couleur-style"; document.head.appendChild(st); }
  const c=couleurSure(data.couleur);
  // Principe : on colore les accents qui sont sur fond BLANC (titres du corps, rôle, etc.)
  // MAIS le contenu posé sur un fond coloré (colonnes .col-side, bandeaux .hd) doit rester BLANC
  // sinon il devient invisible (texte/icône de la couleur du fond).
  st.textContent=`
    /* fonds colorés prennent la couleur perso */
    #cv-sheet.m1 .col-side, #cv-sheet.m6 .col-side, #cv-sheet.m10 .col-side { background:${c} !important; }
    #cv-sheet.m2 .hd, #cv-sheet.m4 .hd, #cv-sheet.m9 .hd { background:${c} !important; }

    /* accents sur fond BLANC -> prennent la couleur perso */
    #cv-sheet .col-main h3, #cv-sheet .bd h3, #cv-sheet.m5 h3 { color:${c} !important; border-color:${c} !important; }
    #cv-sheet .col-main h3::before, #cv-sheet .bd h3::before { background:${c} !important; }
    #cv-sheet .role { color:${c} !important; }
    #cv-sheet .cv-entry .sub { color:${c} !important; }
    #cv-sheet.m1 .cv-name, #cv-sheet.m7 .cv-name, #cv-sheet.m8 .cv-name, #cv-sheet.m10 .cv-name { color:${c} !important; }
    #cv-sheet .rule { border-color:${c} !important; }
    #cv-sheet .tag { background:${c}22 !important; color:${c} !important; }
    /* icônes : colorées seulement sur fond blanc (contact en ligne des modèles à corps blanc) */
    #cv-sheet.m5 .ico { color:${c}; }

    /* contenu SUR fond coloré -> forcé en BLANC pour rester visible */
    #cv-sheet.m1 .col-side, #cv-sheet.m1 .col-side h3, #cv-sheet.m1 .col-side .ln, #cv-sheet.m1 .col-side li,
    #cv-sheet.m6 .col-side, #cv-sheet.m6 .col-side h3, #cv-sheet.m6 .col-side .ln, #cv-sheet.m6 .col-side li,
    #cv-sheet.m10 .col-side, #cv-sheet.m10 .col-side h3, #cv-sheet.m10 .col-side .ln, #cv-sheet.m10 .col-side li { color:#fff !important; }
    #cv-sheet.m1 .col-side .ico, #cv-sheet.m6 .col-side .ico, #cv-sheet.m10 .col-side .ico { color:#fff !important; }
    #cv-sheet.m2 .hd, #cv-sheet.m2 .hd *, #cv-sheet.m4 .hd, #cv-sheet.m4 .hd *,
    #cv-sheet.m9 .hd, #cv-sheet.m9 .hd * { color:#fff !important; }
    #cv-sheet.m2 .hd .ico, #cv-sheet.m4 .hd .ico, #cv-sheet.m9 .hd .ico { color:#fff !important; }
  `;
}
