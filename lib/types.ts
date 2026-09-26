export type Degree = "D3" | "D4" | "S1" | "S2" | "S3";
export type Profile = {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatar: string;
  province: string;
  campus: string;
  faculty: string;
  major: string;
  degree: Degree;
  nim: string;
  semester: number;
  academicYear: string;
  graduationYear: string;
  bio: string;
  onboarded: boolean;
};
export type Course = {
  id: string;
  name: string;
  code: string;
  sks: number;
  lecturer: string;
  semester: number;
  notes: string;
};
export type Schedule = {
  id: string;
  courseId: string;
  day: number;
  startTime: string;
  endTime: string;
  room: string;
  className: string;
  notes: string;
};
export type Attachment = { name: string; type: string; data: string };
export type Assignment = {
  id: string;
  title: string;
  description: string;
  courseId: string;
  deadline: string;
  priority: "Rendah" | "Sedang" | "Tinggi";
  type: string;
  group: boolean;
  status: "open" | "completed" | "archived";
  notes: string;
  attachment?: Attachment;
  completedAt?: string;
  xpAwarded?: boolean;
};
export type ProjectTask = {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  priority: "Rendah" | "Sedang" | "Tinggi";
  done: boolean;
};
export type Project = {
  id: string;
  name: string;
  courseId: string;
  description: string;
  deadline: string;
  status: "Planning" | "In Progress" | "Review" | "Completed";
  kind: string;
  members: string[];
  tasks: ProjectTask[];
  notes: string;
  attachment?: Attachment;
  xpAwarded?: boolean;
};
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Ujian" | "Presentasi" | "Personal" | "Lainnya";
  description: string;
};
export type KRSRecord = {
  id: string;
  semester: number;
  academicYear: string;
  courseId: string;
};
export type KHSRecord = {
  id: string;
  semester: number;
  academicYear: string;
  code: string;
  name: string;
  sks: number;
  grade: string;
  gradePoint: number;
};
export type PetSpecies =
  | "Cat"
  | "Dog"
  | "Bunny"
  | "Panda"
  | "Fox"
  | "Bear"
  | "Penguin"
  | "Dino"
  | "Hamster";
export type Pet = {
  species: PetSpecies;
  name: string;
  xp: number;
  accessories: string[];
  equipped: string;
};
export type Notice = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: string;
};
export type Settings = {
  theme: "light" | "dark" | "system";
  notifications: { deadlines: boolean; classes: boolean; projects: boolean };
  hiddenWidgets: string[];
};
export type UserData = {
  profile: Profile;
  courses: Course[];
  schedule: Schedule[];
  assignments: Assignment[];
  projects: Project[];
  calendarEvents: CalendarEvent[];
  krs: KRSRecord[];
  khs: KHSRecord[];
  completedSemesters: string[];
  pet: Pet | null;
  notifications: Notice[];
  achievements: string[];
  weeklyGoals: string[];
  settings: Settings;
};
export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const emptyData = (profile: Profile): UserData => ({
  profile,
  courses: [],
  schedule: [],
  assignments: [],
  projects: [],
  calendarEvents: [],
  krs: [],
  khs: [],
  completedSemesters: [],
  pet: null,
  notifications: [],
  achievements: [],
  weeklyGoals: [],
  settings: {
    theme: "dark",
    notifications: { deadlines: true, classes: true, projects: true },
    hiddenWidgets: [],
  },
});
export const petEmoji: Record<PetSpecies, string> = {
  Cat: "🐱",
  Dog: "🐶",
  Bunny: "🐰",
  Panda: "🐼",
  Fox: "🦊",
  Bear: "🐻",
  Penguin: "🐧",
  Dino: "🦕",
  Hamster: "🐹",
};
export const days = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
export const gradeMap: Record<string, number> = {
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  D: 1,
  E: 0,
};
export const achievements = [
  {
    id: "first-step",
    name: "First Step",
    description: "Buat tugas pertamamu",
    icon: "✦",
  },
  {
    id: "organized",
    name: "Organized",
    description: "Selesaikan 10 tugas",
    icon: "✓",
  },
  {
    id: "academic-starter",
    name: "Academic Starter",
    description: "Simpan KHS pertamamu",
    icon: "◈",
  },
  {
    id: "schedule-master",
    name: "Schedule Master",
    description: "Buat jadwal pertamamu",
    icon: "▦",
  },
  {
    id: "team-player",
    name: "Team Player",
    description: "Buat project pertamamu",
    icon: "♧",
  },
  {
    id: "deadline-survivor",
    name: "Deadline Survivor",
    description: "Selesaikan 5 tugas mendesak",
    icon: "⚡",
  },
  {
    id: "semester-complete",
    name: "Semester Complete",
    description: "Catat satu semester di KHS",
    icon: "★",
  },
];
