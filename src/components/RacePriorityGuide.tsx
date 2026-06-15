import type { RaceCategory } from "../types";
import { getRaceCategoryStyle, getRacePriorityLabel } from "../utils/raceUtils";
import { Card, SectionHeader, cn } from "./common";

const guides: Array<{
  category: RaceCategory;
  title: string;
  items: string[];
}> = [
  {
    category: "A",
    title: "本案例：11/08 板橋馬拉松 21K",
    items: ["年度主要目標賽", "本週期訓練高峰", "需要賽前減量調整"]
  },
  {
    category: "B",
    title: "本案例：永慶盃、TigerRun",
    items: ["重要測驗賽", "用來驗證訓練成果", "不一定全力"]
  },
  {
    category: "C",
    title: "本案例：Garmin Run、SporTaiwan",
    items: ["輔助賽或恢復賽", "不影響主要訓練", "不應該硬拼"]
  }
];

export function RacePriorityGuide() {
  return (
    <section>
      <SectionHeader eyebrow="A / B / C 定位" title="賽事怎麼看" />
      <div className="space-y-3">
        {guides.map((guide) => (
          <Card key={guide.category}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
                    getRaceCategoryStyle(guide.category)
                  )}
                >
                  {getRacePriorityLabel(guide.category)}
                </span>
                <h3 className="mt-3 text-base font-bold">{guide.title}</h3>
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              {guide.items.map((item) => (
                <p key={item} className="rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold">
                  {item}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
