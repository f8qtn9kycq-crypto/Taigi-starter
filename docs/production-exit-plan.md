# Production exit plan

本專案目前採 Vercel Hobby preview／production 路徑。Vercel 是唯一的 current
production 驗證與發佈目標；chatgpt.site／Sites 已退役，不再是 fallback、同步
目標或 release gate。`.openai/hosting.json` 為相容既有專案設定而保留，但不得據此
推論仍需保存或部署 Sites 版本。

## 必要 source gates

```bash
npm run lesson:validate
npm test
npm run lint
npm run build:vercel
git diff --check
```

Lesson package 仍須維持 truthful playable／planned 狀態、五段 Hear → See →
Say → Recall → Use 節奏、臺羅與 POJ 欄位規則、教育部 canonical source、未修改
授權音檔與 attribution。沒有完整來源或音檔 provenance 的 planned lesson 不得
進入 playable catalog。

## Vercel preview gate

- Preview source commit 必須等於已驗證的 branch head。
- 首頁、Lesson 1、已標記 playable 的課程與音檔可載入。
- `/api/feedback-config` 在設定有效 URL 時回傳 owner 的 HTTPS Google Form。
- 回饋 UI 不送 POST 到本網站、不寫入本網站資料庫，也不暴露 dashboard 或 export。
- 320×700、390×844、412×915 沒有水平溢出；主要控制項至少 44px。
- zh-TW／English、鍵盤 focus、音檔失敗 fallback 與麥克風拒絕 fallback 維持可用。

## Production gate

只有 preview 以上 gates 全部通過，且 Vercel deployment status 為 Ready，才可部署
production。部署後記錄 source commit、Vercel deployment URL、production URL 與
可回復的上一個 deployment。Vercel Git integration 可由已合併的 GitHub `main`
自動建立 production deployment；文件更新本身不得觸發或宣稱 Sites 發佈。
