import { CalendarDays, Dumbbell, Moon, ShieldCheck } from "lucide-react";
import { weeklyPlan } from "../data/weeklyPlan";
import type { WeeklyPlanDay } from "../types";
import { Badge, Card, SectionHeader, cn } from "./common";

const today = "2026-06-14";

function planTone(day: WeeklyPlanDay) {
  if (day.date === today) {
    return {
      badge: "今日",
      card: "border-primary/40 bg-primary text-white",
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
      badge: "補強",
      card: "",
      icon: <Dumbbell className="h-5 w-5 text-primary" />
    };
  }

  return {
    badge: day.type === "rest" ? "休息" : "輕鬆跑",
    card: "",
    icon: <Moon className="h-5 w-5 text-muted" />
  };
}

export function WeeklyPlanView() {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="6/14 週日 - 6/20 週六" title="本週課表" />

      <div className="space-y-3">
        {weeklyPlan.map((day) => {
          const tone = planTone(day);
          const isToday = day.date === today;

          return (
            <Card key={day.date} className={cn("transition", tone.card)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isToday ? "text-white/75" : "text-muted"
                      )}
                    >
                      {day.dayLabel} {day.displayDate}
                    </span>
                    <Badge tone={day.type === "long" ? "success" : isToday ? "muted" : "primary"}>
                      {tone.badge}
                    </Badge>
                  </div>
                  <h2 className="mt-2 text-xl font-bold">{day.title}</h2>
                </div>
                {tone.icon}
              </div>

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
