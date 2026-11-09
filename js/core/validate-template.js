/* core/validate-template.js — Vérifie qu'un id de modèle existe (évite __proto__, constructor...) */

// l'id de modèle doit être l'un des modèles connus (évite "__proto__", "constructor"...)
function modeleValide(id){ return typeof id==="string" && templates.some(t=>t.id===id); }
