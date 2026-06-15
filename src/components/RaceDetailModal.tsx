import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CalendarDays, Clock, ExternalLink, MapPin, X } from "lucide-react";
import type { Race } from "../types";
import {
  formatRaceDate,
  formatRaceDistance,
  getRaceCategoryStyle,
  getRaceOfficialLinkLabel,
  getRacePrimaryWarning,
  getRacePriorityLabel,
  getRaceRegistrationLabel,
  getRaceSourceStatusLabel
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
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!race) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      if (!panel) return;

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [race, onClose]);

  if (!race) return null;

  const raceLinks = [
    { label: getRaceOfficialLinkLabel(race), href: race.officialUrl },
    race.signupUrl ? { label: "報名頁", href: race.signupUrl } : null,
    race.backupInfoUrl ? { label: race.backupInfoUrl.includes("sportsnet") ? "路協賽事表" : "備用資訊", href: race.backupInfoUrl } : null
  ].filter((link): link is { label: string; href: string } => link !== null);
  const isPostHalfRecoveryRace = race.id === "taoyuan-bald-cypress-2026-11k";
  const primaryWarning = getRacePrimaryWarning(race);
  const titleId = `race-detail-title-${race.id}`;
  const officialLinkLabel = getRaceOfficialLinkLabel(race);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end bg-ink/36 px-3 pb-3 pt-12 backdrop-blur-sm"
      data-testid="race-detail-modal"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="mx-auto max-h-[88svh] w-full max-w-[430px] overflow-y-auto rounded-t-sheet bg-surface px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 shadow-modal"
        data-testid="race-detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", getRaceCategoryStyle(race.category))}>
                {getRacePriorityLabel(race.category)}
              </span>
              <span className="inline-flex rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                {getRaceRegistrationLabel(race.registrationStatus)}
              </span>
              {isPostHalfRecoveryRace ? (
                <span className="inline-flex rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-bold text-warning">
                  半馬後恢復賽
                </span>
              ) : null}
            </div>
            <h2 id={titleId} className="mt-3 text-2xl font-bold leading-tight">{race.name}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-muted transition hover:text-ink"
            aria-label="關閉賽事詳情"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {primaryWarning ? (
          <div className="mt-4 flex items-start gap-2 rounded-card bg-warning/10 px-3 py-2 text-sm font-semibold leading-5 text-warning">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{primaryWarning}</span>
          </div>
        ) : null}

        <div className="mt-4 grid gap-2">
          <a
            href={race.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
            aria-label={`${race.name} ${officialLinkLabel}，另開新分頁`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            前往{officialLinkLabel}
          </a>
          {race.signupUrl ? (
            <a
              href={race.signupUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-card border border-line bg-white px-4 py-2 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft"
              aria-label={`${race.name} 報名頁，另開新分頁`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              前往報名頁
            </a>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="日期" value={`${formatRaceDate(race.date)} ${race.dayOfWeek}`} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="地點" value={race.locationDetail} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="會場" value={race.venue} />
          <InfoRow icon={<Clock className="h-4 w-4" />} label="報到方式" value={race.checkInType} />
          <InfoRow icon={<Clock className="h-4 w-4" />} label="報到提醒" value={race.checkInNote} />
          <InfoRow icon={<Clock className="h-4 w-4" />} label="集合時間" value={race.assemblyTime} />
          <InfoRow icon={<Clock className="h-4 w-4" />} label="寄物" value={race.bagDropInfo} />
          <InfoRow icon={<Clock className="h-4 w-4" />} label="開跑 / 限時" value={`${race.startTime} / ${race.finishLimit}`} />
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
                className="focus-ring flex min-h-11 items-center justify-between gap-3 rounded-card border border-line bg-white px-3 py-2 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-surface-soft"
                aria-label={`${race.name} ${link.label}，另開新分頁`}
              >
                <span>{link.label}</span>
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
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
          <div className="mt-3 grid gap-2">
            {race.strategy.map((item) => (
              <div key={item} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5">
                {item}
              </div>
            ))}
          </div>
        </section>

        {race.warnings.length > 0 ? (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-xs font-bold text-muted">賽前提醒</p>
            </div>
            <div className="grid gap-2">
              {race.warnings.map((warning) => (
                <p key={warning} className="rounded-card bg-warning/10 px-3 py-2 text-sm font-semibold leading-5 text-warning">
                  {warning}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-5">
          <p className="text-xs font-bold text-muted">來源備註</p>
          <p className="mt-2 rounded-card bg-surface-soft px-3 py-3 text-sm leading-6 text-muted">
            {race.sourceNote}
          </p>
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
          <RaceChecklist race={race} />
        </div>
      </div>
    </div>,
    document.body
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
