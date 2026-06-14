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
      <div className="mx-auto grid max-w-[430px] grid-cols-5 px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-card text-[11px] font-semibold transition",
                isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-soft hover:text-ink"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
