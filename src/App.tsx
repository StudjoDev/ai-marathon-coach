import { useMemo, useState } from "react";
import { CalendarDays, Flag, type LucideIcon } from "lucide-react";
import { BottomNav } from "./components/BottomNav";
import { RaceSchedule } from "./components/RaceSchedule";
import { WeeklyPlanView } from "./components/WeeklyPlanView";
import { appMeta } from "./data/appMeta";

export type AppTab = "races" | "schedule";

const tabs = [
  { id: "races", label: "賽事", icon: Flag },
  { id: "schedule", label: "行程表", icon: CalendarDays }
] satisfies Array<{ id: AppTab; label: string; icon: LucideIcon }>;

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("races");

  const activeScreen = useMemo(() => {
    switch (activeTab) {
      case "schedule":
        return <WeeklyPlanView />;
      case "races":
      default:
        return <RaceSchedule />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-svh bg-background text-ink">
      <main className="mx-auto min-h-svh w-full max-w-[430px] px-5 pb-[calc(104px+env(safe-area-inset-bottom))] pt-5">
        <div className="mb-3 flex justify-end">
          <span
            className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-bold text-muted shadow-card"
            title={appMeta.releaseNote}
            aria-label={`目前版本 ${appMeta.version}，${appMeta.releaseNote}`}
          >
            版本 {appMeta.version}
          </span>
        </div>
        <div key={activeTab} className="enter-up">
          {activeScreen}
        </div>
      </main>
      <BottomNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
