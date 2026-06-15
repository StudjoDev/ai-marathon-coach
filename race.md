以下整理以「**學員已報名成功**」為前提；報名狀態欄位可直接設為 `registered`。我建議 App 不要只放「報到時間」，要拆成：

* **報到方式**：宅配 / 郵寄 / 現場報到
* **集合時間**：當天建議到場或官方集合時間
* **寄物資訊**：有無寄物、開放時間
* **開跑時間**：該學員報名組別的實際起跑時間

這樣跑者在手機上才不會搞混。

---

# 賽事資訊總表

| 日期            | 賽事                         |    距離 | 地點 / 會場               | 報到 / 集合 / 寄物                                                 | 開跑時間                                   | 官方來源狀態                                                                    |
| ------------- | -------------------------- | ----: | --------------------- | ------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------- |
| 2026/09/20（日） | 長庚紀念醫院 2026 永慶盃路跑－臺北場      | 10.5K | 臺北市中正區總統府前凱達格蘭大道      | 官方 PDF 連結已找到，但目前工具讀取 PDF 逾時；App 先標「需人工覆核」                    | 公開索引顯示 First start 06:00；建議仍以長庚 PDF 為主 | 長庚官方 PDF 入口由路協熱門賽事連到 cghdpt.cgmh.org.tw；路協也列出日期、地點、10.5KM/約3KM ([體育網][1]) |
| 2026/11/08（日） | 2026 第十屆板橋馬拉松路跑賽           |   21K | 新北市板橋區浮洲橋下堤外自行車道      | 一律郵寄報到；物資活動前 1–2 週寄達；當日不開放現場報到；衣物保管 05:15 開始                 | 06:30 半馬組起跑                            | 官方報名頁已完整確認 ([樂活報名網][2])                                                   |
| 2026/11/29（日） | 2026 Garmin Run 馬拉松系列賽－臺北站 |    5K | 臺北市大佳河濱公園 8 號水門行動巨蛋廣場 | 一律宅配報到；5K 集合 06:00；活動流程寫 04:00 起參賽者集合與寄物，寄物 04:00–09:30      | 06:30 5K 起跑                            | 官方報名頁已完整確認 ([寶明網][3])                                                     |
| 2026/12/12（六） | 2026 TigerRun 虎航路跑         |   10K | 臺北市大佳河濱公園行動巨蛋廣場       | 本國籍參賽者郵寄報到；14:00–15:00 參賽者集合、領取贈品、寄物；寄物服務 14:00–19:00        | 10K 分兩波：15:30 / 15:40                  | 官方報名頁已完整確認 ([寶明網][4])                                                     |
| 2026/12/13（日） | 2026 第二屆 SporTaiwan 感恩馬拉松  |   10K | 新北市三鶯陶瓷河濱公園           | 郵寄報到；06:30 選手集合 / 寄物；但注意事項又寫「活動不提供寄物」，App 要標示為官方資訊矛盾，賽前需再次確認 | 07:40 挑戰組 10K 起跑                       | 官方頁已確認，但寄物資訊有內文衝突 ([SPORTAIWN 專業運動共享平台][5])                               |

---

# 需要特別標示的兩個風險

## 1. 永慶盃臺北場：官方 PDF 需人工覆核

路協熱門賽事頁有連到長庚官方 PDF，且路協賽事行事曆確認 9/20、凱達格蘭大道、10.5KM/約3KM。公開索引頁顯示 First start 06:00，但我不建議直接把第三方索引當成最終官方資料。App 裡可以先寫：

> 開跑時間：06:00（待長庚官方 PDF 人工覆核）

這比寫「待公告」更精準，因為不是沒有公告，而是目前 PDF 內容需要人工確認。

---

## 2. SporTaiwan 感恩馬：寄物資訊矛盾

同一個官方頁面：

* 活動流程寫：06:30 選手集合 / 寄物
* 注意事項寫：活動不提供寄物

所以 App 應該顯示：

> 寄物：官方資訊不一致，賽前請再次確認；建議當天不要攜帶大件物品。

這是 AI 教練 App 應該主動提醒的地方。

---

# Codex Prompt：更新賽事資料

