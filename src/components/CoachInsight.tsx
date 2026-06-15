import { AlertTriangle, CheckCircle2, ClipboardList, MessageCircle, ShieldCheck } from "lucide-react";
import { Badge, Card, HealthBoundaryNote, SectionHeader } from "./common";

const decisionSummary = {
  decision: "週五安排長跑 8-9K，週四改為恢復日",
  evidence: ["6/13 長跑 11.01K", "跑後膝蓋痛", "右大腿後側酸", "每週訓練 3 天"],
  appliedRules: [
    "R-LOAD-01：避免連三天跑步",
    "R-PAIN-04：疼痛達 4/10 時調整當次訓練",
    "R-PAIN-48H：疼痛持續 48 小時需專業評估"
  ],
  result: "週四先不安排 5K，週五長跑以能聊天的強度完成，週六只做恢復。",
  nextReview: ["跑後膝蓋 0-10 分", "右大腿後側 0-10 分", "隔天樓梯狀態"]
};

const currentJudgement = [
  { label: "週五可以安排 8-9K 長跑", tone: "success" as const, badge: "良好" },
  { label: "週二、週三對調已完成", tone: "success" as const, badge: "良好" },
  { label: "週四先不保留 5K，讓週五長跑更安全", tone: "warning" as const, badge: "觀察" },
  { label: "膝蓋疼痛仍需要觀察", tone: "warning" as const, badge: "觀察" },
  { label: "右大腿後側酸痛時，不做衝刺與重訓", tone: "warning" as const, badge: "觀察" },
  { label: "若疼痛達 5/10 或持續 48 小時，需要降強度並尋求專業評估", tone: "danger" as const, badge: "風險" },
  { label: "11/22 桃園落羽松是半馬後恢復景觀跑，不當測驗賽", tone: "warning" as const, badge: "觀察" }
];

const weeklyStrategy = [
  "週二：臀肌與穩定訓練。",
  "週三：輕鬆跑 4K，只恢復跑感。",
  "週四：長跑前恢復日，不補 5K。",
  "週五：長跑 8-9K，全程能聊天。",
  "週六：跑後恢復日，不加跑。"
];

const novemberRules = [
  "11/08 板橋半馬 21K 是 A 賽，賽後先恢復，不急著再拼。",
  "11/22 桃園落羽松 11K 是 C 賽，定位是半馬後恢復景觀跑。",
  "11/22 前 3K 保守，全程維持能聊天的強度。",
  "11/22 若膝蓋痛達 4/10 以上，改走跑；右大腿後側刺痛或拉扯就停止加速。",
  "11/22 跑後必填疼痛紀錄；若疼痛超過 48 小時，11/29 Garmin 改輕鬆跑或評估不出賽。"
];

export function CoachInsight() {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="規則教練" title="教練決策摘要" />

      <Card className="bg-primary text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/14">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/72">教練說</p>
            <h2 className="mt-1 text-xl font-bold leading-7">{decisionSummary.decision}</h2>
            <p className="mt-3 text-sm leading-6 text-white/82">
              這次判斷的重點不是把距離補滿，而是讓膝蓋與右大腿後側在週五長跑前恢復到可控狀態。
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">依據資料</h2>
          <ClipboardList className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {decisionSummary.evidence.map((item) => (
            <Badge key={item} tone="primary">{item}</Badge>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">套用規則</h2>
          <ShieldCheck className="h-5 w-5 text-success" />
        </div>
        <div className="mt-3 grid gap-2">
          {decisionSummary.appliedRules.map((rule) => (
            <p key={rule} className="rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold leading-5">
              {rule}
            </p>
          ))}
        </div>
      </Card>

      <Card className="border-success/30 bg-success/10">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div>
            <h2 className="text-lg font-bold">決策結果</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">{decisionSummary.result}</p>
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
              <Badge tone={item.tone}>{item.badge}</Badge>
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
          {weeklyStrategy.map((item) => (
            <div key={item} className="flex items-start gap-2 rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold leading-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">下次覆核</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 grid gap-2">
          {decisionSummary.nextReview.map((item) => (
            <p key={item} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5">
              {item}
            </p>
          ))}
        </div>
      </Card>

      <Card className="border-warning/30 bg-warning/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone="warning">11 月賽事密集</Badge>
            <h2 className="mt-2 text-lg font-bold">板橋後 14 天落羽松，再 7 天 Garmin</h2>
          </div>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 space-y-3">
          {novemberRules.map((rule) => (
            <p key={rule} className="rounded-card bg-white/80 px-3 py-2 text-sm font-semibold leading-5">
              {rule}
            </p>
          ))}
        </div>
      </Card>

      <HealthBoundaryNote />
    </div>
  );
}
