"use client";
import React, { useState } from "react";
import {
  Plus,
  Users,
  CalendarDays,
  ArrowRight,
  Check,
  Trash2,
  Edit2,
  BookOpen,
  Clock3,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Paperclip,
  Search,
  CheckSquare,
  GraduationCap,
  CalendarRange,
  Info,
} from "lucide-react";
import { useApp, unlock } from "./Provider";
import {
  Button,
  Modal,
  Field,
  PageHeading,
  Empty,
  SectionHead,
  Pill,
  Confirm,
} from "./UI";
import {
  Project,
  ProjectTask,
  CalendarEvent,
  uid,
  days,
  Attachment,
} from "@/lib/types";
import { dateLabel, localDate, deadlineStatus } from "@/lib/logic";
type Go = { go: (s: string) => void };
export function ProjectsPage({ go }: Go) {
  const { data, update, reward, notify } = useApp(),
    d = data!;
  const [modal, setModal] = useState(false),
    [edit, setEdit] = useState<Project | undefined>(),
    [selected, setSelected] = useState<string | null>(null),
    [deleting, setDeleting] = useState<string | null>(null),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("Semua");
  const [form, setForm] = useState<Partial<Project>>({
    name: "",
    courseId: "",
    description: "",
    deadline: "",
    status: "Planning",
    kind: "Group project",
    members: [],
    tasks: [],
    notes: "",
  });
  const [member, setMember] = useState(""),
    [taskName, setTaskName] = useState(""),
    [assignee, setAssignee] = useState(""),
    [taskDeadline, setTaskDeadline] = useState(""),
    [taskPriority, setTaskPriority] =
      useState<ProjectTask["priority"]>("Sedang"),
    [editingTask, setEditingTask] = useState<string | null>(null),
    [error, setError] = useState("");
  const project = d.projects.find((x) => x.id === selected);
  const list = d.projects.filter(
    (x) =>
      (filter === "Semua" || x.status === filter) &&
      (x.name + x.description).toLowerCase().includes(search.toLowerCase()),
  );
  const open = (p?: Project) => {
    setEdit(p);
    setForm(
      p
        ? { ...p, members: [...p.members], tasks: [...p.tasks] }
        : {
            name: "",
            courseId: "",
            description: "",
            deadline: "",
            status: "Planning",
            kind: "Group project",
            members: [],
            tasks: [],
            notes: "",
          },
    );
    setError("");
    setModal(true);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.deadline) {
      setError("Isi nama dan deadline project.");
      return;
    }
    const item = {
      ...form,
      name: form.name.trim(),
      id: edit?.id || uid(),
    } as Project;
    update((x) => {
      let y = {
        ...x,
        projects: edit
          ? x.projects.map((p) => (p.id === item.id ? item : p))
          : [...x.projects, item],
      };
      if (!edit && y.projects.length === 1) y = unlock(y, "team-player");
      return y;
    });
    notify(edit ? "Project diperbarui." : "Project baru dibuat.");
    setModal(false);
  };
  const updateProject = (p: Project) => {
    const earns = p.status === "Completed" && !project?.xpAwarded;
    const saved = { ...p, xpAwarded: !!project?.xpAwarded || earns };
    update((x) => ({
      ...x,
      projects: x.projects.map((y) => (y.id === p.id ? saved : y)),
    }));
    if (earns) {
      reward(50, "Project selesai");
      notify("Project selesai! +50 XP 🎉");
    } else notify("Project diperbarui.");
  };
  return (
    <>
      <PageHeading
        eyebrow="KERJA BARENG, LEBIH RINGAN"
        title="Project"
        description="Kerja kelompok tanpa kehilangan jejak siapa mengerjakan apa."
        action={
          <Button onClick={() => open()}>
            <Plus size={17} /> Buat project
          </Button>
        }
      />
      <div className="project-overview">
        <div>
          <span>Semua project</span>
          <strong>{d.projects.length}</strong>
        </div>
        <div>
          <span>Dalam proses</span>
          <strong>
            {d.projects.filter((p) => p.status === "In Progress").length}
          </strong>
        </div>
        <div>
          <span>Selesai</span>
          <strong>
            {d.projects.filter((p) => p.status === "Completed").length}
          </strong>
        </div>
      </div>
      <div className="panel">
        <div className="tasks-toolbar">
          <div className="filter-scroll">
            {["Semua", "Planning", "In Progress", "Review", "Completed"].map(
              (x) => (
                <button
                  key={x}
                  className={filter === x ? "selected" : ""}
                  onClick={() => setFilter(x)}
                >
                  {x === "In Progress"
                    ? "Berjalan"
                    : x === "Completed"
                      ? "Selesai"
                      : x}
                </button>
              ),
            )}
          </div>
          <div className="mini-search">
            <Search size={16} />
            <input
              placeholder="Cari project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {list.length ? (
          <div className="project-grid">
            {list.map((p) => (
              <button
                className="project-card"
                key={p.id}
                onClick={() => setSelected(p.id)}
              >
                <div className="project-card-top">
                  <span className="project-avatar">✦</span>
                  <Pill
                    tone={
                      p.status === "Completed"
                        ? "completed"
                        : p.status === "Review"
                          ? "soon"
                          : "safe"
                    }
                  >
                    {p.status}
                  </Pill>
                </div>
                <h3>{p.name}</h3>
                <p>{p.description || "Belum ada deskripsi project."}</p>
                <div className="project-progress">
                  <div>
                    <span>Progress tugas</span>
                    <strong>
                      {p.tasks.filter((t) => t.done).length}/{p.tasks.length}
                    </strong>
                  </div>
                  <div className="xp-bar">
                    <div
                      style={{
                        width: `${p.tasks.length ? (p.tasks.filter((t) => t.done).length / p.tasks.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="project-card-foot">
                  <span>
                    <Users size={15} />
                    {p.members.length} anggota
                  </span>
                  <span>
                    <CalendarDays size={15} />
                    {dateLabel(p.deadline)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <Empty
            icon={<Users size={29} />}
            title={
              d.projects.length
                ? "Project tidak ditemukan"
                : "Belum ada project"
            }
            description={
              d.projects.length
                ? "Coba filter atau kata kunci lainnya."
                : "Belum ada kerja kelompok yang mengejar kamu. Nikmati dulu, atau mulai rencanakan project pertamamu."
            }
            action={
              !d.projects.length ? (
                <Button onClick={() => open()}>
                  <Plus size={16} /> Buat project
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={edit ? "Edit project" : "Buat project baru"}
        wide
      >
        <form className="form-stack" onSubmit={save}>
          <Field label="Nama project *">
            <input
              required
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Aplikasi Manajemen Kampus"
            />
          </Field>
          <Field label="Deskripsi">
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Apa yang akan dikerjakan?"
            />
          </Field>
          <div className="form-grid">
            <Field label="Mata kuliah">
              <select
                value={form.courseId || ""}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
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
                type="date"
                value={form.deadline || ""}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Field>
          </div>
          <div className="form-grid">
            <Field label="Jenis project">
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value })}
              >
                {[
                  "Group project",
                  "Research",
                  "Final project",
                  "Programming",
                  "Design",
                  "Presentation",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as Project["status"],
                  })
                }
              >
                {["Planning", "In Progress", "Review", "Completed"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Anggota tim">
            <div className="input-with-action">
              <input
                value={member}
                onChange={(e) => setMember(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (member.trim() && !form.members?.includes(member.trim()))
                      setForm((x) => ({
                        ...x,
                        members: [...(x.members || []), member.trim()],
                      }));
                    setMember("");
                  }
                }}
                placeholder="Ketik nama, lalu tambah"
              />
              <button
                type="button"
                onClick={() => {
                  if (member.trim() && !form.members?.includes(member.trim()))
                    setForm((x) => ({
                      ...x,
                      members: [...(x.members || []), member.trim()],
                    }));
                  setMember("");
                }}
              >
                <Plus size={17} />
              </button>
            </div>
          </Field>
          {!!form.members?.length && (
            <div className="chip-list">
              {form.members.map((m) => (
                <span key={m}>
                  {m}
                  <button
                    type="button"
                    aria-label={`Hapus ${m}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        members: form.members?.filter((x) => x !== m),
                      })
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <Field label="Catatan">
            <textarea
              rows={2}
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>
          <label className="file-label">
            <Paperclip size={17} />
            {form.attachment?.name || "Lampiran project (maks. 1 MB)"}
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
                const r = new FileReader();
                r.onload = () =>
                  setForm((x) => ({
                    ...x,
                    attachment: {
                      name: f.name,
                      type: f.type,
                      data: String(r.result),
                    },
                  }));
                r.readAsDataURL(f);
              }}
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <Button variant="outline" onClick={() => setModal(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan project</Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={!!project}
        onClose={() => setSelected(null)}
        title={project?.name || "Detail project"}
        wide
      >
        {project && (
          <div className="form-stack">
            <div className="project-detail-meta">
              <Pill
                tone={project.status === "Completed" ? "completed" : "safe"}
              >
                {project.status}
              </Pill>
              <span>
                <CalendarDays size={16} /> {dateLabel(project.deadline)}
              </span>
              <span>
                <BookOpen size={16} />{" "}
                {d.courses.find((c) => c.id === project.courseId)?.name ||
                  project.kind}
              </span>
            </div>
            <p className="muted">
              {project.description || "Belum ada deskripsi."}
            </p>
            <div className="project-detail-actions">
              <Button
                variant="outline"
                onClick={() => {
                  setSelected(null);
                  open(project);
                }}
              >
                <Edit2 size={16} /> Edit project
              </Button>
              <Button variant="outline" onClick={() => setDeleting(project.id)}>
                <Trash2 size={16} /> Hapus
              </Button>
              <select
                aria-label="Status project"
                value={project.status}
                onChange={(e) =>
                  updateProject({
                    ...project,
                    status: e.target.value as Project["status"],
                  })
                }
              >
                {["Planning", "In Progress", "Review", "Completed"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="divider" />
            <SectionHead
              title="Tim project"
              subtitle={`${project.members.length} anggota`}
            />
            {project.members.length ? (
              <div className="member-list">
                {project.members.map((m, i) => (
                  <span key={i}>
                    <span className="avatar avatar-sm">
                      {m.charAt(0).toUpperCase()}
                    </span>
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted">
                Belum ada anggota. Tambahkan lewat Edit project.
              </p>
            )}
            <div className="divider" />
            <SectionHead
              title="Daftar tugas"
              subtitle="Bagikan tugas ke anggota tim"
            />
            {project.tasks.length ? (
              <div className="project-task-list">
                {project.tasks.map((t) => (
                  <div key={t.id}>
                    <button
                      className={`task-check ${t.done ? "checked" : ""}`}
                      onClick={() =>
                        updateProject({
                          ...project,
                          tasks: project.tasks.map((y) =>
                            y.id === t.id ? { ...y, done: !y.done } : y,
                          ),
                        })
                      }
                    >
                      {t.done && <Check size={14} />}
                    </button>
                    <span className={t.done ? "struck" : ""}>
                      <strong>{t.title}</strong>
                      <small>
                        {t.assignee || "Belum ditugaskan"} ·{" "}
                        {dateLabel(t.deadline)} · {t.priority}
                      </small>
                    </span>
                    <button
                      aria-label={`Edit ${t.title}`}
                      onClick={() => {
                        setEditingTask(t.id);
                        setTaskName(t.title);
                        setAssignee(t.assignee);
                        setTaskDeadline(t.deadline);
                        setTaskPriority(t.priority);
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      aria-label={`Hapus ${t.title}`}
                      onClick={() =>
                        updateProject({
                          ...project,
                          tasks: project.tasks.filter((y) => y.id !== t.id),
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Belum ada tugas dalam project ini.</p>
            )}
            <div className="project-task-add">
              <input
                placeholder="Nama tugas"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <select
                aria-label="Penerima tugas"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Penanggung jawab</option>
                {project.members.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                aria-label="Deadline tugas"
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
              />
              <select
                aria-label="Prioritas tugas"
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value as ProjectTask["priority"])
                }
              >
                {["Rendah", "Sedang", "Tinggi"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <Button
                onClick={() => {
                  if (!taskName.trim()) {
                    notify("Isi nama tugas terlebih dahulu.");
                    return;
                  }
                  updateProject({
                    ...project,
                    tasks: editingTask
                      ? project.tasks.map((y) =>
                          y.id === editingTask
                            ? {
                                ...y,
                                title: taskName.trim(),
                                assignee,
                                deadline: taskDeadline,
                                priority: taskPriority,
                              }
                            : y,
                        )
                      : [
                          ...project.tasks,
                          {
                            id: uid(),
                            title: taskName.trim(),
                            assignee,
                            deadline: taskDeadline,
                            priority: taskPriority,
                            done: false,
                          },
                        ],
                  });
                  setEditingTask(null);
                  setTaskName("");
                  setAssignee("");
                  setTaskDeadline("");
                }}
              >
                <Plus size={16} /> {editingTask ? "Simpan" : "Tambah"}
              </Button>
            </div>
            {project.notes && (
              <div className="inline-info">Catatan: {project.notes}</div>
            )}
            {project.attachment && (
              <a
                className="text-link"
                href={project.attachment.data}
                download={project.attachment.name}
              >
                <Paperclip size={16} />
                {project.attachment.name}
              </a>
            )}
          </div>
        )}
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Hapus project?"
        description="Project dan semua tugas tim di dalamnya akan dihapus permanen."
        onConfirm={() => {
          update((x) => ({
            ...x,
            projects: x.projects.filter((p) => p.id !== deleting),
          }));
          setSelected(null);
          notify("Project dihapus.");
        }}
      />
    </>
  );
}
type CalendarItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  source: string;
  description: string;
};
export function CalendarPage({ go }: Go) {
  const { data, update, notify } = useApp(),
    d = data!;
  const [cursor, setCursor] = useState(new Date()),
    [view, setView] = useState<"month" | "week" | "day">("month"),
    [selected, setSelected] = useState(localDate(new Date())),
    [search, setSearch] = useState(""),
    [modal, setModal] = useState(false),
    [edit, setEdit] = useState<CalendarEvent | undefined>(),
    [form, setForm] = useState<Partial<CalendarEvent>>({
      title: "",
      date: localDate(new Date()),
      time: "",
      type: "Personal",
      description: "",
    }),
    [deleting, setDeleting] = useState<string | null>(null);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const calendarStart = new Date(first);
  calendarStart.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + i);
    return day;
  });
  const weekStart = new Date(selected + "T12:00:00");
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => {
    const t = new Date(weekStart);
    t.setDate(weekStart.getDate() + i);
    return t;
  });
  const items: CalendarItem[] = [
    ...d.calendarEvents.map((e) => ({ ...e, source: "event" })),
    ...d.assignments
      .filter((a) => a.status !== "archived")
      .map((a) => ({
        id: a.id,
        title: a.title,
        date: a.deadline.slice(0, 10),
        time: a.deadline.slice(11, 16),
        type: "Tugas",
        source: "task",
        description: a.description,
      })),
    ...d.projects.map((p) => ({
      id: p.id,
      title: p.name,
      date: p.deadline.slice(0, 10),
      time: "",
      type: "Project",
      source: "project",
      description: p.description,
    })),
    ...d.schedule.flatMap((s) =>
      [
        ...new Map(
          [...cells, ...week, new Date(selected + "T12:00:00")]
            .filter((day) => day.getDay() === s.day)
            .map((day) => [localDate(day), day]),
        ).values(),
      ].map((day) => ({
        id: s.id + "-" + localDate(day),
        title: d.courses.find((c) => c.id === s.courseId)?.name || "Kelas",
        date: localDate(day),
        time: s.startTime,
        type: "Kelas",
        source: "schedule",
        description: s.room,
      })),
    ),
  ].filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));
  const shown = items
    .filter((x) => x.date === selected)
    .sort((a, b) => a.time.localeCompare(b.time));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.date) return;
    const item = {
      ...form,
      id: edit?.id || uid(),
      title: form.title.trim(),
    } as CalendarEvent;
    update((x) => ({
      ...x,
      calendarEvents: edit
        ? x.calendarEvents.map((y) => (y.id === item.id ? item : y))
        : [...x.calendarEvents, item],
    }));
    notify(edit ? "Event diperbarui." : "Event ditambahkan.");
    setModal(false);
  };
  const open = (ev?: CalendarEvent) => {
    setEdit(ev);
    setForm(
      ev || {
        title: "",
        date: selected,
        time: "",
        type: "Personal",
        description: "",
      },
    );
    setModal(true);
  };
  const move = (n: number) => {
    const date = new Date(cursor);
    date.setMonth(date.getMonth() + n);
    setCursor(date);
  };
  return (
    <>
      <PageHeading
        eyebrow="SEMUA DALAM SATU KALENDER"
        title="Kalender akademik"
        description="Kelas, deadline, project, dan momen pentingmu. Sekilas langsung jelas."
        action={
          <Button onClick={() => open()}>
            <Plus size={17} /> Tambah event
          </Button>
        }
      />
      <div className="calendar-layout">
        <div className="panel calendar-panel">
          <div className="calendar-top">
            <div className="calendar-month">
              <button aria-label="Bulan sebelumnya" onClick={() => move(-1)}>
                <ChevronLeft size={20} />
              </button>
              <h2>
                {cursor.toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button aria-label="Bulan berikutnya" onClick={() => move(1)}>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="segmented">
              {(["month", "week", "day"] as const).map((x) => (
                <button
                  key={x}
                  className={view === x ? "selected" : ""}
                  onClick={() => setView(x)}
                >
                  {x === "month" ? "Bulan" : x === "week" ? "Minggu" : "Hari"}
                </button>
              ))}
            </div>
          </div>
          <div className="calendar-search">
            <Search size={16} />
            <input
              placeholder="Cari event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {view === "day" ? (
            <div className="calendar-day-view">
              <h3>{dateLabel(selected)}</h3>
              {shown.length ? (
                shown.map((x) => (
                  <div className="event-row" key={x.source + x.id}>
                    <span
                      className={`event-dot type-${x.type.toLowerCase()}`}
                    />
                    <strong>{x.title}</strong>
                    <small>{x.time || "Sepanjang hari"}</small>
                    <Pill>{x.type}</Pill>
                  </div>
                ))
              ) : (
                <Empty
                  compact
                  title="Hari yang lapang"
                  description="Tidak ada agenda pada tanggal ini."
                />
              )}
            </div>
          ) : (
            <div className="calendar-grid">
              <div className="calendar-weekdays">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <div className="calendar-cells">
                {(view === "month" ? cells : week).map((day, i) => {
                  const key = localDate(day),
                    events = items.filter((x) => x.date === key);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(key)}
                      className={`calendar-cell ${day.getMonth() !== cursor.getMonth() && view === "month" ? "outside" : ""} ${key === selected ? "selected" : ""} ${key === localDate(new Date()) ? "current" : ""}`}
                    >
                      <span className="cell-day">{day.getDate()}</span>
                      <span className="cell-events">
                        {events.slice(0, 2).map((ev, j) => (
                          <span
                            key={j}
                            className={`cell-event type-${ev.type.toLowerCase()}`}
                          >
                            {ev.title}
                          </span>
                        ))}
                        {events.length > 2 && (
                          <small>+{events.length - 2} lainnya</small>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <aside className="panel calendar-aside">
          <SectionHead
            title={dateLabel(selected)}
            subtitle={`${shown.length} agenda hari ini`}
          />
          {shown.length ? (
            <div className="agenda-list">
              {shown.map((x) => (
                <div className="agenda-item" key={x.source + x.id}>
                  <span
                    className={`agenda-line type-${x.type.toLowerCase()}`}
                  />
                  <div>
                    <small>
                      {x.time || "Sepanjang hari"} · {x.type}
                    </small>
                    <strong>{x.title}</strong>
                    {x.description && <p>{x.description}</p>}
                    {x.source === "event" && (
                      <div className="row-actions">
                        <button
                          aria-label="Edit event"
                          onClick={() =>
                            open(d.calendarEvents.find((e) => e.id === x.id))
                          }
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          aria-label="Hapus event"
                          onClick={() => setDeleting(x.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              compact
              title="Belum ada agenda"
              description="Tambahkan event atau pilih tanggal lain."
              action={
                <Button variant="outline" onClick={() => open()}>
                  <Plus size={15} /> Tambah event
                </Button>
              }
            />
          )}
          <div className="calendar-legend">
            <span>
              <i className="type-kelas" /> Kelas
            </span>
            <span>
              <i className="type-tugas" /> Tugas
            </span>
            <span>
              <i className="type-project" /> Project
            </span>
            <span>
              <i className="type-personal" /> Event
            </span>
          </div>
        </aside>
      </div>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={edit ? "Edit event" : "Tambah event"}
      >
        <form className="form-stack" onSubmit={save}>
          <Field label="Judul event *">
            <input
              required
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Seminar kampus"
            />
          </Field>
          <div className="form-grid">
            <Field label="Tanggal *">
              <input
                required
                type="date"
                value={form.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Waktu">
              <input
                type="time"
                value={form.time || ""}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Jenis">
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as CalendarEvent["type"],
                })
              }
            >
              {["Ujian", "Presentasi", "Personal", "Lainnya"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Deskripsi">
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>
          <div className="form-actions">
            <Button variant="outline" onClick={() => setModal(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan event</Button>
          </div>
        </form>
      </Modal>
      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Hapus event?"
        description="Event ini akan dihapus permanen."
        onConfirm={() => {
          update((x) => ({
            ...x,
            calendarEvents: x.calendarEvents.filter((e) => e.id !== deleting),
          }));
          notify("Event dihapus.");
        }}
      />
    </>
  );
}
