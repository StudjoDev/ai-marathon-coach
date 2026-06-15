import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, ShieldAlert } from "lucide-react";
import type { PainEntry, PainLocation } from "../types";
import { Badge, Card, SectionHeader, cn } from "./common";

const STORAGE_KEY = "ai-marathon-coach:painLogs";
const LONG_RUN_DATE = "2026-06-19";

const painLocations: PainLocation[] = [
  "膝蓋前側",
  "膝蓋外側",
  "膝蓋內側",
  "膝蓋下方",
  "大腿後側",
  "屁股外側"
];

type PainTrackerProps = {
  initialDate?: string;
  onAfterSave?: () => void;
};

function todayInputValue() {
  return new Date().toLocaleDateString("en-CA");
}

function readPainEntries(): PainEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is Omit<PainEntry, "sharpOrPulling" | "stairsNormal"> & Partial<Pick<PainEntry, "sharpOrPulling" | "stairsNormal">> => {
        const candidate = entry as Partial<PainEntry>;
        return (
          typeof candidate.id === "string" &&
          typeof candidate.date === "string" &&
          typeof candidate.kneePain === "number" &&
          typeof candidate.backThighPain === "number" &&
          Array.isArray(candidate.locations) &&
          typeof candidate.note === "string"
        );
      })
      .map((entry) => ({
        ...entry,
        sharpOrPulling: Boolean(entry.sharpOrPulling),
        stairsNormal: Boolean(entry.stairsNormal)
      }));
  } catch {
    return [];
  }
}

function isConsecutiveHighPain(entries: PainEntry[]) {
  const maxByDate = new Map<string, number>();

  entries.forEach((entry) => {
    maxByDate.set(entry.date, Math.max(maxByDate.get(entry.date) ?? 0, entry.kneePain));
  });

  const daily = Array.from(maxByDate.entries())
    .map(([date, kneePain]) => ({ date, kneePain }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return daily.some((entry, index) => {
    const next = daily[index + 1];
    if (!next || entry.kneePain < 5 || next.kneePain < 5) return false;
    const diffMs = new Date(entry.date).getTime() - new Date(next.date).getTime();
    return diffMs === 24 * 60 * 60 * 1000;
  });
}

function hasHighPainOver48Hours(entries: PainEntry[]) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const latest = sorted[0];

  if (!latest || Math.max(latest.kneePain, latest.backThighPain) < 4) return false;

  const highPainDates = sorted
    .filter((entry) => entry.date <= latest.date && Math.max(entry.kneePain, entry.backThighPain) >= 4)
    .map((entry) => entry.date)
    .sort();

  if (highPainDates.length < 2) return false;

  const first = new Date(highPainDates[0]).getTime();
  const last = new Date(latest.date).getTime();

  return last - first >= 2 * 24 * 60 * 60 * 1000;
}

function currentRuleMessages(entries: PainEntry[]) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const latest = sorted[0];
  const messages: Array<{ tone: "success" | "warning" | "danger"; text: string }> = [];

  if (sorted.some((entry) => entry.kneePain >= 5)) {
    messages.push({ tone: "warning", text: "本週不建議增加距離。" });
  }

  if (isConsecutiveHighPain(sorted)) {
    messages.push({ tone: "danger", text: "建議暫停跑步，改恢復訓練。" });
  }

  if (!latest) return messages;

  if (latest.kneePain >= 4) {
    messages.push({ tone: "danger", text: "本週不建議再跑步，週六請改恢復日。" });
  }

  if (latest.backThighPain >= 4) {
    messages.push({ tone: "warning", text: "腿後側負荷偏高，避免衝刺、深蹲與硬舉。" });
  }

  if (latest.kneePain <= 2 && latest.backThighPain <= 2 && latest.stairsNormal && !latest.sharpOrPulling) {
    messages.push({ tone: "success", text: "本週長跑完成良好，下週可考慮恢復 10-11K 長跑。" });
  }

  if (hasHighPainOver48Hours(sorted)) {
    messages.push({ tone: "danger", text: "建議暫停跑步，改恢復訓練，必要時尋求專業評估。" });
  }

  return messages;
}

