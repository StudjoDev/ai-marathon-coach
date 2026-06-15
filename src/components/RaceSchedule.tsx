import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays, ChevronDown, ChevronUp, Clock, MapPin, Trophy } from "lucide-react";
import { races } from "../data/races";
import type { Race } from "../types";
import {
  formatRaceDate,
  formatRaceDistance,
  getDaysUntilRace,
  getNextRace,
  getRaceCategoryStyle,
  getRacePriorityLabel,
  getRaceRegistrationLabel,
  getRaceSourceStatusLabel
} from "../utils/raceUtils";
import { RaceDetailModal } from "./RaceDetailModal";
import { RacePriorityGuide } from "./RacePriorityGuide";
import { TrainingPeriodization } from "./TrainingPeriodization";
import { Badge, Card, SectionHeader, cn } from "./common";

export function RaceSchedule() {
  const nextRace = useMemo(() => getNextRace(races), []);
  const sortedRaces = useMemo(() => [...races].sort((a, b) => a.date.localeCompare(b.date)), []);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(sortedRaces.filter((race) => race.category === "A" || race.id === nextRace?.id).map((race) => race.id))
  );
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  function toggleExpanded(raceId: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(raceId)) {
        next.delete(raceId);
      } else {
        next.add(raceId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <SectionHeader eyebrow="已報名賽事" title="賽事時間軸" />

      <div className="relative space-y-3 pl-5">
        <div className="absolute bottom-6 left-2 top-5 w-px bg-line" />
        {sortedRaces.map((race) => {
          const expanded = expandedIds.has(race.id);
          const isNextRace = nextRace?.id === race.id;
          const daysUntil = getDaysUntilRace(race.date);

          return (
            <article
              key={race.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedRace(race)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedRace(race);
                }
              }}
              className={cn(
                "app-card relative cursor-pointer p-4 transition hover:border-primary/30",
                race.category === "A" ? "border-primary/40" : "",
                isNextRace ? "shadow-[0_14px_34px_rgba(47,111,100,0.13)]" : ""
              )}
            >
              <span
                className={cn(
                  "absolute -left-[29px] top-6 h-4 w-4 rounded-full border-2 border-background",
                  race.category === "A" ? "bg-primary" : race.category === "B" ? "bg-success" : "bg-[#8E7AA3]"
                )}
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isNextRace ? <Badge tone="success">下一場</Badge> : null}
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
                        getRaceCategoryStyle(race.category)
                      )}
                    >
                      {getRacePriorityLabel(race.category)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-tight">{race.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{Math.max(daysUntil, 0)}</p>
                  <p className="text-xs font-semibold text-muted">天</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                <InfoLine icon={<CalendarDays className="h-4 w-4" />} text={`${formatRaceDate(race.date)} ${race.dayOfWeek}`} />
                <InfoLine icon={<MapPin className="h-4 w-4" />} text={race.location} />
                <InfoLine icon={<Clock className="h-4 w-4" />} text={`報到 ${race.reportTime}｜開跑 ${race.startTime}`} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-card bg-surface-soft px-3 py-2">
                <span className="text-sm font-bold">{formatRaceDistance(race.distanceKm)}</span>
                <div className="text-right">
                  <p className="text-xs font-bold text-success">{getRaceRegistrationLabel(race.registrationStatus)}</p>
                  <p className="mt-0.5 text-[11px] font-semibold leading-4 text-muted">
                    {getRaceSourceStatusLabel(race.sourceStatus)}
                  </p>
                </div>
              </div>

              {expanded ? (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-xs font-bold text-muted">本場目標</p>
                  <p className="mt-1 text-sm font-semibold leading-5">{race.goal}</p>
                  <p className="mt-3 text-xs font-bold text-muted">比賽策略</p>
                  <p className="mt-1 text-sm leading-5 text-muted">{race.strategy}</p>
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedRace(race);
                  }}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-card bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                  <Trophy className="h-4 w-4" />
                  查看詳情
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleExpanded(race.id);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-card border border-line bg-white text-muted transition hover:bg-surface-soft"
                  aria-label={expanded ? "收合賽事卡片" : "展開賽事卡片"}
                >
                  {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <RacePriorityGuide />
      <TrainingPeriodization />
      <RaceDetailModal race={selectedRace} onClose={() => setSelectedRace(null)} />
    </div>
  );
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 text-muted">
      <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
      <span className="leading-5">{text}</span>
    </div>
  );
}
