# 生活優先課程路徑

## 目標

初學者先學會最常在真實生活中使用的短任務，再進入家庭、社區、工作與
綜合對話。每一課都維持 Hear → See → Say → Recall → Use 五段節奏；每個
詞條都必須同時有台羅、POJ、教育部 canonical source、CC BY-ND 授權與未修改
官方原始 MP3。

## Learner-facing 順序

目前 package 的 `number` 是穩定內容識別；`pathOrder` 是學習者看到的推薦
順序。這樣可以改善新手入口，不破壞既有 device-local progress 的 lesson id。

| Path | 內容 package | 真實生活任務 |
| --- | --- | --- |
| 1 | 相借問 | 先完成一個自然問候 |
| 2 | 請問、多謝、失禮 | 禮貌問人、道謝、道歉 |
| 3 | 求助佮講較慢 | 聽不懂時請人幫忙、放慢 |
| 4 | 我是啥人 | 說自己的身分、名字 |
| 5 | 一二三 | 聽懂數字並開始處理數量 |
| 6 | 食飯佮飲水 | 表達吃飯、喝水與日常需要 |
| 7 | 餐廳點菜 | 在餐廳表達想吃的東西 |
| 8 | 買物件 | 認識購物物品與金錢 |
| 9 | 買物件佮問價 | 詢問數量、價格與是否購買 |
| 10 | 去佗位 | 問目的地與方向 |
| 11 | 出門坐車 | 搭車、辨認車站 |
| 12 | 昨昏佮明仔載 | 說昨天、今天、明天與安排 |
| 13 | 身體袂爽快 | 表達不舒服與基本照護需求 |
| 14 | 天氣佮感受 | 描述當下環境與感覺 |
| 15 | 阮兜的人 | 談家人與住家 |
| 16 | 厝邊佮社區 | 認識身邊的人與地方 |
| 17 | 相招來 | 邀請別人一起行動 |
| 18 | 今仔日的日常 | 說一件日常活動 |
| 19 | 讀冊佮頭路 | 談學校與工作 |
| 20 | 我的生活對話 | 把已學內容放進短對話 |

## 仍要補的最高優先內容

目前已補上請問、多謝、失禮、幫助與慢慢仔。下一批優先是廁所／所在、電話
與聯絡、緊急求助與住宿；這些必須先完成來源、授權、POJ 和原始音檔核對，
不能用自行編造的音檔或未核實 POJ 先填上去。完整覆蓋判斷見
[`docs/lesson-coverage-plan.md`](./lesson-coverage-plan.md)。

## Gate

新增或改動 path order 必須通過：

- `npm run lessons:validate`
- `npm test`
- `npm run lint`
- 每詞台羅／POJ／MOE source／license／original MP3 provenance
- 390×844 的五段流程人工 QA
- teacher review pending 時的明確 owner risk acceptance

這條路徑調整與 Say completion gate、Use transfer task、B08 mobile human review
分開交付；它們是後續教學互動 PR，不混入內容 provenance 修復。
