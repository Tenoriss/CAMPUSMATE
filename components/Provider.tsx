"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  UserData,
  Profile,
  Pet,
  emptyData,
  uid,
  achievements,
  Assignment,
} from "@/lib/types";
import { authRepository, dataRepository } from "@/lib/store";
import { deadlineStatus } from "@/lib/logic";
type Context = {
  data: UserData | null;
  ready: boolean;
  userId: string | null;
  toast: string;
  notify: (s: string) => void;
  signup: (n: string, nick: string, e: string, p: string) => Promise<void>;
  login: (e: string, p: string, r: boolean) => Promise<void>;
  logout: () => void;
  update: (fn: (d: UserData) => UserData) => void;
  saveOnboarding: (profile: Partial<Profile>, pet: Pet) => void;
  reward: (xp: number, message: string) => void;
  reset: (type: string) => void;
};
const AppContext = createContext<Context>(null!);
export function Provider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData | null>(null),
    [userId, setUserId] = useState<string | null>(null),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState("");
  useEffect(() => {
    const id = authRepository.getSession();
    if (id) {
      const loaded = dataRepository.load(id);
      if (loaded) {
        setUserId(id);
        setData(loaded);
      } else authRepository.logout();
    }
    setReady(true);
  }, []);
  const notify = useCallback((s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 4500);
  }, []);
  const update = useCallback(
    (fn: (d: UserData) => UserData) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = fn(prev);
        try {
          dataRepository.save(prev.profile.id, next);
        } catch {
          setTimeout(
            () =>
              notify(
                "Penyimpanan penuh. Hapus lampiran atau data lama lalu coba lagi.",
              ),
            0,
          );
          return prev;
        }
        return next;
      });
    },
    [notify],
  );
  const signup = async (n: string, nick: string, e: string, p: string) => {
    const id = await authRepository.signup(n, nick, e, p);
    setUserId(id);
    setData(dataRepository.load(id));
  };
  const login = async (e: string, p: string, r: boolean) => {
    const id = await authRepository.login(e, p, r);
    const loaded = dataRepository.load(id);
    if (!loaded) throw new Error("Data akun tidak ditemukan di browser ini.");
    setUserId(id);
    setData(loaded);
  };
  const logout = () => {
    authRepository.logout();
    setUserId(null);
    setData(null);
  };
  const saveOnboarding = (profile: Partial<Profile>, pet: Pet) =>
    update((d) => ({
      ...d,
      profile: { ...d.profile, ...profile, onboarded: true },
      pet,
    }));
  const reward = (xp: number, message: string) =>
    update((d) => ({
      ...d,
      pet: d.pet ? { ...d.pet, xp: d.pet.xp + xp } : null,
      notifications: [
        {
          id: uid(),
          title: message,
          message: `+${xp} XP untuk ${d.pet?.name || "temanmu"}!`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "milestone",
        },
        ...d.notifications,
      ].slice(0, 60),
    }));
  const reset = (type: string) =>
    update((d) => {
      const base = emptyData({ ...d.profile, onboarded: true });
      if (type === "academic")
        return {
          ...d,
          courses: [],
          schedule: [],
          krs: [],
          khs: [],
          completedSemesters: [],
          achievements: d.achievements.filter(
            (x) =>
              ![
                "academic-starter",
                "semester-complete",
                "schedule-master",
              ].includes(x),
          ),
        };
      if (type === "productivity")
        return {
          ...d,
          assignments: [],
          projects: [],
          calendarEvents: [],
          weeklyGoals: [],
          achievements: d.achievements.filter(
            (x) =>
              ![
                "first-step",
                "organized",
                "team-player",
                "deadline-survivor",
              ].includes(x),
          ),
        };
      if (type === "pet")
        return {
          ...d,
          pet: d.pet
            ? { ...d.pet, xp: 0, accessories: [], equipped: "" }
            : null,
        };
      return {
        ...base,
        pet: d.pet ? { ...d.pet, xp: 0, accessories: [], equipped: "" } : null,
      };
    });
  return (
    <AppContext.Provider
      value={{
        data,
        ready,
        userId,
        toast,
        notify,
        signup,
        login,
        logout,
        update,
        saveOnboarding,
        reward,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => useContext(AppContext);
export const addNotice = (
  d: UserData,
  title: string,
  message: string,
  type = "activity",
): UserData => ({
  ...d,
  notifications: [
    {
      id: uid(),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    },
    ...d.notifications,
  ].slice(0, 60),
});
export const unlock = (d: UserData, key: string): UserData => {
  if (!achievements.some((a) => a.id === key) || d.achievements.includes(key))
    return d;
  return addNotice(
    { ...d, achievements: [...d.achievements, key] },
    "Achievement unlocked!",
    achievements.find((a) => a.id === key)!.name,
    "achievement",
  );
};
export const checkTaskAchievements = (d: UserData, a: Assignment): UserData => {
  let next = d;
  if (d.assignments.length === 1) next = unlock(next, "first-step");
  if (d.assignments.filter((x) => x.status === "completed").length >= 10)
    next = unlock(next, "organized");
  if (
    d.assignments.filter(
      (x) =>
        x.status === "completed" &&
        x.completedAt &&
        new Date(x.deadline).getTime() - new Date(x.completedAt).getTime() <
          86400000,
    ).length >= 5
  )
    next = unlock(next, "deadline-survivor");
  return next;
};