```md
請更新 ai-marathon-coach 專案的賽事資料模組。

目標：
所有賽事都已確認報名成功，請將 registrationStatus 設為 "registered"。
資料需支援手機 App 清楚顯示：
- 報到方式
- 集合時間
- 寄物資訊
- 開跑時間
- 官方來源
- 資訊是否需人工覆核
- 是否有官方資訊矛盾

請新增或更新檔案：

src/data/races.ts

請使用以下 TypeScript 型別：

export type RaceCategory = "A" | "B" | "C";
export type RegistrationStatus = "registered" | "not_registered" | "waitlist" | "unknown";
export type SourceStatus =
  | "official_confirmed"
  | "official_confirmed_with_warning"
  | "official_pdf_link_confirmed_manual_review_needed";

export interface Race {
  id: string;
  name: string;
  shortName: string;
  date: string;
  dayOfWeek: string;
  distanceKm: number;
  category: RaceCategory;
  registrationStatus: RegistrationStatus;

  city: string;
  venue: string;
  locationDetail: string;

  checkInType: string;
  checkInNote: string;
  assemblyTime: string;
  bagDropInfo: string;
  startTime: string;
  finishLimit: string;

  goal: string;
  strategy: string[];
  warnings: string[];

  officialUrl: string;
  sourceStatus: SourceStatus;
  sourceNote: string;
}

請建立 races array，資料如下：

1. 長庚紀念醫院 2026 永慶盃路跑－臺北場
- id: "yongqing-2026-taipei-10_5k"
- shortName: "永慶盃"
- date: "2026-09-20"
- dayOfWeek: "星期日"
- distanceKm: 10.5
- category: "B"
- registrationStatus: "registered"
- city: "臺北市"
- venue: "總統府前凱達格蘭大道"
- locationDetail: "臺北市中正區總統府前凱達格蘭大道"
- checkInType: "官方 PDF 需人工覆核"
- checkInNote: "路協熱門賽事頁已連到長庚官方 PDF，但目前 PDF 內容需人工確認。"
- assemblyTime: "待人工覆核"
- bagDropInfo: "待人工覆核"
- startTime: "06:00（待長庚官方 PDF 人工覆核）"
- finishLimit: "待人工覆核"
- goal: "穩定完賽、測試膝蓋耐受度"
- strategy:
  - "前 3K 保守，不追配速"
  - "6K 後觀察膝蓋狀況"
  - "若 8K 前疼痛超過 5 分，改為完賽模式"
- warnings:
  - "本場為 10.5K，不是 10K"
  - "報到、寄物、關門時間需以長庚官方 PDF 人工覆核"
- officialUrl: "https://cghdpt.cgmh.org.tw/files/article/09000/10304/5cf3b4de-2262-4ad5-a462-e227c2f97db1.pdf"
- sourceStatus: "official_pdf_link_confirmed_manual_review_needed"
- sourceNote: "路協熱門賽事頁指向長庚官方 PDF；目前 App 先保留人工覆核標記。"

2. 2026 第十屆板橋馬拉松路跑賽
- id: "banqiao-marathon-2026-half"
- shortName: "板橋半馬"
- date: "2026-11-08"
- dayOfWeek: "星期日"
- distanceKm: 21
- category: "A"
- registrationStatus: "registered"
- city: "新北市"
- venue: "浮洲橋下堤外自行車道"
- locationDetail: "新北市板橋區環河路，浮洲橋下堤外自行車道"
- checkInType: "郵寄報到"
- checkInNote: "活動前 1–2 週寄達物資；收到物資即完成報到，活動當日不開放現場報到。"
- assemblyTime: "建議 05:30 前到場"
- bagDropInfo: "衣物保管 05:15 開始，活動結束前取回。"
- startTime: "06:30"
- finishLimit: "4 小時"
- goal: "年度主要半馬目標賽，安全完成 21K"
- strategy:
  - "前 5K 保守"
  - "10K 後穩定"
  - "15K 後視膝蓋狀況決定是否加速"
  - "若膝蓋痛超過 5 分，改為完賽模式"
- warnings:
  - "半馬組 06:30 起跑，不要誤看成全馬 06:15"
  - "活動當日不開放現場報到"
- officialUrl: "https://lohasnet.tw/Banqiao2026/"
- sourceStatus: "official_confirmed"
- sourceNote: "官方報名頁已確認日期、地點、報到方式、寄物時間與半馬起跑時間。"

3. 2026 Garmin Run 馬拉松系列賽－臺北站
- id: "garmin-run-2026-taipei-5k"
- shortName: "Garmin 5K"
- date: "2026-11-29"
- dayOfWeek: "星期日"
- distanceKm: 5
- category: "C"
- registrationStatus: "registered"
- city: "臺北市"
- venue: "大佳河濱公園 8 號水門行動巨蛋廣場"
- locationDetail: "臺北市大佳河濱公園 8 號水門行動巨蛋廣場"
- checkInType: "宅配報到"
- checkInNote: "一律宅配報到領取物資。"
- assemblyTime: "5K 集合時間 06:00"
- bagDropInfo: "活動流程寫 04:00 參賽者集合與衣物寄物，寄物時間 04:00–09:30。"
- startTime: "06:30"
- finishLimit: "1.5 小時"
- goal: "半馬後恢復賽，可輕鬆跑或視恢復狀況測速"
- strategy:
  - "若板橋半馬後恢復良好，可當 5K 測速"
  - "若仍疲勞，當輕鬆跑"
  - "不要為了 5K 影響 12 月連續賽"
- warnings:
  - "這場在板橋半馬後 3 週，需依恢復狀況調整強度"
- officialUrl: "https://bao-ming.com/eb/content/7032"
- sourceStatus: "official_confirmed"
- sourceNote: "官方報名頁已確認日期、地點、宅配報到、5K 集合與起跑時間。"

4. 2026 TigerRun 虎航路跑
- id: "tigerrun-2026-10k"
- shortName: "TigerRun"
- date: "2026-12-12"
- dayOfWeek: "星期六"
- distanceKm: 10
- category: "B"
- registrationStatus: "registered"
- city: "臺北市"
- venue: "大佳河濱公園行動巨蛋廣場"
- locationDetail: "臺北市大佳河濱公園行動巨蛋廣場"
- checkInType: "郵寄報到"
- checkInNote: "本國籍參賽者一律郵寄報到，收到報到包裹即完成報到，活動當天不用再次報到。"
- assemblyTime: "14:00–15:00"
- bagDropInfo: "14:00–15:00 參賽者集合、領取贈品、寄物；寄物服務開放 14:00–19:00。"
- startTime: "15:30 第一波；15:40 第二波"
- finishLimit: "100 分鐘"
- goal: "10K 能力驗收，但不建議全力爆衝"
- strategy:
  - "控制在 80% 努力"
  - "前 3K 保守"
  - "隔天還有 10K，避免膝蓋累積傷害"
- warnings:
  - "隔天還有 SporTaiwan 10K，本場不建議全力跑"
  - "10K 分兩波起跑，需確認自己的波次"
- officialUrl: "https://bao-ming.com/eb/content/7034"
- sourceStatus: "official_confirmed"
- sourceNote: "官方報名頁已確認日期、會場、報到方式、集合寄物時間、10K 兩波起跑時間。"

5. 2026 第二屆 SporTaiwan 感恩馬拉松
- id: "sportaiwan-thanksgiving-2026-10k"
- shortName: "SporTaiwan 感恩馬"
- date: "2026-12-13"
- dayOfWeek: "星期日"
- distanceKm: 10
- category: "C"
- registrationStatus: "registered"
- city: "新北市"
- venue: "三鶯陶瓷河濱公園"
- locationDetail: "新北市三鶯陶瓷河濱公園，距離三鶯捷運站步行約 7 分鐘，鶯歌火車站約 5 分鐘。"
- checkInType: "郵寄報到"
- checkInNote: "官方寫一律郵寄報到，收到郵寄報到包裹即完成報到，活動當天不需再報到。"
- assemblyTime: "06:30"
- bagDropInfo: "官方資訊矛盾：流程寫 06:30 選手集合/寄物，但注意事項寫活動不提供寄物。建議賽前再次確認，並避免攜帶大件行李。"
- startTime: "07:40"
- finishLimit: "2 小時"
- goal: "連跑第二天，當恢復跑安全完成"
- strategy:
  - "比前一天 TigerRun 慢 30–60 秒/km"
  - "不拼成績"
  - "若膝蓋痛，直接改走跑"
  - "重點是安全完成，不影響後續訓練"
- warnings:
  - "前一天已跑 TigerRun 10K，本場不可硬拼"
  - "官方頁面寄物資訊前後不一致，賽前需再次確認"
- officialUrl: "https://sportaiwan.com/activity/activity_desc.php?activity=185"
- sourceStatus: "official_confirmed_with_warning"
- sourceNote: "官方頁已確認日期、地點、郵寄報到、10K 起跑時間；但寄物資訊有內文矛盾。"
```

