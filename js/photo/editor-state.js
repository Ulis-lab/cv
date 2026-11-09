/* photo/editor-state.js — État de la fenêtre de recadrage */

/* ============================================================
   MODALE
   ============================================================ */
let _pe = null; // éléments de la modale (créés au 1er usage)

let _pst = null; // état en cours : {orig, img, iw, ih, z, cx, cy} (cx,cy en PX de l'image source)

let _peLiberer = null;
