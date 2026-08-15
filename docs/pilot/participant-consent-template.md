# M2.5 初學者 Pilot Participant Consent Template

## Template status

- Template ID: `m2.5-consent-v2`
- State: `template-only`／`not-approved`／`not-for-use`
- Candidate lesson: `lesson-19-polite-exchanges-package`
- Filled-record rule: **DO NOT COMMIT FILLED RECORDS**

這是空白、可審查的 script 與 record 格式，不是 participant consent evidence、
privacy approval、facilitator attestation 或法律意見。所有 session-specific
欄位必須在 owner-controlled working copy 完成，且經 privacy reviewer 通過後，
才可以招募或開始任何場次。Repository 內這份空白模板本身不得作為
`participantConsentReady` 或 `privacyReviewPassed` 的 verified evidence。

This is a blank, reviewable script and record format. It is not consent
evidence, privacy approval, facilitator attestation, or legal advice. Complete
every session-specific field in an owner-controlled working copy and obtain a
privacy review before recruitment or any session. This repository copy must
not be used to mark a readiness gate verified.

本模板把臺灣《個人資料保護法》第 8 條的告知項目與第 3 條的當事人權利轉成
preflight 欄位，並保留第 7 條所要求的 consent evidence。實際適用性仍須由
owner 的 privacy／legal reviewer 依當次資料流確認：

- [個人資料保護法第 8 條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=8)
- [個人資料保護法第 3 條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=3)
- [個人資料保護法第 7 條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=7)

## Owner operating defaults

以下是 sole-contributor pilot 的最低資料處理規則；它們不是 privacy approval，
也不會因為寫入 repo 就解除 readiness gate：

- 蒐集者與唯一可存取者：Taigi Start 的 sole contributor／product owner；
  facilitator 在同意前以真實姓名自我介紹。
- 權利請求管道：participant 直接回覆原本的招募／聯絡管道，由 sole contributor
  處理查詢、複製、更正、停止利用或刪除請求；只使用能在 retention 期間接收
  回覆的招募管道，pilot record 不另存該聯絡資料。
- Participant-level record：只放在 owner 的 FileVault 加密 Mac 上、repo 外的
  `Taigi Pilot Private` 本機資料夾；不得放在 iCloud、Google Drive、公開連結或
  任何 repository。
- 存取與備份：只有 sole contributor 可存取；資料夾必須先排除 Time Machine，
  且不建立 participant-record 備份。若意外產生副本，必須與原 record
  一併刪除並記錄完成時間。
- Retention：每場 session 後最多 30 日；到期前可因 participant 請求提前刪除。
  到期後只保留無法回推 participant 的 aggregate summary。
- Delayed recall：只使用既有招募／聯絡管道安排 24–48 小時 follow-up；不把
  姓名、email、電話、帳號或新的聯絡資料複製進 pilot record。

The sole contributor is the collector and only authorized accessor. Rights
requests and delayed recall use the existing recruitment channel without
copying contact details into pilot records. De-identified participant-level
records stay only in the local, non-cloud-synced `Taigi Pilot Private` folder
on the owner's FileVault-encrypted Mac. The folder is excluded from Time
Machine and no other participant-record backup is created. Each record is
deleted within 30 days after its session, or sooner on
request; only irreversible aggregate results may remain.

## Session preflight

在 repo 外的 working copy 完成並審核下列資料。若任一項空白，不得使用 script：

- [ ] 蒐集者／執行單位名稱：sole contributor／product owner；已在同意前告知真實姓名。
- [ ] Participant 權利與刪除請求聯絡管道：原本可在 retention 期間接收回覆的招募／聯絡管道；不另存聯絡資料。
- [ ] 蒐集目的：只限初學者 usability 與 learning-signal pilot。
- [ ] 個人資料類別：逐字稿列出的去識別欄位；不得加入聯絡資料或原始錄音。
- [ ] 利用期間／retention：session 後最多 30 日；本次刪除期限已記錄。
- [ ] 利用地區：臺灣；不得跨境傳輸 participant-level record。
- [ ] 利用對象／可存取角色：sole contributor 一人。
- [ ] 利用方式：現場觀察、受限本機儲存、去識別彙總、到期或依請求刪除。
- [ ] 受限儲存位置：FileVault 加密 Mac 上、repo 與 cloud sync 外的 `Taigi Pilot Private`；已確認排除 Time Machine。
- [ ] 刪除方法與完成證據：刪除 active record 與任何意外副本、清空垃圾桶，並在受限 audit log 記錄 ISO timestamp；不宣稱 SSD secure erase。
- [ ] Delayed recall 聯絡方法：只用既有招募管道安排，不複製聯絡資料。
- [ ] 測試 commit、deployment、lesson、browser、viewport 與 session 日期：`[SESSION MUST SET]`
- [ ] Privacy reviewer、reviewed-at ISO timestamp、decision 與 immutable evidence ref：`[PRIVACY REVIEWER MUST SET]`

