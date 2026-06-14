import { AlertTriangle, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { Badge, Card, SectionHeader } from "./common";

const currentJudgement = [
  { label: "已具備 10K~11K 完跑能力", tone: "success" as const },
  { label: "半馬完成機率高", tone: "success" as const },
  { label: "限制點是膝蓋與肌肉耐受度", tone: "warning" as const },
  { label: "大腿後側肌群負荷偏高", tone: "warning" as const },
  { label: "屁股外側穩定肌群可能疲勞", tone: "warning" as const }
];

const strategy = ["不衝 12K", "週六長跑降為 9K", "週二、週四只做輕鬆跑", "週三補屁股外側肌群訓練", "膝蓋痛就改走路"];

const rules = [
  "9K 後膝蓋不痛：下週可回到 11K",
  "9K 才開始痛：代表痛點延後，有進步",
  "8K 或更早開始痛：維持 9K，不增加距離",
  "疼痛超過 48 小時：停止跑步，改散步或單車"
];

export function CoachInsight() {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="靜態規則 MVP" title="教練分析" />

      <Card className="bg-primary text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/14">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/72">教練說</p>
            <h2 className="mt-1 text-xl font-bold leading-7">這週不是退步，是讓身體吸收訓練。</h2>
            <p className="mt-3 text-sm leading-6 text-white/82">
              你已經能完成 10K 以上，現在先把膝蓋反應壓下來，半馬訓練會更穩。
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">目前判斷</h2>
          <div className="flex gap-1.5">
            <Badge tone="success">良好</Badge>
            <Badge tone="warning">觀察</Badge>
            <Badge tone="danger">風險</Badge>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {currentJudgement.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-3 border-b border-line pb-2 last:border-b-0 last:pb-0">
              <span className="text-sm leading-5">{item.label}</span>
              <Badge tone={item.tone}>{item.tone === "success" ? "良好" : "觀察"}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">本週策略</h2>
          <ShieldCheck className="h-5 w-5 text-success" />
        </div>
        <div className="mt-3 grid gap-2">
          {strategy.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">下週判斷規則</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 space-y-3">
          {rules.map((rule) => (
            <p key={rule} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5">
              {rule}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
