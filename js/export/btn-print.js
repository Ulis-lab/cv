/* export/btn-print.js — Bouton Imprimer */

document.getElementById("btn-print").onclick=async()=>{
  if(!await confirmerExport("print")) return;
  try{ const res=await avecModeExport(()=>window.cvApp.printCv()); if(res&&!res.ok&&res.error) alerter(res.error); }
  catch(e){alerter("Erreur impression : "+e.message);console.error(e);}
};
