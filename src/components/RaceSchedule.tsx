import { useMemo } from "react";
import type { ReactNode } from "react";
import { Clock, MapPin } from "lucide-react";
import { races } from "../data/races";
import type { Race } from "../types";
import { formatRaceDistance, getRaceModeLabel } from "../utils/raceUtils";
import { Badge, Card, SectionHeader } from "./common";

export function RaceSchedule() {
  const sortedRaces = useMemo(() => [...races].sort((a, b) => a.date.localeCompare(b.date)), []);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-bold text-muted">{sortedRaces.length} 場賽事</p>
        <h1 className="text-3xl font-bold tracking-normal text-ink">賽事總表</h1>
        <p className="text-sm font-medium leading-6 text-muted">
          依日期排列，只保留日期、賽事、地點、距離與時間。
        </p>
      </header>

      <section>
        <SectionHeader eyebrow="總表" title="日期與地點" />
        <Card>
          <div className="mb-2 grid grid-cols-[72px_minmax(0,1fr)_74px] gap-3 px-3 text-[11px] font-bold text-muted">
            <span>日期</span>
            <span>賽事 / 地點</span>
            <span className="text-right">K / 時間</span>
          </div>
          <div className="grid gap-2">
            {sortedRaces.map((race) => (
              <RaceSummaryRow key={race.id} race={race} />
            ))}
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader eyebrow="依序排列" title="所有賽事" />
        <div className="space-y-3">
          {sortedRaces.map((race) => (
            <article key={race.id} className="app-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={race.category === "A" ? "raceA" : race.category === "B" ? "raceB" : "raceC"} variant="outline">
                      {formatRaceDistance(race.distanceKm)}
                    </Badge>
                    <Badge tone="muted">{getRaceModeLabel(race.eventMode)}</Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-tight">{race.name}</h2>
                </div>
                <p className="shrink-0 text-right text-sm font-bold text-primary">{compactRaceDate(race)}</p>
              </div>

              <div className="mt-4 grid gap-2 text-sm font-semibold text-muted">
                <InfoLine icon={<MapPin className="h-4 w-4" />} text={race.eventMode === "virtual" ? race.location : race.venue} />
                <InfoLine icon={<Clock className="h-4 w-4" />} text={raceTimeLabel(race)} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RaceSummaryRow({ race }: { race: Race }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)_74px] gap-3 rounded-card bg-surface-soft px-3 py-3">
      <div>
        <p className="text-xs font-bold text-primary">{compactRaceDate(race)}</p>
        <p className="mt-1 text-[11px] font-semibold text-muted">{race.dayOfWeek}</p>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-5 text-ink">{race.name}</p>
        <p className="mt-1 text-xs font-semibold leading-4 text-muted">
          {race.eventMode === "virtual" ? race.location : race.venue}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-ink">{formatRaceDistance(race.distanceKm)}</p>
        <p className="mt-1 text-xs font-semibold leading-4 text-muted">{raceShortTime(race)}</p>
      </div>
    </div>
  );
}

function compactRaceDate(race: Race) {
  const start = race.date.slice(5).replace("-", "/");
  if (!race.endDate || race.endDate === race.date) {
    return start;
  }

  return `${start}-${race.endDate.slice(5).replace("-", "/")}`;
}

function raceShortTime(race: Race) {
  if (race.eventMode === "virtual") {
    return "累積";
  }

  return race.startTime
    .replace(" 第一波；", "/")
    .replace(" 第二波", "")
    .replace(/（.*$/, "");
}

function raceTimeLabel(race: Race) {
  if (race.eventMode === "virtual") {
    return `${race.startTime} | ${race.finishLimit}`;
  }

  return `開跑 ${race.startTime} | 限時 ${race.finishLimit}`;
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">{icon}</span>
      <span className="leading-5">{text}</span>
    </div>
  );
}
