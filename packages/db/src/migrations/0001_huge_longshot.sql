CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" varchar(100) NOT NULL,
	"prenom" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telephone" varchar(20) NOT NULL,
	"entreprise" varchar(255),
	"adresse" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "clients";