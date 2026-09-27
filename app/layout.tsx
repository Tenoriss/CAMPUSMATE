import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import "./writemate.css";
import "./clay.css";
import { themeBootScript } from "@/lib/theme";
export const metadata: Metadata = {
  title: "CAMPUSMATE — Semua urusan kuliah, satu tempat.",
  description:
    "Teman kuliah digitalmu: jadwal, tugas, project, dan progres akademik dalam satu tempat.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Applied before the first paint so no theme flash occurs. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
