import type { Race, RaceCategory } from "../types";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(value: string | Date) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getUpcomingRaces(raceList: Race[], today: string | Date = new Date()) {
  const todayDate = toDateOnly(today);

  return [...raceList]
    .filter((race) => toDateOnly(race.date).getTime() >= todayDate.getTime())
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getNextRace(raceList: Race[], today: string | Date = new Date()) {
  return getUpcomingRaces(raceList, today)[0];
}

export function getDaysUntilRace(date: string, today: string | Date = new Date()) {
  const raceDate = toDateOnly(date);
  const todayDate = toDateOnly(today);
  return Math.ceil((raceDate.getTime() - todayDate.getTime()) / ONE_DAY_MS);
}

export function getRacePriorityLabel(category: RaceCategory) {
  const labels: Record<RaceCategory, string> = {
    A: "A 賽｜年度目標",
    B: "B 賽｜測驗賽",
    C: "C 賽｜輔助賽"
  };

  return labels[category];
}

export function getRaceCategoryStyle(category: RaceCategory) {
  const styles: Record<RaceCategory, string> = {
    A: "bg-primary text-white border-primary",
    B: "bg-success/10 text-success border-success/30",
    C: "bg-[#F0ECF7] text-[#6B5A78] border-[#DCD4E8]"
  };

  return styles[category];
}

export function getRaceStrategyById(raceId: string) {
  const strategies: Record<string, string[]> = {
    "yongqing-2026": [
      "不追個人最佳",
      "前 3K 放慢，先確認身體狀態",
      "觀察膝蓋是否在 8K 前後出現疼痛",
      "完賽後記錄疼痛分數"
    ],
    "banqiao-half-2026": [
      "年度主要目標賽",
      "前 5K 保守",
      "10K 後穩定",
      "15K 後再決定是否加速",
      "若膝蓋痛超過 5 分，改為完賽模式"
    ],
    "garmin-run-2026": [
      "半馬後恢復賽",
      "若恢復良好可測 5K",
      "若疲勞未消，不追速度"
    ],
    "tigerrun-2026": [
      "隔天還有 SporTaiwan",
      "不建議全力",
      "控制在 80% 努力"
    ],
    "sportaiwan-2026": [
      "前一天已跑 10K",
      "當恢復跑",
      "配速比虎航慢 30~60 秒/km",
      "若膝蓋痛，直接降速或改走跑"
    ]
  };

  return strategies[raceId] ?? [];
}

export function formatRaceDate(date: string) {
  return date.replace(/-/g, "/");
}

export function formatRaceDistance(distanceKm: number) {
  return `${Number.isInteger(distanceKm) ? distanceKm.toFixed(0) : distanceKm.toFixed(1)}K`;
}
