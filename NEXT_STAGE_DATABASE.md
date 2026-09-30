# course115(1) 開發階段

## 現在：Stage 1
Python 單一大關卡 → 完成全部任務 → 發證書。

## 下一步：Stage 2
不改學生闖關流程，新增教師資料庫：
`學生 → Python完成紀錄 → 證書 → 教師端分數`

建議資料欄位：
- studentId
- className
- seatNo
- displayName
- courseId: python
- stars: 0-30
- completed: true/false
- completedAt
- certificateId
- teacherScore
- updatedAt

正式連線前先設計資料表與教師畫面，再接 Firebase/Firestore，避免把資料庫規則寫死在學生頁面。
