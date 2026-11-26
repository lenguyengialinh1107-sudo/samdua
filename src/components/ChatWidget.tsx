"use client";

import { MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { productConditionLabels, site } from "@/lib/site";
import { cn } from "@/lib/utils";

type ChatLink = { label: string; href: string };

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  links?: ChatLink[];
};

/** Bỏ dấu + hạ chữ thường để so khớp từ khoá không phân biệt dấu câu hỏi của khách. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Đếm số từ khoá xuất hiện nguyên từ trong câu (tránh khớp nhầm "gia" trong "giao"). */
function countMatches(text: string, keywords: string[]): number {
  let hits = 0;
  for (const keyword of keywords) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`).test(text)) hits++;
  }
  return hits;
}

const conditionList = Object.values(productConditionLabels)
  .map((label) => `• ${label}`)
  .join("\n");

/** Thứ tự mảng là thứ tự ưu tiên khi số từ khoá khớp bằng nhau. */
const RULES: { keywords: string[]; text: string; links?: ChatLink[] }[] = [
  {
    keywords: ["tu van", "chon may", "nguoi moi", "moi bat dau", "bat dau", "newbie", "tap chup", "hoc chup", "may nao", "nen mua"],
    text:
      "Với người mới, bạn chọn theo 3 bước:\n" +
      "1. Ngân sách — xác định khoảng giá trước.\n" +
      "2. Film hay digital — film cho cảm giác truyền thống, digital/compact tiện và tiết kiệm khi chụp nhiều.\n" +
      "3. Ưu tiên máy dễ dùng, đã kiểm tra và có bảo hành.\n\n" +
      "Bạn cho mình biết ngân sách và bạn thích film hay digital, mình tư vấn cụ thể hơn nhé.",
    links: [
      { label: "Xem máy digital & compact", href: "/products?category=digital-compact" },
      { label: "Xem máy film", href: "/products?category=may-film" },
      { label: "Kinh nghiệm cho người mới", href: "/blog" },
    ],
  },
  {
    keywords: ["gia", "bao nhieu", "tinh trang", "gia ca", "khuyen mai", "giam gia", "may cu", "do moi", "ngoai hinh", "chat luong", "gia ban", "con hang"],
    text:
      "Giá và tình trạng của từng máy được ghi rõ ngay trên trang sản phẩm, kèm ảnh thật.\n\n" +
      `Second Shot phân loại tình trạng:\n${conditionList}\n\n` +
      "Máy cũ đều đã qua kiểm tra đo sáng – cơ – điện tử trước khi bán. Bạn nên xem kỹ phần mô tả và ảnh, hoặc ghé cửa hàng để kiểm tra trực tiếp. Bạn đang quan tâm máy nào để mình tư vấn thêm?",
    links: [
      { label: "Xem tất cả sản phẩm", href: "/products" },
      { label: "Liên hệ cửa hàng", href: "/contact" },
    ],
  },
  {
    keywords: ["3d", "ar", "thuc te ao", "xem 3d", "mo hinh", "dat may", "dien thoai", "camera ar", "quet"],
    text:
      "Trên trang chi tiết sản phẩm, bạn kéo xuống mục “Trải nghiệm 3D / AR”.\n" +
      "• Xoay và phóng to mô hình 3D trực tiếp bằng tay.\n" +
      "• Trên điện thoại, bấm nút “Mở Camera xem ngoài đời thật (AR)” để đặt máy ảnh xuống mặt bàn qua camera sau.\n\n" +
      "Lưu ý: cần mở web qua HTTPS. Android dùng Chrome (ARCore), iPhone dùng Safari.",
    links: [{ label: "Chọn máy để xem 3D/AR", href: "/products" }],
  },
  {
    keywords: ["bao hanh", "doi tra", "giao hang", "van chuyen", "ship", "phi ship", "kiem hang", "hoan tien", "chinh sach", "warranty", "tra hang"],
    text:
      "Bảo hành:\n" +
      "• Máy film & digital đã qua sử dụng: 30 ngày.\n" +
      "• Máy mới nguyên hộp: theo hãng hoặc 12 tháng.\n" +
      "• Phụ kiện: 30 ngày cho lỗi kỹ thuật.\n\n" +
      "Giao hàng:\n" +
      "• Nội thành Hà Nội: 1–2 ngày làm việc.\n" +
      "• Các tỉnh khác: 2–5 ngày làm việc.\n" +
      "• Miễn phí vận chuyển cho đơn đạt ngưỡng quy định; phí được hiển thị rõ ở bước thanh toán.",
    links: [
      { label: "Chính sách bảo hành", href: "/policies/warranty" },
      { label: "Chính sách vận chuyển", href: "/policies/shipping" },
      { label: "Chính sách đổi trả", href: "/policies/returns" },
    ],
  },
  {
    keywords: ["thanh toan", "cod", "chuyen khoan", "tra gop", "the tin dung", "tien mat"],
    text:
      "Second Shot hỗ trợ 2 hình thức thanh toán:\n" +
      "• COD — thanh toán khi nhận hàng.\n" +
      "• Chuyển khoản ngân hàng.\n\n" +
      "Thông tin chuyển khoản hiển thị ở bước thanh toán và trong xác nhận đơn hàng.",
    links: [{ label: "Xem giỏ hàng", href: "/cart" }],
  },
  {
    keywords: ["phu kien", "ong kinh", "pin", "sac", "tui", "cuon film"],
    text:
      "Cửa hàng có phụ kiện (ống kính, pin, sạc, túi) và film các loại. Bạn xem mục “Phụ kiện” để chọn nhé.",
    links: [{ label: "Xem phụ kiện & film", href: "/products?category=phu-kien" }],
  },
  {
    keywords: ["lien he", "hotline", "so dien thoai", "dia chi", "o dau", "email", "gio lam viec", "cua hang", "map"],
    text:
      "Bạn có thể liên hệ Second Shot qua:\n" +
      `• Hotline: ${site.hotline}\n` +
      `• Email: ${site.email}\n` +
      `• Địa chỉ: ${site.address}\n` +
      `• Giờ mở cửa: ${site.workingHours}`,
    links: [{ label: "Trang liên hệ", href: "/contact" }],
  },
  {
    keywords: ["chao", "xin chao", "hello", "hi", "alo", "hey"],
    text:
      `Chào bạn! Mình là trợ lý của ${site.name}. ` +
      "Bạn cần tư vấn chọn máy, xem giá & tình trạng, hướng dẫn xem 3D/AR hay chính sách bảo hành – giao hàng?",
  },
];

const FALLBACK: { text: string; links: ChatLink[] } = {
  text:
    "Mình chưa có sẵn câu trả lời cho nội dung này. Bạn thử chọn một gợi ý bên dưới, " +
    `hoặc liên hệ hotline ${site.hotline} / ${site.email} để được tư vấn trực tiếp nhé.`,
  links: [{ label: "Trang liên hệ", href: "/contact" }],
};

/** Chọn câu trả lời có nhiều từ khoá khớp nhất; không khớp thì trả về câu mặc định. */
function buildReply(rawInput: string): { text: string; links?: ChatLink[] } {
  const text = normalize(rawInput);
  let best: (typeof RULES)[number] | null = null;
  let bestScore = 0;

  for (const rule of RULES) {
    const score = countMatches(text, rule.keywords);
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  return best ? { text: best.text, links: best.links } : FALLBACK;
}

const QUICK_REPLIES: { label: string; query: string }[] = [
  { label: "Chọn máy cho người mới", query: "Tư vấn chọn máy cho người mới bắt đầu" },
  { label: "Giá & tình trạng máy", query: "Giá và tình trạng máy như thế nào?" },
  { label: "Xem 3D/AR trên điện thoại", query: "Hướng dẫn xem máy ảnh 3D/AR trên điện thoại" },
  { label: "Bảo hành & giao hàng", query: "Chính sách bảo hành và giao hàng ra sao?" },
];

const WELCOME =
  `Xin chào, mình là trợ lý của ${site.name}. ` +
  "Mình có thể tư vấn chọn máy, giải đáp về giá & tình trạng, hướng dẫn xem máy ảnh 3D/AR và chính sách bảo hành – giao hàng. Bạn cần hỗ trợ gì?";

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 0, role: "bot", text: WELCOME },
  ]);

  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const idRef = React.useRef(0);

  // Cuộn xuống tin nhắn mới nhất.
  React.useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  // Tự focus ô nhập khi mở khung chat.
  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function send(raw: string) {
    const text = raw.trim();
    if (!text) return;

    const reply = buildReply(text);
    const userMessage: Message = { id: (idRef.current += 1), role: "user", text };
    const botMessage: Message = {
      id: (idRef.current += 1),
      role: "bot",
      text: reply.text,
      links: reply.links,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Trợ lý tư vấn khách hàng"
          className="flex h-[70vh] max-h-[34rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-lg border border-border-strong bg-surface shadow-2xl"
        >
          <header className="flex items-start justify-between gap-2 bg-charcoal px-4 py-3 text-accent-foreground">
            <div className="min-w-0">
              <p className="font-serif text-base leading-tight">Trợ lý {site.name}</p>
              <p className="mt-0.5 text-[11px] text-accent-foreground/70">
                Tư vấn máy ảnh film &amp; digital
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng cửa sổ tư vấn"
              className="rounded-sm p-1 text-accent-foreground/80 transition-colors hover:bg-white/10 hover:text-accent-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-background px-3 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-surface text-foreground",
                  )}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.links && message.links.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
                      {message.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="text-xs font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border bg-surface px-3 py-2">
            {QUICK_REPLIES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => send(item.query)}
                className="rounded-full border border-border-strong bg-surface-muted px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-film hover:bg-accent-soft"
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-surface px-3 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi..."
              aria-label="Nhập câu hỏi tư vấn"
              className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-film focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Gửi câu hỏi"
              className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-accent text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Đóng cửa sổ tư vấn" : "Mở cửa sổ tư vấn"}
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-border-strong bg-charcoal px-4 text-sm font-medium text-accent-foreground shadow-lg transition-colors hover:bg-film"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        {!open && <span className="hidden sm:inline">Tư vấn</span>}
      </button>
    </div>
  );
}
