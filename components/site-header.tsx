"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteName } from "@/lib/site";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "pulseatlas-sidebar-collapsed";

const navItems = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/countries", label: "Countries", icon: GlobeIcon },
  { href: "/updates", label: "Updates", icon: NotesIcon },
  { href: "/methodology", label: "Methodology", icon: TuneIcon },
  { href: "/about", label: "About", icon: HelpIcon }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const asideRef = useRef<HTMLElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "1") {
      setCollapsed(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!asideRef.current) {
      return;
    }

    const brand = brandRef.current;
    const labels = labelRefs.current.filter(Boolean);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.to(asideRef.current, {
        width: collapsed ? 96 : 216,
        duration: 0.32,
        ease: "power2.out"
      });

      if (brand) {
        gsap.to(brand, {
          autoAlpha: collapsed ? 0 : 1,
          height: collapsed ? 0 : "auto",
          y: collapsed ? -8 : 0,
          duration: 0.24,
          ease: "power2.out"
        });
      }

      if (labels.length > 0) {
        gsap.to(labels, {
          autoAlpha: collapsed ? 0 : 1,
          x: collapsed ? -6 : 0,
          height: collapsed ? 0 : "auto",
          duration: 0.22,
          stagger: collapsed ? 0 : 0.02,
          ease: "power2.out"
        });
      }
    });

    return () => mm.revert();
  }, [collapsed]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
  }

  return (
    <aside
      ref={asideRef}
      className="border-b border-[var(--border)] bg-transparent lg:min-h-screen lg:border-b-0 lg:border-r lg:px-3 lg:py-4"
    >
      <div
        className={cn(
          "soft-panel soft-shadow mx-auto flex items-center justify-between rounded-[24px] p-3 lg:sticky lg:top-4 lg:min-h-[calc(100vh-32px)] lg:flex-col lg:justify-start",
          collapsed ? "lg:gap-4" : "lg:gap-5"
        )}
      >
        <div className={cn("flex items-center gap-3 lg:w-full", collapsed ? "lg:justify-center" : "lg:flex-col lg:gap-2")}>
          <Link
            href="/"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-sm)]"
            aria-label={`${siteName} home`}
          >
            <PulseIcon className="h-6 w-6" />
          </Link>
          <div
            ref={brandRef}
            className={cn("overflow-hidden text-center", collapsed ? "hidden lg:block" : "hidden lg:block")}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--foreground)]">{siteName}</div>
            <div className="mt-1 text-[10px] text-[var(--text-tertiary)]">Live reporting</div>
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          className={cn("flex items-center gap-2 lg:flex-1 lg:flex-col lg:pt-2", collapsed ? "lg:gap-3" : "lg:gap-2.5")}
        >
          {navItems.map((item, index) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex shrink-0 items-center justify-center rounded-[18px] text-[var(--text-secondary)] lg:mx-auto",
                  collapsed ? "h-12 w-12 lg:h-12 lg:w-12" : "h-11 w-11 lg:h-auto lg:w-full lg:flex-col lg:gap-1.5 lg:px-3 lg:py-3.5",
                  active
                    ? "bg-[var(--primary)] text-white shadow-[0_16px_32px_rgba(255,90,95,0.28)]"
                    : "hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span
                  ref={(node) => {
                    labelRefs.current[index] = node;
                  }}
                  className={cn(
                    "overflow-hidden text-[10px] font-semibold",
                    collapsed ? "hidden lg:block" : "hidden lg:block",
                    active ? "text-white" : "text-[var(--text-secondary)]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={cn("flex items-center gap-2 lg:w-full", collapsed ? "lg:flex-col lg:items-center lg:gap-2" : "lg:flex-col lg:items-stretch lg:gap-2 lg:pb-1")}>
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "soft-panel flex h-11 items-center justify-center rounded-[16px] text-[var(--text-tertiary)] hover:text-[var(--foreground)]",
              collapsed ? "w-11" : "w-11 lg:w-full lg:gap-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={!collapsed}
          >
            <ChevronIcon className={cn("h-4.5 w-4.5", collapsed ? "" : "rotate-180")} />
            {!collapsed ? <span className="hidden text-xs font-semibold lg:block">Collapse</span> : null}
          </button>
          <div className={cn("flex items-center gap-2", collapsed ? "lg:flex-col" : "lg:flex-col lg:items-stretch")}>
            <ThemeToggle />
            <Link
              href="/about"
              className="soft-panel flex h-11 w-11 items-center justify-center rounded-[16px] text-[var(--text-tertiary)] hover:text-[var(--foreground)]"
              aria-label="Open about page"
            >
              <InfoIcon className="h-4.5 w-4.5" />
            </Link>
          </div>
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

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 12h4l2.2-4.5 3.2 9 2.2-5H21" />
      <circle cx="12" cy="12" r="8.5" />
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

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.2v5.6M12 7.3h.01" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="m14.5 6.5-5 5 5 5" />
    </svg>
  );
}
