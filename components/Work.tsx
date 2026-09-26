"use client";
import React, { useState } from "react";
import {
  Plus,
  ArrowRight,
  CalendarDays,
  BookOpen,
  CheckSquare,
  Users,
  FileUp,
  Clock3,
  MapPin,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit2,
  Check,
  RotateCcw,
  Archive,
  Search,
  Filter,
  Paperclip,
  LayoutList,
  CalendarRange,
  AlertCircle,
  Heart,
  UploadCloud,
} from "lucide-react";
import { useApp, unlock, checkTaskAchievements, addNotice } from "./Provider";
import {
  Button,
  Modal,
  Field,
  PageHeading,
  Empty,
  SectionHead,
  Pill,
  ArrowLink,
  Confirm,
  PetDisplay,
} from "./UI";
import {
  Course,
  Schedule,
  Assignment,
  uid,
  days,
  Attachment,
} from "@/lib/types";
import {
  academics,
  formatGpa,
  deadlineStatus,
  timeLeft,
  dateLabel,
  localDate,
} from "@/lib/logic";
type Go = { go: (s: string) => void };
const courseName = (id: string, courses: Course[]) =>
  courses.find((c) => c.id === id)?.name || "Tanpa mata kuliah";
const priorityTone = (s: string) =>
  s === "Tinggi" ? "urgent" : s === "Sedang" ? "soon" : "safe";
const statusTone = (s: string) =>
  s === "Overdue"
    ? "overdue"
    : s === "Urgent"
      ? "urgent"
      : s === "Soon"
        ? "soon"
        : s === "Completed"
          ? "completed"
          : "safe";
