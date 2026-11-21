(function(){
var W=20,H=13,N=260,TERM=48,MS=3000,Y0=2050,SE=['봄','여름','가을','겨울'],SC=['#2FC27A','#FF8A3D','#D98A2B','#3AA0E8'],RL=['일반','희귀','전설','비상'];
var BT=[['불구덩이 지옥',8,75,30,-6,1.3,2.2,1,1,0,0],['열대 우림',140,50,42,2,1.1,.5,.3,0,0,1],['열대 사바나',60,50,60,1,1,1.4,.3,.5,0,.3],['열사막',40,60,72,-1,.8,.3,1,1,0,0],['건조 스텝',52,38,66,0,.9,1.2,.5,.7,0,0],['아열대 숲',120,42,55,3,1,.8,.2,0,0,.5],['온난 초원',105,45,66,3,1,1,0,0,0,0],['온대 평야',95,42,68,3,1,1,0,0,0,0],['활엽수림',130,38,52,3,1.05,.9,0,0,0,0],['단풍 숲',25,55,55,3,1.05,1.1,0,0,0,0],['호숫가 습지',165,30,60,1,1.1,.4,0,0,0,1],['서늘한 초원',112,32,68,2,1,.9,0,0,.1,0],['침엽수림',150,30,42,1,1.1,.8,0,0,.3,0],['타이가',165,25,50,0,1.1,.7,0,0,.6,0],['고지대 관목',90,18,58,-1,1.05,.6,0,0,.5,0],['한랭 평원',180,18,78,-1,1.05,.5,0,0,.8,0],['눈덮인 침엽림',170,20,75,-2,1.1,.4,0,0,1,0],['툰드라',200,14,76,-3,1.15,.3,0,0,1,0],['빙설 설원',205,40,92,-3,1.15,.2,0,0,1,0],['극지 빙하',200,60,88,-4,1.2,.1,0,0,1,0]],
BIO=BT.map(function(r){return[r[0],r[4],r[5]]}),BF=BT.map(function(r){return r[6]});
var cz=2,cons={},vr=[],pops={};
function bnote(b){var r=BT[b],a=['쾌적 '+(r[4]>0?'+':'')+r[4]];if(r[5]!==1)a.push('건설비 ×'+r[5]);if(r[7]>=.5)a.push('여름 만족 −'+Math.round(6*r[7]));if(r[8]>=.5)a.push('풍력·공장 +'+Math.round(20*r[8])+'%');if(r[9]>0)a.push('겨울 유지비 ×'+(1+.3*r[9]).toFixed(2)+' · 케이블카 +'+Math.round(30*r[9])+'%');if(r[10]>0)a.push('공원 ×'+(1+.3*r[10]).toFixed(2)+' · 침수 ×'+(1+.5*r[10]).toFixed(2));a.push(r[6]>=1.5?'화재 위험 높음':r[6]<=.5?'화재 적음':'');return a.filter(Boolean).join(' · ')}
function bc(i,b){var r=BT[b];return'hsl('+(r[1]+R(i)*14-7).toFixed(1)+','+r[2]+'%,'+(r[3]+R(i+7)*8-4).toFixed(1)+'%)'}
function mc(i,b,k){var r=BT[b],sn=r[9],l=k?(sn>=.6?84:r[6]>=2?26:56):(sn>=.6?72:Math.max(26,r[3]-16));return'hsl('+(r[1]+R(i)*10-5).toFixed(1)+','+(k?8+r[2]*.2:r[2]*.7).toFixed(0)+'%,'+(l+R(i+3)*7-3.5).toFixed(1)+'%)'}
function pickBio(r){cz=1+Math.floor(r()*20);var lo=Math.max(1,Math.min(cz-2,16)),cd=[],w=[],t=0,q;for(q=lo;q<=lo+4;q++){cd.push(q-1);var x=q===cz?4:Math.abs(q-cz)===1?2:1;w.push(x);t+=x}
function wp(){var v=r()*t,k=0;while(k<4&&v>=w[k]){v-=w[k];k++}return cd[k]}
var ab=cz===1?[1,2]:cz===20?[18,17]:[cz-2,cz];return[cz-1,ab[0],ab[1],wp(),wp()].sort(function(){return r()-.5})}
function legend(){var e=document.querySelector('.leg');if(!e)return;var u={},h='<span><b>기후 '+cz+'/20</b></span>';bio.forEach(function(b){u[b]=1});Object.keys(u).sort(function(a,b){return a-b}).forEach(function(k){h+='<span><i style="background:'+bc(3,+k)+'"></i>'+BT[k][0]+'</span>'});h+='<span><i style="background:'+mc(3,bio[0],0)+'"></i>낮은 산</span><span><i style="background:'+mc(3,bio[0],1)+'"></i>고산</span><span><i style="background:#3C93DA"></i>바다</span>';e.innerHTML=h}
function bld(i,t){if(t==='d'){delete cons[i];return}var n=Math.max(1,Math.round(B[t][2]/150));cons[i]={r:n,t:n};vr[i]=0}
function wfix(w){if(cz<=4&&(w==='눈'||w==='한파'))return'맑음';if(cz>=16&&w==='폭염')return'맑음';return w}
var B={d:['도로','#7B8A9E',10,.3,0,0,'건물은 상하좌우 한 칸이 도로에 닿아야 작동합니다. 강 위는 다리(60), 낮은 산 +20, 고산 +40.'],
r:['단독주택','#86A9C4',150,1.5,4,0,'세대 4. 공원·학교·바다·산 조망에서 만족도↑, 아파트 소음과 공장 오염에 약해요.'],
a:['아파트','#6F95B5',380,7,16,0,'세대 16으로 세금이 큽니다. 단독주택 바로 옆은 소음 문제.'],
c:['상가','#A97BE0',220,3,0,6,'일자리 6. 인구가 많고 지하철이 가까울수록 매출↑. 가을 +15%.'],
o:['업무시설','#3F77F0',480,9,0,24,'일자리 24. 지하철역 3칸 안이 아니면 소득 70%.'],
f:['공장','#8D949E',300,6,0,16,'일자리 16, 안정적 소득. 반경 2칸 만족도 −25. 불이 나기 쉬워요.'],
p:['공원','#3DBE7A',110,2,0,0,'반경 2칸 만족도 +15. 폭염을 막고 곁의 건물을 침수에서 지켜 줘요.'],
s:['학교','#F2B84B',420,10,0,0,'반경 3칸 만족도 +10. 인구 80명이 넘으면 꼭 필요해요.'],
t:['지하철역','#26C6B9',600,14,0,0,'반경 3칸 만족도 +10. 상가 ×1.25, 업무시설 소득 정상화.'],
k:['항구','#2E9FD9',380,9,0,12,'바닷가 땅 전용. 일자리 12, 소득 높음. 태풍에 약해요.'],
w:['풍력단지','#62C7E8',300,3,0,0,'낮은 산·고산 전용. 안정적 소득, 가을·겨울 +25%, 고산에선 ×1.3. 태풍 달 중단.','HM'],
q:['채석장','#A38D78',240,4,0,4,'고산 전용. 소득 높음, 반경 2칸 만족도 −20.','M'],
v:['케이블카','#FF8A5B',420,8,0,3,'고산 전용. 관광: 가을 ×1.8, 겨울 ×1.5, 여름 ×0.8, 폭우 땐 급감. 설원이면 +30%.','M']};
var K='M12 3 2 12h3v8h14v-8h3z';
var IC={r:'<path d="'+K+'"/><path d="M10 14h4v6h-4z" fill="rgba(0,0,0,.28)"/>',
a:'<path d="M5 3h14v18H5z"/><path fill="rgba(0,0,0,.28)" d="M8 6h3v3H8zM13 6h3v3h-3zM8 11h3v3H8zM13 11h3v3h-3zM10 17h4v4h-4z"/>',
c:'<path d="M3 4h18l1 6H2zM4 11h16v9H4z"/><path fill="rgba(0,0,0,.28)" d="M9 14h6v6H9z"/>',
o:'<path d="M9 2h6v3h3v17H6V5h3z"/><path fill="rgba(0,0,0,.28)" d="M9 8h2v2H9zM13 8h2v2h-2zM9 12h2v2H9zM13 12h2v2h-2zM9 16h2v2H9zM13 16h2v2h-2z"/>',
f:'<path d="M2 21V11l6 3v-3l6 3V7h4v14z"/><circle cx="19" cy="4" r="2" fill-opacity=".6"/>',
p:'<circle cx="12" cy="9" r="7"/><path d="M11 14h2v7h-2z"/>',
s:'<path d="M12 4 1 9.5l11 5.5 9-4.5V17h2V9.5zM5 13v4c0 2.5 14 2.5 14 0v-4l-7 3.5z"/>',
t:'<rect x="5" y="3" width="14" height="15" rx="4"/><path fill="rgba(0,0,0,.3)" d="M7.5 6h9v5h-9z"/><circle cx="8.5" cy="15" r="1.4" fill="rgba(0,0,0,.3)"/><circle cx="15.5" cy="15" r="1.4" fill="rgba(0,0,0,.3)"/><path d="M7 18l-2 4M17 18l2 4" stroke="#fff" stroke-width="1.8" fill="none"/>',
k:'<path d="M12 4v15M8 8h8M5 14c0 5 14 5 14 0" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="12" cy="4" r="1.8"/>',
w:'<path d="M12 12v10M12 12V2M12 12 3 16M12 12l9 4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="12" r="1.8"/>',
q:'<path d="M2 21l6-11 4 6 3-4 7 9z"/><path d="M14 3l5 5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
v:'<path d="M2 5l20 4" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M12 7v3" stroke="#fff" stroke-width="1.6"/><rect x="7" y="10" width="10" height="8" rx="2.5"/><path fill="rgba(0,0,0,.28)" d="M9 12h6v3H9z"/>',
M:'<path d="M1 21 9 6l4.5 8L16 10l7 11z"/><path d="M9 6 6.8 10.4 9 9.4l2.2 1z" style="fill:#fff;fill-opacity:var(--snow)"/>',
H:'<path d="M1 20c4-9 8-11 11-11s8 3 11 11z"/>',
F:'<path d="M8 3 2 13h12zM16 8l-6 11h12z"/>',
x:'<path d="M5 5l14 14M19 5L5 19" stroke="#fff" stroke-width="3" fill="none"/>',
d:'<path d="M3 12h18M12 3v18" stroke="#fff" stroke-width="3" fill="none"/>'};
var FL='<svg class="fl" viewBox="0 0 24 24"><path d="M12 1c1 4 7 6 7 13a7 7 0 0 1-14 0c0-3 2-5 3-8 1 2 2 2 4-5z" fill="#FF4A1A"/><path d="M12 11c1 2.5 4 3.5 4 6a4 4 0 0 1-8 0c0-2 2-2.5 4-6z" fill="#FFD23F"/></svg>';
var BB='<svg class="bbl" viewBox="0 0 24 24"><path d="M3 3h18v13H12l-5 5v-5H3z" fill="#fff" stroke="#3A86FF" stroke-width="1.6"/><circle cx="12" cy="9.5" r="3.3" fill="#FFB020"/></svg>';
function sv(p,f,s){return'<svg viewBox="0 0 24 24" width="'+(s||'76%')+'" height="'+(s||'76%')+'" fill="'+f+'">'+p+'</svg>'}
var CL='<path d="M7 17a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1A3.5 3.5 0 0 1 16.5 17z"/>',SUN='<circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',SNOW='<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17"/>';
var WI={'맑음':SUN,'비':CL+'<path d="M8 20l-1 2M12 20l-1 2M16 20l-1 2"/>','폭우':CL+'<path d="M7 19l-2 3M11 19l-2 3M15 19l-2 3M19 19l-2 3"/>','태풍':CL+'<path d="M13 15l-3 4h4l-2 4"/>','폭염':SUN,'한파':SNOW,'눈':CL+'<circle cx="8" cy="21" r=".6"/><circle cx="12" cy="21" r=".6"/><circle cx="16" cy="21" r=".6"/>',
'아틀란티스 쓰나미':'<path d="M2 12q3-4 5 0t5 0 5 0 5 0M2 18q3-4 5 0t5 0 5 0 5 0M12 2v5M9 5l3-3 3 3"/>','화산 폭발':'<path d="M3 21 9 9h6l6 12zM12 9V3M9 5 7 3M15 5l2-2"/>','유성우':'<path d="M20 3 6 17M16 3 4 15M20 8 9 19"/><circle cx="6" cy="18" r="1.6"/>','솜사탕 비':CL+'<circle cx="8" cy="20" r="1.2"/><circle cx="12" cy="21" r="1.2"/><circle cx="16" cy="20" r="1.2"/>','개구리 비':'<circle cx="12" cy="13" r="7"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="7" r="2"/><path d="M9 15q3 3 6 0"/>','오로라':'<path d="M2 15q4-12 8-2t8-8 4 4M2 20q5-6 10-1t10-4"/>','황금 눈':SNOW};
var WC={'폭염':'#FF6A3D','한파':'#3AB0FF','황금 눈':'#E8A800','화산 폭발':'#FF4A1A','오로라':'#7A5CFF','솜사탕 비':'#FF7AC8','유성우':'#8E7CFF','아틀란티스 쓰나미':'#2E9FD9','개구리 비':'#3DBE7A'},WS={'아틀란티스 쓰나미':'아틀란티스'};
function ws(n,z){return'<svg viewBox="0 0 24 24" width="'+z+'" height="'+z+'" fill="none" stroke="'+(WC[n]||'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+WI[n]+'</svg>'+(WS[n]||n)}
var WX=[[['맑음',.7],['비',.3]],[['맑음',.25],['폭염',.25],['폭우',.35],['태풍',.15]],[['맑음',.65],['비',.2],['태풍',.15]],[['맑음',.4],['한파',.4],['눈',.2]]];
var WT={'맑음':'맑은 달. 특별한 영향 없음','비':'비. 불이 꺼질 수 있어요','폭우':'폭우. 강 1칸 안 건물은 공원이 없으면 침수 피해(15%). 불은 꺼져요','태풍':'태풍. 강 2칸 안 건물 피해(25%), 풍력 중단, 항구 약화','폭염':'폭염. 공원 2칸 밖 주거지 만족도 −8','한파':'한파. 주택 유지비 ×1.5, 상가 매출 ×0.8','눈':'눈. 상가 매출 ×0.9, 불이 꺼져요',
'아틀란티스 쓰나미':'★전설★ 바다에서 아틀란티스가 솟아올라 해안이 휩쓸려요. 낮은 산은 안전, 이후 유적 관광 대박','화산 폭발':'★전설★ 고산이 폭발! 주변에 용암이 번지고 화산재가 쌓여요','유성우':'★희귀★ 별똥별이 쏟아져요. 관광↑, 운 나쁘면 건물이 맞아요','솜사탕 비':'★희귀★ 하늘에서 솜사탕 비! 시민들이 행복해해요','개구리 비':'★희귀★ 개구리가 쏟아져요. 만족도↓ 관광↑','오로라':'★희귀★ 도시 위로 오로라! 관광 폭발','황금 눈':'★희귀★ 황금빛 눈이 내려요. 시 금고가 두둑해져요'};
var KG=[[[118,42,78],[135,46,66],[46,52,68],[190,22,90]],[[38,48,78],[34,55,72],[32,50,70],[36,30,82]],[[200,25,90],[165,22,84],[205,26,90],[210,30,95]],[[140,48,62],[148,52,52],[140,46,56],[150,38,64]]],
KO={f:[[140,40,52],[145,46,36],[20,64,52],[195,14,72]],h:[[95,28,60],[108,32,50],[40,36,56],[200,12,86]],m:[[100,16,62],[120,18,48],[30,28,56],[210,12,88]]};
var PO=[['감세 정책','만족 +4, 전체 수입 ×0.93',{hap:4,inc:.93}],['녹색 뉴딜','공원 효과 ×1.5, 건설비 ×1.08',{park:1.5,cost:1.08}],['스마트시티','상가·업무 수입 ×1.2, 유지비 ×1.12',{com:1.2,up:1.12}],['야간경제 특구','상가·업무 ×1.15, 만족 −3',{com:1.15,hap:-3}],['관광 진흥','케이블카·유적·철새 관광 ×1.5, 행정비 ×1.12',{tour:1.5,adm:1.12}],['방재 투자','재난 피해·화재 확산 −60%, 유지비 ×1.1',{dmg:.4,fire:.4,up:1.1}],['산업 육성','공장·채석장·항구 ×1.4, 만족 −2',{ind:1.4,hap:-2}],['복지 확대','만족 +8, 행정비 ×1.35',{hap:8,adm:1.35}],['규제 완화','건설비 ×0.85, 화재 확산 ×1.5',{cost:.85,fire:1.5}],['긴축 재정','행정비 ×0.6, 만족 −5',{adm:.6,hap:-5}],['이주 장려금','인구 ×1.15, 행정비 ×1.15',{popm:1.15,adm:1.15}],['청년 일자리','전체 수입 ×1.08, 건설비 ×1.05',{inc:1.08,cost:1.05}]];
var grid,under,bio,lv,lvp,fires,bub,mods,pol,m,acc,speed=0,prev=1,budget,wx,nx,mi,tn,approv,lowA,lastEv,over,tool='d',S0,best=0,cells=[],down=false,lastYr=-1,tbtn={},tt,P={},pend=[],ovOn=false,tk='',AL=[],lastSay=0,rt=0,mute=false;
var $=function(i){return document.getElementById(i)};
function R(i){return((i*2654435761+12345)>>>0)%1000/1000}
function rp(a){return a[Math.floor(Math.random()*a.length)]}
function sea(k){var n=(k+2)%12+1;return n>=3&&n<=5?0:n<=8&&n>=6?1:n>=9&&n<=11?2:3}
function nb(i){var a=[],x=i%W,y=i/W|0;if(x>0)a.push(i-1);if(x<W-1)a.push(i+1);if(y>0)a.push(i-W);if(y<H-1)a.push(i+W);return a}
function near(i,r,fn){var x=i%W,y=i/W|0;for(var yy=Math.max(0,y-r);yy<=Math.min(H-1,y+r);yy++)for(var xx=Math.max(0,x-r);xx<=Math.min(W-1,x+r);xx++){var d=Math.abs(xx-x)+Math.abs(yy-y),j=yy*W+xx;if(j!==i&&d<=r)fn(j,d)}}
function f(n){n=Math.round(n);return(n>0?'+':'')+n}
function cnt(t){var c=0;for(var i=0;i<N;i++)if(grid[i]===t)c++;return c}
function has(t){return function(){return cnt(t)>0}}
function pickT(ts){var l=[];for(var i=0;i<N;i++)if(ts.indexOf(grid[i])>=0)l.push(i);return l.length?rp(l):-1}
function cm(k){var v=1;mods.forEach(function(o){if(o.k===k)v*=o.v});return v}
function md(k,v,n){mods.push({k:k,v:v,m:n})}
function calcP(){P={inc:1,com:1,ind:1,tour:1,adm:1,up:1,cost:1,park:1,dmg:1,fire:1,popm:1,hap:0};pol.forEach(function(id){apQ(PO[id][2])});apQ(cmy().t)}
function cst(t,i){var c=B[t][2]*(1+.03*Math.floor(m/12))*(1+.08*tn)*cm('cost')*P.cost;if(i!==undefined){c*=BIO[bio[i]][2];if(grid[i]==='H')c*=1.3}return Math.round(c)}
function sb(i,p){return'hsl(calc(var(--'+p+'h) + '+(R(i)*14-7).toFixed(1)+'),calc(var(--'+p+'s)*1%),calc((var(--'+p+'l) + '+(R(i+7)*8-4).toFixed(1)+')*1%))'}
function sc3(K,t){var k=Math.floor(t/3)%4,w=Math.max(0,t%3-2),a=K[k],b=K[(k+1)%4];return a.map(function(v,i){return v+(b[i]-v)*w})}
function tint(){var t=(m+acc/MS)%12,k=Math.floor(t/3),w=Math.max(0,t%3-2),sn=k===3?1-w:k===2?w:0,s=$('g').style,o=[];
KG.forEach(function(K,b){o.push(['b'+b,sc3(K,t)])});for(var n in KO)o.push([n,sc3(KO[n],t)]);
var key=o.map(function(a){return a[1].map(Math.round).join()}).join('|')+sn.toFixed(2);if(key===tk)return;tk=key;
o.forEach(function(a){s.setProperty('--'+a[0]+'h',a[1][0].toFixed(1));s.setProperty('--'+a[0]+'s',a[1][1].toFixed(1));s.setProperty('--'+a[0]+'l',a[1][2].toFixed(1))});s.setProperty('--snow',(.55+.45*sn).toFixed(2))}
function toast(t){var e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(tt);tt=setTimeout(function(){e.hidden=true},3600)}
function msg(t){$('msg').textContent=t}
function ovShow(h){var o=$('ov');o.hidden=false;o.innerHTML=h;return o}
/* ---- 소리 ---- */
var AC=null,mg,bs=0,bt=null;
function ac(){try{if(!AC){var C=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);if(!C)return null;AC=new C();mg=AC.createGain();mg.gain.value=.5;mg.connect(AC.destination)}if(AC.state==='suspended')AC.resume()}catch(e){return null}return AC}
function bp(fq,d,ty,v,dl,sl){if(mute||!AC)return;try{var t=AC.currentTime+(dl||0),o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(fq,t);if(sl)o.frequency.exponentialRampToValueAtTime(sl,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v||.1,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}catch(e){}}
function nz(d,v,fq,dl){if(mute||!AC)return;try{var t=AC.currentTime+(dl||0),n=Math.floor(AC.sampleRate*d),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(var i=0;i<n;i++)a[i]=Math.random()*2-1;var s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=b;fl.type='lowpass';fl.frequency.value=fq||1200;g.gain.setValueAtTime(v||.1,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(mg);s.start(t)}catch(e){}}
var SF={build:function(){bp(520,.09,'square',.06);bp(780,.1,'square',.05,.06)},road:function(){bp(300,.04,'triangle',.05)},del:function(){nz(.15,.1,900);bp(200,.15,'sawtooth',.05,0,90)},coin:function(){bp(988,.1,'sine',.09);bp(1319,.25,'sine',.09,.08)},
ev:function(r){if(r===3){for(var i=0;i<6;i++)bp(i%2?800:600,.25,'triangle',.1,i*.25)}else if(r===2){[523,659,784,1047,1319].forEach(function(n,i){bp(n,.4,'sine',.08,i*.08)})}else if(r===1){[660,830,990].forEach(function(n,i){bp(n,.2,'triangle',.08,i*.09)})}else{bp(660,.12,'sine',.08);bp(880,.18,'sine',.08,.1)}},
fire:function(){nz(.5,.12,2600);bp(120,.4,'sawtooth',.04)},water:function(){nz(.4,.1,3200)},lvup:function(){[523,659,784,1047].forEach(function(n,i){bp(n,.25,'triangle',.07,i*.07)})},ms:function(){[523,659,784,659,784,1047].forEach(function(n,i){bp(n,.22,'square',.05,i*.09)})},thunder:function(){nz(.9,.2,400)},wave:function(){nz(1.2,.16,700)},boom:function(){nz(.7,.25,300);bp(90,.6,'sine',.2,0,40)}};
function mf(n){return 440*Math.pow(2,(n-69)/12)}
var CH=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],PN=[0,2,4,7,9];
function bgm(){clearTimeout(bt);var fc=Object.keys(fires).length>0;
if(!mute&&AC){var b=bs%16,c=CH[(bs>>4)%4];
if(b===0)c.forEach(function(n){bp(mf(n),3.2,'sine',.03)});
if(b%8===0)bp(mf(c[0]-12),1.2,'sine',.07);
if(speed>0){if(b%2===0&&Math.random()<.7)bp(mf(60+rp(PN)+(Math.random()<.5?12:0)),.35,'triangle',.045);if(b%4===2)bp(mf(c[2]+12),.2,'sine',.03);if(fc&&b%4===0)bp(mf(c[0]-24),.3,'square',.03)}}
bs++;bt=setTimeout(bgm,fc?190:270)}
function startAudio(){if(!ac())return;if(!bt)bgm()}
/* ---- 애니풍 캐릭터 생성기 ---- */
var uid=0;
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function sh(h,a){var n=parseInt(h.slice(1),16),f=function(c){return Math.round(a<0?c*(1+a):c+(255-c)*a)};return'#'+((1<<24)+(f(n>>16&255)<<16)+(f(n>>8&255)<<8)+f(n&255)).toString(16).slice(1)}
function av(c,x,sz){
var id='u'+(uid++),sk=c.sk,hc=c.hc,h2=sh(hc,-.2),ink='#33274a',ac=c.cc2,cc=c.cc,hf=c.hg?'url(#'+id+'g)':hc,hb=c.hb,hs=c.hf,cl=c.cl,o='',
F=function(d,f,e){return'<path d="'+d+'" fill="'+f+'" '+(e||'')+'/>'},
S=function(d,s,w){return'<path d="'+d+'" fill="none" stroke="'+s+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>'},
E=function(cx,cy,rx,ry,f,e){return'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" '+(e||'')+'/>'},
star=function(cx,cy,k){return'<path transform="translate('+cx+' '+cy+') scale('+k+')" d="M0-5l1.5 3.3 3.6.5-2.6 2.5.6 3.6L0 3l-3.1 1.6.6-3.6L-5.1-1.2l3.6-.5z" fill="#FFD84A" stroke="#fff" stroke-width="1"/>'};
o+='<defs>'+(c.hg?'<linearGradient id="'+id+'g" x1=".15" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#a9dcff"/><stop offset=".5" stop-color="#c9a8ff"/><stop offset="1" stop-color="#ffb0dc"/></linearGradient>':'')+'<linearGradient id="'+id+'h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#bfe6ff"/><stop offset="1" stop-color="#ffc9e6"/></linearGradient></defs>';
if(!c.nb)o+='<circle cx="50" cy="50" r="50" fill="'+c.bg+'"/><circle cx="26" cy="22" r="14" fill="#fff" opacity=".4"/>';
/* 뒷머리 */
if(hb==='long')o+=F('M50 15C27 15 21 33 21 52C21 68 17 77 15 90L85 90C83 77 79 68 79 52C79 33 73 15 50 15Z',hf);
if(hb==='twin')o+=E(19,60,10,17,hf)+E(81,60,10,17,hf);
if(hb==='bob')o+=F('M50 16C27 16 21 33 21 56Q21 69 30 71L70 71Q79 69 79 56C79 33 73 16 50 16Z',hf);
if(hb==='pony')o+=E(82,56,8,16,hf);
if(hb==='bun')o+='<circle cx="50" cy="14" r="9" fill="'+hf+'"/>';
/* 몸 */
o+=F('M24 100C24 84 36 78 50 78S76 84 76 100Z',cl==='holo'?'#fff':cc);
if(cl==='sailor')o+=F('M40 79L50 90L60 79Z',ac)+E(50,90,3,3,'#ff5fa0');
if(cl==='blazer')o+=F('M42 79L50 98L58 79Z','#fff')+F('M48 82h4l1.5 9-3.5 3-3.5-3z',ac);
if(cl==='cardigan')o+=F('M42 79L50 96L58 79Z','#fff')+E(50,90,1.5,1.5,ac);
if(cl==='hoodie')o+=E(50,80,13,5,sh(cc,.18))+S('M45 86V94M55 86V94','#fff',1.8);
if(cl==='jacket')o+=F('M26 94Q50 86 74 94V98Q50 90 26 98Z','#FFD84A')+F('M42 79L50 99L58 79Z',sh(cc,-.2));
if(cl==='holo')o+=F('M38 79L50 91L62 79Z','url(#'+id+'h)')+star(50,85,.55);
/* 얼굴 */
o+=E(50,52,29,27,sk)+E(34,60,5,3,c.bl||'#ff9ec8','opacity="'+(c.bo||.55)+'"')+E(66,60,5,3,c.bl||'#ff9ec8','opacity="'+(c.bo||.55)+'"');
/* 앞머리 */
if(hs==='curtain')o+=F('M21 52C18 26 36 15 50 15S82 26 79 52C74 40 66 36 58 34C55 41 52 43 50 38C48 43 45 41 42 34C34 36 26 40 21 52Z',hf);
if(hs==='blunt')o+=F('M21 52C18 26 36 14 50 14S82 26 79 52L79 42Q50 33 21 42Z',hf);
if(hs==='sweep')o+=F('M21 52C18 26 36 14 56 15C75 17 82 30 79 52C76 40 67 33 54 32C40 32 28 38 21 52Z',hf);
if(hs==='spiky')o+=F('M21 52L18 32L29 36L28 17L41 27L50 11L59 27L72 17L71 36L82 32L79 52L71 41L63 47L55 39L47 47L38 39L29 47Z',hf);
if(hs==='comb')o+=F('M33 31Q50 20 67 31Q50 26 33 31Z',hf)+F('M22 54C19 42 24 34 30 32L31 50Z',hf)+F('M78 54C81 42 76 34 70 32L69 50Z',hf)+E(46,29,6,2,'#fff','opacity=".5"');
if(hs==='wave')o+=F('M21 52C18 26 36 15 50 15S82 26 79 52C74 38 64 31 50 31S26 38 21 52Z',hf);
/* 눈 */
var ec=c.ec,big=c.ek==='big',ex=[40,60];
ex.forEach(function(cx,k){var sd=k?1:-1;
 if(x==='happy')o+=S('M'+(cx-5)+' 54Q'+cx+' 46 '+(cx+5)+' 54',ink,2.7);
 else if(x==='sleep')o+=S('M'+(cx-5)+' 52Q'+cx+' 57 '+(cx+5)+' 52',ink,2.5);
 else if(x==='love')o+='<path d="M'+cx+' 58C'+(cx-8)+' 53 '+(cx-7)+' 46 '+(cx-3.5)+' 46C'+(cx-1.5)+' 46 '+cx+' 47.5 '+cx+' 49C'+cx+' 47.5 '+(cx+1.5)+' 46 '+(cx+3.5)+' 46C'+(cx+7)+' 46 '+(cx+8)+' 53 '+cx+' 58Z" fill="#ff4f9a"/>'+E(cx-2.5,49.5,1.4,1.4,'#fff');
 else if(x==='wow')o+=E(cx,52,5.6,6.6,'#fff','stroke="'+ink+'" stroke-width="1.8"')+E(cx,53,2.6,3.3,ink)+E(cx-.8,51.5,1,1,'#fff');
 else{var rx=big?4.6:3.4,ry=big?5.8:4.6;o+=E(cx,53,rx,ry,big?sh(ec,-.45):ink)+(big?E(cx,55,rx*.7,ry*.45,ec):'')+E(cx-1.2,50.8,1.5,1.5,'#fff')+(big?E(cx+1.5,56,.8,.8,'#fff'):'')}
 if(x==='worry')o+=S('M'+(cx+sd*5)+' 45.5L'+(cx-sd*5)+' 42',ink,1.8);
 else if(c.ms||c.ek==='sharp')o+=S('M'+(cx-5)+' 44Q'+cx+' 42 '+(cx+5)+' 44.5',sh(hc,-.3),c.ms?2.4:1.6)});
/* 입 */
var my=c.ms?3:0,mc='#d4566e',tg=function(y){return E(50,y,2,1.1,'#ff8fa6')};
if(c.ms)o+=F('M40 63Q45 58 50 62Q55 58 60 63Q55 66 50 64Q45 66 40 63Z',h2);
if(x==='happy'||x==='love')o+=F('M44 '+(63+my)+'Q50 '+(72+my)+' 56 '+(63+my)+'Z','#d94668')+tg(68+my);
else if(x==='wow')o+=E(50,66+my,2.5,3.2,'#d94668');
else if(x==='worry')o+=S('M46 '+(67+my)+'Q50 '+(63+my)+' 54 '+(67+my),mc,1.8);
else if(x==='sleep')o+=E(50,65+my,1.9,1.5,mc)+'<text x="72" y="30" font-size="13" font-weight="700" fill="#7a6bff">z</text>';
else if(c.mo==='grin')o+=F('M45 '+(63+my)+'Q50 '+(71+my)+' 55 '+(63+my)+'Z','#d94668')+tg(67.5+my);
else if(c.mo==='cat')o+=S('M45 '+(64+my)+'Q47.5 67 50 64.5Q52.5 67 55 '+(64+my),mc,1.7);
else o+=S('M46 '+(64+my)+'Q50 '+(68+my)+' 54 '+(64+my),mc,1.8);
if(x==='worry'||c.sw)o+='<path d="M77 36Q73.5 42 77 45Q80.5 42 77 36Z" fill="#8fd0ff" stroke="#fff" stroke-width=".8"/>';
/* 소품 */
(c.acc||[]).forEach(function(a){
 if(a==='star')o+=star(68,22,1.1);
 if(a==='clips')o+=S('M28 26l7 5M35 26l-7 5',ac,2.5);
 if(a==='ribbon')o+=F('M70 22L60 16V28Z',ac)+F('M70 22L80 16V28Z',ac)+E(70,22,3,3,sh(ac,.3));
 if(a==='butterfly')o+=E(30,24,5,4,'#ff9ed2','transform="rotate(-25 30 24)"')+E(38,22,5,4,'#8fd8ff','transform="rotate(25 38 22)"')+E(34,23,1.2,2.5,'#fff');
 if(a==='heart')o+=F('M70 30C63 26 63 19 67 19C69 19 70 20 70 21C70 20 71 19 73 19C77 19 77 26 70 30Z','#ff5fa0','stroke="#fff" stroke-width="1"');
 if(a==='band')o+=F('M21 44Q50 30 79 44V50Q50 36 21 50Z','#FF3B3B')+star(50,40,1);
 if(a==='goggles')o+='<rect x="28" y="20" width="20" height="10" rx="5" fill="#19D3DA" fill-opacity=".85" stroke="#fff" stroke-width="1.5"/><rect x="52" y="20" width="20" height="10" rx="5" fill="#19D3DA" fill-opacity=".85" stroke="#fff" stroke-width="1.5"/>';
 if(a==='phones')o+=S('M23 50C20 12 80 12 77 50',c.hg?'url(#'+id+'h)':ac,3.5)+E(22,55,5,8,c.hg?'url(#'+id+'h)':ac,'stroke="#b9a6ff" stroke-width="1.2"')+E(78,55,5,8,c.hg?'url(#'+id+'h)':ac,'stroke="#b9a6ff" stroke-width="1.2"')+E(22,55,1.8,1.8,'#ff8fc8')+E(78,55,1.8,1.8,'#7fd8ff')+S('M78 63Q78 73 63 72','#b9a6ff',1.6)+E(62,72,2.4,2.4,'#ff8fc8','stroke="#fff" stroke-width=".8"');
});
if(c.gl){var gc=c.gc||'#8a5a3a',gw=c.ms?2:1.5;o+=(c.gl==='rect'?'<rect x="31" y="45" width="18" height="14" rx="4" fill="#fff" fill-opacity=".15" stroke="'+gc+'" stroke-width="'+gw+'"/><rect x="51" y="45" width="18" height="14" rx="4" fill="#fff" fill-opacity=".15" stroke="'+gc+'" stroke-width="'+gw+'"/>':'<circle cx="40" cy="53" r="9" fill="#fff" fill-opacity=".15" stroke="'+gc+'" stroke-width="'+gw+'"/><circle cx="60" cy="53" r="9" fill="#fff" fill-opacity=".15" stroke="'+gc+'" stroke-width="'+gw+'"/>')+S('M49 52Q50 50.5 51 52',gc,gw)}
return'<svg viewBox="0 0 100 100"'+(sz?' width="'+sz+'" height="'+sz+'"':'')+'>'+o+'</svg>'}

/* ---- 시장 후보 원형(ARCH) + 랜덤 조합 ---- */
function pk(r,a){return a[Math.floor(r()*a.length)]}
function sm(r,a,n){var b=a.slice(),o=[];while(n-->0&&b.length)o.push(b.splice(Math.floor(r()*b.length),1)[0]);return o}
var SKINS=['#FFEBE5','#FFE3D2','#FADBC4','#F5CDAE','#FFEFE9'],ECS=['#7B5CFF','#2FB5C8','#FF9A1F','#E85D9A','#3FB67A','#4C7DFF','#B05CE6','#E5566D'];
var MASCOT={sk:'#FFEDE8',hc:'#c9a8ff',hg:1,ec:'#6a4cff',ek:'big',hb:'long',hf:'curtain',cl:'holo',cc:'#fff',cc2:'#c9a8ff',acc:['phones','star','butterfly'],nb:1,fw:20,bl:'#ff9ec8',bo:.6};
var ARCH=[
{k:'idol',role:'아이돌 시장',names:['유나','하린','아리','루아','세라','미소'],q:['시민 여러분, 오늘도 반짝반짝 해봐요!','제 팬이 곧 시민이에요, 두근두근!'],on:'행복한 도시가 스타 시장을 불러냈어요!',t:{hap:3,park:1.2},f:function(a,tc){return a.hap/18+(tc.p||0)*.35},
 gen:function(r){return{sk:pk(r,SKINS),hc:pk(r,['#FF9AD0','#B79CFF','#7FD8FF','#FFB3C7','#F5D77A','#9CE6C9']),ec:pk(r,ECS),ek:'big',hb:pk(r,['long','twin','bob']),hf:pk(r,['curtain','blunt']),cl:pk(r,['sailor','cardigan']),cc:pk(r,['#fff','#FFD6EA','#E4D9FF']),cc2:pk(r,['#FF7EBB','#8E7CFF','#5BB8FF']),acc:sm(r,['star','ribbon','clips','butterfly','heart'],2),mo:pk(r,['smile','cat']),bg:pk(r,['#FFD3EC','#E1D4FF','#CFEBFF']),bl:'#ff8fc0',bo:.55}}},
{k:'elite',role:'엘리트 테크 시장',names:['세이','이안','도윤','하준','로이','시온'],q:['데이터가 말해줍니다. 이 도시는 더 커질 수 있어요.','효율이 곧 행복입니다.'],on:'돈과 일자리가 넘치는 도시가 엘리트 시장을 택했어요.',t:{com:1.15,cost:.95},f:function(a,tc){return budget/900+(tc.t||0)*1.2+a.emp*2},
 gen:function(r){return{sk:pk(r,SKINS),hc:pk(r,['#2B3A67','#3b2f4f','#5a4a3a','#3a3a48','#6C84C8','#8a8fa8']),ec:pk(r,ECS),ek:'sharp',hb:'short',hf:'sweep',cl:'blazer',cc:pk(r,['#2B3A67','#3a3f55','#4a3a66']),cc2:pk(r,['#8F7CFF','#2FB5C8','#E5566D']),acc:r()<.5?['star']:[],gl:r()<.5?pk(r,['rect','round']):0,gc:'#9fb4d8',mo:'smile',bg:pk(r,['#CFE4FF','#DDE6FF','#D5F1EE']),bl:'#ffb4b4',bo:.35}}},
{k:'hero',role:'소방관 출신 영웅',names:['리오','태양','불꽃','강토','라이','소이'],q:['불길은 내가 막는다! 시민은 내가 지킨다!','걱정 마, 히어로가 왔다!'],on:'불길에 시달린 도시가 영웅 시장을 원했어요!',t:{dmg:.6,fire:.6},f:function(a,tc,fc){return fc*2+(tc.f||0)*.35},
 gen:function(r){var g=r()<.4;return{sk:pk(r,SKINS.slice(1)),hc:pk(r,['#FF7A3D','#FF4A4A','#FFB020','#E85D9A']),ec:pk(r,['#FF9A1F','#E5566D','#2FB5C8','#4C7DFF']),ek:g?'big':'sharp',hb:g?'pony':'short',hf:g?'sweep':'spiky',cl:'jacket',cc:pk(r,['#FF5A3C','#E5322D','#FF7A3D']),cc2:'#FFD84A',acc:['band'],mo:'grin',bg:pk(r,['#FFE0BF','#FFD6D0','#FFF0C2']),bl:'#ff9a8a',bo:.5}}},
{k:'granny',role:'알뜰 할머니 시장',names:['복순','말순','순애','영자','옥희'],q:['아이고, 돈은 아껴 써야 하는 거야~','사탕 하나 먹고 해~'],on:'살림이 빠듯한 도시가 알뜰한 할머니를 모셨어요.',t:{adm:.8,hap:2},f:function(a){return Math.max(0,(1200-budget)/400)+(a.pop<80?1.5:0)},
 gen:function(r){return{sk:pk(r,SKINS.slice(1,4)),hc:pk(r,['#EDEAF5','#D9D4E8','#F3E9E0']),ec:'#4a3a5a',ek:'soft',hb:'bun',hf:'wave',cl:'cardigan',cc:pk(r,['#B79CFF','#9FD8C0','#FFB9A0','#F5B8D8']),cc2:pk(r,['#8E7CFF','#FF8FC8','#5BB8FF']),acc:[],gl:'round',gc:pk(r,['#FF8FC8','#8E7CFF','#c0a060']),mo:'smile',bg:pk(r,['#EBDCFF','#FFE9D6','#DDF3E6']),bl:'#ff9aa8',bo:.7}}},
{k:'founder',role:'청년 창업가 시장',names:['카이','나비','하루','지우','리안','주아'],q:['이 도시, 인구 폭발 각이다. 같이 갈래?','일단 해보자, 시장 스타트업!'],on:'쑥쑥 크는 도시가 젊은 창업가를 불러냈어요!',t:{popm:1.1,inc:1.05},f:function(a){return a.pop/90+(a.emp>.6?1:0)},
 gen:function(r){var g=r()<.5;return{sk:pk(r,SKINS),hc:pk(r,['#8F7CFF','#19B5C8','#FF7AB0','#3a3a5a','#B8A8FF']),ec:pk(r,ECS),ek:g?'big':'sharp',hb:g?pk(r,['bob','pony','twin']):'short',hf:g?pk(r,['curtain','sweep']):'sweep',cl:'hoodie',cc:pk(r,['#2A2750','#3a2f6a','#1f4a5a','#5a2f5a']),cc2:'#19D3DA',acc:[pk(r,['goggles','phones','star'])],mo:pk(r,['smile','cat','grin']),bg:pk(r,['#C7F1FF','#E1D4FF','#D5F8E6']),bl:'#ff9aa8',bo:.45}}},
{k:'ojisan',role:'정 많은 아재 시장',names:['오지콤 아저씨','오지콤 부장님','오지콤 사장님'],q:['자자~ 이 아저씨만 믿어봐! 허허허','아재 개그 하나 할까? 허허'],on:'콘크리트 숲 시민들이 정 많은 아저씨를 선택했어요.',t:{inc:1.05,hap:3,adm:.92},f:function(a,tc){return(tc.a||0)*.3+(approv<40?2:0)+.8},
 gen:function(r){return{sk:pk(r,SKINS.slice(1,4)),hc:pk(r,['#4a3a3a','#3a3030','#6a5a50']),ec:'#2a1f3d',ek:'soft',hb:'none',hf:'comb',cl:'blazer',cc:pk(r,['#8A93A8','#6a7288','#7a6a60']),cc2:pk(r,['#FF7A8A','#E5566D','#5BB8FF']),acc:[],gl:'round',gc:pk(r,['#8a5a3a','#3a3a48']),ms:1,sw:1,mo:'grin',bg:pk(r,['#FFE9C7','#E6EEF8','#FFE0D6']),bl:'#ff8f8f',bo:.7}}}];

function mas(md){return av(MASCOT,md,88)}
/* ---- 시장 선출 시스템 (랜덤 조합) ---- */
var myi=0,mys=1,CM=null,LB={inc:'전체 수입',com:'상가·업무',ind:'공장·항구',tour:'관광',adm:'행정비',up:'유지비',cost:'건설비',park:'공원 효과',dmg:'재난 피해',fire:'화재 확산',popm:'인구 증가',hap:'만족'},
QK=[{g:'관광 덕후',t:{tour:1.2}},{g:'절약왕',t:{adm:.93}},{g:'꼼꼼한',t:{up:.92}},{g:'공사 마스터',t:{cost:.94}},{g:'공원 사랑',t:{park:1.15}},{g:'친절한',t:{hap:2}},{g:'상권 달인',t:{com:1.08}},{g:'공장 옹호',t:{ind:1.12}},{g:'안전 제일',t:{dmg:.85}},{g:'이주 환영',t:{popm:1.06}},{g:'사업 수완',t:{inc:1.04}}];
function mk(a,s){var r=rng(s),A=ARCH[a],t={},k;for(k in A.t){var v=A.t[k];t[k]=k==='hap'?Math.round(v+(r()*2-1)*1.5):+(1+(v-1)*(.6+r()*.8)).toFixed(2)}
var qk=QK[Math.floor(r()*QK.length)];for(k in qk.t){if(k==='hap')t[k]=(t[k]||0)+qk.t[k];else t[k]=+((t[k]||1)*qk.t[k]).toFixed(2)}
var d=[];for(k in t){if(k==='hap'){if(t[k])d.push('만족 '+(t[k]>0?'+':'')+t[k])}else d.push(LB[k]+' ×'+t[k])}
return{a:a,s:s,n:pk(r,A.names),r:qk.g+' '+A.role,q:pk(r,A.q),on:A.on,t:t,d:d.join(' · '),cfg:A.gen(rng(s+7))}}
function cmy(){if(!CM||CM.a!==myi||CM.s!==mys)CM=mk(myi,mys);return CM}
function rollM(a){myi=a;mys=Math.floor(Math.random()*1e9)+1;CM=null}
function apQ(q){for(var k in q){if(k==='hap')P.hap+=q[k];else P[k]*=q[k]}}
function mUI(){var e=$('mayor'),k=myi+'_'+mys;if(!e||e.dataset.k===k)return;e.dataset.k=k;var y=cmy();e.innerHTML='<div class="pt">'+av(y.cfg,'ok')+'</div><div><i>MAYOR</i><b>'+y.n+' · '+y.r+'</b><small>'+y.d+'</small></div>'}
function pickMayor(ex){var a=compute(),tc=a.tc||{},fc=Object.keys(fires).length,b=-1,bi=0;ARCH.forEach(function(y,i){if(i===ex)return;var v=y.f(a,tc,fc)+Math.random()*1.5;if(v>b){b=v;bi=i}});rollM(bi)}
function mayorCard(why){ovq(function(){var y=cmy();SF.ev(2);ovShow('<div class="evc r2 mc"><span class="rb">NEW MAYOR</span><div class="mpt">'+av(y.cfg,'happy')+'</div><h3>'+y.n+' · '+y.r+'</h3><p>'+why+'<br><b>“'+y.q+'”</b><br><small>시정 성향: '+y.d+'</small></p><button id="mk">시정 시작 ▶</button></div>');$('mk').onclick=function(){SF.ms();ovq(polCard);ovn()}})}
function say(md,t,force){var n=Date.now();if(!force&&n-lastSay<6000)return;lastSay=n;$('mc').innerHTML=mas(md);$('mt').textContent=t}
function logA(k){AL.push({t:Date.now(),k:k});if(AL.length>60)AL.shift()}
function react(){var n=Date.now(),L=AL.filter(function(a){return n-a.t<30000}),c=function(k){return L.filter(function(a){return a.k===k}).length},tot=L.length,fc=Object.keys(fires).length;
if(fc)return say('worry',rp(['불이야!! 빨리 꺼 주세요~','앗 뜨거워! 불난 칸을 눌러 줘요!','소방차는 언제 와요ㅠㅠ']));
if(approv<30&&S0.pop>=20)return say('worry',rp(['시민들이 화났어요... 지지율이 위험해요!','탄핵 얘기가 들려요ㅠㅠ 달래 주세요!']));
if(!tot&&speed>0)return say('sleep',rp(['zzZ... 계획가님 아직 계세요?','졸려요... 뭐라도 지어 봐요~']));
if(c('x')>=3)return say('wow',rp(['또 부수세요?! 철거 중독이에요?','헉, 방금 뭐가 사라졌어요?!']));
if(c('d')>=8)return say('happy',rp(['길 깔기 장인이시군요! 🛣️','도로가 쭉쭉~ 길 덕후 인정!']));
if(c('p')>=2)return say('love',rp(['초록초록~ 공원 최고예요 🌳','공원에서 도시락 먹고 싶다!']));
if(c('f')>=2)return say('worry',rp(['콜록콜록... 공장 연기가...','하늘이 뿌예져요ㅠㅠ']));
if(c('v')+c('w')+c('q')>=1)return say('wow',rp(['산에 뭘 지으시는 거예요?!','케이블카 타고 싶다~!']));
if(tot>=7)return say('wow',rp(['와~ 건설 폭주!','손이 안 보여요! 💨']));
if(budget<150&&tot)return say('worry',rp(['지갑이 얇아졌어요...','돈이 없어요ㅠㅠ 아껴 써야 해요!']));
if(S0.hap>=70&&S0.pop>=30)return say('love',rp(['시민들이 행복해해요! 우리 계획가님 최고!','도시가 반짝반짝해요 ✦']));
if(Math.random()<.4)say('ok',rp(['오늘도 도시는 잘 굴러가요~','저는 도리예요! 옆에서 응원할게요.','지하철 놓으면 상가가 좋아한대요!','바이옴마다 특징이 달라요. 호버해 보세요!','말풍선(💬)을 눌러 보세요, 선물이 있어요.',cmy().n+': '+cmy().q]))}
/* ---- 이벤트 ---- */
function ign(t,n){var l=[];near(t,n,function(j){var g=grid[j];if(g!=='W'&&g!=='S'&&fires[j]===undefined)l.push(j)});l.sort(function(){return Math.random()-.5});fires[t]=0;l.slice(0,6).forEach(function(j){fires[j]=0})}
var EV=[
{r:0,t:'청년 축제 제안',d:'시민단체가 도심 축제를 열자고 합니다.',ok:function(){return budget>=150},a:['개최 (−150)',function(){budget-=150;md('hap',10,6);return'6개월간 만족도 +10'}],b:['거절',function(){return'조용한 한 해였어요.'}]},
{r:0,t:'국가 보조금 선정',d:'지역 균형발전 사업에 선정되었어요.',a:['+250 받기',function(){budget+=250;return'보조금 250을 받았어요.'}]},
{r:0,t:'상수도관 파열',d:'낡은 배관이 터졌어요.',a:['즉시 수리 (−150)',function(){budget-=150;return'수리 완료. 피해 없음'}],b:['미루기',function(){md('hap',-8,6);return'6개월간 만족도 −8'}]},
{r:0,t:'공원 확충 청원',d:'시민들이 공원을 늘려 달라고 합니다.',ok:function(){return budget>=100},a:['지원 (−100)',function(){budget-=100;md('hap',8,8);return'8개월간 만족도 +8'}],b:['무시',function(){md('hap',-3,4);return'4개월간 만족도 −3'}]},
{r:0,t:'길고양이 스타 탄생',d:'도심 길고양이가 SNS 스타가 되었어요.',ok:has('c'),a:['귀엽다!',function(){md('incC',1.2,4);return'4개월간 상가 매출 ×1.2'}]},
{r:0,t:'장마 대비 점검',d:'올해 장마가 길 거라고 합니다.',ok:function(){return budget>=90},a:['제방 보강 (−90)',function(){budget-=90;md('dike',1,8);return'8개월간 침수 피해 면제'}],b:['그냥 둔다',function(){return'운에 맡겼어요.'}]},
{r:0,t:'주민 설문조사',d:'시민들이 가장 원하는 것을 물었어요.',ok:function(){return budget>=80},a:['교통 개선 (−80)',function(){budget-=80;md('inc',1.1,6);return'6개월간 수입 ×1.1'}],b:['녹지 확대 (−80)',function(){budget-=80;md('hap',6,6);return'6개월간 만족도 +6'}]},
{r:0,t:'공사비 폭등',d:'자재값이 치솟고 있어요.',a:['비축 자재 구매 (−100)',function(){budget-=100;return'폭등을 피했어요.'}],b:['감수한다',function(){md('cost',1.25,6);return'6개월간 건설비 ×1.25'}]},
{r:0,t:'푸드트럭 허가 논쟁',d:'골목에 푸드트럭을 허용할까요?',ok:has('c'),a:['허가',function(){md('incC',1.2,5);md('hap',-2,5);return'상가 ×1.2, 만족 −2 (5개월)'}],b:['금지',function(){md('hap',2,3);return'골목이 조용해졌어요 (+2)'}]},
{r:0,t:'시민 마라톤 대회',d:'도시를 가로지르는 마라톤을 열자는 제안이에요.',ok:function(){return budget>=100},a:['개최 (−100)',function(){budget-=100;md('hap',5,4);md('incV',1.3,4);return'만족 +5, 관광 ×1.3 (4개월)'}],b:['취소',function(){return'다음에 하기로 했어요.'}]},
{r:1,t:'산불 발생!',d:'산과 숲에서 불길이 올라옵니다.',ok:function(){return pickT(['F','H','M'])>=0},pre:function(e){e._f=pickT(['F','H','M']);fires[e._f]=0;SF.fire()},a:['헬기 출동 (−120)',function(){delete fires[this._f];budget-=120;return'헬기가 초기 진압에 성공했어요.'}],b:['지켜본다',function(){return'불이 번질 수 있어요. 불난 칸을 눌러 진화하세요(−40).'}]},
{r:1,t:'공장 화재',d:'공장에서 불이 났어요.',ok:has('f'),pre:function(e){e._f=pickT(['f']);fires[e._f]=0;SF.fire()},a:['소방 지원 (−100)',function(){delete fires[this._f];budget-=100;return'빠른 진화로 피해를 막았어요.'}],b:['피해 감수',function(){return'불이 번지고 있어요. 불난 칸을 눌러 진화하세요(−40).'}]},
{r:1,t:'SNS에서 화제',d:'우리 동네 상가가 핫플이 되었어요.',ok:has('c'),a:['좋아요!',function(){md('incC',1.4,4);return'4개월간 상가 매출 ×1.4'}]},
{r:1,t:'대기업 본사 유치 제안',d:'대기업이 우리 도시를 검토 중입니다.',ok:function(){return budget>=200},a:['인센티브 (−200)',function(){budget-=200;md('incO',1.6,12);return'12개월간 업무 소득 ×1.6'}],b:['거절',function(){return'기업이 다른 도시로 떠났어요.'}]},
{r:1,t:'철새 도래',d:'희귀 철새가 도시를 찾았어요.',ok:function(){return S0&&S0.eco>=.1},a:['환영!',function(){md('hap',8,6);md('incV',1.5,6);return'만족 +8, 관광 ×1.5 (6개월)'}]},
{r:1,t:'미세먼지 경보',d:'하늘이 뿌옇습니다.',ok:function(){return budget>=80},a:['마스크 배포 (−80)',function(){budget-=80;return'시민들이 안심했어요.'}],b:['무시',function(){md('hap',-8,3);return'3개월간 만족도 −8'}]},
{r:1,t:'지하 유물 발굴',d:'공사 중 수상한 유물이 나왔어요.',ok:function(){return budget>=100},a:['발굴 (−100)',function(){budget-=100;if(Math.random()<.6){budget+=450;md('incV',1.4,6);return'대박! +450, 관광 ×1.4 (6개월)'}return'그냥 돌멩이였어요...'}],b:['다시 묻는다',function(){return'미스터리로 남았어요.'}]},
{r:1,t:'노조 파업',d:'공장·업무시설 노동자들이 파업을 예고했어요.',ok:function(){return cnt('f')+cnt('o')>0},a:['임금 인상 (−150)',function(){budget-=150;return'합의 완료.'}],b:['강경 대응',function(){md('incO',.5,3);md('hap',-4,3);return'업무 소득 ×0.5, 만족 −4 (3개월)'}]},
{r:1,t:'도시 해킹 사건',d:'누군가 시 전산망을 해킹했어요.',a:['몸값 지불 (−200)',function(){budget-=200;return'데이터가 복구됐어요.'}],b:['버틴다',function(){if(Math.random()<.5){md('inc',.8,3);return'피해 발생. 수입 ×0.8 (3개월)'}return'백업 덕분에 무사했어요!'}]},
{r:2,t:'올림픽 유치 도전',d:'도시의 운명을 건 도전입니다.',ok:function(){return budget>=300},a:['도전! (−300)',function(){budget-=300;if(Math.random()<.5){budget+=1500;md('inc',1.3,12);return'유치 성공! +1500, 수입 ×1.3 (12개월)'}md('hap',-10,6);return'유치 실패... 만족 −10 (6개월)'}],b:['포기',function(){return'안전한 길을 택했어요.'}]},
{r:2,t:'정체불명의 비행체 착륙',d:'도심 광장에 은색 원반이 내려앉았습니다.',a:['환영 파티',function(){md('incV',2,8);md('incC',1.5,8);md('hap',-5,8);return'관광·상가 폭발! 만족 −5 (8개월)'}],b:['돌려보낸다',function(){budget+=300;return'외계인이 선물(+300)을 두고 떠났어요.'}]},
{r:2,t:'익명의 거액 기부',d:'어느 노신사가 도시에 큰돈을 기부했어요.',a:['감사히 받는다',function(){budget+=700;return'+700을 받았어요.'}]},
{r:2,t:'천재 건축가 방문',d:'세계적 건축가가 설계를 제안합니다.',ok:function(){return budget>=250},a:['맡긴다 (−250)',function(){budget-=250;md('hap',12,10);return'10개월간 만족도 +12'}],b:['거절',function(){return'건축가는 옆 도시로 갔어요.'}]},
{r:2,t:'AI 시장 비서 도입',d:'초지능 비서가 모든 행정을 맡겠다고 합니다.',ok:function(){return budget>=200},a:['도입 (−200)',function(){budget-=200;md('inc',1.25,12);md('hap',-4,12);return'수입 ×1.25, 만족 −4 (12개월)'}],b:['거절',function(){return'인간 시장이 최고죠!'}]},
{r:2,t:'우주 엘리베이터 후보지',d:'우리 도시가 후보지로 거론돼요!',ok:function(){return S0&&S0.pop>=150&&budget>=400},a:['유치 도전 (−400)',function(){budget-=400;if(Math.random()<.4){budget+=2000;md('incV',2,12);return'선정! +2000, 관광 ×2 (12개월)'}md('hap',-6,6);return'탈락... 만족 −6 (6개월)'}],b:['포기',function(){return'땅에 발붙이기로 했어요.'}]},
{r:3,t:'테러 위협 경보',d:'익명의 협박 신호가 접수됐어요. 시민들이 불안해합니다.',ok:function(){return m>=10},a:['경찰 증강 (−200)',function(){budget-=200;md('hap',-2,3);return'무사히 넘겼어요. 시민들이 조금 긴장했어요.'}],b:['점검만 한다 (−80)',function(){budget-=80;if(Math.random()<.5){md('hap',-12,4);budget-=150;return'폭발물 소동! 피해 −150, 만족 −12 (4개월)'}return'오인 신고였어요. 휴.'}],sf:1},
{r:3,t:'국가비상사태 선포',d:'중앙정부가 전국에 비상사태를 선포했어요.',ok:function(){return m>=12},a:['정부에 협조',function(){budget+=600;md('inc',.85,12);md('hap',-5,6);return'+600 지원, 수입 ×0.85 (12개월), 만족 −5'}],b:['자치 고수',function(){md('cost',1.2,6);md('hap',4,4);return'시민 지지↑ 만족 +4, 건설비 ×1.2 (6개월)'}]},
{r:3,t:'시민 봉기!',d:'분노한 시민들이 시청 앞에 모였어요. 혁명의 기운이 감돕니다.',ok:function(){return approv<40&&m>=8},a:['개혁안 수용 (−300)',function(){budget-=300;md('hap',12,8);approv=Math.min(100,approv+15);return'민심이 가라앉았어요.'}],b:['강경 진압',function(){if(Math.random()<.5){md('hap',-10,6);approv-=10;return'봉기를 진압했지만 상처가 깊어요.'}rev=1;return'진압 실패... 혁명이 일어났습니다!'}]},
{r:3,t:'대규모 정전',d:'도시 전체가 암흑에 빠졌어요.',a:['긴급 복구 (−200)',function(){budget-=200;return'전기가 돌아왔어요!'}],b:['버틴다',function(){md('inc',.7,3);md('hap',-8,4);return'수입 ×0.7, 만족 −8 (3~4개월)'}]},
{r:3,t:'신종 감염병 유행',d:'정체불명의 감염병이 퍼지고 있어요.',ok:function(){return S0&&S0.pop>=100},a:['방역 총력 (−250)',function(){budget-=250;md('hap',-3,4);return'확산을 막았어요. 만족 −3 (4개월)'}],b:['그냥 둔다',function(){md('inc',.6,4);md('hap',-10,4);return'수입 ×0.6, 만족 −10 (4개월)'}]}],rev=0;
var RW={'아틀란티스 쓰나미':{ok:function(){return cnt('S')>0},fn:function(){var d=0,n=0;Object.keys(S0.S).forEach(function(k){k=+k;var hit=0;near(k,2,function(j){if(grid[j]==='S')hit=1});if(hit&&under[k]!=='H'){d+=B[grid[k]][2]*.3*P.dmg;n++}});d=Math.round(d);budget-=d;md('incV',1.6,6);SF.wave();return'아틀란티스가 솟아올랐어요! 해안 건물 '+n+'곳 −'+d+', 유적 관광 ×1.6 (6개월)'}},
'화산 폭발':{ok:has('M'),fn:function(){ign(pickT(['M']),2);md('hap',-6,4);md('incV',1.4,4);SF.boom();return'고산이 폭발했어요! 용암이 번집니다. 불난 칸을 눌러 진화하세요. 화산 구경 관광 ×1.4'}},
'유성우':{ok:function(){return 1},fn:function(){md('incV',1.5,3);budget+=200;var s=Object.keys(S0.S),msg2='';if(s.length&&Math.random()<.3){var k=+rp(s);grid[k]=under[k]||'g';under[k]='';msg2=' 운석이 건물 하나를 날렸어요!'}return'별똥별 조각을 팔아 +200, 관광 ×1.5 (3개월).'+msg2}},
'솜사탕 비':{ok:function(){return 1},fn:function(){md('hap',10,3);md('incC',1.2,3);return'달콤한 비! 만족 +10, 상가 ×1.2 (3개월)'}},
'개구리 비':{ok:function(){return 1},fn:function(){md('hap',-5,3);md('incV',1.3,3);return'개굴개굴... 만족 −5, 관광 ×1.3 (3개월)'}},
'오로라':{ok:function(){return 1},fn:function(){md('incV',2,3);md('hap',4,3);return'오로라가 도시를 물들였어요. 관광 ×2, 만족 +4 (3개월)'}},
'황금 눈':{ok:function(){return 1},fn:function(){budget+=450;return'황금빛 눈을 주워 +450!'}}};
function roll(k){return wfix(roll0(k))}
function roll0(k){var l=WX[sea(k)],p=Math.random(),a=0;if(m>=4&&Math.random()<.05){var c=Object.keys(RW).filter(function(n){return RW[n].ok()});if(c.length)return rp(c)}for(var i=0;i<l.length;i++){a+=l[i][1];if(p<a)return l[i][0]}return l[0][0]}
function onWeather(w){var r=RW[w];if(!r)return;var t=r.fn();SF.ev(2);toast(w+'!');say('wow',t,1);msg(t)}
var MS_=[['도로 8칸 깔기',function(){return cnt('d')>=8},80],['인구 60명 돌파',function(){return S0.pop>=60},150],['고용률 60% 이상 (인구 30+)',function(){return S0.pop>=30&&S0.emp>=.6},150],['지하철역 개통',function(){return cnt('t')>0},250],['산에서 돈 벌기 (풍력·채석장·케이블카)',function(){return cnt('w')+cnt('q')+cnt('v')>0},200],['서로 다른 바이옴 3곳에 건물 짓기',function(){var s={};for(var i=0;i<N;i++)if(S0.S[i])s[bio[i]]=1;return Object.keys(s).length>=3},300],['항구 개설',function(){return cnt('k')>0},250],['인구 200명 + 지지율 60%',function(){return S0.pop>=200&&approv>=60},400],['건물 레벨 3 달성 (★★)',function(){return lv.some(function(v){return v>=3})},300],['인구 400명 대도시',function(){return S0.pop>=400},600],['재선 성공',function(){return tn>=1},800]];
function newGame(){
var s=Math.floor(Math.random()*1e6)+1;function r(){s=(s*9301+49297)%233280;return s/233280}
grid=Array(N).fill('g');under=Array(N).fill('');bio=[];lv=Array(N).fill(1);lvp=Array(N).fill(0);fires={};bub={};
var sd=[[5,3],[15,3],[5,8],[15,8],[10,6]].map(function(p){return[p[0]+Math.floor(r()*5-2),p[1]+Math.floor(r()*3-1)]}),bm=pickBio(r);
for(var i=0;i<N;i++){var x=i%W,y=i/W|0,bd=1e9,bb=0;sd.forEach(function(p,k){var d=Math.abs(x-p[0])+Math.abs(y-p[1])+r()*3;if(d<bd){bd=d;bb=bm[k]}});bio[i]=bb}
for(x=0;x<W;x++){var dp=1+Math.round(r()*1.2);for(y=H-dp;y<H;y++)grid[y*W+x]='S'}
var cx=4+Math.floor(r()*(W-8));for(y=0;y<H;y++){if(grid[y*W+cx]==='S')break;grid[y*W+cx]='W';if(r()<.5){cx=Math.max(3,Math.min(W-4,cx+(r()<.5?-1:1)));if(grid[y*W+cx]!=='S')grid[y*W+cx]='W'}}
for(var k=0;k<2;k++){var c=Math.floor(r()*N),cxx=c%W,cyy=c/W|0;if(cyy>H-4||grid[c]!=='g'){k--;continue}
near(c,3,function(j,d){if(grid[j]!=='g')return;if(d<=1)grid[j]='M';else if(r()<.75)grid[j]='H'});grid[c]='M'}
for(k=0;k<3;k++){c=Math.floor(r()*N);if(grid[c]==='g'){near(c,1,function(j){if(grid[j]==='g'&&r()<.8)grid[j]='H'});grid[c]='H'}}
for(k=0;k<9;k++){c=Math.floor(r()*N);if(BT[bio[c]][8]>=.7&&r()<.7)continue;[0,1,-1,W,-W,W+1].forEach(function(o){var j=c+o;if(j>=0&&j<N&&grid[j]==='g'&&Math.abs(j%W-c%W)<=1)grid[j]='F'})}
m=0;acc=0;speed=0;budget=2000;mods=[];pol=[];cons={};vr=Array(N).fill(0);pops={};rollM(Math.floor(Math.random()*ARCH.length));calcP();lastEv=-9;over=false;mi=0;tn=0;approv=60;lowA=0;rev=0;AL=[];pend=[];ovOn=false;wx=roll(0);nx=roll(1);
$('ov').hidden=true;legend();msg('기후 테마 「'+BT[cz-1][0]+'」 일대 (스펙트럼 '+cz+'/20) — 도로를 깔고 집과 일터를 지으세요. 건물은 짓는 데 시간이 걸려요.');say('happy','안녕하세요 계획가님! 저는 도리예요 ✦',1);done();ovq(intro)}
function compute(){
var S={},pop=0,J=0,st=0,hh=0,rd=0,fo=0,pk=0,sch=0,i,hm=P.hap,se=sea(m),tc={},gp=[],im=cm('inc')*P.inc,cc=cm('incC')*P.com,om=cm('incO')*P.com,vm=cm('incV')*P.tour,fc=Object.keys(fires).length;
mods.forEach(function(o){if(o.k==='hap')hm+=o.v});
for(i=0;i<N;i++){var t=grid[i];if(t==='F')fo++;if(t==='d'){rd++;continue}if(!B[t])continue;if(cons[i])continue;tc[t]=(tc[t]||0)+1;if(t==='p')pk++;if(t==='s')sch++;
var bh=BIO[bio[i]][1],fx=[];if(hm)fx.push('정책·이벤트 '+f(hm));if(bh)fx.push(BIO[bio[i]][0]+' '+f(bh));
S[i]={t:t,hap:50+hm+bh,fx:fx,sub:false,inc:0,lv:lv[i]||1,up:B[t][3],fire:fires[i]!==undefined,act:fires[i]===undefined&&(t==='k'?nb(i).some(function(j){return grid[j]==='S'})&&nb(i).some(function(j){return grid[j]==='d'}):nb(i).some(function(j){return grid[j]==='d'}))};
if(under[i]==='H'){S[i].hap+=5;S[i].fx.push('고지대 전망 +5')}}
for(i in S){var s=S[i];if(!s.act)continue;var b=B[s.t];if(b[4])hh+=b[4]*(1+.4*(s.lv-1));else if(b[5]){J+=b[5];if(s.t==='c')st++}}
pop=Math.round(hh*3*P.popm);
if(pop>=80&&!sch)gp.push(['학교 부족',-8]);if(pop>=150&&pk<2)gp.push(['공원 부족',-6]);if(budget<0)gp.push(['재정 위기',-10]);
Object.keys(S).forEach(function(k){var s=S[k],g={},pr=false,bi=bio[k];
near(+k,3,function(j,d){var u=grid[j];if(g[u])return;
if(u==='p'&&d<=2){g[u]=1;pr=true;var hp=Math.round(15*(1+.3*BT[bi][10])*P.park);s.hap+=hp;s.fx.push('공원 +'+hp)}
else if(u==='s'){g[u]=1;s.hap+=10;s.fx.push('학교 +10')}
else if(u==='t'){g[u]=1;s.sub=true;s.hap+=10;s.fx.push('지하철 +10')}
else if(u==='f'&&d<=2){g[u]=1;s.hap-=25;s.fx.push('공장 오염 −25')}
else if(u==='q'&&d<=2){g[u]=1;s.hap-=20;s.fx.push('채석장 소음 −20')}
else if(u==='a'&&d<=1&&s.t==='r'){g[u]=1;s.hap-=8;s.fx.push('아파트 소음 −8')}
else if(u==='F'&&d<=1){g[u]=1;s.hap+=6;s.fx.push('숲 +6')}
else if(u==='M'&&d<=1){g[u]=1;s.hap+=4;s.fx.push('산 조망 +4')}
else if(u==='S'&&d<=1){g[u]=1;s.hap+=4;s.fx.push('바다 전망 +4')}
else if(u==='W'&&d<=1){g[u]=1;s.hap+=5;s.fx.push('수변 +5')}});
gp.forEach(function(a){s.hap+=a[1];s.fx.push(a[0]+' '+a[1])});
if(wx==='폭염'&&B[s.t][4]&&!pr){s.hap-=8;s.fx.push('폭염 −8')}
if(BT[bi][7]>=.5&&se===1&&B[s.t][4]){var hh6=Math.round(6*BT[bi][7]);s.hap-=hh6;s.fx.push('여름 더위 −'+hh6)}
s.hap=Math.max(0,Math.min(100,s.hap))});
var emp=pop?Math.min(1,J/(pop*.5)):0,wf=J?Math.min(1,pop*.5/J):0,inc=0,up=rd*.3,sw=0,sh=0,adm=(10+pop*.15)*P.adm*(1+.05*tn),TM=[1,.8,1.8,1.5];
for(i in S){var s=S[i],t=s.t,b=B[t],bi=bio[i],lm=1+.5*(s.lv-1);
if(s.act){if(b[4]){s.inc=(t==='r'?9:32)*(.5+.5*emp)*s.hap/100*lm;sh+=s.hap*b[4];sw+=b[4]}
else if(t==='c')s.inc=16*Math.min(1,pop/(st*45))*(s.sub?1.25:1)*(.4+.6*wf)*(se===2?1.15:1)*(wx==='한파'?.8:wx==='눈'?.9:1)*cc*lm;
else if(t==='o')s.inc=36*(s.sub?1:.7)*(.4+.6*wf)*om*lm;
else if(t==='f')s.inc=26*(.4+.6*wf)*P.ind*(1+.2*BT[bi][8]);
else if(t==='w')s.inc=wx==='태풍'?0:24*(se>=2?1.25:1)*(1+.2*BT[bi][8])*(under[i]==='M'?1.3:1);
else if(t==='q')s.inc=42*P.ind;
else if(t==='v')s.inc=30*TM[se]*(wx==='폭우'||wx==='태풍'?.4:1)*vm*(1+.3*BT[bi][9]);
else if(t==='k')s.inc=34*(.4+.6*wf)*P.ind*(wx==='태풍'?.5:1);
s.inc*=im}
s.up*=(1+.3*(s.lv-1))*P.up;if(BT[bi][9]>0&&se===3)s.up*=1+.3*BT[bi][9];if(wx==='한파'&&b[4])s.up*=1.5;
inc+=s.inc;up+=s.up}
var hap=sw?sh/sw:0,eco=(fo+pk)/N;
return{S:S,tc:tc,pop:pop,emp:emp,hap:hap,eco:eco,fc:fc,net:inc-up-adm,score:Math.round(pop+hap*4+emp*120+Math.max(0,budget)/15+eco*250+mi*60+tn*300)}}
function roadSvg(i){var u=i>=W&&grid[i-W]==='d',d=i<N-W&&grid[i+W]==='d',l=i%W>0&&grid[i-1]==='d',r=i%W<W-1&&grid[i+1]==='d',c='#7B8A9E';
return'<svg viewBox="0 0 10 10" width="100%" height="100%"><rect x="2.8" y="2.8" width="4.4" height="4.4" fill="'+c+'"/>'+(u?'<rect x="2.8" y="0" width="4.4" height="3" fill="'+c+'"/>':'')+(d?'<rect x="2.8" y="7" width="4.4" height="3" fill="'+c+'"/>':'')+(l?'<rect x="0" y="2.8" width="3" height="4.4" fill="'+c+'"/>':'')+(r?'<rect x="7" y="2.8" width="3" height="4.4" fill="'+c+'"/>':'')+'</svg>'}
function lab(){for(var k in tbtn){var b=tbtn[k];b.innerHTML='<span class="ic" style="background:'+(k==='x'?'#FF6A3D':B[k][1])+'">'+sv(IC[k],'#fff','16')+'</span>'+(k==='x'?'철거':B[k][0]+' <small>'+cst(k)+'</small>'+(B[k][7]?' <em>산</em>':k==='k'?' <em>해안</em>':''))}}
function render(){mUI();
S0=compute();
for(var i=0;i<N;i++){var c=cells[i],t=grid[i],cl='c',bg='',fl='',h='',fr=fires[i]!==undefined,bi='b'+bio[i];
if(t==='g')bg=bc(i,bio[i]);
else if(t==='W')cl+=' w';
else if(t==='S')cl+=' sea';
else if(t==='F'){bg=sb(i,'f');h=sv(IC.F,'rgba(255,255,255,.55)')}
else if(t==='H'){bg=mc(i,bio[i],0);h=sv(IC.H,'rgba(60,100,60,.35)')}
else if(t==='M'){bg=mc(i,bio[i],1);h=sv(IC.M,'rgba(55,70,92,.55)')}
else if(t==='d'){if(under[i]==='W')cl+=' w br';else bg=under[i]==='M'||under[i]==='H'?mc(i,bio[i],under[i]==='M'?1:0):bc(i,bio[i]);h=roadSvg(i)}
else if(cons[i]){var q=cons[i],pc=Math.round((1-q.r/q.t)*100);bg='repeating-linear-gradient(45deg,#F2C94C 0 6px,#5b6577 6px 12px)';cl+=' b cs';h=sv(IC[t],'rgba(255,255,255,.6)')+'<i class="cp"><b style="width:'+pc+'%"></b></i><i class="crn">🏗</i>'}
else{var v=vr[i]||(Math.floor(R(i)*900)+1),v1=(v%97)/97,v2=(v%53)/53;bg=B[t][1];fl='brightness('+(.86+v1*.26).toFixed(2)+') hue-rotate('+((v2-.5)*36).toFixed(0)+'deg)';cl+=' b';if(pops[i])cl+=' pop';if(!S0.S[i].act&&!fr)cl+=' off';h=sv(IC[t],'#fff',(68+v%3*8)+'%');if(v%4)h+='<i class="dc d'+(v%4)+'"></i>';if((lv[i]||1)>1)h+='<i class="lv">'+'★'.repeat(lv[i]-1)+'</i>'}
if(fr){cl+=' fire';h+=FL}
if(bub[i]&&!fr)h+=BB;
var key=cl+bg+h;if(c._k!==key){c._k=key;c.className=cl;c.style.background=bg;c.style.filter=fl;c.innerHTML=h}}
var a=S0,se=sea(m),mn=(m+2)%12+1,yr=Y0+Math.floor((m+2)/12);
if(yr!==lastYr){lastYr=yr;lab()}
$('dt').innerHTML='<span class="au">'+yr+'</span>년 '+mn+'월<span class="pill" style="background:'+SC[se]+'">'+SE[se]+'</span>';
$('left').textContent=(tn+1)+'기 임기 · 선거까지 '+Math.max(0,TERM*(tn+1)-m)+'개월';
$('w1').innerHTML=ws(wx,24);$('w2').innerHTML=ws(nx,16);
$('bud').textContent=Math.round(budget);$('bud').className=budget<0?'neg':'';$('pop').textContent=a.pop;$('apv').textContent=Math.round(approv)+'%';$('apv').className=approv<30?'neg':'';$('sc').textContent=a.score;
$('emp').textContent=Math.round(a.emp*100)+'%';$('eco').textContent=Math.round(a.eco*100)+'%';$('net').textContent=f(a.net);$('best').textContent=best;
$('wt').innerHTML='<b>이번 달 날씨</b>'+WT[wx];
var ML={hap:'만족 ',inc:'수입 ×',incC:'상가 ×',incO:'업무 ×',incV:'관광 ×',dike:'제방 보강 ',cost:'건설비 ×'};
$('mods').innerHTML=(a.fc?'<span class="f">화재 '+a.fc+'건</span>':'')+pol.map(function(i){return'<span class="p">'+PO[i][0]+'</span>'}).join('')+mods.map(function(o){return'<span>'+ML[o.k]+(o.k==='hap'?f(o.v):o.k==='dike'?'':o.v)+' · '+o.m+'개월</span>'}).join('');
$('mi').innerHTML=mi<MS_.length?'<b>미션 '+(mi+1)+'/'+MS_.length+'</b>'+MS_[mi][0]+' → 보상 +'+MS_[mi][2]:'<b>모든 미션 완료!</b>전설의 계획가시군요.';
bars()}
function bars(){$('mb').style.width=Math.min(100,acc/MS*100)+'%';$('tp').style.width=Math.min(100,(m+acc/MS-TERM*tn)/TERM*100)+'%';tint();document.querySelectorAll('#sp button').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.s===speed?'true':'false')})}
function save(){try{localStorage.setItem('usl4',JSON.stringify({g:grid,u:under,bi:bio,l:lv,lp:lvp,f:fires,bu:bub,m:m,a:acc,b:budget,w:wx,n:nx,o:mods,po:pol,e:lastEv,v:over,i:mi,t:tn,ap:approv,la:lowA,my:myi,ms:mys,cz:cz,cn:cons,vr:vr}));return 1}catch(e){return 0}}
function load(){try{var d=JSON.parse(localStorage.getItem('usl4'));grid=d.g;under=d.u;bio=d.bi;lv=d.l;lvp=d.lp;fires=d.f;bub=d.bu;m=d.m;acc=d.a;budget=d.b;wx=d.w;nx=d.n;mods=d.o;pol=d.po;lastEv=d.e;over=d.v;mi=d.i;tn=d.t;approv=d.ap;lowA=d.la;myi=ARCH[d.my]?d.my:0;mys=d.ms||1;CM=null;cz=d.cz||2;cons=d.cn||{};vr=d.vr||Array(N).fill(0);pops={};speed=0;pend=[];ovOn=false;rev=0;calcP();$('ov').hidden=true;render();legend();if(over)finish(1,'over');else msg('저장된 도시를 불러왔어요. ▶로 이어서 하세요.');return 1}catch(e){return 0}}
function chk(){if(mi<MS_.length&&MS_[mi][1]()){budget+=MS_[mi][2];toast('미션 완료! +'+MS_[mi][2]);SF.ms();say('love','미션 완료! 짝짝짝 ✦',1);mi++;render()}}
function done(){render();chk();save()}
function info(i){var t=grid[i],h,bi=bio[i];
if(fires[i]!==undefined)h='<b style="color:var(--hot)">화재!</b>눌러서 진화하세요 (−40). 방치하면 2개월 뒤 타버립니다.';
else if(t==='g')h='<b>'+BIO[bi][0]+' 지대</b>'+bnote(bi);
else if(t==='W')h='<b>강</b>건설 불가. 다리(도로)만 가능, 강의 40%까지.';
else if(t==='S')h='<b>바다</b>해안 땅에 항구를 지을 수 있어요. 아틀란티스가 숨어 있다는 소문이...';
else if(t==='F')h='<b>숲</b>정리하면 +40 비용과 환경 점수 하락. 불이 번지기 쉬워요.';
else if(t==='H')h='<b>낮은 산</b>건설비 ×1.3, 만족 +5(전망), 침수·쓰나미 안전. 풍력단지도 가능. ('+BIO[bi][0]+')';
else if(t==='M')h='<b>고산</b>일반 건물 불가. 산악도로(+40), 풍력·채석장·케이블카 가능. 주변 집은 조망 +4. 화산이 될지도...';
else if(cons[i]){h='<b>'+B[t][0]+' 건설 중</b>완공까지 '+cons[i].r+'개월 · 완공 전에는 수입·인구·유지비가 없어요.'}else{var b=B[t],s=S0.S[i];h='<b>'+b[0]+'</b>'+b[6];
if(s)h+='<br>연결: '+(s.act?'정상':'<span style="color:var(--hot)">도로에 닿지 않음 (생산 0)</span>')+'<br>Lv.'+s.lv+' · 만족도 '+Math.round(s.hap)+' · 월 소득 '+Math.round(s.inc)+' · 월 유지비 '+(Math.round(s.up*10)/10)+(s.fx.length?'<br>영향: '+s.fx.join(', '):'')}
$('ins').innerHTML=h}
function act(i){if(over||ovOn)return;var t=grid[i],cost,b;
if(fires[i]!==undefined){if(budget<40)return msg('진화 비용(40)이 부족합니다.');budget-=40;delete fires[i];SF.water();logA('w');msg('불을 껐어요!');say('happy','불 껐다! 고마워요 계획가님!');return done()}
if(bub[i]){delete bub[i];var g=Math.round(30+Math.random()*50+S0.pop/6);budget+=g;SF.coin();logA('b');if(Math.random()<.35){md('hap',3,3);msg('시민 제안: 기부금 +'+g+', 만족 +3 (3개월)')}else msg('시민 제안: 기부금 +'+g);say('happy',rp(['시민들이 고마워해요!','오~ 소통왕 계획가님!']));return done()}
if(tool==='x'){if(!B[t])return;budget+=Math.round(B[t][2]/2);grid[i]=under[i]||'g';under[i]='';lv[i]=1;lvp[i]=0;delete cons[i];vr[i]=0;SF.del();logA('x');msg('철거했습니다. 건설비의 50%가 환급됩니다.');return done()}
b=B[tool];cost=cst(tool,i);
if(t==='S')return msg('바다입니다. 항구는 바닷가 땅에 지어요.');
if(t==='W'){if(tool!=='d')return msg('강 위에는 다리(도로)만 놓을 수 있습니다.');
var tot=0,br=0;for(var k=0;k<N;k++){if(grid[k]==='W'||under[k]==='W')tot++;if(under[k]==='W')br++}
var mx=Math.floor(tot*.4);if(br+1>mx)return msg('강 보전 규칙: 다리는 강의 40%('+mx+'칸)까지만 가능합니다.');
cost=60;if(budget<cost)return msg('예산이 부족합니다.');budget-=cost;grid[i]='d';under[i]='W';SF.road();logA('d');return done()}
if(t==='M'){if(tool!=='d'&&!(b[7]||'').includes('M'))return msg('고산에는 도로와 풍력·채석장·케이블카만 지을 수 있어요.');
if(tool==='d')cost+=40;if(budget<cost)return msg('예산이 부족합니다.');budget-=cost;grid[i]=tool;under[i]='M';lv[i]=1;lvp[i]=0;bld(i,tool);SF.build();logA(tool);return done()}
if(t==='H'){if(tool==='d')cost+=20;if(budget<cost)return msg('예산이 부족합니다.');budget-=cost;grid[i]=tool;under[i]='H';lv[i]=1;lvp[i]=0;bld(i,tool);SF.build();logA(tool);return done()}
if(b[7])return msg(b[0]+'은(는) 산 전용 시설입니다.'+(b[7]==='HM'?' (낮은 산·고산)':' (고산)'));
if(tool==='k'&&!nb(i).some(function(j){return grid[j]==='S'}))return msg('항구는 바다에 맞닿은 땅에만 지을 수 있어요.');
if(t==='F')cost+=40;else if(t!=='g')return;
if(budget<cost)return msg('예산이 부족합니다.');
budget-=cost;grid[i]=tool;under[i]='';lv[i]=1;lvp[i]=0;bld(i,tool);tool==='d'?SF.road():SF.build();logA(tool);done()}
/* ---- 오버레이 큐 ---- */
function ovq(fn){pend.push(fn);if(!ovOn)ovn()}
function ovn(){var fn=pend.shift();if(!fn){ovOn=false;$('ov').hidden=true;speed=prev;bars();return}if(!ovOn){ovOn=true;prev=speed||1}speed=0;fn();bars()}
function intro(){ovShow('<div class="evc"><span class="rb">PLANNER 2050</span><h3>도시계획가님, 부임을 환영합니다</h3><p>이제 시장은 시민들이 뽑아요! 당신은 시장을 보좌하는 도시계획가예요. 4년마다 선거가 열리고, 도시 상황에 따라 미소녀 아이돌부터 오지콤 아저씨까지 헤어·얼굴·옷이 제각각인 시장이 랜덤으로 당선돼요. 성향도 조금씩 달라요. 지지율 50% 미만이면 시장 교체! 파산·탄핵·혁명이면 게임오버예요.</p><button id="go">첫 시장 만나기 ▶</button></div>');$('go').onclick=function(){startAudio();SF.ms();mayorCard('첫 선거에서 시민들이 선택한 시장이에요!');ovn()}}
function polCard(){var o=[];PO.forEach(function(p,i){if(pol.indexOf(i)<0)o.push(i)});o.sort(function(){return Math.random()-.5});
ovShow('<div class="evc pl"><span class="rb">POLICY</span><h3>시장에게 건의할 방침은?</h3><p>시장이 바뀌어도 한 번 채택한 방침은 유지돼요. 장단점을 잘 보세요!</p><div id="pb"></div></div>');
o.slice(0,3).forEach(function(i){var b=document.createElement('button');b.className='pol';b.innerHTML='<b>'+PO[i][0]+'</b><br><small>'+PO[i][1]+'</small>';b.onclick=function(){pol.push(i);calcP();SF.ms();msg('정책 채택: '+PO[i][0]);say('happy',PO[i][0]+'! 멋진 선택이에요 ✦',1);done();ovn()};$('pb').appendChild(b)})}
function election(){var ok=approv>=50,y=cmy();ovq(function(){SF.ev(ok?2:3);ovShow('<div class="evc r'+(ok?2:3)+'"><span class="rb">ELECTION</span><h3>'+(ok?(tn+1)+'기 임기 종료, '+y.n+' 재선 성공!':'개표 결과... '+y.n+' 낙선')+'</h3><p>최종 지지율 <b>'+Math.round(approv)+'%</b> (재선 기준 50%)'+(ok?'<br>보너스 +500. 다음 임기는 물가·행정비·재난이 더 거칠어져요.':'<br>시민들이 새 시장을 뽑아요. 지금 도시 상황에 맞는 후보가 당선됩니다!')+'</p><button id="el">'+(ok?'다음 임기 시작':'새 시장 확인')+'</button></div>');
$('el').onclick=function(){tn++;if(ok){budget+=500;toast('재선! +500');SF.ms();say('love','재선이다! 꺄아~ ✦',1);ovq(polCard);done();ovn()}else{budget+=300;pickMayor(myi);approv=55;lowA=0;calcP();mUI();toast('새 시장 당선! +300');say('wow','새 시장이 당선됐어요! 두근두근 ✦',1);mayorCard(cmy().on);done();ovn()}}})}
function finish(q,why){over=true;pend=[];ovOn=true;speed=0;var a=compute(),sc=a.score,tc=a.tc,c=function(k){return tc[k]||0};
if(!q&&sc>best){best=sc;try{localStorage.setItem('usl-best',sc)}catch(e){}}
var RS={bankrupt:['파산','재정이 바닥나 도시를 채권단에 넘겼어요.'],impeach:['탄핵','지지율 바닥, 시의회가 시장 탄핵안을 통과시켰어요.'],revolution:['혁명','시민 봉기가 성공해 시청이 점령당했어요.'],defeat:['낙선','선거에서 시민들의 선택을 받지 못했어요.'],retire:['은퇴','박수 속에 도시를 떠났어요.'],over:['종료','게임이 종료되었어요.']},
E=[[a.pop<40,'유령 도시의 외로운 계획가','시청보다 주민이 적은 도시. 일단 길부터 다시 깔아 볼까요?'],
[c('f')+c('q')>=6&&a.eco<.08,'굴뚝 도시의 제왕','연기가 하늘을 덮었지만 GDP는 하늘을 찔렀어요.'],
[a.eco>=.32&&a.hap>=70,'녹색 도시의 수호자','숲과 공원이 도시를 감싸고, 시민들은 숨 쉴 때마다 당신을 떠올려요.'],
[c('v')>=2,'관광 도시 CEO','단풍철 케이블카 대기줄이 도시의 상징이 되었어요.'],
[c('k')>=2,'바다의 제독','항구 크레인이 노을 속에 줄지어 섰어요. 갈매기도 취업했대요.'],
[c('a')>=10&&c('p')<=2,'콘크리트 정글 계획가','아파트 숲이 장관이에요. 공원은... 다음 임기에 만들기로 해요.'],
[c('t')>=2&&a.pop>=250,'지하철 덕후 계획가','노선도 앞에서 눈을 반짝이던 그 계획가님. 도시가 레일 위에서 굴러가요.'],
[c('o')>=3&&a.emp>=.85,'비즈니스 허브 총괄','넥타이 부대로 가득한 도시. 점심시간 상가는 전쟁터예요.'],
[budget>=3500,'재정 연금술사','시 금고에 돈이 넘쳐요. 어디에 쓸지가 이제 진짜 문제입니다.'],
[a.pop>=400&&a.hap>=65,'미래도시 설계의 거장','크고 행복한 도시를 만든 전설. 교과서에 실릴 법한 임기였어요.'],
[tn>=2,'장기 집권의 달인','세 번 넘게 재선! 동상이 광장에 서 있어요. (너무 크다는 민원은 접수 중)'],
[a.hap>=75,'행복 도시 계획가님','시민 만족도가 하늘을 찔러요. 재선 지지율 90%.'],
[c('q')>=2,'산을 갈아 넣은 계획가','산이 조금 작아졌지만 곳간은 가득 찼어요.'],
[c('w')>=2,'바람의 도시 개척자','언덕 위 풍차들이 도시의 새 얼굴이 되었어요.'],
[1,'평범하지만 소중한 계획가','큰 사고 없이 임기를 마쳤어요. 이것도 대단한 일입니다.']],
e=E.filter(function(z){return z[0]})[0],rk=sc>=1500?'S':sc>=1100?'A':sc>=700?'B':sc>=400?'C':'D',rs=RS[why]||RS.over;
SF.ev(why==='retire'?2:3);ovShow('<div class="evc '+(why==='retire'?'r2':'r3')+' end"><span class="rb">GAME OVER · '+rs[0]+'</span><h3>'+e[1]+'</h3><p>'+rs[1]+'<br>'+e[2]+'</p><div class="es"><span>등급 <b>'+rk+'</b></span><span>점수 <b>'+sc+'</b></span><span>최고 <b>'+best+'</b></span><span>임기 <b>'+(tn+1)+'기</b></span><span>인구 <b>'+a.pop+'</b></span><span>만족도 <b>'+Math.round(a.hap)+'</b></span><span>지지율 <b>'+Math.round(approv)+'%</b></span><span>미션 <b>'+mi+'/'+MS_.length+'</b></span></div><button id="re">새 도시로 다시 도전</button></div>');$('re').onclick=newGame;say(why==='retire'?'love':'worry',why==='retire'?'수고하셨어요 계획가님... 또 만나요!':'다음엔 더 잘할 수 있어요, 계획가님...',1);render()}
function showEv(e){ovq(function(){if(e.pre){e.pre(e);render()}
SF.ev(e.r);say(e.r>=3?'worry':'wow',e.t+'!',1);
ovShow('<div class="evc r'+e.r+'"><span class="rb">'+RL[e.r]+' EVENT</span><h3>'+e.t+'</h3><p>'+e.d+'</p><span id="eb"></span></div>');
[e.a,e.b].forEach(function(c,k){if(!c)return;var b=document.createElement('button');b.textContent=c[0];if(k)b.className='alt';
b.onclick=function(){rev=0;var r=c[1].call(e);msg(e.t+': '+r);if(rev){return finish(0,'revolution')}say('ok',r,1);done();ovn()};$('eb').appendChild(b)})})}
function endMonth(){
var st=S0,dmg=0,n=0,w=wx,hm=Object.keys(st.S);budget+=st.net;
if((w==='폭우'||w==='태풍')&&!mods.some(function(o){return o.k==='dike'})){var rad=w==='태풍'?2:1,rt2=w==='태풍'?.25:.15;
hm.forEach(function(k){k=+k;var hit=0,pk=0,t=st.S[k].t;if(t==='p'||B[t][7]||under[k]==='H')return;
near(k,rad,function(j,d){if(grid[j]==='W')hit=1;if(grid[j]==='p'&&d<=1)pk=1});
if(hit&&!pk){dmg+=B[t][2]*rt2*P.dmg*(1+.5*BT[bio[k]][10]);n++}});dmg=Math.round(dmg);budget-=dmg}
if(n){msg(w+' 피해: 강가 건물 '+n+'곳, −'+dmg+'. 공원이 곁에 있거나 낮은 산 위면 안전해요.');SF.thunder();say('worry','강가 건물들이 물에 잠겼어요ㅠㅠ',1)}
var fk=Object.keys(fires);
if(fk.length){if(w==='비'||w==='폭우'||w==='눈'){fk.forEach(function(k){if(Math.random()<.7)delete fires[k]});msg('비(눈) 덕분에 불길이 잡혔어요.');SF.water()}
else{fk.forEach(function(k){fires[k]++});var lost=0;
fk.forEach(function(k){if(fires[k]===undefined)return;nb(+k).forEach(function(v){var t=grid[v];if(fires[v]!==undefined)return;var p=t==='F'?.35:t==='f'?.25:(B[t]&&t!=='d'&&t!=='w'?.12:0);p*=BF[bio[v]]*P.fire*(1+.15*tn);if(p&&Math.random()<p)fires[v]=0})});
Object.keys(fires).forEach(function(k){if(fires[k]>=2){var t=grid[k];if(t==='F'||(B[t]&&t!=='d')){grid[k]=t==='F'?'g':(under[k]||'g');under[k]='';lv[k]=1;lost++}delete fires[k]}});
if(lost){msg('화재로 '+lost+'칸이 불타 사라졌어요. 서둘러 진화하세요!');SF.fire()}}}
var up=0;hm.forEach(function(k){var s=st.S[k];if('raco'.indexOf(s.t)<0)return;if(s.act&&s.hap>=65){lvp[k]=(lvp[k]||0)+1;if(lvp[k]>=4&&(lv[k]||1)<3){lv[k]=(lv[k]||1)+1;lvp[k]=0;up++}}else lvp[k]=Math.max(0,(lvp[k]||0)-1)});
if(up){SF.lvup();say('love','건물 '+up+'채가 레벨업! ✦',1)}
Object.keys(bub).forEach(function(k){if(--bub[k]<=0)delete bub[k]});
if(Object.keys(bub).length<4&&Math.random()<.6){var l=hm.filter(function(k){return fires[k]===undefined&&!bub[k]});if(l.length)bub[rp(l)]=3}
mods=mods.filter(function(o){return--o.m>0});
if(st.pop>=20){var T=Math.max(0,Math.min(100,st.hap*.75+st.emp*20+(budget>=0?8:-8)-st.fc*3));approv+=(T-approv)*.25;lowA=approv<15?lowA+1:Math.max(0,lowA-1)}
pops={};var nf=0;Object.keys(cons).forEach(function(k){var q=cons[k];if(!B[grid[k]]){delete cons[k];return}if(--q.r<=0){delete cons[k];vr[k]=1+Math.floor(Math.random()*997);pops[k]=1;nf++}});if(nf)toast('🏠 건설 완료 '+nf+'채');
m++;wx=nx;nx=roll(m+1);onWeather(wx);
if(budget<-800)return finish(0,'bankrupt');
if(lowA>=4)return finish(0,'impeach');
if(m>=TERM*(tn+1)){done();return election()}
if(m%12===0)ovq(polCard);
var rr=Math.random(),ev0=m-lastEv>=3&&rr<(approv<35?.5:.36);
if(ev0){var p=Math.random(),r=p<.6?0:p<.88?1:p<.97?2:3;if(approv<35&&m>=8&&Math.random()<.3)r=3;var c=EV.filter(function(e){return e.r===r&&(!e.ok||e.ok())});if(!c.length)c=EV.filter(function(e){return e.r===0&&(!e.ok||e.ok())});lastEv=m;done();showEv(rp(c));return}
done()}
[0,1,2,4].forEach(function(s){var b=document.createElement('button');b.dataset.s=s;b.textContent=s?'▶'.repeat(s===4?3:s):'II';b.title=s?s+'배속':'일시정지';b.onclick=function(){if(over||ovOn)return;speed=s;startAudio();bars()};$('sp').appendChild(b)});
['d','r','a','c','o','f','p','s','t','k','w','q','v','x'].forEach(function(k){var b=document.createElement('button');b.className='tl';b.title=k==='x'?'철거 (50% 환급)':B[k][6];tbtn[k]=b;
b.setAttribute('aria-pressed',k===tool?'true':'false');
b.onclick=function(){tool=k;document.querySelectorAll('#tb .tl').forEach(function(o){o.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');
$('ins').innerHTML=k==='x'?'<b>철거</b>건물이나 도로를 지우고 건설비의 50%를 돌려받습니다.':'<b>'+B[k][0]+' (건설 '+cst(k)+' · 월 유지비 '+B[k][3]+')</b>'+B[k][6]};
$('tb').appendChild(b)});
var gm=$('g');for(var i=0;i<N;i++){var d=document.createElement('div');d.dataset.i=i;gm.appendChild(d);cells.push(d)}
function at(e){var el=document.elementFromPoint(e.clientX,e.clientY);while(el&&el.parentNode&&el.dataset.i===undefined&&el!==gm)el=el.parentNode;if(el&&el.dataset&&el.dataset.i!==undefined){var i=+el.dataset.i;info(i);return i}return -1}
gm.addEventListener('pointerdown',function(e){startAudio();var i=at(e);if(i>=0){down=true;act(i)}});
gm.addEventListener('pointermove',function(e){var i=at(e);if(down&&i>=0&&(tool==='d'||tool==='x'))act(i)});
addEventListener('pointerup',function(){down=false});
$('nw').onclick=function(){newGame()};$('sv').onclick=function(){msg(save()?'저장했어요! 다음에 열면 이어서 할 수 있어요.':'이 환경에서는 저장할 수 없어요.')};
$('ld').onclick=function(){msg(load()?'저장된 도시를 불러왔어요.':'저장된 도시가 없어요.')};
$('rt').onclick=function(){if(!over)finish(0,'retire')};
$('snd').onclick=function(){mute=!mute;this.setAttribute('aria-pressed',mute?'false':'true');this.textContent=mute?'✕':'♪';if(!mute)startAudio()};
var last=Date.now();
setInterval(function(){var n=Date.now(),dt=Math.min(n-last,300);last=n;if(!S0)return;rt+=dt;if(rt>9000&&!ovOn&&!over){rt=0;react()}if(speed&&!ovOn&&!over){acc+=dt*speed;if(acc>=MS){acc-=MS;endMonth()}else bars()}},100);
try{best=+localStorage.getItem('usl-best')||0}catch(e){}
$('mc').innerHTML=mas('happy');
if(!load())newGame();
})();
