import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeToggle, PetSprite, PetDisplay } from "../components/UI";

test("the public theme toggle renders an accessible cycling button", () => {
  const html = renderToStaticMarkup(<ThemeToggle />);
  assert.ok(html.includes('class="icon-btn theme-toggle"'));
  // First paint must match the server markup, then the stored pref is read.
  assert.ok(html.includes("Tema ikuti sistem. Ganti ke terang"));
  assert.ok(html.includes('type="button"'));
});

test("pet sprites serve the animated GIF with a reduced-motion still", () => {
  const html = renderToStaticMarkup(
    <PetSprite species="Fox" name="Rubi" priority />,
  );
  assert.ok(html.includes('src="/pets/fox.gif"'));
  assert.ok(html.includes('srcSet="/pets/fox.png"'));
  assert.ok(html.includes("prefers-reduced-motion: reduce"));
  assert.ok(html.includes('loading="eager"'));
  assert.ok(html.includes('fetchPriority="high"'));
  // Fixed intrinsic size keeps the row from jumping while the GIF loads.
  assert.ok(html.includes('width="180"'));
  assert.ok(html.includes('alt="Rubi, teman belajar Fox"'));
});

test("decorative pets stay silent for screen readers and lazy by default", () => {
  const html = renderToStaticMarkup(<PetSprite species="Panda" decorative />);
  assert.ok(html.includes('alt=""'));
  assert.ok(html.includes('loading="lazy"'));
});

test("the pet display forwards priority and shows the equipped accessory", () => {
  const html = renderToStaticMarkup(
    <PetDisplay
      pet={{
        species: "Panda",
        name: "Momo",
        xp: 12,
        accessories: [],
        equipped: "Glasses",
      }}
      priority
    />,
  );
  assert.ok(html.includes('src="/pets/panda.gif"'));
  assert.ok(html.includes('loading="eager"'));
  assert.ok(html.includes('aria-label="Glasses"'));
});
