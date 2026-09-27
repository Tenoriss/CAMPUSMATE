import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { authRepository, dataRepository } from "../lib/store";
import { emptyData, uid, petEmoji } from "../lib/types";
import { academics, detectConflicts, deadlineStatus } from "../lib/logic";
import { documentUploadService } from "../lib/documents";
import {
  applyTheme,
  isThemePref,
  nextThemePref,
  readThemePref,
  resolveTheme,
  themeBootScript,
  writeThemePref,
  THEME_STORAGE_KEY,
} from "../lib/theme";
class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  key(n: number) {
    return [...this.values.keys()][n] ?? null;
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  setItem(k: string, v: string) {
    this.values.set(k, String(v));
  }
}
Object.assign(globalThis, {
  localStorage: new MemoryStorage(),
  sessionStorage: new MemoryStorage(),
});
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
test("new accounts are truly empty and isolated; logout restores personal data", async () => {
  const first = await authRepository.signup(
    "Aten",
    "Aten",
    "aten@example.com",
    "longpassword1",
  );
  const d1 = dataRepository.load(first)!;
  assert.equal(d1.profile.name, "Aten");
  assert.deepEqual(
    [
      d1.courses,
      d1.schedule,
      d1.assignments,
      d1.projects,
      d1.krs,
      d1.khs,
      d1.completedSemesters,
      d1.calendarEvents,
      d1.notifications,
      d1.achievements,
      d1.weeklyGoals,
    ],
    [[], [], [], [], [], [], [], [], [], [], []],
  );
  assert.equal(d1.pet, null);
  assert.equal(academics(d1).ipk, null);
  d1.courses.push({
    id: "course1",
    name: "Pemrograman",
    code: "IF101",
    sks: 3,
    lecturer: "",
    semester: 1,
    notes: "",
  });
  dataRepository.save(first, d1);
  authRepository.logout();
  const second = await authRepository.signup(
    "Budi",
    "Bud",
    "budi@example.com",
    "longpassword2",
  );
  assert.equal(dataRepository.load(second)!.courses.length, 0);
  authRepository.logout();
  assert.equal(
    await authRepository.login("ATEN@example.com", "longpassword1", true),
    first,
  );
  assert.equal(dataRepository.load(first)!.courses.length, 1);
  assert.notEqual(
    localStorage.getItem("campusmate_accounts_v1")?.includes("longpassword1"),
    true,
  );
});
test("IPS/IPK use actual weighted records only", () => {
  const d = emptyData({
    id: "u",
    name: "U",
    nickname: "U",
    email: "u@test.com",
    avatar: "",
    province: "",
    campus: "",
    faculty: "",
    major: "",
    degree: "S1",
    nim: "",
    semester: 1,
    academicYear: "",
    graduationYear: "",
    bio: "",
    onboarded: true,
  });
  assert.equal(academics(d).ipk, null);
  d.khs = [
    {
      id: "a",
      semester: 1,
      academicYear: "2026/2027",
      code: "IF1",
      name: "One",
      sks: 3,
      grade: "A",
      gradePoint: 4,
    },
    {
      id: "b",
      semester: 1,
      academicYear: "2026/2027",
      code: "IF2",
      name: "Two",
      sks: 2,
      grade: "B",
      gradePoint: 3,
    },
  ];
  assert.equal(academics(d).history[0].ips, 3.6);
  assert.equal(academics(d).ipk, 3.6);
  assert.equal(academics(d).totalSks, 5);
});
test("KRS and KHS parsers do not fabricate records", () => {
  assert.deepEqual(documentUploadService.parseKRS("random header"), []);
  assert.deepEqual(documentUploadService.parseKHS("random header"), []);
  const krs = documentUploadService.parseKRS(
    "IF301 Pemrograman Web 3 SKS Selasa 08:00-10:30",
  );
  assert.equal(krs.length, 1);
  assert.equal(krs[0].name, "Pemrograman Web");
  assert.equal(krs[0].day, 2);
  const khs = documentUploadService.parseKHS("IF301 Pemrograman Web 3 A");
  assert.equal(khs.length, 1);
  assert.equal(khs[0].gradePoint, 4);
});
test("schedule conflicts only flag overlapping classes on the same day", () => {
  assert.deepEqual(
    detectConflicts([
      { day: 1, startTime: "08:00", endTime: "10:00", name: "A" },
      { day: 1, startTime: "09:00", endTime: "11:00", name: "B" },
    ]),
    ["A · B"],
  );
  assert.deepEqual(
    detectConflicts([
      { day: 1, startTime: "08:00", endTime: "10:00", name: "A" },
      { day: 2, startTime: "09:00", endTime: "11:00", name: "B" },
    ]),
    [],
  );
});

