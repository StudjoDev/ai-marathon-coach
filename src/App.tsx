import { useMemo, useState } from "react";
import { Activity, CalendarDays, Flag, HeartPulse, Home, MessageCircle, type LucideIcon } from "lucide-react";
import { BottomNav } from "./components/BottomNav";
import { CoachInsight } from "./components/CoachInsight";
import { Dashboard } from "./components/Dashboard";
import { PainTracker } from "./components/PainTracker";
import { RaceSchedule } from "./components/RaceSchedule";
import { TrainingLogView } from "./components/TrainingLogView";
import { WeeklyPlanView } from "./components/WeeklyPlanView";
import { appMeta } from "./data/appMeta";

export type AppTab = "today" | "plan" | "races" | "logs" | "pain" | "coach";

const tabs = [
  { id: "today", label: "今日", icon: Home },
  { id: "plan", label: "課表", icon: CalendarDays },
  { id: "races", label: "賽事", icon: Flag },
  { id: "logs", label: "紀錄", icon: Activity },
  { id: "pain", label: "疼痛", icon: HeartPulse },
  { id: "coach", label: "教練", icon: MessageCircle }
] satisfies Array<{ id: AppTab; label: string; icon: LucideIcon }>;

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("today");
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
      case "plan":
        return <WeeklyPlanView />;
      case "races":
        return <RaceSchedule />;
      case "logs":
        return <TrainingLogView />;
      case "pain":
        return (
          <PainTracker
            initialDate={painInitialDate}
            onAfterSave={() => {
              setPainInitialDate(undefined);
              setActiveTab("today");
            }}
          />
        );
      case "coach":
        return <CoachInsight />;
      case "today":
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
      <main className="mx-auto min-h-svh w-full max-w-[430px] px-5 pb-[calc(96px+env(safe-area-inset-bottom))] pt-5">
        <div className="mb-3 flex justify-end">
          <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-bold text-muted shadow-card">
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
