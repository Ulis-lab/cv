/* pptx/constants.js — Dimensions de la page A4 (en pouces) + interrupteur du calcul des lignes */

// Page A4 portrait, en pouces
const PW = 8.27, PH = 11.69;

// INTERRUPTEUR : mettre false pour revenir au calcul d'avant (Beta 0.3.4 : 1 puce = 1 ligne, pas de mesure du texte)
const CALCUL_LIGNES = true;

// Point le plus bas autorisé pour le texte (le CV doit tenir sur UNE page)
const BAS_MAX = PH - 0.1;
