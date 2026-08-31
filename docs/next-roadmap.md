# 台語起步下一段 roadmap：Lesson Factory Alpha

## 這一段要解決的問題

歷史 baseline 曾只有第 1 課可體驗；目前 production runtime 已提供第 1–20 課。
第 2–20 課的 authoring package 仍保留 `teacherReview: required`／pending 記錄，
並以 owner risk acceptance 完成 learner-runtime handoff；這代表課程可用，不代表
曾取得教師核准。生活優先 path order 見 `docs/course-path-priority.md`；第 21–24 課
仍是 roadmap。
下一段不應只繼續增加尚未可玩的課程數量，而要先把下面這條內容生產鏈做成
可重複、可檢查、可交給教師審核的流程：

```text
Teacher brief
    ↓
Source-verified lesson package
    ↓
Pure validation
    ↓
Teacher review
    ↓
Audio and attribution check
    ↓
Only then: playable lesson integration
```

這是研究報告提出的 Lesson Factory 與教師治理方向，也是目前 repo 最值得
先補上的能力。這一段不是 AI 自由聊天功能，也不是把 planned 課程誤標成
可玩的捷徑。

本階段採無教師阻塞模式：可用教育部公開資源、既有教材／辭典、人工多源比對
與基本檢查先測試常見生活用語；teacher review 欄位仍保持 pending，不能宣稱
教師核准、唯一正確、標準發音評分、精準聲調診斷、全地區適用或專業認證。

## 目前基線

### Current release state

- Production runtime catalog 現在提供第 1–20 課，每課 source-backed phrases，使用
  相同的 Hear → See → Say → Recall → Use 流程。v5 device-local progress 逐課保存
  stage、phrase position、completed phrase IDs，複習 queue 可同時保留跨課卡片。
- 第 2–20 課的 58 個 MP3 都直接取自教育部詞典官方音檔，保留原始 URL、CC
  BY-ND 3.0 TW attribution 與未修改標記；逐課 mobile QA 見
  `docs/qa/lesson-2-20-390x844.md`。
- Teacher review 沒有被偽造為 approved。這次 release 以產品擁有者明確的
  owner risk acceptance 通過 handoff。sole-contributor 模式目前不把合格教師
  approval 當 delivery blocker；若未來取得審核，仍可補回逐課可追溯紀錄。
- 第 21 課以後沒有被誤標為 playable；M2.5 beginner pilot 仍未執行。

以 2026-07-26 的 roadmap snapshot parent `main`（`08732a4`）為歷史基準；此 SHA
不是可變的 current `main` 指標，後續合併不會改寫這個 snapshot：

- 第 1 課是當時唯一可體驗的完整 lesson（歷史 snapshot）。
- 第 2–20 課已在 `app/data/lesson-packages.ts` 建立 typed package，全部
  保持 `planned`、要求教師審核；POJ、官方原始音檔與 handoff attribution
  已完整資料化，且由 `npm run lessons:validate` 固定驗證。
- 第 21–24 課仍在 `docs/lesson-roadmap.md` 排定，但尚未產製 package。
- Lesson 1 已有 Hear → See → Say → Recall → Use 五段節奏與 metadata 驗證。
- Recall 已支援台羅／白話字切換；這可作為後續 package 的呈現契約，但不代表
  planned package 已接入 React。
- GitHub Project #6 已是現有 issue／PR 流程的一部分，後續內容工作應維持
  一個明確 issue 對應一個可審核 PR。

## M2 目前交付狀態

M2.1–M2.4 的實作邊界與第 1–20 課 runtime handoff 已進入 `main`；這不等於已有
真實 teacher approval：

| 工作包 | main 狀態 | Truthful product state |
| --- | --- | --- |
| M2.1 Package validator | 已合併 | validator 與測試可拒絕不完整 package |
| M2.2 Teacher review contract | 已合併 | 未完成審核仍只能是 `planned` |
| M2.3 內容 16–18 | 已合併 | package 與 runtime lesson 已建立；teacher review 仍 pending，POJ 與官方原始音檔 provenance 已完整 |
| M2.4 Package-to-lesson handoff | 已合併 | 第 1–20 課已依 owner risk acceptance 接入 runtime；沒有宣稱 teacher approval |
| M2.5 Beginner pilot | Deferred until real participant demand | `planned`／`not-run`，沒有 participant、participant record 或研究結果可宣稱 |

外部初學者 evidence 仍是尚未取得的研究缺口，但目前沒有 participant 或近期
招募 use case，因此 M2.5 不再是當前產品開發 blocker。FileVault、privacy
reviewer、consent 與 participant-level retention／deletion 都是重新啟動招募前
必須完成的 gates；在此之前維持 pending，不把 pending 改寫成 Pass，也不繼續
投入沒有實際資料流的 pilot infrastructure。

下一個產品階段是 **first-session usability**：讓第一次使用者在 3 秒內看懂
唯一的下一個動作。借鏡 Busuu 的短課程節奏與 Duolingo 的低摩擦單一任務，
但不複製其視覺、遊戲化或 streak；Taigi Start 仍維持自己的溫暖、文化導向與
Hear → See → Say → Recall → Use 學習契約。

