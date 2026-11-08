import { useState, type FormEvent, type ReactNode } from "react";
import { useStore } from "../data/store";
import { href, navigate } from "../router";
import type { Race } from "../types";
import { todayInputValue } from "../utils/dateUtils";
import { Hero, Page, PrimaryButton, TopBar, cn, textAreaClass } from "./ui";

type Draft = {
  name: string;
  shortName: string;
  date: string;
  endDate: string;
  distanceKm: string;
  virtual: boolean;
  venue: string;
  startTime: string;
  assemblyShort: string;
  finishLimit: string;
  checkInSummary: string;
  distanceNote: string;
  memo: string;
  officialUrl: string;
};

function toDraft(race?: Race): Draft {
  return {
    name: race?.name ?? "",
    shortName: race?.shortName ?? "",
    date: race?.date ?? todayInputValue(),
    endDate: race?.endDate ?? "",
    distanceKm: race ? String(race.distanceKm) : "",
    virtual: race?.eventMode === "virtual",
    venue: race?.venue ?? "",
    startTime: race?.startTime ?? "",
    assemblyShort: race?.assemblyShort ?? "",
    finishLimit: race?.finishLimit ?? "",
    checkInSummary: race?.checkInSummary ?? "",
    distanceNote: race?.distanceNote ?? "",
    memo: race?.memo.join("\n") ?? "",
    officialUrl: race?.officialUrl ?? ""
  };
}

function newRaceId(date: string) {
  return `${date}-${Math.random().toString(36).slice(2, 8)}`;
}

export function RaceEditor({ race }: { race?: Race }) {
  const { saveRace, deleteRace, mode } = useStore();
  const [draft, setDraft] = useState(() => toDraft(race));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const backHref = race ? href.race(race.id) : href.list();

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const distanceKm = Number(draft.distanceKm);
    if (!draft.name.trim() || !draft.date || !(distanceKm > 0)) {
      setError("請填寫賽事名稱、日期與距離。");
      return;
    }

    const next: Race = {
      id: race?.id ?? newRaceId(draft.date),
      name: draft.name.trim(),
      shortName: draft.shortName.trim() || draft.name.trim(),
      date: draft.date,
      endDate: draft.virtual && draft.endDate ? draft.endDate : undefined,
      distanceKm,
      eventMode: draft.virtual ? "virtual" : "in_person",
      venue: draft.venue.trim(),
      startTime: draft.startTime.trim(),
      assemblyShort: draft.assemblyShort.trim() || undefined,
      finishLimit: draft.finishLimit.trim(),
      checkInSummary: draft.checkInSummary.trim(),
      distanceNote: draft.distanceNote.trim() || undefined,
      memo: draft.memo
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      officialUrl: draft.officialUrl.trim()
    };

    setSaving(true);
    setError(undefined);
    try {
      await saveRace(next);
      navigate(href.race(next.id), { replace: true });
    } catch (saveError) {
      setError(`儲存失敗：${(saveError as Error).message}`);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!race) return;
    const ok = window.confirm(`確定刪除「${race.shortName}」？這場的備忘、清單與成績也會一起刪除，無法復原。`);
    if (!ok) return;
    try {
      await deleteRace(race.id);
      navigate(href.list(), { replace: true });
    } catch (deleteError) {
      setError(`刪除失敗：${(deleteError as Error).message}`);
    }
  }

  return (
    <Page>
      <Hero labelledBy="editor-title">
        <TopBar back={{ href: backHref, label: "取消" }} />
        <h1 id="editor-title" className="mt-6 text-[28px] font-black">
          {race ? "編輯賽事" : "新增賽事"}
        </h1>
        <p className="mt-1 text-[13px] text-muted-dark">
          {mode === "cloud" ? "儲存後兩支手機都會更新。" : "本機模式：只存在這台裝置。"}
        </p>
      </Hero>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-5 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-7">
        <Field label="賽事全名" required>
          <input value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputClass} required />
        </Field>
        <Field label="簡稱" hint="列表與首頁顯示用，例如「板橋半馬」">
          <input value={draft.shortName} onChange={(e) => set("shortName", e.target.value)} className={inputClass} />
        </Field>

        <fieldset>
          <legend className={labelClass}>形式</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: false, label: "實體賽" },
              { value: true, label: "線上賽" }
            ].map((option) => (
              <label
                key={option.label}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center rounded-full text-[15px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                  draft.virtual === option.value ? "bg-ink font-bold text-white" : "bg-soft"
                )}
              >
                <input
                  type="radio"
                  name="mode"
                  checked={draft.virtual === option.value}
                  onChange={() => set("virtual", option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <Field label={draft.virtual ? "開始日" : "日期"} required>
            <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)} className={inputClass} required />
          </Field>
          {draft.virtual ? (
            <Field label="結束日">
              <input type="date" value={draft.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputClass} />
            </Field>
          ) : (
            <Field label="距離（K）" required>
              <input
                inputMode="decimal"
                value={draft.distanceKm}
                onChange={(e) => set("distanceKm", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
          )}
        </div>
        {draft.virtual ? (
          <Field label="距離（K）" required>
            <input inputMode="decimal" value={draft.distanceKm} onChange={(e) => set("distanceKm", e.target.value)} className={inputClass} required />
          </Field>
        ) : null}

        <Field label="距離提醒" hint="例如「不是 10K」，會顯示在距離旁">
          <input value={draft.distanceNote} onChange={(e) => set("distanceNote", e.target.value)} className={inputClass} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="起跑時間">
            <input value={draft.startTime} onChange={(e) => set("startTime", e.target.value)} placeholder="06:30" className={inputClass} />
          </Field>
          <Field label="集合時間">
            <input value={draft.assemblyShort} onChange={(e) => set("assemblyShort", e.target.value)} placeholder="05:30" className={inputClass} />
          </Field>
        </div>
        <Field label="限時">
          <input value={draft.finishLimit} onChange={(e) => set("finishLimit", e.target.value)} placeholder="4 小時" className={inputClass} />
        </Field>
        <Field label={draft.virtual ? "使用 App" : "地點"}>
          <input value={draft.venue} onChange={(e) => set("venue", e.target.value)} className={inputClass} />
        </Field>
        <Field label="報到方式">
          <input
            value={draft.checkInSummary}
            onChange={(e) => set("checkInSummary", e.target.value)}
            placeholder="郵寄 · 11/10 前寄達"
            className={inputClass}
          />
        </Field>
        <Field label="注意事項" hint="一行一條，建議三條以內">
          <textarea rows={4} value={draft.memo} onChange={(e) => set("memo", e.target.value)} className={textAreaClass} />
        </Field>
        <Field label="官方網站">
          <input type="url" value={draft.officialUrl} onChange={(e) => set("officialUrl", e.target.value)} placeholder="https://" className={inputClass} />
        </Field>

        {error ? (
          <p role="alert" className="text-[15px] font-bold text-accent-ink">
            {error}
          </p>
        ) : null}

        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "儲存中…" : "儲存"}
        </PrimaryButton>

        {race ? (
          <button
            type="button"
            onClick={handleDelete}
            className="focus-ring min-h-11 self-center rounded px-3 text-[15px] font-bold text-accent-ink"
          >
            刪除這場賽事
          </button>
        ) : null}
      </form>
    </Page>
  );
}

const labelClass = "mb-2 block text-[13px] font-bold text-muted";
const inputClass =
  "focus-ring min-h-12 w-full rounded-xl border-0 bg-soft px-3.5 text-base text-ink placeholder:text-muted";

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required ? <span className="text-accent-ink"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
