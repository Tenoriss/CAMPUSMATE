"use client";
import React, { useState } from "react";
import {
  UserRound,
  Settings as SettingsIcon,
  Bell,
  Trophy,
  Heart,
  ShieldCheck,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  CalendarDays,
  Mail,
  BookOpen,
  CheckSquare,
  Users,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Edit2,
  Upload,
  Check,
  Lock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { useApp } from "./Provider";
import {
  Button,
  Field,
  PageHeading,
  Empty,
  SectionHead,
  Pill,
  Confirm,
  PetDisplay,
} from "./UI";
import { Profile, Pet, petEmoji, PetSpecies, achievements } from "@/lib/types";
import { authRepository } from "@/lib/store";
import {
  academics,
  dateLabel,
  deadlineStatus,
  levelForXp,
  localDate,
} from "@/lib/logic";
import { provinces, universities } from "@/lib/directory";
import { writeThemePref } from "@/lib/theme";
type Go = { go: (s: string) => void };
export function ProfilePage({ go }: Go) {
  const { data, update, notify } = useApp(),
    d = data!;
  const [editing, setEditing] = useState(false),
    [form, setForm] = useState({ ...d.profile }),
    [error, setError] = useState("");
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.nickname.trim() ||
      !form.campus.trim() ||
      !form.major.trim()
    ) {
      setError("Isi nama, panggilan, kampus, dan program studi.");
      return;
    }
    update((x) => ({ ...x, profile: { ...form, email: x.profile.email } }));
    notify("Profil berhasil diperbarui.");
    setEditing(false);
  };
  return (
    <>
      <PageHeading
        eyebrow="INI CERITAMU"
        title="Profil saya"
        description="Ruang kecil untuk mengenal siapa di balik semua kerja keras ini."
        action={
          !editing ? (
            <Button
              variant="outline"
              onClick={() => {
                setForm({ ...d.profile });
                setEditing(true);
              }}
            >
              <Edit2 size={16} /> Edit profil
            </Button>
          ) : undefined
        }
      />
      <div className="profile-grid">
        <div className="panel profile-main">
          <div className="profile-cover">
            <span>✦</span>
          </div>
          <div className="profile-identity">
            <div className="avatar avatar-xl">
              {d.profile.avatar ? (
                <img src={d.profile.avatar} alt="Foto profil" />
              ) : (
                d.profile.nickname.charAt(0).toUpperCase()
              )}
            </div>
            <h2>{d.profile.name}</h2>
            <p>
              {d.profile.degree} · {d.profile.major}
            </p>
            <span>🎓 {d.profile.campus}</span>
          </div>
          <div className="profile-details">
            {[
              ["Nama panggilan", d.profile.nickname],
              ["Email", d.profile.email],
              ["NIM", d.profile.nim],
              ["Provinsi", d.profile.province],
              ["Fakultas", d.profile.faculty],
              ["Jenjang", d.profile.degree],
              ["Semester", String(d.profile.semester)],
              ["Tahun akademik", d.profile.academicYear],
              ["Target lulus", d.profile.graduationYear],
            ].map(([l, v]) => (
              <div key={l}>
                <span>{l}</span>
                <strong>{v || "Belum diisi"}</strong>
              </div>
            ))}
          </div>
          {d.profile.bio && (
            <div className="profile-bio">
              <strong>Tentang saya</strong>
              <p>{d.profile.bio}</p>
            </div>
          )}
        </div>
        <div className="profile-side">
          <div className="panel profile-pet">
            <div className="eyebrow">TEMAN SETIAMU</div>
            <div className="profile-pet-emoji">
              <PetDisplay pet={d.pet} />
            </div>
            <h3>{d.pet?.name}</h3>
            <p>
              {d.pet?.species} · Level {levelForXp(d.pet?.xp || 0)}
            </p>
            <div className="xp-bar">
              <div style={{ width: `${(d.pet?.xp || 0) % 100}%` }} />
            </div>
            <small>{d.pet?.xp || 0} XP terkumpul</small>
            <Button variant="outline" onClick={() => go("/settings")}>
              Atur temanmu <ArrowRight size={15} />
            </Button>
          </div>
          <div className="panel">
            <SectionHead title="Sekilas perjalanan" />
            <div className="profile-stat">
              <BookOpen size={17} /> {d.courses.length} mata kuliah
            </div>
            <div className="profile-stat">
              <CheckSquare size={17} />{" "}
              {d.assignments.filter((x) => x.status === "completed").length}{" "}
              tugas selesai
            </div>
            <div className="profile-stat">
              <GraduationCap size={17} /> {academics(d).history.length} semester
              tercatat
            </div>
            <div className="profile-stat">
              <Trophy size={17} /> {d.achievements.length} pencapaian
            </div>
          </div>
        </div>
      </div>
      {editing && (
        <div className="panel profile-editor">
          <SectionHead
            title="Edit profil"
            subtitle="Perubahan tersimpan hanya di browser ini"
          />
          <form className="form-stack" onSubmit={save}>
            <label className="file-label">
              <Upload size={16} />{" "}
              {form.avatar ? "Ganti foto profil" : "Upload foto profil"}
              <input
                hidden
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 1024 * 1024) {
                    setError("Foto maksimal 1 MB.");
                    return;
                  }
                  const r = new FileReader();
                  r.onload = () =>
                    setForm((x) => ({ ...x, avatar: String(r.result) }));
                  r.readAsDataURL(f);
                }}
              />
            </label>
            <div className="form-grid">
              <Field label="Nama lengkap">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Nama panggilan">
                <input
                  required
                  value={form.nickname}
                  onChange={(e) =>
                    setForm({ ...form, nickname: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Provinsi">
                <select
                  value={form.province}
                  onChange={(e) =>
                    setForm({ ...form, province: e.target.value })
                  }
                >
                  <option value="">Pilih provinsi</option>
                  {provinces.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Kampus">
                <input
                  list="profile-campuses"
                  value={form.campus}
                  onChange={(e) => setForm({ ...form, campus: e.target.value })}
                />
                <datalist id="profile-campuses">
                  {universities
                    .filter((x) => x.province === form.province)
                    .map((x) => (
                      <option key={x.name}>{x.name}</option>
                    ))}
                </datalist>
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Fakultas">
                <input
                  value={form.faculty}
                  onChange={(e) =>
                    setForm({ ...form, faculty: e.target.value })
                  }
                />
              </Field>
              <Field label="Program studi">
                <input
                  required
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Jenjang">
                <select
                  value={form.degree}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      degree: e.target.value as Profile["degree"],
                    })
                  }
                >
                  {["D3", "D4", "S1", "S2", "S3"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="NIM">
                <input
                  value={form.nim}
                  onChange={(e) => setForm({ ...form, nim: e.target.value })}
                />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Semester">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.semester}
                  onChange={(e) =>
                    setForm({ ...form, semester: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Tahun akademik">
                <input
                  value={form.academicYear}
                  onChange={(e) =>
                    setForm({ ...form, academicYear: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Target tahun lulus">
              <input
                value={form.graduationYear}
                onChange={(e) =>
                  setForm({ ...form, graduationYear: e.target.value })
                }
              />
            </Field>
            <Field label="Bio">
              <textarea
                rows={3}
                maxLength={300}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Sedikit tentang dirimu..."
              />
            </Field>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan profil</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
const accessories = [
  { name: "Graduation cap", xp: 100, emoji: "🎓" },
  { name: "Glasses", xp: 200, emoji: "👓" },
  { name: "Backpack", xp: 300, emoji: "🎒" },
  { name: "Headphones", xp: 400, emoji: "🎧" },
  { name: "Bow", xp: 500, emoji: "🎀" },
  { name: "Hoodie", xp: 600, emoji: "🧥" },
];
export function SettingsPage({ go }: Go) {
  const { data, update, reset, notify, logout } = useApp(),
    d = data!;
  const [petName, setPetName] = useState(d.pet?.name || ""),
    [species, setSpecies] = useState<PetSpecies>(d.pet?.species || "Cat"),
    [oldPass, setOldPass] = useState(""),
    [newPass, setNewPass] = useState(""),
    [confirmPass, setConfirmPass] = useState(""),
    [email, setEmail] = useState(d.profile.email),
    [error, setError] = useState(""),
    [resetType, setResetType] = useState<string | null>(null),
    [pwBusy, setPwBusy] = useState(false);
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPass.length < 8 || newPass !== confirmPass) {
      setError(
        "Password baru minimal 8 karakter dan konfirmasinya harus cocok.",
      );
      return;
    }
    setPwBusy(true);
    try {
      await authRepository.changePassword(d.profile.id, oldPass, newPass);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      notify("Password berhasil diubah.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tidak bisa mengubah password.",
      );
    } finally {
      setPwBusy(false);
    }
  };
  const changeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Masukkan email yang valid.");
      return;
    }
    try {
      authRepository.changeEmail(d.profile.id, email);
      update((x) => ({
        ...x,
        profile: { ...x.profile, email: email.trim().toLowerCase() },
      }));
      notify("Email berhasil diubah.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tidak bisa mengubah email.",
      );
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="SESUAI CARA KAMU BELAJAR"
        title="Pengaturan"
        description="Atur pengalaman kuliah digitalmu agar benar-benar terasa milikmu."
      />
      <div className="settings-layout">
        <div className="settings-nav">
          <a href="#tampilan">Tampilan</a>
          <a href="#teman">Teman kecilmu</a>
          <a href="#notifikasi">Notifikasi</a>
          <a href="#akun">Keamanan akun</a>
          <a href="#data">Data & privasi</a>
        </div>
        <div className="settings-content">
          <section className="panel settings-section" id="tampilan">
            <SectionHead
              title="Tampilan"
              subtitle="Nyaman dilihat, kapan pun kamu belajar"
            />
            <div className="theme-options">
              {(
                [
                  { key: "light", label: "Terang", icon: Sun },
                  { key: "dark", label: "Gelap", icon: Moon },
                  { key: "system", label: "Ikuti sistem", icon: Monitor },
                ] as const
              ).map((x) => (
                <button
                  key={x.key}
                  className={d.settings.theme === x.key ? "selected" : ""}
                  aria-pressed={d.settings.theme === x.key}
                  onClick={() => {
                    writeThemePref(x.key);
                    update((y) => ({
                      ...y,
                      settings: { ...y.settings, theme: x.key },
                    }));
                  }}
                >
                  <x.icon size={20} />
                  <span>{x.label}</span>
                  {d.settings.theme === x.key && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>
          <section className="panel settings-section" id="teman">
            <SectionHead
              title="Teman kecilmu"
              subtitle="Nama dan penampilan bisa berubah, progress tetap aman"
            />
            <div className="pet-settings-preview">
              <span>
                <PetDisplay pet={d.pet ? { ...d.pet, species } : null} />
              </span>
              <div>
                <strong>{petName || "Temanmu"}</strong>
                <small>
                  Level {levelForXp(d.pet?.xp || 0)} · {d.pet?.xp || 0} XP
                </small>
              </div>
            </div>
            <div className="form-grid">
              <Field label="Nama teman">
                <input
                  maxLength={24}
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                />
              </Field>
              <Field label="Spesies">
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                >
                  {Object.keys(petEmoji).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Button
              onClick={() => {
                if (!petName.trim()) {
                  notify("Nama temanmu tidak boleh kosong.");
                  return;
                }
                update((x) => ({
                  ...x,
                  pet: x.pet
                    ? { ...x.pet, name: petName.trim(), species }
                    : null,
                }));
                notify("Temanmu tampil dengan gaya baru!");
              }}
            >
              Simpan temanmu
            </Button>
            <div className="divider" />
            <h3>Aksesori</h3>
            <p className="muted">
              Terbuka otomatis ketika XP-mu mencapai jumlah tertentu. XP tidak
              berkurang.
            </p>
            <div className="accessory-grid">
              {accessories.map((a) => (
                <button
                  key={a.name}
                  disabled={(d.pet?.xp || 0) < a.xp}
                  className={d.pet?.equipped === a.name ? "equipped" : ""}
                  onClick={() => {
                    update((x) => ({
                      ...x,
                      pet: x.pet
                        ? {
                            ...x.pet,
                            equipped: x.pet.equipped === a.name ? "" : a.name,
                            accessories: [
                              ...new Set([...x.pet.accessories, a.name]),
                            ],
                          }
                        : null,
                    }));
                    notify("Aksesori diperbarui.");
                  }}
                >
                  <span>{a.emoji}</span>
                  <strong>{a.name}</strong>
                  <small>
                    {(d.pet?.xp || 0) < a.xp
                      ? `🔒 ${a.xp} XP`
                      : d.pet?.equipped === a.name
                        ? "Dipakai"
                        : "Pakai"}
                  </small>
                </button>
              ))}
            </div>
          </section>
          <section className="panel settings-section" id="notifikasi">
            <SectionHead
              title="Notifikasi"
              subtitle="Pengingat dari datamu, bukan spam"
            />
            {(
              [
                {
                  key: "deadlines",
                  title: "Deadline tugas",
                  desc: "Tugas yang dekat atau terlambat",
                },
                {
                  key: "classes",
                  title: "Jadwal kuliah",
                  desc: "Kelas yang akan segera dimulai",
                },
                {
                  key: "projects",
                  title: "Project",
                  desc: "Project yang mendekati tenggat",
                },
              ] as const
            ).map((x) => (
              <label className="settings-toggle" key={x.key}>
                <span>
                  <strong>{x.title}</strong>
                  <small>{x.desc}</small>
                </span>
                <input
                  type="checkbox"
                  checked={d.settings.notifications[x.key]}
                  onChange={(e) =>
                    update((y) => ({
                      ...y,
                      settings: {
                        ...y.settings,
                        notifications: {
                          ...y.settings.notifications,
                          [x.key]: e.target.checked,
                        },
                      },
                    }))
                  }
                />
              </label>
            ))}
          </section>
          <section className="panel settings-section" id="akun">
            <SectionHead
              title="Keamanan akun"
              subtitle="Password tidak disimpan sebagai teks biasa"
            />
            <form className="form-stack" onSubmit={changeEmail}>
              <Field label="Email akun">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Button variant="outline" type="submit">
                Ubah email
              </Button>
            </form>
            <div className="divider" />
            <form className="form-stack" onSubmit={changePassword}>
              <div className="form-grid">
                <Field label="Password saat ini">
                  <input
                    required
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                  />
                </Field>
                <Field label="Password baru">
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Konfirmasi password baru">
                <input
                  required
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </Field>
              {error && <div className="form-error">{error}</div>}
              <Button variant="outline" disabled={pwBusy} type="submit">
                {pwBusy ? "Menyimpan..." : "Ubah password"}
              </Button>
            </form>
          </section>
          <section className="panel settings-section" id="data">
            <SectionHead
              title="Data & privasi"
              subtitle="Kamu memegang kendali atas informasimu"
            />
            <div className="privacy-note">
              <ShieldCheck size={20} />
              <div>
                <strong>Data tersimpan di browser ini</strong>
                <span>
                  Akun, dokumen yang dikonfirmasi, dan aktivitasmu tidak
                  disinkronkan ke cloud. Membersihkan data browser akan
                  menghapus semuanya. Jangan gunakan perangkat bersama untuk
                  data sensitif.
                </span>
              </div>
            </div>
            <h3>Reset data saya</h3>
            <div className="reset-options">
              <div>
                <span>
                  <strong>Reset data akademik</strong>
                  <small>Hapus KRS, KHS, nilai, mata kuliah, dan jadwal.</small>
                </span>
                <Button
                  variant="outline"
                  onClick={() => setResetType("academic")}
                >
                  Reset
                </Button>
              </div>
              <div>
                <span>
                  <strong>Reset produktivitas</strong>
                  <small>Hapus tugas, project, dan event kalender.</small>
                </span>
                <Button
                  variant="outline"
                  onClick={() => setResetType("productivity")}
                >
                  Reset
                </Button>
              </div>
              <div>
                <span>
                  <strong>Reset progress pet</strong>
                  <small>
                    XP kembali ke 0, level 1, dan aksesori terkunci lagi.
                  </small>
                </span>
                <Button variant="outline" onClick={() => setResetType("pet")}>
                  Reset
                </Button>
              </div>
              <div>
                <span>
                  <strong>Reset semuanya</strong>
                  <small>
                    Hapus semua data yang kamu buat. Akun dan profil tetap ada.
                  </small>
                </span>
                <Button variant="danger" onClick={() => setResetType("all")}>
                  Reset semua
                </Button>
              </div>
            </div>
            <div className="divider" />
            <Button
              variant="outline"
              onClick={() => {
                logout();
                go("/login");
              }}
            >
              <LogOut size={16} /> Keluar akun
            </Button>
          </section>
        </div>
      </div>
      <Confirm
        open={!!resetType}
        onClose={() => setResetType(null)}
        title="Yakin ingin reset data?"
        description={`Data ${resetType === "all" ? "yang kamu buat" : resetType === "academic" ? "akademik" : resetType === "productivity" ? "produktivitas" : "progress pet"} akan dihapus dari akun ini di browser ini. Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => {
          reset(resetType || "all");
          notify("Data berhasil direset.");
        }}
      />
    </>
  );
}
export function NotificationsPage({ go }: Go) {
  const { data, update, notify } = useApp(),
    d = data!;
  const now = Date.now();
  const derived: {
    id: string;
    title: string;
    message: string;
    type: string;
    timestamp: string;
    read: boolean;
  }[] = [];
  if (d.settings.notifications.deadlines)
    d.assignments
      .filter((t) => t.status === "open")
      .forEach((t) => {
        const diff = new Date(t.deadline).getTime() - now;
        if (diff < 0 || diff < 86400000 * 2)
          derived.push({
            id: "due-" + t.id,
            title:
              diff < 0 ? "Tugas melewati deadline" : "Deadline segera tiba",
            message: `${t.title} ${diff < 0 ? "sudah terlambat" : diff < 86400000 ? "jatuh tempo hari ini" : "jatuh tempo besok"}.`,
            type: "deadline",
            timestamp: t.deadline,
            read: false,
          });
      });
  if (d.settings.notifications.projects)
    d.projects
      .filter((p) => p.status !== "Completed")
      .forEach((p) => {
        const diff = new Date(p.deadline + "T23:59:00").getTime() - now;
        if (diff < 86400000 * 2)
          derived.push({
            id: "project-" + p.id,
            title: "Tenggat project",
            message: `${p.name} ${diff < 0 ? "sudah lewat tenggat" : "segera jatuh tempo"}.`,
            type: "project",
            timestamp: p.deadline,
            read: false,
          });
      });
  if (d.settings.notifications.classes) {
    const today = new Date().getDay();
    d.schedule
      .filter((s) => s.day === today)
      .forEach((s) => {
        const start = new Date();
        const [h, m] = s.startTime.split(":").map(Number);
        start.setHours(h, m, 0, 0);
        const diff = start.getTime() - now;
        if (diff > 0 && diff <= 3600000)
          derived.push({
            id: "class-" + s.id,
            title: "Kelas segera dimulai",
            message: `${d.courses.find((c) => c.id === s.courseId)?.name || "Kelas"} mulai dalam ${Math.ceil(diff / 60000)} menit.`,
            type: "class",
            timestamp: start.toISOString(),
            read: false,
          });
      });
  }
  const all = [...derived, ...d.notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return (
    <>
      <PageHeading
        eyebrow="BIAR NGGAK KELEWAT"
        title="Notifikasi"
        description="Info penting dari kegiatan kuliahmu, tepat saat dibutuhkan."
        action={
          d.notifications.some((n) => !n.read) ? (
            <Button
              variant="outline"
              onClick={() => {
                update((x) => ({
                  ...x,
                  notifications: x.notifications.map((n) => ({
                    ...n,
                    read: true,
                  })),
                }));
                notify("Semua notifikasi ditandai sudah dibaca.");
              }}
            >
              <Check size={16} /> Tandai sudah dibaca
            </Button>
          ) : undefined
        }
      />
      <div className="panel">
        {all.length ? (
          <div className="notification-list">
            {all.map((n) => (
              <div
                key={n.id}
                className={`notification-row ${n.read ? "" : "unread"}`}
              >
                <span className="notification-icon">
                  {n.type === "achievement" ? (
                    <Trophy size={19} />
                  ) : n.type === "deadline" ? (
                    <CheckSquare size={19} />
                  ) : n.type === "class" ? (
                    <CalendarDays size={19} />
                  ) : (
                    <Bell size={19} />
                  )}
                </span>
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{dateLabel(n.timestamp)}</small>
                </div>
                {!n.read &&
                  !n.id.startsWith("due-") &&
                  !n.id.startsWith("project-") &&
                  !n.id.startsWith("class-") && (
                    <button
                      aria-label="Tandai dibaca"
                      onClick={() =>
                        update((x) => ({
                          ...x,
                          notifications: x.notifications.map((y) =>
                            y.id === n.id ? { ...y, read: true } : y,
                          ),
                        }))
                      }
                    >
                      <Check size={17} />
                    </button>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon={<Bell size={28} />}
            title="Belum ada notifikasi"
            description="Saat ada kelas atau deadline mendekat, infonya akan muncul di sini."
            action={
              <Button variant="outline" onClick={() => go("/settings")}>
                Atur notifikasi
              </Button>
            }
          />
        )}
      </div>
    </>
  );
}
export function AchievementsPage({ go }: Go) {
  const { data, update, reward, notify } = useApp(),
    d = data!;
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const weekKey = localDate(monday);
  const completedThisWeek = d.assignments.filter(
    (a) => a.completedAt && new Date(a.completedAt) >= monday,
  ).length;
  const claimed = (d.weeklyGoals || []).includes(weekKey);
  return (
    <>
      <PageHeading
        eyebrow="LANGKAH KECIL, CERITA BESAR"
        title="Pencapaian"
        description="Setiap usaha layak dirayakan. Badges hanya terbuka dari aktivitasmu sendiri."
      />
      <div className="achievements-hero">
        <div className="achievements-pet">
          <PetDisplay pet={d.pet} />
        </div>
        <div>
          <div className="eyebrow">PROGRESS {d.pet?.name?.toUpperCase()}</div>
          <h2>Level {levelForXp(d.pet?.xp || 0)}</h2>
          <p>
            {d.pet?.xp || 0} XP terkumpul · {d.achievements.length} dari{" "}
            {achievements.length} badge terbuka
          </p>
          <div className="xp-bar">
            <div style={{ width: `${(d.pet?.xp || 0) % 100}%` }} />
          </div>
          <small>
            {100 - ((d.pet?.xp || 0) % 100)} XP menuju level berikutnya
          </small>
        </div>
      </div>
      <div className="achievement-grid">
        {achievements.map((a) => {
          const unlocked = d.achievements.includes(a.id);
          return (
            <div
              className={`achievement-card ${unlocked ? "unlocked" : "locked"}`}
              key={a.id}
            >
              <span className="achievement-icon">{a.icon}</span>
              <div>
                <Pill tone={unlocked ? "completed" : "neutral"}>
                  {unlocked ? "Terbuka" : "Terkunci"}
                </Pill>
                <h3>{a.name}</h3>
                <p>{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="panel weekly-goal">
        <SectionHead
          title="Target mingguan"
          subtitle="Tuntaskan 3 tugas minggu ini untuk bonus 100 XP"
        />
        <div className="weekly-goal-body">
          <div>
            <strong>{Math.min(3, completedThisWeek)} / 3 tugas selesai</strong>
            <div className="xp-bar">
              <div
                style={{
                  width: `${Math.min(100, (completedThisWeek / 3) * 100)}%`,
                }}
              />
            </div>
          </div>
          <Button
            disabled={completedThisWeek < 3 || claimed}
            onClick={() => {
              update((x) => ({
                ...x,
                weeklyGoals: [...(x.weeklyGoals || []), weekKey],
              }));
              reward(100, "Target mingguan tercapai");
              notify("Target mingguan selesai! +100 XP ✨");
            }}
          >
            {claimed
              ? "Sudah diklaim"
              : completedThisWeek < 3
                ? "Belum tercapai"
                : "Klaim 100 XP"}
          </Button>
        </div>
      </div>
      <div className="panel xp-explainer">
        <SectionHead title="Bagaimana dapat XP?" />
        <div>
          <span>
            ✓ Selesaikan tugas <strong>+20 XP</strong>
          </span>
          <span>
            ✦ Selesaikan project <strong>+50 XP</strong>
          </span>
          <span>
            ▦ Konfirmasi KRS <strong>+30 XP</strong>
          </span>
          <span>
            ◈ Konfirmasi KHS <strong>+40 XP</strong>
          </span>
        </div>
      </div>
    </>
  );
}
