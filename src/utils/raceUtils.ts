import type { Race, RaceCategory, RaceRegistrationStatus, RaceSourceStatus } from "../types";

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

export function getRaceRegistrationLabel(status: RaceRegistrationStatus) {
  const labels: Record<RaceRegistrationStatus, string> = {
    registered: "已報名",
    not_registered: "未報名",
    waitlist: "候補中",
    unknown: "狀態待確認"
  };

  return labels[status];
}

export function getRaceSourceStatusLabel(status: RaceSourceStatus) {
  const labels: Record<RaceSourceStatus, string> = {
    official_confirmed: "官方已確認",
    official_confirmed_with_warning: "官方已確認，需賽前複查",
    official_pdf_link_confirmed_manual_review_needed: "官方 PDF 需人工覆核"
  };

  return labels[status];
}

export function formatRaceDate(date: string) {
  return date.replace(/-/g, "/");
}

export function formatRaceDistance(distanceKm: number) {
  return `${Number.isInteger(distanceKm) ? distanceKm.toFixed(0) : distanceKm.toFixed(1)}K`;
}
