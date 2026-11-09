/* core/filename.js — Nom de fichier proposé pour les exports (prénom_nom) */

/* Nom de fichier : accents retirés (é → e) pour éviter les soucis sur certains ordinateurs */
function nomFichier(){return ((data.prenom||"CV")+"_"+(data.nom||"")).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]/g,"_").replace(/_+/g,"_")||"CV";}
