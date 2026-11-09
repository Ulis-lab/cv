/* export/confirm-export.js — Fenêtre « Il manque des infos » avant export */

// résout true (exporter) / false (je complète)
async function confirmerExport(type){
  const {sans,exemple}=champsManquants();
  const long=await tropLong(type);
  if(!sans.length && !exemple.length && !long) return true;
  return new Promise(res=>{
    const ov=document.createElement("div");
    ov.className="pm-overlay"; ov.style.display="flex";
    const noms=a=>esc(a.join(", "));
    ov.innerHTML='<div class="pm-box" role="dialog" aria-modal="true" aria-labelledby="ce-titre" style="width:420px">'
      +'<h3 id="ce-titre">Avant d\'exporter</h3>'
      +(long?'<p style="font-size:13px;margin-bottom:10px"><b>Ton CV est trop long pour une page</b>, même avec le texte réduit. Raccourcis quelques phrases ou retire une puce.</p>':'')
      +(sans.length?'<p style="font-size:13px;margin-bottom:10px"><b>Pas sur ton CV</b> (champs vides) : '+noms(sans)+'.</p>':'')
      +(exemple.length?'<p style="font-size:13px;margin-bottom:10px"><b>Texte d\'exemple à la place</b> : '+noms(exemple)+'.</p>':'')
      +'<div class="pm-actions" style="justify-content:flex-end"><button type="button" id="ce-non">Exporter quand même</button><button type="button" id="ce-oui" class="primary">Je complète</button></div></div>';
    document.body.appendChild(ov);
    const fin=ok=>{ document.removeEventListener("keydown",kd); if(ov.liberer) ov.liberer(); ov.remove(); res(ok); };
    const kd=e=>{ if(e.key==="Escape") fin(false); };
    document.addEventListener("keydown",kd);
    ov.querySelector("#ce-oui").onclick=()=>fin(false);
    ov.querySelector("#ce-non").onclick=()=>fin(true);
    const liberer=piegeFocus(ov);
    ov.querySelector("#ce-oui").focus();
    ov.liberer=liberer;
  });
}
