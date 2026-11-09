/* pptx/slide-intercept.js — Intercepte addText/addShape de chaque diapo : applique tailles, couleurs, police et mesure le bas du contenu */

function installerInterception(pptx, perso, etat) {
  const { scaleFont, subCouleur, subPolice, couleurPerso } = perso;
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
        if (_ctx.hBas != null) { etat.bas = Math.max(etat.bas, opts.y + _ctx.hBas); } else { etat.bas = Math.max(etat.bas, opts.y + opts.h); }
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
}
