"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  CheckSquare,
  Users,
  GraduationCap,
  UserRound,
  Settings as SettingsIcon,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  BookOpen,
  FileUp,
  History,
  Trophy,
  Moon,
  Sun,
  Plus,
  ArrowRight,
  Command,
  PanelLeftClose,
  CalendarRange,
  Heart,
  SunMoon,
} from "lucide-react";
import { Provider, useApp } from "./Provider";
import { Button, Modal, PetDisplay } from "./UI";
import { universities } from "@/lib/directory";
import {
  Dashboard,
  SchedulePage,
  TasksPage,
  ProjectsPage,
  CalendarPage,
  AcademicPage,
  KRSPage,
  KHSPage,
  HistoryPage,
  ProfilePage,
  SettingsPage,
  NotificationsPage,
  AchievementsPage,
} from "./Screens";
import { AuthPage, OnboardingPage, LandingPage } from "./Welcome";
const nav = [
  { path: "/dashboard", label: "Beranda", icon: Home },
  { path: "/schedule", label: "Jadwal Kuliah", icon: CalendarDays },
  { path: "/tasks", label: "Tugas & Deadline", icon: CheckSquare },
  { path: "/projects", label: "Project", icon: Users },
  { path: "/calendar", label: "Kalender", icon: CalendarRange },
  { path: "/academic", label: "Akademik", icon: GraduationCap },
  { path: "/achievements", label: "Pencapaian", icon: Trophy },
  { path: "/profile", label: "Profil Saya", icon: UserRound },
  { path: "/settings", label: "Pengaturan", icon: SettingsIcon },
];
const mobile = nav.filter((x) =>
  ["/dashboard", "/schedule", "/tasks", "/academic", "/profile"].includes(
    x.path,
  ),
);
export default function Campusmate() {
  return (
    <Provider>
      <Inner />
    </Provider>
  );
}
function Inner() {
  const { data, ready, toast, logout, update } = useApp();
  const router = useRouter(),
    pathname = usePathname() || "/";
  const [menu, setMenu] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [query, setQuery] = useState(""),
    [academicOpen, setAcademicOpen] = useState(true);
  const go = (p: string) => {
    router.push(p);
    setMenu(false);
    setSearchOpen(false);
    setQuery("");
  };
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((x) => !x);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    if (!data) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const pref = data.settings.theme;
      document.documentElement.dataset.theme =
        pref === "dark" || (pref === "system" && media.matches)
          ? "dark"
          : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [data?.settings.theme, !!data]);
  useEffect(() => {
    if (!ready) return;
    if (data && !data.profile.onboarded && pathname !== "/onboarding")
      router.replace("/onboarding");
    else if (
      data &&
      data.profile.onboarded &&
      ["/", "/login", "/signup", "/onboarding"].includes(pathname)
    )
      router.replace("/dashboard");
    else if (!data && !["/", "/login", "/signup"].includes(pathname))
      router.replace("/login");
  }, [ready, data?.profile.onboarded, pathname, router, !!data]);
  if (!ready)
    return (
      <div className="loading-page">
        <div className="brand-symbol">✦</div>
        <span>Menyiapkan ruang kuliahmu...</span>
      </div>
    );
  if (!data)
    return pathname === "/signup" || pathname === "/login" ? (
      <AuthPage mode={pathname === "/signup" ? "signup" : "login"} go={go} />
    ) : (
      <LandingPage go={go} />
    );
  if (!data.profile.onboarded) return <OnboardingPage go={go} />;
  const pages: Record<string, React.ReactNode> = {
    "/dashboard": <Dashboard go={go} />,
    "/schedule": <SchedulePage go={go} />,
    "/tasks": <TasksPage go={go} />,
    "/projects": <ProjectsPage go={go} />,
    "/calendar": <CalendarPage go={go} />,
    "/academic": <AcademicPage go={go} />,
    "/academic/krs": <KRSPage go={go} />,
    "/academic/khs": <KHSPage go={go} />,
    "/academic/history": <HistoryPage go={go} />,
    "/profile": <ProfilePage go={go} />,
    "/settings": <SettingsPage go={go} />,
    "/notifications": <NotificationsPage go={go} />,
    "/achievements": <AchievementsPage go={go} />,
  };
  const results = query.trim()
    ? [
        ...data.courses
          .filter((x) =>
            (x.name + x.code).toLowerCase().includes(query.toLowerCase()),
          )
          .map((x) => ({
            label: x.name,
            detail: "Mata kuliah · " + x.code,
            path: "/schedule",
          })),
        ...data.assignments
          .filter((x) => x.title.toLowerCase().includes(query.toLowerCase()))
          .map((x) => ({ label: x.title, detail: "Tugas", path: "/tasks" })),
        ...data.projects
          .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
          .map((x) => ({
            label: x.name,
            detail: "Project",
            path: "/projects",
          })),
        ...data.calendarEvents
          .filter((x) => x.title.toLowerCase().includes(query.toLowerCase()))
          .map((x) => ({
            label: x.title,
            detail: "Kalender",
            path: "/calendar",
          })),
        ...data.schedule
          .filter((x) =>
            (x.room + x.className).toLowerCase().includes(query.toLowerCase()),
          )
          .map((x) => ({
            label:
              data.courses.find((c) => c.id === x.courseId)?.name || "Jadwal",
            detail: `Jadwal · ${x.room || x.className}`,
            path: "/schedule",
          })),
        ...universities
          .filter((x) =>
            (x.name + x.province).toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 4)
          .map((x) => ({
            label: x.name,
            detail: `Direktori kampus · ${x.province}`,
            path: "/profile",
          })),
        ...data.khs
          .filter((x) =>
            (x.name + x.code).toLowerCase().includes(query.toLowerCase()),
          )
          .map((x) => ({
            label: x.name,
            detail: "Nilai · " + x.code,
            path: "/academic/history",
          })),
        ...(data.profile.campus.toLowerCase().includes(query.toLowerCase()) &&
        data.profile.campus
          ? [{ label: data.profile.campus, detail: "Kampus", path: "/profile" }]
          : []),
        ...(data.profile.major.toLowerCase().includes(query.toLowerCase()) &&
        data.profile.major
          ? [
              {
                label: data.profile.major,
                detail: "Program studi",
                path: "/profile",
              },
            ]
          : []),
      ]
    : [];
  return (
    <div className="app-shell">
      {menu && (
        <div className="mobile-overlay" onClick={() => setMenu(false)} />
      )}
      <aside className={`sidebar ${menu ? "sidebar-open" : ""}`}>
        <button
          className="logo"
          onClick={() => go("/dashboard")}
          aria-label="CAMPUSMATE beranda"
        >
          <span className="logo-mark">✦</span>
          <span>
            CAMPUS<span className="logo-accent">MATE</span>
            <small>YOUR CAMPUS COMPANION</small>
          </span>
        </button>
        <div className="nav-caption">MENU UTAMA</div>
        <nav aria-label="Navigasi utama">
          {nav.slice(0, 6).map((item) => (
            <React.Fragment key={item.path}>
              <button
                onClick={() => go(item.path)}
                className={`nav-item ${pathname === item.path || (item.path === "/academic" && pathname.startsWith("/academic")) ? "active" : ""}`}
              >
                <item.icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
                {item.path === "/academic" && (
                  <ChevronDown
                    size={14}
                    className={academicOpen ? "rotate" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAcademicOpen(!academicOpen);
                    }}
                  />
                )}
              </button>
              {item.path === "/academic" && academicOpen && (
                <div className="subnav">
                  {[
                    ["/academic/krs", "Upload KRS"],
                    ["/academic/khs", "Upload KHS"],
                    ["/academic/history", "Riwayat Akademik"],
                  ].map(([p, l]) => (
                    <button
                      key={p}
                      onClick={() => go(p)}
                      className={pathname === p ? "selected" : ""}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
          <div className="nav-caption second">PERSONAL</div>
          {nav.slice(6).map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-pet">
            <span>
              <PetDisplay pet={data.pet} />
            </span>
            <div>
              <strong>{data.pet?.name || "Temanmu"} bilang...</strong>
              <small>Pelan-pelan, yang penting jalan! ✨</small>
            </div>
          </div>
          <button className="sidebar-account" onClick={() => go("/profile")}>
            <div className="avatar avatar-sm">
              {data.profile.avatar ? (
                <img src={data.profile.avatar} alt="" />
              ) : (
                data.profile.nickname.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <strong>{data.profile.nickname}</strong>
              <small>{data.profile.major || "Mahasiswa"}</small>
            </div>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn mobile-menu"
              onClick={() => setMenu(true)}
              aria-label="Buka menu"
            >
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="slash">/</span>
              <strong>
                {pathname === "/dashboard"
                  ? "Beranda"
                  : pathname
                      .split("/")
                      .filter(Boolean)
                      .map((x) =>
                        x.toUpperCase() === "KRS" || x.toUpperCase() === "KHS"
                          ? x.toUpperCase()
                          : x.charAt(0).toUpperCase() + x.slice(1),
                      )
                      .join(" / ")}
              </strong>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={17} />
              <span>Cari apa saja...</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="icon-btn theme-toggle"
              aria-label="Ganti tema"
              onClick={() =>
                update((d) => ({
                  ...d,
                  settings: {
                    ...d.settings,
                    theme:
                      document.documentElement.dataset.theme === "dark"
                        ? "light"
                        : "dark",
                  },
                }))
              }
            >
              {document.documentElement.dataset.theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <button
              className="icon-btn notification-btn"
              aria-label="Notifikasi"
              onClick={() => go("/notifications")}
            >
              <Bell size={20} />
              {data.notifications.some((n) => !n.read) && <i />}
            </button>
            <button
              className="top-avatar avatar"
              onClick={() => go("/profile")}
              aria-label="Buka profil"
            >
              {data.profile.avatar ? (
                <img src={data.profile.avatar} alt="" />
              ) : (
                data.profile.nickname.charAt(0).toUpperCase()
              )}
            </button>
          </div>
        </header>
        <div className="content">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
            >
              {pages[pathname] || <Dashboard go={go} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <nav className="bottom-nav" aria-label="Navigasi mobile">
        {mobile.map((item) => (
          <button
            key={item.path}
            className={pathname === item.path ? "active" : ""}
            onClick={() => go(item.path)}
          >
            <item.icon size={21} />
            <span>
              {item.path === "/dashboard"
                ? "Home"
                : item.path === "/schedule"
                  ? "Jadwal"
                  : item.path === "/tasks"
                    ? "Tugas"
                    : item.path === "/academic"
                      ? "Akademik"
                      : "Profil"}
            </span>
          </button>
        ))}
      </nav>
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Cari di CAMPUSMATE"
      >
        <div className="search-modal-input">
          <Search size={20} />
          <input
            autoFocus
            placeholder="Cari mata kuliah, tugas, project..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="search-results">
          {query.trim() ? (
            results.length ? (
              results.slice(0, 12).map((r, i) => (
                <button key={i} onClick={() => go(r.path)}>
                  <span className="result-icon">
                    <Search size={16} />
                  </span>
                  <span>
                    <strong>{r.label}</strong>
                    <small>{r.detail}</small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              ))
            ) : (
              <p>Tidak ada hasil untuk “{query}”.</p>
            )
          ) : (
            <p>Mulai ketik untuk menemukan data kuliahmu.</p>
          )}
        </div>
      </Modal>
      {toast && (
        <div className="toast" role="status">
          <span>✦</span>
          {toast}
          <button onClick={() => {}} aria-label="Notifikasi">
            {" "}
          </button>
        </div>
      )}
    </div>
  );
}
