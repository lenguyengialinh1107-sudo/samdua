import { Skeleton } from "@/components/ui/empty-state";

export default function ProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-64" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <Skeleton className="hidden h-[520px] lg:block" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 border border-border bg-surface p-4">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
