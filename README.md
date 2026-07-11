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

目前只承諾第 1 課的完整品質。其他課程仍是路徑預覽，不應被描述為已完成
內容。

## 回饋流程與隱私

- 一般學習者可使用產品內的 60 秒回饋表單。
- 技術測試者可使用 `.github/ISSUE_TEMPLATE` 的 GitHub Issue Forms。
- 原始回饋儲存在 Sites D1，只能由設定的擁有者透過 `/feedback` 查看。
- `/api/feedback/export` 會輸出可供 Google Sheets 使用的 CSV，且同樣需要
  擁有者身分。
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
```

`npm test` 會建立正式產物、檢查首頁交付內容，並測試間隔複習與本機進度
資料的純函式。

## 專案結構

- `app/components`：畫面元件
- `app/hooks`：音訊、錄音與學習進度 hooks
- `app/types`：共用學習模型
- `app/utils`：純計算邏輯
- `app/services`：版本化裝置端儲存
- `app/api/feedback`：私密回饋寫入與擁有者匯出
- `db`、`drizzle`：D1 模型與 migration
- `public/audio`：授權音檔原檔
- `tests`：伺服器輸出與純邏輯測試

AI 協作規範請見 [AGENTS.md](./AGENTS.md)，審查順序請見
[REVIEW.md](./REVIEW.md)。

## 音檔來源

第 1 課例句「你食飽未？」取自中華民國教育部《臺灣台語常用詞辭典》，
原始例句頁面：<https://sutian.moe.edu.tw/und-hani/su/1653/>。

文字與音檔依「創用 CC 姓名標示－禁止改作 3.0 臺灣」授權使用。專案保存
未修改的原始 MP3；不得裁切、混音或以其他方式改作。

授權說明：<https://sutian.moe.edu.tw/und-hani/piantsip/pankhuan-singbing/>

## 部署

本專案使用 OpenAI Sites，並以 `.openai/hosting.json` 宣告 D1 綁定。請勿建立
第二個 Sites 專案或更換既有 `project_id`。