export function PainTracker({ initialDate, onAfterSave }: PainTrackerProps) {
  const [entries, setEntries] = useState<PainEntry[]>(readPainEntries);
  const [date, setDate] = useState(initialDate ?? todayInputValue);
  const [kneePain, setKneePain] = useState(0);
  const [backThighPain, setBackThighPain] = useState(0);
  const [locations, setLocations] = useState<PainLocation[]>([]);
  const [sharpOrPulling, setSharpOrPulling] = useState(false);
  const [stairsNormal, setStairsNormal] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [entries]
  );

  const recentEntries = sortedEntries.slice(0, 7);
  const ruleMessages = currentRuleMessages(sortedEntries);
  const isLongRunDate = date === LONG_RUN_DATE;

  function persist(nextEntries: PainEntry[]) {
    setEntries(nextEntries);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
  }

  function toggleLocation(location: PainLocation) {
    setLocations((current) =>
      current.includes(location)
        ? current.filter((item) => item !== location)
        : [...current, location]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEntry: PainEntry = {
      id: `${date}-${Date.now()}`,
      date,
      kneePain,
      backThighPain,
      locations,
      sharpOrPulling,
      stairsNormal,
      note: note.trim()
    };

    persist([nextEntry, ...entries]);
    setKneePain(0);
    setBackThighPain(0);
    setLocations([]);
    setSharpOrPulling(false);
    setStairsNormal(false);
    setNote("");
    onAfterSave?.();
  }

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="localStorage 紀錄" title="疼痛追蹤" />

      <Card className="border-success/30 bg-success/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="success">週五長跑</Badge>
            <h2 className="mt-2 text-lg font-bold">跑後請填寫狀態</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              請記錄膝蓋、右大腿後側、疼痛位置、是否有刺痛或拉扯感，以及隔天上下樓梯是否正常。
            </p>
          </div>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        </div>
        <button
          type="button"
          onClick={() => setDate(LONG_RUN_DATE)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          填寫跑後狀態
        </button>
      </Card>

      {ruleMessages.length > 0 ? (
        <Card className="border-warning/30 bg-warning/10">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="space-y-2">
              {ruleMessages.map((message) => (
                <p
                  key={message.text}
                  className={cn(
                    "text-sm font-bold leading-5",
                    message.tone === "danger"
                      ? "text-danger"
                      : message.tone === "success"
                        ? "text-success"
                        : "text-warning"
                  )}
                >
                  {message.text}
                </p>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">新增疼痛紀錄</h2>
            <Badge tone={isLongRunDate ? "success" : "muted"}>{date}</Badge>
          </div>

          <label className="mt-4 block text-sm font-semibold text-muted" htmlFor="pain-date">
            日期
          </label>
          <input
            id="pain-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 w-full rounded-card border border-line bg-white px-3 py-3 text-base font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <ScorePicker label="膝蓋疼痛" value={kneePain} onChange={setKneePain} />
          <ScorePicker label="右大腿後側疼痛" value={backThighPain} onChange={setBackThighPain} />
        </Card>

        <Card>
          <h2 className="text-lg font-bold">跑後狀態</h2>
          <div className="mt-3 grid gap-2">
            <ToggleRow
              label="有刺痛或拉扯感"
              checked={sharpOrPulling}
              onChange={setSharpOrPulling}
            />
            <ToggleRow
              label="隔天上下樓梯正常"
              checked={stairsNormal}
              onChange={setStairsNormal}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">疼痛位置</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {painLocations.map((location) => {
              const selected = locations.includes(location);

              return (
                <button
                  key={location}
                  type="button"
                  onClick={() => toggleLocation(location)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-semibold transition",
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-white text-ink hover:bg-surface-soft"
                  )}
                  aria-pressed={selected}
                >
                  {location}
                </button>
              );
            })}
          </div>

          <label className="mt-4 block text-sm font-semibold text-muted" htmlFor="pain-note">
            備註
          </label>
          <textarea
            id="pain-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="例如：第幾公里開始有感覺、停下來後是否改善、隔天走路狀態"
            className="mt-2 w-full resize-none rounded-card border border-line bg-white px-3 py-3 text-base outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            {isLongRunDate ? "填寫跑後狀態" : "儲存疼痛紀錄"}
          </button>
        </Card>
      </form>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">最近 7 筆</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>

        {recentEntries.length === 0 ? (
          <div className="mt-4 rounded-card bg-surface-soft px-4 py-6 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
            <p className="mt-2 text-sm font-semibold text-ink">目前沒有疼痛紀錄</p>
            <p className="mt-1 text-sm text-muted">長跑後記錄一次，教練判斷會更準。</p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {recentEntries.map((entry) => (
              <article key={entry.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{entry.date}</p>
                  <Badge tone={entry.kneePain >= 4 ? "danger" : "success"}>膝蓋 {entry.kneePain}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">右大腿後側 {entry.backThighPain} 分</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.sharpOrPulling ? <Badge tone="warning">有刺痛或拉扯感</Badge> : null}
                  {entry.stairsNormal ? <Badge tone="success">樓梯正常</Badge> : null}
                </div>
                {entry.locations.length > 0 ? (
                  <p className="mt-2 text-sm text-ink">{entry.locations.join("、")}</p>
                ) : null}
                {entry.note ? <p className="mt-1 text-sm text-muted">{entry.note}</p> : null}
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between gap-3 rounded-card border px-3 py-3 text-left text-sm font-bold transition",
        checked ? "border-primary bg-primary/10 text-primary" : "border-line bg-white text-ink"
      )}
      aria-pressed={checked}
    >
      <span>{label}</span>
      <span
        className={cn(
          "h-5 w-9 rounded-full p-0.5 transition",
          checked ? "bg-primary" : "bg-muted/25"
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white transition",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </span>
    </button>
  );
}

function ScorePicker({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className="text-2xl font-bold text-ink">{value}</span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 11 }, (_, score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={cn(
              "aspect-square rounded-card border text-sm font-bold transition",
              value === score
                ? "border-primary bg-primary text-white"
                : "border-line bg-white text-ink hover:bg-surface-soft"
            )}
            aria-pressed={value === score}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}
