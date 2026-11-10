import { ArrowRight, ArrowUpRight, LogIn, Pencil } from "lucide-react";
import { useStore } from "../data/store";
import { hasPhotos } from "../data/photos";
import { href } from "../router";
import type { Race } from "../types";
import { todayInputValue } from "../utils/dateUtils";
import {
  formatHeroDistance,
  getChecklistItems,
  getDaysUntil,
  getKeyStats,
  getMapUrl,
  getRaceTiming,
  slashDate,
  weekdayLabel
} from "../utils/raceUtils";
import { BigDistance, Eyebrow, Hero, Page, SectionTitle, StatRow, TopBar, cn, textAreaClass } from "./ui";

export function RaceMemo({ race }: { race: Race }) {
  const { getEntry, updateEntry, canEdit } = useStore();
  const today = todayInputValue();
  const entry = getEntry(race.id);
  const timing = getRaceTiming(race, today);
  const days = getDaysUntil(race.date, today);
  const checklist = getChecklistItems(race);
  const doneCount = checklist.filter((item) => entry.checklist[item]).length;
  const when =
    timing === "past" ? "已結束" : timing === "today" ? "今天" : `還有 ${days} 天`;

  return (
    <Page>
      <Hero labelledBy="race-name">
        <TopBar
          back={{ href: href.list(), label: "賽事" }}
          right={
            canEdit ? (
              <a
                href={href.edit(race.id)}
                className="focus-ring flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-white"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                編輯
              </a>
            ) : (
              <a
                href={href.login()}
                className="focus-ring flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-white"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                登入編輯
              </a>
            )
          }
        />
        <div className="mt-7">
          <Eyebrow>
            {slashDate(race.date)} {weekdayLabel(race.date)} · {when}
          </Eyebrow>
        </div>
        <h1 id="race-name" className="mt-2 text-[28px] font-black leading-snug">
          {race.name}
        </h1>
        <BigDistance value={formatHeroDistance(race.distanceKm)} note={race.distanceNote} />
        <StatRow stats={getKeyStats(race)} />
      </Hero>

      <div className="flex flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-2">
        <dl>
          <InfoRow label="報到方式" value={race.checkInSummary} />
          <div className="flex min-h-14 items-center justify-between gap-4 border-b border-line">
            <dt className="shrink-0 text-[15px] text-muted">地點</dt>
            <dd className="min-w-0 text-right text-[15px] font-bold">
              {race.eventMode === "virtual" ? (
                race.venue
              ) : (
                <a
                  href={getMapUrl(race)}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-1 rounded text-accent-ink"
                >
                  {race.venue}
                  <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                </a>
              )}
            </dd>
          </div>
        </dl>

        {race.memo.length > 0 ? (
          <section aria-labelledby="heads-up" className="mt-9">
            <h2 id="heads-up" className="mb-1 flex items-baseline justify-between">
              <span className="text-xl font-black">注意</span>
              <span className="font-display text-base font-bold tracking-[1px] text-muted">HEADS UP</span>
            </h2>
            <ol>
              {race.memo.map((item, index) => (
                <li key={item} className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline border-b border-line py-3.5">
                  <span className="font-display text-2xl font-extrabold italic text-accent-ink">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-normal">{item}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section aria-label="清單" className="mt-9">
          <SectionTitle title="清單" tag={<span className="text-lg tabular-nums text-ink">{doneCount} / {checklist.length}</span>} />
          {checklist.map((item) => {
            const checked = Boolean(entry.checklist[item]);
            return (
              <label
                key={item}
                className={cn("flex min-h-[52px] items-center gap-3.5 border-b border-line", canEdit && "cursor-pointer")}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!canEdit}
                  onChange={() => updateEntry(race.id, { checklist: { ...entry.checklist, [item]: !checked } })}
                  className="h-[22px] w-[22px] shrink-0 accent-ink"
                />
                <span className={cn("text-[15px]", checked && "text-muted line-through")}>{item}</span>
              </label>
            );
          })}
        </section>

        {canEdit ? (
          <>
            <label htmlFor="memo" className="mb-2.5 mt-9 flex items-baseline justify-between">
              <span className="text-xl font-black">我的備忘</span>
              <span className="font-display text-base font-bold tracking-[1px] text-muted">NOTES</span>
            </label>
            <textarea
              id="memo"
              rows={4}
              value={entry.note}
              onChange={(event) => updateEntry(race.id, { note: event.target.value })}
              placeholder="幾點出門、怎麼去、跟誰約"
              className={textAreaClass}
            />
          </>
        ) : entry.note ? (
          <section aria-label="備忘" className="mt-9">
            <SectionTitle title="備忘" tag="NOTES" />
            <p className="mt-2 whitespace-pre-line rounded-[14px] bg-soft p-3.5 text-[15px] leading-normal">{entry.note}</p>
          </section>
        ) : null}

        {timing !== "upcoming" ? (
          <a
            href={href.record(race.id)}
            className="focus-ring mt-8 flex min-h-[52px] items-center justify-between rounded-full bg-ink px-5 text-base font-bold text-white"
          >
            {hasPhotos(race.id) ? "完賽紀錄與照片" : canEdit ? "填寫完賽紀錄" : "查看完賽紀錄"}
            <ArrowRight className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
          </a>
        ) : null}

        {race.officialUrl ? (
          <a
            href={race.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-6 flex min-h-11 items-center gap-1 self-start rounded text-[15px] font-bold text-accent-ink"
          >
            官方網站
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </Page>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 border-b border-line">
      <dt className="shrink-0 text-[15px] text-muted">{label}</dt>
      <dd className="min-w-0 text-right text-[15px] font-bold">{value}</dd>
    </div>
  );
}
