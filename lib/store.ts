import { Profile, UserData, emptyData, uid } from "./types";
type Account = { id: string; email: string; salt: string; hash: string };
const accountsKey = "campusmate_accounts_v1",
  sessionKey = "campusmate_session_v1";
const scoped = (id: string) => `campusmate_user_${id}_data_v1`;
const getAccounts = (): Account[] => {
  try {
    return JSON.parse(localStorage.getItem(accountsKey) || "[]");
  } catch {
    return [];
  }
};
const bytesToHex = (b: Uint8Array) =>
  Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 210000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(result));
}
export const authRepository = {
  async signup(
    name: string,
    nickname: string,
    email: string,
    password: string,
  ) {
    const normalized = email.trim().toLowerCase();
    if (getAccounts().some((a) => a.email === normalized))
      throw new Error("Email sudah terdaftar. Coba masuk, ya.");
    const id = uid(),
      salt = uid() + uid(),
      hash = await hashPassword(password, salt);
    const account = { id, email: normalized, salt, hash };
    localStorage.setItem(
      accountsKey,
      JSON.stringify([...getAccounts(), account]),
    );
    const profile: Profile = {
      id,
      name: name.trim(),
      nickname: nickname.trim(),
      email: normalized,
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
      onboarded: false,
    };
    dataRepository.save(id, emptyData(profile));
    authRepository.setSession(id, true);
    return id;
  },
  async login(email: string, password: string, remember: boolean) {
    const a = getAccounts().find((x) => x.email === email.trim().toLowerCase());
    if (!a || (await hashPassword(password, a.salt)) !== a.hash)
      throw new Error("Email atau password tidak cocok.");
    authRepository.setSession(a.id, remember);
    return a.id;
  },
  setSession(id: string, remember: boolean) {
    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);
    (remember ? localStorage : sessionStorage).setItem(sessionKey, id);
  },
  getSession() {
    return (
      sessionStorage.getItem(sessionKey) || localStorage.getItem(sessionKey)
    );
  },
  logout() {
    sessionStorage.removeItem(sessionKey);
    localStorage.removeItem(sessionKey);
  },
  async changePassword(id: string, oldPass: string, newPass: string) {
    const all = getAccounts(),
      a = all.find((x) => x.id === id);
    if (!a || (await hashPassword(oldPass, a.salt)) !== a.hash)
      throw new Error("Password lama tidak cocok.");
    a.salt = uid() + uid();
    a.hash = await hashPassword(newPass, a.salt);
    localStorage.setItem(accountsKey, JSON.stringify(all));
  },
  changeEmail(id: string, email: string) {
    const all = getAccounts(),
      a = all.find((x) => x.id === id);
    if (!a) throw new Error("Akun tidak ditemukan.");
    if (all.some((x) => x.id !== id && x.email === email.trim().toLowerCase()))
      throw new Error("Email sudah digunakan.");
    a.email = email.trim().toLowerCase();
    localStorage.setItem(accountsKey, JSON.stringify(all));
  },
};
export const dataRepository = {
  load(id: string): UserData | null {
    try {
      const raw = localStorage.getItem(scoped(id));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(id: string, data: UserData) {
    localStorage.setItem(scoped(id), JSON.stringify(data));
  },
};
// Replace these repository adapters with authenticated server APIs when deploying multi-device sync.
export const studentRepository = dataRepository,
  courseRepository = dataRepository,
  scheduleRepository = dataRepository,
  assignmentRepository = dataRepository,
  projectRepository = dataRepository,
  academicRepository = dataRepository,
  petRepository = dataRepository,
  notificationRepository = dataRepository;
