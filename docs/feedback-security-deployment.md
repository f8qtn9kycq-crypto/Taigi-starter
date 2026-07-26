# 外部回饋表單部署邊界

一般學習者回饋固定使用 owner 提供的 Google Form。本網站不接收、儲存、匯出
或展示回饋內容，也不提供 feedback dashboard。

## Vercel 設定

- 只在 Vercel project environment 設定 `FEEDBACK_EXTERNAL_FORM_URL`。
- 值必須是 owner 提供的 HTTPS Google Form URL。
- Preview 與 production 分別確認環境變數，避免把表單 URL 寫進 repository。
- `/api/feedback-config` 只回傳通過 HTTPS 驗證的 URL，沒有 URL 時回傳未設定狀態。

## 發佈前檢查

```bash
npm run lesson:validate
npm test
npm run lint
npm run build:vercel
```

在 Vercel preview 確認回饋按鈕只開啟外部 Google Form；不要提交測試回覆，
也不要把表單回覆、憑證或測試者個資提交到 repository。
