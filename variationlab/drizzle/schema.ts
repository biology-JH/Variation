import { integer, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const tongueRollingChoice = pgEnum("tongue_rolling_choice", ["can", "cannot"]);
export const eyeColourChoice = pgEnum("eye_colour_choice", ["brown", "blue", "green", "hazel"]);
export const bloodGroupChoice = pgEnum("blood_group_choice", ["A", "B", "AB", "O"]);

/** Core user table backing the optional auth integration. */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** One row per anonymous student submission. No identity or free-form metadata is stored. */
export const classSubmissions = pgTable("class_submissions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  bodyMass: numeric("bodyMass", { precision: 7, scale: 2 }),
  height: numeric("height", { precision: 7, scale: 2 }),
  handSpan: numeric("handSpan", { precision: 6, scale: 2 }),
  tongueRolling: tongueRollingChoice("tongueRolling"),
  eyeColour: eyeColourChoice("eyeColour"),
  bloodGroup: bloodGroupChoice("bloodGroup"),
  leafLengths: text("leafLengths"),
  seedMass: numeric("seedMass", { precision: 8, scale: 4 }),
  seedMasses: text("seedMasses"),
  submittedAt: timestamp("submittedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type ClassSubmission = typeof classSubmissions.$inferSelect;
export type InsertClassSubmission = typeof classSubmissions.$inferInsert;
