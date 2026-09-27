"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Plus,
  Search,
  Inbox,
  Moon,
  Sun,
  SunMoon,
} from "lucide-react";
import {
  applyTheme,
  nextThemePref,
  readThemePref,
  themeLabels,
  writeThemePref,
  type ResolvedTheme,
  type ThemePref,
} from "@/lib/theme";
import { Pet, PetSpecies } from "@/lib/types";

/** Original local sprites: GIF when motion is allowed, still PNG otherwise. */
export function PetSprite({
  species,
  name,
  decorative = false,
  priority = false,
}: {
  species: PetSpecies;
  name?: string;
  decorative?: boolean;
  /** Above-the-fold placements load the GIF straight away instead of lazily. */
  priority?: boolean;
}) {
  const slug = species.toLowerCase();
  return (
    <picture className="pet-sprite">
      <source
        media="(prefers-reduced-motion: reduce)"
        srcSet={`/pets/${slug}.png`}
      />
      <img
        src={`/pets/${slug}.gif`}
        width={180}
        height={180}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        alt={decorative ? "" : `${name || species}, teman belajar ${species}`}
      />
    </picture>
  );
}

export function PetDisplay({
  pet,
  priority = false,
}: {
  pet: Pet | null;
  priority?: boolean;
}) {
  const accessory: Record<string, string> = {
    "Graduation cap": "🎓",
    Glasses: "👓",
    Backpack: "🎒",
    Headphones: "🎧",
    Bow: "🎀",
    Hoodie: "🧥",
  };
  return (
    <span className="pet-display">
      <PetSprite
        species={pet?.species || "Cat"}
        name={pet?.name}
        priority={priority}
      />
      {pet?.equipped && (
        <i aria-label={pet.equipped}>{accessory[pet.equipped]}</i>
      )}
    </span>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(
      () =>
        dialogRef.current
          ?.querySelector<HTMLElement>(
            'input:not([type="hidden"]), button, select, textarea',
          )
          ?.focus(),
      50,
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]',
        ),
      ];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1)?.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === focusable.at(-1)
      ) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`modal ${wide ? "modal-wide" : ""}`}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-head">
              <h2>{title}</h2>
              <button className="icon-btn" aria-label="Tutup" onClick={onClose}>
                <X size={19} />
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}
export function Empty({
  icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`empty ${compact ? "empty-compact" : ""}`}>
      <div className="empty-icon">{icon || <Inbox size={25} />}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function Confirm({
  open,
  onClose,
  onConfirm,
  title,
  description,
  danger = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="muted" style={{ marginBottom: 24 }}>
        {description}
      </p>
      <div className="form-actions">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Ya, lanjutkan
        </Button>
      </div>
    </Modal>
  );
}
export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`pill pill-${tone.toLowerCase()}`}>{children}</span>;
}
export function ArrowLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="text-link" onClick={onClick}>
      {children}
      <ArrowRight size={15} />
    </button>
  );
}

/**
 * Standalone light/dark/system switch for the public pages. The workspace has
 * its own toggle that also writes the choice back to the account settings.
 */
export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  useEffect(() => {
    setPref(readThemePref());
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      setResolved(applyTheme(pref, { systemPrefersDark: media.matches }));
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [pref]);
  const next = nextThemePref(pref);
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      aria-label={`Tema ${themeLabels[pref].toLowerCase()}. Ganti ke ${themeLabels[next].toLowerCase()}`}
      title={`Tema: ${themeLabels[pref]}`}
      onClick={() => {
        setPref(next);
        writeThemePref(next);
      }}
    >
      {pref === "system" ? (
        <SunMoon size={19} />
      ) : resolved === "dark" ? (
        <Moon size={19} />
      ) : (
        <Sun size={19} />
      )}
    </button>
  );
}
