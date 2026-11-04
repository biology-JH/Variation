import type { ClassSubmission } from "../drizzle/schema";

export const RANGES = {
  bodyMass: { min: 20, max: 300, label: "20–300 kg" },
  height: { min: 80, max: 230, label: "80–230 cm" },
  handSpan: { min: 5, max: 35, label: "5–35 cm" },
  leafLength: { min: 0.5, max: 60, label: "0.5–60 cm" },
  seedMass: { min: 0.001, max: 10, label: "0.001–10 g" },
} as const;

export type SubmissionInput = {
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

export type HistogramBin = { label: string; start: number; end: number; frequency: number };
export type Histogram = { values: number[]; bins: HistogramBin[]; min: number | null; max: number | null; unit: string };
export type CategoryChart = { label: string; frequency: number }[];

const asFiniteNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const rangeValue = (value: unknown, range: { min: number; max: number }, label: string, field: string) => {
  const parsed = asFiniteNumber(value);
  if (parsed === undefined) return undefined;
  if (parsed < range.min || parsed > range.max) throw new Error(`${field} must be between ${label}.`);
  return Math.round(parsed * 10000) / 10000;
};

export function cleanSubmission(input: SubmissionInput): CleanSubmission {
  const clean: CleanSubmission = {};
  clean.bodyMass = rangeValue(input.bodyMass, RANGES.bodyMass, RANGES.bodyMass.label, "Body mass");
  clean.height = rangeValue(input.height, RANGES.height, RANGES.height.label, "Height");
  clean.handSpan = rangeValue(input.handSpan, RANGES.handSpan, RANGES.handSpan.label, "Hand span");
  clean.seedMass = rangeValue(input.seedMass, RANGES.seedMass, RANGES.seedMass.label, "Seed mass");
  if (input.seedMasses !== undefined) {
    if (!Array.isArray(input.seedMasses) || input.seedMasses.length < 1 || input.seedMasses.length > 40) {
      throw new Error("Add between 1 and 40 seed masses, or leave Investigation 8 blank.");
    }
    const masses = input.seedMasses.map((value) => rangeValue(value, RANGES.seedMass, RANGES.seedMass.label, "Seed mass"));
    if (masses.some((value) => value === undefined)) throw new Error("Every seed mass must be a number.");
    clean.seedMasses = masses as number[];
  }

  if (input.tongueRolling !== undefined && input.tongueRolling !== "can" && input.tongueRolling !== "cannot") {
    throw new Error("Tongue rolling must be Can or Cannot.");
  }
  if (input.eyeColour !== undefined && !["brown", "blue", "green", "hazel"].includes(String(input.eyeColour))) {
    throw new Error("Eye colour must be Brown, Blue, Green, or Hazel.");
  }
  if (input.bloodGroup !== undefined && !["A", "B", "AB", "O"].includes(String(input.bloodGroup))) {
    throw new Error("Blood group must be A, B, AB, or O.");
  }

  if (input.tongueRolling !== undefined) clean.tongueRolling = input.tongueRolling as CleanSubmission["tongueRolling"];
  if (input.eyeColour !== undefined) clean.eyeColour = input.eyeColour as CleanSubmission["eyeColour"];
  if (input.bloodGroup !== undefined) clean.bloodGroup = input.bloodGroup as CleanSubmission["bloodGroup"];

  if (input.leafLengths !== undefined) {
    if (!Array.isArray(input.leafLengths) || input.leafLengths.length < 1 || input.leafLengths.length > 40) {
      throw new Error("Add between 1 and 40 leaf lengths, or leave Investigation 7 blank.");
    }
    const leaves = input.leafLengths.map((value) => rangeValue(value, RANGES.leafLength, RANGES.leafLength.label, "Leaf length"));
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

function parseLeaves(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
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

export function makeHistogram(values: number[], unit: string): Histogram {
  const clean = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (clean.length === 0) return { values: [], bins: [], min: null, max: null, unit };
  const min = clean[0];
  const max = clean[clean.length - 1];
  if (min === max) return { values: clean, bins: [{ label: `${min} ${unit}`, start: min, end: max, frequency: clean.length }], min, max, unit };

  const q1 = quantile(clean, 0.25);
  const q3 = quantile(clean, 0.75);
  const fdWidth = 2 * (q3 - q1) / Math.cbrt(clean.length);
  const sturges = Math.ceil(1 + Math.log2(clean.length));
  const fdBins = fdWidth > 0 ? Math.ceil((max - min) / fdWidth) : sturges;
  const binCount = Math.max(1, Math.min(12, fdBins || sturges));
  const width = (max - min) / binCount;
  const precision = width < 0.1 ? 2 : width < 1 ? 1 : 0;
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, index) => {
    const start = min + index * width;
    const end = index === binCount - 1 ? max : min + (index + 1) * width;
    return { start, end, label: `${start.toFixed(precision)}–${end.toFixed(precision)}`, frequency: 0 };
  });
  for (const value of clean) {
    const index = Math.min(binCount - 1, Math.floor((value - min) / width));
    bins[index].frequency += 1;
  }
  return { values: clean, bins, min, max, unit };
}

export function buildSnapshot(rows: ClassSubmission[]) {
  const leafValues = rows.flatMap((row) => parseLeaves(row.leafLengths));
  const tally = (field: keyof ClassSubmission, categories: string[]) => categories.map((label) => ({
    label,
    frequency: rows.filter((row) => row[field] === label).length,
  }));
  return {
    totalSampleSize: rows.length,
    updatedAt: new Date().toISOString(),
    histograms: {
      bodyMass: makeHistogram(rows.map((row) => numeric(row.bodyMass)).filter((v): v is number => v !== undefined), "kg"),
      height: makeHistogram(rows.map((row) => numeric(row.height)).filter((v): v is number => v !== undefined), "cm"),
      handSpan: makeHistogram(rows.map((row) => numeric(row.handSpan)).filter((v): v is number => v !== undefined), "cm"),
      leafLength: makeHistogram(leafValues, "cm"),
      seedMass: makeHistogram(rows.flatMap((row) => [...parseJsonNumbers(row.seedMasses), ...(numeric(row.seedMass) === undefined ? [] : [numeric(row.seedMass)!])]), "g"),
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
