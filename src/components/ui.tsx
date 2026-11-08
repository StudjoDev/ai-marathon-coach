import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import type { KeyStat } from "../utils/raceUtils";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="enter mx-auto min-h-svh w-full max-w-[480px] bg-paper">{children}</div>;
}

export function Hero({ children, labelledBy }: { children: ReactNode; labelledBy?: string }) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="flex flex-col bg-ink px-5 pb-6 pt-[calc(env(safe-area-inset-top)+20px)] text-white"
    >
      {children}
    </section>
  );
}

export function TopBar({ back, right }: { back?: { href: string; label: string }; right?: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between">
      {back ? (
        <a href={back.href} className="focus-ring -ml-1.5 flex min-h-11 items-center gap-0.5 rounded-md pr-2 text-base text-white">
          <ChevronLeft className="h-[22px] w-[22px]" aria-hidden="true" />
          {back.label}
        </a>
      ) : (
        <span />
      )}
      {right}
    </div>
  );
}

export function Eyebrow({ children, dot = false }: { children: ReactNode; dot?: boolean }) {
  return (
    <p className="flex items-center gap-2 font-display text-base font-bold tracking-[1.5px] text-accent">
      {dot ? <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" /> : null}
      {children}
    </p>
  );
}

export function BigDistance({ value, size = "lg", note }: { value: string; size?: "lg" | "md"; note?: string }) {
  return (
    <p className="mt-1 flex items-baseline gap-1.5 font-display font-extrabold italic leading-[0.9]">
      <span className={cn("tracking-[-3px]", size === "lg" ? "text-[120px]" : "text-[96px]")}>{value}</span>
      <span className="text-[30px] text-muted-dark">KM</span>
      {note ? <span className="ml-2 font-sans text-[13px] font-bold not-italic tracking-normal text-accent">{note}</span> : null}
    </p>
  );
}

export function StatRow({ stats }: { stats: KeyStat[] }) {
  if (stats.length === 0) return null;

  return (
    <dl className="mt-5 grid grid-cols-3 border-t border-line-dark pt-4">
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0">
          <dt className="text-xs text-muted-dark">{stat.label}</dt>
          <dd className="mt-0.5 truncate font-display text-[30px] font-bold tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionTitle({ title, tag, as: Tag = "h2" }: { title: string; tag?: ReactNode; as?: "h2" | "span" }) {
  return (
    <Tag className="mb-1 flex items-baseline justify-between">
      <span className="text-xl font-black">{title}</span>
      {tag ? <span className="font-display text-base font-bold tracking-[1px] text-muted">{tag}</span> : null}
    </Tag>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="focus-ring min-h-[54px] w-full rounded-full bg-accent text-base font-extrabold text-ink transition active:scale-[0.99] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export const textAreaClass =
  "focus-ring w-full resize-y rounded-[14px] border-0 bg-soft p-3.5 text-[15px] leading-normal text-ink placeholder:text-muted";
