import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { trainingLogs } from "../data/trainingLogs";
import { Badge, Card, Metric, SectionHeader } from "./common";

const chartData = trainingLogs.map((log) => ({
  date: log.date.slice(5).replace("-", "/"),
  distanceKm: log.distanceKm,
  avgHr: log.avgHr
}));

export function TrainingLogView() {
  const latestLog = trainingLogs[trainingLogs.length - 1];

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="最近三次訓練" title="訓練紀錄" />

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="primary">6/13</Badge>
            <h2 className="mt-2 text-xl font-bold">最新長跑</h2>
          </div>
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Metric label="距離" value={latestLog.distanceKm.toFixed(2)} unit="K" />
          <Metric label="時間" value={latestLog.duration} />
          <Metric label="配速" value={latestLog.pace} />
          <Metric label="步頻" value={String(latestLog.cadence)} unit="步/分" />
        </div>
        <p className="mt-4 rounded-card bg-surface-soft px-3 py-2 text-sm text-muted">
          {latestLog.note}
        </p>
      </Card>

      <TrendCard
        title="距離趨勢"
        icon={<LineChartIcon className="h-5 w-5 text-primary" />}
        dataKey="distanceKm"
        color="#2F6F64"
        unit="K"
      />

      <TrendCard
        title="平均心率趨勢"
        icon={<HeartPulse className="h-5 w-5 text-danger" />}
        dataKey="avgHr"
        color="#B94040"
        unit="下/分"
      />

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">訓練提醒</h2>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-3 space-y-2">
          {[
            "距離進步很快，這週先穩住。",
            "心率資料可能偏高，需搭配主觀感受。",
            "膝蓋狀況比配速更重要。"
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm leading-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrendCard({
  title,
  icon,
  dataKey,
  color,
  unit
}: {
  title: string;
  icon: ReactNode;
  dataKey: "distanceKm" | "avgHr";
  color: string;
  unit: string;
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {icon}
      </div>
      <div className="h-[180px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
            <CartesianGrid stroke="#DDE5DE" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#6F7974", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6F7974", fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${value} ${unit}`, title]}
              labelFormatter={(label) => `日期 ${label}`}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #DDE5DE",
                boxShadow: "0 10px 30px rgba(29,49,42,0.08)"
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
