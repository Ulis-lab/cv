/* export/btn-pdf.js — Bouton PDF */

document.getElementById("btn-pdf").onclick=async()=>{
  if(!await confirmerExport("pdf")) return;
  const btn=document.getElementById("btn-pdf");const old=btn.textContent;
  btn.disabled=true;btn.textContent="Génération...";
  try{
    const res=await avecModeExport(()=>window.cvApp.savePdf(nomFichier()));
    if(res&&res.ok) flash("PDF enregistré ✓");
    else if(res&&res.error) alerter(res.error);
  }catch(e){alerter("Erreur PDF : "+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=old;}
};
