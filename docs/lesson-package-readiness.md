# Lesson package readiness

## Current result

這個 release candidate 已有 19 個 source-backed package，對應學習者可體驗的
Lessons 2–20；連同 Lesson 1，共 20 課、58 個目標詞與 58 個教育部原始 MP3。
Learner-facing `pathOrder` 是 1–20，package `number` 維持穩定識別，不破壞
device-local progress。

- 每個詞都有漢字、臺羅、POJ、雙語意思、文化註記、教育部 canonical URL、
  授權與 original MP3 provenance。
- 每個 package 都有雙語標題、摘要、主要學習目標、生活任務與完整
  Hear → See → Say → Recall → Use 五段節奏。
- 課卡直接列出完整目標詞，避免課名與內容只顯示第一個詞造成誤判。
- Lesson 12 已是獨立的飲食／生活對話，不重複 Lesson 1 的完整問候詞。
- Teacher review 保持 `required`／pending；這不是教師核准。無教師阻塞模式
  允許先測試，但只宣稱來源可追溯的初期測試版本。

## Routine gate

每次新增或修改 lesson package 都必須執行 `npm run lessons:validate`；
`npm test` 也會執行同一個 gate。validator 必須拒絕：

- 重複課次、重複 package／phrase identity 或重複 learner path order；
- 不完整或順序錯誤的五段節奏；
- 缺少臺羅、POJ、雙語欄位、主要學習目標或生活任務；
- 缺少教育部 canonical source、授權、license URL 或 original URL；
- planned 課程使用 fake、placeholder、pending、todo 或 example 音檔 URL；
- 缺少本機原始 MP3、ID3 header、合理檔案大小、未修改標記或 handoff
  attribution 不一致；
- catalog scope 不等於 1–20，或 Lesson 12 重複 Lesson 1。

這個 routine gate 是內容 release gate，不是教師認證 gate；它也不宣稱地區
變體已全部涵蓋、提供發音評分、精準聲調診斷或專業臺語認證。

## Scope boundary

本次候選範圍是 Lessons 1–20。下一批才評估廁所／所在、電話與聯絡、緊急
求助、住宿；每一課都必須先找到可追溯的教育部詞條、原始音檔與 POJ，不能
用假 URL 填補。Say completion gate、真正的 Recall retrieval check、Use
micro-transfer task 與 B08 真人 mobile review 保持後續 PR，不在本次內容
provenance 修復中擴張。
