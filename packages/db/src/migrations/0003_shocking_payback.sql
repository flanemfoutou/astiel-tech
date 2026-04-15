DO $$ BEGIN
 CREATE TYPE "public"."service_status" AS ENUM('ACTIF', 'INACTIF', 'BLOQUE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invoice_status" AS ENUM('BROUILLON', 'ENVOYEE', 'PAYEE', 'ANNULEE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) NOT NULL,
	"customer_id" varchar(40) NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_services" (
	"id" varchar(45) PRIMARY KEY NOT NULL,
	"projet_id" varchar(45) NOT NULL,
	"service_id" varchar(40) NOT NULL,
	"quantite" integer DEFAULT 1 NOT NULL,
	"prix_unitaire" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" varchar(45) PRIMARY KEY NOT NULL,
	"numero" varchar(30) NOT NULL,
	"projet_id" varchar(45) NOT NULL,
	"customer_id" varchar(40) NOT NULL,
	"statut" "invoice_status" DEFAULT 'BROUILLON' NOT NULL,
	"date_emission" timestamp with time zone NOT NULL,
	"date_echeance" timestamp with time zone NOT NULL,
	"montant_ht" integer NOT NULL,
	"taux_tva" numeric(5, 2) NOT NULL,
	"montant_tva" integer NOT NULL,
	"montant_ttc" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_items" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"invoice_id" varchar(45) NOT NULL,
	"project_service_id" varchar(45) NOT NULL,
	"designation" varchar(255) NOT NULL,
	"quantite" integer NOT NULL,
	"prix_unitaire" integer NOT NULL,
	"montant_total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "projets";--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "statut" "service_status" DEFAULT 'ACTIF' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "actif";