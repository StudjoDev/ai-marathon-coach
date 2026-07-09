import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, ExternalLink, MapPin, X } from "lucide-react";
import type { Race } from "../types";
import {
  formatRaceDateRange,
  formatRaceDistance,
  getRaceModeLabel,
  getRaceOfficialLinkLabel,
  getRacePrimaryWarning,
  getRaceRegistrationLabel,
  getRaceSourceStatusLabel
} from "../utils/raceUtils";
import { RaceChecklist } from "./RaceChecklist";
import { Badge } from "./common";

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
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone={race.category === "A" ? "raceA" : race.category === "B" ? "raceB" : "raceC"} variant="outline">
                {formatRaceDistance(race.distanceKm)}
              </Badge>
              <Badge tone="muted">{getRaceModeLabel(race.eventMode)}</Badge>
              <Badge tone="success">{getRaceRegistrationLabel(race.registrationStatus)}</Badge>
            </div>
            <h2 id={titleId} className="mt-3 text-2xl font-bold leading-tight">{race.name}</h2>
            <p className="mt-2 text-sm font-semibold leading-5 text-muted">{race.goal}</p>
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

        <section className="mt-5">
          <h3 className="text-sm font-bold text-ink">關鍵資訊</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="日期" value={formatRaceDateRange(race)} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label={race.eventMode === "virtual" ? "形式" : "地點"} value={race.locationDetail} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="報到" value={race.checkInType} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label={race.eventMode === "virtual" ? "紀錄期間" : "開跑 / 限時"} value={race.eventMode === "virtual" ? race.startTime : `${race.startTime} / ${race.finishLimit}`} />
            <InfoRow icon={<CheckCircle2 className="h-4 w-4" />} label="備忘" value={race.checkInNote} />
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-bold text-ink">官方連結</h3>
          <div className="mt-3 grid gap-2">
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
            {raceLinks.slice(1).map((link) => (
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

        {race.warnings.length > 0 ? (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-bold text-ink">賽前提醒</h3>
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

        <details className="mt-5 rounded-card bg-surface-soft px-3 py-3">
          <summary className="cursor-pointer text-sm font-bold text-muted">來源備註</summary>
          <p className="mt-2 text-sm leading-6 text-muted">
            {getRaceSourceStatusLabel(race.sourceStatus)}。{race.sourceNote}
          </p>
        </details>

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
      <span className="mt-0.5 text-primary" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-muted">{label}</p>
        <p className="mt-0.5 font-semibold leading-5 text-ink">{value}</p>
      </div>
    </div>
  );
}
