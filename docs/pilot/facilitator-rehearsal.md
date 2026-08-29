# M2.5 Facilitator Rehearsal

## Artifact status

- Artifact ID: `m2.5-facilitator-rehearsal-v1`
- State: `template-only`／`not-completed`／`not-participant-evidence`
- Candidate lesson: `lesson-19-polite-exchanges-package`
- Filled-record rule: **DO NOT COMMIT FILLED RECORDS**

這份 artifact 讓 facilitator 在招募前完成一次無 participant 的 dry run。合併
template、CI 通過或 Codex 執行檢查都不代表 facilitator 已完成 rehearsal，也不能
把 `facilitatorProtocolReady` 改為 verified。只有 facilitator 親自完成全部步驟，
並在受限位置留下可追溯 record 與 ISO timestamp，才可另行評估該 gate。

## Rehearsal setup

- [ ] 使用 canonical Production 與當下 exact GitHub main SHA。
- [ ] 記錄實際 browser、device／viewport、日期與 consent script version。
- [ ] 使用 `m2.5-consent-v1` 的 owner-controlled working copy；不在 repo 填入
  owner 或 participant 資料。
- [ ] 使用成人 participant 範圍；未成年人、報酬、跨境資料或額外聯絡資料均
  停止並另做 review。
- [ ] 確認這是沒有 participant 的 rehearsal，不建立 observation row、不產生
  participant evidence。

## Facilitator walkthrough

依序朗讀並演練下列規則；每一項都要能用自己的話解釋原因：

1. **先說明再同意**：使用 exact consent script。沉默、模糊回應或預先勾選
   都不是 consent；不同意時不建立 session record。
2. **測產品，不考學習者**：不提示答案、不代替點擊、不用表情或語氣暗示
   正確選項。只有對方主動求助或完全卡住時才記錄受控分類。
3. **麥克風完全可選**：不要求開啟麥克風或錄音；主動指出不錄音替代路徑。
   不把瀏覽器暫時錄音收進 evidence，也不宣稱有 AI 發音評分。
4. **五階段不中斷 coaching**：Hear → See → Say → Recall → Use 由學習者自行
   推進；facilitator 只記錄是否知道下一步、最後完成 stage 與受控停止原因。
5. **停止優先**：對方不理解資料用途、表示不舒服、想停止，或產品行為與
   consent script 不一致時，立即停止，不說服繼續。
6. **只留最小資料**：participant-level record 只放受限位置；不記姓名、email、
   電話、帳號、精確位置、原始逐字稿或聲音。repo 只接受去識別 aggregate。
7. **Delayed recall 分開選擇**：immediate consent 不代表 follow-up consent；
   未經 privacy review 的聯絡方式不得使用。
8. **撤回與刪除可執行**：能指出 participant 應聯絡誰、record 放在哪裡、誰能
   存取、保留多久，以及如何完成刪除與留下受限 evidence。

## Stop-condition drill

Facilitator 應口頭回答以下三個情境，任一答錯就不完成 rehearsal：

- Participant 說「我不想用麥克風」：指出不錄音路徑並繼續，不記為失敗。
- Participant 問「你覺得哪個答案對？」：不提示答案，重申是在測產品是否清楚。
- Participant 說「不要再保存我的資料」：停止 session，依 reviewed deletion
  procedure 處理，不把 raw record 搬進 repo。

## Blank rehearsal record

此 record 只能填在 owner-controlled、access-limited 的位置；repo 只保留空白
格式。若任何欄位未完成，`facilitatorProtocolReady` 必須維持 pending。

<!-- FACILITATOR_REHEARSAL_RECORD_START -->

```yaml
artifactVersion: m2.5-facilitator-rehearsal-v1
facilitatorId: owner-controlled-id
rehearsedAt: YYYY-MM-DDTHH:mm:ss.sssZ
sourceCommit: full-git-sha
productionDeploymentRef: immutable-deployment-ref
browserAndDevice: owner-controlled-description
consentScriptVersion: m2.5-consent-v1
allWalkthroughItemsPassed: yes-or-no
allStopConditionDrillsPassed: yes-or-no
participantPresent: no
participantRecordCreated: no
attestation: exact-protocol-rehearsed-without-coaching-or-participant-data
evidenceRef: immutable-access-controlled-ref
```

<!-- FACILITATOR_REHEARSAL_RECORD_END -->

## Readiness handoff

只有下列條件全部成立後，才可另行把 `facilitatorProtocolReady` 評估為 verified：

1. Facilitator 親自完成 walkthrough 與三個 stop-condition drills。
2. Filled record 明確記錄沒有 participant，也沒有 participant-level data。
3. Record 包含 exact source SHA、Production deployment、ISO timestamp 與 immutable
   access-controlled evidence reference。
4. Consent 與 privacy gates 仍獨立評估；facilitator rehearsal 不會解除它們。

