"use client";

import * as React from "react";
import { Check, Link2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Chia sẻ bài viết lên mạng xã hội và sao chép liên kết. */
export function BlogShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = React.useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt chặn clipboard: bỏ qua, người dùng vẫn copy thủ công được.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Share2 className="size-3.5" aria-hidden />
        Chia sẻ
      </span>

      {links.map((link) => (
        <Button key={link.label} variant="outline" size="sm" asChild>
          <a href={link.href} target="_blank" rel="noreferrer noopener">
            {link.label}
          </a>
        </Button>
      ))}

      <Button variant="ghost" size="sm" onClick={handleCopy}>
        <Link2 className={cn(copied && "text-success")} />
        {copied ? "Đã chép" : "Sao chép liên kết"}
        {copied ? <Check className="text-success" /> : null}
      </Button>
    </div>
  );
}
