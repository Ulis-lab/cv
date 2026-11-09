/* pptx/text-metrics.js — Mesure du texte (largeur des lettres d'Arial) pour compter les lignes d'une puce longue */

/* ---------- ESTIMATION DU NOMBRE DE LIGNES (texte qui passe à la ligne) ----------
   Largeurs des caractères d'Arial (en 1/1000 em, identiques à Liberation Sans). Les autres polices sont
   approchées par un coefficient, volontairement un peu large : mieux vaut un peu d'espace en trop qu'un chevauchement. */
const W_ARIAL = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584];

const W_EXTRA = {"–": 556, "—": 1000, "€": 556, "°": 400, "…": 1000, "’": 222, "«": 556, "»": 556, "œ": 944, "Œ": 1000, "ç": 500, "Ç": 722, "•": 350};

const COEF_POLICE = { "Arial": 1, "Cambria": 1.02, "Calibri": 0.93, "Georgia": 1.12, "Verdana": 1.2, "Comic Sans MS": 1.15 };

function largCar(ch) {
  const c = ch.charCodeAt(0);
  if (c >= 32 && c <= 126) return W_ARIAL[c - 32];
  if (W_EXTRA[ch] != null) return W_EXTRA[ch];
  const b = ch.normalize("NFD").charAt(0); // é -> e, à -> a ...
  const cb = b.charCodeAt(0);
  if (cb >= 32 && cb <= 126) return W_ARIAL[cb - 32];
  return 650; // caractère inconnu : on suppose large
}

function largMot(m) { let w = 0; for (const ch of m) w += largCar(ch); return w; }

// nombre de lignes pour `txt` dans une zone de `largIn` pouces, en police `pt` points
function nbLignes(txt, largIn, pt, police) {
  if (!CALCUL_LIGNES) return 1;
  const coef = (COEF_POLICE[police] || 1.1) * 1.04; // 4 % de marge de sécurité
  const maxU = (largIn * 72 / pt) * 1000 / coef;     // largeur disponible en 1/1000 em
  const esp = W_ARIAL[0];
  let lignes = 1, cur = 0;
  String(txt || "").split(/\s+/).filter(Boolean).forEach(m => {
    const wm = largMot(m);
    if (cur === 0) { cur = 0; }
    const besoin = cur === 0 ? wm : cur + esp + wm;
    if (besoin <= maxU) { cur = besoin; return; }
    if (cur === 0 || wm > maxU) {                    // mot plus long qu'une ligne : il est coupé
      const reste = (cur === 0 ? wm : wm);
      lignes += (cur === 0 ? 0 : 1) + Math.max(0, Math.ceil(reste / maxU) - 1);
      cur = reste % maxU || 0;
    } else { lignes++; cur = wm; }
  });
  return lignes;
}

const _ctx = { sf: x => x, sp: x => x, hBas: null }; // hBas : bas réel du texte (centré dans sa boîte) pour la mesure "une page"

const LH = pt => pt * 1.2 / 72; // hauteur d'une ligne de texte, en pouces

// nombre de lignes EN PLUS (au-delà d'une par puce) pour une liste de puces
function lignesEnPlus(items, largIn, ptBase, police) {
  const pt = _ctx.sf(ptBase), pol = _ctx.sp(police);
  return items.reduce((a, t) => a + (nbLignes(t, largIn, pt, pol) - 1), 0);
}
