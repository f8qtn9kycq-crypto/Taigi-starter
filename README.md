# 台語起步 Tâi-gí Start

台語起步是一個行動優先的台語學習網站。第一個可用學習循環以一句日常
問候語為核心，帶使用者依序完成「聽、看、講、記、用」，並用簡單的間隔
複習安排下一次練習。

## 目前範圍

- 教育部辭典例句的真實台語音檔
- 台羅與白話字對照
- 瀏覽器內錄音與立即回放；錄音不會上傳或保存
- Again / Hard / Easy 三種不同的複習間隔
- 版本化的裝置端學習進度
- 繁體中文與英文介面
- 60 秒產品回饋表單

目前 production 已部署第 1–18 課，lesson package 第 2–18 課全部接成
playable 五段流程。第 2–18 課仍保留
`teacherReview: required`，並以明確的 owner risk acceptance 交付，不宣稱已有
教師核准。第 19 課以後仍是 roadmap。

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
- `app/api/feedback-config`：提供已設定的外部表單 URL
- `public/audio`：授權音檔原檔
- `tests`：伺服器輸出與純邏輯測試

AI 協作規範請見 [AGENTS.md](./AGENTS.md)，審查順序請見
[REVIEW.md](./REVIEW.md)。

## 音檔來源

第 1–18 課詞條與原始音檔取自中華民國教育部《臺灣台語常用詞辭典》；每個
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

部署前 gate 請見[回饋安全部署邊界](./docs/feedback-security-deployment.md)與
[Production exit plan](./docs/production-exit-plan.md)。
