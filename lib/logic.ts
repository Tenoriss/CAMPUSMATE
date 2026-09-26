import { UserData, Assignment, gradeMap } from "./types";
export const localDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dateLabel = (s: string) =>
  s
    ? new Date(s.length === 10 ? s + "T12:00:00" : s).toLocaleDateString(
        "id-ID",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : "—";
export const timeLeft = (s: string) => {
  if (!s) return "Tanpa deadline";
  const diff = new Date(s).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (diff < 0)
    return `Terlambat ${Math.max(1, Math.ceil(-diff / 86400000))} hari`;
  if (diff < 86400000) return "Hari ini";
  if (days === 1) return "Besok";
  return `${days} hari lagi`;
};
export const deadlineStatus = (a: Assignment) => {
  if (a.status === "completed") return "Completed";
  if (a.status === "archived") return "Archived";
  const h = (new Date(a.deadline).getTime() - Date.now()) / 3600000;
  return h < 0 ? "Overdue" : h < 24 ? "Urgent" : h <= 72 ? "Soon" : "Safe";
};
export const academics = (d: UserData) => {
  const groups: Record<string, typeof d.khs> = {};
  for (const r of d.khs) {
    const k = `${r.semester}|${r.academicYear}`;
    (groups[k] ??= []).push(r);
  }
  const history = Object.entries(groups)
    .map(([key, records]) => {
      const sks = records.reduce((n, r) => n + r.sks, 0);
      const points = records.reduce((n, r) => n + r.sks * r.gradePoint, 0);
      return {
        key,
        semester: records[0].semester,
        year: records[0].academicYear,
        sks,
        ips: sks ? points / sks : 0,
        points,
        records,
      };
    })
    .sort((a, b) => a.semester - b.semester || a.year.localeCompare(b.year));
  const totalSks = history.reduce((n, h) => n + h.sks, 0);
  const totalPoints = history.reduce((n, h) => n + h.points, 0);
  const current =
    history.find((h) => h.semester === d.profile.semester) || history.at(-1);
  return {
    history,
    totalSks,
    ipk: totalSks ? totalPoints / totalSks : null,
    current,
    semesterSks: d.courses
      .filter((c) => c.semester === d.profile.semester)
      .reduce((n, c) => n + c.sks, 0),
  };
};
export const formatGpa = (n: number | null | undefined) =>
  n == null ? "—" : n.toFixed(2);
export const levelForXp = (xp: number) => Math.floor(xp / 100) + 1;
export const gradePoint = (grade: string) => gradeMap[grade.toUpperCase()] ?? 0;
export const detectConflicts = (
  rows: { day: number; startTime: string; endTime: string; name: string }[],
) => {
  const conflicts: string[] = [];
  rows.forEach((a, i) =>
    rows.slice(i + 1).forEach((b) => {
      if (a.day === b.day && a.startTime < b.endTime && b.startTime < a.endTime)
        conflicts.push(`${a.name} · ${b.name}`);
    }),
  );
  return conflicts;
};
