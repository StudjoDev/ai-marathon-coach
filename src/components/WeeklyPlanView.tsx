import { CalendarDays, Dumbbell, Moon, ShieldCheck } from "lucide-react";
import { weeklyPlan, weeklyPlanAdjustment } from "../data/weeklyPlan";
import type { WeeklyPlanDay } from "../types";
import { formatChineseDate, todayInputValue } from "../utils/dateUtils";
import { Badge, Card, SectionHeader, cn } from "./common";

function planTone(day: WeeklyPlanDay, todayKey: string) {
  if (day.date === todayKey) {
    return {
      badge: "今天",
      card: "border-primary/40 bg-primary text-white shadow-raised",
      icon: <ShieldCheck className="h-5 w-5 text-white" />
    };
  }

  if (day.type === "long") {
    return {
      badge: "長跑",
      card: "border-success/30 bg-success/10",
      icon: <CalendarDays className="h-5 w-5 text-success" />
    };
  }

  if (day.type === "strength") {
    return {
      badge: "肌力",
      card: "",
      icon: <Dumbbell className="h-5 w-5 text-primary" />
    };
  }

  if (day.type === "pre_long_run_recovery") {
    return {
      badge: "長跑前恢復",
      card: "border-warning/30 bg-warning/10",
      icon: <Moon className="h-5 w-5 text-warning" />
    };
  }

  if (day.type === "post_long_run_recovery") {
    return {
      badge: "跑後恢復",
      card: "border-success/20 bg-success/5",
      icon: <ShieldCheck className="h-5 w-5 text-success" />
    };
  }

  if (day.type === "easy_run" || day.type === "easy") {
    return {
      badge: "輕鬆跑",
      card: "",
      icon: <CalendarDays className="h-5 w-5 text-primary" />
    };
  }

  return {
    badge: day.type === "rest" ? "休息" : "恢復",
    card: "",
    icon: <Moon className="h-5 w-5 text-muted" />
  };
}

export function WeeklyPlanView() {
  const todayKey = todayInputValue();
  const firstDay = weeklyPlan[0];
  const lastDay = weeklyPlan[weeklyPlan.length - 1];
  const weekLabel = `${formatChineseDate(firstDay.date)} - ${formatChineseDate(lastDay.date)}`;

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow={weekLabel} title="本週課表" />

      {weeklyPlanAdjustment.isAdjusted ? (
        <Card className="border-primary/20 bg-primary/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="primary">調整完成</Badge>
              <h2 className="mt-2 text-lg font-bold">本週課表已調整</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{weeklyPlanAdjustment.reason}</p>
            </div>
            <span className="whitespace-nowrap text-xs font-bold text-muted">
              {weeklyPlanAdjustment.adjustedAt}
            </span>
          </div>

          <details className="mt-3 rounded-card bg-white/70 px-3 py-2">
            <summary className="cursor-pointer text-sm font-bold text-primary">
              查看調整細節
            </summary>
            <div className="mt-2 space-y-2">
              {weeklyPlanAdjustment.changes.map((change) => (
                <p key={change} className="text-sm leading-5 text-ink">
                  {change}
                </p>
              ))}
            </div>
          </details>
        </Card>
      ) : null}

      <div className="space-y-3">
        {weeklyPlan.map((day) => {
          const tone = planTone(day, todayKey);
          const isToday = day.date === todayKey;
          const badgeTone = day.type === "long" || day.type === "post_long_run_recovery"
            ? "success"
            : day.type === "pre_long_run_recovery"
              ? "warning"
              : isToday
                ? "muted"
                : "primary";

          return (
            <Card key={day.date} className={cn("transition", tone.card)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isToday ? "text-white/75" : "text-muted"
                      )}
                    >
                      {day.dayLabel} {day.displayDate}
                    </span>
                    <Badge tone={badgeTone}>{tone.badge}</Badge>
                  </div>
                  <h2 className="mt-2 text-xl font-bold">{day.title}</h2>
                </div>
                {tone.icon}
              </div>

              {(day.distanceKm || day.targetPace) && (
                <div
                  className={cn(
                    "mt-4 grid gap-2 text-sm font-semibold sm:grid-cols-2",
                    isToday ? "text-white" : "text-ink"
                  )}
                >
                  {day.distanceKm ? (
                    <div className={cn("rounded-card px-3 py-2", isToday ? "bg-white/12" : "bg-surface-soft")}>
                      距離：{day.fallbackDistanceKm ? `${day.fallbackDistanceKm}-${day.distanceKm}K` : `${day.distanceKm}K`}
                    </div>
                  ) : null}
                  {day.targetPace ? (
                    <div className={cn("rounded-card px-3 py-2", isToday ? "bg-white/12" : "bg-surface-soft")}>
                      建議配速：{day.targetPace}
                    </div>
                  ) : null}
                </div>
              )}

              <div
                className={cn(
                  "mt-4 rounded-card px-3 py-3",
                  isToday ? "bg-white/12" : "bg-surface-soft"
                )}
              >
                <p className={cn("text-xs font-semibold", isToday ? "text-white/70" : "text-muted")}>
                  目的
                </p>
                <p className="mt-1 text-sm leading-5">{day.purpose}</p>
              </div>

              <div className="mt-3 grid gap-2">
                {day.items.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm leading-5">
                    <span
                      className={cn(
                        "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                        isToday ? "bg-white" : "bg-primary"
                      )}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {day.successCriteria ? (
                <div className={cn("mt-3 rounded-card px-3 py-3", isToday ? "bg-white/12" : "bg-success/10")}>
                  <p className={cn("text-xs font-bold", isToday ? "text-white/70" : "text-success")}>
                    成功標準
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {day.successCriteria.map((criterion) => (
                      <p key={criterion} className="text-sm leading-5">
                        {criterion}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              <p
                className={cn(
                  "mt-4 rounded-card px-3 py-2 text-sm font-medium",
                  isToday ? "bg-white/12 text-white" : "bg-warning/10 text-warning"
                )}
              >
                注意：{day.attention}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
