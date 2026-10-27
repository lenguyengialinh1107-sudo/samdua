import type { ReactNode } from "react";

/**
 * Khung chung cho các trang nội dung tĩnh (giới thiệu, chính sách, liên hệ).
 * Giữ nhịp đọc editorial: tiêu đề serif, nội dung hẹp, khoảng thở rộng.
 */
export function StaticPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-6">
        {eyebrow ? <p className="ah-label">{eyebrow}</p> : null}
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm text-muted">{description}</p> : null}
      </header>
      <div className="mt-8 space-y-8 text-sm leading-relaxed">{children}</div>
    </article>
  );
}

export function StaticSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="space-y-3 scroll-mt-24">
      <h2 className="font-serif text-xl">{title}</h2>
      <div className="space-y-3 text-muted [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