export function Dashboard({ go }: Go) {
  const { data, update, reward, notify } = useApp();
  const d = data!;
  const a = academics(d);
  const today = d.schedule
    .filter((s) => s.day === new Date().getDay())
    .sort((x, y) => x.startTime.localeCompare(y.startTime));
  const due = d.assignments
    .filter((x) => x.status === "open")
    .sort(
      (x, y) => new Date(x.deadline).getTime() - new Date(y.deadline).getTime(),
    )
    .slice(0, 3);
  const greeting =
    new Date().getHours() < 11
      ? "Pagi"
      : new Date().getHours() < 15
        ? "Siang"
        : new Date().getHours() < 18
          ? "Sore"
          : "Malam";
  const [quick, setQuick] = useState<"course" | "schedule" | "task" | null>(
    null,
  );
  const [customize, setCustomize] = useState(false),
    [petReaction, setPetReaction] = useState("");
  const widgets = d.settings.hiddenWidgets;
  const petMood =
    new Date().getHours() >= 23 || new Date().getHours() < 6
      ? "💤 Istirahat"
      : due.some((x) => ["Urgent", "Overdue"].includes(deadlineStatus(x)))
        ? "💭 Memikirkan deadline"
        : d.assignments.some(
              (x) => x.completedAt?.slice(0, 10) === localDate(new Date()),
            )
          ? "🎉 Ikut merayakan"
          : today.length
            ? "📚 Menemani belajar"
            : "✨ Santai";
  const toggleWidget = (id: string) =>
    update((x) => ({
      ...x,
      settings: {
        ...x.settings,
        hiddenWidgets: widgets.includes(id)
          ? widgets.filter((w) => w !== id)
          : [...widgets, id],
      },
    }));
  return (
    <>
      <div className="dashboard-intro">
        <button
          className="customize-trigger"
          onClick={() => setCustomize(true)}
        >
          ⚙ Atur widget
        </button>
        <div className="eyebrow">
          HARI INI ·{" "}
          {new Date()
            .toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .toUpperCase()}
        </div>
        <h1>
          Selamat {greeting.toLowerCase()}, {d.profile.nickname}{" "}
          <span className="wave">👋</span>
        </h1>
        <p>Ini ruang kuliahmu. Satu langkah kecil hari ini juga berarti.</p>
      </div>
      <div className="hero-banner">
        <div className="hero-copy">
          <div className="hero-tag">
            <Sparkles size={14} /> YOUR CAMPUS COMPANION
          </div>
          <h2>
            Siap jalani harimu
            <br />
            dengan lebih ringan?
          </h2>
          <p>
            {today.length
              ? `Ada ${today.length} kelas hari ini. Kamu pasti bisa!`
              : "Mulai dari hal kecil: isi jadwalmu, lalu biarkan kami bantu menjaganya."}
          </p>
          <Button onClick={() => go("/schedule")} variant="secondary">
            Lihat jadwal <ArrowRight size={16} />
          </Button>
        </div>
        <div className="hero-illustration">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <span className="hero-star star-one">✦</span>
          <span className="hero-star star-two">✧</span>
          <div className="hero-pet">
            <PetDisplay pet={d.pet} />
          </div>
          <div className="hero-pet-label">
            {d.pet?.name || "Temanmu"} siap menemani! ✨
          </div>
        </div>
      </div>
      {!widgets.includes("summary") && (
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon icon-lavender">
              <GraduationCap size={21} />
            </div>
            <span>
              IPS Semester {a.current?.semester || d.profile.semester}
            </span>
            <strong>{formatGpa(a.current?.ips)}</strong>
            <small>
              {a.current
                ? "Dari data KHS yang kamu simpan"
                : "Upload KHS untuk menghitung IPS"}
            </small>
          </div>
          <div className="summary-card">
            <div className="summary-icon icon-peach">
              <Sparkles size={21} />
            </div>
            <span>IPK Kumulatif</span>
            <strong>{formatGpa(a.ipk)}</strong>
            <small>
              {a.history.length
                ? `${a.history.length} semester tercatat${(d.completedSemesters || []).length < a.history.length ? " · sementara" : ""}`
                : "Belum ada data akademik"}
            </small>
          </div>
          <div className="summary-card">
            <div className="summary-icon icon-mint">
              <BookOpen size={21} />
            </div>
            <span>SKS Semester</span>
            <strong>
              {a.semesterSks} <i>SKS</i>
            </strong>
            <small>
              {
                d.courses.filter((c) => c.semester === d.profile.semester)
                  .length
              }{" "}
              mata kuliah tercatat
            </small>
          </div>
          <div className="summary-card">
            <div className="summary-icon icon-blue">
              <BookOpen size={21} />
            </div>
            <span>Total SKS Selesai</span>
            <strong>
              {a.totalSks} <i>SKS</i>
            </strong>
            <small>
              {a.history.length
                ? `Dari ${a.history.length} semester di KHS`
                : "Belum ada KHS tersimpan"}
            </small>
          </div>
        </div>
      )}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          {!widgets.includes("schedule") && (
            <section className="panel">
              <SectionHead
                title="Jadwal hari ini"
                subtitle={new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                action={
                  <ArrowLink onClick={() => go("/schedule")}>
                    Lihat semua
                  </ArrowLink>
                }
              />
              {today.length ? (
                <div className="today-list">
                  {today.map((s) => (
                    <div className="today-class" key={s.id}>
                      <div className="class-time">
                        <strong>{s.startTime}</strong>
                        <span>{s.endTime}</span>
                      </div>
                      <div className="class-rail" />
                      <div className="class-content">
                        <strong>{courseName(s.courseId, d.courses)}</strong>
                        <span>
                          {d.courses.find((c) => c.id === s.courseId)?.code ||
                            "Kelas"}{" "}
                          · {s.room || "Ruang belum diisi"}
                        </span>
                      </div>
                      <span className="class-sks">
                        {d.courses.find((c) => c.id === s.courseId)?.sks || 0}{" "}
                        SKS
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  compact
                  icon={<CalendarDays size={25} />}
                  title="Belum ada jadwal kuliah"
                  description="Tambahkan jadwal secara manual atau upload KRS untuk membuatnya otomatis."
                  action={
                    <div className="inline-actions">
                      <Button onClick={() => setQuick("schedule")}>
                        <Plus size={16} /> Tambah jadwal
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => go("/academic/krs")}
                      >
                        Upload KRS
                      </Button>
                    </div>
                  }
                />
              )}
            </section>
          )}
          {!widgets.includes("deadlines") && (
            <section className="panel">
              <SectionHead
                title="Deadline terdekat"
                subtitle="Tetap selangkah di depan tugasmu"
                action={
                  <ArrowLink onClick={() => go("/tasks")}>
                    Lihat semua
                  </ArrowLink>
                }
              />
              {due.length ? (
                <div className="deadline-list">
                  {due.map((t) => (
                    <div className="deadline-item" key={t.id}>
                      <button
                        className="task-check"
                        aria-label={`Selesaikan ${t.title}`}
                        onClick={() => {
                          update((x) =>
                            checkTaskAchievements(
                              {
                                ...x,
                                assignments: x.assignments.map((y) =>
                                  y.id === t.id
                                    ? {
                                        ...y,
                                        status: "completed",
                                        completedAt: new Date().toISOString(),
                                        xpAwarded: true,
                                      }
                                    : y,
                                ),
                              },
                              t,
                            ),
                          );
                          if (!t.xpAwarded) reward(20, "Tugas selesai");
                          notify(
                            t.xpAwarded
                              ? "Tugas selesai lagi. Mantap!"
                              : "Mantap! Satu tugas selesai. +20 XP 🐾",
                          );
                        }}
                      />
                      <div>
                        <strong>{t.title}</strong>
                        <small>
                          {courseName(t.courseId, d.courses)} ·{" "}
                          {dateLabel(t.deadline)}
                        </small>
                      </div>
                      <Pill tone={statusTone(deadlineStatus(t))}>
                        {timeLeft(t.deadline)}
                      </Pill>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  compact
                  icon={<CheckSquare size={25} />}
                  title="Belum ada tugas"
                  description="Tambahkan tugas pertamamu supaya deadline nggak kabur entah ke mana."
                  action={
                    <Button onClick={() => setQuick("task")}>
                      <Plus size={16} /> Tambah tugas
                    </Button>
                  }
                />
              )}
            </section>
          )}
        </div>
        <div className="dashboard-aside">
          {!widgets.includes("pet") && (
            <section className="pet-card">
              <div className="pet-card-top">
                <span className="eyebrow">TEMAN BELAJARMU</span>
                <Heart size={18} />
              </div>
              <button
                className="pet-card-emoji"
                aria-label={`Sapa ${d.pet?.name || "temanmu"}`}
                onClick={() =>
                  setPetReaction(
                    [
                      `Semangat, ${d.profile.nickname}! Kita bisa. ✨`,
                      `Istirahat sebentar juga bagian dari belajar. 💤`,
                      `Satu tugas pada satu waktu, ya! 📚`,
                    ][Math.floor(Math.random() * 3)],
                  )
                }
              >
                <PetDisplay pet={d.pet} />
              </button>
              <h3>
                Hai, aku {d.pet?.name}! <span>👋</span>
              </h3>
              <span className="pet-mood">{petMood}</span>
              <p>
                {petReaction ||
                  (due.some((x) => deadlineStatus(x) === "Overdue")
                    ? "Ada tugas yang lewat deadline. Yuk kita selesaikan pelan-pelan."
                    : due.some((x) => deadlineStatus(x) === "Urgent")
                      ? "Ada deadline yang sudah dekat. Kita kerjakan bareng, ya?"
                      : d.courses.length === 0 && d.assignments.length === 0
                        ? "Kayaknya kita baru mulai. Yuk isi jadwal kuliahmu!"
                        : "Kamu sudah melakukan yang terbaik hari ini. Teruskan, ya!")}
              </p>
              <div className="xp-track">
                <span>Level {Math.floor((d.pet?.xp || 0) / 100) + 1}</span>
                <span>{d.pet?.xp || 0} XP</span>
              </div>
              <div className="xp-bar">
                <div style={{ width: `${(d.pet?.xp || 0) % 100}%` }} />
              </div>
              <button onClick={() => go("/achievements")}>
                Lihat pencapaian <ArrowRight size={15} />
              </button>
            </section>
          )}
          {!widgets.includes("quick") && (
            <section className="panel quick-panel">
              <SectionHead title="Aksi cepat" />
              <div className="quick-grid">
                <button onClick={() => setQuick("task")}>
                  <span className="quick-icon icon-lavender">
                    <Plus size={19} />
                  </span>
                  Tambah tugas
                </button>
                <button onClick={() => setQuick("course")}>
                  <span className="quick-icon icon-blue">
                    <BookOpen size={19} />
                  </span>
                  Tambah matkul
                </button>
                <button onClick={() => setQuick("schedule")}>
                  <span className="quick-icon icon-peach">
                    <CalendarDays size={19} />
                  </span>
                  Tambah jadwal
                </button>
                <button onClick={() => go("/projects")}>
                  <span className="quick-icon icon-mint">
                    <Users size={19} />
                  </span>
                  Buat project
                </button>
                <button onClick={() => go("/calendar")}>
                  <span className="quick-icon icon-peach">
                    <CalendarRange size={19} />
                  </span>
                  Buat event
                </button>
                <button onClick={() => go("/academic/krs")}>
                  <span className="quick-icon icon-blue">
                    <FileUp size={19} />
                  </span>
                  Upload KRS
                </button>
                <button onClick={() => go("/academic/khs")}>
                  <span className="quick-icon icon-lavender">
                    <FileUp size={19} />
                  </span>
                  Upload KHS
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="dashboard-lower">
        {!widgets.includes("projects") && (
          <section className="panel">
            <SectionHead
              title="Project aktif"
              action={
                <ArrowLink onClick={() => go("/projects")}>
                  Semua project
                </ArrowLink>
              }
            />
            {d.projects.filter((x) => x.status !== "Completed").length ? (
              <div className="mini-projects">
                {d.projects
                  .filter((x) => x.status !== "Completed")
                  .slice(0, 3)
                  .map((p) => (
                    <button key={p.id} onClick={() => go("/projects")}>
                      <span className="project-avatar">✦</span>
                      <span>
                        <strong>{p.name}</strong>
                        <small>
                          {p.members.length} anggota · {dateLabel(p.deadline)}
                        </small>
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  ))}
              </div>
            ) : (
              <Empty
                compact
                icon={<Users size={25} />}
                title="Belum ada project"
                description="Belum ada kerja kelompok yang mengejar kamu. Nikmati dulu."
                action={
                  <Button variant="outline" onClick={() => go("/projects")}>
                    <Plus size={16} /> Buat project
                  </Button>
                }
              />
            )}
          </section>
        )}
        {!widgets.includes("academic") && (
          <section className="panel">
            <SectionHead
              title="Data akademik"
              action={
                <ArrowLink onClick={() => go("/academic")}>
                  Lihat akademik
                </ArrowLink>
              }
            />
            {d.krs.length || d.khs.length ? (
              <div className="academic-quick">
                <div>
                  <BookOpen size={20} />
                  <span>{d.krs.length} mata kuliah KRS</span>
                </div>
                <div>
                  <GraduationCap size={20} />
                  <span>{d.khs.length} nilai KHS tercatat</span>
                </div>
              </div>
            ) : (
              <Empty
                compact
                icon={<GraduationCap size={25} />}
                title="Belum ada data akademik"
                description="Upload KRS untuk jadwal dan KHS untuk menghitung IPS."
                action={
                  <div className="inline-actions">
                    <Button
                      variant="outline"
                      onClick={() => go("/academic/krs")}
                    >
                      Upload KRS
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => go("/academic/khs")}
                    >
                      Upload KHS
                    </Button>
                  </div>
                }
              />
            )}
          </section>
        )}
      </div>
      <Modal
        open={customize}
        onClose={() => setCustomize(false)}
        title="Atur widget dashboard"
      >
        <p className="muted widget-description">
          Pilih informasi yang ingin ditampilkan di berandamu.
        </p>
        <div className="widget-options">
          {[
            ["summary", "Ringkasan akademik"],
            ["schedule", "Jadwal hari ini"],
            ["deadlines", "Deadline terdekat"],
            ["pet", "Teman kecilmu"],
            ["quick", "Aksi cepat"],
            ["projects", "Project aktif"],
            ["academic", "Data akademik"],
          ].map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input
                type="checkbox"
                checked={!widgets.includes(key)}
                onChange={() => toggleWidget(key)}
              />
            </label>
          ))}
        </div>
        <div className="form-actions">
          <Button onClick={() => setCustomize(false)}>Selesai</Button>
        </div>
      </Modal>
      <QuickModal
        key={quick || "closed"}
        mode={quick}
        onClose={() => setQuick(null)}
      />
    </>
  );
}
export function QuickModal({
  mode,
  onClose,
  editingCourse,
  editingSchedule,
  editingTask,
}: {
  mode: "course" | "schedule" | "task" | null;
  onClose: () => void;
  editingCourse?: Course;
  editingSchedule?: Schedule;
  editingTask?: Assignment;
}) {
  const { data, update, notify } = useApp();
  const d = data!;
  const [course, setCourse] = useState<Partial<Course>>(
    editingCourse || {
      name: "",
      code: "",
      sks: 3,
      lecturer: "",
      semester: d.profile.semester,
      notes: "",
    },
  );
  const [schedule, setSchedule] = useState<Partial<Schedule>>(
    editingSchedule || {
      courseId: "",
      day: 1,
      startTime: "08:00",
      endTime: "09:40",
      room: "",
      className: "",
      notes: "",
    },
  );
  const [task, setTask] = useState<Partial<Assignment>>(
    editingTask || {
      title: "",
      description: "",
      courseId: "",
      deadline: "",
      priority: "Sedang",
      type: "Homework",
      group: false,
      status: "open",
      notes: "",
    },
  );
  const [error, setError] = useState("");
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "course") {
      if (
        !course.name?.trim() ||
        !course.code?.trim() ||
        !course.sks ||
        course.sks < 1 ||
        course.sks > 12
      ) {
        setError("Isi nama, kode, dan SKS (1–12) dengan benar.");
        return;
      }
      const item = {
        ...course,
        id: editingCourse?.id || uid(),
        name: course.name.trim(),
        code: course.code.trim(),
        sks: Number(course.sks),
        semester: Number(course.semester),
      } as Course;
      update((x) => ({
        ...x,
        courses: editingCourse
          ? x.courses.map((c) => (c.id === item.id ? item : c))
          : [...x.courses, item],
      }));
      notify(
        editingCourse ? "Mata kuliah diperbarui." : "Mata kuliah ditambahkan.",
      );
      onClose();
    }
    if (mode === "schedule") {
      if (
        !schedule.courseId ||
        !schedule.startTime ||
        !schedule.endTime ||
        schedule.startTime >= schedule.endTime
      ) {
        setError("Pilih mata kuliah dan isi rentang waktu yang valid.");
        return;
      }
      const item = {
        ...schedule,
        id: editingSchedule?.id || uid(),
        day: Number(schedule.day),
      } as Schedule;
      update((x) => {
        let y = {
          ...x,
          schedule: editingSchedule
            ? x.schedule.map((s) => (s.id === item.id ? item : s))
            : [...x.schedule, item],
        };
        if (!editingSchedule && y.schedule.length === 1)
          y = unlock(y, "schedule-master");
        return y;
      });
      notify(
        editingSchedule ? "Jadwal diperbarui." : "Jadwal mingguan ditambahkan.",
      );
      onClose();
    }
    if (mode === "task") {
      if (!task.title?.trim() || !task.deadline) {
        setError("Isi judul dan deadline tugas.");
        return;
      }
      const item = {
        ...task,
        id: editingTask?.id || uid(),
        title: task.title.trim(),
      } as Assignment;
      update((x) => {
        let y = {
          ...x,
          assignments: editingTask
            ? x.assignments.map((a) => (a.id === item.id ? item : a))
            : [...x.assignments, item],
        };
        if (!editingTask) y = checkTaskAchievements(y, item);
        return y;
      });
      notify(editingTask ? "Tugas diperbarui." : "Tugas berhasil ditambahkan.");
      onClose();
    }
  };
  return (
    <Modal
      open={!!mode}
      onClose={onClose}
      title={
        mode === "course"
          ? editingCourse
            ? "Edit mata kuliah"
            : "Tambah mata kuliah"
          : mode === "schedule"
            ? editingSchedule
              ? "Edit jadwal"
              : "Tambah jadwal kuliah"
            : editingTask
              ? "Edit tugas"
              : "Tambah tugas"
      }
      wide={mode === "task"}
    >
      <form onSubmit={save} className="form-stack">
        {mode === "course" && (
          <>
            <div className="form-grid">
              <Field label="Nama mata kuliah *">
                <input
                  required
                  placeholder="Contoh: Pemrograman Web"
                  value={course.name || ""}
                  onChange={(e) =>
                    setCourse({ ...course, name: e.target.value })
                  }
                />
              </Field>
              <Field label="Kode mata kuliah *">
                <input
                  required
                  placeholder="Contoh: IF301"
                  value={course.code || ""}
                  onChange={(e) =>
                    setCourse({ ...course, code: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="SKS *">
                <input
                  required
                  type="number"
                  min="1"
                  max="12"
                  value={course.sks || ""}
                  onChange={(e) =>
                    setCourse({ ...course, sks: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Semester">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={course.semester || ""}
                  onChange={(e) =>
                    setCourse({ ...course, semester: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            <Field label="Dosen">
              <input
                placeholder="Nama dosen (opsional)"
                value={course.lecturer || ""}
                onChange={(e) =>
                  setCourse({ ...course, lecturer: e.target.value })
                }
              />
            </Field>
            <Field label="Catatan">
              <textarea
                rows={2}
                value={course.notes || ""}
                onChange={(e) =>
                  setCourse({ ...course, notes: e.target.value })
                }
              />
            </Field>
          </>
        )}
        {mode === "schedule" && (
          <>
            <Field label="Mata kuliah *">
              <select
                required
                value={schedule.courseId || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, courseId: e.target.value })
                }
              >
                <option value="">Pilih mata kuliah</option>
                {d.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {!d.courses.length && (
                <small>
                  Belum ada mata kuliah. Tambahkan mata kuliah dulu.
                </small>
              )}
            </Field>
            <div className="form-grid">
              <Field label="Hari">
                <select
                  value={schedule.day}
                  onChange={(e) =>
                    setSchedule({ ...schedule, day: Number(e.target.value) })
                  }
                >
                  {days.map((x, i) => (
                    <option key={x} value={i}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Kelas">
                <input
                  placeholder="Contoh: A"
                  value={schedule.className || ""}
                  onChange={(e) =>
                    setSchedule({ ...schedule, className: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Mulai *">
                <input
                  type="time"
                  required
                  value={schedule.startTime || ""}
                  onChange={(e) =>
                    setSchedule({ ...schedule, startTime: e.target.value })
                  }
                />
              </Field>
              <Field label="Selesai *">
                <input
                  type="time"
                  required
                  value={schedule.endTime || ""}
                  onChange={(e) =>
                    setSchedule({ ...schedule, endTime: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Ruang">
              <input
                placeholder="Contoh: Lab 2"
                value={schedule.room || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, room: e.target.value })
                }
              />
            </Field>
            <Field label="Catatan">
              <textarea
                rows={2}
                value={schedule.notes || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, notes: e.target.value })
                }
              />
            </Field>
          </>
        )}
        {mode === "task" && (
          <>
            <Field label="Judul tugas *">
              <input
                required
                placeholder="Apa yang perlu dikerjakan?"
                value={task.title || ""}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                rows={3}
                placeholder="Detail tugas..."
                value={task.description || ""}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              />
            </Field>
            <div className="form-grid">
              <Field label="Mata kuliah">
                <select
                  value={task.courseId || ""}
                  onChange={(e) =>
                    setTask({ ...task, courseId: e.target.value })
                  }
                >
                  <option value="">Tanpa mata kuliah</option>
                  {d.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Deadline *">
                <input
                  required
                  type="datetime-local"
                  value={task.deadline || ""}
                  onChange={(e) =>
                    setTask({ ...task, deadline: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Prioritas">
                <select
                  value={task.priority}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      priority: e.target.value as Assignment["priority"],
                    })
                  }
                >
                  {["Rendah", "Sedang", "Tinggi"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Jenis tugas">
                <select
                  value={task.type}
                  onChange={(e) => setTask({ ...task, type: e.target.value })}
                >
                  {[
                    "Homework",
                    "Report",
                    "Presentation",
                    "Quiz",
                    "Exam",
                    "Programming",
                    "Design",
                    "Research",
                    "Other",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                checked={!!task.group}
                onChange={(e) => setTask({ ...task, group: e.target.checked })}
              />{" "}
              Tugas kelompok
            </label>
            <Field label="Catatan">
              <textarea
                rows={2}
                value={task.notes || ""}
                onChange={(e) => setTask({ ...task, notes: e.target.value })}
              />
            </Field>
            <label className="file-label">
              <Paperclip size={17} />{" "}
              {task.attachment?.name || "Lampirkan file (maks. 1 MB)"}
              <input
                hidden
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 1024 * 1024) {
                    setError("Lampiran maksimal 1 MB.");
                    return;
                  }
                  setAttachmentLoading(true);
                  const r = new FileReader();
                  r.onload = () => {
                    setTask((x) => ({
                      ...x,
                      attachment: {
                        name: f.name,
                        type: f.type,
                        data: String(r.result),
                      },
                    }));
                    setAttachmentLoading(false);
                  };
                  r.readAsDataURL(f);
                }}
              />
            </label>
          </>
        )}
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={
              attachmentLoading || (mode === "schedule" && !d.courses.length)
            }
          >
            {attachmentLoading ? "Memproses..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function SchedulePage({ go }: Go) {
  const { data, update, notify } = useApp();
  const d = data!;
  const [view, setView] = useState<"week" | "day" | "list">("week"),
    [day, setDay] = useState(new Date().getDay()),
    [modal, setModal] = useState<"course" | "schedule" | null>(null),
    [editCourse, setEditCourse] = useState<Course | undefined>(),
    [editSchedule, setEditSchedule] = useState<Schedule | undefined>(),
    [deleteId, setDeleteId] = useState<{
      type: "course" | "schedule";
      id: string;
    } | null>(null);
  const openCourse = (c?: Course) => {
      setEditCourse(c);
      setModal("course");
    },
    openSchedule = (s?: Schedule) => {
      setEditSchedule(s);
      setModal("schedule");
    };
  const sorted = [...d.schedule].sort(
    (a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime),
  );
  const display = view === "day" ? sorted.filter((s) => s.day === day) : sorted;
  return (
    <>
      <PageHeading
        eyebrow="KULIAH LEBIH TERATUR"
        title="Jadwal kuliah"
        description="Semua kelas mingguanmu, rapi dalam satu pandangan."
        action={
          <div className="inline-actions">
            <Button variant="outline" onClick={() => openCourse()}>
              <Plus size={16} /> Mata kuliah
            </Button>
            <Button onClick={() => openSchedule()}>
              <Plus size={16} /> Tambah jadwal
            </Button>
          </div>
        }
      />
      <div className="page-toolbar">
        <div className="segmented">
          {(["week", "day", "list"] as const).map((x) => (
            <button
              key={x}
              onClick={() => setView(x)}
              className={view === x ? "selected" : ""}
            >
              {x === "week" ? "Minggu" : x === "day" ? "Hari" : "Daftar"}
            </button>
          ))}
        </div>
        <span className="muted">
          {d.schedule.length} kelas · {d.courses.length} mata kuliah
        </span>
      </div>
      {!d.schedule.length ? (
        <div className="panel">
          <Empty
            icon={<CalendarDays size={29} />}
            title="Belum ada jadwal kuliah"
            description="Jadwalmu masih kosong. Tambahkan kelas secara manual atau upload KRS untuk membuatnya otomatis."
            action={
              <div className="inline-actions">
                <Button
                  onClick={() =>
                    d.courses.length ? openSchedule() : openCourse()
                  }
                >
                  <Plus size={16} />{" "}
                  {d.courses.length ? "Tambah jadwal" : "Tambah mata kuliah"}
                </Button>
                <Button variant="outline" onClick={() => go("/academic/krs")}>
                  <FileUp size={16} /> Upload KRS
                </Button>
              </div>
            }
          />
        </div>
      ) : view === "week" ? (
        <div className="week-grid">
          {[1, 2, 3, 4, 5, 6, 0].map((n) => (
            <div
              className={`day-column ${n === new Date().getDay() ? "today-column" : ""}`}
              key={n}
            >
              <div className="day-column-head">
                <strong>{days[n]}</strong>
                {n === new Date().getDay() && <span>Hari ini</span>}
              </div>
              {sorted.filter((s) => s.day === n).length ? (
                sorted
                  .filter((s) => s.day === n)
                  .map((s) => (
                    <button
                      className="week-class"
                      key={s.id}
                      onClick={() => openSchedule(s)}
                    >
                      <span className="week-time">
                        {s.startTime} — {s.endTime}
                      </span>
                      <strong>{courseName(s.courseId, d.courses)}</strong>
                      <small>{s.room || "Ruang belum diisi"}</small>
                      <span className="week-code">
                        {d.courses.find((c) => c.id === s.courseId)?.code || ""}
                      </span>
                    </button>
                  ))
              ) : (
                <div className="day-empty">Belum ada kelas</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="panel">
          {view === "day" && (
            <div className="day-picker">
              {[1, 2, 3, 4, 5, 6, 0].map((n) => (
                <button
                  key={n}
                  onClick={() => setDay(n)}
                  className={day === n ? "selected" : ""}
                >
                  {days[n].slice(0, 3)}
                </button>
              ))}
            </div>
          )}
          {display.length ? (
            <div className="schedule-list">
              {display.map((s) => (
                <div className="schedule-row" key={s.id}>
                  <div className="schedule-date">
                    <strong>{days[s.day].slice(0, 3)}</strong>
                    <span>
                      {s.startTime}
                      <br />— {s.endTime}
                    </span>
                  </div>
                  <div className="schedule-info">
                    <h3>{courseName(s.courseId, d.courses)}</h3>
                    <p>
                      {d.courses.find((c) => c.id === s.courseId)?.code} ·{" "}
                      {d.courses.find((c) => c.id === s.courseId)?.lecturer ||
                        "Dosen belum diisi"}
                    </p>
                    <span>
                      <MapPin size={14} /> {s.room || "Ruang belum diisi"}{" "}
                      {s.className && `· Kelas ${s.className}`}
                    </span>
                  </div>
                  <div className="row-actions">
                    <button
                      aria-label="Duplikat jadwal"
                      title="Duplikat"
                      onClick={() => {
                        update((x) => ({
                          ...x,
                          schedule: [...x.schedule, { ...s, id: uid() }],
                        }));
                        notify("Jadwal diduplikat.");
                      }}
                    >
                      <Copy size={17} />
                    </button>
                    <button
                      aria-label="Edit jadwal"
                      title="Edit"
                      onClick={() => openSchedule(s)}
                    >
                      <Edit2 size={17} />
                    </button>
                    <button
                      aria-label="Hapus jadwal"
                      title="Hapus"
                      onClick={() =>
                        setDeleteId({ type: "schedule", id: s.id })
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              compact
              title="Tidak ada kelas hari ini"
              description="Waktu luang untuk bernapas sebentar. 🎉"
            />
          )}
        </div>
      )}
      <div className="panel course-panel">
        <SectionHead
          title="Mata kuliahmu"
          subtitle="Kelola mata kuliah semester ini"
          action={
            <Button variant="outline" onClick={() => openCourse()}>
              <Plus size={16} /> Tambah
            </Button>
          }
        />
        {d.courses.length ? (
          <div className="course-grid">
            {d.courses.map((c) => (
              <div className="course-tile" key={c.id}>
                <div className="course-tile-icon">
                  <BookOpen size={19} />
                </div>
                <div>
                  <strong>{c.name}</strong>
                  <span>
                    {c.code} · {c.sks} SKS · Semester {c.semester}
                  </span>
                  {c.lecturer && <small>{c.lecturer}</small>}
                </div>
                <div className="row-actions">
                  <button
                    aria-label={`Edit ${c.name}`}
                    onClick={() => openCourse(c)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    aria-label={`Hapus ${c.name}`}
                    onClick={() => setDeleteId({ type: "course", id: c.id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            compact
            title="Belum ada mata kuliah"
            description="Tambahkan mata kuliahmu untuk mulai menyusun jadwal."
            action={
              <Button onClick={() => openCourse()}>
                <Plus size={16} /> Tambah mata kuliah
              </Button>
            }
          />
        )}
      </div>
      <QuickModal
        key={`${modal}-${editCourse?.id || editSchedule?.id || "new"}`}
        mode={modal}
        onClose={() => setModal(null)}
        editingCourse={editCourse}
        editingSchedule={editSchedule}
      />
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus data ini?"
        description={
          deleteId?.type === "course"
            ? "Mata kuliah ini dan semua jadwal terkait akan dihapus. Tugas tetap ada namun tidak lagi terhubung."
            : "Jadwal mingguan ini akan dihapus."
        }
        onConfirm={() => {
          if (!deleteId) return;
          update((x) =>
            deleteId.type === "course"
              ? {
                  ...x,
                  courses: x.courses.filter((c) => c.id !== deleteId.id),
                  schedule: x.schedule.filter(
                    (s) => s.courseId !== deleteId.id,
                  ),
                  krs: x.krs.filter((r) => r.courseId !== deleteId.id),
                }
              : {
                  ...x,
                  schedule: x.schedule.filter((s) => s.id !== deleteId.id),
                },
          );
          notify("Data berhasil dihapus.");
        }}
      />
    </>
  );
}
export function TasksPage({ go }: Go) {
  const { data, update, reward, notify } = useApp();
  const d = data!;
  const [filter, setFilter] = useState("Semua"),
    [search, setSearch] = useState(""),
    [sort, setSort] = useState("Terdekat"),
    [modal, setModal] = useState(false),
    [edit, setEdit] = useState<Assignment | undefined>(),
    [deleting, setDeleting] = useState<string | null>(null);
  const tasks = d.assignments
    .filter(
      (a) =>
        (filter === "Semua" ||
          (filter === "Aktif" && a.status === "open") ||
          (filter === "Selesai" && a.status === "completed") ||
          (filter === "Arsip" && a.status === "archived") ||
          filter === deadlineStatus(a)) &&
        (a.title + courseName(a.courseId, d.courses) + a.type)
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Terdekat"
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : sort === "Terjauh"
          ? new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          : sort === "Prioritas"
            ? ["Tinggi", "Sedang", "Rendah"].indexOf(a.priority) -
              ["Tinggi", "Sedang", "Rendah"].indexOf(b.priority)
            : a.title.localeCompare(b.title),
    );
  const complete = (a: Assignment) => {
    if (a.status === "completed") {
      update((x) => ({
        ...x,
        assignments: x.assignments.map((t) =>
          t.id === a.id ? { ...t, status: "open", completedAt: undefined } : t,
        ),
      }));
      notify("Tugas dibuka kembali.");
    } else {
      update((x) =>
        checkTaskAchievements(
          {
            ...x,
            assignments: x.assignments.map((t) =>
              t.id === a.id
                ? {
                    ...t,
                    status: "completed",
                    completedAt: new Date().toISOString(),
                    xpAwarded: true,
                  }
                : t,
            ),
          },
          a,
        ),
      );
      if (!a.xpAwarded) reward(20, "Tugas selesai");
      notify(
        a.xpAwarded
          ? "Tugas kembali selesai. Mantap!"
          : "Tugas selesai! +20 XP untuk temanmu 🐾",
      );
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="SATU TUGAS PADA SATU WAKTU"
        title="Tugas & deadline"
        description="Lihat apa yang perlu dikerjakan, lalu nikmati rasanya mencoret dari daftar."
        action={
          <Button
            onClick={() => {
              setEdit(undefined);
              setModal(true);
            }}
          >
            <Plus size={17} /> Tambah tugas
          </Button>
        }
      />
      <div className="task-metrics">
        <div>
          <span>Semua tugas</span>
          <strong>
            {d.assignments.filter((x) => x.status !== "archived").length}
          </strong>
        </div>
        <div>
          <span>Dalam proses</span>
          <strong>
            {d.assignments.filter((x) => x.status === "open").length}
          </strong>
        </div>
        <div>
          <span>Selesai</span>
          <strong>
            {d.assignments.filter((x) => x.status === "completed").length}
          </strong>
        </div>
        <div>
          <span>Butuh perhatian</span>
          <strong>
            {
              d.assignments.filter((x) =>
                ["Overdue", "Urgent"].includes(deadlineStatus(x)),
              ).length
            }
          </strong>
        </div>
      </div>
      <div className="panel">
        <div className="tasks-toolbar">
          <div className="filter-scroll">
            {[
              "Semua",
              "Aktif",
              "Soon",
              "Urgent",
              "Overdue",
              "Selesai",
              "Arsip",
            ].map((x) => (
              <button
                className={filter === x ? "selected" : ""}
                key={x}
                onClick={() => setFilter(x)}
              >
                {x === "Soon"
                  ? "Segera"
                  : x === "Urgent"
                    ? "Mendesak"
                    : x === "Overdue"
                      ? "Terlambat"
                      : x}
              </button>
            ))}
          </div>
          <div className="toolbar-controls">
            <div className="mini-search">
              <Search size={16} />
              <input
                placeholder="Cari tugas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              aria-label="Urutkan tugas"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>Terdekat</option>
              <option>Terjauh</option>
              <option>Prioritas</option>
              <option>Nama</option>
            </select>
          </div>
        </div>
        {tasks.length ? (
          <div className="task-list">
            {tasks.map((t) => (
              <div
                className={`task-row ${t.status === "completed" ? "task-done" : ""}`}
                key={t.id}
              >
                <button
                  className={`task-check ${t.status === "completed" ? "checked" : ""}`}
                  aria-label={
                    t.status === "completed"
                      ? "Buka kembali tugas"
                      : "Selesaikan tugas"
                  }
                  onClick={() => complete(t)}
                >
                  {t.status === "completed" && <Check size={15} />}
                </button>
                <div className="task-main">
                  <div>
                    <h3>{t.title}</h3>
                    <Pill tone={statusTone(deadlineStatus(t))}>
                      {deadlineStatus(t) === "Completed"
                        ? "Selesai"
                        : deadlineStatus(t) === "Archived"
                          ? "Arsip"
                          : timeLeft(t.deadline)}
                    </Pill>
                  </div>
                  <p>{t.description}</p>
                  <div className="task-meta">
                    <span>
                      <BookOpen size={14} />
                      {courseName(t.courseId, d.courses)}
                    </span>
                    <span>
                      <CalendarDays size={14} />
                      {dateLabel(t.deadline)} · {t.deadline.slice(11, 16)}
                    </span>
                    <span>{t.group ? "👥 Kelompok" : "👤 Individu"}</span>
                    <Pill tone={priorityTone(t.priority)}>{t.priority}</Pill>
                    {t.attachment && (
                      <a download={t.attachment.name} href={t.attachment.data}>
                        <Paperclip size={14} />
                        {t.attachment.name}
                      </a>
                    )}
                  </div>
                </div>
                <div className="row-actions">
                  <button
                    title="Edit"
                    aria-label={`Edit ${t.title}`}
                    onClick={() => {
                      setEdit(t);
                      setModal(true);
                    }}
                  >
                    <Edit2 size={17} />
                  </button>
                  <button
                    title={t.status === "archived" ? "Pulihkan" : "Arsipkan"}
                    aria-label={
                      t.status === "archived" ? "Pulihkan" : "Arsipkan"
                    }
                    onClick={() => {
                      update((x) => ({
                        ...x,
                        assignments: x.assignments.map((a) =>
                          a.id === t.id
                            ? {
                                ...a,
                                status:
                                  t.status === "archived" ? "open" : "archived",
                              }
                            : a,
                        ),
                      }));
                      notify(
                        t.status === "archived"
                          ? "Tugas dipulihkan."
                          : "Tugas diarsipkan.",
                      );
                    }}
                  >
                    <Archive size={17} />
                  </button>
                  <button
                    title="Hapus"
                    aria-label={`Hapus ${t.title}`}
                    onClick={() => setDeleting(t.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            title={
              d.assignments.length
                ? "Tidak ada tugas yang cocok"
                : "Belum ada tugas"
            }
            description={
              d.assignments.length
                ? "Coba ubah filter atau pencarianmu."
                : "Tambahkan tugas pertama kamu supaya deadline kuliah nggak kabur entah ke mana."
            }
            action={
              !d.assignments.length ? (
                <Button onClick={() => setModal(true)}>
                  <Plus size={16} /> Tambah tugas
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
      <QuickModal
        key={`${modal}-${edit?.id || "new"}`}
        mode={modal ? "task" : null}
        onClose={() => setModal(false)}
        editingTask={edit}
      />
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          update((x) => ({
            ...x,
            assignments: x.assignments.filter((a) => a.id !== deleting),
          }));
          notify("Tugas dihapus.");
        }}
        title="Hapus tugas?"
        description="Tugas ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
      />
    </>
  );
}
