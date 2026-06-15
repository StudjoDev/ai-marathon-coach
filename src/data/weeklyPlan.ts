import type { WeeklyPlanAdjustment, WeeklyPlanDay } from "../types";

export const weeklyPlanAdjustment: WeeklyPlanAdjustment = {
  isAdjusted: true,
  adjustedAt: "2026-06-14",
  reason:
    "學員希望週二與週三課表對調，並將本週長跑提前到週五；因跑後膝蓋痛與右大腿後側酸痛，週四取消 Easy Run 改為恢復日。",
  changes: [
    "週二由 Easy Run 4K 改為臀肌訓練",
    "週三由臀肌訓練改為 Easy Run 4K",
    "週四由 Easy Run 5K 改為長跑前恢復日",
    "週五由休息日改為 Long Run 8-9K",
    "週六由 Long Run 9K 改為跑後恢復日"
  ]
};

export const weeklyPlan: WeeklyPlanDay[] = [
  {
    date: "2026-06-14",
    dayLabel: "週日",
    displayDate: "6/14",
    title: "恢復日",
    type: "recovery",
    purpose: "吸收 6/13 的 11K 長跑刺激，降低膝蓋與腿後側負荷。",
    items: ["散步 30-60 分鐘", "熱敷膝蓋", "大腿後側輕伸展", "不跑步"],
    attention: "若膝蓋走路仍痛，今天只做日常活動。"
  },
  {
    date: "2026-06-15",
    dayLabel: "週一",
    displayDate: "6/15",
    title: "休息日",
    type: "rest",
    purpose: "讓膝蓋、臀部與右大腿後側恢復。",
    items: ["完全休息", "可選擇輕鬆散步 20-30 分鐘", "不做高強度肌力"],
    attention: "若右大腿後側有刺痛或拉扯感，避免伸展過度。"
  },
  {
    date: "2026-06-16",
    dayLabel: "週二",
    displayDate: "6/16",
    title: "臀肌與穩定訓練",
    type: "strength",
    purpose: "週二與週三對調後，週二改為臀肌訓練日；強化臀中肌與骨盆穩定，降低膝蓋代償。",
    items: ["蚌殼開合 3 x 15", "側躺抬腿 3 x 15", "單腳橋式 3 x 12", "Monster Walk 3 x 20 步"],
    attention: "動作慢、穩，不要做到腿後側抽痛。"
  },
  {
    date: "2026-06-17",
    dayLabel: "週三",
    displayDate: "6/17",
    title: "Easy Run 4K",
    type: "easy_run",
    distanceKm: 4,
    targetPace: "7'50-8'40/km",
    purpose: "恢復跑感，維持跑步節奏，不製造額外疲勞。",
    items: ["輕鬆跑 4K", "能聊天、不喘", "不追配速", "若膝蓋有感覺，立刻降速或改走路"],
    attention: "這不是速度課，也不是補課。"
  },
  {
    date: "2026-06-18",
    dayLabel: "週四",
    displayDate: "6/18",
    title: "長跑前恢復日",
    type: "pre_long_run_recovery",
    purpose: "因週五改長跑，週四取消原本 Easy Run，保留體力給週五主課表。",
    items: ["散步 20-30 分鐘", "膝蓋與腿後側輕鬆活動", "早睡", "不跑 5K"],
    attention: "不要做深蹲、硬舉、衝刺或高強度登階。"
  },
  {
    date: "2026-06-19",
    dayLabel: "週五",
    displayDate: "6/19",
    title: "Long Run 8-9K",
    type: "long",
    distanceKm: 9,
    fallbackDistanceKm: 8,
    targetPace: "7'50-8'40/km",
    purpose: "本週主課表；用較安全的距離驗證膝蓋耐受度。",
    items: ["目標 9K Easy", "前 2K 放慢", "全程能聊天", "不追配速", "跑後記錄膝蓋與右大腿後側疼痛分數"],
    attention: "若膝蓋疼痛達 4/10 以上，立即停止跑步改走路；若 8K 前膝蓋開始痛，本週不算升級成功。",
    successCriteria: ["8-9K 完成後膝蓋疼痛 <= 2/10", "隔天上下樓梯正常", "右大腿後側沒有刺痛或拉扯感"]
  },
  {
    date: "2026-06-20",
    dayLabel: "週六",
    displayDate: "6/20",
    title: "跑後恢復日",
    type: "post_long_run_recovery",
    purpose: "週五已完成長跑，週六改為恢復日。",
    items: ["散步 30-45 分鐘", "熱敷或輕鬆活動", "填寫疼痛追蹤", "不補跑"],
    attention: "若膝蓋或腿後側疼痛超過 48 小時，下週不增加距離。"
  }
];
