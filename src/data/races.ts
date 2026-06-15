import type { Race } from "../types";

export const races: Race[] = [
  {
    id: "yongqing-2026-taipei-10_5k",
    name: "長庚紀念醫院 2026 永慶盃路跑 - 臺北場",
    shortName: "永慶盃",
    date: "2026-09-20",
    dayOfWeek: "星期日",
    distanceKm: 10.5,
    category: "B",
    registrationStatus: "registered",
    city: "臺北市",
    venue: "總統府前凱達格蘭大道",
    location: "臺北市中正區總統府前凱達格蘭大道",
    locationDetail: "臺北市中正區總統府前凱達格蘭大道",
    checkInType: "官方 PDF 需人工覆核",
    checkInNote: "路協賽事表已確認日期、地點與 10.5K 組別；長庚官方 PDF 連結已找到，但內容仍需人工確認。",
    assemblyTime: "未確認",
    bagDropInfo: "未確認",
    startTime: "06:00（待長庚官方 PDF 人工覆核）",
    finishLimit: "未確認",
    officialUrl: "https://cghdpt.cgmh.org.tw/files/article/09000/10304/5cf3b4de-2262-4ad5-a462-e227c2f97db1.pdf",
    backupInfoUrl: "https://www.sportsnet.org.tw/m/m_schedule.php",
    sourceStatus: "official_pdf_link_confirmed_manual_review_needed",
    sourceNote: "路協賽事表確認 2026/09/20、總統府前凱達格蘭大道、10.5K；公開索引顯示 first start 06:00，App 先保留人工覆核標記。",
    goal: "穩定完賽、測試膝蓋耐受度",
    strategy: [
      "前 3K 保守，不追個人最佳。",
      "6K 後維持穩定節奏，重點放在膝蓋反應。",
      "8K 後若膝蓋疼痛達 5/10，改為完賽模式。"
    ],
    warnings: [
      "距離是 10.5K，不是 10K。",
      "報到、寄物、關門時間尚未完成官方 PDF 人工覆核。",
      "開跑時間 06:00 需以長庚官方 PDF 最終內容為準。"
    ],
    notes: [
      "這場作為 B 賽，重點是測試耐受度，不是硬拚速度。",
      "賽前需再次確認官方 PDF 是否更新。"
    ]
  },
  {
    id: "banqiao-marathon-2026-half",
    name: "2026 第十屆板橋馬拉松路跑賽",
    shortName: "板橋半馬",
    date: "2026-11-08",
    dayOfWeek: "星期日",
    distanceKm: 21,
    category: "A",
    registrationStatus: "registered",
    city: "新北市",
    venue: "浮洲橋下堤外自行車道",
    location: "新北市板橋區環河路，浮洲橋下堤外自行車道",
    locationDetail: "新北市板橋區環河路，浮洲橋下堤外自行車道",
    checkInType: "郵寄報到",
    checkInNote: "物資將於活動前 1-2 週配達；收到包裹後請於三日內檢查內容物。",
    assemblyTime: "建議 05:30 前到場",
    bagDropInfo: "衣物保管 05:15 開始，活動結束前取回。",
    startTime: "06:30",
    finishLimit: "4 小時",
    officialUrl: "https://lohasnet.tw/Banqiao2026/",
    signupUrl: "https://signup.lohasnet.tw/signup/4197",
    sourceStatus: "official_confirmed",
    sourceNote: "官方頁已確認日期、地點、寄物時間、半馬起跑時間與 21K 限時。",
    goal: "年度主要半馬目標賽，安全完成 21K",
    strategy: [
      "前 5K 保守，先把呼吸與步頻穩住。",
      "10K 後維持穩定，不急著加速。",
      "15K 後再依膝蓋狀況決定是否加速。",
      "若膝蓋疼痛達 5/10，改為完賽模式。"
    ],
    warnings: [
      "半馬組 06:30 起跑，不要誤用全馬組 06:15。",
      "賽前務必確認物資已收到並檢查內容物。",
      "衣物保管 05:15 開始，貴重物品自行保管。"
    ],
    notes: [
      "A 賽是本週期的核心，不為前面賽事硬拚。",
      "這場以安全完成半馬為主要判斷。"
    ]
  },
  {
    id: "taoyuan-bald-cypress-2026-11k",
    name: "2026 桃園落羽松秘境馬拉松賽",
    shortName: "桃園落羽松",
    date: "2026-11-22",
    dayOfWeek: "星期日",
    distanceKm: 11,
    category: "C",
    registrationStatus: "registered",
    city: "桃園市",
    venue: "龍岡森林公園",
    location: "桃園市龍岡森林公園",
    locationDetail: "桃園市龍岡森林公園，龍慈路與龍岡路三段交接處",
    checkInType: "郵寄報到",
    checkInNote: "官方寫明本活動一律採郵寄報到，2026/11/10 前將物資配送至報名地址。收到物資後請核對組別、號碼布與晶片。",
    assemblyTime: "05:00-05:30",
    bagDropInfo: "05:00-05:30 選手報到、選手寄物",
    startTime: "06:40",
    finishLimit: "2 小時",
    officialUrl: "https://www.ctrun.com.tw/Activity?EventMain_ID=318",
    sourceStatus: "official_confirmed",
    sourceNote: "官方頁已確認活動日期 2026/11/22、地點、11K 勇腳競賽組、郵寄報到、當天集合寄物、06:40 起跑與限時 2 小時。",
    goal: "板橋半馬後恢復景觀跑，穩定完賽並觀察膝蓋狀態",
    strategy: [
      "本場不追個人最佳。",
      "前 3K 保守跑。",
      "全程維持能聊天的強度。",
      "若膝蓋疼痛達 4/10 以上，改走跑。",
      "跑後填寫膝蓋與右大腿後側疼痛紀錄。"
    ],
    warnings: [
      "本場距離 11/08 板橋半馬只有 14 天，不建議全力跑。",
      "官方距離是 11K，不是 10K。",
      "本場距離 11/29 Garmin 5K 只有 7 天，避免累積疲勞。",
      "當天 05:00-05:30 就有報到/寄物流程，建議提早抵達。"
    ],
    notes: [
      "C 賽定位是半馬後恢復景觀跑，不當作 11K 測驗賽。",
      "若右大腿後側出現刺痛或拉扯感，不再加速。"
    ]
  },
  {
    id: "garmin-run-2026-taipei-5k",
    name: "2026 Garmin Run 馬拉松系列賽 - 臺北站",
    shortName: "Garmin 5K",
    date: "2026-11-29",
    dayOfWeek: "星期日",
    distanceKm: 5,
    category: "C",
    registrationStatus: "registered",
    city: "臺北市",
    venue: "大佳河濱公園 8 號水門行動巨蛋廣場",
    location: "臺北市大佳河濱公園 8 號水門行動巨蛋廣場",
    locationDetail: "臺北市大佳河濱公園 8 號水門行動巨蛋廣場",
    checkInType: "宅配報到",
    checkInNote: "一律採宅配報到領取物資。",
    assemblyTime: "5K 集合時間 06:00",
    bagDropInfo: "活動流程寫 04:00 參賽者集合與衣物寄物，寄物時間 04:00-09:30。",
    startTime: "06:30",
    finishLimit: "1.5 小時",
    officialUrl: "https://bao-ming.com/eb/content/7032",
    sourceStatus: "official_confirmed",
    sourceNote: "官方報名頁已確認日期、地點、宅配報到、5K 集合時間、起跑時間與限時。",
    goal: "半馬後恢復賽，可輕鬆跑或視恢復狀況測速",
    strategy: [
      "若板橋半馬後恢復良好，可當 5K 測速。",
      "若疲勞未消，當輕鬆跑。",
      "不為了 5K 成績影響後續恢復。"
    ],
    warnings: [
      "這場在板橋半馬後 3 週，強度要依恢復狀況調整。",
      "若膝蓋仍有疼痛，當作輕鬆跑或不安排測速。"
    ],
    notes: [
      "C 賽不影響主要訓練安排。",
      "起跑時間為 5K 組 06:30。"
    ]
  },
  {
    id: "tigerrun-2026-10k",
    name: "2026 TigerRun 虎航路跑",
    shortName: "TigerRun",
    date: "2026-12-12",
    dayOfWeek: "星期六",
    distanceKm: 10,
    category: "B",
    registrationStatus: "registered",
    city: "臺北市",
    venue: "大佳河濱公園行動巨蛋廣場",
    location: "臺北市大佳河濱公園行動巨蛋廣場",
    locationDetail: "臺北市大佳河濱公園行動巨蛋廣場",
    checkInType: "郵寄報到",
    checkInNote: "本國籍參賽者一律郵寄報到，收到報到包裹即完成報到，活動當天不用再次報到。",
    assemblyTime: "14:00-15:00",
    bagDropInfo: "14:00-15:00 參賽者集合、領取贈品、寄物；寄物服務開放 14:00-19:00。",
    startTime: "15:30 第一波；15:40 第二波",
    finishLimit: "100 分鐘",
    officialUrl: "https://bao-ming.com/eb/content/7034",
    sourceStatus: "official_confirmed",
    sourceNote: "官方報名頁已確認日期、會場、郵寄報到、集合寄物時間、10K 兩波起跑時間與限時。",
    goal: "10K 能力驗收，以穩定完成為主，不把全力衝刺列為目標",
    strategy: [
      "控制在 80% 努力。",
      "前 3K 保守，不被現場氣氛拉太快。",
      "保留腿部狀態，避免影響隔天 10K。"
    ],
    warnings: [
      "隔天還有 SporTaiwan 10K，本場不建議全力跑。",
      "這是高負荷連賽週，跑後要立刻記錄膝蓋疼痛分數。"
    ],
    notes: [
      "B 賽用來驗收 10K 狀態，但不能跑到爆。",
      "10K 分兩波起跑，實際波次以號碼布或官方通知為準。"
    ]
  },
  {
    id: "sportaiwan-thanksgiving-2026-10k",
    name: "2026 第二屆 SporTaiwan 感恩馬拉松",
    shortName: "SporTaiwan 感恩馬",
    date: "2026-12-13",
    dayOfWeek: "星期日",
    distanceKm: 10,
    category: "C",
    registrationStatus: "registered",
    city: "新北市",
    venue: "三鶯陶瓷河濱公園",
    location: "新北市三鶯陶瓷河濱公園",
    locationDetail: "新北市三鶯陶瓷河濱公園，距離三鶯捷運站步行約 7 分鐘、三鶯火車站步行約 5 分鐘。",
    checkInType: "郵寄報到",
    checkInNote: "一律採郵寄方式報到，收到郵寄報到包裹代表已完成報到手續，活動當天不需再報到。",
    assemblyTime: "06:30",
    bagDropInfo: "活動流程列 06:30 選手集合/寄物；建議賽前再確認寄物安排，避免攜帶大件行李。",
    startTime: "07:40",
    finishLimit: "2 小時",
    officialUrl: "https://sportaiwan.com/activity/activity_desc.php?activity=185",
    signupUrl: "https://sportaiwan.com/activity/activity_register.php?id=185",
    sourceStatus: "official_confirmed_with_warning",
    sourceNote: "官方頁已確認日期、地點、郵寄報到、10K 起跑時間與 2 小時限時；寄物安排建議賽前再確認。",
    goal: "連跑第二天，當恢復跑安全完成",
    strategy: [
      "比前一天 TigerRun 慢 30-60 秒/km。",
      "不要硬追速度。",
      "若膝蓋疼痛達 4/10 以上，建議改走跑或結束當次比賽。",
      "跑後記錄疼痛分數與疲勞感。"
    ],
    warnings: [
      "前一天已跑 TigerRun 10K，本場不可硬拚。",
      "寄物安排需賽前再次確認，避免攜帶大件行李。",
      "若早上起床膝蓋痛達 5/10，建議改為走跑或不出賽。"
    ],
    notes: [
      "這場是 C 賽，定位是恢復跑。",
      "官方頁顯示 10K 挑戰組 07:40 起跑。"
    ]
  }
];
