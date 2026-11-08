import { ArrowRight, LogIn, Plus } from "lucide-react";
import { useStore } from "../data/store";
import { href } from "../router";
import type { Race } from "../types";
import { todayInputValue } from "../utils/dateUtils";
import {
  dayLabel,
  dotDate,
  formatHeroDistance,
  getDaysUntil,
  getKeyStats,
  getRaceSubtitle,
  getRaceTiming,
  isBackToBack,
  monthLabel,
  splitRaces
} from "../utils/raceUtils";
import { BigDistance, Eyebrow, Hero, Page, SectionTitle, StatRow } from "./ui";
import { SyncFooter } from "./SyncFooter";

export function RaceList() {
  const { races, getEntry, canEdit } = useStore();
  const today = todayInputValue();
  const { current, past } = splitRaces(races, today);
  const [featured, ...upcoming] = current;
  const finished = past.filter((race) => !["dnf", "dns"].includes(getEntry(race.id).result));
  const finishedKm = finished.reduce((sum, race) => sum + race.distanceKm, 0);

  return (
    <Page>
      <Hero labelledBy="hero-name">
        <div className="flex min-h-11 items-center justify-between">
          <span className="font-display text-xl font-extrabold tracking-[2px]">RACES</span>
          {canEdit ? (
            <a
              href={href.new()}
              className="focus-ring flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              新增賽事
            </a>
          ) : (
            <a
              href={href.login()}
              className="focus-ring flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-white"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              登入編輯
            </a>
          )}
        </div>

        {featured ? <FeaturedRace race={featured} today={today} /> : <EmptyHero />}
      </Hero>

      <dl aria-label="本季統計" className="grid grid-cols-3 border-b border-line p-5">
        <Stat label="已報名" value={String(races.length)} />
        <Stat label="已完成" value={String(finished.length)} />
        <Stat label="已完賽距離" value={finishedKm.toFixed(1)} unit="KM" />
      </dl>

      <div className="flex flex-col px-5 pb-6 pt-7">
        {upcoming.length > 0 ? (
          <section aria-label="即將到來" className="mb-9">
            <SectionTitle title="即將到來" tag={`UPCOMING · ${upcoming.length}`} />
            {upcoming.map((race) => (
              <UpcomingRow key={race.id} race={race} today={today} backToBack={isBackToBack(race, races)} />
            ))}
          </section>
        ) : null}

        {past.length > 0 ? (
          <section aria-label="已完成">
            <SectionTitle title="已完成" tag={`FINISHED · ${past.length}`} />
            {past.map((race) => (
              <PastRow key={race.id} race={race} />
            ))}
          </section>
        ) : null}
      </div>

      <SyncFooter />
    </Page>
  );
}

function FeaturedRace({ race, today }: { race: Race; today: string }) {
  const timing = getRaceTiming(race, today);
  const days = getDaysUntil(race.date, today);
  const eyebrow =
    timing === "today"
      ? race.eventMode === "virtual" && race.endDate !== race.date
        ? "NOW · 活動進行中"
        : "TODAY · 今天比賽"
      : `NEXT · 還有 ${days} 天`;

  return (
    <>
      <div className="mt-10">
        <Eyebrow dot={timing === "today"}>{eyebrow}</Eyebrow>
      </div>
      <h1 id="hero-name" className="mt-2 text-[34px] font-black leading-tight">
        {race.shortName}
      </h1>
      <BigDistance value={formatHeroDistance(race.distanceKm)} />
      <StatRow stats={getKeyStats(race)} />
      <a
        href={href.race(race.id)}
        className="focus-ring mt-6 flex min-h-[52px] items-center justify-between rounded-full bg-accent px-5 text-base font-bold text-ink"
      >
        查看賽事備忘
        <ArrowRight className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
      </a>
    </>
  );
}

function EmptyHero() {
  return (
    <div className="mt-10">
      <Eyebrow>NEXT</Eyebrow>
      <h1 id="hero-name" className="mt-2 text-[34px] font-black leading-tight">
        還沒有下一場
      </h1>
      <p className="mt-2 text-sm text-muted-dark">報名新賽事後，登入並點右上角新增。</p>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col-reverse justify-end">
      <dt className="mt-1 text-xs text-muted">{label}</dt>
      <dd className="font-display text-4xl font-extrabold italic leading-none">
        {value}
        {unit ? <span className="text-lg text-muted"> {unit}</span> : null}
      </dd>
    </div>
  );
}

function UpcomingRow({ race, today, backToBack }: { race: Race; today: string; backToBack: boolean }) {
  return (
    <a href={href.race(race.id)} className="row-link">
      <span className="font-display leading-none">
        <span className="block text-[13px] font-semibold tracking-[1px] text-muted">{monthLabel(race.date)}</span>
        <span className="block text-[32px] font-extrabold">{dayLabel(race.date)}</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-bold">{race.shortName}</span>
        <span className="mt-0.5 block text-[13px] text-muted">
          {getRaceSubtitle(race)}
          {backToBack ? <span className="font-bold text-accent-ink"> · 連賽</span> : null}
        </span>
      </span>
      <span className="font-display text-[22px] font-extrabold italic">
        {getDaysUntil(race.date, today)}
        <span className="font-sans text-sm font-semibold not-italic text-muted"> 天</span>
      </span>
    </a>
  );
}

function PastRow({ race }: { race: Race }) {
  const { getEntry, canEdit } = useStore();
  const entry = getEntry(race.id);
  const resultLabel =
    entry.result === "dns" ? "沒出賽" : entry.result === "dnf" ? "未完賽" : entry.finishTime || undefined;

  return (
    <a href={href.record(race.id)} className="row-link min-h-[68px]">
      <span className="font-display text-xl font-bold text-muted">{dotDate(race.date)}</span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-medium">{race.shortName}</span>
        <span className="mt-0.5 block text-[13px] text-muted">{getRaceSubtitle(race)}</span>
      </span>
      {resultLabel ? (
        <span className="font-display text-xl font-bold tabular-nums">{resultLabel}</span>
      ) : canEdit ? (
        <span className="text-sm font-bold text-accent-ink">填成績</span>
      ) : (
        <span aria-hidden="true" className="font-display text-xl font-bold text-muted">—</span>
      )}
    </a>
  );
}
