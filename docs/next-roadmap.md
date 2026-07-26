# 台語起步下一段 roadmap：Lesson Factory Alpha

## 這一段要解決的問題

歷史 baseline 曾只有第 1 課可體驗；目前 release candidate 目標是第 1–20 課。第 2–20 課仍是有來源欄位的
`planned` package，teacher review 保持 pending，並以 owner risk acceptance
交付；learner-facing 的生活優先 path order 見 `docs/course-path-priority.md`；第 21–24 課仍是 roadmap。
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

- Release candidate runtime catalog 現在提供第 1–20 課，每課 source-backed phrases，使用
  相同的 Hear → See → Say → Recall → Use 流程與 device-local progress。
- 第 2–20 課的 58 個 MP3 都直接取自教育部詞典官方音檔，保留原始 URL、CC
  BY-ND 3.0 TW attribution 與未修改標記；逐課 mobile QA 見
  `docs/qa/lesson-2-18-390x844.md`。
- Teacher review 沒有被偽造為 approved。這次 release 以產品擁有者明確的
  owner risk acceptance 通過 handoff；後續仍可補回逐課教師審核紀錄。
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

M2.1–M2.4 的實作邊界已進入 `main`；這不等於已經有真實的 approved handoff
或第二課 playable content：

| 工作包 | main 狀態 | Truthful product state |
| --- | --- | --- |
| M2.1 Package validator | 已合併 | validator 與測試可拒絕不完整 package |
| M2.2 Teacher review contract | 已合併 | 未完成審核仍只能是 `planned` |
| M2.3 內容 16–18 | 已合併 | package 已建立，仍 `planned`；POJ 與官方原始音檔 provenance 已完整 |
| M2.4 Package-to-lesson handoff | 已合併 | integration boundary 已建立；尚無真實 approved handoff artifact |
| M2.5 Beginner pilot | 計畫已合併 | `planned`／`not-run`，沒有研究結果可宣稱 |

目前沒有 open PR 或 open Issue。下一個工作不應重新宣告 M2.1，而應在前置
條件齊備後執行 M2.5 pilot readiness／execution。

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
| M2.5 | Beginner pilot | 10–20 位初學者的短期驗證表 | 量測完成率、完成時間、回想、開口信心與放棄位置；不收集未授權的原始錄音 |

## 實作順序與 PR 邊界

每個工作包都維持一個 issue、一個 branch、一個 PR，依序處理：

1. M2.1 validator、M2.2 review contract、M2.3 package、M2.4 handoff gate 均已交付；保留所有 planned 課程的誠實狀態。
2. M2.5 先完成 readiness gate：確認真實 teacher approval、音檔 attribution、390×844 mobile evidence、測試 commit 與 facilitator 規則。
3. readiness gate 通過後，才招募 10–20 位初學者並執行短期 pilot。
4. pilot 只提交去識別化 aggregate summary；完成前所有結果維持 `not-run`。
5. 只有 aggregate summary、privacy review 與 mobile evidence 完成後，才決定下一個 lesson integration PR。

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
- 第 2–18 課若尚未完成教師審核，仍明確顯示為 `planned`；音檔必須已有來源、授權與未修改證據才可進 handoff。
- playable lesson integration 有獨立 PR，並通過現有 `npm test`、`npm run lint`
  與手機尺寸驗證。
- 學習者測試結果能回答「初學者是否完成並記得」，而不只是證明畫面能渲染。

目前 M2 尚未宣稱完成；缺口是 M2.5 的真實 participant evidence，而不是再增加
planned package。下一個最小實作單位是 **M2.5 pilot readiness／execution**，其
前置條件與資料界線詳見 `docs/beginner-pilot-plan.md`。
