/* pptx/image-helpers.js — Images pour le PPTX : dégradés, icônes colorées, photo aux coins arrondis */

/* ============================================================
   HELPERS NAVIGATEUR (sans aucune librairie externe)
   - degrade(c1,c2,w,h,sens) : dégradé via <canvas>, renvoie dataURI
   - icone(type,couleurHex)  : icône SVG inline, renvoie dataURI
   Ces fonctions remplacent sharp/react-icons côté navigateur.
   ============================================================ */
(function (root) {

  // Dégradé linéaire généré avec un canvas -> dataURI PNG
  function degrade(c1, c2, w, h, sens) {
    return new Promise((resolve) => {
      const W = Math.round(w * 96), H = Math.round(h * 96);
      const cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d");
      let g;
      if (sens === "horizontal") g = ctx.createLinearGradient(0, 0, W, 0);
      else if (sens === "diagonal") g = ctx.createLinearGradient(0, 0, W, H);
      else g = ctx.createLinearGradient(0, 0, 0, H); // vertical
      g.addColorStop(0, "#" + c1);
      g.addColorStop(1, "#" + c2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // dataURI complet ; pptxgenjs accepte "image/png;base64,...." ou "data:image/png;base64,..."
      resolve(cv.toDataURL("image/png"));
    });
  }

  // Tracés SVG des 3 icônes (chemins FontAwesome, viewBox 0 0 512 512 ou 384/576)
  const PATHS = {
    // téléphone
    tel: { vb: "0 0 512 512", d: "M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" },
    // enveloppe
    mail: { vb: "0 0 512 512", d: "M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" },
    // localisation
    ville: { vb: "0 0 384 512", d: "M168.3 499.2C116.1 435 0 279.4 0 192 0 86 86 0 192 0s192 86 192 192c0 87.4-116.1 243-168.3 307.2-12.3 15.3-35.1 15.3-47.4 0zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z" },
    // permis : voiture (FontAwesome fa-car)
    permis: { vb: "0 0 640 512", d: "M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM160 464a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm320 0a48 48 0 1 1 0-96 48 48 0 1 1 0 96z" }
  };

  function icone(type, couleurHex) {
    return new Promise((resolve) => {
      const p = PATHS[type] || PATHS.ville;
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + p.vb + '"><path fill="#' + couleurHex + '" d="' + p.d + '"/></svg>';
      // encode en base64 (gestion accents non nécessaire ici)
      const b64 = btoa(svg);
      resolve("data:image/svg+xml;base64," + b64);
    });
  }

  root.cvHelpers = { degrade: degrade, icone: icone, arrondirImage: arrondirImage };

  // Arrondit les coins d'une image (déjà carrée) -> dataURI PNG transparent aux angles.
  // Sert au "carré adouci" dans le pptx (pptxgenjs ne sait faire que le cercle sur une image).
  function arrondirImage(dataURI, rayonFrac) {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          const w = img.width, h = img.height;
          const cv = document.createElement("canvas");
          cv.width = w; cv.height = h;
          const ctx = cv.getContext("2d");
          const r = Math.min(w, h) * (rayonFrac || 0.14);
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(w - r, 0); ctx.arcTo(w, 0, w, r, r);
          ctx.lineTo(w, h - r); ctx.arcTo(w, h, w - r, h, r);
          ctx.lineTo(r, h); ctx.arcTo(0, h, 0, h - r, r);
          ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, w, h);
          resolve(cv.toDataURL("image/png"));
        };
        img.onerror = () => resolve(dataURI);
        img.src = dataURI;
      } catch (e) { resolve(dataURI); }
    });
  }
})(window);

