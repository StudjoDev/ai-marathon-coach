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
  type:
    | "recovery"
    | "rest"
    | "easy"
    | "easy_run"
    | "strength"
    | "long"
    | "pre_long_run_recovery"
    | "post_long_run_recovery";
  distanceKm?: number;
  fallbackDistanceKm?: number;
  targetPace?: string;
  purpose: string;
  items: string[];
  attention: string;
  successCriteria?: string[];
};

export type WeeklyPlanAdjustment = {
  isAdjusted: boolean;
  adjustedAt: string;
  reason: string;
  changes: string[];
};

export type PainLocation =
  | "膝蓋前側"
  | "膝蓋外側"
  | "膝蓋內側"
  | "膝蓋下方"
  | "大腿後側"
  | "臀部外側";

export type PainEntry = {
  id: string;
  date: string;
  kneePain: number;
  backThighPain: number;
  locations: PainLocation[];
  sharpOrPulling: boolean;
  stairsNormal: boolean;
  note: string;
};

export type RaceCategory = "A" | "B" | "C";

export type RaceRegistrationStatus = "registered" | "not_registered" | "waitlist" | "unknown";

export type RaceSourceStatus =
  | "official_confirmed"
  | "official_confirmed_with_warning"
  | "official_link_blocked_backup_confirmed"
  | "official_pdf_link_confirmed_manual_review_needed";

export type RaceEventMode = "in_person" | "virtual";

export type Race = {
  id: string;
  name: string;
  shortName: string;
  date: string;
  endDate?: string;
  dayOfWeek: string;
  distanceKm: number;
  eventMode?: RaceEventMode;
  category: RaceCategory;
  registrationStatus: RaceRegistrationStatus;
  city: string;
  venue: string;
  location: string;
  locationDetail: string;
  checkInType: string;
  checkInNote: string;
  assemblyTime: string;
  bagDropInfo: string;
  startTime: string;
  finishLimit: string;
  officialUrl: string;
  signupUrl?: string;
  backupInfoUrl?: string;
  sourceStatus: RaceSourceStatus;
  sourceNote: string;
  goal: string;
  strategy: string[];
  warnings: string[];
  notes: string[];
};

export type RaceChecklistGroup = {
  title: string;
  items: string[];
};

export type RaceChecklistState = Record<string, Record<string, boolean>>;
