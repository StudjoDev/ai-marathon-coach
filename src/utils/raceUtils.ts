import type { Race, RaceCategory, RaceRegistrationStatus, RaceSourceStatus } from "../types";
import { toDateOnly } from "./dateUtils";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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
    B: "B 賽｜訓練檢核賽",
    C: "C 賽｜恢復/輔助賽"
  };

  return labels[category];
}

export function getRaceCategoryStyle(category: RaceCategory) {
  const styles: Record<RaceCategory, string> = {
    A: "bg-primary text-white border-primary",
    B: "bg-success/10 text-success border-success/30",
    C: "bg-race-c-soft text-race-c border-race-c-line"
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

export function getRaceOfficialLinkLabel(race: Race) {
  if (race.sourceStatus === "official_pdf_link_confirmed_manual_review_needed") {
    return "官方 PDF";
  }

  if (race.officialUrl.includes("signup") || race.officialUrl.includes("bao-ming")) {
    return "官方報名頁";
  }

  return "官方網站";
}

export function getRacePrimaryWarning(race: Race) {
  if (race.id === "taoyuan-bald-cypress-2026-11k") {
    return race.warnings.find((warning) => warning.includes("14 天")) ?? race.warnings[0];
  }

  if (race.id === "tigerrun-2026-10k" || race.id === "sportaiwan-thanksgiving-2026-10k") {
    return race.warnings.find((warning) => warning.includes("連賽") || warning.includes("不可硬拚")) ?? race.warnings[0];
  }

  return race.warnings[0];
}

export function getRaceCategoryCounts(raceList: Race[]) {
  return raceList.reduce<Record<RaceCategory, number>>(
    (counts, race) => ({
      ...counts,
      [race.category]: counts[race.category] + 1
    }),
    { A: 0, B: 0, C: 0 }
  );
}
