const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const path = require("path");
const fs = require("fs");

let win;
let cvModifie = false; // true si le CV a des modifs non sauvegardées

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    title: "Créateur de CV — Beta 0.5.1",
    icon: path.join(__dirname, "..", "assets", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });
  win.removeMenu(); // pas de barre de menu
  // sécurité : l'appli ne doit jamais ouvrir de fenêtre ni naviguer vers autre chose que sa propre page
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (e) => e.preventDefault());
  win.loadFile(path.join(__dirname, "..", "index.html"));

  // confirmation avant de fermer si le CV n'est pas sauvegardé
  win.on("close", (e) => {
    if (!cvModifie) return; // rien à signaler
    e.preventDefault();
    const choix = dialog.showMessageBoxSync(win, {
      type: "warning",
      buttons: ["Quitter sans sauvegarder", "Annuler"],
      defaultId: 1,
      cancelId: 1,
      title: "CV non sauvegardé",
      message: "Tu as des modifications non sauvegardées.",
      detail: "Si tu quittes maintenant, ton CV ne sera pas enregistré. Pense à utiliser le bouton « Enregistrer un fichier » avant."
    });
    if (choix === 0) { cvModifie = false; win.destroy(); } // quitter quand même
  });
}

// le renderer signale les modifications / sauvegardes
ipcMain.handle("set-modifie", (event, val) => { if (!appelOk(event)) return false; cvModifie = !!val; return true; });

// seules les pages de l'appli (file://) ont le droit d'appeler les fonctions ci-dessous
function appelOk(event) {
  try { return !!(event.senderFrame && event.senderFrame.url.startsWith("file://")); } catch (_) { return false; }
}
// nom de fichier proposé : on ne garde que des caractères sûrs
function nomSur(n) {
  return String(n || "CV").replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").slice(0, 80) || "CV";
}

app.whenReady().then(() => {
  // aucune permission (caméra, micro, géoloc...) n'est jamais accordée
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
  createWindow();
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

/* ============ EXPORT PPTX ============ */
// reçoit le base64 du pptx généré côté renderer, propose où l'enregistrer
ipcMain.handle("save-pptx", async (event, arg) => {
  if (!appelOk(event)) return { ok: false, error: "Appel refusé." };
  const { base64, suggestedName } = arg || {};
  // un .pptx est un zip : il commence par "PK" ; taille limitée à 60 Mo
  if (typeof base64 !== "string" || base64.length > 80e6 || !base64.startsWith("UEs"))
    return { ok: false, error: "Données PowerPoint invalides." };
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: "Enregistrer le CV PowerPoint",
    defaultPath: nomSur(suggestedName) + ".pptx",
    filters: [{ name: "Présentation PowerPoint", extensions: ["pptx"] }]
  });
  if (canceled || !filePath) return { ok: false };
  try {
    fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
    return { ok: true, filePath };
  } catch (e) {
    return { ok: false, error: messageEcriture(e) };
  }
});

/* ============ EXPORT PDF ============ */
// imprime la zone d'aperçu en PDF via le moteur de rendu d'Electron (fidèle au HTML)
ipcMain.handle("save-pdf", async (event, arg) => {
  if (!appelOk(event)) return { ok: false, error: "Appel refusé." };
  const { suggestedName } = arg || {};
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: "Enregistrer le CV en PDF",
    defaultPath: nomSur(suggestedName) + ".pdf",
    filters: [{ name: "Document PDF", extensions: ["pdf"] }]
  });
  if (canceled || !filePath) return { ok: false };
  try {
    const data = await win.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true,
      margins: { marginType: "none" }
    });
    fs.writeFileSync(filePath, data);
    return { ok: true, filePath };
  } catch (e) {
    return { ok: false, error: messageEcriture(e) };
  }
});

/* ============ IMPRESSION DIRECTE ============ */
ipcMain.handle("print-cv", (event) => {
  if (!appelOk(event)) return { ok: false, error: "Appel refusé." };
  // on attend la fin réelle de l'impression (l'aperçu "sans exemples" reste affiché jusque-là)
  return new Promise((resolve) => {
    try {
      win.webContents.print({ printBackground: true, margins: { marginType: "none" } }, (success, reason) => {
        if (success || reason === "cancelled" || reason === "Print job canceled") resolve({ ok: true });
        else resolve({ ok: false, error: "Impression impossible : " + (reason || "erreur inconnue") });
      });
    } catch (e) {
      resolve({ ok: false, error: "Impression impossible : " + (e && e.message ? e.message : "erreur inconnue") });
    }
  });
});

// message d'erreur compréhensible pour un échec d'écriture de fichier
function messageEcriture(e) {
  const code = e && e.code;
  if (code === "EBUSY" || code === "EPERM" || code === "EACCES")
    return "Le fichier est peut-être déjà ouvert (ferme-le dans PowerPoint/PDF) ou tu n'as pas les droits d'écriture à cet endroit.";
  if (code === "ENOSPC") return "Plus assez d'espace disque pour enregistrer le fichier.";
  return "Impossible d'enregistrer le fichier : " + (e && e.message ? e.message : "erreur inconnue");
}
