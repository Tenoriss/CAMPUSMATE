"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  ArrowLeft,
  ShieldCheck,
  Upload,
  Check,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { useApp } from "./Provider";
import { Button, Field, PetSprite } from "./UI";
import { Pet, PetSpecies, petEmoji } from "@/lib/types";
import { universities, provinces } from "@/lib/directory";
export function LandingPage({ go }: { go: (s: string) => void }) {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-header-inner">
          <button
            className="logo"
            onClick={() => go("/")}
            aria-label="CAMPUSMATE beranda"
          >
            <span className="logo-mark">✦</span>
            <span>
              CAMPUS<span className="logo-accent">MATE</span>
            </span>
          </button>
          <nav aria-label="Navigasi situs">
            <a href="#fitur">Fitur</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#privasi">Privasi</a>
          </nav>
          <div className="landing-header-actions">
            <button className="landing-login" onClick={() => go("/login")}>
              Masuk
            </button>
            <Button variant="outline" onClick={() => go("/signup")}>
              Mulai gratis <ArrowUpRight size={15} />
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <span className="landing-badge">
              <i /> TEMAN KULIAH DIGITALMU
            </span>
            <h1>
              Kuliah lebih terarah.
              <br />
              <span>Hidup lebih tenang.</span>
            </h1>
            <p>
              Jadwal, tugas, project, dan progres akademik dalam satu tempat.
              Ruang yang kamu bangun sendiri, ditemani teman kecil yang selalu
              ada.
            </p>
            <div className="landing-hero-cta">
              <span>Mulai dengan ruang kuliah yang benar-benar milikmu</span>
              <button
                aria-label="Buat akun gratis"
                onClick={() => go("/signup")}
              >
                <ArrowUpRight size={22} />
              </button>
            </div>
            <div className="landing-hero-secondary">
              Belum perlu data contoh.{" "}
              <button onClick={() => go("/signup")}>
                Mulai dari nol <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
        <div
          className="landing-capabilities"
          aria-label="Fitur utama CAMPUSMATE"
        >
          <span>DIRANCANG UNTUK HARI-HARI KULIAHMU</span>
          <div>
            <span>Jadwal mingguan</span>
            <span>✦</span>
            <span>Deadline tugas</span>
            <span>✦</span>
            <span>KRS & KHS</span>
            <span>✦</span>
            <span>Teman belajar</span>
          </div>
        </div>
        <section className="landing-product" id="cara-kerja">
          <div className="landing-section-heading">
            <span>SEMUA DALAM SATU RUANG</span>
            <h2>
              Bukan sekadar pengingat.
              <br />
              <em>Teman perjalanan kuliahmu.</em>
            </h2>
            <p>
              Lihat yang penting hari ini, tetap dekat dengan deadline, dan
              pantau progres dari data yang memang kamu masukkan.
            </p>
          </div>
          <div
            className="product-preview"
            aria-label="Ilustrasi dashboard CAMPUSMATE untuk akun baru"
          >
            <div className="product-preview-top">
              <span>
                <i /> CAMPUSMATE
              </span>
              <span>PRATINJAU · AKUN BARU</span>
              <span>✦</span>
            </div>
            <div className="product-preview-content">
              <div className="product-preview-side">
                <span className="selected">◈ &nbsp; Beranda</span>
                <span>▤ &nbsp; Jadwal kuliah</span>
                <span>☑ &nbsp; Tugas</span>
                <span>◉ &nbsp; Akademik</span>
              </div>
              <div className="product-preview-main">
                <small>RUANG KULIAHMU / HARI INI</small>
                <h3>Mulai dengan langkah pertamamu.</h3>
                <p>
                  Isi jadwal, catat tugas, dan biarkan semuanya lebih jelas.
                </p>
                <div className="product-preview-stats">
                  <div>
                    <span>IPS</span>
                    <strong>—</strong>
                    <small>Belum ada nilai</small>
                  </div>
                  <div>
                    <span>IPK</span>
                    <strong>—</strong>
                    <small>Belum ada nilai</small>
                  </div>
                  <div>
                    <span>SKS</span>
                    <strong>0</strong>
                    <small>Belum ada matkul</small>
                  </div>
                </div>
                <div className="product-preview-empty">
                  <CalendarDays size={20} />
                  <span>
                    <strong>Belum ada jadwal kuliah</strong>
                    <small>Ruang ini akan terisi seiring perjalananmu.</small>
                  </span>
                  <span>+</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-features-section" id="fitur">
          <div className="landing-section-heading">
            <span>APA YANG KAMU DAPAT</span>
            <h2>Satu tempat. Banyak hal jadi lebih mudah.</h2>
            <p>
              Semua yang kamu butuhkan untuk tetap selangkah di depan, tanpa
              membuat harimu makin rumit.
            </p>
          </div>
          <div className="landing-features">
            <article>
              <div className="feature-icon purple">
                <CalendarDays size={23} />
              </div>
              <h3>Jadwal yang jelas</h3>
              <p>
                Tambahkan kelas manual atau review hasil KRS sebelum jadwal
                otomatis tersimpan.
              </p>
              <button onClick={() => go("/signup")}>
                Mulai atur jadwal <ArrowUpRight size={16} />
              </button>
            </article>
            <article>
              <div className="feature-icon peach">
                <Clock3 size={23} />
              </div>
              <h3>Deadline terkendali</h3>
              <p>
                Tugas dan project ada dalam satu alur. Kamu tahu apa yang harus
                dikerjakan berikutnya.
              </p>
              <button onClick={() => go("/signup")}>
                Kelola tugas <ArrowUpRight size={16} />
              </button>
            </article>
            <article>
              <div className="feature-icon mint">
                <GraduationCap size={23} />
              </div>
              <h3>Progres yang nyata</h3>
              <p>
                Hitung IPS dan IPK dari nilai KHS yang sudah kamu periksa dan
                konfirmasi sendiri.
              </p>
              <button onClick={() => go("/signup")}>
                Lihat progres <ArrowUpRight size={16} />
              </button>
            </article>
          </div>
        </section>
        <section className="landing-trust" id="privasi">
          <div className="trust-orb">✦</div>
          <div>
            <span>DATA KAMU, KENDALI KAMU</span>
            <h2>
              Ruang yang terasa
              <br />
              sepenuhnya milikmu.
            </h2>
            <p>
              Tidak ada nilai, tugas, atau jadwal yang diisi otomatis. Dokumen
              diproses di perangkatmu dan datanya baru tersimpan setelah kamu
              meninjau dan mengonfirmasi.
            </p>
            <Button onClick={() => go("/signup")}>
              Buat ruang kuliahmu <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <strong>✦ CAMPUSMATE</strong>
        <span>Semua urusan kuliah, satu tempat.</span>
        <small>MADE FOR YOUR CAMPUS JOURNEY</small>
      </footer>
    </div>
  );
}
export function AuthPage({
  mode,
  go,
}: {
  mode: "login" | "signup";
  go: (s: string) => void;
}) {
  const { signup, login } = useApp();
  const [name, setName] = useState(""),
    [nick, setNick] = useState(""),
    [email, setEmail] = useState(""),
    [pass, setPass] = useState(""),
    [confirm, setConfirm] = useState(""),
    [show, setShow] = useState(false),
    [remember, setRemember] = useState(true),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [forgot, setForgot] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    if (mode === "signup") {
      if (name.trim().length < 2 || nick.trim().length < 2) {
        setError("Nama dan panggilan minimal 2 karakter.");
        return;
      }
      if (pass.length < 8) {
        setError("Password minimal 8 karakter.");
        return;
      }
      if (pass !== confirm) {
        setError("Konfirmasi password belum cocok.");
        return;
      }
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(name, nick, email, pass);
        go("/onboarding");
      } else {
        await login(email, pass, remember);
        go("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ada masalah. Coba lagi, ya.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-layout">
      <div className="auth-side">
        <button className="logo" onClick={() => go("/")}>
          <span className="logo-mark">✦</span>
          <span>
            CAMPUS<span className="logo-accent">MATE</span>
          </span>
        </button>
        <div className="auth-side-content">
          <h2>
            Semua urusan kuliah,
            <br />
            <em>satu tempat.</em>
          </h2>
          <p>
            Jadwal tertata. Deadline terkendali. Teman kecilmu selalu ada di
            sini.
          </p>
          <div className="auth-quote">
            “Satu langkah kecil hari ini, satu semester lebih tenang besok.”
          </div>
        </div>
        <small>Made for every campus, every student. ✦</small>
      </div>
      <div className="auth-main">
        <div className="auth-mobile-logo">
          <button className="logo" onClick={() => go("/")}>
            <span className="logo-mark">✦</span>
            <span>
              CAMPUS<span className="logo-accent">MATE</span>
            </span>
          </button>
        </div>
        <div className="auth-box">
          <button className="back-link" onClick={() => go("/")}>
            <ArrowLeft size={16} /> Kembali ke beranda
          </button>
          <div className="eyebrow">
            {mode === "signup" ? "MULAI DARI SINI" : "SELAMAT DATANG LAGI"}
          </div>
          <h1>
            {mode === "signup"
              ? "Buat ruang kuliahmu."
              : "Halo, kamu kembali! 👋"}
          </h1>
          <p>
            {mode === "signup"
              ? "Sedikit perkenalan, lalu kita siap menemanimu."
              : "Masuk dan lanjutkan perjalanan kuliahmu."}
          </p>
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <div className="form-grid">
                <Field label="Nama lengkap">
                  <input
                    required
                    maxLength={80}
                    placeholder="Nama lengkapmu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Nama panggilan">
                  <input
                    required
                    maxLength={30}
                    placeholder="Biasa dipanggil?"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                  />
                </Field>
              </div>
            )}
            <Field label="Alamat email">
              <input
                required
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password">
              <div className="password-field">
                <input
                  required
                  type={show ? "text" : "password"}
                  minLength={mode === "signup" ? 8 : undefined}
                  placeholder={
                    mode === "signup"
                      ? "Minimal 8 karakter"
                      : "Masukkan password"
                  }
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={
                    show ? "Sembunyikan password" : "Tampilkan password"
                  }
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>
            {mode === "signup" ? (
              <Field label="Konfirmasi password">
                <input
                  required
                  type={show ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </Field>
            ) : (
              <div className="auth-row">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />{" "}
                  Ingat saya
                </label>
                <button type="button" onClick={() => setForgot(!forgot)}>
                  Lupa password?
                </button>
              </div>
            )}
            {forgot && mode === "login" && (
              <div className="inline-info">
                Akun ini hanya tersimpan di browser ini. Pemulihan password
                otomatis belum tersedia. Jika masih bisa masuk, ubah password
                melalui Pengaturan.
              </div>
            )}
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading} className="full">
              {loading
                ? "Sebentar..."
                : mode === "signup"
                  ? "Buat akun gratis"
                  : "Masuk ke CAMPUSMATE"}{" "}
              <ArrowRight size={17} />
            </Button>
          </form>
          <div className="auth-switch">
            {mode === "signup" ? "Sudah punya akun?" : "Baru di sini?"}{" "}
            <button
              onClick={() => go(mode === "signup" ? "/login" : "/signup")}
            >
              {mode === "signup" ? "Masuk" : "Buat akun"}
            </button>
          </div>
          <p className="auth-privacy">
            <ShieldCheck size={15} /> Data akun dan akademikmu disimpan lokal di
            browser ini. Tidak disinkronkan antar perangkat.
          </p>
        </div>
      </div>
    </div>
  );
}
const species = Object.keys(petEmoji) as PetSpecies[];
export function OnboardingPage({ go }: { go: (s: string) => void }) {
  const { data, saveOnboarding, notify } = useApp();
  const p = data!.profile;
  const [step, setStep] = useState(1),
    [form, setForm] = useState({
      name: p.name,
      nickname: p.nickname,
      avatar: "",
      province: "",
      campus: "",
      faculty: "",
      major: "",
      degree: "S1" as const,
      nim: "",
      semester: 1,
      academicYear: "",
      graduationYear: "",
    }),
    [speciesChoice, setSpecies] = useState<PetSpecies>("Cat"),
    [petName, setPetName] = useState(""),
    [error, setError] = useState(""),
    [campusQuery, setCampusQuery] = useState("");
  const set = (key: string, val: string | number) =>
    setForm((x) => ({ ...x, [key]: val }));
  const next = () => {
    setError("");
    if (step === 1 && (!form.name.trim() || !form.nickname.trim())) {
      setError("Isi nama dan panggilanmu dulu, ya.");
      return;
    }
    if (
      step === 2 &&
      (!form.province ||
        !form.campus.trim() ||
        !form.faculty.trim() ||
        !form.major.trim() ||
        !form.nim.trim() ||
        !form.academicYear.trim())
    ) {
      setError("Lengkapi informasi kampus dan akademikmu.");
      return;
    }
    if (step === 3) {
      if (!petName.trim()) {
        setError("Teman kecilmu butuh nama!");
        return;
      }
      const pet: Pet = {
        species: speciesChoice,
        name: petName.trim(),
        xp: 0,
        accessories: [],
        equipped: "",
      };
      saveOnboarding({ ...form, onboarded: true }, pet);
      notify(`Selamat datang di CAMPUSMATE, ${form.nickname}!`);
      go("/dashboard");
      return;
    }
    setStep(step + 1);
  };
  const matching = universities.filter(
    (x) =>
      x.province === form.province &&
      (campusQuery
        ? x.name.toLowerCase().includes(campusQuery.toLowerCase())
        : true),
  );
  const selected = universities.find((x) => x.name === form.campus);
  return (
    <div className="onboard-layout">
      <header className="onboard-header">
        <span className="logo">
          <span className="logo-mark">✦</span>
          <span>
            CAMPUS<span className="logo-accent">MATE</span>
          </span>
        </span>
        <span>
          Menyiapkan ruang kuliahmu{" "}
          <span className="muted">· {step} dari 3</span>
        </span>
      </header>
      <div className="onboard-progress">
        {[1, 2, 3].map((x) => (
          <div key={x} className={x <= step ? "filled" : ""} />
        ))}
      </div>
      <main className="onboard-main">
        <div className="onboard-kicker">LANGKAH 0{step} / 03</div>
        <h1>
          {step === 1
            ? "Kenalan dulu, yuk! 👋"
            : step === 2
              ? "Ceritakan kampusmu. 🎓"
              : "Pilih teman perjalananmu. 🐾"}
        </h1>
        <p>
          {step === 1
            ? "Biar kami bisa menyapamu dengan nama yang tepat."
            : step === 2
              ? "Setiap kampus punya ceritanya sendiri. Kampusmu tidak ada di daftar? Ketik manual saja."
              : "Dia akan menemanimu melalui jadwal padat dan deadline yang datang tiba-tiba."}
        </p>
        <div className="onboard-card">
          {step === 1 && (
            <div className="form-stack">
              <div className="avatar-upload">
                <div className="avatar avatar-lg">
                  {form.avatar ? (
                    <img src={form.avatar} alt="Foto profil" />
                  ) : (
                    form.nickname.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="btn btn-outline">
                  <Upload size={16} /> Unggah foto{" "}
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
                      r.onload = () => set("avatar", String(r.result));
                      r.readAsDataURL(f);
                    }}
                  />
                </label>
                <small>Opsional · JPG atau PNG, maks. 1 MB</small>
              </div>
              <div className="form-grid">
                <Field label="Nama lengkap">
                  <input
                    value={form.name}
                    maxLength={80}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>
                <Field label="Nama panggilan">
                  <input
                    value={form.nickname}
                    maxLength={30}
                    onChange={(e) => set("nickname", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-stack">
              <div className="form-grid">
                <Field label="Provinsi">
                  <select
                    value={form.province}
                    onChange={(e) => {
                      setForm((x) => ({
                        ...x,
                        province: e.target.value,
                        campus: "",
                        faculty: "",
                      }));
                      setCampusQuery("");
                    }}
                  >
                    <option value="">Pilih provinsi</option>
                    {provinces.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Jenjang">
                  <select
                    value={form.degree}
                    onChange={(e) => set("degree", e.target.value)}
                  >
                    {["D3", "D4", "S1", "S2", "S3"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field
                label="Perguruan tinggi"
                hint="Daftar ini belum mencakup semua kampus. Kamu bebas mengetik nama kampus sendiri."
              >
                <input
                  list="campus-list"
                  placeholder="Cari atau ketik nama kampus"
                  value={form.campus}
                  onChange={(e) => {
                    set("campus", e.target.value);
                    setCampusQuery(e.target.value);
                  }}
                />
                <datalist id="campus-list">
                  {matching.map((x) => (
                    <option key={x.name} value={x.name} />
                  ))}
                </datalist>
              </Field>
              <div className="form-grid">
                <Field label="Fakultas / sekolah">
                  <input
                    list="faculty-list"
                    placeholder="Nama fakultas"
                    value={form.faculty}
                    onChange={(e) => set("faculty", e.target.value)}
                  />
                  <datalist id="faculty-list">
                    {selected?.faculties.map((x) => (
                      <option key={x} value={x} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Program studi / jurusan">
                  <input
                    placeholder="Contoh: Sistem Informasi"
                    value={form.major}
                    onChange={(e) => set("major", e.target.value)}
                  />
                </Field>
              </div>
              <div className="form-grid">
                <Field label="NIM / nomor mahasiswa">
                  <input
                    placeholder="Nomor mahasiswa kamu"
                    value={form.nim}
                    maxLength={32}
                    onChange={(e) => set("nim", e.target.value)}
                  />
                </Field>
                <Field label="Semester sekarang">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.semester}
                    onChange={(e) => set("semester", Number(e.target.value))}
                  />
                </Field>
              </div>
              <div className="form-grid">
                <Field label="Tahun akademik">
                  <input
                    placeholder="Contoh: 2026/2027"
                    value={form.academicYear}
                    onChange={(e) => set("academicYear", e.target.value)}
                  />
                </Field>
                <Field label="Target lulus (opsional)">
                  <input
                    type="number"
                    min="2020"
                    max="2100"
                    placeholder="Contoh: 2029"
                    value={form.graduationYear}
                    onChange={(e) => set("graduationYear", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="form-stack">
              <div className="pet-options">
                {species.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={`pet-option ${speciesChoice === x ? "chosen" : ""}`}
                    onClick={() => setSpecies(x)}
                  >
                    <PetSprite species={x} decorative />
                    <strong>{x}</strong>
                    {speciesChoice === x && (
                      <i>
                        <Check size={13} />
                      </i>
                    )}
                  </button>
                ))}
              </div>
              <Field label="Kasih nama temanmu">
                <input
                  maxLength={24}
                  placeholder="Contoh: Mochi, Boba, Luna..."
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                />
              </Field>
              <div className="pet-preview">
                <PetSprite
                  species={speciesChoice}
                  name={petName || speciesChoice}
                />
                <span>
                  Hai! Aku <strong>{petName || "... siapa namaku?"}</strong>.
                  Kita mulai dari nol bareng, ya!
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="onboard-actions">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Kembali
              </Button>
            ) : (
              <span />
            )}
            <Button onClick={next}>
              {step === 3 ? "Masuk ke dashboard" : "Lanjutkan"}{" "}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <p className="onboard-foot">
          Data pribadimu tetap di browser ini. Tidak ada data contoh yang
          ditambahkan ke akunmu.
        </p>
      </main>
    </div>
  );
}
