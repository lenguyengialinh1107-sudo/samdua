"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  CategoryViewsPoint,
  MonthlyRevenuePoint,
  TimeSeriesPoint,
  TrafficSourcePoint,
} from "@/lib/analytics/types";
import { formatNumber, formatVnd } from "@/lib/format";

/** Bảng màu biểu đồ — lấy từ design tokens của Second Shot. */
export const CHART_COLORS = {
  accent: "#c4622d",
  film: "#6b4a33",
  charcoal: "#2b2622",
  success: "#3f6b4a",
  warning: "#a8701b",
  border: "#ded4c3",
  muted: "#6f665c",
  paper: "#fffdf8",
} as const;

const PIE_COLORS = [
  CHART_COLORS.accent,
  CHART_COLORS.film,
  CHART_COLORS.charcoal,
  CHART_COLORS.warning,
  CHART_COLORS.success,
  "#c8bba5",
];

const axisStyle = {
  fontSize: 11,
  fill: CHART_COLORS.muted,
} as const;

const tooltipStyle = {
  border: `1px solid ${CHART_COLORS.border}`,
  borderRadius: 5,
  background: CHART_COLORS.paper,
  fontSize: 12,
  color: "#201c18",
  boxShadow: "0 8px 24px rgb(43 38 34 / 0.10)",
} as const;

/** Rút gọn số tiền cho trục tung: 1.250.000.000 -> "1,3 tỷ". */
function formatCompactVnd(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  return formatNumber(value);
}

function ChartFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children as ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

/** Biểu đồ đường: lượt truy cập 30 ngày gần nhất. */
export function VisitorsLineChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ChartFrame>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={CHART_COLORS.border} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} tickLine={false} axisLine={false} minTickGap={28} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={52} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => `Ngày ${label}`}
          formatter={(value) => [formatNumber(Number(value)), "Lượt truy cập"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          name="Lượt truy cập"
          stroke={CHART_COLORS.accent}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: CHART_COLORS.accent }}
        />
      </LineChart>
    </ChartFrame>
  );
}

/** Biểu đồ cột: lượt xem sản phẩm theo danh mục. */
export function ProductViewsBarChart({ data }: { data: CategoryViewsPoint[] }) {
  return (
    <ChartFrame>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={CHART_COLORS.border} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ ...axisStyle, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={52}
        />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={52} />
        <Tooltip
          cursor={{ fill: "rgb(196 98 45 / 0.06)" }}
          contentStyle={tooltipStyle}
          formatter={(value) => [formatNumber(Number(value)), "Lượt xem"]}
        />
        <Bar dataKey="views" name="Lượt xem" fill={CHART_COLORS.accent} radius={[3, 3, 0, 0]} maxBarSize={64} />
      </BarChart>
    </ChartFrame>
  );
}

/** Biểu đồ tròn: nguồn truy cập, kèm chú giải tự viết. */
export function TrafficSourcesPieChart({ data }: { data: TrafficSourcePoint[] }) {
  const total = data.reduce((sum, item) => sum + item.visitors, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="source"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={2}
              stroke={CHART_COLORS.paper}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.source} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [formatNumber(Number(value)), String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="space-y-2">
        {data.map((entry, index) => {
          const percent = total > 0 ? (entry.visitors / total) * 100 : 0;
          return (
            <li key={entry.source} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-xs"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                <span className="truncate text-muted">{entry.source}</span>
              </span>
              <span className="shrink-0 font-medium">{percent.toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Biểu đồ vùng: doanh thu theo tháng. */
export function RevenueAreaChart({ data }: { data: MonthlyRevenuePoint[] }) {
  return (
    <ChartFrame>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -4 }}>
        <defs>
          <linearGradient id="analyticsRevenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART_COLORS.border} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(value) => formatCompactVnd(Number(value))}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => `Tháng ${String(label).replace("T", "")}`}
          formatter={(value) => [formatVnd(Number(value)), "Doanh thu"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Doanh thu"
          stroke={CHART_COLORS.accent}
          strokeWidth={2}
          fill="url(#analyticsRevenueFill)"
        />
      </AreaChart>
    </ChartFrame>
  );
}