## 研究轉成的產品原則

| 參考方向 | 本專案要吸收的能力 | 本段的具體約束 |
| --- | --- | --- |
| Busuu | 有順序、可完成的短課程節奏 | package 必須描述五段學習任務與一個主要生活目標 |
| Duolingo | 低摩擦、能持續回訪的任務 | 每次只推進一個小任務，不先加入複雜 streak 或遊戲化 |
| Memrise | 真實、自然的語料 | 每個詞條要有教育部來源與文化註記，不生成無來源句子 |
| 教育部資源與臺語教師 | 正字、台羅、變體與語境治理 | 來源、授權、教師審核與可接受變體要留在 package 內 |

## M2：Lesson Factory Alpha 路線

| 順序 | 工作包 | 主要交付 | 完成條件 |
| --- | --- | --- | --- |
| M2.1 | Package validator | 純函式驗證器與測試 | 能檢查課次唯一、五段節奏、雙語欄位、來源／授權、教師審核、POJ 與完整原始音檔狀態 |
| M2.2 | Teacher review contract | 可追蹤的審核欄位與待確認清單 | 未完成審核的 package 仍只能是 `planned`，不能被 runtime catalog 當成可玩課程 |
| M2.3 | 下一批內容 16–18 | `出門坐車`、`餐廳點菜`、`買物件佮問價` 的 source-verified package | 每課先核實教育部詞條，再通過 validator；只加入可追溯、未修改的官方原始音檔 |
| M2.4 | Package-to-lesson handoff | 把 package 轉成 playable lesson 的明確輸入契約 | 需要音檔 attribution、mobile flow 證據；未完成 teacher review 時另需 owner risk acceptance |
| M2.5 | Beginner pilot | Deferred until real participant demand | 有真實招募 use case 後，重新啟動 readiness、consent 與 privacy gates；執行前仍維持 `not-run` |

## 實作順序與 PR 邊界

每個工作包都維持一個 issue、一個 branch、一個 PR，依序處理：

1. M2.1 validator、M2.2 review contract、M2.3 package、M2.4 handoff gate 與第 1–20 課 runtime integration 均已交付；teacher review pending 與 owner risk acceptance 必須繼續誠實呈現。
2. M2.5 維持 deferred／`not-run`；沒有真實 participant demand 時，不把 FileVault 或 privacy reviewer 當成一般產品 PR blocker。
3. 有明確招募計畫後，才重新啟動 readiness：確認 owner risk acceptance、音檔 attribution、mobile evidence、consent、privacy decision 與 facilitator 規則；不偽造 teacher approval。
4. readiness gate 通過後才招募，pilot 只提交去識別化 aggregate summary；完成前所有結果維持 `not-run`。
5. 當前先以獨立 Issue／PR 改善 first-session usability；不把 UI 專家 walkthrough 冒充 participant evidence。

## 下一階段：First-session usability

目標不是新增 onboarding 說明頁，而是讓首頁只突出一個可立即理解的下一步：

- fresh progress：`開始第 1 課 · 約 5 分鐘`；
- existing progress：`繼續第 X 課 · 從「聽／看／講／記／用」繼續`；
- completed lesson：`開始下一課`；
- `查看全部 20 課` 保留為次要入口。

首個 learner-facing PR 必須同時驗證 fresh、existing、completed progress，zh-TW／
English 與 iPhone 13 Safari 390×844。主操作在參考 viewport 不需捲動即可看到，
且不得遮擋既有 lesson pager、底部導覽或改動學習／儲存邏輯。

## M2 不做的事情

- 不加入完全自由的 AI tutor 或開放式聊天。
- 不做 AI 發音評分、聲音模型 fine-tuning 或付費語音服務。
- 不把第 21–24 課標成可玩，也不建立假音檔 URL。
- 不把未經教師審核的生成內容寫入 runtime lesson catalog。
- 不新增登入、社群、排行榜、複雜 streak 或大型詞典。
- 不在這段 roadmap 內重做既有 mobile UI、SRS 或部署設定。

## M2 完成定義

M2 只有在以下條件全部成立時，才可稱為完成：

- package 可以由明確的 teacher brief 重複產製，而不是靠人工複製欄位。
- validator 對缺少來源、授權、教師審核、五段節奏或音檔狀態的資料會失敗。
- 尚未完成教師審核的 package 必須保留 pending 記錄；目前第 1–20 課 runtime handoff 依 owner risk acceptance 交付，不得改稱 teacher-approved。音檔必須已有來源、授權與未修改證據才可進 handoff。
- playable lesson integration 有獨立 PR，並通過現有 `npm test`、`npm run lint`
  與手機尺寸驗證。
- 學習者測試結果能回答「初學者是否完成並記得」，而不只是證明畫面能渲染。

目前 M2 尚未宣稱完成；M2.5 的真實 participant evidence 仍是缺口，但已 deferred
until real participant demand。其前置條件與資料界線仍以
`docs/beginner-pilot-plan.md` 為準。當前最小實作單位是 **first-session 3-second
entry**，而不是新增 lesson package 或繼續建置未使用的 pilot infrastructure。
