export type RaceEventMode = "in_person" | "virtual";

export type Race = {
  id: string;
  name: string;
  shortName: string;
  /** YYYY-MM-DD */
  date: string;
  /** 線上賽等多日活動的結束日 */
  endDate?: string;
  distanceKm: number;
  eventMode?: RaceEventMode;
  venue: string;
  /** 起跑時間，可含說明文字；畫面取第一個 HH:MM */
  startTime: string;
  finishLimit: string;
  officialUrl: string;
  /** 集合或建議到場時間（HH:MM） */
  assemblyShort?: string;
  /** 距離容易誤會時的提醒，例如「不是 10K」 */
  distanceNote?: string;
  /** 報到方式一句話摘要 */
  checkInSummary: string;
  /** 要注意的事，建議最多三條 */
  memo: string[];
};

export type RaceResult = "finished" | "dnf" | "dns";

/** 跑者自己的內容：清單勾選、備忘、成績、心得 */
export type RaceEntry = {
  raceId: string;
  checklist: Record<string, boolean>;
  note: string;
  finishTime: string;
  result: RaceResult;
  reflection: string;
};