本版本只適用於能自行同意的成人 participant。未成年人、代理同意、報酬、
跨境資料或額外聯絡資料都超出本模板；遇到任一情形時停止招募，另做
privacy／legal review 與專用 script。

This version is for adult participants who can consent for themselves. Stop
and obtain a separate privacy/legal review and script for minors, proxy
consent, compensation, cross-border data use, or extra contact data.
If the operator is subject to an institutional ethics or research review,
that review remains an additional gate and cannot be replaced by this template.

## Facilitator preflight

- [ ] 使用已完成 owner 欄位、經 privacy review 的 exact script version。
- [ ] 說明這是在測產品，不是在考 participant，也沒有 AI 發音評分。
- [ ] 不代替操作、不提示答案、不要求開啟麥克風或錄音。
- [ ] 提供不錄音替代路徑；participant 拒絕麥克風仍可進行 session。
- [ ] 先完成 immediate-session consent，再分開詢問 delayed recall opt-in。
- [ ] Participant 若不理解資料用途、表示不舒服或想停止，立即停止。
- [ ] 只在受限位置建立去識別 record；repo 只接受 aggregate summary。

## 中文逐字說明稿

> 你好，我們想邀請你試用 Taigi Start 的一堂初學者課程，時間約 10–15
> 分鐘。你會自己完成「聽、看、講、記、用」五個步驟；我們要觀察產品哪裡
> 清楚、哪裡容易卡住，不是在考你，也不會用 AI 評分你的發音。
>
> 參加完全自願。你可以跳過任何問題、拒絕麥克風、選擇不錄音的替代方式，
> 或在任何時間停止，不會有任何不利益。若你不參加，我們不會建立 session
> record。
>
> 這場 session 只記錄去識別 participant ID、是否開始與完成、完成時間、
> immediate recall 的 0/1 結果、開始前後 1–5 的信心、最後完成的 stage、
> 受控的停止原因，以及必要時一則去識別短註記。我們不在 observation record
> 收集姓名、email、電話、帳號、簽名、精確位置或原始逐字稿。
>
> 麥克風與自我練習錄音不是參加條件。若你選擇使用，聲音只在瀏覽器暫時
> 處理，不納入 pilot evidence、不上傳、不持久保存；你也可以全程使用不錄音
> 路徑。如果實際產品或裝置行為與這段說明不同，我們會立即停止 session。
>
> 蒐集者與唯一可存取者是 Taigi Start 的 sole contributor，也就是今天向你
> 說明的 facilitator。用途只限這次初學者 pilot。Participant-level record 只
> 存在臺灣、這台 FileVault 加密 Mac 的受限本機資料夾，session 後最多保留
> 30 日，不建立備份；到期或你提出請求時，會刪除 active record 與任何意外
> 副本，只留下無法回推你的彙總結果。你可以直接回覆原本邀請你的聯絡管道，
> 請求查詢或閱覽、取得複製本、補充或更正、停止蒐集／
> 處理／利用，或刪除你的 participant-level record。
>
> 你不提供這些資料的唯一影響是無法參加本次 pilot，不影響使用產品的其他
> 權益。你現在有任何問題嗎？你是否理解以上內容，並自願參加今天這場
> immediate session？

Facilitator 只有在 participant 清楚回答同意後，才將 `sessionChoice` 記為
`consent`。沉默、模糊回應、被催促的回應或預先勾選都不是 consent。

## English read-aloud script

