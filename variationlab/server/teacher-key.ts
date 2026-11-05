import { timingSafeEqual } from "node:crypto";

const DEVELOPMENT_TEACHER_KEY = "variationlab";

export function teacherKeyIsValid(value: unknown) {
  const supplied = typeof value === "string" ? value : "";
  const configured = process.env.TEACHER_KEY;
  const expected = configured || (process.env.NODE_ENV === "development" ? DEVELOPMENT_TEACHER_KEY : "");
  if (!expected) return false;
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
