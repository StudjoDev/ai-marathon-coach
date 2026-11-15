export const HALF_MARATHON_KM = 21.0975;
export const MARATHON_KM = 42.195;

/** 要算出哪一項；另外兩項由使用者輸入 */
export type CalcMode = "pace" | "time" | "distance";

const pad = (value: number) => String(value).padStart(2, "0");

/** 欄位文字由大到小（時、分、秒 或 分、秒）換成總秒數；全空、無效或為 0 回傳 undefined */
export function toSeconds(parts: string[]) {
  if (parts.every((part) => part.trim() === "")) return undefined;

  let total = 0;
  for (const part of parts) {
    const value = part.trim() === "" ? 0 : Number(part);
    if (!Number.isFinite(value) || value < 0) return undefined;
    total = total * 60 + value;
  }
  return total > 0 ? total : undefined;
}

export function toDistance(text: string) {
  const value = Number(text.trim());
  return text.trim() !== "" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/** 總秒數拆成欄位文字 */
export function splitSeconds(seconds: number) {
  const total = Math.round(seconds);
  return {
    hours: String(Math.floor(total / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60)
  };
}

/** 3:59:59；不到一小時顯示 28:25 */
export function formatDuration(seconds: number) {
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(total % 60)}` : `${minutes}:${pad(total % 60)}`;
}

/** 配速一律「分:秒」，例如 5:41 */
export function formatPace(secondsPerKm: number) {
  const total = Math.round(secondsPerKm);
  return `${Math.floor(total / 60)}:${pad(total % 60)}`;
}

export function formatKm(km: number, digits = 2) {
  return String(Number(km.toFixed(digits)));
}

/** 賽事填的 21、21.1、42、42.2 視為標準半馬／全馬距離 */
export function toStandardDistance(km: number) {
  if (Math.abs(km - HALF_MARATHON_KM) < 0.11) return HALF_MARATHON_KM;
  if (Math.abs(km - MARATHON_KM) < 0.2) return MARATHON_KM;
  return km;
}

export type Split = { km: number; seconds: number; kind: "mark" | "half" | "finish" };

/** 等速跑的分段通過時間：10K 以內每公里一段，更長的每 5K（超馬再放寬），另加半程與終點 */
export function getSplits(distanceKm: number, secondsPerKm: number): Split[] {
  const step = distanceKm <= 10 ? 1 : [5, 10, 20, 50, 100].find((size) => distanceKm / size <= 30);
  const splits: Split[] = [];

  if (step) {
    for (let km = step; km < distanceKm - 0.001; km += step) {
      splits.push({ km, seconds: km * secondsPerKm, kind: "mark" });
    }
  }
  if (distanceKm > HALF_MARATHON_KM + 0.5) {
    splits.push({ km: HALF_MARATHON_KM, seconds: HALF_MARATHON_KM * secondsPerKm, kind: "half" });
    splits.sort((a, b) => a.km - b.km);
  }
  splits.push({ km: distanceKm, seconds: distanceKm * secondsPerKm, kind: "finish" });
  return splits;
}
