import { AlertTriangle, CalendarDays, CheckCircle2, Clock, ExternalLink, Flag, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { races } from "../data/races";
import { weeklyPlan } from "../data/weeklyPlan";
import type { Race, WeeklyPlanDay } from "../types";
import { formatChineseDate, todayInputValue } from "../utils/dateUtils";
import {
  formatRaceDateRange,
  formatRaceDistance,
  getDaysUntilRace,
  getRaceModeLabel,
  getRacePrimaryWarning,
  getRacePriorityLabel,
  getUpcomingRaces
} from "../utils/raceUtils";
import { Badge, Card, SectionHeader, cn } from "./common";

function getTodayPlan(todayKey: string) {
  const todayPlan = weeklyPlan.find((day) => day.date === todayKey);
  if (todayPlan) return todayPlan;

  return weeklyPlan.find((day) => day.date > todayKey) ?? weeklyPlan[weeklyPlan.length - 1];
}

function getRaceMemoItems(race: Race) {
  if (race.id === "mt-fuji-tatta-run-2026-summer-half") {
    return ["確認 TATTA App 已登入", "分次累積，不單次硬跑半馬", "每次跑後記錄疼痛"];
  }

  if (race.id === "marie-claire-pink-run-2026-10k") {
    return ["10K 14:15 起跑", "賽前複查官方物資通知", "保留板橋半馬狀態"];
  }

  if (race.eventMode === "virtual") {
    return ["確認 App 可記錄", "活動期間內累積", "跑後記錄身體狀態"];
  }

  return ["確認報到與物資", `確認 ${race.startTime} 起跑`, "跑後記錄疼痛分數"];
}

function getStartLabel(race: Race) {
  if (race.eventMode === "virtual") {
    return race.finishLimit;
  }

  return `開跑 ${race.startTime}`;
}

function getTrainingMeta(plan: WeeklyPlanDay) {
  const parts: string[] = [];

  if (plan.distanceKm) {
    parts.push(plan.fallbackDistanceKm ? `${plan.fallbackDistanceKm}-${plan.distanceKm}K` : `${plan.distanceKm}K`);
  }

  if (plan.targetPace) {
    parts.push(plan.targetPace);
  }

  return parts.join(" | ");
}

export function Dashboard({
  onOpenPlan,
  onOpenRaces,
  onOpenPain
}: {
  onOpenPlan: () => void;
  onOpenRaces: () => void;
  onOpenPain: (date: string) => void;
}) {
  const todayKey = todayInputValue();
  const todayPlan = getTodayPlan(todayKey);
  const upcomingRaces = getUpcomingRaces(races);
  const nextRace = upcomingRaces[0];
  const nearbyRaces = upcomingRaces.slice(0, 4);
  const keyReminders = Array.from(
    new Set(
      upcomingRaces
        .slice(0, 5)
        .map((race) => getRacePrimaryWarning(race))
        .filter((warning): warning is string => Boolean(warning))
    )
  ).slice(0, 3);
  const trainingMeta = getTrainingMeta(todayPlan);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-bold text-muted">賽事備忘錄</p>
        <h1 className="text-3xl font-bold tracking-normal text-ink">下一場先準備好</h1>
        <p className="text-sm font-medium leading-6 text-muted">
          只保留近期賽事、待辦與需要複查的提醒。
        </p>
      </header>

      {nextRace ? (
        <Card className="border-primary/40 shadow-raised">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">下一場</Badge>
                <Badge tone={nextRace.category === "A" ? "raceA" : nextRace.category === "B" ? "raceB" : "raceC"} variant="outline">
                  {formatRaceDistance(nextRace.distanceKm)}
                </Badge>
                <Badge tone="muted">{getRaceModeLabel(nextRace.eventMode)}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-bold leading-tight">{nextRace.name}</h2>
              <p className="mt-2 text-sm font-semibold text-muted">
                {formatRaceDateRange(nextRace)} | {getStartLabel(nextRace)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-4xl font-bold leading-none text-primary">
                {Math.max(getDaysUntilRace(nextRace.date), 0)}
              </p>
              <p className="mt-1 text-xs font-bold text-muted">天</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm">
            <MemoLine icon={<MapPin className="h-4 w-4" />} text={nextRace.location} />
            <MemoLine icon={<AlertTriangle className="h-4 w-4" />} text={getRacePrimaryWarning(nextRace)} tone="warning" />
          </div>

          <div className="mt-4 grid gap-2">
            {getRaceMemoItems(nextRace).map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenRaces}
              className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              <Flag className="h-4 w-4" />
              查看賽事
            </button>
            <a
              href={nextRace.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card border border-primary/30 bg-white px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
            >
              <ExternalLink className="h-4 w-4" />
              官方連結
            </a>
          </div>
        </Card>
      ) : null}

      <section>
        <SectionHeader eyebrow="接下來" title="近期賽事" />
        <Card>
          <div className="divide-y divide-line">
            {nearbyRaces.map((race) => (
              <RaceMemoRow key={race.id} race={race} isNext={race.id === nextRace?.id} />
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenRaces}
            className="focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-line bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft"
          >
            <CalendarDays className="h-4 w-4" />
            全部賽事
          </button>
        </Card>
      </section>

      {keyReminders.length > 0 ? (
        <Card className="border-warning/30 bg-warning/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <h2 className="text-lg font-bold">關鍵提醒</h2>
              <div className="mt-3 grid gap-2">
                {keyReminders.map((reminder) => (
                  <p key={reminder} className="text-sm font-semibold leading-5 text-warning">
                    {reminder}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <Card density="compact">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="muted">訓練輔助</Badge>
            <h2 className="mt-2 text-lg font-bold">{todayPlan.title}</h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              {formatChineseDate(todayPlan.date)}
              {trainingMeta ? ` | ${trainingMeta}` : ""}
            </p>
          </div>
          <Clock className="h-5 w-5 shrink-0 text-primary" />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{todayPlan.attention}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenPlan}
            className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card border border-line bg-white px-3 py-2 text-sm font-bold text-primary"
          >
            <CalendarDays className="h-4 w-4" />
            看課表
          </button>
          <button
            type="button"
            onClick={() => onOpenPain(todayPlan.date)}
            className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card bg-primary px-3 py-2 text-sm font-bold text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            跑後記錄
          </button>
        </div>
      </Card>
    </div>
  );
}

function RaceMemoRow({ race, isNext }: { race: Race; isNext: boolean }) {
  const daysUntil = Math.max(getDaysUntilRace(race.date), 0);

  return (
    <article className="grid grid-cols-[1fr_auto] gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {isNext ? <Badge tone="success" size="xs">下一場</Badge> : null}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-bold",
              race.category === "A"
                ? "bg-primary text-white"
                : race.category === "B"
                  ? "bg-success/10 text-success"
                  : "bg-race-c-soft text-race-c"
            )}
          >
            {getRacePriorityLabel(race.category)}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-5">{race.name}</h3>
        <p className="mt-1 text-sm font-semibold text-muted">
          {formatRaceDateRange(race)} | {formatRaceDistance(race.distanceKm)} | {getRaceModeLabel(race.eventMode)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-primary">{daysUntil}</p>
        <p className="text-xs font-semibold text-muted">天</p>
      </div>
    </article>
  );
}

function MemoLine({
  icon,
  text,
  tone = "default"
}: {
  icon: ReactNode;
  text?: string;
  tone?: "default" | "warning";
}) {
  if (!text) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-card px-3 py-2 font-semibold leading-5",
        tone === "warning" ? "bg-warning/10 text-warning" : "bg-surface-soft text-muted"
      )}
    >
      <span className={cn("mt-0.5 shrink-0", tone === "warning" ? "text-warning" : "text-primary")} aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
