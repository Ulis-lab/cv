/* photo/photo-file.js — Lit un fichier image, garde une copie réduite */

/* ---- lit un fichier image, garde une copie réduite de l'original ----
   cb(origDataURL, imgElement) ; les erreurs affichent un message clair */
function photoDepuisFichier(file, cb){
  if(!file) return;
  if(file.type && file.type.indexOf("image/") !== 0){ alerter("Ce fichier n'est pas une image. Choisis un fichier .jpg ou .png."); return; }
  if(file.size > 25 * 1024 * 1024){ alerter("Cette image est trop lourde (25 Mo maximum). Choisis une image plus petite."); return; }
  const r = new FileReader();
  r.onload = ev => {
    const img = new Image();
    img.onload = () => {
      try{
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const k = Math.min(1, PHOTO_ORIG_MAX / Math.max(iw, ih));
        const cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(iw * k)); cv.height = Math.max(1, Math.round(ih * k));
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        const orig = cv.toDataURL("image/jpeg", 0.88);
        const small = new Image();
        small.onload = () => cb(orig, small);
        small.onerror = () => alerter("Impossible de lire cette image. Essaie un autre fichier (.jpg ou .png).");
        small.src = orig;
      }catch(e){ console.error(e); alerter("Impossible de lire cette image. Essaie un autre fichier (.jpg ou .png)."); }
    };
    img.onerror = () => alerter("Impossible de lire cette image. Essaie un autre fichier (.jpg ou .png).");
    img.src = ev.target.result;
  };
  r.onerror = () => alerter("Impossible de lire ce fichier.");
  r.readAsDataURL(file);
}
