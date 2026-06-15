import { Flag, Trophy } from "lucide-react";
import { Badge, Card, SectionHeader } from "./common";

const phases = [
  {
    title: "階段一：基礎耐受期",
    range: "6/14 - 9/19",
    focus: "膝蓋穩定、長跑逐步建立到 14~16K",
    races: ["9/20 長庚紀念醫院永慶盃 10.5K"],
    isPrimary: false
  },
  {
    title: "階段二：半馬專項期",
    range: "9/21 - 11/08",
    focus: "長跑提升到 18~20K，建立半馬配速感",
    races: ["11/08 板橋馬拉松 21K"],
    isPrimary: true
  },
  {
    title: "階段三：賽後恢復與速度維持",
    range: "11/09 - 11/29",
    focus: "半馬後 14 天先恢復景觀跑，再依膝蓋狀態決定 Garmin 5K 強度",
    races: ["11/22 桃園落羽松 11K", "11/29 Garmin Run 臺北站 5K"],
    isPrimary: false
  },
  {
    title: "階段四：年末賽事期",
    range: "11/30 - 12/13",
    focus: "控制負荷，安全完成 12/12 與 12/13 連續賽事",
    races: ["12/12 TigerRun 10K", "12/13 SporTaiwan 10K"],
    isPrimary: false
  }
];

export function TrainingPeriodization() {
  return (
    <section>
      <SectionHeader eyebrow="半馬週期" title="訓練 Roadmap" />
      <div className="relative space-y-3 pl-5">
        <div className="absolute bottom-6 left-2 top-6 w-px bg-line" />
        {phases.map((phase) => (
          <Card key={phase.title} className={phase.isPrimary ? "border-primary/40" : undefined}>
            <div className="relative">
              <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background">
                {phase.isPrimary ? (
                  <Trophy className="h-4 w-4 text-primary" />
                ) : (
                  <Flag className="h-4 w-4 text-muted" />
                )}
              </span>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-muted">{phase.range}</p>
                  <h3 className="mt-1 text-base font-bold">{phase.title}</h3>
                </div>
                {phase.isPrimary ? <Badge tone="primary">A 賽</Badge> : null}
              </div>
              <p className="mt-3 text-sm leading-5 text-muted">{phase.focus}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {phase.races.map((race) => (
                  <span key={race} className="rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-ink">
                    {race}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