test("all nine companions have small local animated GIFs and reduced-motion stills", () => {
  for (const species of Object.keys(petEmoji)) {
    const path = `public/pets/${species.toLowerCase()}`;
    assert.equal(
      readFileSync(`${path}.gif`).subarray(0, 6).toString(),
      "GIF89a",
    );
    assert.equal(readFileSync(`${path}.png`).subarray(1, 4).toString(), "PNG");
    assert.ok(statSync(`${path}.gif`).size < 150_000);
  }
});

test("theme preference resolves, persists and cycles light → dark → system", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
  assert.equal(nextThemePref("light"), "dark");
  assert.equal(nextThemePref("dark"), "system");
  assert.equal(nextThemePref("system"), "light");
  // Nothing stored yet: fall back to the OS preference.
  assert.equal(readThemePref(), "system");
  writeThemePref("dark");
  assert.equal(readThemePref(), "dark");
  assert.equal(localStorage.getItem(THEME_STORAGE_KEY), "dark");
  // A corrupted value must not lock the UI in the wrong theme.
  localStorage.setItem(THEME_STORAGE_KEY, "neon");
  assert.equal(readThemePref(), "system");
  assert.equal(isThemePref("system"), true);
  assert.equal(isThemePref("neon"), false);
  localStorage.removeItem(THEME_STORAGE_KEY);
});

test("applying a theme paints <html> and reports the resolved value", () => {
  const root = { dataset: {} as Record<string, string> };
  assert.equal(
    applyTheme("dark", { root, systemPrefersDark: false }),
    "dark",
  );
  assert.equal(root.dataset.theme, "dark");
  assert.equal(applyTheme("system", { root, systemPrefersDark: true }), "dark");
  assert.equal(root.dataset.theme, "dark");
  assert.equal(
    applyTheme("system", { root, systemPrefersDark: false }),
    "light",
  );
  assert.equal(root.dataset.theme, "light");
  // Without an explicit system value it must not throw outside a browser.
  assert.equal(applyTheme("light", { root }), "light");
});

test("the pre-paint theme script is wired into the root layout", () => {
  assert.ok(themeBootScript.includes(THEME_STORAGE_KEY));
  assert.ok(themeBootScript.includes("dataset.theme"));
  assert.ok(themeBootScript.includes("prefers-color-scheme: dark"));
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.ok(layout.includes("themeBootScript"));
  assert.ok(layout.includes("./clay.css"));
});

test("clay surfaces ship light and dark token sets", () => {
  const clay = readFileSync("app/clay.css", "utf8");
  const darkBlock = clay.slice(clay.indexOf(':root[data-theme="dark"]'));
  for (const token of [
    "--clay-lift",
    "--clay-inset",
    "--tint-violet-bg",
    "--tint-danger-ink",
    "--sidebar",
  ]) {
    assert.ok(clay.includes(token), `light theme is missing ${token}`);
    assert.ok(darkBlock.includes(token), `dark theme is missing ${token}`);
  }
});

test("every companion GIF is genuinely animated, not a still frame", () => {
  for (const species of Object.keys(petEmoji)) {
    const bytes = readFileSync(`public/pets/${species.toLowerCase()}.gif`);
    let frames = 0;
    let i = 13;
    if (bytes[10] & 0x80) i += 3 * (2 << (bytes[10] & 0x07));
    while (i < bytes.length) {
      const marker = bytes[i];
      if (marker === 0x3b) break;
      if (marker === 0x21) {
        i += 2;
        for (;;) {
          const size = bytes[i++];
          if (size === 0) break;
          i += size;
        }
      } else if (marker === 0x2c) {
        frames += 1;
        const packed = bytes[i + 9];
        i += 10;
        if (packed & 0x80) i += 3 * (2 << (packed & 0x07));
        i += 1;
        for (;;) {
          const size = bytes[i++];
          if (size === 0) break;
          i += size;
        }
      } else {
        throw new Error(`${species}: unreadable GIF block at ${i}`);
      }
    }
    assert.ok(
      frames >= 8,
      `${species} should animate, found ${frames} frame(s)`,
    );
  }
});
