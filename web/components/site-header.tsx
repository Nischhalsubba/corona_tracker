"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteName } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { CountrySnapshot } from "@/lib/types";

const SIDEBAR_STORAGE_KEY = "pulseatlas-sidebar-collapsed";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/countries", label: "Countries", icon: GlobeIcon },
  { href: "/updates", label: "Updates", icon: NotesIcon }
];

const appItems = [
  { href: "/methodology", label: "Methodology", icon: TuneIcon },
  { href: "/about", label: "About", icon: HelpIcon }
];

type SidebarSearchResult = {
  id: string;
  label: string;
  href: string;
  type: string;
  meta?: string;
};

export function SiteHeader() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<CountrySnapshot[]>([]);
  const asideRef = useRef<HTMLElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "1") {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch("/api/covid/countries")
      .then((response) => response.json())
      .then((data: CountrySnapshot[]) => {
        if (mounted) {
          setCountries(Array.isArray(data) ? data.slice(0, 200) : []);
        }
      })
      .catch(() => {
        if (mounted) {
          setCountries([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const searchResults = (() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    const routeResults: SidebarSearchResult[] = [
      ...navigationItems.map((item) => ({ id: item.href, label: item.label, href: item.href, type: "Page" })),
      ...appItems.map((item) => ({ id: item.href, label: item.label, href: item.href, type: "Page" })),
      { id: "/#global", label: "Global dashboard overview", href: "/", type: "Dashboard" },
      { id: "/methodology#sources", label: "Sources and datasets", href: "/methodology", type: "Sources" },
      { id: "/updates#live", label: "Live reporting notes", href: "/updates", type: "Updates" }
    ].filter((item) => item.label.toLowerCase().includes(normalized));

    const countryResults: SidebarSearchResult[] = countries
      .filter((country) => {
        const searchBase = [country.name, country.continent, country.iso2, country.iso3].filter(Boolean).join(" ").toLowerCase();
        return searchBase.includes(normalized);
      })
      .slice(0, 6)
      .map((country) => ({
        id: country.slug,
        label: country.name,
        href: `/countries/${country.slug}`,
        type: "Country",
        meta: country.continent ?? "Country detail"
      }));

    return [...routeResults, ...countryResults].slice(0, 8);
  })();

  useLayoutEffect(() => {
    if (!asideRef.current) {
      return;
    }

    const brand = brandRef.current;
    const search = searchRef.current;
    const labels = labelRefs.current.filter(Boolean);
    const sections = sectionRefs.current.filter(Boolean);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.to(asideRef.current, {
        width: collapsed ? 92 : 244,
        duration: 0.34,
        ease: "power2.out"
      });

      const shared = {
        autoAlpha: collapsed ? 0 : 1,
        height: collapsed ? 0 : "auto",
        y: collapsed ? -8 : 0,
        duration: 0.24,
        ease: "power2.out"
      };

      if (brand) gsap.to(brand, shared);
      if (search) gsap.to(search, shared);
      if (sections.length > 0) gsap.to(sections, { ...shared, stagger: collapsed ? 0 : 0.03 });
      if (labels.length > 0) {
        gsap.to(labels, {
          autoAlpha: collapsed ? 0 : 1,
          x: collapsed ? -6 : 0,
          height: collapsed ? 0 : "auto",
          duration: 0.2,
          stagger: collapsed ? 0 : 0.015,
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
      <div className="soft-panel soft-shadow mx-auto flex items-center justify-between rounded-[24px] p-3 lg:sticky lg:top-4 lg:min-h-[calc(100vh-32px)] lg:flex-col lg:justify-start lg:gap-4">
        <div className={cn("flex w-full items-center", collapsed ? "justify-center" : "justify-between")}>
          <Link
            href="/"
            className={cn(
              "flex shrink-0 items-center justify-center rounded-[16px] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-sm)]",
              collapsed ? "h-12 w-12" : "h-12 w-12"
            )}
            aria-label={`${siteName} home`}
          >
            <PulseIcon className="h-6 w-6" />
          </Link>

          <div ref={brandRef} className={cn("hidden min-w-0 flex-1 overflow-hidden lg:block", collapsed ? "" : "ml-3")}>
            <div className="truncate text-[18px] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{siteName}</div>
            <div className="mt-1 text-xs text-[var(--text-tertiary)]">Live reporting</div>
          </div>

          {!collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="soft-panel hidden h-10 w-10 items-center justify-center rounded-[14px] text-[var(--text-tertiary)] lg:flex"
              aria-label="Collapse sidebar"
            >
              <PanelIcon className="h-4.5 w-4.5" />
            </button>
          ) : null}
        </div>

        {collapsed ? (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="soft-panel hidden h-10 w-10 items-center justify-center rounded-[14px] text-[var(--text-tertiary)] lg:flex"
            aria-label="Expand sidebar"
          >
            <PanelIcon className="h-4.5 w-4.5" />
          </button>
        ) : null}

        <div ref={searchRef} className="hidden w-full overflow-hidden lg:block">
          <div className="relative">
            <label className="soft-panel flex items-center gap-3 rounded-[14px] px-3 py-3">
              <SearchIcon className="h-4.5 w-4.5 text-[var(--text-tertiary)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, countries, sources"
                aria-label="Global app search"
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
              />
            </label>
            {searchResults.length > 0 ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-md)]">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={() => setQuery("")}
                    className="flex items-center justify-between rounded-[12px] px-3 py-2 hover:bg-[var(--surface-soft)]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--foreground)]">{result.label}</div>
                      <div className="truncate text-xs text-[var(--text-tertiary)]">{result.meta ?? result.type}</div>
                    </div>
                    <span className="ml-3 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--primary)]">
                      {result.type}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={cn("flex w-full items-center gap-2 lg:flex-col lg:items-center", collapsed ? "lg:gap-3" : "lg:gap-4")}>
          <SidebarSection
            title="Navigation"
            items={navigationItems}
            pathname={pathname}
            collapsed={collapsed}
            labelRefs={labelRefs}
            sectionIndex={0}
            sectionRefs={sectionRefs}
          />
          <SidebarSection
            title="App"
            items={appItems}
            pathname={pathname}
            collapsed={collapsed}
            labelRefs={labelRefs}
            sectionIndex={1}
            sectionRefs={sectionRefs}
            labelOffset={navigationItems.length}
          />
        </div>

        <div className={cn("mt-auto flex w-full items-center gap-2", collapsed ? "justify-center lg:flex-col" : "justify-between")}>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  items,
  pathname,
  collapsed,
  labelRefs,
  sectionRefs,
  sectionIndex,
  labelOffset = 0
}: {
  title: string;
  items: typeof navigationItems;
  pathname: string;
  collapsed: boolean;
  labelRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  sectionIndex: number;
  labelOffset?: number;
}) {
  return (
    <div className={cn("w-full", collapsed ? "lg:flex lg:w-full lg:flex-col lg:items-center" : "")}>
      <div
        ref={(node) => {
          sectionRefs.current[sectionIndex] = node;
        }}
        className="mb-2 hidden overflow-hidden px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)] lg:block"
      >
        {title}
      </div>

      <div className={cn("flex items-center gap-2 lg:flex-col lg:items-center", collapsed ? "lg:gap-3.5" : "lg:gap-2")}>
        {items.map((item, index) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex shrink-0 items-center rounded-[16px]",
                collapsed
                  ? "h-11 w-11 justify-center border border-transparent"
                  : "h-12 w-full justify-start gap-3 px-4",
                active
                  ? collapsed
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--border)]"
                    : "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Icon className="h-4.5 w-4.5 shrink-0" />
              </span>
              <span
                ref={(node) => {
                  labelRefs.current[labelOffset + index] = node;
                }}
                className="hidden overflow-hidden text-sm font-medium lg:block"
              >
                {item.label}
              </span>
              {collapsed && active ? (
                <span className="absolute left-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-[10px] bg-[#7f56d9] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(127,86,217,0.25)] lg:block">
                  {item.label}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
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

function PanelIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M10 5v14" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="11" cy="11" r="6" />
      <path d="m19 19-3.2-3.2" />
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
