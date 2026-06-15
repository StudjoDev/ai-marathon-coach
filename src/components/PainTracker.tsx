import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Pencil, Plus, RotateCcw, ShieldAlert, Trash2 } from "lucide-react";
import { weeklyPlan } from "../data/weeklyPlan";
import type { PainEntry, PainLocation } from "../types";
import { getPainGuidance, normalizePainLocation, sortPainEntries } from "../utils/painRules";
import { todayInputValue } from "../utils/dateUtils";
import { Badge, Card, HealthBoundaryNote, SectionHeader, cn } from "./common";

const STORAGE_KEY = "ai-marathon-coach:painLogs";
const LONG_RUN_DATE = weeklyPlan.find((day) => day.type === "long")?.date ?? "2026-06-19";

const painLocations: PainLocation[] = [
  "膝蓋前側",
  "膝蓋外側",
  "膝蓋內側",
  "膝蓋下方",
  "大腿後側",
  "臀部外側"
];

type PainTrackerProps = {
  initialDate?: string;
  onOpenCoach?: () => void;
  onOpenToday?: () => void;
};

type SaveState = {
  entry: PainEntry;
  mode: "created" | "updated";
};

const painLocationSet = new Set<string>(painLocations);

function makeEntryId(date: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${date}-${crypto.randomUUID()}`;
  }

  return `${date}-${Date.now()}`;
}

function readPainEntries(): PainEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is Omit<PainEntry, "locations" | "sharpOrPulling" | "stairsNormal"> & {
        locations: string[];
        sharpOrPulling?: boolean;
        stairsNormal?: boolean;
      } => {
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
        locations: entry.locations
          .map(normalizePainLocation)
          .filter((location): location is PainLocation => painLocationSet.has(location)),
        sharpOrPulling: Boolean(entry.sharpOrPulling),
        stairsNormal: Boolean(entry.stairsNormal)
      }));
  } catch {
    return [];
  }
}

export function PainTracker({ initialDate, onOpenCoach, onOpenToday }: PainTrackerProps) {
  const [entries, setEntries] = useState<PainEntry[]>(readPainEntries);
  const [date, setDate] = useState(initialDate ?? todayInputValue());
  const [kneePain, setKneePain] = useState(0);
  const [backThighPain, setBackThighPain] = useState(0);
  const [locations, setLocations] = useState<PainLocation[]>([]);
  const [sharpOrPulling, setSharpOrPulling] = useState(false);
  const [stairsNormal, setStairsNormal] = useState(false);
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<SaveState | null>(null);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const sortedEntries = useMemo(() => sortPainEntries(entries), [entries]);
  const recentEntries = sortedEntries.slice(0, 7);
  const ruleMessages = getPainGuidance(sortedEntries);
  const hasDangerMessage = ruleMessages.some((message) => message.tone === "danger");
  const isLongRunDate = date === LONG_RUN_DATE;

  function persist(nextEntries: PainEntry[]) {
    setEntries(nextEntries);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
  }

  function resetForm(nextDate = date) {
    setDate(nextDate);
    setKneePain(0);
    setBackThighPain(0);
    setLocations([]);
    setSharpOrPulling(false);
    setStairsNormal(false);
    setNote("");
    setEditingId(null);
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
      id: editingId ?? makeEntryId(date),
      date,
      kneePain,
      backThighPain,
      locations,
      sharpOrPulling,
      stairsNormal,
      note: note.trim()
    };

    const nextEntries = editingId
      ? entries.map((entry) => (entry.id === editingId ? nextEntry : entry))
      : [nextEntry, ...entries];

    persist(nextEntries);
    setLastSaved({ entry: nextEntry, mode: editingId ? "updated" : "created" });
    resetForm();
  }

  function editEntry(entry: PainEntry) {
    setDate(entry.date);
    setKneePain(entry.kneePain);
    setBackThighPain(entry.backThighPain);
    setLocations(entry.locations);
    setSharpOrPulling(entry.sharpOrPulling);
    setStairsNormal(entry.stairsNormal);
    setNote(entry.note);
    setEditingId(entry.id);
    setLastSaved(null);
  }

  function deleteEntry(entryId: string) {
    persist(entries.filter((entry) => entry.id !== entryId));
    if (editingId === entryId) {
      resetForm();
    }
    if (lastSaved?.entry.id === entryId) {
      setLastSaved(null);
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="本機紀錄" title="疼痛追蹤" />

      <HealthBoundaryNote />

      <Card className="border-success/30 bg-success/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="success">跑後回饋</Badge>
            <h2 className="mt-2 text-lg font-bold">跑完後先記錄身體狀態</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              請記錄膝蓋與右大腿後側的疼痛分數、位置與樓梯狀態。0 是無感，10 是無法承受；4/10 以上建議調整當次訓練。
            </p>
          </div>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        </div>
        <button
          type="button"
          onClick={() => setDate(LONG_RUN_DATE)}
          className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          套用週五長跑日期
        </button>
      </Card>

      {lastSaved ? (
        <Card className="border-success/30 bg-success/10" density="compact">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">
                {lastSaved.mode === "created" ? "已儲存疼痛紀錄" : "已更新疼痛紀錄"}
              </p>
              <p className="mt-1 text-sm leading-5 text-muted">
                {lastSaved.entry.date}｜膝蓋 {lastSaved.entry.kneePain}/10，右大腿後側 {lastSaved.entry.backThighPain}/10
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onOpenCoach}
                  className="focus-ring rounded-card bg-primary px-3 py-2 text-sm font-bold text-white"
                >
                  查看教練更新
                </button>
                <button
                  type="button"
                  onClick={() => editEntry(lastSaved.entry)}
                  className="focus-ring rounded-card border border-line bg-white px-3 py-2 text-sm font-bold text-primary"
                >
                  編輯本筆
                </button>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {ruleMessages.length > 0 ? (
        <Card
          className="border-warning/30 bg-warning/10"
          density="compact"
        >
          <div
            className="flex items-start gap-3"
            role={hasDangerMessage ? "alert" : "status"}
            aria-live="polite"
          >
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
            <h2 className="text-lg font-bold">{editingId ? "編輯疼痛紀錄" : "新增疼痛紀錄"}</h2>
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
            className="focus-ring mt-2 w-full rounded-card border border-line bg-white px-3 py-3 text-base font-semibold transition focus:border-primary"
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
          <fieldset>
            <legend className="text-lg font-bold">疼痛位置</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {painLocations.map((location) => {
                const selected = locations.includes(location);

                return (
                  <button
                    key={location}
                    type="button"
                    onClick={() => toggleLocation(location)}
                    className={cn(
                      "focus-ring min-h-11 rounded-full border px-3 py-2 text-sm font-semibold transition",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-line bg-white text-ink hover:bg-surface-soft"
                    )}
                    aria-pressed={selected}
                    aria-label={selected ? `移除疼痛位置 ${location}` : `加入疼痛位置 ${location}`}
                  >
                    {location}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-semibold text-muted" htmlFor="pain-note">
            備註
          </label>
          <textarea
            id="pain-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="例如：跑到第幾公里開始有感、下樓梯是否痛、是否影響走路。"
            className="focus-ring mt-2 w-full resize-none rounded-card border border-line bg-white px-3 py-3 text-base transition placeholder:text-muted/70 focus:border-primary"
          />

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="submit"
              className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              {editingId ? "更新疼痛紀錄" : "儲存疼痛紀錄"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => resetForm()}
                className="focus-ring flex h-12 w-12 items-center justify-center rounded-card border border-line bg-white text-muted"
                aria-label="取消編輯"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            ) : null}
          </div>
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
            <p className="mt-2 text-sm font-semibold text-ink">尚未有疼痛紀錄</p>
            <p className="mt-1 text-sm text-muted">長跑後記錄一次，教練判斷會更準。</p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {recentEntries.map((entry) => (
              <article key={entry.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{entry.date}</p>
                  <Badge tone={entry.kneePain >= 4 ? "danger" : "success"}>膝蓋 {entry.kneePain}/10</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">右大腿後側 {entry.backThighPain}/10</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.sharpOrPulling ? <Badge tone="warning">刺痛或拉扯</Badge> : null}
                  {entry.stairsNormal ? <Badge tone="success">樓梯正常</Badge> : null}
                </div>
                {entry.locations.length > 0 ? (
                  <p className="mt-2 text-sm text-ink">{entry.locations.join("、")}</p>
                ) : null}
                {entry.note ? <p className="mt-1 text-sm text-muted">{entry.note}</p> : null}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => editEntry(entry)}
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-card border border-line bg-white px-3 py-2 text-sm font-bold text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                    編輯
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-card border border-danger/20 bg-white px-3 py-2 text-sm font-bold text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                    刪除
                  </button>
                  {onOpenToday ? (
                    <button
                      type="button"
                      onClick={onOpenToday}
                      className="focus-ring ml-auto inline-flex min-h-11 items-center rounded-card border border-line bg-white px-3 py-2 text-sm font-bold text-muted"
                    >
                      回今日
                    </button>
                  ) : null}
                </div>
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
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-ring flex min-h-12 items-center justify-between gap-3 rounded-card border px-3 py-3 text-left text-sm font-bold transition",
        checked ? "border-primary bg-primary/10 text-primary" : "border-line bg-white text-ink"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "h-5 w-9 rounded-full p-0.5 transition",
          checked ? "bg-primary" : "bg-muted/25"
        )}
        aria-hidden="true"
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
    <fieldset className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <legend className="text-sm font-semibold text-muted">{label}</legend>
        <span className="text-2xl font-bold text-ink" aria-hidden="true">{value}</span>
      </div>
      <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label={label}>
        {Array.from({ length: 11 }, (_, score) => (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={value === score}
            aria-label={`${label} ${score} 分`}
            onClick={() => onChange(score)}
            className={cn(
              "focus-ring min-h-11 min-w-11 rounded-card border text-sm font-bold transition",
              value === score
                ? "border-primary bg-primary text-white"
                : "border-line bg-white text-ink hover:bg-surface-soft"
            )}
          >
            {score}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-muted">
        0=無感，10=無法承受；4/10 以上建議調整當次訓練。
      </p>
    </fieldset>
  );
}
