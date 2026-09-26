"use client";
import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  GraduationCap,
  FileUp,
  History,
  ArrowRight,
  Check,
  Trash2,
  Info,
  AlertTriangle,
  FileText,
  UploadCloud,
  CalendarDays,
  Edit2,
  ChartNoAxesColumn,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp, unlock, addNotice } from "./Provider";
import {
  Button,
  Field,
  PageHeading,
  Empty,
  SectionHead,
  Pill,
  Confirm,
} from "./UI";
import { uid, days, gradeMap, Course, Schedule } from "@/lib/types";
import {
  academics,
  formatGpa,
  dateLabel,
  detectConflicts,
  gradePoint,
} from "@/lib/logic";
import { documentUploadService, KRSRow, KHSRow } from "@/lib/documents";
type Go = { go: (s: string) => void };
const newKRS = (): KRSRow => ({
  id: uid(),
  code: "",
  name: "",
  sks: 3,
  lecturer: "",
  className: "",
  day: 1,
  startTime: "",
  endTime: "",
  room: "",
  confirmed: false,
});
const newKHS = (): KHSRow => ({
  id: uid(),
  code: "",
  name: "",
  sks: 3,
  grade: "A",
  gradePoint: 4,
  confirmed: false,
});
export function AcademicPage({ go }: Go) {
  const { data } = useApp(),
    d = data!,
    a = academics(d);
  const latest = a.history.at(-1);
  return (
    <>
      <PageHeading
        eyebrow="ANGKA YANG PUNYA CERITA"
        title="Ruang akademik"
        description="Pantau progres belajarmu. Semua angka di sini berasal dari data yang kamu simpan sendiri."
      />
      <div className="academic-hero">
        <div>
          <span className="eyebrow">PROGRES AKADEMIKMU</span>
          <h2>
            Setiap semester,
            <br />
            satu langkah maju.
          </h2>
          <p>
            {a.history.length
              ? `${a.history.length} semester tercatat. Lihat seberapa jauh kamu sudah berjalan.`
              : "Belum ada nilai yang tercatat. Mulai dari KRS atau KHS pertamamu."}
          </p>
          <Button variant="secondary" onClick={() => go("/academic/history")}>
            Lihat riwayat <ArrowRight size={16} />
          </Button>
        </div>
        <div className="academic-hero-decor">✦</div>
      </div>
      <div className="academic-stats">
        <div className="panel">
          <span>
            IPS {latest ? `Semester ${latest.semester}` : "semester ini"}
          </span>
          <strong>{formatGpa(latest?.ips)}</strong>
          <small>
            {latest ? `${latest.sks} SKS dinilai` : "Belum ada data KHS"}
          </small>
        </div>
        <div className="panel">
          <span>IPK kumulatif</span>
          <strong>{formatGpa(a.ipk)}</strong>
          <small>
            {a.history.length
              ? `${a.history.length} semester tercatat${(d.completedSemesters || []).length < a.history.length ? " · sementara" : ""}`
              : "Belum ada data KHS"}
          </small>
        </div>
        <div className="panel">
          <span>Total SKS selesai</span>
          <strong>{a.totalSks}</strong>
          <small>Dari KHS yang dikonfirmasi</small>
        </div>
        <div className="panel">
          <span>SKS semester berjalan</span>
          <strong>{a.semesterSks}</strong>
          <small>Dari mata kuliah yang ditambahkan</small>
        </div>
      </div>
      <div className="academic-links">
        <button className="academic-link" onClick={() => go("/academic/krs")}>
          <span className="link-icon icon-lavender">
            <BookOpen size={24} />
          </span>
          <span>
            <strong>KRS Analyzer</strong>
            <small>Review KRS, buat jadwal otomatis</small>
            <em>
              {d.krs.length
                ? `${d.krs.length} mata kuliah tercatat`
                : "Belum ada KRS"}
            </em>
          </span>
          <ArrowRight size={20} />
        </button>
        <button className="academic-link" onClick={() => go("/academic/khs")}>
          <span className="link-icon icon-peach">
            <GraduationCap size={24} />
          </span>
          <span>
            <strong>KHS Analyzer</strong>
            <small>Review nilai, hitung IPS & IPK</small>
            <em>
              {d.khs.length
                ? `${d.khs.length} nilai tercatat`
                : "Belum ada KHS"}
            </em>
          </span>
          <ArrowRight size={20} />
        </button>
        <button
          className="academic-link"
          onClick={() => go("/academic/history")}
        >
          <span className="link-icon icon-mint">
            <History size={24} />
          </span>
          <span>
            <strong>Riwayat akademik</strong>
            <small>Perjalananmu dari semester ke semester</small>
            <em>
              {a.history.length
                ? `${a.history.length} semester`
                : "Belum ada riwayat"}
            </em>
          </span>
          <ArrowRight size={20} />
        </button>
      </div>
      <div className="panel insights-panel">
        <SectionHead
          title="Insights untukmu"
          subtitle="Hanya dari data yang benar-benar ada"
        />
        {a.history.length || d.assignments.length ? (
          <div className="insight-list">
            {a.history.length >= 2 && (
              <div>
                <span>📈</span> IPS semester terakhir{" "}
                {a.history.at(-1)!.ips > a.history.at(-2)!.ips
                  ? "meningkat"
                  : a.history.at(-1)!.ips < a.history.at(-2)!.ips
                    ? "menurun"
                    : "tetap"}{" "}
                dibanding semester sebelumnya.
              </div>
            )}
            {a.history.length > 0 && (
              <div>
                <span>🎓</span> Kamu sudah menyelesaikan {a.totalSks} SKS dari{" "}
                {a.history.length} semester yang tercatat.
              </div>
            )}
            {d.assignments.filter(
              (t) =>
                t.status === "open" &&
                new Date(t.deadline).getTime() - Date.now() < 7 * 86400000 &&
                new Date(t.deadline).getTime() > Date.now(),
            ).length > 0 && (
              <div>
                <span>⏳</span> Ada{" "}
                {
                  d.assignments.filter(
                    (t) =>
                      t.status === "open" &&
                      new Date(t.deadline).getTime() - Date.now() <
                        7 * 86400000 &&
                      new Date(t.deadline).getTime() > Date.now(),
                  ).length
                }{" "}
                tugas yang jatuh tempo dalam 7 hari.
              </div>
            )}
          </div>
        ) : (
          <Empty
            compact
            title="Insights akan muncul di sini"
            description="Tambahkan data akademik atau tugas untuk membuka insight yang relevan."
          />
        )}
      </div>
    </>
  );
}
export function KRSPage({ go }: Go) {
  const { data, update, reward, notify } = useApp(),
    d = data!;
  const [rows, setRows] = useState<KRSRow[]>([]),
    [hasDocument, setHasDocument] = useState(false),
    [semester, setSemester] = useState(d.profile.semester),
    [year, setYear] = useState(d.profile.academicYear),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [stage, setStage] = useState<"review" | "preview">("review"),
    [error, setError] = useState("");
  const change = (id: string, patch: Partial<KRSRow>) =>
    setRows((x) => x.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const existing = d.schedule.map((s) => ({
    day: s.day,
    startTime: s.startTime,
    endTime: s.endTime,
    name: d.courses.find((c) => c.id === s.courseId)?.name || "Kelas",
  }));
  const conflicts = detectConflicts([
    ...existing,
    ...rows
      .filter((r) => r.startTime && r.endTime)
      .map((r) => ({
        day: Number(r.day),
        startTime: r.startTime,
        endTime: r.endTime,
        name: r.name,
      })),
  ]);
  const process = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setProgress(0);
    setError("");
    setStage("review");
    try {
      const result = await documentUploadService.extract(f, setProgress);
      const found = documentUploadService.parseKRS(result.text);
      setHasDocument(true);
      setRows(found);
      setMessage(
        `${result.message}${found.length ? ` ${found.length} baris terdeteksi; pastikan semua detail sudah benar.` : " Tidak ada baris terdeteksi otomatis; isi formulir manual."}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dokumen tidak bisa dibaca.");
    } finally {
      setBusy(false);
    }
  };
  const validate = () => {
    if (
      !year.trim() ||
      !Number.isInteger(Number(semester)) ||
      Number(semester) < 1
    ) {
      setError("Isi semester dan tahun akademik yang benar.");
      return false;
    }
    if (!rows.length) {
      setError("Tambahkan minimal satu mata kuliah.");
      return false;
    }
    if (
      rows.some(
        (r) =>
          !r.name.trim() || !r.code.trim() || !r.sks || r.sks < 1 || r.sks > 12,
      )
    ) {
      setError("Lengkapi nama, kode, dan SKS (1–12) di semua baris.");
      return false;
    }
    if (
      rows.some(
        (r) =>
          !!r.startTime != !!r.endTime ||
          (r.startTime && r.endTime && r.startTime >= r.endTime),
      )
    ) {
      setError("Periksa waktu mulai dan selesai pada setiap jadwal.");
      return false;
    }
    setError("");
    return true;
  };
  const confirm = () => {
    if (!validate()) return;
    const withSchedule = rows.filter((r) => r.startTime && r.endTime).length;
    update((x) => {
      const courses = [...x.courses],
        schedule = [...x.schedule],
        krs = [...x.krs];
      for (const r of rows) {
        let c = courses.find(
          (y) =>
            y.code.toLowerCase() === r.code.trim().toLowerCase() &&
            y.semester === Number(semester),
        );
        if (!c) {
          c = {
            id: uid(),
            name: r.name.trim(),
            code: r.code.trim(),
            sks: Number(r.sks),
            lecturer: r.lecturer.trim(),
            semester: Number(semester),
            notes: "",
          };
          courses.push(c);
        } else {
          courses[courses.indexOf(c)] = {
            ...c,
            name: r.name.trim(),
            sks: Number(r.sks),
            lecturer: r.lecturer.trim(),
          };
        }
        if (
          !krs.some(
            (y) =>
              y.courseId === c!.id &&
              y.academicYear === year &&
              y.semester === Number(semester),
          )
        )
          krs.push({
            id: uid(),
            courseId: c.id,
            academicYear: year,
            semester: Number(semester),
          });
        if (
          r.startTime &&
          r.endTime &&
          !schedule.some(
            (y) =>
              y.courseId === c!.id &&
              y.day === Number(r.day) &&
              y.startTime === r.startTime,
          )
        ) {
          schedule.push({
            id: uid(),
            courseId: c.id,
            day: Number(r.day),
            startTime: r.startTime,
            endTime: r.endTime,
            room: r.room.trim(),
            className: r.className.trim(),
            notes: "",
          });
        }
      }
      let next = { ...x, courses, schedule, krs };
      if (schedule.length && !x.schedule.length)
        next = unlock(next, "schedule-master");
      return next;
    });
    reward(30, "KRS disimpan");
    notify(
      `KRS dikonfirmasi. ${rows.length} mata kuliah dan ${withSchedule} jadwal tersimpan. +30 XP`,
    );
    setRows([]);
    setHasDocument(false);
    setMessage("");
    setStage("review");
  };
  return (
    <>
      <PageHeading
        eyebrow="DOKUMEN AKADEMIK · KRS"
        title="KRS Analyzer"
        description="Baca KRS lokal, periksa hasilnya, lalu buat jadwal mingguanmu."
        action={
          <Button variant="outline" onClick={() => go("/academic")}>
            <ArrowRight size={16} /> Ruang akademik
          </Button>
        }
      />
      <div className="privacy-note">
        <ShieldCheck size={20} />
        <div>
          <strong>Dokumenmu tetap milikmu.</strong>
          <span>
            PDF dan gambar dibaca di browser ini. Dokumen tidak dikirim ke
            server atau disimpan setelah diproses. Cek semua hasil sebelum
            konfirmasi.
          </span>
        </div>
      </div>
      <div className="panel upload-panel">
        <div className="upload-drop">
          <div className="upload-icon">
            <UploadCloud size={27} />
          </div>
          <h3>Upload KRS kamu</h3>
          <p>
            PDF berbasis teks dan JPG/PNG dicoba dibaca secara lokal. Scan PDF
            dapat diisi manual.
          </p>
          <label className="btn btn-primary">
            {busy
              ? `Sedang membaca${progress ? " · " + progress + "%" : ""}...`
              : "Pilih dokumen KRS"}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              hidden
              disabled={busy}
              onChange={(e) => {
                process(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <small>PDF, JPG, PNG · maks. 8 MB</small>
        </div>
      </div>
      {message && (
        <div className="inline-info">
          <Info size={18} />
          {message}
        </div>
      )}
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <div className="panel review-panel">
        <SectionHead
          title={
            stage === "preview"
              ? "Schedule Preview"
              : "KRS yang berhasil dibaca"
          }
          subtitle={
            stage === "preview"
              ? "Periksa jadwal sebelum menyimpan. Konflik tidak otomatis diselesaikan."
              : "Edit, hapus, atau tambah baris sebelum menyimpan ke akunmu."
          }
          action={
            stage === "review" && hasDocument ? (
              <Button
                variant="outline"
                onClick={() => setRows((x) => [...x, newKRS()])}
              >
                <Plus size={16} /> Tambah manual
              </Button>
            ) : stage === "preview" ? (
              <Button variant="outline" onClick={() => setStage("review")}>
                Kembali edit
              </Button>
            ) : undefined
          }
        />
        <div className="form-grid academic-meta">
          <Field label="Semester">
            <input
              type="number"
              min="1"
              max="20"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            />
          </Field>
          <Field label="Tahun akademik">
            <input
              placeholder="2026/2027"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Field>
        </div>
        {rows.length ? (
          stage === "review" ? (
            <div className="review-rows">
              {rows.map((r, i) => (
                <div className="review-row" key={r.id}>
                  <div className="review-row-head">
                    <strong>Mata kuliah {i + 1}</strong>
                    <button
                      className="delete-text"
                      onClick={() =>
                        setRows((x) => x.filter((y) => y.id !== r.id))
                      }
                    >
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                  <div className="form-grid">
                    <Field label="Kode *">
                      <input
                        value={r.code}
                        onChange={(e) => change(r.id, { code: e.target.value })}
                        placeholder="IF301"
                      />
                    </Field>
                    <Field label="Nama mata kuliah *">
                      <input
                        value={r.name}
                        onChange={(e) => change(r.id, { name: e.target.value })}
                        placeholder="Nama mata kuliah"
                      />
                    </Field>
                  </div>
                  <div className="form-grid three">
                    <Field label="SKS *">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={r.sks}
                        onChange={(e) =>
                          change(r.id, { sks: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <Field label="Dosen">
                      <input
                        value={r.lecturer}
                        onChange={(e) =>
                          change(r.id, { lecturer: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Kelas">
                      <input
                        value={r.className}
                        onChange={(e) =>
                          change(r.id, { className: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <div className="form-grid four">
                    <Field label="Hari">
                      <select
                        value={r.day}
                        onChange={(e) =>
                          change(r.id, { day: Number(e.target.value) })
                        }
                      >
                        {days.map((x, n) => (
                          <option key={n} value={n}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Mulai">
                      <input
                        type="time"
                        value={r.startTime}
                        onChange={(e) =>
                          change(r.id, { startTime: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Selesai">
                      <input
                        type="time"
                        value={r.endTime}
                        onChange={(e) =>
                          change(r.id, { endTime: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Ruang">
                      <input
                        value={r.room}
                        onChange={(e) => change(r.id, { room: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="preview-list">
              {rows.map((r) => (
                <div key={r.id}>
                  <span className="preview-day">
                    {r.startTime ? days[r.day] : "Tanpa jadwal"}
                  </span>
                  <strong>{r.name}</strong>
                  <small>
                    {r.code} · {r.sks} SKS ·{" "}
                    {r.startTime
                      ? `${r.startTime}–${r.endTime} · ${r.room || "Ruang belum diisi"}`
                      : "Waktu tidak tercantum, jadwal tidak dibuat"}
                  </small>
                </div>
              ))}
              {conflicts.length > 0 && (
                <div className="conflict-warning">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Potential schedule conflict</strong>
                    <p>{conflicts.join(" · ")}</p>
                    <small>
                      Kembali dan ubah jadwal untuk mengatasinya, atau lanjutkan
                      jika konflik ini memang benar.
                    </small>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <Empty
            compact
            icon={<BookOpen size={28} />}
            title={hasDocument ? "Belum ada baris terdeteksi" : "Belum ada KRS"}
            description={
              hasDocument
                ? "Kami belum bisa membaca baris KRS. Tambahkan baris secara manual dari dokumenmu sebelum konfirmasi."
                : "Upload KRS untuk membuat jadwal otomatis. Untuk mata kuliah manual, gunakan halaman Jadwal."
            }
            action={
              <Button
                onClick={() =>
                  hasDocument ? setRows([newKRS()]) : go("/schedule")
                }
              >
                <Plus size={16} />{" "}
                {hasDocument
                  ? "Tambah baris dari KRS"
                  : "Tambah mata kuliah manual"}
              </Button>
            }
          />
        )}
        {rows.length > 0 && (
          <div className="form-actions">
            {stage === "review" ? (
              <Button
                onClick={() => {
                  if (validate()) setStage("preview");
                }}
              >
                Lihat preview jadwal <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={confirm}>
                <Check size={16} /> Konfirmasi semua & simpan
              </Button>
            )}
          </div>
        )}
      </div>
      {d.krs.length > 0 && (
        <div className="panel saved-records">
          <SectionHead
            title="KRS tersimpan"
            subtitle={`${d.krs.length} mata kuliah yang sudah kamu konfirmasi`}
          />
          <div className="saved-list">
            {d.krs.map((r) => (
              <div key={r.id}>
                <BookOpen size={17} />
                <span>
                  <strong>
                    {d.courses.find((c) => c.id === r.courseId)?.name ||
                      "Mata kuliah"}
                  </strong>
                  <small>
                    Semester {r.semester} · {r.academicYear}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
export function KHSPage({ go }: Go) {
  const { data, update, reward, notify } = useApp(),
    d = data!;
  const [rows, setRows] = useState<KHSRow[]>([]),
    [semester, setSemester] = useState(d.profile.semester),
    [year, setYear] = useState(d.profile.academicYear),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [preview, setPreview] = useState(false),
    [markComplete, setMarkComplete] = useState(false),
    [error, setError] = useState("");
  const change = (id: string, patch: Partial<KHSRow>) =>
    setRows((x) => x.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const sks = rows.reduce((n, r) => n + Number(r.sks || 0), 0),
    weighted = rows.reduce(
      (n, r) => n + Number(r.sks || 0) * Number(r.gradePoint || 0),
      0,
    );
  const process = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setProgress(0);
    setError("");
    setPreview(false);
    try {
      const result = await documentUploadService.extract(f, setProgress);
      const found = documentUploadService.parseKHS(result.text);
      setRows(found);
      setMessage(
        `${result.message}${found.length ? ` ${found.length} baris terdeteksi; cek nilai dan bobotnya.` : " Tidak ada baris terdeteksi otomatis; isi formulir manual."}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dokumen tidak bisa dibaca.");
    } finally {
      setBusy(false);
    }
  };
  const validate = () => {
    if (
      !year.trim() ||
      !Number.isInteger(Number(semester)) ||
      Number(semester) < 1
    ) {
      setError("Isi semester dan tahun akademik yang benar.");
      return false;
    }
    if (!rows.length) {
      setError("Tambahkan minimal satu mata kuliah.");
      return false;
    }
    if (
      rows.some(
        (r) =>
          !r.code.trim() ||
          !r.name.trim() ||
          !r.sks ||
          r.sks < 1 ||
          r.sks > 12 ||
          r.gradePoint < 0 ||
          r.gradePoint > 4,
      )
    ) {
      setError(
        "Periksa kode, nama, SKS (1–12), dan bobot nilai (0–4) setiap baris.",
      );
      return false;
    }
    if (
      new Set(rows.map((r) => r.code.trim().toLowerCase())).size !== rows.length
    ) {
      setError("Ada kode mata kuliah duplikat. Periksa kembali.");
      return false;
    }
    setError("");
    return true;
  };
  const confirm = () => {
    if (!validate()) return;
    update((x) => {
      const newRecords = rows.map((r) => ({
        id: uid(),
        semester: Number(semester),
        academicYear: year.trim(),
        code: r.code.trim(),
        name: r.name.trim(),
        sks: Number(r.sks),
        grade: r.grade,
        gradePoint: Number(r.gradePoint),
      }));
      const codes = new Set(newRecords.map((r) => r.code.toLowerCase()));
      let y = {
        ...x,
        khs: [
          ...x.khs.filter(
            (r) =>
              !(
                r.semester === Number(semester) &&
                r.academicYear === year.trim() &&
                codes.has(r.code.toLowerCase())
              ),
          ),
          ...newRecords,
        ],
        completedSemesters: markComplete
          ? [
              ...new Set([
                ...(x.completedSemesters || []),
                `${semester}|${year.trim()}`,
              ]),
            ]
          : x.completedSemesters || [],
      };
      if (!x.khs.length) y = unlock(y, "academic-starter");
      if (markComplete) y = unlock(y, "semester-complete");
      return y;
    });
    reward(40, "KHS disimpan");
    notify(
      `KHS disimpan. IPS semester ${semester}: ${(weighted / sks).toFixed(2)} · +40 XP`,
    );
    setRows([]);
    setMarkComplete(false);
    setMessage("");
    setPreview(false);
  };
  return (
    <>
      <PageHeading
        eyebrow="DOKUMEN AKADEMIK · KHS"
        title="KHS Analyzer"
        description="Masukkan nilaimu, cek bobotnya, dan lihat IPS dihitung dengan transparan."
      />
      <div className="privacy-note">
        <ShieldCheck size={20} />
        <div>
          <strong>Privasi akademikmu penting.</strong>
          <span>
            PDF dan gambar dibaca secara lokal. File tidak dikirim atau
            disimpan. Nilai baru tersimpan setelah kamu mengonfirmasi.
          </span>
        </div>
      </div>
      <div className="panel upload-panel">
        <div className="upload-drop">
          <div className="upload-icon">
            <UploadCloud size={27} />
          </div>
          <h3>Upload KHS kamu</h3>
          <p>
            PDF berbasis teks dan foto dicoba dibaca lokal. Untuk scan PDF, isi
            manual.
          </p>
          <label className="btn btn-primary">
            {busy
              ? `Sedang membaca${progress ? " · " + progress + "%" : ""}...`
              : "Pilih dokumen KHS"}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              hidden
              disabled={busy}
              onChange={(e) => {
                process(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <small>PDF, JPG, PNG · maks. 8 MB</small>
        </div>
      </div>
      {message && (
        <div className="inline-info">
          <Info size={18} />
          {message}
        </div>
      )}
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <div className="panel review-panel">
        <SectionHead
          title={
            preview ? "Preview perhitungan IPS" : "Nilai yang berhasil dibaca"
          }
          subtitle={
            preview
              ? "IPS = Σ(SKS × bobot nilai) / Σ(SKS)"
              : "Periksa setiap nilai dan bobotnya sebelum disimpan."
          }
          action={
            preview ? (
              <Button variant="outline" onClick={() => setPreview(false)}>
                Kembali edit
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setRows((x) => [...x, newKHS()])}
              >
                <Plus size={16} /> Tambah manual
              </Button>
            )
          }
        />
        <div className="form-grid academic-meta">
          <Field label="Semester">
            <input
              type="number"
              min="1"
              max="20"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            />
          </Field>
          <Field label="Tahun akademik">
            <input
              placeholder="2026/2027"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Field>
        </div>
        {rows.length ? (
          preview ? (
            <div className="khs-preview">
              <div className="calculation-banner">
                <span>IPS Semester {semester}</span>
                <strong>{sks ? (weighted / sks).toFixed(2) : "—"}</strong>
                <small>
                  {weighted.toFixed(2)} total bobot ÷ {sks} SKS
                </small>
              </div>
              <div className="calc-table">
                <div className="calc-head">
                  <span>Mata kuliah</span>
                  <span>SKS</span>
                  <span>Nilai</span>
                  <span>Bobot</span>
                  <span>SKS × Bobot</span>
                </div>
                {rows.map((r) => (
                  <div key={r.id}>
                    <span>
                      {r.name}
                      <small>{r.code}</small>
                    </span>
                    <span>{r.sks}</span>
                    <span>{r.grade}</span>
                    <span>{Number(r.gradePoint).toFixed(2)}</span>
                    <strong>
                      {(Number(r.sks) * Number(r.gradePoint)).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="review-rows">
              {rows.map((r, i) => (
                <div className="review-row" key={r.id}>
                  <div className="review-row-head">
                    <strong>Mata kuliah {i + 1}</strong>
                    <button
                      className="delete-text"
                      onClick={() =>
                        setRows((x) => x.filter((y) => y.id !== r.id))
                      }
                    >
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                  <div className="form-grid">
                    <Field label="Kode *">
                      <input
                        value={r.code}
                        onChange={(e) => change(r.id, { code: e.target.value })}
                        placeholder="IF301"
                      />
                    </Field>
                    <Field label="Nama mata kuliah *">
                      <input
                        value={r.name}
                        onChange={(e) => change(r.id, { name: e.target.value })}
                        placeholder="Nama mata kuliah"
                      />
                    </Field>
                  </div>
                  <div className="form-grid three">
                    <Field label="SKS *">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={r.sks}
                        onChange={(e) =>
                          change(r.id, { sks: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <Field label="Nilai">
                      <select
                        value={r.grade}
                        onChange={(e) =>
                          change(r.id, {
                            grade: e.target.value,
                            gradePoint: gradePoint(e.target.value),
                          })
                        }
                      >
                        {Object.keys(gradeMap).map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Bobot nilai (bisa dikoreksi)">
                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={r.gradePoint}
                        onChange={(e) =>
                          change(r.id, { gradePoint: Number(e.target.value) })
                        }
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <Empty
            compact
            icon={<GraduationCap size={28} />}
            title="Belum ada data KHS"
            description="Upload KHS atau tambahkan nilai manual untuk menghitung IPS semester."
            action={
              <Button onClick={() => setRows([newKHS()])}>
                <Plus size={16} /> Tambah nilai manual
              </Button>
            }
          />
        )}
        {rows.length > 0 && (
          <label className="check-label semester-complete-check">
            <input
              type="checkbox"
              checked={markComplete}
              onChange={(e) => setMarkComplete(e.target.checked)}
            />{" "}
            Saya sudah memasukkan semua nilai semester ini. Tandai semester
            lengkap.
          </label>
        )}
        {rows.length > 0 && (
          <div className="form-actions">
            {preview ? (
              <Button onClick={confirm}>
                <Check size={16} /> Konfirmasi nilai & simpan
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (validate()) setPreview(true);
                }}
              >
                Lihat perhitungan <ArrowRight size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
      {d.khs.length > 0 && (
        <div className="panel saved-records">
          <SectionHead
            title="Nilai tersimpan"
            action={
              <Button variant="outline" onClick={() => go("/academic/history")}>
                Lihat riwayat <ArrowRight size={15} />
              </Button>
            }
          />
          <div className="saved-list">
            {d.khs.slice(-8).map((r) => (
              <div key={r.id}>
                <GraduationCap size={17} />
                <span>
                  <strong>{r.name}</strong>
                  <small>
                    {r.code} · Semester {r.semester} · {r.sks} SKS
                  </small>
                </span>
                <Pill tone="safe">{r.grade}</Pill>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
export function HistoryPage({ go }: Go) {
  const { data } = useApp(),
    d = data!,
    a = academics(d);
  let cumulativeSks = 0,
    cumulativePoints = 0;
  return (
    <>
      <PageHeading
        eyebrow="PERJALANAN AKADEMIK"
        title="Riwayat akademik"
        description="Semua semester yang sudah kamu catat. Tidak ada angka yang dibuat-buat."
        action={
          <Button onClick={() => go("/academic/khs")}>
            <Plus size={16} /> Tambah KHS
          </Button>
        }
      />
      {!a.history.length ? (
        <div className="panel">
          <Empty
            icon={<History size={29} />}
            title="Belum ada riwayat akademik"
            description="Data IPS dan IPK akan muncul setelah kamu memasukkan dan mengonfirmasi data KHS."
            action={
              <Button onClick={() => go("/academic/khs")}>
                <FileUp size={16} /> Upload KHS
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="history-top">
            <div className="panel">
              <span>IPK saat ini</span>
              <strong>{formatGpa(a.ipk)}</strong>
              <small>
                Dari {a.totalSks} SKS yang dicatat
                {(d.completedSemesters || []).length < a.history.length
                  ? " · IPK sementara"
                  : ""}
              </small>
            </div>
            <div className="panel">
              <span>Semester tercatat</span>
              <strong>{a.history.length}</strong>
              <small>
                {d.profile.degree} · {d.profile.major}
              </small>
            </div>
            <div className="panel">
              <span>Total SKS selesai</span>
              <strong>{a.totalSks}</strong>
              <small>Dihitung dari nilai yang dikonfirmasi</small>
            </div>
          </div>
          <div className="panel chart-panel">
            <SectionHead
              title="Perjalanan IPS & IPK"
              subtitle="Perkembangan dari semester ke semester"
            />
            <div className="chart-legend">
              <span>
                <i className="ips-color" /> IPS
              </span>
              <span>
                <i className="ipk-color" /> IPK
              </span>
            </div>
            <div className="chart-bars">
              {a.history.map((h) => {
                cumulativeSks += h.sks;
                cumulativePoints += h.points;
                return (
                  <div className="chart-group" key={h.key}>
                    <div className="chart-columns">
                      <div
                        style={{ height: `${Math.max(5, (h.ips / 4) * 100)}%` }}
                        className="ips-bar"
                        title={`IPS ${h.ips.toFixed(2)}`}
                      />
                      <div
                        style={{
                          height: `${Math.max(5, (cumulativePoints / cumulativeSks / 4) * 100)}%`,
                        }}
                        className="ipk-bar"
                        title={`IPK ${(cumulativePoints / cumulativeSks).toFixed(2)}`}
                      />
                    </div>
                    <span>Sem {h.semester}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="history-list">
            <SectionHead title="Detail per semester" />
            {[...a.history].reverse().map((h) => (
              <div className="panel semester-card" key={h.key}>
                <div className="semester-head">
                  <div>
                    <span className="eyebrow">TAHUN AKADEMIK {h.year}</span>
                    <h3>
                      Semester {h.semester}{" "}
                      <Pill
                        tone={
                          (d.completedSemesters || []).includes(h.key)
                            ? "completed"
                            : "soon"
                        }
                      >
                        {(d.completedSemesters || []).includes(h.key)
                          ? "Lengkap"
                          : "Data parsial"}
                      </Pill>
                    </h3>
                  </div>
                  <div className="semester-numbers">
                    <span>
                      IPS <strong>{formatGpa(h.ips)}</strong>
                    </span>
                    <span>
                      SKS <strong>{h.sks}</strong>
                    </span>
                  </div>
                </div>
                <div className="calc-table">
                  <div className="calc-head">
                    <span>Mata kuliah</span>
                    <span>SKS</span>
                    <span>Nilai</span>
                    <span>Bobot</span>
                    <span>SKS × Bobot</span>
                  </div>
                  {h.records.map((r) => (
                    <div key={r.id}>
                      <span>
                        {r.name}
                        <small>{r.code}</small>
                      </span>
                      <span>{r.sks}</span>
                      <span>{r.grade}</span>
                      <span>{r.gradePoint.toFixed(2)}</span>
                      <strong>{(r.sks * r.gradePoint).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
                <div className="grade-dist">
                  {Object.entries(
                    h.records.reduce(
                      (acc, r) => ({
                        ...acc,
                        [r.grade]: (acc[r.grade] || 0) + 1,
                      }),
                      {} as Record<string, number>,
                    ),
                  ).map(([grade, count]) => (
                    <span key={grade}>
                      {grade} <strong>{count}</strong>
                    </span>
                  ))}
                </div>
                <div className="semester-formula">
                  IPS = {h.points.toFixed(2)} ÷ {h.sks} ={" "}
                  <strong>{h.ips.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
