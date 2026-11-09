/* core/validate-image.js — Accepte uniquement de vraies images jpeg/png (data-URL) de taille raisonnable */

/* ---------- VALIDATION (sécurité) : on ne fait confiance à aucune donnée venant d'un fichier ---------- */
const RE_IMG=/^data:image\/(jpeg|png);base64,[A-Za-z0-9+\/]+={0,2}$/;

// photo : uniquement une vraie image jpeg/png en data-URL (sinon rien)
function imgSure(s){ return (typeof s==="string" && s.length<8000000 && RE_IMG.test(s)) ? s : ""; }
