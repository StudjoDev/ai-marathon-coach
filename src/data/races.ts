import type { Race } from "../types";

export const races: Race[] = [
  {
    id: "yongqing-2026-taipei",
    name: "長庚紀念醫院 2026 永慶盃路跑",
    date: "2026-09-20",
    dayOfWeek: "星期日",
    distanceKm: 10.5,
    category: "B",
    registrationStatus: "registered",
    city: "臺北市",
    location: "臺北市中正區總統府前凱達格蘭大道",
    venue: "總統府前凱達格蘭大道",
    reportTime: "待公告",
    startTime: "待公告",
    officialUrl: "https://eventgo.tw/event/eb2b28a7-c504-4cd2-b13c-8659e6ebc7d7",
    backupInfoUrl: "https://www.sportsnet.org.tw/m/m_schedule.php",
    sourceStatus: "public_event_page_confirmed_partial",
    goal: "穩定完賽、測試膝蓋耐受度",
    strategy: "不追個人最佳，前段保守，重點觀察 8K 後膝蓋狀態。",
    notes: [
      "目前公開頁面已確認日期、地點、10.5K 組別",
      "報到時間與開跑時間尚未在公開頁面確認"
    ]
  },
  {
    id: "banqiao-marathon-2026-half",
    name: "2026 第十屆板橋馬拉松路跑賽",
    date: "2026-11-08",
    dayOfWeek: "星期日",
    distanceKm: 21,
    category: "A",
    registrationStatus: "registered",
    city: "新北市",
    location: "新北市板橋區環河路，浮洲橋下堤外自行車道",
    venue: "浮洲橋下堤外自行車道",
    reportTime: "待公告",
    startTime: "06:30",
    officialUrl: "https://lohasnet.tw/Banqiao2026/",
    signupUrl: "https://signup.lohasnet.tw/signup/4197",
    sourceStatus: "official_event_page_confirmed",
    goal: "年度主要半馬目標賽，安全完成 21K",
    strategy: "前 5K 保守，10K 後穩定，15K 後視膝蓋狀況決定是否加速。",
    notes: [
      "21K 半馬組起跑時間為 06:30",
      "06:15 是全馬組起跑時間，不要誤用"
    ]
  },
  {
    id: "garmin-run-2026-taipei-5k",
    name: "2026 Garmin Run 馬拉松系列賽 - 臺北站",
    date: "2026-11-29",
    dayOfWeek: "星期日",
    distanceKm: 5,
    category: "C",
    registrationStatus: "registered",
    city: "臺北市",
    location: "臺北市大佳河濱公園 8 號水門行動巨蛋廣場",
    venue: "大佳河濱公園 8 號水門行動巨蛋廣場",
    reportTime: "宅配報到；5K 集合時間 06:00",
    startTime: "06:30",
    officialUrl: "https://bao-ming.com/eb/content/7032",
    sourceStatus: "official_registration_page_confirmed",
    goal: "半馬後恢復賽，可輕鬆跑或視恢復狀況測速",
    strategy: "若板橋半馬後恢復良好，可當 5K 測速；若仍疲勞，當輕鬆跑。",
    notes: [
      "報到方式為宅配報到",
      "5K 集合時間 06:00，起跑 06:30"
    ]
  },
  {
    id: "tigerrun-2026-10k",
    name: "2026 TigerRun 虎航路跑",
    date: "2026-12-12",
    dayOfWeek: "星期六",
    distanceKm: 10,
    category: "B",
    registrationStatus: "registered",
    city: "臺北市",
    location: "臺北市大佳河濱公園行動巨蛋廣場",
    venue: "大佳河濱公園行動巨蛋廣場",
    reportTime: "14:00-15:00 參賽者集合 / 領取贈品 / 寄物",
    startTime: "15:30 第一波；15:40 第二波",
    officialUrl: "https://bao-ming.com/eb/content/7034",
    sourceStatus: "official_registration_page_confirmed",
    goal: "10K 能力驗收，但不建議全力衝刺",
    strategy: "控制在 80% 努力，因隔天還有 10K，避免膝蓋累積傷害。",
    notes: [
      "10K 組限時 100 分鐘",
      "10K 分兩波起跑：15:30、15:40"
    ]
  },
  {
    id: "sportaiwan-thanksgiving-2026-10k",
    name: "2026 第二屆 SporTaiwan 感恩馬拉松",
    date: "2026-12-13",
    dayOfWeek: "星期日",
    distanceKm: 10,
    category: "C",
    registrationStatus: "registered",
    city: "新北市",
    location: "新北市三鶯陶瓷河濱公園",
    venue: "三鶯陶瓷河濱公園",
    reportTime: "郵寄報到；06:30 選手集合 / 寄物",
    startTime: "07:40",
    officialUrl: "https://sportaiwan.com/activity/activity_desc.php?activity=185",
    signupUrl: "https://sportaiwan.com/activity/activity_register.php?id=185",
    sourceStatus: "official_event_page_confirmed",
    goal: "連跑第二天，當恢復跑安全完成",
    strategy: "比前一天 TigerRun 慢 30-60 秒/km；若膝蓋痛，直接改走跑。",
    notes: [
      "官方頁面寫活動日期順延一日至 2026/12/13",
      "10K 挑戰組起跑 07:40",
      "報到方式為郵寄物資，收到包裹即完成報到，活動當天不需再報到"
    ]
  }
];
