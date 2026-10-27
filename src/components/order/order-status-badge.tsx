import { Badge } from "@/components/ui/badge";
import { orderStatusLabels } from "@/lib/site";

const statusVariants: Record<string, "default" | "accent" | "film" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "accent",
  SHIPPING: "film",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariants[status] ?? "default"}>
      {orderStatusLabels[status] ?? status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "danger"> = {
    UNPAID: "warning",
    PAID: "success",
    REFUNDED: "default",
    FAILED: "danger",
  };
  const labels: Record<string, string> = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thanh toán lỗi",
  };
  return <Badge variant={variants[status] ?? "default"}>{labels[status] ?? status}</Badge>;
}
