/* ============================================================
   PONT WEB — remplace preload.js d'Electron.
   Expose la même interface window.cvApp : le reste de l'appli ne change pas.
   - savePptx : télécharge le fichier .pptx
   - savePdf / printCv : fenêtre d'impression du navigateur ("Enregistrer au format PDF")
   - setModifie : prévient avant de fermer l'onglet si le CV n'est pas sauvegardé
   ============================================================ */
(function(){
  let modifie = false;
  window.addEventListener("beforeunload", e => {
    if(modifie){ e.preventDefault(); e.returnValue = ""; }
  });

  function b64ToBlob(b64, type){
    const bin = atob(b64), u = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], { type });
  }
  function telecharger(blob, nom){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = nom;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  // Ouvre l'impression ; la promesse se termine quand la fenêtre d'impression est fermée (afterprint).
  // Le titre de la page devient le nom de fichier proposé pour le PDF.
  function imprimer(titre){
    return new Promise(resolve => {
      const ancien = document.title;
      if(titre) document.title = titre;
      let fini = false;
      const fin = () => {
        if(fini) return; fini = true;
        document.title = ancien; window.removeEventListener("afterprint", fin); resolve();
      };
      window.addEventListener("afterprint", fin);
      setTimeout(fin, 120000); // sécurité si "afterprint" n'est jamais émis
      window.print();
    });
  }

  // Petit message d'aide la 1re fois (désactivable) : quoi choisir dans la fenêtre d'impression
  function aidePdf(){
    return new Promise(resolve => {
      let masque = false;
      try{ masque = localStorage.getItem("cv-aide-pdf") === "1"; }catch(_){}
      if(masque){ resolve(true); return; }
      const ov = document.createElement("div");
      ov.className = "pm-overlay"; ov.style.display = "flex";
      ov.innerHTML = `
        <div class="pm-box" style="width:400px" role="dialog" aria-label="Enregistrer en PDF">
          <h3>Enregistrer en PDF</h3>
          <ol style="margin:0 0 12px 18px;line-height:1.7;font-size:14px">
            <li>Dans la fenêtre qui s'ouvre, mets <b>Destination</b> sur <b>« Enregistrer au format PDF »</b></li>
            <li>Clique sur <b>Enregistrer</b></li>
          </ol>
          <label style="font-size:12px;color:var(--ui-muted);display:block"><input type="checkbox" id="aide-pdf-nomore"> Ne plus afficher ce message</label>
          <div class="pm-actions" style="margin-top:14px;justify-content:flex-end">
            <button type="button" id="aide-pdf-cancel">Annuler</button>
            <button type="button" id="aide-pdf-ok" class="primary">Ouvrir l'impression</button>
          </div>
        </div>`;
      document.body.appendChild(ov);
      const fermer = ok => {
        if(ok){ try{ if(ov.querySelector("#aide-pdf-nomore").checked) localStorage.setItem("cv-aide-pdf", "1"); }catch(_){} }
        ov.remove(); resolve(ok);
      };
      ov.querySelector("#aide-pdf-ok").onclick = () => fermer(true);
      ov.querySelector("#aide-pdf-cancel").onclick = () => fermer(false);
      ov.addEventListener("mousedown", e => { if(e.target === ov) fermer(false); });
    });
  }

  window.cvApp = {
    savePptx: async (base64, suggestedName) => {
      const blob = b64ToBlob(base64, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
      telecharger(blob, String(suggestedName || "CV").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) + ".pptx");
      return { ok: true };
    },
    savePdf: async (suggestedName) => {
      const ok = await aidePdf();
      if(ok){ await new Promise(r => setTimeout(r, 50)); await imprimer(suggestedName || "CV"); } // laisse le message disparaître avant d'imprimer
      return { ok: false }; // pas de faux "PDF enregistré ✓" : on ne sait pas si l'utilisateur a validé
    },
    printCv: async () => { await imprimer(); return { ok: true }; },
    setModifie: async (val) => { modifie = !!val; }
  };
})();
