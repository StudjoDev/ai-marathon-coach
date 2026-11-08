import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Race, RaceEntry } from "../types";
import { races as seedRaces } from "./races";

type Mode = "cloud" | "local";
type LoadStatus = "loading" | "ready" | "error";
export type SyncStatus = "synced" | "saving" | "offline";

type RaceRow = {
  id: string;
  name: string;
  short_name: string;
  date: string;
  end_date: string | null;
  distance_km: number | string;
  event_mode: "in_person" | "virtual";
  venue: string;
  start_time: string;
  finish_limit: string;
  official_url: string;
  assembly_short: string | null;
  distance_note: string | null;
  check_in_summary: string;
  memo: string[] | null;
  updated_by?: string | null;
};

type EntryRow = {
  race_id: string;
  checklist: Record<string, boolean> | null;
  note: string;
  finish_time: string;
  result: RaceEntry["result"];
  reflection: string;
  updated_by?: string | null;
};

type Store = {
  mode: Mode;
  status: LoadStatus;
  sync: SyncStatus;
  error?: string;
  session: Session | null;
  authReady: boolean;
  races: Race[];
  entries: Record<string, RaceEntry>;
  getEntry: (raceId: string) => RaceEntry;
  updateEntry: (raceId: string, patch: Partial<Omit<RaceEntry, "raceId">>) => void;
  saveRace: (race: Race) => Promise<void>;
  deleteRace: (raceId: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
};

const LOCAL_RACES = "race-memo:races";
const LOCAL_ENTRIES = "race-memo:entries";
const ENTRY_SAVE_DELAY_MS = 600;

export function emptyEntry(raceId: string): RaceEntry {
  return { raceId, checklist: {}, note: "", finishTime: "", result: "finished", reflection: "" };
}

function toRace(row: RaceRow): Race {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    date: row.date,
    endDate: row.end_date ?? undefined,
    distanceKm: Number(row.distance_km),
    eventMode: row.event_mode,
    venue: row.venue,
    startTime: row.start_time,
    finishLimit: row.finish_limit,
    officialUrl: row.official_url,
    assemblyShort: row.assembly_short ?? undefined,
    distanceNote: row.distance_note ?? undefined,
    checkInSummary: row.check_in_summary,
    memo: row.memo ?? []
  };
}

function toRaceRow(race: Race): RaceRow {
  return {
    id: race.id,
    name: race.name,
    short_name: race.shortName,
    date: race.date,
    end_date: race.endDate || null,
    distance_km: race.distanceKm,
    event_mode: race.eventMode ?? "in_person",
    venue: race.venue,
    start_time: race.startTime,
    finish_limit: race.finishLimit,
    official_url: race.officialUrl,
    assembly_short: race.assemblyShort || null,
    distance_note: race.distanceNote || null,
    check_in_summary: race.checkInSummary,
    memo: race.memo
  };
}

function toEntry(row: EntryRow): RaceEntry {
  return {
    raceId: row.race_id,
    checklist: row.checklist ?? {},
    note: row.note,
    finishTime: row.finish_time,
    result: row.result,
    reflection: row.reflection
  };
}

function toEntryRow(entry: RaceEntry): EntryRow {
  return {
    race_id: entry.raceId,
    checklist: entry.checklist,
    note: entry.note,
    finish_time: entry.finishTime,
    result: entry.result,
    reflection: entry.reflection
  };
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 私密模式或空間不足：只保留在記憶體
  }
}

