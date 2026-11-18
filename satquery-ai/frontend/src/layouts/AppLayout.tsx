import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  GitCompareArrows,
  History,
  Radar,
  Compass,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { Wordmark } from "../components/ui/primitives";

/* ── Navigation Items ───────────────────────────────────── */
const NAV = [
  { to: "/dashboard",        label: "Dashboard",        icon: LayoutDashboard },
  { to: "/analyze",          label: "Analyze",          icon: ScanSearch },
  { to: "/change-detection", label: "Change Detection", icon: GitCompareArrows },
  { to: "/optical-sar",      label: "Optical + SAR",    icon: Radar },
  { to: "/missions",         label: "Mission Mode",     icon: Compass,         badge: "AI" },
  { to: "/history",          label: "History",          icon: History },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0B1118] text-[#E5EAF0] font-sans selection:bg-[#48A9A6]/25 selection:text-[#E5EAF0]">
      {/* ══ TOP NAVIGATION BAR ══════════════════════════════ */}
      <header className="shrink-0 sticky top-0 z-50 w-full border-b border-[#273543] bg-[#101923]">
        <div className="flex items-center h-14 px-4 md:px-6 gap-6">

          {/* ── LEFT: Logo ──────────────────────────────── */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 shrink-0 text-left focus-ring rounded"
          >
            <Wordmark size={20} />
            <div>
              <div className="font-semibold text-[14px] tracking-tight text-[#E5EAF0] leading-none">
                SatQuery <span className="text-[#48A9A6]">AI</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider font-mono text-[#718096] leading-none mt-1">
                Earth Observation
              </div>
            </div>
          </button>

          {/* ── CENTER: Nav Links (Desktop) ──────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded text-[13px] font-medium transition-colors whitespace-nowrap focus-ring ${
                    isActive
                      ? "bg-[#192633] text-[#48A9A6] border border-[#273543]"
                      : "text-[#9AA8B7] hover:text-[#E5EAF0] hover:bg-[#141F2A]"
                  }`
                }
              >
                <Icon size={14} className="shrink-0" />
                <span>{label}</span>
                {badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#141F2A] text-[#648DB5] border border-[#273543] leading-none">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Spacer for Tablet ─────────────────────────── */}
          <div className="hidden md:flex lg:hidden flex-1" />

          {/* ── RIGHT: Mobile Hamburger ──────────────────── */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded border border-[#273543] text-[#9AA8B7] hover:text-[#E5EAF0] hover:bg-[#141F2A] transition-colors focus-ring"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Nav ──────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#273543] bg-[#101923] px-4 py-3 space-y-1">
            {NAV.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#192633] text-[#48A9A6] border border-[#273543]"
                      : "text-[#9AA8B7] hover:text-[#E5EAF0] hover:bg-[#141F2A]"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141F2A] text-[#648DB5] border border-[#273543]">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ══ MAIN CONTENT ════════════════════════════════════ */}
      <main className="flex-1 min-h-0 relative z-10 overflow-y-auto bg-[#0B1118]">
        <Outlet />
      </main>

      {/* ── Footer Telemetry Bar ─────────────────────────── */}
      <footer className="shrink-0 border-t border-[#273543] bg-[#101923] px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-[#718096] z-10 relative">
        <div className="flex items-center gap-2.5">
          <Activity size={12} className="text-[#48A9A6]" />
          <span className="text-[#9AA8B7]">SatQuery AI</span>
          <span className="text-[#273543]">·</span>
          <span>Earth Observation Intelligence Platform</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6BA88B]" />
          <span className="text-[#9AA8B7]">Inference Service Active</span>
        </div>
      </footer>
    </div>
  );
}
