# 台語起步下一段 roadmap：Lesson Factory Alpha

## 這一段要解決的問題

目前 repo 的內容路線已經排到第 24 課，但實際可體驗的仍然只有第 1 課；
第 2–15 課是有來源欄位的 `planned` package，第 16–24 課仍是 roadmap。
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

## 目前基線

以 2026-07-22 的 GitHub `main` 為基準：

- 第 1 課是唯一可體驗的完整 lesson。
- 第 2–15 課已在 `app/data/lesson-packages.ts` 建立 typed package，全部
  保持 `planned`、要求教師審核，且音檔是 `not-yet-added`。
- 第 16–24 課已在 `docs/lesson-roadmap.md` 排定，但尚未產製 package。
- Lesson 1 已有 Hear → See → Say → Recall → Use 五段節奏與 metadata 驗證。
- Recall 已支援台羅／白話字切換；這可作為後續 package 的呈現契約，但不代表
  planned package 已接入 React。
- GitHub Project #6 已是現有 issue／PR 流程的一部分，後續內容工作應維持
  一個明確 issue 對應一個可審核 PR。

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
| M2.1 | Package validator | 純函式驗證器與測試 | 能檢查課次唯一、五段節奏、雙語欄位、來源／授權、教師審核與音檔 pending 狀態 |
| M2.2 | Teacher review contract | 可追蹤的審核欄位與待確認清單 | 未完成審核的 package 仍只能是 `planned`，不能被 runtime catalog 當成可玩課程 |
| M2.3 | 下一批內容 16–18 | `出門坐車`、`餐廳點菜`、`買物件佮問價` 的 source-verified package | 每課先核實教育部詞條，再通過 validator；不加入未核准音檔 |
| M2.4 | Package-to-lesson handoff | 把「已審核 package」轉成 playable lesson 的明確輸入契約 | 只允許具備教師核准、音檔 attribution 與 mobile flow 證據的資料進入 integration PR |
| M2.5 | Beginner pilot | 10–20 位初學者的短期驗證表 | 量測完成率、完成時間、回想、開口信心與放棄位置；不收集未授權的原始錄音 |

## 實作順序與 PR 邊界

每個工作包都維持一個 issue、一個 branch、一個 PR，依序處理：

1. 先做 M2.1 validator；它不改 React，也不改現有 package 內容。
2. validator 綠燈後，再做 M2.2 review contract；保留所有 planned 課程的
   誠實狀態。
3. 接著才做 M2.3 第 16–18 課 package；每一課逐詞核對教育部 canonical URL、
   台羅與可接受變體，再跑完整測試。
4. M2.4 是獨立的 integration gate，不得因 package 已建立就自動接入畫面。
5. M2.5 只做匿名、低風險的學習驗證；錄音仍是瀏覽器暫存，不上傳、不持久化。

## M2 不做的事情

- 不加入完全自由的 AI tutor 或開放式聊天。
- 不做 AI 發音評分、聲音模型 fine-tuning 或付費語音服務。
- 不把第 2–24 課標成可玩，也不建立假音檔 URL。
- 不把未經教師審核的生成內容寫入 runtime lesson catalog。
- 不新增登入、社群、排行榜、複雜 streak 或大型詞典。
- 不在這段 roadmap 內重做既有 mobile UI、SRS 或部署設定。

## M2 完成定義

M2 只有在以下條件全部成立時，才可稱為完成：

- package 可以由明確的 teacher brief 重複產製，而不是靠人工複製欄位。
- validator 對缺少來源、授權、教師審核、五段節奏或音檔狀態的資料會失敗。
- 第 16–18 課若尚未完成教師／音檔審核，仍明確顯示為 `planned`。
- playable lesson integration 有獨立 PR，並通過現有 `npm test`、`npm run lint`
  與手機尺寸驗證。
- 學習者測試結果能回答「初學者是否完成並記得」，而不只是證明畫面能渲染。

下一個最小實作單位是 **M2.1：Package validator**。在它完成前，不再擴大
課程數量，避免內容產量超過審核與驗證能力。
