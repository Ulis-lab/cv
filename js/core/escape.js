/* core/escape.js — Échappe le texte avant de l'afficher en HTML (protection XSS) */

// échappe TOUT ce qui peut casser du HTML, y compris les guillemets (sinon un texte peut sortir d'un attribut value="...")
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
