import { useEffect } from "react";
import type { ReactNode } from "react";
import { CalendarDays, Clock, ExternalLink, MapPin, X } from "lucide-react";
import type { Race } from "../types";
import {
  formatRaceDate,
  formatRaceDistance,
  getRaceCategoryStyle,
  getRacePriorityLabel,
  getRaceRegistrationLabel,
  getRaceSourceStatusLabel,
  getRaceStrategyById
} from "../utils/raceUtils";
import { RaceChecklist } from "./RaceChecklist";
import { cn } from "./common";

export function RaceDetailModal({
  race,
  onClose
}: {
  race: Race | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!race) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [race, onClose]);

  if (!race) return null;

  const strategyItems = getRaceStrategyById(race.id);
  const raceLinks = [
    { label: "官方公告", href: race.officialUrl },
    race.signupUrl ? { label: "報名頁", href: race.signupUrl } : null,
    race.backupInfoUrl ? { label: "備用資訊", href: race.backupInfoUrl } : null
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end bg-ink/36 px-3 pb-3 pt-12 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${race.name} 詳情`}
      onClick={onClose}
    >
      <div
        className="mx-auto max-h-[88svh] w-full max-w-[430px] overflow-y-auto rounded-t-[18px] bg-surface px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 shadow-[0_-18px_50px_rgba(22,35,30,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
                  getRaceCategoryStyle(race.category)
                )}
              >
                {getRacePriorityLabel(race.category)}
              </span>
              <span className="inline-flex rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                {getRaceRegistrationLabel(race.registrationStatus)}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-tight">{race.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-muted transition hover:text-ink"
            aria-label="關閉賽事詳情"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="日期" value={`${formatRaceDate(race.date)} ${race.dayOfWeek}`} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="地點" value={race.location} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="會場" value={race.venue} />
          <InfoRow icon={<Clock className="h-4 w-4" />} label="報到 / 開跑" value={`${race.reportTime} / ${race.startTime}`} />
          <InfoRow icon={<ExternalLink className="h-4 w-4" />} label="資料來源" value={getRaceSourceStatusLabel(race.sourceStatus)} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-card bg-surface-soft px-3 py-3">
            <p className="text-xs font-semibold text-muted">距離</p>
            <p className="mt-1 text-2xl font-bold">{formatRaceDistance(race.distanceKm)}</p>
          </div>
          <div className="rounded-card bg-surface-soft px-3 py-3">
            <p className="text-xs font-semibold text-muted">狀態</p>
            <p className="mt-1 text-base font-bold">{getRaceRegistrationLabel(race.registrationStatus)}</p>
          </div>
        </div>

        <section className="mt-5">
          <p className="text-xs font-bold text-muted">官方連結</p>
          <div className="mt-2 grid gap-2">
            {raceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-between gap-3 rounded-card border border-line bg-white px-3 py-2 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft"
              >
                <span>{link.label}</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <p className="text-xs font-bold text-muted">本場目標</p>
          <p className="mt-2 rounded-card bg-surface-soft px-3 py-3 text-sm font-semibold leading-6">
            {race.goal}
          </p>
        </section>

        <section className="mt-5">
          <p className="text-xs font-bold text-muted">配速策略</p>
          <p className="mt-2 text-sm leading-6 text-ink">{race.strategy}</p>
          <div className="mt-3 grid gap-2">
            {strategyItems.map((item) => (
              <div key={item} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5">
                {item}
              </div>
            ))}
          </div>
        </section>

        {race.notes.length > 0 ? (
          <section className="mt-5">
            <p className="text-xs font-bold text-muted">注意事項</p>
            <div className="mt-2 grid gap-2">
              {race.notes.map((note) => (
                <p key={note} className="text-sm leading-5 text-muted">
                  {note}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-6 border-t border-line pt-5">
          <RaceChecklist raceId={race.id} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-card bg-surface-soft px-3 py-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-muted">{label}</p>
        <p className="mt-0.5 font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
