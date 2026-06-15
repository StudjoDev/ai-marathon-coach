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
import {
  formatRaceDate,
  formatRaceDistance,
  getDaysUntilRace,
  getNextRace,
  getRaceCategoryStyle,
  getRacePriorityLabel
} from "../utils/raceUtils";
import { Badge, Card, Metric } from "./common";

export function Dashboard({
  onOpenPlan,
  onOpenRaces
}: {
  onOpenPlan: () => void;
  onOpenRaces: () => void;
}) {
  const latestLog = trainingLogs[trainingLogs.length - 1];
  const nextRace = getNextRace(races);
  const primaryRace = races.find((race) => race.category === "A");
  const tigerRun = races.find((race) => race.id === "tigerrun-2026");
  const sportTaiwan = races.find((race) => race.id === "sportaiwan-2026");

  return (
    <div className="space-y-4">
      <header className="rounded-card bg-primary px-5 py-5 text-white shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/75">{runnerProfile.name}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal">{runnerProfile.appName}</h1>
          </div>
          <span className="whitespace-nowrap rounded-full bg-white/16 px-3 py-1 text-xs font-semibold">
            {runnerProfile.status}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/82">{runnerProfile.currentFocus}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-white/60">目標</p>
            <p className="font-bold">{runnerProfile.goal}</p>
          </div>
          <div>
            <p className="text-white/60">訓練</p>
            <p className="font-bold">每週 {runnerProfile.weeklyTrainingDays} 天</p>
          </div>
          <div>
            <p className="text-white/60">長跑</p>
            <p className="font-bold">{runnerProfile.longRunDay}</p>
          </div>
        </div>
      </header>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone="success">6/14 週日</Badge>
            <h2 className="mt-3 text-xl font-bold">今日：恢復日</h2>
          </div>
          <Footprints className="h-8 w-8 text-success" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold text-ink">
          {["散步 30~60 分鐘", "熱敷膝蓋", "大腿後側輕伸展", "不跑步"].map((item) => (
            <div key={item} className="rounded-card bg-surface-soft px-3 py-2">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">昨天完成 11.01K，今天只做恢復。</p>
      </Card>

      {nextRace ? (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="success">下一場賽事</Badge>
              <h2 className="mt-3 text-xl font-bold">{nextRace.name}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">{formatRaceDistance(nextRace.distanceKm)}｜{nextRace.venue}</p>
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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
          >
            <CalendarDays className="h-4 w-4" />
            查看全部賽事
          </button>
        </Card>
      ) : null}

      <section className="-mx-5 overflow-x-auto px-5">
        <div className="flex gap-3 pb-1">
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
          {tigerRun && sportTaiwan ? (
            <RaceMiniCard
              title="近期風險提醒"
              label="連兩天 10K"
              value={`${tigerRun.name} / ${sportTaiwan.name}`}
              note="第二天不拼速度"
              className="border-warning/30 bg-warning/10 text-warning"
            />
          ) : null}
        </div>
      </section>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">風險提醒</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 grid gap-2">
          {runnerProfile.riskSignals.map((risk) => (
            <div key={risk} className="flex items-center gap-2 text-sm font-medium text-ink">
              <span className="h-2 w-2 rounded-full bg-warning" />
              {risk}
            </div>
          ))}
        </div>
      </Card>

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
          <h2 className="text-lg font-bold">本週目標</h2>
          <Gauge className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 space-y-2">
          {[
            "9K 完跑後膝蓋不痛",
            "若 9K 才開始痛，代表有進步",
            "若 8K 或更早痛，維持恢復週"
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm leading-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenPlan}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
        >
          <CalendarDays className="h-4 w-4" />
          查看本週課表
        </button>
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
    <article className="min-w-[250px] rounded-card border border-line bg-surface px-4 py-3 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-muted">{title}</p>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${className}`}>{label}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-base font-bold leading-6">{value}</p>
      <p className="mt-2 text-sm font-semibold text-muted">{note}</p>
    </article>
  );
}
