# 台語起步 Tâi-gí Start

台語起步是一個行動優先的台語學習網站。第一個可用學習循環以一句日常
問候語為核心，帶使用者依序完成「聽、看、講、記、用」，並用簡單的間隔
複習安排下一次練習。

## 目前範圍

- 教育部辭典例句的真實台語音檔
- 台羅與白話字對照
- 瀏覽器內錄音與立即回放；錄音不會上傳或保存
- Again / Hard / Easy 三種不同的複習間隔
- v5 版本化裝置端學習進度：逐課保留階段、詞語位置、完成項目與複習卡
- 繁體中文與英文介面
- 60 秒產品回饋表單

目前 runtime catalog 包含第 1–20 課，lesson package 第 2–20 課全部接成
playable 五段流程。第 2–20 課仍保留
`teacherReview: required`，並以明確的 owner risk acceptance 交付，不宣稱已有
教師核准。

## 回饋流程與隱私

- 一般學習者使用 owner 提供的 Google Form，不在本網站儲存回饋。
- 技術測試者可使用 `.github/ISSUE_TEMPLATE` 的 GitHub Issue Forms。
- `FEEDBACK_EXTERNAL_FORM_URL` 必須是 HTTPS；網站只顯示外部表單連結。
- 不得提交回饋匯出檔、憑證或測試者個人資料。

## 本機開發

需求：Node.js `>=22.13.0`

```bash
npm install
npm run dev
```

驗證：

```bash
npm test
npm run lint
npm run lessons:validate
git diff --check
```

`npm test` 會先執行 lesson package routine gate，再建立正式產物、檢查首頁
交付內容，並測試間隔複習與本機進度資料的純函式。routine gate 會逐詞檢查
POJ、官方原始 MP3、CC BY-ND attribution、local audio asset 與課程範圍。

## 專案結構

- `app/components`：畫面元件
- `app/hooks`：音訊、錄音與學習進度 hooks
- `app/types`：共用學習模型
- `app/utils`：純計算邏輯
- `app/services`：版本化裝置端儲存
- `app/data/lesson-packages`：依課程範圍拆分的 authoring package 資料
- `app/api/feedback-config`：提供已設定的外部表單 URL
- `public/audio`：授權音檔原檔
- `tests`：伺服器輸出與純邏輯測試

AI 協作規範請見 [AGENTS.md](./AGENTS.md)，審查順序請見
[REVIEW.md](./REVIEW.md)。

## 課程資料邊界

課程內容先以 `app/data/lesson-packages` 的 authoring package 維護，經
`app/utils/lesson-package-validation.ts` 驗證，再由
`app/utils/lesson-package-adapter.ts` 轉成 learner runtime model。
`app/utils/lesson-catalog.ts` 只負責依既有優先順序組裝 catalog，
`app/data/lessons.ts` 則保留穩定的 runtime export。發布前的 handoff gate 位於
`app/data/lesson-package-handoffs.ts` 與
`app/utils/lesson-package-handoff.ts`；未通過 schema、來源驗證與必要教師審查的
draft 不得直接進入 learner runtime。

`app/types/lesson-conversation.ts` 與對應 builder 提供純粹、單一課程範圍的
context。`app/services/ai` 目前只有 server-side／離線 authoring 使用的窄型別
contract、prompt builder 與受 gate 保護的 draft consumer；沒有 provider adapter、
model 名稱、憑證或外部模型呼叫，也不會進入 learner client bundle。課程步驟中的
instruction／prompt 是學習者看得到的教學文字，不是 LLM prompt。

## 音檔來源

第 1–20 課詞條與原始音檔取自中華民國教育部《臺灣台語常用詞辭典》；每個
playable phrase 都保留 canonical 詞條頁、原始 MP3 URL、speaker、授權與
`isUnmodifiedOriginal` attribution。

文字與音檔依「創用 CC 姓名標示－禁止改作 3.0 臺灣」授權使用。專案保存
未修改的原始 MP3；不得裁切、混音或以其他方式改作。

授權說明：<https://sutian.moe.edu.tw/und-hani/piantsip/pankhuan-singbing/>

## 部署

Vercel 使用標準 Next.js build：

```bash
npm run build:vercel
```

將 `FEEDBACK_EXTERNAL_FORM_URL` 設為 owner 的 HTTPS Google Form URL，再由
Vercel Git integration 以 GitHub `main` 建立 preview 與 production deployment。
Vercel 是目前唯一的 production 驗證與發佈目標；既有 chatgpt.site／Sites
版本只保留為歷史紀錄，不再是必要 fallback 或 release gate。為避免改變既有
專案設定，`.openai/hosting.json` 仍原樣保留。

部署前 gate 請見[回饋安全部署邊界](./docs/feedback-security-deployment.md)與
[Production exit plan](./docs/production-exit-plan.md)。
