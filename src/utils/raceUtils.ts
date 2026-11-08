import type { Race } from "../types";
import { toDateOnly } from "./dateUtils";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export type RaceTiming = "past" | "today" | "upcoming";

export function sortByDate(raceList: Race[]) {
  return [...raceList].sort((a, b) => a.date.localeCompare(b.date));
}

export function getDaysUntil(date: string, today: string) {
  return Math.round((toDateOnly(date).getTime() - toDateOnly(today).getTime()) / ONE_DAY_MS);
}

export function getRaceTiming(race: Race, today: string): RaceTiming {
  if (getDaysUntil(race.endDate ?? race.date, today) < 0) return "past";
  if (getDaysUntil(race.date, today) <= 0) return "today";
  return "upcoming";
}

export function splitRaces(raceList: Race[], today: string) {
  const sorted = sortByDate(raceList);
  return {
    current: sorted.filter((race) => getRaceTiming(race, today) !== "past"),
    past: sorted.filter((race) => getRaceTiming(race, today) === "past").reverse()
  };
}

/** 與前一場或下一場相隔一天 */
export function isBackToBack(race: Race, raceList: Race[]) {
  return raceList.some((other) => other.id !== race.id && Math.abs(getDaysUntil(other.date, race.date)) === 1);
}

export function formatHeroDistance(distanceKm: number) {
  if (distanceKm > 20 && distanceKm < 22) return "21.1";
  return Number.isInteger(distanceKm) ? String(distanceKm) : distanceKm.toFixed(1);
}

export function formatDistance(distanceKm: number) {
  return `${formatHeroDistance(distanceKm)}K`;
}

export function monthLabel(date: string) {
  return MONTHS[toDateOnly(date).getMonth()];
}

export function dayLabel(date: string) {
  return String(toDateOnly(date).getDate());
}

export function weekdayLabel(date: string) {
  return WEEKDAYS[toDateOnly(date).getDay()];
}

export function dotDate(date: string) {
  const value = toDateOnly(date);
  return `${String(value.getMonth() + 1).padStart(2, "0")}.${String(value.getDate()).padStart(2, "0")}`;
}

export function getStartShort(race: Race) {
  if (race.eventMode === "virtual") return undefined;
  return race.startTime.match(/\d{2}:\d{2}/)?.[0];
}

export function getLimitShort(race: Race) {
  const limit = race.finishLimit.replace(/（.*?）|\(.*?\)/g, "").trim();
  if (!limit || /未確認|待公告/.test(limit)) return undefined;
  if (race.eventMode === "virtual") return limit.replace(/內.*$/, "");

  return limit
    .replace(/\s*小時\s*/, "H")
    .replace(/\s*分鐘/, "MIN")
    .replace(/\s*分$/, "")
    .replace(/\s+/g, "");
}

export type KeyStat = { label: string; value: string };

export function getKeyStats(race: Race): KeyStat[] {
  if (race.eventMode === "virtual") {
    const stats: KeyStat[] = [{ label: "期間", value: `${dotDate(race.date)}–${dotDate(race.endDate ?? race.date)}` }];
    const limit = getLimitShort(race);
    if (limit) stats.push({ label: "限時", value: limit });
    return stats;
  }

  const stats: KeyStat[] = [];
  const start = getStartShort(race);
  const limit = getLimitShort(race);
  if (start) stats.push({ label: "起跑", value: start });
  if (race.assemblyShort) stats.push({ label: "集合", value: race.assemblyShort });
  if (limit) stats.push({ label: "限時", value: limit });
  return stats;
}

export function getRaceSubtitle(race: Race) {
  const start = getStartShort(race);
  if (race.eventMode === "virtual") return `${formatDistance(race.distanceKm)} 線上累積`;
  return start ? `${formatDistance(race.distanceKm)} · ${start} 起跑` : formatDistance(race.distanceKm);
}

export function getMapUrl(race: Race) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(race.venue)}`;
}

export function getChecklistItems(race: Race) {
  if (race.eventMode === "virtual") {
    return ["App 已登入並看得到活動", "手錶已連動", "活動期間內完成累積"];
  }

  return ["收到物資並核對", "號碼布、晶片", "跑鞋、衣物", "手錶充電", "確認交通方式"];
}
