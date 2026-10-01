
(function(){
 const cfg=window.COURSE115_FIREBASE_CONFIG||{};let auth,db,mods,currentRows=[];const $=s=>document.querySelector(s);
 const configured=()=>!!(cfg.enabled&&cfg.apiKey&&!String(cfg.apiKey).startsWith("PASTE_"));
 function esc(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
 function fmtTime(v){try{return v&&typeof v.toDate==="function"?v.toDate().toLocaleString("zh-TW"):""}catch(e){return ""}}
 function seatSort(a,b){return Number(a.seatNo||999)-Number(b.seatNo||999)||String(a.name||"").localeCompare(String(b.name||""),"zh-Hant")}
 function filtered(){const cls=$("#classFilter").value;return currentRows.filter(r=>!cls||String(r.className)===cls).sort(seatSort)}
 function render(){
   const rows=filtered();
   $("#studentCount").textContent=rows.length;
   $("#avgStars").textContent=rows.length?(rows.reduce((n,r)=>n+Number(r.stars||0),0)/rows.length).toFixed(1):"0";
   $("#avgScore").textContent=rows.length?Math.round(rows.reduce((n,r)=>n+Number(r.score||0),0)/rows.length):"0";
   $("#doneCount").textContent=rows.filter(r=>r.completed).length;
   $("#rows").innerHTML=rows.map(r=>`<tr><td>${esc(r.className)}</td><td>${esc(r.seatNo)}</td><td>${esc(r.name)}</td>
   <td>⭐ ${Number(r.stars||0)}/${Number(r.totalStars||26)}</td><td>${Number(r.score||0)}</td>
   <td>${esc(r.currentStation||"")} ${r.currentChallenge?`・第 ${r.currentChallenge} 題`:""}</td>
   <td><span class="badge ${r.completed?"done":""}">${r.completed?"已完成":"進行中"}</span></td><td>${esc(fmtTime(r.updatedAt))}</td></tr>`).join("");
 }
 function buildClasses(){
   const old=$("#classFilter").value;
   const cs=[...new Set(currentRows.map(r=>String(r.className||"")).filter(Boolean))].sort();
   $("#classFilter").innerHTML='<option value="">全部班級</option>'+cs.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
   if(cs.includes(old))$("#classFilter").value=old;
 }
 async function verifyTeacher(uid){const snap=await mods.fs.getDoc(mods.fs.doc(db,"teachers",uid));return snap.exists()}
 async function loadRows(){
   $("#dbStatus").textContent="讀取資料中…";
   const snap=await mods.fs.getDocs(mods.fs.collection(db,"students"));
   currentRows=snap.docs.map(d=>({id:d.id,...d.data()}));buildClasses();render();
   $("#dbStatus").textContent=`最後更新：${new Date().toLocaleTimeString("zh-TW")}`;
 }
 function exportExcel(){
   const cls=$("#classFilter").value;if(!cls){alert("請先選擇一個班級，再下載該班 Excel。");return}
   const rows=filtered();if(!rows.length){alert("這個班級目前沒有資料。");return}
   const data=rows.map(r=>({"班級":r.className||"","座號":Number(r.seatNo||0),"姓名":r.name||"",
     "星星":Number(r.stars||0),"滿星數":Number(r.totalStars||26),"評分":Number(r.score||0),
     "完成狀態":r.completed?"已完成":"進行中","目前進度":`${r.currentStation||""}${r.currentChallenge?` 第${r.currentChallenge}題`:""}`,
     "最近更新":fmtTime(r.updatedAt)}));
   const ws=XLSX.utils.json_to_sheet(data);ws["!cols"]=[{wch:8},{wch:7},{wch:12},{wch:7},{wch:8},{wch:7},{wch:10},{wch:28},{wch:20}];
   const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,`${cls}班`);XLSX.writeFile(wb,`Python學習進度_${cls}班.xlsx`);
 }
 async function init(){
   if(!configured()){$("#loginError").textContent="尚未設定 Firebase。請先依 FIREBASE_SETUP.md 完成資料庫設定。";$("#loginBtn").disabled=true;return}
   try{
     const [appMod,authMod,fsMod]=await Promise.all([
       import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
       import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
       import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
     ]);
     const app=appMod.initializeApp(cfg);auth=authMod.getAuth(app);db=fsMod.getFirestore(app);mods={auth:authMod,fs:fsMod};
     authMod.onAuthStateChanged(auth,async user=>{
       if(!user){$("#loginCard").classList.remove("hidden");$("#dashboard").classList.add("hidden");$("#logoutBtn").classList.add("hidden");return}
       if(await verifyTeacher(user.uid)){$("#loginCard").classList.add("hidden");$("#dashboard").classList.remove("hidden");$("#logoutBtn").classList.remove("hidden");await loadRows()}
       else{$("#loginError").textContent="這個帳號尚未被設定為教師。請在 Firestore 建立 teachers/"+user.uid+" 文件。";await authMod.signOut(auth)}
     });
   }catch(e){$("#loginError").textContent="Firebase 初始化失敗："+e.message}
 }
 $("#loginBtn").onclick=async()=>{try{$("#loginError").textContent="";await mods.auth.signInWithEmailAndPassword(auth,$("#email").value.trim(),$("#password").value)}
   catch(e){$("#loginError").textContent="登入失敗，請確認 Email、密碼與教師權限。"}};
 $("#logoutBtn").onclick=()=>mods.auth.signOut(auth);$("#refreshBtn").onclick=loadRows;$("#classFilter").onchange=render;$("#exportBtn").onclick=exportExcel;init();
})();
