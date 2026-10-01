
(function(){
  const cfg=window.COURSE115_FIREBASE_CONFIG||{};
  let db=null,currentUser=null,fs=null;
  function configured(){
    return !!(cfg.enabled && cfg.apiKey && !String(cfg.apiKey).startsWith("PASTE_") &&
      cfg.projectId && !String(cfg.projectId).startsWith("PASTE_"));
  }
  function scoreFromStars(stars,totalStars){
    return totalStars?Math.round(Number(stars||0)/Number(totalStars)*100):0;
  }
  const api={
    configured:configured(),state:"starting",uid:null,error:null,scoreFromStars,ready:null,
    async saveStudent(payload){
      await api.ready;
      if(!api.configured||!currentUser||!db) return {ok:false,offline:true};
      const ref=fs.doc(db,"students",currentUser.uid);
      await fs.setDoc(ref,{
        uid:currentUser.uid,
        className:String(payload.className||"").trim(),
        seatNo:String(payload.seatNo||"").trim(),
        name:String(payload.name||"").trim(),
        courseId:"python",
        stars:Number(payload.stars||0),
        totalStars:Number(payload.totalStars||0),
        score:scoreFromStars(payload.stars,payload.totalStars),
        progress:payload.progress||{},
        completed:!!payload.completed,
        certificateUnlocked:!!payload.completed,
        currentStation:payload.currentStation||"",
        currentChallenge:Number(payload.currentChallenge||0),
        updatedAt:fs.serverTimestamp(),
        lastSeenAt:fs.serverTimestamp()
      },{merge:true});
      return {ok:true};
    },
    async loadStudent(){
      await api.ready;
      if(!api.configured||!currentUser||!db) return null;
      const snap=await fs.getDoc(fs.doc(db,"students",currentUser.uid));
      return snap.exists()?snap.data():null;
    }
  };
  api.ready=(async()=>{
    if(!configured()){api.state="disabled";return false;}
    try{
      const [appMod,authMod,fsMod]=await Promise.all([
        import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
      ]);
      const app=appMod.initializeApp(cfg);
      const auth=authMod.getAuth(app);
      db=fsMod.getFirestore(app); fs=fsMod;
      await authMod.setPersistence(auth,authMod.browserLocalPersistence);
      if(!auth.currentUser){
        currentUser=(await authMod.signInAnonymously(auth)).user;
      }else currentUser=auth.currentUser;
      api.uid=currentUser.uid; api.state="ready"; return true;
    }catch(e){api.state="error";api.error=e;return false;}
  })();
  window.CourseDB=api;
})();
