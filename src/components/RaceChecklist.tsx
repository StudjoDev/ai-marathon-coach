import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { RaceChecklistGroup, RaceChecklistState } from "../types";
import { cn } from "./common";

const STORAGE_KEY = "ai-marathon-coach:raceChecklist";

const checklistGroups: RaceChecklistGroup[] = [
  {
    title: "賽前一週",
    items: ["確認報到資訊", "確認交通方式", "不嘗試新鞋", "不新增高強度訓練"]
  },
  {
    title: "賽前一天",
    items: ["準備號碼布", "準備跑鞋", "準備衣物", "手錶充電", "早點睡"]
  },
  {
    title: "比賽當天",
    items: ["提早到場", "熱身 5~10 分鐘", "前段保守", "跑後記錄疼痛分數"]
  }
];

function readChecklistState(): RaceChecklistState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function itemKey(groupTitle: string, item: string) {
  return `${groupTitle}:${item}`;
}

export function RaceChecklist({ raceId }: { raceId: string }) {
  const [state, setState] = useState<RaceChecklistState>(readChecklistState);
  const raceState = state[raceId] ?? {};

  function toggleItem(key: string) {
    const nextState: RaceChecklistState = {
      ...state,
      [raceId]: {
        ...raceState,
        [key]: !raceState[key]
      }
    };

    setState(nextState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <h3 className="text-base font-bold">賽前檢查清單</h3>
      </div>

      <div className="space-y-4">
        {checklistGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 text-xs font-bold text-muted">{group.title}</p>
            <div className="grid gap-2">
              {group.items.map((item) => {
                const key = itemKey(group.title, item);
                const checked = Boolean(raceState[key]);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleItem(key)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-card border px-3 py-2 text-left text-sm font-semibold transition",
                      checked
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-line bg-white text-ink hover:bg-surface-soft"
                    )}
                    aria-pressed={checked}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        checked ? "border-success bg-success text-white" : "border-line bg-white"
                      )}
                    >
                      {checked ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    </span>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
