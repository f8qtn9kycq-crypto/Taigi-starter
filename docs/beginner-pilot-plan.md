# M2.5 初學者 pilot 計畫

## 文件狀態

`planned`：本文件定義執行方法；pilot 尚未執行，也沒有研究結果可宣稱。

本 pilot 必須等 M2.4 handoff gate、至少一個真正 playable 的 lesson、音檔
attribution，以及 mobile flow evidence 都完成後才可以開始。這份文件本身
不會把任何 planned package 標成 playable。

## 目的與範圍

用一個短 lesson 觀察初學者是否能夠：

1. 理解下一步要做什麼。
2. 完成 Hear → See → Say → Recall → Use 五段流程。
3. 在課程結束後回想主要詞句。
4. 誠實表達自己開口練習的信心變化。

這是低風險的可用性與學習訊號觀察，不是統計代表性研究，也不測試 AI
發音評分、語音辨識或長期學習成效。

## Participant 與隱私界線

- 招募 10–20 位台語初學者；每位使用去識別 ID，例如 `P01`、`P02`。
- 先說明流程、預計時間、可隨時停止，取得明確同意後才開始。
- 不收集姓名、email、電話、帳號、精確位置或其他不必要識別資料。
- 不要求錄音；不收集、上傳或持久化 participant 的原始聲音。
- 瀏覽器內的自我練習錄音若存在，仍只屬暫存資料，不納入 pilot evidence。
- observation sheet 可存於 owner-controlled、access-limited 的位置；repo
  只接受去識別化 aggregate summary，不提交 participant-level raw notes。
- 任一 participant 表示不舒服、被迫錄音或不理解資料用途時，立即停止該場。
- 使用 `docs/pilot/participant-consent-template.md` 的 exact version；owner
  operating defaults 保留在 repo，session-specific 值、privacy-review evidence
  與 filled record 只能存在受限 working copy。空白 repo template 本身不是
  consent 或 privacy evidence。

## 執行前置條件

每個前置條件都必須以 `pending` 或 `verified` evidence record 表示；只有
`verified`、非空白 evidence reference 與有效 ISO checked-at timestamp 同時存在
時才算通過。單獨的 boolean、口頭確認或 owner blanket approval 不足以解除 gate。

- [x] M2.4 handoff artifact 已完成；在 sole-contributor 模式下，以可追溯的
  owner risk acceptance 授權內容 handoff，teacher review metadata 仍誠實維持
  pending，不宣稱教師核准。
- [ ] 使用的 lesson 有已核准、未修改且可追溯的 audio attribution。
- [ ] playable lesson 有 mobile flow evidence。
- [ ] 測試 commit、瀏覽器、裝置 viewport 與執行日期已記錄。
- [ ] facilitator 已熟悉「不代替學習者操作、不提示答案、不宣稱 AI feedback」的規則。
- [ ] Participant consent script 已填完 session-specific 欄位、固定版本並通過 privacy review。
- [ ] Privacy review 已涵蓋資料流、retention、access、withdrawal 與 deletion，並留下 immutable evidence reference。

## 單場流程

建議每場約 10–15 分鐘，使用 390×844 viewport；若裝置不同，必須記錄實際
viewport。Facilitator 只在學習者明確要求或卡住時記錄觀察，不替學習者完成
操作。

| 階段 | 操作 | 要記錄的 evidence |
| --- | --- | --- |
| 開始 | 說明同意、隱私與可停止；記錄 start time | 是否理解任務與資料界線 |
| Hear | 讓學習者嘗試播放真實音檔 | 是否知道要按哪裡、是否遇到播放問題 |
| See | 讓學習者連結漢字、台羅與意思 | 是否需要協助理解顯示內容 |
| Say | 讓學習者自行跟讀或用不錄音替代路徑 | 是否願意開口、是否誤以為有評分 |
| Recall | 隱藏答案後請學習者回想主要詞句 | 回想是否完成、是否誤解 reveal 行為 |
| Use | 完成一個生活情境轉移任務 | 是否知道最後一步與 review handoff |
| 結束 | 記錄 finish time、信心評分與短回饋 | 是否完成、哪一階段最困難 |

## 必量測項目定義

| Metric | 定義 | 記錄方式 |
| --- | --- | --- |
| Completion rate | 完成 Use 並抵達 review handoff 的人數 ÷ 開始人數 | aggregate count；不得用單一成功案例代替 |
| Completion time | 從 start 到完成 Use 的分鐘數 | 只保留 aggregate median 與範圍 |
| Immediate recall | 結束後不看答案，回想主要詞句或意思 | 每位以 `0/1` 記錄，最後只彙總比例 |
| Delayed recall | 24–48 小時後，以同一規則再次回想 | 只在 participant 同意後以去識別 ID 記錄；未執行則標示 pending |
| Speaking confidence | 開始前與結束後自評 1–5：`1=很沒把握`、`5=很有把握` | aggregate median 與變化方向 |
| Abandonment point | 未完成者最後完成的 stage 與停止原因 | 使用 stage ID 與短分類，不存 raw personal story |

## 去識別 observation sheet

執行時可在受限位置使用下列欄位；不要把填寫後的 participant-level 表格
提交到 repository：

| 欄位 | 格式 | 必填 |
| --- | --- | --- |
| participantId | `P01`–`P20` | 是 |
| started | `yes/no` | 是 |
| completed | `yes/no` | 開始後 |
| completionMinutes | 正數或空值 | 完成後 |
| immediateRecall | `0/1` 或空值 | 結束後 |
| delayedRecall | `0/1/pending` | 24–48 小時後 |
| confidenceBefore | `1`–`5` | 開始前 |
| confidenceAfter | `1`–`5` 或空值 | 結束後 |
| abandonmentStage | stage ID 或 `none` | 結束時 |
| abandonmentReason | 受控分類或空值 | 結束時 |
| facilitatorNote | 去識別、短句、非原始逐字稿 | 選填 |

`abandonmentReason` 只使用簡短分類，例如 `audio`、`instructions`、
`navigation`、`language`、`privacy-concern`、`other`。若需要保存更長的
說明，先確認沒有識別資訊，且不把 raw feedback 或錄音放進 repo。

## Aggregate summary 格式

Pilot 完成後，只在受限位置產生下列彙總；若尚未執行，所有結果欄位必須維持
`not-run`，不可填入預估數字：

```text
pilot_status: not-run
participant_count: not-run
started_count: not-run
completed_count: not-run
completion_rate: not-run
completion_time_median_minutes: not-run
immediate_recall_rate: not-run
delayed_recall_rate: not-run
confidence_change_median: not-run
top_abandonment_stages: not-run
privacy_or_safety_incidents: not-run
```

彙總結果必須附上測試 commit、lesson、viewport、執行日期與 evidence location。
若有 privacy 或 safety incident，先停止擴大招募並由 owner 處理，不把它藏在
平均值裡。

## Pilot 後的決策規則

- 完成率、回想或信心沒有預設的漂亮門檻；先用 evidence 找出最需要修正的
  stage，避免把小樣本誤讀成產品成功。
- 任何誤導音檔、AI 評分、錄音上傳、未授權資料保存或 mobile accessibility
  問題，都會阻止進入下一個 integration decision。
- 只有在 aggregate summary、privacy review 與 mobile evidence 都完成後，
  才能決定是否開下一個 lesson integration PR。
