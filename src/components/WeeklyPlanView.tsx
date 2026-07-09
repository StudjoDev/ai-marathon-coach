import { CalendarDays, CheckCircle2, Flag, Trophy } from "lucide-react";
import { races } from "../data/races";
import type { Race } from "../types";
import { todayInputValue } from "../utils/dateUtils";
import { formatRaceDistance } from "../utils/raceUtils";
import { Badge, Card, SectionHeader, cn } from "./common";

type WeeklyGoal = {
  start: string;
  end: string;
  label: string;
  focus: string;
  minimumGoal: string;
};

const weeklyGoals: WeeklyGoal[] = [
  { start: "2026-07-06", end: "2026-07-12", label: "7/06-7/12", focus: "恢復穩定", minimumGoal: "跑 2 次；長跑穩定到 9K，疼痛不升高。" },
  { start: "2026-07-13", end: "2026-07-19", label: "7/13-7/19", focus: "建立規律", minimumGoal: "跑 2-3 次；長跑 10K，全程能聊天。" },
  { start: "2026-07-20", end: "2026-07-26", label: "7/20-7/26", focus: "耐受提升", minimumGoal: "總量 16K 左右；跑後膝蓋維持 2/10 以下。" },
  { start: "2026-07-27", end: "2026-08-02", label: "7/27-8/02", focus: "吸收週", minimumGoal: "維持 2 跑 + 1 肌力；不追速度。" },
  { start: "2026-08-03", end: "2026-08-09", label: "8/03-8/09", focus: "TATTA 開始", minimumGoal: "開始累積 TATTA；完成 10-12K 累積量。" },
  { start: "2026-08-10", end: "2026-08-16", label: "8/10-8/16", focus: "完成線上賽", minimumGoal: "補足 TATTA 21.0975K；不要單次硬跑半馬。" },
  { start: "2026-08-17", end: "2026-08-23", label: "8/17-8/23", focus: "恢復週", minimumGoal: "長跑回到 10K；確認膝蓋恢復。" },
  { start: "2026-08-24", end: "2026-08-30", label: "8/24-8/30", focus: "長跑 12K", minimumGoal: "總量 18-20K；完成一次 12K 輕鬆長跑。" },
  { start: "2026-08-31", end: "2026-09-06", label: "8/31-9/06", focus: "長跑 13K", minimumGoal: "完成 13K；練習補水與跑後恢復。" },
  { start: "2026-09-07", end: "2026-09-13", label: "9/07-9/13", focus: "長跑 14K", minimumGoal: "完成 14K；配速保守，不加速硬撐。" },
  { start: "2026-09-14", end: "2026-09-20", label: "9/14-9/20", focus: "永慶盃 10.5K", minimumGoal: "安全完成 10.5K；當作訓練檢核。" },
  { start: "2026-09-21", end: "2026-09-27", label: "9/21-9/27", focus: "恢復銜接", minimumGoal: "恢復 2 跑；長跑 12K，不急著加量。" },
  { start: "2026-09-28", end: "2026-10-04", label: "9/28-10/04", focus: "半馬基礎", minimumGoal: "完成 15K 長跑；建立穩定跑感。" },
  { start: "2026-10-05", end: "2026-10-11", label: "10/05-10/11", focus: "半馬專項", minimumGoal: "完成 16K；中後段維持穩定配速。" },
  { start: "2026-10-12", end: "2026-10-18", label: "10/12-10/18", focus: "高峰前", minimumGoal: "完成 17-18K；跑後 48 小時內能恢復。" },
  { start: "2026-10-19", end: "2026-10-25", label: "10/19-10/25", focus: "開始降量", minimumGoal: "長跑降到 12-14K；保持輕鬆。" },
  { start: "2026-10-26", end: "2026-11-01", label: "10/26-11/01", focus: "裙襬 10K", minimumGoal: "10K 當氣氛跑；保留板橋半馬狀態。" },
  { start: "2026-11-02", end: "2026-11-08", label: "11/02-11/08", focus: "板橋半馬", minimumGoal: "安全完成 21K；不要用前半段換後半段崩盤。" },
  { start: "2026-11-09", end: "2026-11-15", label: "11/09-11/15", focus: "賽後恢復", minimumGoal: "不安排強度；疼痛回到 2/10 以下。" },
  { start: "2026-11-16", end: "2026-11-22", label: "11/16-11/22", focus: "落羽松 11K", minimumGoal: "11K 景觀恢復跑；不追個人最佳。" },
  { start: "2026-11-23", end: "2026-11-29", label: "11/23-11/29", focus: "Garmin 5K", minimumGoal: "依恢復決定輕鬆跑或測速；不勉強。" },
  { start: "2026-11-30", end: "2026-12-06", label: "11/30-12/06", focus: "維持週", minimumGoal: "完成 2 跑 + 1 肌力；讓身體穩住。" },
  { start: "2026-12-07", end: "2026-12-13", label: "12/07-12/13", focus: "連賽週", minimumGoal: "TigerRun 控制強度；SporTaiwan 當恢復跑。" }
];

