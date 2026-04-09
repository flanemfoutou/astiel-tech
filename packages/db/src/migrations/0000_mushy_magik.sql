DO $$ BEGIN
 CREATE TYPE "public"."service_category" AS ENUM('TIC', 'GENIE_CIVIL', 'LOGISTIQUE', 'COMMERCE', 'FOURNITURE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" varchar(100) NOT NULL,
	"prenom" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telephone" varchar(20) NOT NULL,
	"entreprise" varchar(255),
	"adresse" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projets" (
	"id" text PRIMARY KEY NOT NULL,
	"titre" text NOT NULL,
	"description" text,
	"statut" text NOT NULL,
	"clientId" text NOT NULL,
	"dateDebut" timestamp NOT NULL,
	"dateFin" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"categorie" "service_category" NOT NULL,
	"tarif_journalier" integer,
	"actif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
