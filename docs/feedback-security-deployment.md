# 回饋安全部署邊界

這份文件是 Issue #28 的最小 human boundary confirmation（HBC）與發佈前
檢查。它不取代 GitHub review，也不會由 CI 推測或代替 owner 接受平台信任
風險。

## 必須成立的部署條件

- production 唯一入口是
  `https://taigi-start.alexcy2025.chatgpt.site`。
- 沒有任何 `workers.dev`、staging 或其他 alternate route 可以直接到達同一
  個 Worker。
- production 的 `cf-connecting-ip` 由受信任 edge 注入或覆寫，代表原始
  requester，而不是所有使用者共用的平台代理出口 IP。
- `oai-authenticated-user-email` 只在受信任 platform boundary 之後使用；
  不受信任的 direct access 必須被阻擋。

## 程式碼的 fail-closed 行為

- `POST /api/feedback` 缺少 `Origin` 時拒絕。
- `POST /api/feedback` 缺少 rate-limit source 時，在讀取 body 或寫入 D1
  前拒絕。
- rate-limit key 只保存 source hash，不保存 raw IP。
- owner CSV export 的身分驗證仍依賴平台注入的 authenticated-user header；
  因此 direct-entry boundary 必須由部署設定證明。

## 發佈前最小證據

Owner 必須在 Issue #28 留下 deployment attestation，並附上至少一項平台或
route 設定證據，確認上列四項條件。沒有這項證據時，PR 可以完成本地與
GitHub checks，但不得被宣告為無條件安全通過或部署完成。
