export type TrainingLog = {
  date: string;
  distanceKm: number;
  duration: string;
  pace: string;
  avgHr: number;
  cadence: number;
  note: string;
  effort: string;
};

export type WeeklyPlanDay = {
  date: string;
  dayLabel: string;
  displayDate: string;
  title: string;
  type: "recovery" | "rest" | "easy" | "strength" | "long";
  purpose: string;
  items: string[];
  attention: string;
};

export type PainLocation =
  | "膝蓋前側"
  | "膝蓋外側"
  | "膝蓋內側"
  | "膝蓋下方"
  | "大腿後側"
  | "屁股外側";

export type PainEntry = {
  id: string;
  date: string;
  kneePain: number;
  backThighPain: number;
  locations: PainLocation[];
  note: string;
};
