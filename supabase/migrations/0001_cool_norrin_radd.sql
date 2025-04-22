CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"custom_domain" text NOT NULL,
	"subdomain" text,
	"type" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sites_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;