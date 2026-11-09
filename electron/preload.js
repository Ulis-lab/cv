const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cvApp", {
  savePptx: (base64, suggestedName) => ipcRenderer.invoke("save-pptx", { base64, suggestedName }),
  savePdf: (suggestedName) => ipcRenderer.invoke("save-pdf", { suggestedName }),
  printCv: () => ipcRenderer.invoke("print-cv"),
  setModifie: (val) => ipcRenderer.invoke("set-modifie", val)
});
