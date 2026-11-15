import { Fragment, useEffect, useState, type ReactNode } from "react";
import { href } from "../router";
import type { Race } from "../types";
import {
  HALF_MARATHON_KM,
  MARATHON_KM,
  formatDuration,
  formatKm,
  formatPace,
  getSplits,
  splitSeconds,
  toDistance,
  toSeconds,
  toStandardDistance,
  type CalcMode
} from "../utils/paceUtils";
import { formatDistance } from "../utils/raceUtils";
import { Eyebrow, Hero, Page, SectionTitle, StatRow, TopBar, cn } from "./ui";

type Fields = {
  mode: CalcMode;
  distance: string;
  timeH: string;
  timeM: string;
  timeS: string;
  paceM: string;
  paceS: string;
};

const STORAGE_KEY = "race-memo:pace-calculator";

const defaults: Fields = {
  mode: "pace",
  distance: String(MARATHON_KM),
  timeH: "",
  timeM: "",
  timeS: "",
  paceM: "",
  paceS: ""
};

const modes: Array<{ value: CalcMode; label: string }> = [
  { value: "pace", label: "算配速" },
  { value: "time", label: "算時間" },
  { value: "distance", label: "算距離" }
];

const result: Record<CalcMode, { eyebrow: string; unit: string; hint: string }> = {
  pace: { eyebrow: "PACE · 每公里配速", unit: "/KM", hint: "填入距離和時間，算出每公里要跑多快。" },
  time: { eyebrow: "TIME · 完賽時間", unit: "", hint: "填入距離和配速，算出跑完要多久。" },
  distance: { eyebrow: "DISTANCE · 距離", unit: "KM", hint: "填入時間和配速，算出能跑多遠。" }
};

const presets = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "半馬", km: HALF_MARATHON_KM },
  { label: "全馬", km: MARATHON_KM }
];

function loadFields(race?: Race): Fields {
  let saved: Partial<Fields> = {};
  try {
    saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<Fields>;
  } catch {
    // 讀不到上次的數字就用預設值
  }

  const fields = { ...defaults, ...saved };
  if (!race) return fields;

  // 從賽事頁進來：距離用這場的，不拿來當要算的項目
  const distance = formatKm(toStandardDistance(race.distanceKm), 4);
  const sameDistance = toDistance(fields.distance) === toDistance(distance);
  return {
    ...fields,
    distance,
    mode: fields.mode === "distance" ? "pace" : fields.mode,
    // 上次的時間是別的距離跑出來的，換了距離就不適用；配速可以沿用
    ...(sameDistance ? {} : { timeH: "", timeM: "", timeS: "" })
  };
}

const digits = (text: string, max: number) => text.replace(/\D/g, "").slice(0, max);

function decimal(text: string) {
  const [whole, ...rest] = text.replace(/,/g, ".").replace(/[^\d.]/g, "").split(".");
  return (rest.length > 0 ? `${whole}.${rest.join("")}` : whole).slice(0, 8);
}

