CREATE TYPE "public"."blood_group_choice" AS ENUM('A', 'B', 'AB', 'O');--> statement-breakpoint
CREATE TYPE "public"."eye_colour_choice" AS ENUM('brown', 'blue', 'green', 'hazel');--> statement-breakpoint
CREATE TYPE "public"."tongue_rolling_choice" AS ENUM('can', 'cannot');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "class_submissions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"bodyMass" numeric(7, 2),
	"height" numeric(7, 2),
	"handSpan" numeric(6, 2),
	"tongueRolling" "tongue_rolling_choice",
	"eyeColour" "eye_colour_choice",
	"bloodGroup" "blood_group_choice",
	"leafLengths" text,
	"seedMass" numeric(8, 4),
	"seedMasses" text,
	"submittedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
