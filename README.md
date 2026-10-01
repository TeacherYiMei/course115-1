# course115(1)｜Python 冒險版本

這是一個從 course-116 拆出的「只有 Python」獨立版本。

## 第一階段（本版已完成）
- 只有一個大關卡：Python 畢旅冒險。
- 大關卡內保留 10 個冒險站、30 個循序小挑戰。
- 一次只顯示目前挑戰，完成才前進。
- 每個小挑戰通過取得星星；每 3 個挑戰完成一站並開寶箱。
- 完成全部 Python 任務後解鎖「Python 畢旅冒險完成證書」。
- 證書可輸入學生姓名、顯示技能與完成日期，並列印／存成 PDF。
- 教師預覽：`11601/python.html?teacher=1`
- 目前進度保存在瀏覽器 localStorage，尚未連接資料庫。

## 第二階段（暫不實作）
建立「證書 → 分數」資料庫：
1. 學生身分
2. 證書 ID / Python 大關卡
3. 是否完成
4. 星星數
5. 完成日期
6. 對應教師分數
7. 教師可調整評分規則

原則：學生端仍以冒險、星星、寶箱、證書呈現；正式分數留在教師端。

## GitHub Pages
建立新的 repository 後，把本資料夾「裡面的內容」上傳到 repository 根目錄，再啟用 GitHub Pages：
- Branch: `main`
- Folder: `/(root)`

首頁即為 `index.html`。


## v2
純學生版；每站採「黑框完整示範 → 自己思考 → 獨立挑戰」；加入 Scratch 對照、三層解題線索與獨立 Python 指令小百科；完成 30 題發證書。資料庫留待下一階段。


## v2.1
黑框只作教學示範；原封複製不能過關。執行成功與任務完成分開驗證。線索預設不顯示，只有學生主動點「我需要線索」才逐層出現；未過關時不強迫查線索。

## v3 課程結構重整版
- 不再固定每個大關 3 題；依概念實際需要安排題數。
- 全課程目前共 10 關、26 個有效挑戰。
- P1 `print()` 縮成 2 題：改寫示範 + 兩行不同內容的獨立作品。
- 每題畫面直接列出「任務完成條件」，系統不再使用學生看不到的隱藏條件。
- 驗證器同步重寫：會檢查題目明示的次數、不同內容、必要指令、分支、變數與迴圈結構。
- 線索仍為完全自選；預設不展開，也不是通關必要步驟。
- Python 指令小百科擴充為 print、變數、input、int、運算、float/round、if、elif、and/or、for/range、while、random。
- 進度 key 更新為 `course115_v3_progress`，避免舊版題數與新版結構互相衝突。
- 證書星數改為依實際挑戰數自動顯示。

## v4 智慧除錯＋變數英文小幫手
- 新增學生友善「除錯教練」：指出錯誤位置、解釋原因、給下一步方向，不直接貼整題答案。
- 可辨識 SyntaxError、IndentationError、NameError、TypeError、ValueError、迴圈逾時，以及 Python 保留字誤作變數名稱。
- 特別處理 `class = ...`：直接說明 `class` 是保留字，並引導使用「變數英文小幫手」。
- Python 原始錯誤訊息保留在可展開區，供進階學生查看。
- 新增「🌐 變數英文小幫手」：輸入中文概念，取得適合的 Python 英文變數名稱。
- 小幫手只協助命名，不生成整題程式碼；同時教學生小寫、底線、不可數字開頭、不可使用保留字等命名規則。

## v5 學生資料起始頁＋常駐變數英文小幫手
- Python 冒險開始前，班級、座號、姓名為必填；未完成資料設定前不進入正式挑戰。
- 學生資料目前儲存在 localStorage：`course115_student_profile_v5`。
- 預留資料庫欄位：`className`, `seatNo`, `name`, `courseId`, `createdAt`, `updatedAt`。
- 頁面上方常駐顯示學生班級、座號與姓名，學生可自行修改。
- 「🌐 變數英文小幫手」改為從第一關開始固定顯示在頁面上方，不需要等到出錯才出現。
- 每一題仍保留「變數英文小幫手」作為可選求助工具。
- 目前學生資料不會送到外部服務；等下一階段接 Firebase/Firestore 時再同步到教師資料庫。


