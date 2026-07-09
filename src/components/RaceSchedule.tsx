import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, CalendarDays, Clock, ExternalLink, MapPin, Trophy } from "lucide-react";
import { races } from "../data/races";
import type { Race } from "../types";
import {
  formatRaceDateRange,
  formatRaceDistance,
  getDaysUntilRace,
  getNextRace,
  getRaceModeLabel,
  getRaceOfficialLinkLabel,
  getRacePrimaryWarning,
  getRaceRegistrationLabel
} from "../utils/raceUtils";
import { RaceDetailModal } from "./RaceDetailModal";
import { Badge, Card, SectionHeader, cn } from "./common";

export function RaceSchedule() {
  const sortedRaces = useMemo(() => [...races].sort((a, b) => a.date.localeCompare(b.date)), []);
  const nextRace = useMemo(() => getNextRace(sortedRaces), [sortedRaces]);
  const primaryRace = sortedRaces.find((race) => race.category === "A");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow={`${sortedRaces.length} 場已報名`} title="賽事備忘" />

      <Card density="compact">
        <div className="grid grid-cols-3 gap-2 text-center">
          <OverviewItem label="下一場" value={nextRace ? compactRaceDate(nextRace) : "待確認"} />
          <OverviewItem label="主目標" value={primaryRace ? primaryRace.shortName : "待確認"} />
          <OverviewItem label="線上賽" value={`${sortedRaces.filter((race) => race.eventMode === "virtual").length} 場`} />
        </div>
      </Card>

      <div className="space-y-3">
        {sortedRaces.map((race) => {
          const isNextRace = nextRace?.id === race.id;
          const primaryWarning = getRacePrimaryWarning(race);
          const officialLinkLabel = getRaceOfficialLinkLabel(race);

          return (
            <article
              key={race.id}
              className={cn(
                "app-card p-4 transition hover:border-primary/30",
                isNextRace ? "border-primary/40 shadow-raised" : ""
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {isNextRace ? <Badge tone="success">下一場</Badge> : null}
                    <Badge tone={race.category === "A" ? "raceA" : race.category === "B" ? "raceB" : "raceC"} variant="outline">
                      {formatRaceDistance(race.distanceKm)}
                    </Badge>
                    <Badge tone="muted">{getRaceModeLabel(race.eventMode)}</Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-tight">{race.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-muted">{getRaceRegistrationLabel(race.registrationStatus)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-primary">{Math.max(getDaysUntilRace(race.date), 0)}</p>
                  <p className="text-xs font-semibold text-muted">天</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                <InfoLine icon={<CalendarDays className="h-4 w-4" />} text={formatRaceDateRange(race)} />
                <InfoLine icon={<MapPin className="h-4 w-4" />} text={race.eventMode === "virtual" ? race.location : race.venue} />
                <InfoLine
                  icon={<Clock className="h-4 w-4" />}
                  text={race.eventMode === "virtual" ? race.startTime : `開跑 ${race.startTime} | 限時 ${race.finishLimit}`}
                />
              </div>

              {primaryWarning ? (
                <div className="mt-4 flex items-start gap-2 rounded-card bg-warning/10 px-3 py-2 text-sm font-semibold leading-5 text-warning">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{primaryWarning}</span>
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={race.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card border border-primary/30 bg-white px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
                  aria-label={`${race.name} ${officialLinkLabel}，另開新分頁`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {officialLinkLabel}
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedRace(race)}
                  className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                  aria-label={`${race.name} 查看詳情`}
                >
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  詳情
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <RaceDetailModal race={selectedRace} onClose={() => setSelectedRace(null)} />
    </div>
  );
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-surface-soft px-2 py-3">
      <p className="text-[11px] font-bold text-muted">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-ink">{value}</p>
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

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 text-muted">
      <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">{icon}</span>
      <span className="leading-5">{text}</span>
    </div>
  );
}