> We invite you to try one beginner Taigi Start lesson for about 10–15
> minutes. You will complete Hear, See, Say, Recall, and Use on your own. We
> are testing where the product is clear or confusing; we are not testing you,
> and there is no AI pronunciation score.
>
> Participation is voluntary. You may skip a question, decline microphone
> access, use the non-recording path, or stop at any time without disadvantage.
> If you decline, we will not create a session record.
>
> The session record contains only a de-identified participant ID, started and
> completed states, completion time, a 0/1 immediate-recall result, 1–5
> confidence ratings, last completed stage, a controlled abandonment reason,
> and an optional short de-identified note. The observation record does not
> contain your name, email, phone number, account, signature, precise location,
> or a raw transcript.
>
> Microphone use and self-practice recording are optional. If selected, audio
> is temporary browser data only; it is not pilot evidence, uploaded, or
> persisted. You may use the non-recording path throughout. We will stop the
> session if the product or device behaves differently from this explanation.
>
> The collector and only authorized accessor is Taigi Start's sole contributor,
> the facilitator speaking with you today. Use is limited to this beginner
> pilot. The participant-level record stays in Taiwan in a restricted local
> folder on this FileVault-encrypted Mac for no more than 30 days after the
> session. No backup is created. At expiry or on request, the active record and
> any accidental copy are deleted; only results that cannot identify you may
> remain in aggregate. By replying through the same channel used to invite you,
> you may request access, a copy, correction, an end to
> collection/processing/use, or deletion of your participant-level record.
>
> Declining only means that you cannot join this pilot; it does not affect any
> other product rights. What questions do you have? Do you understand this and
> voluntarily agree to today's immediate session?

## Separate delayed-recall opt-in

只有 immediate session 已同意且結束後，才可以分開詢問：

> 我們也可以在 24–48 小時後做一次相同規則的短回想。這是另一個可選項目；
> 拒絕不影響今天的 session。我們只用原本邀請你的聯絡管道安排，不會把聯絡
> 資料複製進 pilot record；follow-up record 仍在 session 後 30 日內刪除。你是否
> 另外同意 delayed recall？

> We can also run one short recall check under the same rules in 24–48 hours.
> This is separately optional; declining does not affect today's session. We
> will arrange it through the original recruitment channel without copying
> contact details into the pilot record. The follow-up record is still deleted
> within 30 days after the session. Do you separately opt in to
> delayed recall?

不得把 immediate-session consent 推定為 delayed-recall consent，也不得因
participant 同意 follow-up 而收集未經 review 的聯絡資料。

## Blank consent record

此 record 只能填在 owner-controlled、access-limited 的位置。不要加入姓名、
簽名、email、電話、帳號、地址、精確位置或原始聲音；不要提交到 repository。

<!-- CONSENT_RECORD_START -->

```yaml
scriptVersion: m2.5-consent-v2
participantId: P__
facilitatorId: owner-controlled-id
noticeExplainedAt: YYYY-MM-DDTHH:mm:ss.sssZ
consentRecordedAt: YYYY-MM-DDTHH:mm:ss.sssZ
adultParticipantConfirmed: yes-or-no
requiredNoticeCompleted: yes-or-no
sessionChoice: consent
delayedRecallOffered: yes-or-no
delayedRecallChoice: opt-in-or-decline-or-not-offered
followUpMethodRef: owner-controlled-ref-or-none
deleteBy: YYYY-MM-DDTHH:mm:ss.sssZ
withdrawnAt: ISO-timestamp-or-none
deletionCompletedAt: ISO-timestamp-or-none
facilitatorAttestation: exact-script-read-and-no-coercion
```

<!-- CONSENT_RECORD_END -->

只有 participant 清楚同意後才建立這份 record；若拒絕或回應不明確，不建立
participant-level record 或 observation row。Participant 後續停止或
行使權利時，依 reviewed deletion procedure 處理 participant-level record，並在
受限 audit location 記錄完成時間。若資料已不可逆彙總，必須在使用前的
owner-configured script 說明可刪除範圍，不得臨時承諾無法完成的刪除。

## Evidence handoff

只有下列條件全部完成後，才可另行評估 `participantConsentReady`：

1. Owner-controlled copy 已填完所有 placeholder 並固定 exact script version。
2. Privacy reviewer 已審查資料流、告知內容、retention、access、withdrawal 與 deletion。
3. Facilitator 已用 exact script 完成 rehearsal，且不把 rehearsal 當 participant evidence。
4. Readiness evidence 指向 immutable、access-controlled review record 與 ISO timestamp。

本空白 repo template、PR merge、CI 綠燈或 owner blanket approval 均不能單獨
解除 consent 或 privacy gate。Filled participant records 永遠留在受限位置；repo
只接收通過既有 validator 的去識別 aggregate summary。
