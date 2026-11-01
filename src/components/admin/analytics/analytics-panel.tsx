import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface AnalyticsPanelProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Khung nội dung dùng chung cho các khối của dashboard đo lường. */
export function AnalyticsPanel({
  title,
  description,
  action,
  children,
  className,
}: AnalyticsPanelProps) {
  return (
    <section className={cn("border border-border bg-surface", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-serif text-lg">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export interface MiniStatProps {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  hint?: string;
  className?: string;
}

/** Ô số liệu nhỏ dùng trong các khối thống kê phụ. */
export function MiniStat({ label, value, icon: Icon, hint, className }: MiniStatProps) {
  return (
    <div className={cn("border border-border bg-surface-muted/40 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="ah-label">{label}</p>
        {Icon ? <Icon className="size-4 text-accent" aria-hidden /> : null}
      </div>
      <p className="mt-2 font-serif text-xl leading-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
