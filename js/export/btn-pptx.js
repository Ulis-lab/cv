/* export/btn-pptx.js — Bouton PowerPoint */

document.getElementById("btn-pptx").onclick=async()=>{
  if(!await confirmerExport("pptx")) return;
  const btn=document.getElementById("btn-pptx");const old=btn.textContent;
  btn.disabled=true;btn.textContent="Génération...";
  try{
    const pptx=await construirePPTX(PptxGenJS,dataPourExport(),currentTemplate,window.cvHelpers);
    const b64=await pptx.write({outputType:"base64"});
    const res=await window.cvApp.savePptx(b64,nomFichier());
    if(res&&res.ok) flash("PowerPoint enregistré ✓");
    else if(res&&res.error) alerter(res.error);
  }catch(e){alerter("Erreur PPTX : "+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=old;}
};
