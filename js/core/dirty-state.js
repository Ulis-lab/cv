/* core/dirty-state.js — Suivi « modifié / sauvegardé » du CV (pour l'alerte de fermeture) */

function markModifie(){ modifie=true; if(window.cvApp&&window.cvApp.setModifie) window.cvApp.setModifie(true); planifierAuto(); }

function markSauve(){ modifie=false; if(window.cvApp&&window.cvApp.setModifie) window.cvApp.setModifie(false); }
