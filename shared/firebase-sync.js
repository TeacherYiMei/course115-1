(function(){
const cfg=window.COURSE115_FIREBASE_CONFIG||{};let db,currentUser,fs,auth,authMod,fnMod,functions;
function configured(){return !!(cfg.enabled&&cfg.apiKey&&cfg.projectId)}
function seat(v){return String(Number(String(v||"").trim())).padStart(2,"0")}
function email(c,s){return `python1151-${String(c||"").trim()}-${seat(s)}@student.course115.local`}
async function call(name,data){const fn=fnMod.httpsCallable(functions,name);return (await fn(data||{})).data}
const api={configured:configured(),state:"starting",stage:"",uid:null,errorCode:"",errorMessage:"",ready:null,
diagnostic(){return {configured:api.configured,state:api.state,stage:api.stage,uid:api.uid,errorCode:api.errorCode,errorMessage:api.errorMessage,projectId:cfg.projectId||"",authDomain:cfg.authDomain||""}},
async reconnect(){return initialize(true)},isAnonymous(){return !!currentUser?.isAnonymous},accountEmail(c,s){return email(c,s)},
async linkStudentAccount(c,s,p){await api.ready;const cr=authMod.EmailAuthProvider.credential(email(c,s),p),r=await authMod.linkWithCredential(currentUser,cr);currentUser=r.user;api.uid=r.user.uid;return {ok:true}},
async signInStudentAccount(c,s,p){await api.ready;const r=await authMod.signInWithEmailAndPassword(auth,email(c,s),p);currentUser=r.user;api.uid=r.user.uid;return {ok:true}},
async saveStudent(p){await api.ready;if(!currentUser||currentUser.isAnonymous)return {ok:false,needsAccount:true};return call("registerPythonStudent",p)},
async verifyChallenge(p){await api.ready;if(!currentUser||currentUser.isAnonymous)throw Object.assign(Error("請先建立或登入學習帳號。"),{code:"needs-account"});return call("verifyPythonChallenge",p)},
async loadStudent(){await api.ready;if(!currentUser||!db)return null;const s=await fs.getDoc(fs.doc(db,"students",currentUser.uid));return s.exists()?s.data():null}};
async function initialize(){
 if(!configured()){api.state="disabled";return false}
 try{
  const [a,b,c,d]=await Promise.all([import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"),import("https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js")]);
  const app=a.getApps().length?a.getApp():a.initializeApp(cfg);authMod=b;fs=c;fnMod=d;auth=b.getAuth(app);db=c.getFirestore(app);functions=d.getFunctions(app,"asia-east1");
  await b.setPersistence(auth,b.browserLocalPersistence);if(!auth.currentUser){currentUser=(await b.signInAnonymously(auth)).user}else currentUser=auth.currentUser;
  api.uid=currentUser.uid;api.state="ready";api.stage="Firebase 已連線";return true;
 }catch(e){api.state="error";api.errorCode=e?.code||"";api.errorMessage=e?.message||String(e);api.stage="Firebase 初始化失敗";return false}
}
api.ready=initialize();window.CourseDB=api;
})();