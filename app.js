(function(){var $=U.$,h=U.h;
var S=U.load('qb.state',{from:'',to:'',title:'Website project',valid:'14',cur:'$',disc:'0',tax:'0',terms:'50% upfront, balance on delivery. Changes outside this scope are quoted separately.',items:[{d:'Design',q:'1',p:'400'},{d:'Development',q:'1',p:'900'}]});
var T=U.load('qb.templates',{});
function n(v){v=String(v).trim().replace(',','.');var x=parseFloat(v);return isFinite(x)&&/^-?\d*\.?\d+$/.test(v)?x:NaN}
['from','to','title','valid','cur','disc','tax','terms'].forEach(function(k){$(k).value=S[k];$(k).addEventListener('input',function(){S[k]=$(k).value;go()})});
function drawItems(){var c=$('items');c.textContent='';S.items.forEach(function(it,i){
 var r=h('div',{class:'row',style:'display:grid;grid-template-columns:3fr 1fr 1.3fr auto;gap:.5rem;align-items:end;margin-bottom:.3rem'},[h('label',{style:'margin:0'},[document.createTextNode('Description'),h('input',{'data-i':i,'data-k':'d',value:it.d,maxlength:'100'})]),h('label',{style:'margin:0'},[document.createTextNode('Qty'),h('input',{'data-i':i,'data-k':'q',value:it.q,inputmode:'decimal'})]),h('label',{style:'margin:0'},[document.createTextNode('Unit price'),h('input',{'data-i':i,'data-k':'p',value:it.p,inputmode:'decimal'})]),h('button',{class:'x',type:'button','data-del':i,text:'Remove'})]);c.appendChild(r)})}
$('items').addEventListener('input',function(e){var i=e.target.getAttribute('data-i');if(i==null)return;S.items[+i][e.target.getAttribute('data-k')]=e.target.value;go()});
$('items').addEventListener('click',function(e){var d=e.target.getAttribute('data-del');if(d==null)return;S.items.splice(+d,1);drawItems();go()});
$('add').addEventListener('click',function(){if(S.items.length>=30)return;S.items.push({d:'',q:'1',p:'0'});drawItems();go()});
function calc(){var er=[],sub=0,rows=[];S.items.forEach(function(it,i){var q=n(it.q),p=n(it.p);if(!it.d.trim()){er.push('Item '+(i+1)+' needs a description.')}else if(!(q>0)||!(p>=0)||!isFinite(q)||!isFinite(p)){er.push('Item '+(i+1)+': quantity must be above 0 and price 0 or more.')}else{rows.push({d:it.d.trim(),q:q,p:p,t:q*p});sub+=q*p}});
 var d=n(S.disc),t=n(S.tax),v=parseInt(S.valid,10);
 if(!(d>=0&&d<=100))er.push('Discount must be between 0 and 100.');if(!(t>=0&&t<=100))er.push('Tax must be between 0 and 100.');if(!(v>=1&&v<=365))er.push('Validity must be 1 to 365 days.');
 var da=sub*((d>=0&&d<=100?d:0)/100),after=sub-da,ta=after*((t>=0&&t<=100?t:0)/100);return {rows:rows,sub:sub,d:d,da:da,t:t,ta:ta,tot:after+ta,er:er,v:v}}
function go(){U.save('qb.state',S);var c=calc(),m=function(x){return U.money(x,S.cur)};
 $('err').textContent=c.er.join(' ');$('err').hidden=!c.er.length;
 $('pTitle').textContent=(S.title||'Quote')+(S.to?' for '+S.to:'');$('pMeta').textContent=(S.from?'From '+S.from+' · ':'')+U.today()+(c.v>0?' · valid '+c.v+' days':'');
 var tb=$('pRows');tb.textContent='';c.rows.forEach(function(r){tb.appendChild(h('tr',{},[h('td',{text:r.d}),h('td',{class:'n',text:String(r.q)}),h('td',{class:'n',text:m(r.p)}),h('td',{class:'n',text:m(r.t)})]))});
 $('tSub').textContent=m(c.sub);$('tDL').textContent='Discount ('+(c.d>=0&&c.d<=100?c.d:0)+'%)';$('tDisc').textContent='-'+m(c.da);$('tTL').textContent='Tax ('+(c.t>=0&&c.t<=100?c.t:0)+'%)';$('tTax').textContent=m(c.ta);$('tTot').textContent=m(c.tot);$('pTerms').textContent=S.terms;return c}
$('copy').addEventListener('click',function(){var c=go();if(c.er.length)return;var m=function(x){return U.money(x,S.cur)};
 var t=(S.title||'Quote')+(S.to?' for '+S.to:'')+'\n'+(S.from?'From '+S.from+'\n':'')+'\n'+c.rows.map(function(r){return '- '+r.d+': '+r.q+' x '+m(r.p)+' = '+m(r.t)}).join('\n')+'\n\nSubtotal: '+m(c.sub)+(c.d>0?'\nDiscount ('+c.d+'%): -'+m(c.da):'')+(c.t>0?'\nTax ('+c.t+'%): '+m(c.ta):'')+'\nTotal: '+m(c.tot)+'\n\nValid for '+c.v+' days.\n'+S.terms;
 window.__lastCopy=t;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(function(){});});
$('print').addEventListener('click',function(){var c=go();if(!c.er.length)window.print()});
function drawT(){var s=$('tsel');s.textContent='';Object.keys(T).forEach(function(k){s.appendChild(h('option',{value:k,text:k}))})}
$('tsave').addEventListener('click',function(){var k=$('tname').value.trim();if(!k)return;T[k]=JSON.parse(JSON.stringify({title:S.title,cur:S.cur,disc:S.disc,tax:S.tax,terms:S.terms,valid:S.valid,items:S.items}));U.save('qb.templates',T);drawT();$('tsel').value=k});
$('tload').addEventListener('click',function(){var k=$('tsel').value;if(!T[k])return;var t=T[k];['title','cur','disc','tax','terms','valid'].forEach(function(f){S[f]=t[f];$(f).value=t[f]});S.items=JSON.parse(JSON.stringify(t.items));drawItems();go()});
$('tdel').addEventListener('click',function(){var k=$('tsel').value;delete T[k];U.save('qb.templates',T);drawT()});
drawItems();drawT();go();window.__qb={calc:calc};
})();
