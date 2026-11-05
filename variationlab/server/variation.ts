import type { ClassSubmission } from "../drizzle/schema";

export const RANGES = {
  bodyMass: { min: 20, max: 300, label: "20–300 kg" },
  height: { min: 80, max: 230, label: "80–230 cm" },
  handSpan: { min: 5, max: 35, label: "5–35 cm" },
  leafLength: { min: 0.5, max: 60, label: "0.5–60 cm" },
  seedMass: { min: 0.001, max: 10, label: "0.001–10 g" },
} as const;

export type SubmissionInput = {
  [field: string]: unknown;
  consent?: unknown;
  bodyMass?: unknown;
  height?: unknown;
  handSpan?: unknown;
  tongueRolling?: unknown;
  eyeColour?: unknown;
  bloodGroup?: unknown;
  leafLengths?: unknown;
  seedMass?: unknown;
  seedMasses?: unknown;
};

export type CleanSubmission = {
  bodyMass?: number;
  height?: number;
  handSpan?: number;
  tongueRolling?: "can" | "cannot";
  eyeColour?: "brown" | "blue" | "green" | "hazel";
  bloodGroup?: "A" | "B" | "AB" | "O";
  leafLengths?: number[];
  seedMass?: number;
  seedMasses?: number[];
};

type HistogramBin = { label: string; start: number; end: number; frequency: number };
type InternalHistogram = { values: number[]; bins: HistogramBin[]; min: number | null; max: number | null; unit: string };
type PublicHistogram = { bins: { label: string; frequency: number }[]; unit: string };
type CategoryChart = { label: string; frequency: number }[];

