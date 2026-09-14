import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "clubs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_clubs_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "events_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_events_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "stories_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_stories_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "campaigns_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_campaigns_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "clubs_texts" ADD CONSTRAINT "clubs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_texts" ADD CONSTRAINT "_clubs_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_texts" ADD CONSTRAINT "events_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_texts" ADD CONSTRAINT "_events_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_texts" ADD CONSTRAINT "stories_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_texts" ADD CONSTRAINT "_stories_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_texts" ADD CONSTRAINT "campaigns_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v_texts" ADD CONSTRAINT "_campaigns_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_campaigns_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clubs_texts_order_parent" ON "clubs_texts" USING btree ("order","parent_id");
  CREATE INDEX "clubs_texts_text_idx" ON "clubs_texts" USING btree ("text");
  CREATE INDEX "_clubs_v_texts_order_parent" ON "_clubs_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "events_texts_order_parent" ON "events_texts" USING btree ("order","parent_id");
  CREATE INDEX "events_texts_text_idx" ON "events_texts" USING btree ("text");
  CREATE INDEX "_events_v_texts_order_parent" ON "_events_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_texts_text_idx" ON "pages_texts" USING btree ("text");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "stories_texts_order_parent" ON "stories_texts" USING btree ("order","parent_id");
  CREATE INDEX "stories_texts_text_idx" ON "stories_texts" USING btree ("text");
  CREATE INDEX "_stories_v_texts_order_parent" ON "_stories_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "campaigns_texts_order_parent" ON "campaigns_texts" USING btree ("order","parent_id");
  CREATE INDEX "campaigns_texts_text_idx" ON "campaigns_texts" USING btree ("text");
  CREATE INDEX "_campaigns_v_texts_order_parent" ON "_campaigns_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "clubs_texts" CASCADE;
  DROP TABLE "_clubs_v_texts" CASCADE;
  DROP TABLE "events_texts" CASCADE;
  DROP TABLE "_events_v_texts" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  DROP TABLE "stories_texts" CASCADE;
  DROP TABLE "_stories_v_texts" CASCADE;
  DROP TABLE "campaigns_texts" CASCADE;
  DROP TABLE "_campaigns_v_texts" CASCADE;`)
}
