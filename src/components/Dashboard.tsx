import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  Footprints,
  Gauge,
  MapPin,
  Trophy
} from "lucide-react";
import { races } from "../data/races";
import { runnerProfile } from "../data/runnerProfile";
import { trainingLogs } from "../data/trainingLogs";
import { weeklyPlan, weeklyPlanAdjustment } from "../data/weeklyPlan";
import type { PainEntry, WeeklyPlanDay } from "../types";
import { formatChineseDate, todayInputValue } from "../utils/dateUtils";
import { getPainGuidance, sortPainEntries } from "../utils/painRules";
import {
  formatRaceDate,
  formatRaceDistance,
  getDaysUntilRace,
  getNextRace,
  getRaceCategoryStyle,
  getRacePriorityLabel
} from "../utils/raceUtils";
import { Badge, Card, HealthBoundaryNote, Metric } from "./common";

const PAIN_STORAGE_KEY = "ai-marathon-coach:painLogs";

function readPainEntries(): PainEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PAIN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is PainEntry => {
        const candidate = entry as Partial<PainEntry>;
        return (
          typeof candidate.id === "string" &&
          typeof candidate.date === "string" &&
          typeof candidate.kneePain === "number" &&
          typeof candidate.backThighPain === "number" &&
          Array.isArray(candidate.locations) &&
          typeof candidate.note === "string"
        );
      })
      .map((entry) => ({
        ...entry,
        sharpOrPulling: Boolean(entry.sharpOrPulling),
        stairsNormal: Boolean(entry.stairsNormal)
      }));
  } catch {
    return [];
  }
}

function getTodayPlan(todayKey: string) {
  const todayPlan = weeklyPlan.find((day) => day.date === todayKey);
  if (todayPlan) return todayPlan;

  return weeklyPlan.find((day) => day.date > todayKey) ?? weeklyPlan[weeklyPlan.length - 1];
}

