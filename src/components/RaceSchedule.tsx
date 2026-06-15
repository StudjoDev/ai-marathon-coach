import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, CalendarDays, ChevronDown, ChevronUp, Clock, ExternalLink, MapPin, Trophy } from "lucide-react";
import { races } from "../data/races";
import type { Race } from "../types";
import {
  formatRaceDate,
  formatRaceDistance,
  getRaceCategoryCounts,
  getDaysUntilRace,
  getNextRace,
  getRaceOfficialLinkLabel,
  getRacePrimaryWarning,
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
  const categoryCounts = useMemo(() => getRaceCategoryCounts(sortedRaces), [sortedRaces]);
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

      <Card>
        <div className="grid grid-cols-2 gap-3">
          <OverviewItem label="已報名" value={`${sortedRaces.length} 場`} />
          <OverviewItem label="下一場" value={nextRace ? formatRaceDate(nextRace.date) : "待確認"} />
          <OverviewItem label="賽事定位" value={`A${categoryCounts.A} / B${categoryCounts.B} / C${categoryCounts.C}`} />
          <OverviewItem label="高負荷週" value="12/12-12/13" tone="warning" />
        </div>
      </Card>

      <RacePriorityGuide />

      <div className="relative space-y-3 pl-5">
        <div className="absolute bottom-6 left-2 top-5 w-px bg-line" />
        {sortedRaces.map((race) => {
          const expanded = expandedIds.has(race.id);
          const isNextRace = nextRace?.id === race.id;
          const isHighLoadRace =
            race.id === "tigerrun-2026-10k" ||
            race.id === "sportaiwan-thanksgiving-2026-10k";
          const isPostHalfRecoveryRace = race.id === "taoyuan-bald-cypress-2026-11k";
          const daysUntil = getDaysUntilRace(race.date);
          const primaryWarning = getRacePrimaryWarning(race);
          const detailId = `race-details-${race.id}`;
          const officialLinkLabel = getRaceOfficialLinkLabel(race);

          return (
            <article
              key={race.id}
              className={cn(
                "app-card relative p-4 transition hover:border-primary/30",
                race.category === "A" ? "border-primary/40" : "",
                isNextRace ? "shadow-raised" : ""
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[29px] top-6 h-4 w-4 rounded-full border-2 border-background",
                  race.category === "A" ? "bg-primary" : race.category === "B" ? "bg-success" : "bg-race-c"
                )}
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isNextRace ? <Badge tone="success">下一場</Badge> : null}
                    {isHighLoadRace ? <Badge tone="warning">高負荷連賽週</Badge> : null}
                  {isPostHalfRecoveryRace ? <Badge tone="warning">半馬後 14 天</Badge> : null}
                  {isPostHalfRecoveryRace ? <Badge tone="muted">半馬後恢復賽</Badge> : null}
                    <Badge
                      tone={race.category === "A" ? "raceA" : race.category === "B" ? "raceB" : "raceC"}
                      variant="outline"
                    >
                      {getRacePriorityLabel(race.category)}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-tight">{race.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{Math.max(daysUntil, 0)}</p>
                  <p className="text-xs font-semibold text-muted">天</p>
                </div>
              </div>

              {primaryWarning ? (
                <div className="mt-4 flex items-start gap-2 rounded-card bg-warning/10 px-3 py-2 text-sm font-semibold leading-5 text-warning">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{primaryWarning}</span>
                </div>
              ) : null}

              <div className="mt-4 grid gap-2 text-sm">
                <InfoLine icon={<CalendarDays className="h-4 w-4" />} text={`${formatRaceDate(race.date)} ${race.dayOfWeek}`} />
                <InfoLine icon={<MapPin className="h-4 w-4" />} text={race.location} />
                <InfoLine icon={<Clock className="h-4 w-4" />} text={`報到 ${race.checkInType}｜集合 ${race.assemblyTime}`} />
                <InfoLine icon={<Clock className="h-4 w-4" />} text={`開跑 ${race.startTime}｜限時 ${race.finishLimit}`} />
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
                <div id={detailId} className="mt-4 border-t border-line pt-4">
                  <p className="text-xs font-bold text-muted">本場目標</p>
                  <p className="mt-1 text-sm font-semibold leading-5">{race.goal}</p>
                  <p className="mt-3 text-xs font-bold text-muted">比賽策略</p>
                  <div className="mt-2 grid gap-2">
                    {race.strategy.map((item) => (
                      <p key={item} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5 text-muted">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-[1fr_1fr_auto] gap-2">
                <a
                  href={race.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card border border-primary/30 bg-white px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
                  aria-label={`${race.name} ${officialLinkLabel}，另開新分頁`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {officialLinkLabel}
                </a>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedRace(race);
                  }}
                  className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                  aria-label={`${race.name} 查看詳情`}
                >
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  查看詳情
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleExpanded(race.id);
                  }}
                  className="focus-ring flex h-11 w-11 items-center justify-center rounded-card border border-line bg-white text-muted transition hover:bg-surface-soft"
                  aria-label={expanded ? "收合賽事卡片" : "展開賽事卡片"}
                  aria-expanded={expanded}
                  aria-controls={detailId}
                >
                  {expanded ? <ChevronUp className="h-5 w-5" aria-hidden="true" /> : <ChevronDown className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <TrainingPeriodization />
      <RaceDetailModal race={selectedRace} onClose={() => setSelectedRace(null)} />
    </div>
  );
}

function OverviewItem({
  label,
  value,
  tone = "primary"
}: {
  label: string;
  value: string;
  tone?: "primary" | "warning";
}) {
  return (
    <div className={cn("rounded-card px-3 py-3", tone === "warning" ? "bg-warning/10" : "bg-surface-soft")}>
      <p className={cn("text-xs font-bold", tone === "warning" ? "text-warning" : "text-muted")}>{label}</p>
      <p className="mt-1 text-base font-bold text-ink">{value}</p>
    </div>
  );
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 text-muted">
      <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">{icon}</span>
      <span className="leading-5">{text}</span>
    </div>
  );
}
