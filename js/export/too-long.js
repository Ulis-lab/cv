/* export/too-long.js — Détecte un CV trop long pour une page */

// le CV tient-il sur une page ? (PPTX : on construit vraiment le fichier pour mesurer ; PDF/impression : mesure de l'aperçu)
async function tropLong(type){
  try{
    if(type==="pptx"){ const p=await construirePPTX(PptxGenJS,dataPourExport(),currentTemplate,window.cvHelpers); return p.__tient===false; }
    return pageTropLongue;
  }catch(_){ return false; }
}
