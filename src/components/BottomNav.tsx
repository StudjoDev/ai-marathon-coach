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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line/80 bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_rgba(29,49,42,0.08)] backdrop-blur">
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
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-card text-[10px] font-semibold transition",
                isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-soft hover:text-ink"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
