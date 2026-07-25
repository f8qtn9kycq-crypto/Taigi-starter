# Production exit plan

這份文件是 Taigi Start 從目前 MVP source 進入 production 的 release gate。
它不把 Sites 已保存版本、GitHub checks 或自動化測試誤當成完整 production
證據。

## Release source

- 從 `github/main` 建立乾淨 release branch；不要使用含有未提交變更的工作區。
- Lesson 1 必須維持一個可玩的 phrase、五個固定 stage，以及可追溯的教育部
  來源、未修改音檔與授權 attribution。
- `planned` lesson package 不得被 runtime catalog 當成 playable lesson。
- Sites saved version 的 `source.commit_sha` 必須等於已驗證並推送的 release
  commit；目前 live version 13 已對應到 exact release head `c52077d`。

## Required gates

### 1. Automated source gate

```bash
npm test
npm run lint
git diff --check github/main...HEAD
```

這些命令只能證明 source/build contract；不能代替下列手動與平台證據。

### 2. Manual product gate

在 staging 或 isolated preview 完成並留下 evidence：

- 320×700、390×844、412×915：沒有水平溢出、固定導覽遮住內容或觸控目標
  小於 44px。
- zh-TW 預設介面與 English 完整切換。
- Hear 真實音檔成功與失敗 fallback。
- Say 麥克風允許、拒絕、瀏覽器不支援；錄音只留在頁面，不上傳或保存。
- Recall 答案在 reveal 前不可見，Use 不能繞過 reveal。
- feedback public POST 的 same-origin、body limit、rate limit 與 owner-only
  export；正式 D1 不寫入測試資料。
- 若設定 `FEEDBACK_EXTERNAL_FORM_URL`，必須是 owner 提供的 HTTPS 私有表單；
  必須先以未登入狀態確認一般使用者能填寫；未設定、無效或要求登入時維持
  私有 D1 fallback，不得改接公開 GitHub Issue Form。
- Feedback 與 review modal 必須將焦點帶入 Close control、以 Tab/Shift+Tab
  留在 dialog 內，Escape 關閉並把焦點還給觸發按鈕；若瀏覽器工具無法送出
  Tab，必須保留程式碼與實際 focus/Escape 證據為 partial，不能宣稱完整 pass。

手動證據要填回 `docs/research-prototype-test-plan.md` 的 Manual evidence
record，不能只寫「已檢查」。

### 3. Sites runtime gate

在 Sites project `appgprj_6a50ce9195588191975740438c4a8f0e` 驗證：

- `DB` binding 指向預期 D1。
- `FEEDBACK_EXTERNAL_FORM_URL` 已設定為 owner 提供的 Google Form；未登入預覽
  已確認 radio、checkbox、textbox 與 Submit controls 可用，Sites runtime
  environment revision 為 `5`。
- `FEEDBACK_OWNER_EMAIL` 已設定非空值，且 owner `/feedback` 與 CSV export
  的登入邊界實際可用。
- production 唯一入口沒有可繞過可信 edge 的 alternate Worker route。
- `cf-connecting-ip` 是可信 edge 注入的原始 requester source。
- `oai-authenticated-user-email` 只能在可信 platform boundary 後被信任。
- Worker logs、rate limiting 與 rollback 方法已實測；D1 backup/restore
  仍須平台管理員提供證據。

若 Sites 無法提供 isolated staging/preview 或上述 runtime evidence，不要建立
第二個 Sites project；把 Cloudflare Workers + D1 migration 留作明確的
conditional fallback。

### 4. Provenance and rollback gate

部署前記錄：

- release commit SHA
- Sites version number 與 saved version source SHA
- deployment status 與 production URL
- rollback target version
- rollback 實測結果

若 live 頁面的內容、source SHA 或 version provenance 對不上，停止發布，不要
用新版本覆蓋不明來源的 production 狀態。

## Preflight command

```bash
npm run production:preflight
```

一般 source gate 通過但尚未完成全部 production evidence 時，命令會保持失敗。
只有下列每一項證據都已經真實完成，才可執行最後的 release gate：

```bash
KEYBOARD_QA_STATUS=pass \
AUDIO_FAILURE_STATUS=pass \
MICROPHONE_DENIED_STATUS=pass \
MICROPHONE_UNSUPPORTED_STATUS=pass \
STAGING_FEEDBACK_STATUS=pass \
OWNER_ATTESTATION_STATUS=pass \
D1_BACKUP_STATUS=pass \
ROLLBACK_STATUS=pass \
npm run production:preflight
```

每個環境變數都是獨立 evidence assertion，不是用來繞過檢查的 aggregate flag；
PR 或 release 記錄必須同時附上每一項對應證據位置。
