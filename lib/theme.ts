/**
 * Light/dark/system theme preference shared by the public pages and the
 * signed-in workspace. The preference is kept in localStorage so the landing,
 * login and signup screens can honour it too, and an inline boot script
 * (`themeBootScript`) applies it before the first paint so the canvas never
 * flashes the wrong theme.
 */
export type ThemePref = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export const THEME_STORAGE_KEY = "campusmate.theme";
export const themePrefs: ThemePref[] = ["light", "dark", "system"];
export const themeLabels: Record<ThemePref, string> = {
  light: "Terang",
  dark: "Gelap",
  system: "Ikuti sistem",
};
export const isThemePref = (value: unknown): value is ThemePref =>
  typeof value === "string" && (themePrefs as string[]).includes(value);
/** Resolve a preference against the OS setting. */
export const resolveTheme = (
  pref: ThemePref,
  systemPrefersDark: boolean,
): ResolvedTheme =>
  pref === "system" ? (systemPrefersDark ? "dark" : "light") : pref;
/** Cycle light → dark → system → light. */
export const nextThemePref = (pref: ThemePref): ThemePref =>
  pref === "light" ? "dark" : pref === "dark" ? "system" : "light";
const storageOf = (storage?: Storage | null): Storage | null => {
  if (storage) return storage;
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
};
/** Read the stored preference; unknown or missing values fall back to system. */
export const readThemePref = (storage?: Storage | null): ThemePref => {
  const store = storageOf(storage);
  if (!store) return "system";
  try {
    const raw = store.getItem(THEME_STORAGE_KEY);
    return isThemePref(raw) ? raw : "system";
  } catch {
    return "system";
  }
};
/** Persist the preference; storage failures must never break the UI. */
export const writeThemePref = (
  pref: ThemePref,
  storage?: Storage | null,
): ThemePref => {
  const store = storageOf(storage);
  if (!store) return pref;
  try {
    store.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* private mode or a full quota: the in-memory value still applies */
  }
  return pref;
};
export const systemPrefersDark = (
  matcher?: { matches: boolean } | null,
): boolean => {
  if (matcher) return matcher.matches;
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  } catch {
    return false;
  }
};
/** Paint the resolved theme on <html> and return it. */
export const applyTheme = (
  pref: ThemePref,
  opts: {
    systemPrefersDark?: boolean;
    root?: Pick<HTMLElement, "dataset"> | null;
  } = {},
): ResolvedTheme => {
  const resolved = resolveTheme(
    pref,
    opts.systemPrefersDark ?? systemPrefersDark(),
  );
  const root =
    opts.root ??
    (typeof document === "undefined" ? null : document.documentElement);
  if (root) root.dataset.theme = resolved;
  return resolved;
};
/**
 * Inline bootstrap evaluated before React hydrates. Deliberately dependency
 * free and defensive: it must never throw during the first paint.
 */
export const themeBootScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var p=(s==="light"||s==="dark"||s==="system")?s:"system";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;