export function PaceCalculator({ race }: { race?: Race }) {
  const [fields, setFields] = useState(() => loadFields(race));
  const { mode } = fields;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {
      // 私密模式或空間不足：這次先不記
    }
  }, [fields]);

  const distanceInput = toDistance(fields.distance);
  const timeInput = toSeconds([fields.timeH, fields.timeM, fields.timeS]);
  const paceInput = toSeconds([fields.paceM, fields.paceS]);

  const distance = mode === "distance" ? (timeInput && paceInput ? timeInput / paceInput : undefined) : distanceInput;
  const time = mode === "time" ? (distanceInput && paceInput ? distanceInput * paceInput : undefined) : timeInput;
  const pace = mode === "pace" ? (distanceInput && timeInput ? timeInput / distanceInput : undefined) : paceInput;
  const ready = distance !== undefined && time !== undefined && pace !== undefined;

  const answer = !ready ? undefined : mode === "pace" ? formatPace(pace) : mode === "time" ? formatDuration(time) : formatKm(distance);
  const placeholder = mode === "pace" ? "0:00" : mode === "time" ? "0:00:00" : "0";

  function set(patch: Partial<Fields>) {
    setFields((current) => ({ ...current, ...patch }));
  }

  /** 換要算的項目時，把剛算出的結果帶進欄位，數字才接得上 */
  function switchMode(next: CalcMode) {
    if (next === mode) return;
    const patch: Partial<Fields> = { mode: next };
    if (ready && mode === "pace") {
      const parts = splitSeconds(pace);
      patch.paceM = String(Number(parts.hours) * 60 + Number(parts.minutes));
      patch.paceS = parts.seconds;
    }
    if (ready && mode === "time") {
      const parts = splitSeconds(time);
      patch.timeH = parts.hours;
      patch.timeM = parts.minutes;
      patch.timeS = parts.seconds;
    }
    if (ready && mode === "distance") patch.distance = formatKm(distance);
    set(patch);
  }

  const raceKm = race ? toStandardDistance(race.distanceKm) : undefined;
  const distancePresets =
    raceKm !== undefined && !presets.some((preset) => preset.km === raceKm)
      ? [...presets, { label: `${formatKm(raceKm)}K`, km: raceKm }].sort((a, b) => a.km - b.km)
      : presets;

  const stats = ready
    ? [
        { label: "時速 KM/H", value: (3600 / pace).toFixed(1) },
        { label: "操場一圈 400M", value: formatPace(pace * 0.4) }
      ]
    : [];

  // 要算的那一項排最前面：手機鍵盤彈出來時，結果還看得到
  const groups: Record<CalcMode, ReactNode> = {
    distance: (
      <Group label="距離" computed={mode === "distance"}>
        {mode === "distance" ? (
          <Computed value={distance !== undefined ? formatKm(distance) : undefined} unit="公里" />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <NumberBox
                  label="距離（公里）"
                  unit="公里"
                  value={fields.distance}
                  onChange={(value) => set({ distance: decimal(value) })}
                  placeholder="0"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {distancePresets.map((preset) => {
                const active = distanceInput !== undefined && Math.abs(distanceInput - preset.km) < 0.0001;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set({ distance: String(preset.km) })}
                    className={cn(
                      "focus-ring min-h-11 rounded-full px-4 text-sm",
                      active ? "bg-ink font-bold text-white" : "bg-soft"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Group>
    ),
    time: (
      <Group label="時間" computed={mode === "time"}>
        {mode === "time" ? (
          <Computed value={time !== undefined ? formatDuration(time) : undefined} />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <NumberBox label="時間：小時" unit="時" value={fields.timeH} onChange={(value) => set({ timeH: digits(value, 2) })} placeholder="0" />
            <NumberBox label="時間：分鐘" unit="分" value={fields.timeM} onChange={(value) => set({ timeM: digits(value, 2) })} placeholder="00" />
            <NumberBox label="時間：秒" unit="秒" value={fields.timeS} onChange={(value) => set({ timeS: digits(value, 2) })} placeholder="00" />
          </div>
        )}
      </Group>
    ),
    pace: (
      <Group label="配速（每公里）" computed={mode === "pace"}>
        {mode === "pace" ? (
          <Computed value={pace !== undefined ? formatPace(pace) : undefined} unit="/公里" />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <NumberBox label="配速：分鐘" unit="分" value={fields.paceM} onChange={(value) => set({ paceM: digits(value, 2) })} placeholder="0" />
            <NumberBox label="配速：秒" unit="秒" value={fields.paceS} onChange={(value) => set({ paceS: digits(value, 2) })} placeholder="00" />
          </div>
        )}
      </Group>
    )
  };
  const order = (["distance", "time", "pace"] as const).slice().sort((a, b) => Number(b === mode) - Number(a === mode));

  return (
    <Page>
      <Hero labelledBy="calc-title">
        <TopBar back={race ? { href: href.race(race.id), label: "返回" } : { href: href.list(), label: "賽事" }} />
        <h1 id="calc-title" className="mt-6 text-[28px] font-black leading-snug">
          配速計算機
        </h1>
        {race ? (
          <p className="mt-1 text-[13px] text-muted-dark">
            {race.shortName} · {formatDistance(race.distanceKm)}
          </p>
        ) : null}

        <div className="mt-6">
          <Eyebrow>{result[mode].eyebrow}</Eyebrow>
        </div>
        <p aria-live="polite" className="mt-1 flex items-baseline gap-1.5 font-display font-extrabold italic leading-[0.9]">
          <span className={cn("text-[96px] tracking-[-3px] tabular-nums", !answer && "text-muted")}>
            {answer ?? placeholder}
          </span>
          {result[mode].unit ? <span className="text-[30px] text-muted-dark">{result[mode].unit}</span> : null}
        </p>
        {ready ? <StatRow stats={stats} /> : <p className="mt-5 border-t border-line-dark pt-4 text-sm text-muted-dark">{result[mode].hint}</p>}
      </Hero>

      <div className="flex flex-col gap-6 px-5 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-7">
        <fieldset>
          <legend className={labelClass}>我想算</legend>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center rounded-full text-[15px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                  mode === option.value ? "bg-ink font-bold text-white" : "bg-soft"
                )}
              >
                <input
                  type="radio"
                  name="calc-mode"
                  checked={mode === option.value}
                  onChange={() => switchMode(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        {order.map((key) => (
          <Fragment key={key}>{groups[key]}</Fragment>
        ))}

        {ready ? (
          <section aria-label="分段時間" className="mt-3">
            <SectionTitle title="分段時間" tag="SPLITS" />
            <p className="mb-1 text-[13px] text-muted">全程等速跑，各點的通過時間。</p>
            <ol>
              {getSplits(distance, pace).map((split) => (
                <li
                  key={`${split.kind}-${split.km}`}
                  className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line"
                >
                  <span className={cn("text-[15px]", split.kind === "finish" ? "font-bold" : "text-muted")}>
                    {split.kind === "finish" ? "終點 · " : split.kind === "half" ? "半程 · " : ""}
                    <span className="font-display text-xl font-bold text-ink">{formatKm(split.km, split.kind === "half" ? 1 : 3)}K</span>
                  </span>
                  <span
                    className={cn(
                      "font-display text-[22px] tabular-nums",
                      split.kind === "finish" ? "font-extrabold text-accent-ink" : "font-bold"
                    )}
                  >
                    {formatDuration(split.seconds)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </Page>
  );
}

const labelClass = "mb-2 block text-[13px] font-bold text-muted";

function Group({ label, computed, children }: { label: string; computed: boolean; children: ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className={cn(labelClass, "flex items-baseline justify-between")}>
        {label}
        {computed ? <span className="text-accent-ink">自動計算</span> : null}
      </p>
      {children}
    </div>
  );
}

function NumberBox({
  label,
  unit,
  value,
  onChange,
  placeholder,
  inputMode = "numeric"
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <label className="flex min-h-14 cursor-text items-baseline gap-1.5 rounded-xl bg-soft px-3.5 py-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
      <input
        aria-label={label}
        inputMode={inputMode}
        autoComplete="off"
        enterKeyHint="done"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onFocus={(event) => event.target.select()}
        className="w-full min-w-0 border-0 bg-transparent p-0 font-display text-[30px] font-bold tabular-nums text-ink outline-none placeholder:text-muted-dark"
      />
      <span aria-hidden="true" className="shrink-0 text-[13px] font-bold text-muted">
        {unit}
      </span>
    </label>
  );
}

function Computed({ value, unit }: { value?: string; unit?: string }) {
  return (
    <p className="flex min-h-14 items-baseline gap-1.5 rounded-xl border-2 border-ink px-3.5 py-2">
      <span className={cn("font-display text-[30px] font-bold tabular-nums", !value && "text-muted-dark")}>{value ?? "–"}</span>
      {unit ? <span className="text-[13px] font-bold text-muted">{unit}</span> : null}
    </p>
  );
}
