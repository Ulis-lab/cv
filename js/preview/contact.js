/* preview/contact.js — Bloc contact de l'aperçu (téléphone, mail, ville, permis) */

function contact(sep){ // sep = "row" (icônes en ligne) ou "col" (en colonne)
  // [icône, champ du formulaire, valeur affichée]
  const c=[["tel","tel",v("tel")],["mail","email",v("email")],["ville","ville",v("ville")]];
  if(data.permis && data.permis.trim()) c.push(["permis","permis",data.permis]); // permis seulement si rempli
  const cc=c.filter(x=>x[2]);
  const un=([t,f,val])=>`${ICO[t]}<span data-f="${f}" class="fld${exCls(f)}">${esc(val)}</span>`;
  if(sep==="row") return cc.map(x=>`<span>${un(x)}</span>`).join("");
  return cc.map(x=>`<div class="ln">${un(x)}</div>`).join("");
}

// titre "Contact" + lignes ; rien du tout si aucune info de contact (mode export)
function contactBloc(){ const c=contact("col"); return c?"<h3>Contact</h3>"+c:""; }
