/* core/focus-trap.js — Garde le focus clavier dans une fenêtre modale et le rend à la fermeture */

/* ---------- ACCESSIBILITÉ : fenêtre modale (focus piégé dedans, retour au bouton d'origine à la fermeture) ----------
   usage : const liberer = piegeFocus(overlayElement); ... liberer(); */
function piegeFocus(ov){
  const avant = document.activeElement;
  const SEL = 'button:not([disabled]),[href],input:not([disabled]):not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const cibles = () => Array.from(ov.querySelectorAll(SEL)).filter(e => e.offsetParent !== null || e === document.activeElement);
  const kd = e => {
    if(e.key !== "Tab") return;
    const l = cibles(); if(!l.length) return;
    const a = l[0], z = l[l.length-1];
    if(!ov.contains(document.activeElement)){ e.preventDefault(); a.focus(); }
    else if(e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); }
    else if(!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
  };
  document.addEventListener("keydown", kd, true);
  return () => { document.removeEventListener("keydown", kd, true); try{ if(avant && avant.focus && document.contains(avant)) avant.focus(); }catch(_){} };
}
