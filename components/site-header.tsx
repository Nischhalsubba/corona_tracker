"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/countries", label: "Countries", icon: GlobeIcon },
  { href: "/updates", label: "Updates", icon: NotesIcon },
  { href: "/methodology", label: "Methodology", icon: TuneIcon },
  { href: "/about", label: "About", icon: HelpIcon }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[var(--border)] bg-transparent lg:min-h-screen lg:w-[94px] lg:border-b-0 lg:border-r lg:px-3 lg:py-4">
      <div className="soft-panel soft-shadow mx-auto flex items-center justify-between rounded-[24px] p-3 lg:sticky lg:top-4 lg:min-h-[calc(100vh-32px)] lg:flex-col lg:justify-start lg:gap-5">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-sm)]"
          aria-label="COVID-19 Tracker home"
        >
          <VirusIcon className="h-6 w-6" />
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-2 lg:flex-1 lg:flex-col lg:gap-2.5 lg:pt-2">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] text-[var(--text-secondary)] transition lg:h-auto lg:w-full lg:flex-col lg:gap-1.5 lg:px-2 lg:py-3.5",
                  active
                    ? "bg-[var(--primary)] text-white shadow-[0_16px_32px_rgba(255,90,95,0.28)]"
                    : "hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className={cn("hidden text-[10px] font-semibold lg:block", active ? "text-white" : "text-[var(--text-secondary)]")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex lg:h-11 lg:w-11 lg:items-center lg:justify-center lg:rounded-[16px] lg:bg-[var(--surface)] lg:text-[var(--text-tertiary)] lg:mb-1">
          <LogoutIcon className="h-4.5 w-4.5" />
        </div>
      </div>
    </aside>
  );
}

function iconProps(className?: string) {
  return {
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className
  };
}

function VirusIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M2.5 12h3M18.5 12h3M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2" />
      <circle cx="12" cy="7.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="7.2" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 9.5h16.4M3.8 14.5h16.4M12 3.5c2.5 2.3 3.9 5.2 3.9 8.5S14.5 18.2 12 20.5M12 3.5C9.5 5.8 8.1 8.7 8.1 12s1.4 6.2 3.9 8.5" />
    </svg>
  );
}

function NotesIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="5" y="3.5" width="14" height="17" rx="3" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5H13" />
    </svg>
  );
}

function TuneIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M6 4v16M18 4v16M12 4v16" />
      <circle cx="6" cy="9" r="2.5" />
      <circle cx="12" cy="15" r="2.5" />
      <circle cx="18" cy="8" r="2.5" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9a2.7 2.7 0 1 1 4.8 1.7c-.8 1-1.9 1.4-1.9 3" />
      <circle cx="12" cy="17.3" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M10 5H7.5A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19H10" />
      <path d="M14 8.5 18 12l-4 3.5M18 12H9" />
    </svg>
  );
}
