import { describe, expect, it } from "vitest";
import type { ClassSubmission } from "../drizzle/schema";
import { buildSnapshot, cleanSubmission } from "./variation";

const sampleRow: ClassSubmission = {
  id: "submission-test-id",
  bodyMass: "72.45",
  height: "165",
  handSpan: "18",
  tongueRolling: "can",
  eyeColour: "brown",
  bloodGroup: "A",
  leafLengths: JSON.stringify([4.8, 6.1]),
  seedMass: "0.314",
  seedMasses: JSON.stringify([0.314, 1.28]),
  submittedAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("anonymous submission validation", () => {
  it("requires explicit consent and discards the consent flag from cleaned data", () => {
    expect(() => cleanSubmission({ bodyMass: "72" })).toThrow(/consent/i);
    const clean = cleanSubmission({ consent: true, bodyMass: "72" });
    expect(clean.bodyMass).toBe(72);
    expect(clean).not.toHaveProperty("consent");
  });

  it("allows any subset and treats blank form fields as unselected", () => {
    expect(cleanSubmission({ consent: true, bodyMass: "72", height: "", handSpan: "", tongueRolling: "", eyeColour: "", bloodGroup: "" })).toEqual({ bodyMass: 72 });
  });

  it("rejects arbitrary identifying metadata instead of silently accepting it", () => {
    expect(() => cleanSubmission({ consent: true, bodyMass: "72", studentId: "student-1" })).toThrow(/personal information is not accepted/);
  });

  it("rejects a malformed supplied scalar instead of silently dropping it", () => {
    expect(() => cleanSubmission({ consent: true, bodyMass: "not-a-number", height: "165" })).toThrow(/Body mass must be a valid number/);
  });

  it("continues enforcing the accepted numeric ranges", () => {
    expect(() => cleanSubmission({ consent: true, bodyMass: "301" })).toThrow(/20–300 kg/);
    expect(cleanSubmission({ consent: true, seedMasses: ["0.001", "10"] }).seedMasses).toEqual([0.001, 10]);
  });

  it("rejects more than 40 repeated measurements", () => {
    expect(() => cleanSubmission({ consent: true, leafLengths: Array(41).fill("2") })).toThrow(/1 and 40 leaf lengths/);
    expect(() => cleanSubmission({ consent: true, seedMasses: Array(41).fill("1") })).toThrow(/1 and 40 seed masses/);
  });
});

describe("public dashboard aggregation", () => {
  it("returns only grouped interval labels and frequencies, not row-level measurements or extrema", () => {
    const snapshot = buildSnapshot([sampleRow]);
    const histogram = snapshot.histograms.bodyMass;
    expect(histogram).toEqual({ unit: "kg", bins: [{ label: "70–80", frequency: 1 }] });
    expect(histogram).not.toHaveProperty("values");
    expect(histogram).not.toHaveProperty("min");
    expect(histogram).not.toHaveProperty("max");
    expect(histogram.bins[0]).not.toHaveProperty("start");
    expect(histogram.bins[0]).not.toHaveProperty("end");
    expect(JSON.stringify(snapshot)).not.toContain("72.45");
    expect(snapshot.totalSampleSize).toBe(1);
  });
});
