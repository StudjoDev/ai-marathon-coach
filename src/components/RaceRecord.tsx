import { useStore } from "../data/store";
import { href } from "../router";
import type { Race, RaceResult } from "../types";
import { formatHeroDistance, slashDate, weekdayLabel } from "../utils/raceUtils";
import { BigDistance, Eyebrow, Hero, Page, TopBar, cn, textAreaClass } from "./ui";
import { PhotoPreview } from "./PhotoPreview";

const results: Array<{ value: RaceResult; label: string }> = [
  { value: "finished", label: "完賽" },
  { value: "dnf", label: "未完賽" },
  { value: "dns", label: "沒出賽" }
];

export function RaceRecord({ race }: { race: Race }) {
  const { getEntry, updateEntry, mode, canEdit } = useStore();
  const entry = getEntry(race.id);

  return (
    <Page>
      <Hero labelledBy="race-name">
        <TopBar back={{ href: href.list(), label: "賽事" }} />
        <div className="mt-7">
          <Eyebrow>
            {entry.result === "finished" ? "FINISHED" : "RESULT"} · {slashDate(race.date)} {weekdayLabel(race.date)}
          </Eyebrow>
        </div>
        <h1 id="race-name" className="mt-2 text-[28px] font-black leading-snug">
          {race.name}
        </h1>
        <BigDistance value={formatHeroDistance(race.distanceKm)} size="md" />
        <p className="mt-3 text-[13px] text-muted-dark">{race.venue}</p>
      </Hero>

      {!canEdit ? (
        <ReadOnlyRecord race={race} />
      ) : (
      <div className="flex flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-7">
        <label htmlFor="finish" className="flex items-baseline justify-between">
          <span className="text-xl font-black">完賽時間</span>
          <span className="font-display text-base font-bold tracking-[1px] text-muted">FINISH TIME</span>
        </label>
        <input
          id="finish"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="0:00:00"
          value={entry.finishTime}
          disabled={entry.result === "dns"}
          onChange={(event) => updateEntry(race.id, { finishTime: event.target.value.replace(/[^\d:]/g, "") })}
          className="focus-ring mt-1.5 w-full border-0 border-b-2 border-ink bg-transparent pb-2 pt-1 font-display text-[64px] font-extrabold italic tabular-nums tracking-[-1px] text-ink placeholder:text-[#C9C9C9] disabled:opacity-40"
        />

        <fieldset className="mt-8">
          <legend className="mb-3 text-xl font-black">結果</legend>
          <div className="grid grid-cols-3 gap-2">
            {results.map((option) => {
              const selected = entry.result === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center justify-center rounded-full text-[15px] transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                    selected ? "bg-ink font-bold text-white" : "bg-soft text-ink"
                  )}
                >
                  <input
                    type="radio"
                    name="result"
                    value={option.value}
                    checked={selected}
                    onChange={() => updateEntry(race.id, { result: option.value })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <PhotoPreview raceId={race.id} />

        <label htmlFor="reflection" className="mb-2.5 mt-9 flex items-baseline justify-between">
          <span className="text-xl font-black">心得</span>
          <span className="font-display text-base font-bold tracking-[1px] text-muted">NOTES</span>
        </label>
        <textarea
          id="reflection"
          rows={5}
          value={entry.reflection}
          onChange={(event) => updateEntry(race.id, { reflection: event.target.value })}
          placeholder="天氣、路線、下次想記得的事"
          className={textAreaClass}
        />

        <p className="mt-4 text-[13px] text-muted">
          {mode === "cloud" ? "輸入後會自動同步到後台。" : "輸入後會自動存在這台裝置。"}
        </p>

        <a
          href={href.race(race.id)}
          className="focus-ring mt-6 flex min-h-11 items-center self-start rounded text-[15px] font-bold text-accent-ink"
        >
          查看賽事備忘
        </a>
      </div>
      )}
    </Page>
  );
}

function ReadOnlyRecord({ race }: { race: Race }) {
  const { getEntry } = useStore();
  const entry = getEntry(race.id);
  const resultLabel = results.find((option) => option.value === entry.result)?.label;
  const hasRecord = Boolean(entry.finishTime || entry.reflection || entry.result !== "finished");

  return (
    <div className="flex flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-7">
      {hasRecord ? (
        <>
          <p className="flex items-baseline justify-between">
            <span className="text-xl font-black">完賽時間</span>
            <span className="font-display text-base font-bold tracking-[1px] text-muted">FINISH TIME</span>
          </p>
          <p className="mt-1.5 border-b-2 border-ink pb-2 font-display text-[64px] font-extrabold italic tabular-nums tracking-[-1px]">
            {entry.result === "finished" ? entry.finishTime || "—" : resultLabel}
          </p>
        </>
      ) : (
        <p className="text-[15px] text-muted">還沒有填寫完賽紀錄。</p>
      )}

      <PhotoPreview raceId={race.id} />

      {entry.reflection ? (
        <section aria-label="心得" className="mt-9">
          <p className="mb-2.5 text-xl font-black">心得</p>
          <p className="whitespace-pre-line rounded-[14px] bg-soft p-3.5 text-[15px] leading-normal">{entry.reflection}</p>
        </section>
      ) : null}

      <a
        href={href.race(race.id)}
        className="focus-ring mt-6 flex min-h-11 items-center self-start rounded text-[15px] font-bold text-accent-ink"
      >
        查看賽事備忘
      </a>
    </div>
  );
}
