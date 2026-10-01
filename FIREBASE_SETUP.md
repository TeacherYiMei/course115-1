# course115-1 v6 Firebase / Firestore 設定

此版本已完成學生進度同步、教師端、星星評分與班級 Excel 匯出。
GitHub Pages 本身沒有資料庫，所以需要建立自己的 Firebase 專案。

## 1. 建立獨立 Firebase 專案
建立一個新的 Firebase 專案，例如 `course115-python`，新增 Web App。
把 Firebase 提供的 `firebaseConfig` 貼到 `shared/firebase-config.js`，並把 `enabled: false` 改成 `enabled: true`。

## 2. Authentication
Authentication → Sign-in method：
- 開啟 Anonymous：學生使用。
- 開啟 Email/Password：教師使用。

## 3. Cloud Firestore
建立 Firestore Database。
把根目錄 `firestore.rules` 的內容貼到 Firestore → Rules，然後 Publish。

不要使用永久「全部允許」規則。

## 4. 教師帳號
Authentication → Users → Add user，建立教師 Email / 密碼。
複製教師 UID。

Firestore 建立：
- Collection：`teachers`
- Document ID：教師 UID
- 欄位：`role` = `teacher`

## 5. 教師端
部署後網址：
`https://你的GitHub帳號.github.io/course115-1/teacher.html`

教師端可以：
- 依班級查看進度
- 星星自動換算 100 分
- 查看完成狀態
- 下載選取班級 `.xlsx`

## 6. 評分公式
`評分 = round(星星數 / 全部星星數 × 100)`

26 星 = 100 分；13 星 = 50 分。
學生頁面不顯示正式評分。

## 7. 學生資料格式
- 班級：3 位數，例如 701、802、901
- 座號：1～99，只輸入數字
- 姓名：2～20 字，可用中文、英文字母、空格、連字號、間隔點；不可含數字

## 8. 進度保存
學生取得星星時：
1. localStorage 保留本機進度
2. Firebase 啟用後同步到 Firestore `students/{匿名UID}`

同一瀏覽器再次進入會比較本機與雲端進度，優先恢復星星較多的一份。

目前使用 Anonymous Authentication；如果學生清除瀏覽器資料或換裝置，匿名 UID 可能改變。若之後需要跨裝置登入恢復，建議再改成學校 Google 帳號或其他正式登入方式。
