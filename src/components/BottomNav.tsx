import type { LucideIcon } from "lucide-react";
import type { AppTab } from "../App";
import { cn } from "./common";

type NavTab = {
  id: AppTab;
  label: string;
  icon: LucideIcon;
};

export function BottomNav({
  tabs,
  activeTab,
  onChange
}: {
  tabs: NavTab[];
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line/80 bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur"
      aria-label="主要導覽"
    >
      <div className="mx-auto grid max-w-[430px] px-1.5 py-2" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-card text-[11px] font-semibold transition",
                isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-soft hover:text-ink"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={isActive ? `${tab.label}，目前頁面` : `切換到${tab.label}`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
              <span className="max-w-full text-center leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
