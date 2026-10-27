import type { Metadata } from "next";

import { ShippingSettingsForm } from "@/components/admin/shipping-settings-form";
import { Badge } from "@/components/ui/badge";
import { site } from "@/lib/site";
import { isCloudinaryEnabled } from "@/server/env";
import { getShippingConfig } from "@/server/services/settings.service";

export const metadata: Metadata = { title: "Cấu hình cửa hàng" };

export default async function AdminSettingsPage() {
  const config = await getShippingConfig();
  const uploadEnabled = isCloudinaryEnabled();

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl">Cấu hình cửa hàng</h1>
        <p className="text-sm text-muted">
          Các thông tin dưới đây được đọc từ biến môi trường, không chỉnh sửa trong giao diện được.
        </p>
      </header>

      <ShippingSettingsForm flatFee={config.flatFee} freeThreshold={config.freeThreshold} />

      <section className="max-w-xl space-y-4 border border-border bg-surface p-5">
        <h2 className="font-serif text-lg">Thông tin cửa hàng</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="ah-label">Tên cửa hàng</dt>
            <dd className="mt-1">{site.name}</dd>
          </div>
          <div>
            <dt className="ah-label">Hotline</dt>
            <dd className="mt-1">{site.hotline}</dd>
          </div>
          <div>
            <dt className="ah-label">Email</dt>
            <dd className="mt-1">{site.email}</dd>
          </div>
          <div>
            <dt className="ah-label">Giờ làm việc</dt>
            <dd className="mt-1">{site.workingHours}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="ah-label">Địa chỉ</dt>
            <dd className="mt-1">{site.address}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted">
          Sửa các giá trị này trong <code>src/lib/site.ts</code>.
        </p>
      </section>

      <section className="max-w-xl space-y-3 border border-border bg-surface p-5">
        <h2 className="font-serif text-lg">Tải ảnh sản phẩm</h2>
        <div className="flex items-center gap-3">
          <Badge variant={uploadEnabled ? "success" : "warning"}>
            {uploadEnabled ? "Đã cấu hình" : "Chưa cấu hình"}
          </Badge>
          <span className="text-sm text-muted">Cloudinary</span>
        </div>
        <p className="text-xs text-muted">
          {uploadEnabled
            ? "Admin có thể tải ảnh trực tiếp từ form sản phẩm."
            : "Khai báo CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET trong .env để bật upload. Khi chưa cấu hình, hãy dán URL ảnh thủ công."}
        </p>
      </section>
    </div>
  );
}
