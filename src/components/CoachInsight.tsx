import { AlertTriangle, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { Badge, Card, SectionHeader } from "./common";

const currentJudgement = [
  { label: "週五可以安排 8-9K 長跑", tone: "success" as const },
  { label: "週二、週三對調已完成", tone: "success" as const },
  { label: "週四不能保留 5K，必須改成恢復日", tone: "warning" as const },
  { label: "膝蓋疼痛仍需要觀察", tone: "warning" as const },
  { label: "右大腿後側酸痛時，不做衝刺與重訓", tone: "warning" as const }
];

const strategy = [
  "週二：臀肌與穩定訓練。",
  "週三：Easy Run 4K，只恢復跑感。",
  "週四：長跑前恢復日，不補 5K。",
  "週五：Long Run 8-9K，全程能聊天。",
  "週六：跑後恢復日，不加跑。"
];

const fridayRules = [
  "目標 9K；如果膝蓋或右大腿後側不穩，8K 就可以收工。",
  "膝蓋疼痛達 4/10 以上，停止跑步改走路。",
  "右大腿後側出現刺痛或拉扯感，立即停止。",
  "跑後填寫疼痛紀錄，包含膝蓋、右大腿後側與樓梯狀態。"
];

const upgradeRules = [
  "週五 9K 完成後，膝蓋疼痛在 2/10 以下，下週可考慮 10-11K。",
  "8K 前就開始痛，本週視為恢復週，不增加距離。",
  "疼痛超過 48 小時仍有 4/10 以上，暫停跑步，改恢復訓練。",
  "配速不是本週成功標準，安全完成才是。"
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
            <h2 className="mt-1 text-xl font-bold leading-7">
              可以把長跑移到週五，但週四要恢復，不能再跑 5K。
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/82">
              原因很直接：週三 Easy Run、週四 5K、週五長跑會變成連三天跑步。膝蓋和右大腿後側已經有反應，這樣安排風險太高。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="muted">調整完成</Badge>
              <Badge tone="muted">週五長跑</Badge>
              <Badge tone="muted">週四恢復</Badge>
              <Badge tone="muted">膝蓋觀察</Badge>
            </div>
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
            <div key={item} className="flex items-start gap-2 rounded-card bg-surface-soft px-3 py-2 text-sm font-semibold leading-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">週五長跑規則</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 space-y-3">
          {fridayRules.map((rule) => (
            <p key={rule} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5">
              {rule}
            </p>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">下週是否升級</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 space-y-3">
          {upgradeRules.map((rule) => (
            <p key={rule} className="rounded-card bg-surface-soft px-3 py-2 text-sm leading-5">
              {rule}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
