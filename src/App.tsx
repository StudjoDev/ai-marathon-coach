import { useMemo, useState } from "react";
import { CalendarDays, Flag, HeartPulse, Home, type LucideIcon } from "lucide-react";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./components/Dashboard";
import { PainTracker } from "./components/PainTracker";
import { RaceSchedule } from "./components/RaceSchedule";
import { WeeklyPlanView } from "./components/WeeklyPlanView";
import { appMeta } from "./data/appMeta";

export type AppTab = "memo" | "races" | "plan" | "pain";

const tabs = [
  { id: "memo", label: "備忘", icon: Home },
  { id: "races", label: "賽事", icon: Flag },
  { id: "plan", label: "課表", icon: CalendarDays },
  { id: "pain", label: "疼痛", icon: HeartPulse }
] satisfies Array<{ id: AppTab; label: string; icon: LucideIcon }>;

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("memo");
  const [painInitialDate, setPainInitialDate] = useState<string>();

  function openPainTracker(date: string) {
    setPainInitialDate(date);
    setActiveTab("pain");
  }

  function changeTab(tab: AppTab) {
    if (tab === "pain") {
      setPainInitialDate(undefined);
    }

    setActiveTab(tab);
  }

  const activeScreen = useMemo(() => {
    switch (activeTab) {
      case "races":
        return <RaceSchedule />;
      case "plan":
        return <WeeklyPlanView />;
      case "pain":
        return (
          <PainTracker
            initialDate={painInitialDate}
            onOpenCoach={() => setActiveTab("memo")}
            onOpenToday={() => setActiveTab("memo")}
          />
        );
      case "memo":
      default:
        return (
          <Dashboard
            onOpenPlan={() => setActiveTab("plan")}
            onOpenRaces={() => setActiveTab("races")}
            onOpenPain={openPainTracker}
          />
        );
    }
  }, [activeTab, painInitialDate]);

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
      <BottomNav tabs={tabs} activeTab={activeTab} onChange={changeTab} />
    </div>
  );
}
