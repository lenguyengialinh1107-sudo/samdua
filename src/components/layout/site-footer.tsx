import Link from "next/link";

import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <p className="font-serif text-xl">Second Shot</p>
          <p className="max-w-xs text-sm text-muted">{site.description}</p>
          <address className="not-italic text-sm text-muted">
            <span className="block">{site.address}</span>
            <span className="block">Hotline: {site.hotline}</span>
            <span className="block">{site.email}</span>
            <span className="block">{site.workingHours}</span>
          </address>
        </div>

        {footerNav.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="ah-label">{group.title}</p>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Dữ liệu sản phẩm trên site là dữ liệu demo.
          </p>
          <p className="flex gap-4">
            <a href={site.social.facebook} className="hover:text-accent" rel="noreferrer noopener" target="_blank">
              Facebook
            </a>
            <a href={site.social.instagram} className="hover:text-accent" rel="noreferrer noopener" target="_blank">
              Instagram
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
