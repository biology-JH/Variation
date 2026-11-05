import { afterEach, describe, expect, it, vi } from "vitest";
import { teacherKeyIsValid } from "./teacher-key";

afterEach(() => vi.unstubAllEnvs());

describe("teacher key policy", () => {
  it("allows the documented fallback only in development", () => {
    vi.stubEnv("TEACHER_KEY", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(teacherKeyIsValid("variationlab")).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(teacherKeyIsValid("variationlab")).toBe(false);
  });

  it("uses a configured key in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TEACHER_KEY", "test-only-private-key");
    expect(teacherKeyIsValid("test-only-private-key")).toBe(true);
    expect(teacherKeyIsValid("variationlab")).toBe(false);
  });
});
