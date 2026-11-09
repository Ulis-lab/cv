/* ============================================================
   MODELES PPTX — logique partagée (navigateur + Node pour tests)
   Expose une fonction globale: construirePPTX(PptxGenJS, data, templateId, helpers)
   - helpers.degrade(c1,c2,w,h,sens) -> Promise<dataURI>
   - helpers.icone(type,couleurHex) -> Promise<dataURI>
   Retourne une instance pptx prête à écrire.
   ============================================================ */
(function (root) {
  const PW = 8.27, PH = 11.69;

  // découpe un texte multi-lignes en items pour puces
  function lignes(txt) {
    return (txt || "").split("\n").map(t => t.trim()).filter(Boolean);
  }

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
  // contexte du rendu en cours (taille/police réelles après personnalisation), rempli par construirePPTX
  // INTERRUPTEUR : mettre false pour revenir au calcul d'avant (Beta 0.3.4 : 1 puce = 1 ligne, pas de mesure du texte)
  const CALCUL_LIGNES = true;
  const _ctx = { sf: x => x, sp: x => x, hBas: null }; // hBas : bas réel du texte (centré dans sa boîte) pour la mesure "une page"
  const LH = pt => pt * 1.2 / 72; // hauteur d'une ligne de texte, en pouces
  // nombre de lignes EN PLUS (au-delà d'une par puce) pour une liste de puces
  function lignesEnPlus(items, largIn, ptBase, police) {
    const pt = _ctx.sf(ptBase), pol = _ctx.sp(police);
    return items.reduce((a, t) => a + (nbLignes(t, largIn, pt, pol) - 1), 0);
  }
  function val(v, def) { return (v && String(v).trim()) ? v : def; }
  // contacts à imprimer : uniquement ceux qui sont remplis (pas de faux exemple)
  function contactItems(d) {
    const it = [["tel", d.tel], ["mail", d.email], ["ville", d.ville]];
    if (d.permis && String(d.permis).trim()) it.push(["permis", d.permis]);
    return it.filter(x => x[1] && String(x[1]).trim());
  }

  // contacts en colonne (icône + texte)
  async function contactsColonne(s, pptx, H, x, y, w, cIcone, cTexte, d, taille) {
    taille = taille || 10;
    const items = contactItems(d);
    const ic = 0.15;
    for (const [type, txt] of items) {
      const img = await H.icone(type, cIcone);
      s.addImage({ data: img, x: x + 0.02, y: y + 0.055, w: ic, h: ic });
      s.addText(txt, { x: x + ic + 0.14, y: y, w: w - ic - 0.14, h: 0.26, fontSize: taille, color: cTexte, fontFace: "Arial", margin: 0, valign: "middle" });
      y += 0.32;
    }
    return y;
  }
  // contacts en ligne horizontale (avec retour à la ligne si ça dépasse maxW)
  async function contactsLigne(s, pptx, H, x, y, cIcone, cTexte, d, taille, maxW) {
    taille = taille || 10;
    maxW = maxW || 6.0; // largeur max avant retour à la ligne
    const items = contactItems(d);
    const ic = 0.15;
    let cx = x, cy = y;
    for (const [type, txt] of items) {
      const txtW = 0.18 + txt.length * 0.072;
      const largeurItem = ic + 0.12 + txtW;
      // si l'item dépasse la largeur max, on passe à la ligne suivante
      if (cx + largeurItem > x + maxW && cx > x) { cx = x; cy += 0.3; }
      const img = await H.icone(type, cIcone);
      s.addImage({ data: img, x: cx, y: cy + 0.03, w: ic, h: ic });
      s.addText(txt, { x: cx + ic + 0.12, y: cy - 0.02, w: txtW, h: 0.3, fontSize: taille, color: cTexte, fontFace: "Arial", margin: 0 });
      cx += largeurItem + 0.28;
    }
    return cy + 0.3; // renvoie la position Y après le contact
  }
  // contacts en grille fixe 2 colonnes (col2 toujours alignée verticalement)
  async function contactsGrille(s, pptx, H, x, y, colW, cIcone, cTexte, d, taille) {
    taille = taille || 9.5;
    const items = contactItems(d);
    const ic = 0.15, cols = 2, rowH = 0.3;
    for (let i = 0; i < items.length; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = x + col * colW, cy = y + row * rowH;
      const img = await H.icone(items[i][0], cIcone);
      s.addImage({ data: img, x: cx, y: cy + 0.05, w: ic, h: ic });
      // la dernière colonne peut déborder à droite (rien après), on lui laisse de la marge
      const tw = (col === cols - 1) ? colW - ic - 0.12 + 0.6 : colW - ic - 0.12;
      s.addText(items[i][1], { x: cx + ic + 0.12, y: cy, w: tw, h: 0.3, fontSize: taille, color: cTexte, fontFace: "Arial", margin: 0, valign: "middle" });
    }
    return y + Math.ceil(items.length / cols) * rowH;
  }

  // listes (compétences, langues, intérêts) avec valeurs par défaut
  function liste(d, champ, defaut) {
    const arr = (d[champ] && d[champ].length) ? d[champ] : defaut;
    return arr;
  }

  // ---- helpers de contenu communs ----
  function addExperiences(s, pptx, d, MX, MW, myStart, opts) {
    let my = myStart;
    const ab = opts.ab || 1;
    const exps = (d.experiences && d.experiences.length) ? d.experiences : [{ poste: "Intitulé du poste / stage", entreprise: "Nom de l'entreprise, Ville", dates: "MM/AAAA - MM/AAAA", taches: "Mission ou tâche réalisée\nRéussite ou compétence acquise" }];
    exps.forEach(e => {
      s.addText([
        { text: val(e.poste, "Poste"), options: { bold: true, color: opts.ink } },
        { text: "    " + val(e.dates, ""), options: { italic: true, color: "999999", fontSize: 9 } },
      ], { x: MX, y: my, w: MW, h: 0.3, fontSize: 11.5, fontFace: opts.font, margin: 0 });
      my += 0.27 * ab;
      if (e.entreprise) { s.addText(e.entreprise, { x: MX, y: my, w: MW, h: 0.28, fontSize: 10, bold: !opts.italicEnt, italic: !!opts.italicEnt, color: opts.accent, fontFace: opts.font, margin: 0 }); my += 0.27 * ab; }
      const t = lignes(e.taches);
      if (t.length) {
        // largeur réellement disponible : boîte (MW-0.1) - marges internes 2x0.1 - retrait de puce 0.375
        const cfx = opts.cf || 1;
        const lh = LH(_ctx.sf(10.5));
        const en_plus = lignesEnPlus(t, MW - 0.1 - 0.2 - 0.375, 10.5, opts.font) * lh;  // hauteur des lignes en plus (puces longues)
        const hTexte = t.length * lh + en_plus;                                          // hauteur réelle du texte
        // anciennes valeurs conservées quand il y a de la place ; plancher physique quand ça se resserre (sinon chevauchement)
        const hBoite = CALCUL_LIGNES ? Math.max(hTexte + 0.05, (0.2 + t.length * 0.22) * cfx + en_plus) : 0.2 + t.length * 0.22;
        _ctx.hBas = hBoite / 2 + hTexte / 2;
        s.addText(t.map((x, i) => ({ text: x, options: { bullet: true, breakLine: i < t.length - 1 } })), { x: MX + 0.1, y: my, w: MW - 0.1, h: hBoite, fontSize: 10.5, color: opts.ink, fontFace: opts.font });
        const avance = (0.16 + t.length * 0.2 * ab) * cfx + 0.05 + en_plus;
        my += CALCUL_LIGNES ? Math.max(avance, hBoite / 2 + hTexte / 2 + 0.05) : (0.16 + t.length * 0.2 * ab) * cfx + 0.05;
      }
      my += 0.14 * (opts.cf || 1) + 0.05;
    });
    return my;
  }
  function addFormations(s, pptx, d, MX, MW, myStart, opts) {
    let my = myStart;
    const ab = opts.ab || 1;
    const fs = (d.formations && d.formations.length) ? d.formations : [{ diplome: "Intitulé du diplôme / de la classe", etablissement: "Nom de l'établissement, Ville", dates: "2024 - 2025", details: "" }];
    const CF = opts.cf || 1;
    fs.forEach(f => {
      s.addText([
        { text: val(f.diplome, "Diplôme"), options: { bold: true, color: opts.ink } },
        { text: "    " + val(f.dates, ""), options: { italic: true, color: "999999", fontSize: 9 } },
      ], { x: MX, y: my, w: MW, h: 0.3, fontSize: 11.5, fontFace: opts.font, margin: 0 });
      my += 0.27 * ab;
      if (f.etablissement) { s.addText(f.etablissement, { x: MX, y: my, w: MW, h: 0.28, fontSize: 10, bold: !opts.italicEnt, italic: !!opts.italicEnt, color: opts.accent, fontFace: opts.font, margin: 0 }); my += 0.27 * ab; }
      if (f.details) {
        const lh = LH(_ctx.sf(10.5));
        const en_plus = lignesEnPlus([f.details], MW - 0.1 - 0.2 - 0.375, 10.5, opts.font) * lh;
        const hTexte = lh + en_plus;
        const hBoite = CALCUL_LIGNES ? Math.max(hTexte + 0.05, 0.25 + en_plus) : 0.25;
        _ctx.hBas = hBoite / 2 + hTexte / 2;
        s.addText([{ text: f.details, options: { bullet: true } }], { x: MX + 0.1, y: my, w: MW - 0.1, h: hBoite, fontSize: 10.5, color: opts.ink, fontFace: opts.font });
        my += CALCUL_LIGNES ? Math.max(0.25 * ab + en_plus, hBoite / 2 + hTexte / 2 + 0.03) : 0.25 * ab;
      }
      my += 0.16 * CF;
    });
    return my;
  }

  // =====================================================================
  // Construit la présentation (1 slide) pour un modèle donné
  // =====================================================================
  async function construirePASSE(PptxGenJS, d, templateId, H, pas) {
    pas = pas || 0; // nombre de resserrages supplémentaires (0 = normal) pour faire tenir le CV sur UNE page
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: "A4P", width: PW, height: PH });
    pptx.layout = "A4P";

    const NOM = (val(d.prenom, "Prénom") + " " + val(d.nom, "Nom")).trim();
    const METIER = (d.metier && String(d.metier).trim()) ? d.metier : "";
    const PROFIL = val(d.profil, "Quelques phrases pour te présenter : qui tu es, ce que tu recherches et ce qui te motive.");
    const COMP = liste(d, "competences", ["Compétence 1", "Compétence 2", "Compétence 3"]);
    const LANG = liste(d, "langues", ["Français — maternelle", "Anglais — niveau B1"]);
    const INT = liste(d, "interets", ["Loisir 1", "Loisir 2"]);

    // forme de la photo : override perso ('rond'/'carre'), sinon signature du modèle (tous ronds sauf m2 carré adouci)
    const SIGNATURE_PHOTO = { m2: "carre" };
    const formeP = (d.formePhoto === "rond" || d.formePhoto === "carre") ? d.formePhoto : (SIGNATURE_PHOTO[templateId] || "rond");
    const photoRonde = formeP === "rond";
    // rectRadius ne doit JAMAIS être passé à une ellipse (XML invalide → PowerPoint "réparer").
    // -> on ne renvoie {rectRadius} que pour une photo carrée (forme roundRect).
    const rr = (v) => (photoRonde ? {} : { rectRadius: v });
    let photoSrc = d.photo;
    if (d.photo && !photoRonde && H && H.arrondirImage) {
      try { photoSrc = await H.arrondirImage(d.photo, 0.14); } catch (e) { photoSrc = d.photo; }
    }

    // helper image photo : si d.photo (dataURI), on l'insère ; sinon cadre placeholder
    function photo(s, x, y, w, h, ronde, couleurCadre, couleurTexte) {
      if (d.photo) {
        s.addImage({ data: photoSrc, x, y, w, h, rounding: photoRonde, sizing: { type: "cover", w, h } });
      } else {
        const shape = photoRonde ? pptx.ShapeType.ellipse : pptx.ShapeType.roundRect;
        s.addShape(shape, { x, y, w, h, fill: { color: couleurCadre }, line: { color: couleurTexte, width: 1.5 } });
        s.addText("PHOTO", { x, y: y + h / 2 - 0.15, w, h: 0.3, align: "center", fontSize: 10, bold: true, color: couleurTexte, fontFace: "Arial" });
      }
    }

    const S = pptx.ShapeType;
    let s;

    // facteurs de taille (curseurs) — appliqués à toutes les tailles de police
    const fName = (d.scaleName || 100) / 100;
    const fTitle = (d.scaleTitle || 100) / 100;
    const fBody = (d.scaleBody || 100) / 100;

    // ===== COMPACTAGE AUTOMATIQUE basé sur la hauteur réelle estimée =====
    // On estime la hauteur (en pouces) que prendra le contenu, puis on calcule
    // le facteur cf nécessaire pour que tout tienne dans la page A4 (11.69").
    const nExp = (d.experiences && d.experiences.length) ? d.experiences.length : 1;
    const nForm = (d.formations && d.formations.length) ? d.formations.length : 1;
    let nbTaches = 0;
    (d.experiences && d.experiences.length ? d.experiences : [{ taches: "x\nx" }]).forEach(e => { nbTaches += Math.max(1, lignes(e.taches).length); });
    let nbDetails = 0;
    (d.formations && d.formations.length ? d.formations : [{ details: "x" }]).forEach(f => { if (f.details) nbDetails++; });

    // hauteur fixe (en-tête + profil + titres de sections + listes comp/langues/intérêts)
    // ces éléments ne sont PAS compactés. On réserve large pour être sûr que ça rentre.
    // lignes supplémentaires dues aux puces longues (texte qui passe à la ligne) : espace NON compressible
    const MW_EST = { m1: 4.57, m6: 4.47, m7: 4.47, m10: 4.47, m5: 6.47 }[templateId] || 6.87;
    const policeEst = d.police || "Arial";
    const ptEst = 10.5 * fBody;
    const largEst = MW_EST - 0.1 - 0.2 - 0.375;
    let lignesPlus = 0;
    (d.experiences || []).forEach(e => { lignes(e.taches).forEach(x => { lignesPlus += nbLignes(x, largEst, ptEst, policeEst) - 1; }); });
    (d.formations || []).forEach(f => { if (f.details) lignesPlus += nbLignes(f.details, largEst, ptEst, policeEst) - 1; });
    const lignesProfil = nbLignes(PROFIL, MW_EST, 10.5 * fBody, policeEst);
    const hauteurFixe = 6.6 + lignesPlus * LH(ptEst) + Math.max(0, lignesProfil - 3) * LH(ptEst);
    // hauteur "compactable" : expériences (0.65"/exp + 0.24"/tâche) + formations (0.65"/form + 0.3"/détail)
    const hExp = nExp * 0.65 + nbTaches * 0.24;
    const hForm = nForm * 0.65 + nbDetails * 0.30;
    const hGaps = (nExp + nForm) * 0.28; // espaces inter-blocs
    const hCompactable = hExp + hForm + hGaps;
    // place disponible pour la partie compactable
    const dispo = 11.69 - hauteurFixe - 0.3; // marge basse de sécurité
    let cf = 1;
    if (hCompactable > dispo && hCompactable > 0) {
      cf = Math.max(0.25, (dispo / hCompactable) * 0.9);
    }
    // si vraiment très chargé, on réduit AUSSI la taille du corps de texte
    let autoBody = 1;
    if (cf < 0.75) autoBody = Math.max(0.78, 0.72 + (cf - 0.25) * 0.6);
    if (pas > 0) { cf = cf * Math.pow(0.9, pas); autoBody = Math.max(0.66, autoBody * Math.pow(0.96, pas)); } // resserrage progressif si ça déborde
    // classe une taille de police par catégorie et applique le bon facteur
    function scaleFont(sz) {
      if (typeof sz !== "number") return sz;
      if (sz >= 20) return Math.round(sz * fName * 10) / 10;        // nom / prénom
      if (sz >= 12) return Math.round(sz * fTitle * 10) / 10;       // titres de sections + métier
      return Math.round(sz * fBody * autoBody * 10) / 10;           // texte courant (+ réduction auto)
    }

    // ===== PERSONNALISATION couleur + police =====
    // couleur d'accent de référence pour chaque modèle (celle qu'on remplace si l'utilisateur choisit une couleur)
    const ACCENT_REF = { m1:"33373D", m2:"C2492B", m4:"0E7C7B", m5:"C9A24B", m6:"5B2C6F", m7:"6B5B95", m8:"2E8B73", m9:"5B4BC4", m10:"C75B7A" };
    const couleurPerso = (d.couleur || "").replace("#", "").toUpperCase();
    const refAccent = (ACCENT_REF[templateId] || "").toUpperCase();
    const policePerso = d.police || "";
    function subCouleur(c) {
      if (!couleurPerso || !c) return c;
      if (String(c).toUpperCase() === refAccent) return couleurPerso;
      return c;
    }
    function subPolice(f) { return policePerso || f; }
    _ctx.sf = scaleFont; _ctx.sp = subPolice;
    // hauteur du bloc "Profil" d'après la longueur réelle du texte (pas de marge interne : margin 0)
    function hProfil(txt, w, pt, font, hBase) {
      const L = nbLignes(txt, w, scaleFont(pt), subPolice(font));
      return Math.max(hBase, L * LH(scaleFont(pt)) + 0.06);
    }
    let bas = 0; // point le plus bas atteint par un texte (pour vérifier que tout tient sur la page)

    // wrappe addSlide pour intercepter addText/addShape/addImage sur chaque slide
    const _addSlide = pptx.addSlide.bind(pptx);
    pptx.addSlide = function () {
      const sl = _addSlide();
      const _addText = sl.addText.bind(sl);
      const _addShape = sl.addShape.bind(sl);
      const _setBg = (v) => { Object.defineProperty(sl, "background", { value: v, writable: true, configurable: true }); };
      sl.addText = function (txt, opts) {
        if (opts) {
          opts = Object.assign({}, opts);
          if (typeof opts.fontSize === "number") opts.fontSize = scaleFont(opts.fontSize);
          if (opts.color) opts.color = subCouleur(opts.color);
          if (opts.fontFace) opts.fontFace = subPolice(opts.fontFace);
        }
        if (Array.isArray(txt)) {
          txt = txt.map(it => {
            if (it && it.options) {
              const o = Object.assign({}, it.options);
              if (typeof o.fontSize === "number") o.fontSize = scaleFont(o.fontSize);
              if (o.color) o.color = subCouleur(o.color);
              if (o.fontFace) o.fontFace = subPolice(o.fontFace);
              return Object.assign({}, it, { options: o });
            }
            return it;
          });
        }
        if (opts && typeof opts.y === "number" && typeof opts.h === "number") {
          if (_ctx.hBas != null) { bas = Math.max(bas, opts.y + _ctx.hBas); } else { bas = Math.max(bas, opts.y + opts.h); }
        }
        _ctx.hBas = null;
        return _addText(txt, opts);
      };
      // intercepter les formes pour recolorer les fonds/bandeaux d'accent
      sl.addShape = function (type, opts) {
        if (opts && couleurPerso) {
          opts = Object.assign({}, opts);
          if (opts.fill && opts.fill.color) opts.fill = Object.assign({}, opts.fill, { color: subCouleur(opts.fill.color) });
          if (opts.line && opts.line.color) opts.line = Object.assign({}, opts.line, { color: subCouleur(opts.line.color) });
        }
        return _addShape(type, opts);
      };
      return sl;
    };

    // ===================== MODELE 1 : Bleu colonne =====================
    if (templateId === "m1") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const SIDE = 2.9, NAVY = "33373D", LIGHT = "C9CDD3";
      s.addShape(S.rect, { x: 0, y: 0, w: SIDE, h: PH, fill: { color: NAVY }, line: { type: "none" } });
      photo(s, (SIDE - 1.7) / 2, 0.6, 1.7, 1.7, true, "474C54", "FFFFFF");
      let y = 2.7;
      const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 }); s.addShape(S.line, { x: 0.35, y: y + 0.32, w: SIDE - 0.7, h: 0, line: { color: LIGHT, width: 1 } }); y += 0.5; };
      const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.32; };
      if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "D9E2F3", "FFFFFF", d); }
      y += 0.2; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
      y += 0.2; h3("Langues"); LANG.forEach(l => tx(l));
      y += 0.2; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
      const MX = SIDE + 0.4, MW = PW - MX - 0.4;
      s.addText(NOM, { x: MX, y: 0.7, w: MW, h: 0.6, fontSize: 30, bold: true, color: NAVY, fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: MX, y: 1.32, w: MW, h: 0.35, fontSize: 13, italic: true, color: "555555", fontFace: "Arial", margin: 0 });
      let my = 2.0;
      const mh3 = (t) => { s.addText(t.toUpperCase(), { x: MX, y: my, w: MW, h: 0.35, fontSize: 15, bold: true, color: NAVY, fontFace: "Arial", margin: 0 }); s.addShape(S.line, { x: MX, y: my + 0.38, w: MW, h: 0, line: { color: NAVY, width: 1.5 } }); my += 0.55; };
      mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.7); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.95 + (ph - 0.7); }
      mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: NAVY, font: "Arial" });
      mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "333333", accent: NAVY, font: "Arial" });
    }

    // ===================== MODELE 2 : Corail en-tête =====================
    else if (templateId === "m2") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const DARK = "2B2B2B", ACCENT = "C2492B";
      s.addShape(S.rect, { x: 0, y: 0, w: PW, h: 1.95, fill: { color: DARK }, line: { type: "none" } });
      photo(s, PW - 2.0, 0.35, 1.25, 1.25, false, "3D3D3D", "FFFFFF");
      s.addText(NOM, { x: 0.7, y: 0.4, w: 5, h: 0.55, fontSize: 27, bold: true, color: "FFFFFF", fontFace: "Cambria", margin: 0 });
      s.addText(METIER, { x: 0.7, y: 0.98, w: 5, h: 0.3, fontSize: 12.5, italic: true, color: "F2D7CC", fontFace: "Arial", margin: 0 });
      await contactsGrille(s, pptx, H, 0.7, 1.31, 2.026, "F2D7CC", "FFFFFF", d, 9.5);
      const MX = 0.7, MW = PW - 1.4; let my = 2.15;
      const h3 = (t) => { s.addText(t.toUpperCase(), { x: MX, y: my, w: MW, h: 0.32, fontSize: 14, bold: true, color: ACCENT, fontFace: "Cambria", margin: 0 }); my += 0.39; };
      h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.64 + (ph - 0.5); }
      h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: ACCENT, font: "Arial" });
      h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: ACCENT, font: "Arial" });
      h3("Compétences"); s.addText(COMP.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.46;
      h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.46;
      h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 });
    }

    // ===================== MODELE 4 : Teal moderne =====================
    else if (templateId === "m4") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const TEAL = "0E7C7B", DARK = "17252A", SOFT = "DEF2F1";
      s.addShape(S.rect, { x: 0, y: 0, w: PW, h: 1.943, fill: { color: TEAL }, line: { type: "none" } });
      s.addText(NOM, { x: 0.7, y: 0.236, w: 5.2, h: 0.6, fontSize: 29, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: 0.7, y: 0.782, w: 5.2, h: 0.3, fontSize: 12.5, italic: true, color: "DEF2F1", fontFace: "Arial", margin: 0 });
      await contactsGrille(s, pptx, H, 0.7, 1.147, 1.738, "DEF2F1", "FFFFFF", d, 9.5);
      // photo qui chevauche
      const ringM4 = photoRonde ? S.ellipse : S.roundRect;
      if (d.photo) { s.addImage({ data: photoSrc, x: PW - 2.165, y: 1.082, w: 1.44, h: 1.44, rounding: photoRonde, sizing: { type: "cover", w: 1.44, h: 1.44 } }); s.addShape(ringM4, { x: PW - 2.235, y: 1.012, w: 1.58, h: 1.58, ...rr(0.22), fill: { type: "none" }, line: { color: "FFFFFF", width: 3 } }); }
      else { s.addShape(ringM4, { x: PW - 2.235, y: 1.012, w: 1.58, h: 1.58, ...rr(0.22), fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 3 } }); s.addShape(ringM4, { x: PW - 2.165, y: 1.082, w: 1.44, h: 1.44, ...rr(0.2), fill: { color: SOFT }, line: { type: "none" } }); s.addText("PHOTO", { x: PW - 2.165, y: 1.682, w: 1.44, h: 0.3, align: "center", fontSize: 10, bold: true, color: TEAL, fontFace: "Arial" }); }
      const MX = 0.7, MW = PW - 1.4; let my = 2.24;
      const h3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.02, w: 0.2, h: 0.2, fill: { color: TEAL }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.05, w: MW - 0.35, h: 0.35, fontSize: 14, bold: true, color: DARK, fontFace: "Arial", margin: 0 }); my += 0.46; };
      h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.55); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.72 + (ph - 0.55); }
      h3("Compétences");
      let cx = MX; COMP.forEach(c => { const w = 0.25 + c.length * 0.075; s.addShape(S.roundRect, { x: cx, y: my, w, h: 0.34, rectRadius: 0.17, fill: { color: SOFT }, line: { type: "none" } }); s.addText(c, { x: cx, y: my, w, h: 0.34, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: TEAL, fontFace: "Arial", margin: 0 }); cx += w + 0.15; }); my += 0.62;
      h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "333333", accent: TEAL, font: "Arial" });
      h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: TEAL, font: "Arial" });
      h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.46;
      h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 });
    }

    // ===================== MODELE 5 : Sombre doré =====================
    else if (templateId === "m5") {
      s = pptx.addSlide();
      const BG = "1C1C24", GOLD = "C9A24B", LIGHT = "EDEDED", MUTED = "9A9AA5";
      s.background = { color: BG };
      photo(s, (PW - 1.35) / 2, 0.3, 1.35, 1.35, true, "2A2A33", GOLD);
      s.addText(NOM, { x: 0.7, y: 1.75, w: PW - 1.4, h: 0.55, fontSize: 28, bold: true, color: LIGHT, align: "center", charSpacing: 2, fontFace: "Cambria", margin: 0 });
      s.addText(METIER, { x: 0.7, y: 2.28, w: PW - 1.4, h: 0.3, fontSize: 12.5, italic: true, color: GOLD, align: "center", fontFace: "Cambria", margin: 0 });
      await contactsLigne(s, pptx, H, 0.9, 2.62, "C9A24B", "9A9AA5", d, 9.5, 6.8);
      const MX = 0.9, MW = PW - 1.8; let my = 3.1;
      const h3 = (t) => { s.addText(t.toUpperCase(), { x: MX, y: my, w: MW, h: 0.3, fontSize: 13, bold: true, color: GOLD, charSpacing: 3, fontFace: "Cambria", margin: 0 }); s.addShape(S.line, { x: MX, y: my + 0.34, w: MW, h: 0, line: { color: "3A3A44", width: 0.75 } }); my += 0.5; };
      h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Cambria", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: LIGHT, fontFace: "Cambria", margin: 0 }); my += 0.7 + (ph - 0.5); }
      h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: LIGHT, accent: GOLD, font: "Cambria", italicEnt: true });
      h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: LIGHT, accent: GOLD, font: "Cambria", italicEnt: true });
      h3("Compétences"); s.addText(COMP.join("   •   "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: LIGHT, fontFace: "Cambria", margin: 0 }); my += 0.46;
      h3("Langues"); s.addText(LANG.join("   •   "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: LIGHT, fontFace: "Cambria", margin: 0 }); my += 0.46;
      h3("Centres d'intérêt"); s.addText(INT.join("   •   "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: LIGHT, fontFace: "Cambria", margin: 0 });
    }

    // ===================== MODELE 6 : Violet créatif =====================
    else if (templateId === "m6") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const SIDE = 2.95, PURPLE = "5B2C6F", YELLOW = "F2C14E";
      s.addShape(S.rect, { x: 0, y: 0, w: SIDE, h: PH, fill: { color: PURPLE }, line: { type: "none" } });
      photo(s, (SIDE - 1.8) / 2, 0.55, 1.8, 1.8, true, "744086", YELLOW);
      let y = 2.7;
      const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: YELLOW, fontFace: "Arial", margin: 0 }); y += 0.42; };
      const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.32; };
      if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "F2C14E", "FFFFFF", d); }
      y += 0.25; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
      y += 0.25; h3("Langues"); LANG.forEach(l => tx(l));
      y += 0.25; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
      const MX = SIDE + 0.45, MW = PW - MX - 0.4;
      s.addText(val(d.prenom, "PRÉNOM"), { x: MX, y: 0.7, w: MW, h: 0.55, fontSize: 30, bold: true, color: PURPLE, fontFace: "Arial", margin: 0 });
      s.addText(val(d.nom, "NOM"), { x: MX, y: 1.25, w: MW, h: 0.55, fontSize: 30, bold: true, color: YELLOW, fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: MX, y: 1.9, w: MW, h: 0.35, fontSize: 12, italic: true, color: "555555", fontFace: "Arial", margin: 0 });
      let my = 2.6;
      const mh3 = (t) => { s.addShape(S.roundRect, { x: MX, y: my, w: 0.18, h: 0.3, rectRadius: 0.05, fill: { color: YELLOW }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.32, y: my - 0.02, w: MW - 0.32, h: 0.35, fontSize: 15, bold: true, color: PURPLE, fontFace: "Arial", margin: 0 }); my += 0.5; };
      mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.6); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: "333333", fontFace: "Arial", margin: 0 }); my += 0.85 + (ph - 0.6); }
      mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: PURPLE, font: "Arial" });
      mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: PURPLE, font: "Arial" });
    }

    // ===================== MODELE 7 : Pastel lavande =====================
    else if (templateId === "m7") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const SIDE = 2.95, LAV = "E7E0F5", LAV_DARK = "6B5B95", ACCENT = "9B86C9", INK = "3A3A4A";
      s.addShape(S.rect, { x: 0, y: 0, w: SIDE, h: PH, fill: { color: LAV }, line: { type: "none" } });
      photo(s, (SIDE - 1.8) / 2, 0.55, 1.8, 1.8, true, "FFFFFF", ACCENT);
      let y = 2.7;
      const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: LAV_DARK, fontFace: "Arial", margin: 0 }); y += 0.42; };
      const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: INK, fontFace: "Arial", margin: 0 }); y += 0.32; };
      if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "9B86C9", INK, d); }
      y += 0.25; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
      y += 0.25; h3("Langues"); LANG.forEach(l => tx(l));
      y += 0.25; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
      const MX = SIDE + 0.45, MW = PW - MX - 0.4;
      s.addText(NOM, { x: MX, y: 0.75, w: MW, h: 0.6, fontSize: 28, bold: true, color: LAV_DARK, fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: MX, y: 1.4, w: MW, h: 0.35, fontSize: 12, italic: true, color: "777777", fontFace: "Arial", margin: 0 });
      let my = 2.2;
      const mh3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.03, w: 0.2, h: 0.2, fill: { color: ACCENT }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.04, w: MW - 0.35, h: 0.35, fontSize: 15, bold: true, color: LAV_DARK, fontFace: "Arial", margin: 0 }); my += 0.5; };
      mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.6); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.85 + (ph - 0.6); }
      mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
      mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
    }

    // ===================== MODELE 8 : Pastel menthe =====================
    else if (templateId === "m8") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const MINT = "CDEDE3", MINT_DARK = "2E8B73", PEACH = "FBE3D6", INK = "333333";
      s.addShape(S.rect, { x: 0, y: 0, w: PW, h: 2.0, fill: { color: MINT }, line: { type: "none" } });
      photo(s, PW - 2.05, 0.4, 1.3, 1.3, true, "FFFFFF", MINT_DARK);
      s.addText(NOM, { x: 0.7, y: 0.233, w: 5, h: 0.55, fontSize: 28, bold: true, color: MINT_DARK, fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: 0.7, y: 0.833, w: 5, h: 0.3, fontSize: 12.5, italic: true, color: "5A6B66", fontFace: "Arial", margin: 0 });
      await contactsGrille(s, pptx, H, 0.7, 1.243, 1.954, "2E8B73", "5A6B66", d, 9.5);
      const MX = 0.7, MW = PW - 1.4; let my = 2.14;
      const h3 = (t) => { s.addShape(S.roundRect, { x: MX, y: my, w: 0.18, h: 0.3, rectRadius: 0.05, fill: { color: PEACH }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.32, y: my - 0.02, w: MW - 0.32, h: 0.35, fontSize: 14, bold: true, color: MINT_DARK, fontFace: "Arial", margin: 0 }); my += 0.46; };
      h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: INK, fontFace: "Arial", margin: 0 }); my += 0.72 + (ph - 0.5); }
      h3("Compétences");
      let cx = MX; COMP.forEach(c => { const w = 0.25 + c.length * 0.075; s.addShape(S.roundRect, { x: cx, y: my, w, h: 0.34, rectRadius: 0.17, fill: { color: MINT }, line: { type: "none" } }); s.addText(c, { x: cx, y: my, w, h: 0.34, align: "center", valign: "middle", fontSize: 9.5, bold: true, color: MINT_DARK, fontFace: "Arial", margin: 0 }); cx += w + 0.15; }); my += 0.62;
      h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: MINT_DARK, font: "Arial" });
      h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: MINT_DARK, font: "Arial" });
      h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.46;
      h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 });
    }

    // ===================== MODELE 9 : Dégradé bleu→violet =====================
    else if (templateId === "m9") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const ACCENT = "5B4BC4", INK = "333333";
      const grad = await H.degrade("4A6CF7", "9B4BC4", PW, 2.1, "diagonal");
      s.addImage({ data: grad, x: 0, y: 0, w: PW, h: 2.1 });
      const ringM9 = photoRonde ? S.ellipse : S.roundRect;
      if (d.photo) { s.addImage({ data: photoSrc, x: PW - 1.641, y: 1.11, w: 1.34, h: 1.34, rounding: photoRonde, sizing: { type: "cover", w: 1.34, h: 1.34 } }); s.addShape(ringM9, { x: PW - 1.711, y: 1.04, w: 1.48, h: 1.48, ...rr(0.2), fill: { type: "none" }, line: { color: "FFFFFF", width: 2 } }); }
      else { s.addShape(ringM9, { x: PW - 1.711, y: 1.04, w: 1.48, h: 1.48, ...rr(0.2), fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 2 } }); s.addShape(ringM9, { x: PW - 1.641, y: 1.11, w: 1.34, h: 1.34, ...rr(0.18), fill: { color: "ECE9FB" }, line: { type: "none" } }); s.addText("PHOTO", { x: PW - 1.641, y: 1.66, w: 1.34, h: 0.3, align: "center", fontSize: 10, bold: true, color: ACCENT, fontFace: "Arial" }); }
      s.addText(NOM, { x: 0.7, y: 0.25, w: 5, h: 0.6, fontSize: 30, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: 0.7, y: 0.87, w: 5, h: 0.3, fontSize: 12.5, italic: true, color: "EDE9FB", fontFace: "Arial", margin: 0 });
      await contactsGrille(s, pptx, H, 0.7, 1.28, 1.954, "EDE9FB", "FFFFFF", d, 9.5);
      const MX = 0.7, MW = PW - 1.4; let my = 2.28;
      const h3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.03, w: 0.2, h: 0.2, fill: { color: ACCENT }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.04, w: MW - 0.35, h: 0.35, fontSize: 14, bold: true, color: ACCENT, fontFace: "Arial", margin: 0 }); my += 0.46; };
      h3("Profil"); { const ph = hProfil(PROFIL, MW, 11, "Arial", 0.5); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 11, color: INK, fontFace: "Arial", margin: 0 }); my += 0.72 + (ph - 0.5); }
      h3("Compétences"); s.addText(COMP.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 11, color: INK, fontFace: "Arial", margin: 0 }); my += 0.5;
      h3("Expérience professionnelle"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
      h3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: "262626", accent: ACCENT, font: "Arial" });
      h3("Langues"); s.addText(LANG.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.46;
      h3("Centres d'intérêt"); s.addText(INT.join("     •     "), { x: MX, y: my, w: MW, h: 0.3, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 });
    }

    // ===================== MODELE 10 : Dégradé pêche→rose colonne =====================
    else if (templateId === "m10") {
      s = pptx.addSlide(); s.background = { color: "FFFFFF" };
      const SIDE = 2.95, ACCENT = "C75B7A", INK = "3A3A4A";
      const grad = await H.degrade("F7B7A3", "D98AAE", SIDE, PH, "vertical");
      s.addImage({ data: grad, x: 0, y: 0, w: SIDE, h: PH });
      photo(s, (SIDE - 1.8) / 2, 0.55, 1.8, 1.8, true, "FFFFFF", ACCENT);
      let y = 2.7;
      const h3 = (t) => { s.addText(t.toUpperCase(), { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 12, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.42; };
      const tx = (t) => { s.addText(t, { x: 0.35, y, w: SIDE - 0.7, h: 0.3, fontSize: 10, color: "FFFFFF", fontFace: "Arial", margin: 0 }); y += 0.32; };
      if (contactItems(d).length) { h3("Contact"); y = await contactsColonne(s, pptx, H, 0.35, y, SIDE - 0.7, "FFFFFF", "FFFFFF", d); }
      y += 0.25; h3("Compétences"); COMP.forEach(c => tx("•  " + c));
      y += 0.25; h3("Langues"); LANG.forEach(l => tx(l));
      y += 0.25; h3("Centres d'intérêt"); INT.forEach(i => tx("•  " + i));
      const MX = SIDE + 0.45, MW = PW - MX - 0.4;
      s.addText(NOM, { x: MX, y: 0.75, w: MW, h: 0.6, fontSize: 28, bold: true, color: ACCENT, fontFace: "Arial", margin: 0 });
      s.addText(METIER, { x: MX, y: 1.4, w: MW, h: 0.35, fontSize: 12, italic: true, color: "777777", fontFace: "Arial", margin: 0 });
      let my = 2.2;
      const mh3 = (t) => { s.addShape(S.ellipse, { x: MX, y: my + 0.03, w: 0.2, h: 0.2, fill: { color: ACCENT }, line: { type: "none" } }); s.addText(t.toUpperCase(), { x: MX + 0.35, y: my - 0.04, w: MW - 0.35, h: 0.35, fontSize: 15, bold: true, color: ACCENT, fontFace: "Arial", margin: 0 }); my += 0.5; };
      mh3("Profil"); { const ph = hProfil(PROFIL, MW, 10.5, "Arial", 0.6); s.addText(PROFIL, { x: MX, y: my, w: MW, h: ph, fontSize: 10.5, color: INK, fontFace: "Arial", margin: 0 }); my += 0.85 + (ph - 0.6); }
      mh3("Expérience"); my = addExperiences(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
      mh3("Formation"); my = addFormations(s, pptx, d, MX, MW, my, { cf, ab: autoBody, ink: INK, accent: ACCENT, font: "Arial" });
    }

    pptx.__bas = bas;
    return pptx;
  }

  // Construit le CV ; s'il dépasse la page, on resserre (espaces puis taille du texte) et on recommence : toujours UNE page.
  const BAS_MAX = PH - 0.1;
  async function construirePPTX(PptxGenJS, d, templateId, H) {
    let p = await construirePASSE(PptxGenJS, d, templateId, H, 0);
    if (!CALCUL_LIGNES) return p; // ancien comportement
    for (let pas = 1; pas <= 14 && p.__bas > BAS_MAX; pas++) p = await construirePASSE(PptxGenJS, d, templateId, H, pas);
    p.__tient = p.__bas <= BAS_MAX;
    return p;
  }

  root.construirePPTX = construirePPTX;
})(typeof window !== "undefined" ? window : globalThis);