---

# App UI 建議

賽事卡片不要只顯示「報到時間」。建議每張卡片顯示：

```txt
已報名
11/08 週日
板橋半馬 21K
A 賽｜年度目標

地點：
浮洲橋下堤外自行車道

報到：
郵寄報到，當天不需報到

集合建議：
05:30 前到場

寄物：
05:15 開始

開跑：
06:30

本場策略：
前 5K 保守，15K 後視膝蓋狀況決定是否加速
```

對這位學員來說，最重要的是把每場賽事從「時間表」變成「行動提醒」。尤其 12/12 + 12/13 連續兩天 10K，App 應該主動標成 **高負荷連賽週**。

[1]: https://www.sportsnet.org.tw/race.php "中華民國路跑協會"
[2]: https://lohasnet.tw/Banqiao2026/ "樂活報名網 - 2026第十屆板橋馬拉松路跑賽(秋季普查)"
[3]: https://bao-ming.com/eb/content/7032 "台灣國際航電股份有限公司 - 2026 Garmin Run 馬拉松系列賽 - 臺北站"
[4]: https://bao-ming.com/eb/content/7034 "伊貝特報名網 - 2026 tigerrun"
[5]: https://sportaiwan.com/activity/activity_desc.php?activity=185 "SPORTAIWN 專業運動共享平台"
