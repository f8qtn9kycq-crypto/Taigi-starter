# 台語起步 lesson roadmap

## 目的

這份 roadmap 是內容製作與教師審核的順序，不是已完成課程數量。目前
production 已部署第 1–18 課。第 2 至 18 課仍保留 teacher review pending，並以 owner risk acceptance、教育部原始未修改
音檔、授權 attribution 與 390×844 mobile evidence 作為 playable handoff。第
19 至 24 課仍是 roadmap。

## 路線

| 課次 | 主題 | 學習任務 | 目前狀態 |
| --- | --- | --- | --- |
| 1 | 相借問 | 聽懂並說出一個日常關心的問候 | 可體驗 prototype |
| 2 | 阮兜的人 | 用家庭詞介紹自己的家人 | 可體驗 prototype；teacher review pending |
| 3 | 一二三 | 辨認並說出一、二、三 | 可體驗 prototype；teacher review pending |
| 4 | 食飯佮飲水 | 在吃飯情境中表達需要與關心 | 可體驗 prototype；teacher review pending |
| 5 | 今仔日的日常 | 說出簡單的日常活動 | 可體驗 prototype；teacher review pending |
| 6 | 天氣佮感受 | 用短句描述天氣與身體感受 | 可體驗 prototype；teacher review pending |
| 7 | 去佗位 | 問路、回答方向與目的地 | 可體驗 prototype；teacher review pending |
| 8 | 買物件 | 在市場或商店詢問物品與數量 | 可體驗 prototype；teacher review pending |
| 9 | 厝邊佮社區 | 認識生活周邊的人與地方 | 可體驗 prototype；teacher review pending |
| 10 | 相招來 | 邀請、接受或婉拒一起做事 | 可體驗 prototype；teacher review pending |
| 11 | 昨昏佮明仔載 | 用簡單時間詞談過去與接下來 | 可體驗 prototype；teacher review pending |
| 12 | 我的生活對話 | 把前面學過的內容串成短對話 | 可體驗 prototype；teacher review pending |

## 第二段：A1 生活對話（第 13–24 課）

這一段沿用第一段的 Hear → See → Say → Recall → Use 節奏，但學習任務從
「認識詞」往前走一步，改成用少量詞彙完成短句、自我表達和簡短互動。每課
仍然只放一個主要生活任務，避免把初學者一次推進太多文法或自由對話。

| 課次 | 主題 | 學習任務 | 目前狀態 |
| --- | --- | --- | --- |
| 13 | 我是啥人 | 用名字與基本身分完成自我介紹 | 可體驗 prototype；teacher review pending |
| 14 | 讀冊佮頭路 | 說出自己的學習或工作情境 | 可體驗 prototype；teacher review pending |
| 15 | 身體袂爽快 | 表達身體不舒服並尋求協助 | 可體驗 prototype；teacher review pending |
| 16 | 出門坐車 | 說明出門方式與目的地 | handoff ready；teacher review pending |
| 17 | 餐廳點菜 | 在餐廳表達想吃的東西與需求 | handoff ready；teacher review pending |
| 18 | 買物件佮問價 | 詢問數量、價格與是否要買 | handoff ready；teacher review pending |
| 19 | 時間佮安排 | 說出時間和一個簡單安排 | roadmap，尚未產製 package |
| 20 | 問路佮求助 | 問路、聽懂簡短方向並請人幫忙 | roadmap，尚未產製 package |
| 21 | 我愛啥物 | 表達喜歡、不喜歡和簡單選擇 | roadmap，尚未產製 package |
| 22 | 以前做過啥 | 用簡單時間詞回顧做過的事 | roadmap，尚未產製 package |
| 23 | 明仔載欲做啥 | 說出明天或近期的一個計畫 | roadmap，尚未產製 package |
| 24 | 我的生活對話 II | 把 A1 詞彙串成一段可完成的生活對話 | roadmap，尚未產製 package |

### 第二段的製作順序

1. 13–15：先建立「我是誰、我在做什麼、我感覺如何」的自我表達。
2. 16–18：再進入出門、吃飯、買物件等高頻服務情境。
3. 19–21：加入時間安排、問問題和個人偏好，讓互動不只停在背詞。
4. 22–24：最後才處理過去、未來和總結對話，並保留教師可控的句型範圍。

這個順序延續同一條產品思路：先用 Busuu 式的教學節奏建立可完成的小任務，
用 Duolingo 式的低摩擦日常回訪承接練習，再用真實語料和教師治理確保台語
表達不變成只會套模板的 AI 對話。第二段仍然不等於 React 已上線課程。

## Package 交付規則

每個 package 必須包含：

- 雙語標題、摘要與學習目標。
- Hear → See → Say → Recall → Use 的教學節奏草案。
- 漢字、台羅、可選白話字、意思與文化註記。
- 每個詞條的教育部 canonical URL、授權與 speaker 欄位。
- 教師審核狀態與待確認事項。
- 音檔狀態；有官方原始音檔時必須保留 local path、原始 URL、授權與 `isUnmodifiedOriginal`，沒有時才明確標為尚未加入。

每次新增或修改 package 都要先跑 `npm run lessons:validate`；`npm test` 也會固定執行同一個 gate。缺 POJ、音檔不存在、音檔不是可辨識的原始 MP3、官方 URL／授權／handoff 不一致，或 catalog scope／Lesson 1–12 重複檢查失敗，都必須阻擋 release。

## 與產品執行路徑的界線

`app/data/lesson-packages.ts` 是內容製作資料；完成音檔授權與 mobile lesson
flow 驗證後，package 可透過 handoff 轉成 playable lesson。若教師審核尚未
完成，必須同時保留 pending 狀態與明確的 owner risk acceptance，不能把它誤
寫成 teacher-approved。