function isCurrentWeek(goal: WeeklyGoal, today: string) {
  return goal.start <= today && today <= goal.end;
}

function getRacesForWeek(goal: WeeklyGoal) {
  return races
    .filter((race) => race.date <= goal.end && (race.endDate ?? race.date) >= goal.start)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function raceDateLabel(race: Race) {
  const start = race.date.slice(5).replace("-", "/");
  if (!race.endDate || race.endDate === race.date) {
    return start;
  }

  return `${start}-${race.endDate.slice(5).replace("-", "/")}`;
}

function raceTimeLabel(race: Race) {
  if (race.eventMode === "virtual") {
    return "累積";
  }

  return race.startTime
    .replace(" 第一波；", "/")
    .replace(" 第二波", "")
    .replace(/（.*$/, "");
}

function hasPrimaryRace(racesInWeek: Race[]) {
  return racesInWeek.some((race) => race.category === "A");
}

export function WeeklyPlanView() {
  const today = todayInputValue();
  const currentGoal = weeklyGoals.find((goal) => isCurrentWeek(goal, today));
  const currentRaces = currentGoal ? getRacesForWeek(currentGoal) : [];

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-bold text-muted">每週最低目標</p>
        <h1 className="text-3xl font-bold tracking-normal text-ink">行程表</h1>
        <p className="text-sm font-medium leading-6 text-muted">
          不排每天細節，只看每週至少要完成什麼。
        </p>
      </header>

      {currentGoal ? (
        <Card
          className={cn(
            "shadow-raised",
            currentRaces.length > 0
              ? hasPrimaryRace(currentRaces)
                ? "border-primary/60 bg-primary/5"
                : "border-warning/40 bg-warning/10"
              : "border-primary/40"
          )}
        >
          <div className="flex items-start gap-3">
            {currentRaces.length > 0 ? (
              <Trophy className="mt-1 h-5 w-5 shrink-0 text-primary" />
            ) : (
              <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-primary" />
            )}
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">本週</Badge>
                {currentRaces.length > 0 ? <Badge tone="warning" variant="outline">賽事週</Badge> : null}
              </div>
              <h2 className="mt-3 text-2xl font-bold leading-tight">{currentGoal.focus}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">{currentGoal.label}</p>
              <p className="mt-3 rounded-card bg-surface-soft px-3 py-3 text-sm font-semibold leading-6">
                {currentGoal.minimumGoal}
              </p>
              {currentRaces.length > 0 ? <RaceWeekBlock racesInWeek={currentRaces} /> : null}
            </div>
          </div>
        </Card>
      ) : null}

      <section>
        <SectionHeader eyebrow={`${weeklyGoals.length} 週`} title="每週要達成的事" />
        <div className="space-y-2">
          {weeklyGoals.map((goal) => {
            const active = isCurrentWeek(goal, today);
            const racesInWeek = getRacesForWeek(goal);
            const raceWeek = racesInWeek.length > 0;

            return (
              <article
                key={goal.start}
                className={cn(
                  "app-card grid grid-cols-[76px_1fr] gap-3 p-3",
                  active ? "border-primary/40 bg-primary/5" : "",
                  raceWeek && !active ? "border-warning/40 bg-warning/10" : "",
                  raceWeek && hasPrimaryRace(racesInWeek) ? "border-primary/60 bg-primary/5" : ""
                )}
              >
                <div>
                  <p className="text-xs font-bold text-primary">{goal.label}</p>
                  {active ? <Badge tone="success" size="xs">本週</Badge> : null}
                  {raceWeek ? (
                    <div className="mt-2">
                      <Badge tone={hasPrimaryRace(racesInWeek) ? "primary" : "warning"} size="xs" variant="outline">
                        賽事
                      </Badge>
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold leading-5">{goal.focus}</h2>
                    {raceWeek ? <Flag className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
                  </div>
                  <div className="mt-2 flex items-start gap-2 text-sm font-semibold leading-5 text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    <span>{goal.minimumGoal}</span>
                  </div>
                  {raceWeek ? <RaceWeekBlock racesInWeek={racesInWeek} compact /> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RaceWeekBlock({
  racesInWeek,
  compact = false
}: {
  racesInWeek: Race[];
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", compact ? "mt-3" : "mt-4")}>
      {racesInWeek.map((race) => (
        <div
          key={race.id}
          className={cn(
            "rounded-card border px-3 py-2",
            race.category === "A"
              ? "border-primary/40 bg-white"
              : "border-warning/30 bg-white/80"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-primary">
                {raceDateLabel(race)} | {raceTimeLabel(race)}
              </p>
              <p className="mt-1 text-sm font-bold leading-5 text-ink">{race.shortName}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">
              {formatRaceDistance(race.distanceKm)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
