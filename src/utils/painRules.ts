import type { PainEntry } from "../types";

export const PAIN_THRESHOLDS = {
  greenMax: 2,
  adjustMin: 4,
  highMin: 5,
  persistentHours: 48
};

export type PainGuidance = {
  tone: "success" | "warning" | "danger";
  text: string;
};

function entryMaxPain(entry: PainEntry) {
  return Math.max(entry.kneePain, entry.backThighPain);
}

export function sortPainEntries(entries: PainEntry[]) {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function normalizePainLocation(location: string) {
  return location === "屁股外側" ? "臀部外側" : location;
}

export function hasConsecutiveHighPain(entries: PainEntry[]) {
  const maxByDate = new Map<string, number>();

  entries.forEach((entry) => {
    maxByDate.set(entry.date, Math.max(maxByDate.get(entry.date) ?? 0, entryMaxPain(entry)));
  });

  const daily = Array.from(maxByDate.entries())
    .map(([date, maxPain]) => ({ date, maxPain }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return daily.some((entry, index) => {
    const next = daily[index + 1];
    if (!next || entry.maxPain < PAIN_THRESHOLDS.highMin || next.maxPain < PAIN_THRESHOLDS.highMin) return false;
    const diffMs = new Date(entry.date).getTime() - new Date(next.date).getTime();
    return diffMs === 24 * 60 * 60 * 1000;
  });
}

export function hasHighPainOver48Hours(entries: PainEntry[]) {
  const sorted = sortPainEntries(entries);
  const latest = sorted[0];

  if (!latest || entryMaxPain(latest) < PAIN_THRESHOLDS.adjustMin) return false;

  const highPainDates = sorted
    .filter((entry) => entry.date <= latest.date && entryMaxPain(entry) >= PAIN_THRESHOLDS.adjustMin)
    .map((entry) => entry.date)
    .sort();

  if (highPainDates.length < 2) return false;

  const first = new Date(highPainDates[0]).getTime();
  const last = new Date(latest.date).getTime();

  return last - first >= PAIN_THRESHOLDS.persistentHours * 60 * 60 * 1000;
}

export function getPainGuidance(entries: PainEntry[]): PainGuidance[] {
  const sorted = sortPainEntries(entries);
  const latest = sorted[0];
  const messages: PainGuidance[] = [];

  if (sorted.some((entry) => entry.kneePain >= PAIN_THRESHOLDS.highMin)) {
    messages.push({
      tone: "warning",
      text: "本週先不增加距離，下一次跑步以前以膝蓋疼痛回到 2/10 以下為觀察條件。"
    });
  }

  if (hasConsecutiveHighPain(sorted)) {
    messages.push({
      tone: "danger",
      text: "連續兩天疼痛達 5/10 以上，建議先暫停跑步安排，改以恢復訓練為主。"
    });
  }

  if (!latest) return messages;

  if (latest.kneePain >= PAIN_THRESHOLDS.adjustMin || latest.backThighPain >= PAIN_THRESHOLDS.adjustMin) {
    messages.push({
      tone: latest.kneePain >= PAIN_THRESHOLDS.highMin || latest.backThighPain >= PAIN_THRESHOLDS.highMin ? "danger" : "warning",
      text: "今天若跑步中疼痛達 4/10，建議改走路或結束當次訓練。"
    });
  }

  if (latest.backThighPain >= PAIN_THRESHOLDS.adjustMin) {
    messages.push({
      tone: "warning",
      text: "右大腿後側負荷偏高，近期避免衝刺、深蹲與硬舉。"
    });
  }

  if (
    latest.kneePain <= PAIN_THRESHOLDS.greenMax &&
    latest.backThighPain <= PAIN_THRESHOLDS.greenMax &&
    latest.stairsNormal &&
    !latest.sharpOrPulling
  ) {
    messages.push({
      tone: "success",
      text: "膝蓋與右大腿後側都在 2/10 以下，且樓梯正常；下週可考慮恢復 10-11K 長跑。"
    });
  }

  if (hasHighPainOver48Hours(sorted)) {
    messages.push({
      tone: "danger",
      text: "疼痛已持續 48 小時以上，建議先暫停跑步，並諮詢醫師或物理治療師。"
    });
  }

  if (messages.length === 0) {
    messages.push({
      tone: "success",
      text: "目前紀錄沒有明顯升高訊號，先維持恢復週，不急著補跑或加距離。"
    });
  }

  return messages;
}