function planBadge(plan: WeeklyPlanDay, todayKey: string) {
  return plan.date === todayKey ? `今天 ${formatChineseDate(plan.date)}` : `下一課 ${formatChineseDate(plan.date)}`;
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
  const longRun = weeklyPlan.find((day) => day.type === "long") ?? todayPlan;
  const latestLog = trainingLogs[trainingLogs.length - 1];
  const nextRace = getNextRace(races);
  const primaryRace = races.find((race) => race.category === "A");
  const baldCypressRace = races.find((race) => race.id === "taoyuan-bald-cypress-2026-11k");
  const tigerRun = races.find((race) => race.id === "tigerrun-2026-10k");
  const sportTaiwan = races.find((race) => race.id === "sportaiwan-thanksgiving-2026-10k");
  const painEntries = sortPainEntries(readPainEntries());
  const latestPainEntry = painEntries[0];
  const painGuidance = getPainGuidance(painEntries);

  return (
    <div className="space-y-4">
      <Card className="border-primary/40 bg-primary text-white shadow-raised">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/75">{runnerProfile.name}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal">{runnerProfile.appName}</h1>
          </div>
          <span className="whitespace-nowrap rounded-full bg-white/16 px-3 py-1 text-xs font-semibold">
            {runnerProfile.status}
          </span>
        </div>
        <div className="mt-5 rounded-card bg-white/12 px-3 py-3">
          <Badge tone="muted">今日任務</Badge>
          <h2 className="mt-3 text-2xl font-bold">{todayPlan.title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/82">{todayPlan.purpose}</p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone="success">{planBadge(todayPlan, todayKey)}</Badge>
            <h2 className="mt-3 text-xl font-bold">今天做這幾件事</h2>
          </div>
          <Footprints className="h-8 w-8 text-success" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold text-ink">
          {todayPlan.items.slice(0, 4).map((item) => (
            <div key={item} className="rounded-card bg-surface-soft px-3 py-2">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-card bg-warning/10 px-3 py-2 text-sm font-semibold leading-5 text-warning">
          注意：{todayPlan.attention}
        </p>
      </Card>

      <Card className="border-warning/30 bg-warning/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone={latestPainEntry ? "warning" : "muted"}>
              {latestPainEntry ? "最新疼痛回饋" : "尚未填疼痛"}
            </Badge>
            <h2 className="mt-2 text-lg font-bold">
              {latestPainEntry ? "教練根據疼痛紀錄更新建議" : "跑後先補一筆身體回饋"}
            </h2>
          </div>
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
        </div>
        <div className="mt-3 grid gap-2">
          {painGuidance.slice(0, 3).map((item) => (
            <p key={item.text} className="rounded-card bg-white/80 px-3 py-2 text-sm font-semibold leading-5">
              {item.text}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpenPain(latestPainEntry?.date ?? longRun.date)}
          className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
        >
          <CheckCircle2 className="h-4 w-4" />
          {latestPainEntry ? "查看疼痛紀錄" : "新增疼痛紀錄"}
        </button>
      </Card>

      <HealthBoundaryNote />

      <Card className="border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="primary">本週主線</Badge>
            <h2 className="mt-2 text-lg font-bold">長跑安全完成，比距離漂亮更重要</h2>
          </div>
          <Gauge className="h-6 w-6 shrink-0 text-primary" />
        </div>
        <div className="mt-3 grid gap-2 text-sm leading-5">
          {weeklyPlanAdjustment.changes.slice(0, 3).map((item) => (
            <p key={item} className="rounded-card bg-white/80 px-3 py-2 font-semibold">
              {item}
            </p>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          {longRun.displayDate} {longRun.title}：建議配速 {longRun.targetPace}，全程要能聊天。若疼痛達 4/10 以上，以改走路或結束當次訓練為主。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenPlan}
            className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card border border-primary/30 bg-white px-3 py-2 text-sm font-bold text-primary"
          >
            <CalendarDays className="h-4 w-4" />
            看課表
          </button>
          <button
            type="button"
            onClick={() => onOpenPain(longRun.date)}
            className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card bg-primary px-3 py-2 text-sm font-bold text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            跑後記錄
          </button>
        </div>
      </Card>

      {nextRace ? (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="success">下一場賽事</Badge>
              <h2 className="mt-3 text-xl font-bold">{nextRace.name}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">
                {formatRaceDistance(nextRace.distanceKm)}｜{nextRace.venue}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold leading-none text-primary">{Math.max(getDaysUntilRace(nextRace.date), 0)}</p>
              <p className="mt-1 text-xs font-bold text-muted">天</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center gap-2 rounded-card bg-surface-soft px-3 py-2">
              <Flag className="h-4 w-4 shrink-0 text-success" />
              <span className="font-semibold">{getRacePriorityLabel(nextRace.category)}</span>
            </div>
            <div className="flex items-start gap-2 rounded-card bg-surface-soft px-3 py-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="leading-5">{nextRace.goal}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenRaces}
            className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
          >
            <CalendarDays className="h-4 w-4" />
            查看全部賽事
          </button>
        </Card>
      ) : null}

      <section className="-mx-5 overflow-x-auto px-5">
        <div className="flex snap-x snap-mandatory gap-3 pb-1">
          {nextRace ? (
            <RaceMiniCard
              title="下一場賽事"
              label={`${formatRaceDistance(nextRace.distanceKm)}｜${getRacePriorityLabel(nextRace.category)}`}
              value={nextRace.name}
              note="目標：穩定完賽"
              className={getRaceCategoryStyle(nextRace.category)}
            />
          ) : null}
          {primaryRace ? (
            <RaceMiniCard
              title="主要目標賽"
              label={`${formatRaceDate(primaryRace.date)}｜${getRacePriorityLabel(primaryRace.category)}`}
              value={`${primaryRace.name} ${formatRaceDistance(primaryRace.distanceKm)}`}
              note="目標：安全完成半馬"
              className={getRaceCategoryStyle(primaryRace.category)}
            />
          ) : null}
          {baldCypressRace ? (
            <RaceMiniCard
              title="半馬後恢復賽"
              label={`${formatRaceDate(baldCypressRace.date)}｜${getRacePriorityLabel(baldCypressRace.category)}`}
              value={`${baldCypressRace.shortName} ${formatRaceDistance(baldCypressRace.distanceKm)}`}
              note="板橋後 14 天，不追個人最佳"
              className={getRaceCategoryStyle(baldCypressRace.category)}
            />
          ) : null}
          {tigerRun && sportTaiwan ? (
            <RaceMiniCard
              title="近期風險提醒"
              label="連兩天 10K"
              value={`${tigerRun.name} / ${sportTaiwan.name}`}
              note="高負荷連賽週，第二天不拼速度"
              className="border-warning/30 bg-warning/10 text-warning"
            />
          ) : null}
        </div>
        <p className="mt-1 px-1 text-xs font-semibold text-muted">左右滑動查看更多賽事重點</p>
      </section>

      {primaryRace && baldCypressRace ? (
        <Card className="border-warning/30 bg-warning/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="warning">11 月賽事密集提醒</Badge>
              <h2 className="mt-2 text-lg font-bold">半馬後 14 天落羽松，再 7 天 Garmin</h2>
            </div>
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-warning">
            11 月以恢復優先，不把三場都當成成績賽；若 11/22 跑後疼痛持續超過 48 小時，11/29 Garmin 建議改為輕鬆跑，並重新評估是否出賽。
          </p>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="muted">最新訓練</Badge>
            <h2 className="mt-2 text-lg font-bold">6/13 長跑摘要</h2>
          </div>
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Metric label="距離" value={latestLog.distanceKm.toFixed(2)} unit="K" />
          <Metric label="時間" value={latestLog.duration} />
          <Metric label="配速" value={latestLog.pace} />
          <Metric label="心率" value={String(latestLog.avgHr)} unit="下/分" />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-card bg-surface-soft px-3 py-2 text-sm">
          <span className="font-semibold">體感：{latestLog.effort}</span>
          <span className="text-muted">{latestLog.cadence} 步/分</span>
        </div>
        <p className="mt-3 text-sm text-muted">{latestLog.note}</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">成功標準</h2>
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 space-y-2">
          {[
            "8-9K 後膝蓋疼痛不增加，最好維持在 2/10 以下。",
            "隔天上下樓梯正常。",
            "右大腿後側沒有刺痛或拉扯感。",
            "8K 前就痛，維持恢復週，不增加距離。",
            "配速不是成功指標，安全完成才是。"
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm leading-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RaceMiniCard({
  title,
  label,
  value,
  note,
  className
}: {
  title: string;
  label: string;
  value: string;
  note: string;
  className: string;
}) {
  return (
    <article className="min-w-[250px] snap-start rounded-card border border-line bg-surface px-4 py-3 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-muted">{title}</p>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${className}`}>{label}</span>
      </div>
      <p className="mt-3 text-base font-bold leading-6">{value}</p>
      <p className="mt-2 text-sm font-semibold text-muted">{note}</p>
    </article>
  );
}