const optionalNumber = (value: unknown, range: { min: number; max: number }, label: string, field: string) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid number between ${label}.`);
  if (parsed < range.min || parsed > range.max) throw new Error(`${field} must be between ${label}.`);
  return Math.round(parsed * 10000) / 10000;
};

const hasSelectedValue = (value: unknown) => value !== undefined && value !== null && value !== "";

export function cleanSubmission(input: SubmissionInput): CleanSubmission {
  if (input.consent !== true) {
    throw new Error("Give consent to share this result anonymously before submitting.");
  }
  const acceptedFields = new Set(["consent", "bodyMass", "height", "handSpan", "tongueRolling", "eyeColour", "bloodGroup", "leafLengths", "seedMass", "seedMasses"]);
  if (Object.keys(input).some((field) => !acceptedFields.has(field))) {
    throw new Error("Only anonymous investigation results are accepted; personal information is not accepted.");
  }

  const clean: CleanSubmission = {};
  clean.bodyMass = optionalNumber(input.bodyMass, RANGES.bodyMass, RANGES.bodyMass.label, "Body mass");
  clean.height = optionalNumber(input.height, RANGES.height, RANGES.height.label, "Height");
  clean.handSpan = optionalNumber(input.handSpan, RANGES.handSpan, RANGES.handSpan.label, "Hand span");
  clean.seedMass = optionalNumber(input.seedMass, RANGES.seedMass, RANGES.seedMass.label, "Seed mass");

  if (input.seedMasses !== undefined) {
    if (!Array.isArray(input.seedMasses) || input.seedMasses.length < 1 || input.seedMasses.length > 40) {
      throw new Error("Add between 1 and 40 seed masses, or leave Investigation 8 blank.");
    }
    const masses = input.seedMasses.map((value) => optionalNumber(value, RANGES.seedMass, RANGES.seedMass.label, "Seed mass"));
    if (masses.some((value) => value === undefined)) throw new Error("Every seed mass must be a number.");
    clean.seedMasses = masses as number[];
  }

  if (hasSelectedValue(input.tongueRolling) && input.tongueRolling !== "can" && input.tongueRolling !== "cannot") {
    throw new Error("Tongue rolling must be Can or Cannot.");
  }
  if (hasSelectedValue(input.eyeColour) && !["brown", "blue", "green", "hazel"].includes(String(input.eyeColour))) {
    throw new Error("Eye colour must be Brown, Blue, Green, or Hazel.");
  }
  if (hasSelectedValue(input.bloodGroup) && !["A", "B", "AB", "O"].includes(String(input.bloodGroup))) {
    throw new Error("Blood group must be A, B, AB, or O.");
  }

  if (hasSelectedValue(input.tongueRolling)) clean.tongueRolling = input.tongueRolling as CleanSubmission["tongueRolling"];
  if (hasSelectedValue(input.eyeColour)) clean.eyeColour = input.eyeColour as CleanSubmission["eyeColour"];
  if (hasSelectedValue(input.bloodGroup)) clean.bloodGroup = input.bloodGroup as CleanSubmission["bloodGroup"];

  if (input.leafLengths !== undefined) {
    if (!Array.isArray(input.leafLengths) || input.leafLengths.length < 1 || input.leafLengths.length > 40) {
      throw new Error("Add between 1 and 40 leaf lengths, or leave Investigation 7 blank.");
    }
    const leaves = input.leafLengths.map((value) => optionalNumber(value, RANGES.leafLength, RANGES.leafLength.label, "Leaf length"));
    if (leaves.some((value) => value === undefined)) throw new Error("Every leaf length must be a number.");
    clean.leafLengths = leaves as number[];
  }

  if (Object.values(clean).every((value) => value === undefined)) {
    throw new Error("Add at least one result before submitting.");
  }
  return clean;
}

function numeric(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
}

function parseJsonNumbers(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

const quantile = (sorted: number[], p: number) => {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

export function makeHistogram(values: number[], unit: string, minimumBinWidth: number): InternalHistogram {
  const clean = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (clean.length === 0) return { values: [], bins: [], min: null, max: null, unit };

  const min = clean[0];
  const max = clean[clean.length - 1];
  const alignedMin = Math.floor(min / minimumBinWidth) * minimumBinWidth;
  let alignedMax = Math.ceil(max / minimumBinWidth) * minimumBinWidth;
  if (alignedMax <= alignedMin) alignedMax = alignedMin + minimumBinWidth;

  const q1 = quantile(clean, 0.25);
  const q3 = quantile(clean, 0.75);
  const fdWidth = 2 * (q3 - q1) / Math.cbrt(clean.length);
  const sturgesBins = Math.ceil(1 + Math.log2(clean.length));
  const adaptiveWidth = Math.max(fdWidth || (alignedMax - alignedMin) / sturgesBins, minimumBinWidth);
  const binCount = Math.max(1, Math.min(12, Math.floor((alignedMax - alignedMin) / adaptiveWidth)));
  const width = (alignedMax - alignedMin) / binCount;
  const precision = width < 0.1 ? 3 : width < 1 ? 1 : 0;
  const format = (value: number) => Number(value.toFixed(precision)).toString();
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, index) => {
    const start = alignedMin + index * width;
    const end = index === binCount - 1 ? alignedMax : alignedMin + (index + 1) * width;
    return { start, end, label: `${format(start)}–${format(end)}`, frequency: 0 };
  });

  for (const value of clean) {
    const index = Math.min(binCount - 1, Math.max(0, Math.floor((value - alignedMin) / width)));
    bins[index].frequency += 1;
  }
  return { values: clean, bins, min, max, unit };
}

function publicHistogram(histogram: InternalHistogram): PublicHistogram {
  return {
    unit: histogram.unit,
    bins: histogram.bins.map(({ label, frequency }) => ({ label, frequency })),
  };
}

export function buildSnapshot(rows: ClassSubmission[]) {
  const leafValues = rows.flatMap((row) => parseJsonNumbers(row.leafLengths));
  const tally = (field: keyof ClassSubmission, categories: string[]) => categories.map((label) => ({
    label,
    frequency: rows.filter((row) => row[field] === label).length,
  }));
  return {
    totalSampleSize: rows.length,
    updatedAt: new Date().toISOString(),
    histograms: {
      bodyMass: publicHistogram(makeHistogram(rows.map((row) => numeric(row.bodyMass)).filter((v): v is number => v !== undefined), "kg", 10)),
      height: publicHistogram(makeHistogram(rows.map((row) => numeric(row.height)).filter((v): v is number => v !== undefined), "cm", 10)),
      handSpan: publicHistogram(makeHistogram(rows.map((row) => numeric(row.handSpan)).filter((v): v is number => v !== undefined), "cm", 2)),
      leafLength: publicHistogram(makeHistogram(leafValues, "cm", 5)),
      seedMass: publicHistogram(makeHistogram(rows.flatMap((row) => [...parseJsonNumbers(row.seedMasses), ...(numeric(row.seedMass) === undefined ? [] : [numeric(row.seedMass)!])]), "g", 0.5)),
    },
    categories: {
      tongueRolling: tally("tongueRolling", ["can", "cannot"]),
      eyeColour: tally("eyeColour", ["brown", "blue", "green", "hazel"]),
      bloodGroup: tally("bloodGroup", ["A", "B", "AB", "O"]),
    },
  };
}

export function exportRows(rows: ClassSubmission[]) {
  return rows.map((row) => ({
    id: row.id,
    bodyMassKg: row.bodyMass ?? "",
    heightCm: row.height ?? "",
    handSpanCm: row.handSpan ?? "",
    tongueRolling: row.tongueRolling ?? "",
    eyeColour: row.eyeColour ?? "",
    bloodGroup: row.bloodGroup ?? "",
    leafLengthsCm: row.leafLengths ?? "[]",
    seedMassG: row.seedMasses ?? row.seedMass ?? "",
    submittedAt: row.submittedAt.toISOString(),
  }));
}