## v5.1 文字修正
- 刪除首頁指定的 Python 版本說明段落。
- 全站將「班本」修正為「版本」。

## v5.2 學生資料欄位修正
- 開始挑戰前改為必填：班級、座號、姓名。
- localStorage 欄位改為：`className`, `seatNo`, `name`, `courseId`, `createdAt`, `updatedAt`。
- 頁面上方固定顯示：班級｜座號｜姓名。

## v5.3 姓名欄位修正版
- 強制重建開始挑戰前的學生資料表單，確認顯示：班級、座號、姓名。
- 三欄皆為必填。
- 姓名同步存入證書名稱，完成課程後證書可直接帶入學生姓名。


## v6 資料庫＋教師進度版
- Firebase Anonymous Authentication + Cloud Firestore 學生進度同步。
- localStorage 與雲端雙重保存。
- 新增 `teacher.html` 教師端，以 Email/Password 登入。
- 教師端可依班級查看班級、座號、姓名、星星、評分、目前進度、完成狀態。
- 星星自動換算 100 分：`round(stars / totalStars * 100)`。
- 可依班級下載 `.xlsx` Excel。
- 新增 `firestore.rules` 教師／學生權限控制。
- 新增班級、座號、姓名格式檢查與明確錯誤提示。
- 啟用方式請看 `FIREBASE_SETUP.md`。

## v6.1 Firebase Web App 已連結
- 已填入 `course115-python` 的 Web App firebaseConfig。
- `enabled` 已改為 `true`。
- 下一步需在 Firebase Console 開啟 Authentication（Anonymous + Email/Password）及 Firestore。

## v6.2 Firebase 診斷版
- 資料庫連線失敗時，可直接點上方狀態查看：
  - 失敗階段
  - Firebase 錯誤碼
  - Firebase 原始錯誤訊息
  - Project ID / Auth Domain
- 新增「重新連線」按鈕。
- 不再只顯示泛用的「資料庫連線失敗」。

## v6.3 Firebase API Key 修正
- 依 Firebase Console 原始 `firebaseConfig` 重新填入設定。
- 修正先前 apiKey 中將小寫 `l` 誤寫成數字 `1` 的問題。
- 其餘 projectId、authDomain、storageBucket、messagingSenderId、appId 維持不變。


## v7 多教師班級權限版
- `teachers/{uid}` 支援 `role`, `displayName`, `classes`。
- `role: teacher` 僅能查看 `classes` 陣列中的班級。
- `role: admin` 可查看全部班級。
- 教師端不再先讀取所有學生再前端隱藏，而是依授權班級向 Firestore 查詢。
- Firestore Rules 同步限制一般教師跨班讀取。
- Excel 只能匯出登入教師有權限的班級。
- 新增 `FIREBASE_SETUP.md` 多教師設定教學。


## v8：執行結果與闖關檢查分離
- 新增「▶ 執行看看」：學生可反覆執行自己的程式，只看輸出，不會判定闖關、不會取得星星。
- 新增「✅ 檢查挑戰」：學生確認程式後再正式檢查任務完成條件。
- `input()` 題目在自由執行與檢查時都會逐次詢問學生輸入值，再重新執行得到完整結果。
- 執行錯誤仍沿用學生友善的除錯提示。
- 原有星星、解鎖、Firebase 同步、多教師權限與 Excel 功能維持不變。


## v9：互動執行主控台
- `input()` 不再使用瀏覽器跳出式輸入視窗。
- 學生按「執行看看」後，若程式需要 input()，會直接在程式下方出現輸入框。
- 可用「送出」逐次輸入資料，適合兩次、三次 input() 與 while 重複輸入。
- 執行過程會先顯示目前輸出，再等待下一筆輸入。
- 可取消執行，也可清除執行結果。
- 「執行看看」仍不判定過關；「檢查挑戰」才會正式檢核並取得星星。
- Firebase、多教師班級權限、Excel、除錯教練維持不變。
