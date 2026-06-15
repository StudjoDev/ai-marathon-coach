import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Race, RaceChecklistGroup, RaceChecklistState } from "../types";
import { cn } from "./common";

const STORAGE_KEY = "ai-marathon-coach:raceChecklist";

const baseChecklistGroups: RaceChecklistGroup[] = [
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
    items: ["提早到場", "熱身 5-10 分鐘", "前段保守", "跑後記錄疼痛分數"]
  }
];

function getRaceSpecificChecklistGroups(race: Race): RaceChecklistGroup[] {
  if (race.id === "yongqing-2026-taipei-10_5k") {
    return [
      {
        title: "本場專屬",
        items: ["賽前再次確認官方 PDF", "確認開跑時間與限時", "確認寄物或保管資訊"]
      }
    ];
  }

  if (race.id === "banqiao-marathon-2026-half") {
    return [
      {
        title: "本場專屬",
        items: ["確認半馬 06:30 起跑", "確認衣物保管 05:15 開始", "賽後先安排恢復，不急著再拼"]
      }
    ];
  }

  if (race.id === "taoyuan-bald-cypress-2026-11k") {
    return [
      {
        title: "本場專屬",
        items: ["確認板橋半馬後疼痛已回到 2/10 以下", "05:00-05:30 完成寄物", "全程當恢復景觀跑，不追個人最佳"]
      }
    ];
  }

  if (race.id === "tigerrun-2026-10k") {
    return [
      {
        title: "本場專屬",
        items: ["保留隔天 10K 的腿部狀態", "跑後立刻記錄膝蓋與右大腿後側分數", "確認第二天是否需要降強度"]
      }
    ];
  }

  if (race.id === "sportaiwan-thanksgiving-2026-10k") {
    return [
      {
        title: "本場專屬",
        items: ["起床先檢查膝蓋疼痛分數", "若達 5/10，改走跑或評估不出賽", "本場比前一天更慢，當恢復跑"]
      }
    ];
  }

  return [
    {
      title: "本場專屬",
      items: ["確認官方公告是否更新", "依恢復狀態決定是否測速", "跑後記錄疼痛分數"]
    }
  ];
}

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

export function RaceChecklist({ race }: { race: Race }) {
  const [state, setState] = useState<RaceChecklistState>(readChecklistState);
  const raceState = state[race.id] ?? {};
  const checklistGroups = useMemo(
    () => [...getRaceSpecificChecklistGroups(race), ...baseChecklistGroups],
    [race]
  );
  const totalCount = checklistGroups.reduce((sum, group) => sum + group.items.length, 0);
  const doneCount = checklistGroups.reduce(
    (sum, group) => sum + group.items.filter((item) => raceState[itemKey(group.title, item)]).length,
    0
  );

  function toggleItem(key: string) {
    const nextState: RaceChecklistState = {
      ...state,
      [race.id]: {
        ...raceState,
        [key]: !raceState[key]
      }
    };

    setState(nextState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h3 className="text-base font-bold">賽前檢查清單</h3>
        </div>
        <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
          {doneCount}/{totalCount}
        </span>
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
                      "focus-ring flex min-h-11 items-center gap-3 rounded-card border px-3 py-2 text-left text-sm font-semibold transition",
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
                      aria-hidden="true"
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
