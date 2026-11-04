import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * One row per anonymous student submission. No identity or free-form metadata is stored.
 * Leaf lengths are persisted as a JSON string so one student can submit multiple leaves
 * while the dashboard can still flatten them into continuous observations.
 */
export const classSubmissions = mysqlTable("class_submissions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  bodyMass: decimal("bodyMass", { precision: 7, scale: 2 }),
  height: decimal("height", { precision: 7, scale: 2 }),
  handSpan: decimal("handSpan", { precision: 6, scale: 2 }),
  tongueRolling: mysqlEnum("tongueRolling", ["can", "cannot"]),
  eyeColour: mysqlEnum("eyeColour", ["brown", "blue", "green", "hazel"]),
  bloodGroup: mysqlEnum("bloodGroup", ["A", "B", "AB", "O"]),
  leafLengths: text("leafLengths"),
  seedMass: decimal("seedMass", { precision: 8, scale: 4 }),
  seedMasses: text("seedMasses"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type ClassSubmission = typeof classSubmissions.$inferSelect;
export type InsertClassSubmission = typeof classSubmissions.$inferInsert;
