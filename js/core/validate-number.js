/* core/validate-number.js — Borne un nombre entre un min et un max */

// nombre borné
function nombreSur(n,min,max,def){ n=Number(n); return isFinite(n) ? Math.min(max,Math.max(min,n)) : def; }
