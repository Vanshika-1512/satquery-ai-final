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
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { Wordmark } from "../components/ui/primitives";
import { Starfield } from "../components/space/Starfield";

/* ── Navigation items ───────────────────────────────────── */
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
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* ── Background Starfield ─────────────────────────── */}
      <Starfield density={80} className="opacity-25 fixed inset-0 pointer-events-none z-0" />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 55% at 50% -5%, rgba(14,165,233,0.14) 0%, rgba(3,7,18,0.5) 55%, rgba(2,5,14,0.98) 100%)",
        }}
      />

      {/* ══ TOP NAVIGATION BAR ══════════════════════════════ */}
      <header className="shrink-0 sticky top-0 z-50 w-full border-b border-cyan-500/15 bg-slate-950/85 backdrop-blur-2xl">
        {/* Main navbar row */}
        <div className="flex items-center h-14 px-4 md:px-6 gap-4">

          {/* ── LEFT: Logo ──────────────────────────────── */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 shrink-0 group mr-2"
          >
            <Wordmark size={22} />
            <div className="hidden sm:block">
              <div
                className="font-bold text-[14px] tracking-tight text-white group-hover:text-cyan-300 transition-colors leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                SatQuery <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[8px] uppercase tracking-widest font-mono text-cyan-400/70 leading-none">
                Remote Sensing
              </div>
            </div>
            <ArrowUpRight size={12} className="text-slate-600 group-hover:text-cyan-400 transition-colors hidden sm:block" />
          </button>

          {/* ── CENTER: Nav links (desktop) ──────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.12)] font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon size={13} />
                <span>{label}</span>
                {badge && (
                  <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 leading-none">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Spacer for md screens ──────────────────── */}
          <div className="hidden md:flex lg:hidden flex-1" />

          {/* ── RIGHT: Mobile Hamburger ─────────────────── */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors ml-1"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown nav ──────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-cyan-500/15 bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-1">
            {NAV.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ══ MAIN CONTENT ════════════════════════════════════ */}
      <main className="flex-1 min-h-0 relative z-10 overflow-y-auto">
        <Outlet />
      </main>

      {/* ── Footer telemetry bar ─────────────────────────── */}
      <footer className="shrink-0 border-t border-cyan-500/10 bg-slate-950/60 backdrop-blur-sm px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-600 z-10 relative">
        <div className="flex items-center gap-3">
          <Activity size={10} className="text-cyan-500/60" />
          <span>SatQuery AI · v0.1.0</span>
          <span className="text-slate-700">·</span>
          <span>Mission Control</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
          <span className="text-emerald-500/70">Backend Online</span>
        </div>
      </footer>
    </div>
  );
}
