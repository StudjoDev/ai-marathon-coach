import { CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { weeklyPlan, weeklyPlanAdjustment } from "../data/weeklyPlan";
import type { WeeklyPlanDay } from "../types";
import { formatChineseDate, todayInputValue } from "../utils/dateUtils";
import { Badge, Card, SectionHeader, cn } from "./common";

function getFocusPlan(todayKey: string) {
  return weeklyPlan.find((day) => day.date >= todayKey) ?? weeklyPlan[weeklyPlan.length - 1];
}

function planMeta(day: WeeklyPlanDay) {
  const parts: string[] = [];

  if (day.distanceKm) {
    parts.push(day.fallbackDistanceKm ? `${day.fallbackDistanceKm}-${day.distanceKm}K` : `${day.distanceKm}K`);
  }

  if (day.targetPace) {
    parts.push(day.targetPace);
  }

  return parts.join(" | ");
}

function planBadge(day: WeeklyPlanDay, todayKey: string) {
  if (day.date === todayKey) return "今天";
  if (day.type === "long") return "長跑";
  if (day.type === "strength") return "肌力";
  if (day.type === "rest") return "休息";
  return "恢復";
}

export function WeeklyPlanView() {
  const todayKey = todayInputValue();
  const focusPlan = getFocusPlan(todayKey);
  const firstDay = weeklyPlan[0];
  const lastDay = weeklyPlan[weeklyPlan.length - 1];
  const weekLabel = `${formatChineseDate(firstDay.date)} - ${formatChineseDate(lastDay.date)}`;

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow={weekLabel} title="訓練輔助" />

      <Card className="border-primary/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone={focusPlan.date === todayKey ? "success" : "primary"}>
              {focusPlan.date === todayKey ? "今天" : "下一課"}
            </Badge>
            <h2 className="mt-3 text-2xl font-bold leading-tight">{focusPlan.title}</h2>
            <p className="mt-2 text-sm font-semibold text-muted">
              {focusPlan.dayLabel} {focusPlan.displayDate}
              {planMeta(focusPlan) ? ` | ${planMeta(focusPlan)}` : ""}
            </p>
          </div>
          <Clock className="h-5 w-5 shrink-0 text-primary" />
        </div>

        <p className="mt-4 rounded-card bg-surface-soft px-3 py-3 text-sm font-semibold leading-6">
          {focusPlan.purpose}
        </p>

        <div className="mt-3 grid gap-2">
          {focusPlan.items.slice(0, 3).map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm leading-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-card bg-warning/10 px-3 py-2 text-sm font-semibold leading-5 text-warning">
          注意：{focusPlan.attention}
        </p>
      </Card>

      {weeklyPlanAdjustment.isAdjusted ? (
        <Card density="compact">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-lg font-bold">本週重點</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{weeklyPlanAdjustment.reason}</p>
              <div className="mt-3 grid gap-2">
                {weeklyPlanAdjustment.changes.slice(0, 2).map((change) => (
                  <p key={change} className="rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold leading-5">
                    {change}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-lg font-bold">本週課表</h2>
        <div className="mt-3 divide-y divide-line">
          {weeklyPlan.map((day) => {
            const isFocus = day.date === focusPlan.date;

            return (
              <article key={day.date} className="grid grid-cols-[auto_1fr] gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-card text-xs font-bold",
                    isFocus ? "bg-primary text-white" : "bg-surface-soft text-muted"
                  )}
                >
                  {day.dayLabel.replace("週", "")}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold leading-5">{day.title}</h3>
                    <Badge tone={isFocus ? "primary" : "muted"} size="xs">{planBadge(day, todayKey)}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-muted">
                    {day.displayDate}
                    {planMeta(day) ? ` | ${planMeta(day)}` : ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
