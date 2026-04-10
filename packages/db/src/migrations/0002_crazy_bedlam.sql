ALTER TABLE "customers" ALTER COLUMN "id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_telephone_unique" UNIQUE("telephone");