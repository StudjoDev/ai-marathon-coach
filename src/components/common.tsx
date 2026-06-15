import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type BadgeTone = "primary" | "success" | "warning" | "danger" | "muted" | "raceA" | "raceB" | "raceC";
type BadgeVariant = "soft" | "solid" | "outline";
type BadgeSize = "xs" | "sm";

const badgeToneClasses: Record<BadgeVariant, Record<BadgeTone, string>> = {
  soft: {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    muted: "bg-muted/10 text-muted",
    raceA: "bg-primary/10 text-primary",
    raceB: "bg-success/10 text-success",
    raceC: "bg-race-c-soft text-race-c"
  },
  solid: {
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-danger text-white",
    muted: "bg-muted text-white",
    raceA: "bg-primary text-white",
    raceB: "bg-success text-white",
    raceC: "bg-race-c text-white"
  },
  outline: {
    primary: "border border-primary/30 bg-white text-primary",
    success: "border border-success/30 bg-success/10 text-success",
    warning: "border border-warning/30 bg-warning/10 text-warning",
    danger: "border border-danger/30 bg-danger/10 text-danger",
    muted: "border border-line bg-white text-muted",
    raceA: "border border-primary bg-primary text-white",
    raceB: "border border-success/30 bg-success/10 text-success",
    raceC: "border border-race-c-line bg-race-c-soft text-race-c"
  }
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  xs: "px-2 py-0.5 text-[11px]",
  sm: "px-2.5 py-1 text-xs"
};

export function Badge({
  children,
  tone = "primary",
  variant = "soft",
  size = "sm"
}: {
  children: ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill font-semibold leading-none",
        badgeSizeClasses[size],
        badgeToneClasses[variant][tone]
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="text-xs font-semibold text-muted">{eyebrow}</p> : null}
        <h2 className="text-lg font-bold tracking-normal text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
  density = "default"
}: {
  children: ReactNode;
  className?: string;
  density?: "compact" | "default";
}) {
  return <section className={cn("app-card", density === "compact" ? "p-3" : "p-4", className)}>{children}</section>;
}

export function Metric({
  label,
  value,
  unit
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold leading-none text-ink">
        {value}
        {unit ? <span className="ml-1 text-sm font-semibold text-muted">{unit}</span> : null}
      </p>
    </div>
  );
}

export function HealthBoundaryNote() {
  return (
    <p className="rounded-card bg-surface-warning px-3 py-2 text-xs font-semibold leading-5 text-warning">
      本 App 只協助調整訓練負荷與記錄身體回饋，不提供醫療診斷或治療。若疼痛達 5/10 以上、持續超過 48 小時，或影響走路、上下樓梯、睡眠，建議諮詢醫師或物理治療師。
    </p>
  );
}
