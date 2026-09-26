import { gradePoint } from "./logic";
export type KRSRow = {
  id: string;
  code: string;
  name: string;
  sks: number;
  lecturer: string;
  className: string;
  day: number;
  startTime: string;
  endTime: string;
  room: string;
  confirmed: boolean;
};
export type KHSRow = {
  id: string;
  code: string;
  name: string;
  sks: number;
  grade: string;
  gradePoint: number;
  confirmed: boolean;
};
const id = () => crypto.randomUUID();
const days: Record<string, number> = {
  minggu: 0,
  sunday: 0,
  senin: 1,
  monday: 1,
  selasa: 2,
  tuesday: 2,
  rabu: 3,
  wednesday: 3,
  kamis: 4,
  thursday: 4,
  jumat: 5,
  jum: 5,
  friday: 5,
  sabtu: 6,
  saturday: 6,
};
const clean = (s: string) => s.replace(/\s+/g, " ").trim();
export const documentUploadService = {
  async extract(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ text: string; message: string }> {
    if (
      !["application/pdf", "image/png", "image/jpeg"].includes(file.type) &&
      !/\.(pdf|png|jpe?g)$/i.test(file.name)
    )
      throw new Error("Gunakan file PDF, PNG, atau JPG.");
    if (file.size > 8 * 1024 * 1024)
      throw new Error("File terlalu besar. Maksimal 8 MB.");
    if (file.type.startsWith("image/") || /\.(png|jpe?g)$/i.test(file.name)) {
      try {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("ind", 1, {
          workerPath: "/ocr/worker.min.js",
          corePath: "/ocr/core",
          langPath: "/ocr/lang",
          workerBlobURL: false,
          logger: (m) => {
            if (m.status === "recognizing text")
              onProgress?.(Math.round(m.progress * 100));
          },
        });
        try {
          const result = await worker.recognize(file);
          return {
            text: result.data.text,
            message: `Gambar dibaca secara lokal (perkiraan akurasi ${Math.round(result.data.confidence)}%). OCR bisa keliru: periksa dan koreksi semua baris sebelum menyimpan.`,
          };
        } finally {
          await worker.terminate();
        }
      } catch {
        return {
          text: "",
          message:
            "Kami belum berhasil membaca gambar ini. Isi informasi secara manual di bawah. File tidak dikirim atau disimpan.",
        };
      }
    }
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
      }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        let line = "",
          lastY: number | undefined;
        const lines: string[] = [];
        for (const item of text.items) {
          if (!("str" in item)) continue;
          const y = item.transform[5];
          if (lastY !== undefined && Math.abs(lastY - y) > 3) {
            lines.push(line);
            line = "";
          }
          line += " " + item.str;
          lastY = y;
        }
        lines.push(line);
        pages.push(lines.join("\n"));
      }
      return {
        text: pages.join("\n"),
        message:
          "Teks PDF berhasil dibaca secara lokal. Periksa dan koreksi setiap baris sebelum menyimpan.",
      };
    } catch {
      return {
        text: "",
        message:
          "PDF ini tidak memiliki teks yang bisa dibaca (mungkin hasil scan). Masukkan datanya manual; dokumen tidak dikirim atau disimpan.",
      };
    }
  },
  parseKRS(text: string): KRSRow[] {
    const found: KRSRow[] = [];
    for (const raw of text.split("\n")) {
      const line = clean(raw);
      const code = line.match(/\b[A-Z]{2,}[\s-]?\d{2,}[A-Z0-9]*\b/i);
      const sks = line.match(/\b([1-6])\s*(?:SKS|credits?)\b/i);
      const day = line.match(
        /\b(Senin|Selasa|Rabu|Kamis|Jumat|Jum'at|Sabtu|Minggu|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i,
      );
      const time = line.match(
        /\b(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})\b/,
      );
      if (!code || !sks) continue;
      let name = line
        .slice(line.indexOf(code[0]) + code[0].length)
        .replace(sks[0], "")
        .replace(day?.[0] || "", "")
        .replace(time?.[0] || "", "")
        .replace(/\b\d+\b/g, "")
        .trim()
        .replace(/^[-|: ]+|[-|: ]+$/g, "");
      if (name.length < 3) name = "";
      found.push({
        id: id(),
        code: code[0].replace(/\s/g, "").toUpperCase(),
        name,
        sks: Number(sks[1]),
        lecturer: "",
        className: "",
        day: day ? (days[day[0].toLowerCase().replace("'", "")] ?? 1) : 1,
        startTime: time ? `${time[1].padStart(2, "0")}:${time[2]}` : "",
        endTime: time ? `${time[3].padStart(2, "0")}:${time[4]}` : "",
        room: "",
        confirmed: false,
      });
    }
    return found;
  },
  parseKHS(text: string): KHSRow[] {
    const found: KHSRow[] = [];
    for (const raw of text.split("\n")) {
      const line = clean(raw);
      const code = line.match(/\b[A-Z]{2,}[\s-]?\d{2,}[A-Z0-9]*\b/i);
      const match = line.match(
        /\b([1-6])\s*(?:SKS)?\s+(A-|A|B\+|B-|B|C\+|C|D|E)\b/i,
      );
      if (!code || !match) continue;
      const name = line
        .slice(line.indexOf(code[0]) + code[0].length, line.indexOf(match[0]))
        .trim()
        .replace(/^[-|: ]+|[-|: ]+$/g, "");
      found.push({
        id: id(),
        code: code[0].replace(/\s/g, "").toUpperCase(),
        name,
        sks: Number(match[1]),
        grade: match[2].toUpperCase(),
        gradePoint: gradePoint(match[2]),
        confirmed: false,
      });
    }
    return found;
  },
};
