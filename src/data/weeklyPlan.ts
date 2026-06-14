import type { WeeklyPlanDay } from "../types";

export const weeklyPlan: WeeklyPlanDay[] = [
  {
    date: "2026-06-14",
    dayLabel: "週日",
    displayDate: "6/14",
    title: "恢復日",
    type: "recovery",
    purpose: "讓 11K 後的膝蓋與大腿後側降載。",
    items: ["散步 30~60 分鐘", "熱敷膝蓋", "大腿後側伸展", "不跑步"],
    attention: "只做恢復，不用補跑。"
  },
  {
    date: "2026-06-15",
    dayLabel: "週一",
    displayDate: "6/15",
    title: "休息日",
    type: "rest",
    purpose: "觀察跑後 48 小時的疼痛反應。",
    items: ["可選超慢跑 20 分鐘", "若膝蓋痛，完全休息"],
    attention: "有痛就休，不用硬撐。"
  },
  {
    date: "2026-06-16",
    dayLabel: "週二",
    displayDate: "6/16",
    title: "輕鬆跑 4K",
    type: "easy",
    purpose: "維持跑感，不累積額外壓力。",
    items: ["配速 7'50~8'30/km", "能聊天、不喘", "膝蓋有感覺立刻改走路"],
    attention: "舒適度比配速重要。"
  },
  {
    date: "2026-06-17",
    dayLabel: "週三",
    displayDate: "6/17",
    title: "臀肌訓練",
    type: "strength",
    purpose: "補強屁股外側與髖部穩定，降低膝蓋負擔。",
    items: ["蚌殼開合 3x15", "側躺抬腿 3x15", "單腳橋式 3x12", "彈力帶側走 3x20 步"],
    attention: "動作慢，感覺屁股外側出力。"
  },
  {
    date: "2026-06-18",
    dayLabel: "週四",
    displayDate: "6/18",
    title: "輕鬆跑 5K",
    type: "easy",
    purpose: "用低強度確認膝蓋反應。",
    items: ["配速 7'50~8'30/km", "不追速度", "只看舒適度"],
    attention: "任何不適都可以縮短。"
  },
  {
    date: "2026-06-19",
    dayLabel: "週五",
    displayDate: "6/19",
    title: "完全休息",
    type: "rest",
    purpose: "為週六長跑保留恢復空間。",
    items: ["睡眠優先", "避免額外腿部訓練"],
    attention: "今天的任務是恢復。"
  },
  {
    date: "2026-06-20",
    dayLabel: "週六",
    displayDate: "6/20",
    title: "長跑 9K",
    type: "long",
    purpose: "測試 9K 後膝蓋是否穩定。",
    items: ["配速 7'50~8'30/km", "能聊天", "不追配速", "跑完膝蓋不痛為成功"],
    attention: "9K 是本週上限，不加碼。"
  }
];
