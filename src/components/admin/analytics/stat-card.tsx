import type { ComponentType } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { AnalyticsStat } from "@/lib/analytics/types";
import { formatNumber, formatVnd } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Định dạng giá trị theo loại chỉ số. */
export function formatStatValue(value: number, format: AnalyticsStat["format"]): string {
  switch (format) {
    case "currency":
      return formatVnd(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    default:
      return formatNumber(value);
  }
}

export interface StatCardProps {
  stat: AnalyticsStat;
  icon: ComponentType<{ className?: string }>;
}

/** Thẻ số liệu ở đầu dashboard. */
export function StatCard({ stat, icon: Icon }: StatCardProps) {
  const positive = (stat.trend ?? 0) >= 0;

  return (
    <div className="group border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_10px_28px_rgb(43_38_34/0.08)]">
      <div className="flex items-start justify-between gap-2">
        <p className="ah-label">{stat.label}</p>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <Icon className="size-4" />
        </span>
      </div>

      <p className="mt-3 font-serif text-2xl leading-none">{formatStatValue(stat.value, stat.format)}</p>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {stat.trend === undefined ? null : (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-success" : "text-danger",
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {positive ? "+" : ""}
            {stat.trend.toFixed(1)}%
          </span>
        )}
        <span className="text-muted">so với kỳ trước</span>
      </div>
    </div>
  );
}
