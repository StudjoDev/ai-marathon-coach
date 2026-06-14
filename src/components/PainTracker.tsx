import { FormEvent, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, ShieldAlert } from "lucide-react";
import type { PainEntry, PainLocation } from "../types";
import { Badge, Card, SectionHeader, cn } from "./common";

const STORAGE_KEY = "ai-marathon-coach:painLogs";

const painLocations: PainLocation[] = [
  "膝蓋前側",
  "膝蓋外側",
  "膝蓋內側",
  "膝蓋下方",
  "大腿後側",
  "屁股外側"
];

function todayInputValue() {
  return new Date().toLocaleDateString("en-CA");
}

function readPainEntries(): PainEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

export function PainTracker() {
  const [entries, setEntries] = useState<PainEntry[]>(readPainEntries);
  const [date, setDate] = useState(todayInputValue);
  const [kneePain, setKneePain] = useState(0);
  const [backThighPain, setBackThighPain] = useState(0);
  const [locations, setLocations] = useState<PainLocation[]>([]);
  const [note, setNote] = useState("");

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [entries]
  );

  const recentEntries = sortedEntries.slice(0, 7);
  const hasHighKneePain = sortedEntries.some((entry) => entry.kneePain >= 5);
  const hasConsecutiveHighPain = isConsecutiveHighPain(sortedEntries);

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
      note: note.trim()
    };

    persist([nextEntry, ...entries]);
    setKneePain(0);
    setBackThighPain(0);
    setLocations([]);
    setNote("");
  }

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="localStorage 儲存" title="疼痛追蹤" />

      {(hasHighKneePain || hasConsecutiveHighPain) && (
        <Card className="border-danger/30 bg-danger/10">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <div className="space-y-1">
              {hasHighKneePain ? (
                <p className="text-sm font-bold text-danger">本週不建議增加距離</p>
              ) : null}
              {hasConsecutiveHighPain ? (
                <p className="text-sm font-bold text-danger">建議暫停跑步，改恢復訓練</p>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">今天痛幾分</h2>
            <Badge tone="muted">{date}</Badge>
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
          <ScorePicker label="大腿後側酸痛" value={backThighPain} onChange={setBackThighPain} />
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
            placeholder="例如：跑後才痛、下樓梯有感、熱敷後改善"
            className="mt-2 w-full resize-none rounded-card border border-line bg-white px-3 py-3 text-base outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            儲存疼痛紀錄
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
            <p className="mt-1 text-sm text-muted">訓練後記一筆，就能判斷是否該降載。</p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {recentEntries.map((entry) => (
              <article key={entry.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{entry.date}</p>
                  <Badge tone={entry.kneePain >= 5 ? "danger" : "success"}>膝蓋 {entry.kneePain}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">大腿後側 {entry.backThighPain} 分</p>
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
