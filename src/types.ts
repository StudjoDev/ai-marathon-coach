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

export type RaceCategory = "A" | "B" | "C";

export type RaceRegistrationStatus = "registered" | "planned" | "watching";

export type RaceSourceStatus =
  | "official_event_page_confirmed"
  | "official_registration_page_confirmed"
  | "public_event_page_confirmed_partial";

export type Race = {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  distanceKm: number;
  category: RaceCategory;
  registrationStatus: RaceRegistrationStatus;
  location: string;
  venue: string;
  city: string;
  reportTime: string;
  startTime: string;
  officialUrl: string;
  signupUrl?: string;
  backupInfoUrl?: string;
  sourceStatus: RaceSourceStatus;
  goal: string;
  strategy: string;
  notes: string[];
};

export type RaceChecklistGroup = {
  title: string;
  items: string[];
};

export type RaceChecklistState = Record<string, Record<string, boolean>>;
