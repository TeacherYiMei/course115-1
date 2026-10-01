
(function(){
  const cfg=window.COURSE115_FIREBASE_CONFIG||{};
  let db=null,currentUser=null,fs=null,auth=null,authMod=null;

  function configured(){
    return !!(
      cfg.enabled &&
      cfg.apiKey && !String(cfg.apiKey).startsWith("PASTE_") &&
      cfg.projectId && !String(cfg.projectId).startsWith("PASTE_")
    );
  }

  function scoreFromStars(stars,totalStars){
    return totalStars?Math.round(Number(stars||0)/Number(totalStars)*100):0;
  }

  const api={
    configured:configured(),
    state:"starting",
    stage:"尚未開始",
    uid:null,
    error:null,
    errorCode:"",
    errorMessage:"",
    ready:null,

    diagnostic(){
      return {
        configured:api.configured,
        state:api.state,
        stage:api.stage,
        uid:api.uid,
        errorCode:api.errorCode,
        errorMessage:api.errorMessage,
        projectId:cfg.projectId||"",
        authDomain:cfg.authDomain||""
      };
    },

    async reconnect(){
      api.error=null;api.errorCode="";api.errorMessage="";
      return await initialize(true);
    },

    async saveStudent(payload){
      await api.ready;
      if(!api.configured||!currentUser||!db) return {ok:false,offline:true};
      try{
        api.stage="寫入 Firestore";
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
        api.stage="Firestore 寫入完成";
        return {ok:true};
      }catch(e){
        api.state="error";
        api.stage="寫入 Firestore 失敗";
        api.error=e;
        api.errorCode=e?.code||"";
        api.errorMessage=e?.message||String(e);
        throw e;
      }
    },

    async loadStudent(){
      await api.ready;
      if(!api.configured||!currentUser||!db) return null;
      try{
        api.stage="讀取 Firestore";
        const snap=await fs.getDoc(fs.doc(db,"students",currentUser.uid));
        api.stage="Firestore 讀取完成";
        return snap.exists()?snap.data():null;
      }catch(e){
        api.state="error";
        api.stage="讀取 Firestore 失敗";
        api.error=e;
        api.errorCode=e?.code||"";
        api.errorMessage=e?.message||String(e);
        throw e;
      }
    }
  };

  async function initialize(force=false){
    if(!configured()){
      api.state="disabled";
      api.stage="Firebase 尚未設定";
      return false;
    }
    try{
      api.state="starting";
      api.stage="載入 Firebase SDK";
      const [appMod,authM,fsMod]=await Promise.all([
        import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
      ]);

      api.stage="初始化 Firebase App";
      let app;
      try{
        app=appMod.getApps().length?appMod.getApp():appMod.initializeApp(cfg);
      }catch(e){
        app=appMod.initializeApp(cfg);
      }

      authMod=authM;
      auth=authM.getAuth(app);
      db=fsMod.getFirestore(app);
      fs=fsMod;

      api.stage="設定登入狀態保存";
      await authM.setPersistence(auth,authM.browserLocalPersistence);

      api.stage="匿名登入";
      if(!auth.currentUser || force){
        if(force && auth.currentUser){
          currentUser=auth.currentUser;
        }else{
          const cred=await authM.signInAnonymously(auth);
          currentUser=cred.user;
        }
      }else{
        currentUser=auth.currentUser;
      }

      api.uid=currentUser?.uid||null;
      api.state="ready";
      api.stage="Firebase 已連線";
      api.error=null;api.errorCode="";api.errorMessage="";
      return true;
    }catch(e){
      api.state="error";
      api.error=e;
      api.errorCode=e?.code||"";
      api.errorMessage=e?.message||String(e);
      if(api.stage==="載入 Firebase SDK") api.stage="Firebase SDK 載入失敗";
      else if(api.stage==="匿名登入") api.stage="匿名登入失敗";
      else if(api.stage==="設定登入狀態保存") api.stage="登入狀態設定失敗";
      else if(api.stage==="初始化 Firebase App") api.stage="Firebase App 初始化失敗";
      return false;
    }
  }

  api.ready=initialize(false);
  window.CourseDB=api;
})();
