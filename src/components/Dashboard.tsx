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
import type { PainEntry } from "../types";
import {
  formatRaceDate,
  formatRaceDistance,
  getDaysUntilRace,
  getNextRace,
  getRaceCategoryStyle,
  getRacePriorityLabel
} from "../utils/raceUtils";
import { Badge, Card, Metric } from "./common";

const PAIN_STORAGE_KEY = "ai-marathon-coach:painLogs";
const LONG_RUN_DATE = "2026-06-19";

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

function painFeedback(entry: PainEntry) {
  const feedback: string[] = [];

  if (entry.kneePain >= 4) {
    feedback.push("本週不建議再跑步，週六請改恢復日。");
  }

  if (entry.backThighPain >= 4) {
    feedback.push("腿後側負荷偏高，避免衝刺、深蹲與硬舉。");
  }

  if (entry.kneePain <= 2 && entry.backThighPain <= 2 && entry.stairsNormal && !entry.sharpOrPulling) {
    feedback.push("本週長跑完成良好，下週可考慮恢復 10-11K 長跑。");
  }

  if (entry.sharpOrPulling) {
    feedback.push("有刺痛或拉扯感時，不把距離往上加，先讓腿後側恢復。");
  }

  if (feedback.length === 0) {
    feedback.push("先維持恢復週，不用急著補跑或加距離。");
  }

  return feedback;
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
  const latestLog = trainingLogs[trainingLogs.length - 1];
  const nextRace = getNextRace(races);
  const primaryRace = races.find((race) => race.category === "A");
  const tigerRun = races.find((race) => race.id === "tigerrun-2026-10k");
  const sportTaiwan = races.find((race) => race.id === "sportaiwan-thanksgiving-2026-10k");
  const latestPainEntry = readPainEntries().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))[0];
  const latestFeedback = latestPainEntry ? painFeedback(latestPainEntry) : [];

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
          {["散步 30-60 分鐘", "熱敷膝蓋", "大腿後側輕伸展", "不跑步"].map((item) => (
            <div key={item} className="rounded-card bg-surface-soft px-3 py-2">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">昨天完成 11.01K，今天只做恢復，不補跑。</p>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="primary">調整完成</Badge>
            <h2 className="mt-2 text-lg font-bold">本週課表已調整</h2>
          </div>
          <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
        </div>
        <div className="mt-3 grid gap-2 text-sm leading-5">
          {[
            "週二改為臀肌與穩定訓練。",
            "週三改為 Easy Run 4K。",
            "週四取消 Easy Run 5K，改為長跑前恢復日。",
            "週五改跑 Long Run 8-9K。",
            "週六改為跑後恢復日，不補跑。"
          ].map((item) => (
            <p key={item} className="rounded-card bg-white/80 px-3 py-2 font-semibold">
              {item}
            </p>
          ))}
        </div>
      </Card>

      <Card className="border-success/30 bg-success/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="success">週五長跑</Badge>
            <h2 className="mt-2 text-xl font-bold">Long Run 8-9K</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              建議配速 7'50-8'40/km，全程要能聊天。膝蓋痛到 4/10 以上就停止跑步改走路。
            </p>
          </div>
          <Gauge className="h-6 w-6 shrink-0 text-success" />
        </div>
        <button
          type="button"
          onClick={() => onOpenPain(LONG_RUN_DATE)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
        >
          <CheckCircle2 className="h-4 w-4" />
          填寫跑後狀態
        </button>
      </Card>

      {latestPainEntry ? (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone={latestPainEntry.date === LONG_RUN_DATE ? "success" : "muted"}>
                {latestPainEntry.date === LONG_RUN_DATE ? "跑後回饋" : "最新回饋"}
              </Badge>
              <h2 className="mt-2 text-lg font-bold">教練根據疼痛紀錄更新建議</h2>
            </div>
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          </div>
          <div className="mt-3 grid gap-2">
            {latestFeedback.map((item) => (
              <p key={item} className="rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold leading-5">
                {item}
              </p>
            ))}
          </div>
        </Card>
      ) : null}

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
              note="高負荷連賽週，第二天不拼速度"
              className="border-warning/30 bg-warning/10 text-warning"
            />
          ) : null}
        </div>
      </section>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">本週不追距離</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 grid gap-2">
          {[
            "6/13 跑後膝蓋疼痛需要觀察。",
            "右大腿後側酸痛，不做衝刺、深蹲與硬舉。",
            "週四不補 5K，讓身體準備週五長跑。",
            "週五安全完成比距離漂亮更重要。",
            "週六不加跑，只做恢復。"
          ].map((risk) => (
            <div key={risk} className="flex items-start gap-2 text-sm font-medium leading-5 text-ink">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
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
