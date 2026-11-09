/* core/validate-color.js — Accepte uniquement une couleur #rrggbb */

// couleur : uniquement #rrggbb
function couleurSure(c){ return (typeof c==="string" && /^#[0-9a-fA-F]{6}$/.test(c)) ? c : ""; }