function upsertById(list: Race[], race: Race) {
  const exists = list.some((item) => item.id === race.id);
  return exists ? list.map((item) => (item.id === race.id ? race : item)) : [...list, race];
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const mode: Mode = supabase ? "cloud" : "local";
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(mode === "local");
  const [status, setStatus] = useState<LoadStatus>(mode === "local" ? "ready" : "loading");
  const [sync, setSync] = useState<SyncStatus>("synced");
  const [error, setError] = useState<string>();
  const [races, setRaces] = useState<Race[]>(() => (mode === "local" ? readLocal(LOCAL_RACES, seedRaces) : []));
  const [entries, setEntries] = useState<Record<string, RaceEntry>>(() =>
    mode === "local" ? readLocal(LOCAL_ENTRIES, {}) : {}
  );

  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const pendingTimers = useRef(new Map<string, number>());
  const userId = session?.user.id;

  // 登入狀態
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadCloud = useCallback(async () => {
    if (!supabase) return;
    const [raceResult, entryResult] = await Promise.all([
      supabase.from("races").select("*").order("date"),
      supabase.from("race_entries").select("*")
    ]);

    if (raceResult.error || entryResult.error) {
      setError((raceResult.error ?? entryResult.error)?.message);
      setStatus("error");
      return;
    }

    let raceRows = raceResult.data as RaceRow[];
    if (raceRows.length === 0) {
      // 第一次使用：把內建賽事匯入後台
      const seeded = await supabase
        .from("races")
        .upsert(seedRaces.map(toRaceRow), { onConflict: "id", ignoreDuplicates: true })
        .select("*");
      if (seeded.error) {
        setError(seeded.error.message);
        setStatus("error");
        return;
      }
      raceRows = seeded.data as RaceRow[];
    }

    setRaces(raceRows.map(toRace));
    setEntries(
      Object.fromEntries((entryResult.data as EntryRow[]).map((row) => [row.race_id, toEntry(row)]))
    );
    setError(undefined);
    setStatus("ready");
  }, []);

  // 載入資料、訂閱即時更新、回到 App 時重新整理
  useEffect(() => {
    if (!supabase || !session) return;
    const client = supabase;
    loadCloud();

    const channel = client
      .channel("race-memo")
      .on("postgres_changes", { event: "*", schema: "public", table: "races" }, (payload) => {
        if (payload.eventType === "DELETE") {
          const id = (payload.old as Partial<RaceRow>).id;
          setRaces((list) => list.filter((race) => race.id !== id));
          return;
        }
        const row = payload.new as RaceRow;
        if (row.updated_by && row.updated_by === userId) return;
        setRaces((list) => upsertById(list, toRace(row)));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "race_entries" }, (payload) => {
        if (payload.eventType === "DELETE") return;
        const row = payload.new as EntryRow;
        if (row.updated_by && row.updated_by === userId) return;
        if (pendingTimers.current.has(row.race_id)) return;
        setEntries((map) => ({ ...map, [row.race_id]: toEntry(row) }));
      })
      .subscribe();

    const onVisible = () => {
      if (document.visibilityState === "visible") loadCloud();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      client.removeChannel(channel);
    };
  }, [session, userId, loadCloud]);

  // 本機模式寫回 localStorage
  useEffect(() => {
    if (mode === "local") writeLocal(LOCAL_RACES, races);
  }, [mode, races]);

  useEffect(() => {
    if (mode === "local") writeLocal(LOCAL_ENTRIES, entries);
  }, [mode, entries]);

  const getEntry = useCallback((raceId: string) => entries[raceId] ?? emptyEntry(raceId), [entries]);

  const flushEntry = useCallback(async (raceId: string) => {
    pendingTimers.current.delete(raceId);
    const entry = entriesRef.current[raceId];
    if (!supabase || !entry) return;
    setSync("saving");
    const { error: saveError } = await supabase.from("race_entries").upsert(toEntryRow(entry));
    setSync(saveError ? "offline" : pendingTimers.current.size > 0 ? "saving" : "synced");
  }, []);

  const updateEntry = useCallback<Store["updateEntry"]>(
    (raceId, patch) => {
      setEntries((map) => {
        const next = { ...(map[raceId] ?? emptyEntry(raceId)), ...patch, raceId };
        const updated = { ...map, [raceId]: next };
        entriesRef.current = updated;
        return updated;
      });

      if (mode !== "cloud") return;
      setSync("saving");
      const timers = pendingTimers.current;
      window.clearTimeout(timers.get(raceId));
      timers.set(raceId, window.setTimeout(() => flushEntry(raceId), ENTRY_SAVE_DELAY_MS));
    },
    [mode, flushEntry]
  );

  const saveRace = useCallback<Store["saveRace"]>(
    async (race) => {
      if (supabase) {
        setSync("saving");
        const { error: saveError } = await supabase.from("races").upsert(toRaceRow(race));
        if (saveError) {
          setSync("offline");
          throw new Error(saveError.message);
        }
        setSync("synced");
      }
      setRaces((list) => upsertById(list, race));
    },
    []
  );

  const deleteRace = useCallback<Store["deleteRace"]>(async (raceId) => {
    if (supabase) {
      const { error: deleteError } = await supabase.from("races").delete().eq("id", raceId);
      if (deleteError) throw new Error(deleteError.message);
    }
    setRaces((list) => list.filter((race) => race.id !== raceId));
    setEntries((map) => {
      const { [raceId]: _removed, ...rest } = map;
      return rest;
    });
  }, []);

  const signIn = useCallback<Store["signIn"]>(async (email, password) => {
    if (!supabase) return "尚未設定後台";
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    return signInError ? "帳號或密碼不正確" : undefined;
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setRaces([]);
    setEntries({});
    setStatus("loading");
  }, []);

  const value = useMemo<Store>(
    () => ({
      mode,
      status,
      sync,
      error,
      session,
      authReady,
      races,
      entries,
      getEntry,
      updateEntry,
      saveRace,
      deleteRace,
      signIn,
      signOut
    }),
    [mode, status, sync, error, session, authReady, races, entries, getEntry, updateEntry, saveRace, deleteRace, signIn, signOut]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
