import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_clubs_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_clubs_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_clubs_blocks_cta_tone" AS ENUM('dark', 'accent', 'quiet');
  CREATE TYPE "public"."enum_clubs_slug" AS ENUM('diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed');
  CREATE TYPE "public"."enum_clubs_accent" AS ENUM('diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed');
  CREATE TYPE "public"."enum_clubs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__clubs_v_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__clubs_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__clubs_v_blocks_cta_tone" AS ENUM('dark', 'accent', 'quiet');
  CREATE TYPE "public"."enum__clubs_v_version_slug" AS ENUM('diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed');
  CREATE TYPE "public"."enum__clubs_v_version_accent" AS ENUM('diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed');
  CREATE TYPE "public"."enum__clubs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_cta_tone" AS ENUM('dark', 'accent', 'quiet');
  CREATE TYPE "public"."enum_pages_slug" AS ENUM('about', 'join', 'contact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_tone" AS ENUM('dark', 'accent', 'quiet');
  CREATE TYPE "public"."enum__pages_v_version_slug" AS ENUM('about', 'join', 'contact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('mc', 'editor', 'member');
  CREATE TYPE "public"."enum_site_settings_hero_buttons_tone" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_site_settings_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_site_settings_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_site_settings_blocks_cta_tone" AS ENUM('dark', 'accent', 'quiet');
  CREATE TABLE "clubs_quick_facts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "value" varchar
  );

  CREATE TABLE "clubs_key_events" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar
  );

  CREATE TABLE "clubs_achievements" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "clubs_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar
  );

  CREATE TABLE "clubs_extra_socials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar
  );

  CREATE TABLE "clubs_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "content" jsonb,
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_image_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "content" jsonb,
    "image_position" "enum_clubs_blocks_image_text_image_position" DEFAULT 'left',
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_cards_cards" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "icon_id" integer,
    "link_url" varchar,
    "link_label" varchar
  );

  CREATE TABLE "clubs_blocks_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "columns" "enum_clubs_blocks_gallery_columns" DEFAULT '4',
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_link_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "description" varchar
  );

  CREATE TABLE "clubs_blocks_link_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" jsonb
  );

  CREATE TABLE "clubs_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_stats_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar,
    "label" varchar
  );

  CREATE TABLE "clubs_blocks_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "quote" varchar,
    "attribution" varchar,
    "role" varchar,
    "block_name" varchar
  );

  CREATE TABLE "clubs_blocks_cta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "body" varchar,
    "button_label" varchar,
    "button_url" varchar,
    "tone" "enum_clubs_blocks_cta_tone" DEFAULT 'dark',
    "block_name" varchar
  );

  CREATE TABLE "clubs" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "slug" "enum_clubs_slug",
    "accent" "enum_clubs_accent" DEFAULT 'diving',
    "tagline" varchar,
    "hero_id" integer,
    "logo_id" integer,
    "who_we_are" jsonb,
    "beginner_notes" jsonb,
    "typical_session" jsonb,
    "gear_and_cost" jsonb,
    "how_to_join" jsonb,
    "socials_email" varchar,
    "socials_telegram" varchar,
    "socials_instagram" varchar,
    "socials_whatsapp" varchar,
    "socials_tiktok" varchar,
    "socials_youtube" varchar,
    "socials_facebook" varchar,
    "socials_linkedin" varchar,
    "socials_discord" varchar,
    "socials_website" varchar,
    "join_cta_heading" varchar,
    "join_cta_body" varchar,
    "join_cta_button_label" varchar,
    "join_cta_button_url" varchar,
    "labels_who_we_are" varchar,
    "labels_start_here" varchar,
    "labels_key_events" varchar,
    "labels_events" varchar,
    "labels_gallery" varchar,
    "labels_committee" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_clubs_status" DEFAULT 'draft'
  );

  CREATE TABLE "clubs_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE "_clubs_v_version_quick_facts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_version_key_events" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_version_achievements" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_version_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_version_extra_socials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "content" jsonb,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_image_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "content" jsonb,
    "image_position" "enum__clubs_v_blocks_image_text_image_position" DEFAULT 'left',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_cards_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "icon_id" integer,
    "link_url" varchar,
    "link_label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_blocks_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "columns" "enum__clubs_v_blocks_gallery_columns" DEFAULT '4',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_link_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "description" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_blocks_link_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" jsonb,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_stats_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_clubs_v_blocks_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "quote" varchar,
    "attribution" varchar,
    "role" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v_blocks_cta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar,
    "body" varchar,
    "button_label" varchar,
    "button_url" varchar,
    "tone" "enum__clubs_v_blocks_cta_tone" DEFAULT 'dark',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_clubs_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_slug" "enum__clubs_v_version_slug",
    "version_accent" "enum__clubs_v_version_accent" DEFAULT 'diving',
    "version_tagline" varchar,
    "version_hero_id" integer,
    "version_logo_id" integer,
    "version_who_we_are" jsonb,
    "version_beginner_notes" jsonb,
    "version_typical_session" jsonb,
    "version_gear_and_cost" jsonb,
    "version_how_to_join" jsonb,
    "version_socials_email" varchar,
    "version_socials_telegram" varchar,
    "version_socials_instagram" varchar,
    "version_socials_whatsapp" varchar,
    "version_socials_tiktok" varchar,
    "version_socials_youtube" varchar,
    "version_socials_facebook" varchar,
    "version_socials_linkedin" varchar,
    "version_socials_discord" varchar,
    "version_socials_website" varchar,
    "version_join_cta_heading" varchar,
    "version_join_cta_body" varchar,
    "version_join_cta_button_label" varchar,
    "version_join_cta_button_url" varchar,
    "version_labels_who_we_are" varchar,
    "version_labels_start_here" varchar,
    "version_labels_key_events" varchar,
    "version_labels_events" varchar,
    "version_labels_gallery" varchar,
    "version_labels_committee" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__clubs_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "_clubs_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE "events" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "club_id" integer,
    "starts_at" timestamp(3) with time zone,
    "ends_at" timestamp(3) with time zone,
    "time_tbc" boolean DEFAULT false,
    "location" varchar,
    "cost" varchar,
    "capacity" numeric,
    "spots_taken" numeric,
    "signup_url" varchar,
    "signup_opens" timestamp(3) with time zone,
    "signup_closes" timestamp(3) with time zone,
    "cover_id" integer,
    "description" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_events_status" DEFAULT 'draft'
  );

  CREATE TABLE "_events_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_club_id" integer,
    "version_starts_at" timestamp(3) with time zone,
    "version_ends_at" timestamp(3) with time zone,
    "version_time_tbc" boolean DEFAULT false,
    "version_location" varchar,
    "version_cost" varchar,
    "version_capacity" numeric,
    "version_spots_taken" numeric,
    "version_signup_url" varchar,
    "version_signup_opens" timestamp(3) with time zone,
    "version_signup_closes" timestamp(3) with time zone,
    "version_cover_id" integer,
    "version_description" jsonb,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__events_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "albums" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "club_id" integer,
    "event_id" integer,
    "date" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "albums_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE "people" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "role" varchar NOT NULL,
    "club_id" integer,
    "ay" varchar NOT NULL,
    "photo_id" integer,
    "contact" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "pages_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "content" jsonb,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_image_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "content" jsonb,
    "image_position" "enum_pages_blocks_image_text_image_position" DEFAULT 'left',
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_cards_cards" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "icon_id" integer,
    "link_url" varchar,
    "link_label" varchar
  );

  CREATE TABLE "pages_blocks_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "columns" "enum_pages_blocks_gallery_columns" DEFAULT '4',
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_link_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "description" varchar
  );

  CREATE TABLE "pages_blocks_link_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" jsonb
  );

  CREATE TABLE "pages_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_stats_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar,
    "label" varchar
  );

  CREATE TABLE "pages_blocks_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "quote" varchar,
    "attribution" varchar,
    "role" varchar,
    "block_name" varchar
  );

  CREATE TABLE "pages_blocks_cta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "body" varchar,
    "button_label" varchar,
    "button_url" varchar,
    "tone" "enum_pages_blocks_cta_tone" DEFAULT 'dark',
    "block_name" varchar
  );

  CREATE TABLE "pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" "enum_pages_slug",
    "intro" varchar,
    "hero_image_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "pages_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE "_pages_v_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "content" jsonb,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_image_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "content" jsonb,
    "image_position" "enum__pages_v_blocks_image_text_image_position" DEFAULT 'left',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_cards_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "icon_id" integer,
    "link_url" varchar,
    "link_label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "columns" "enum__pages_v_blocks_gallery_columns" DEFAULT '4',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_link_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "description" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_link_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" jsonb,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_stats_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "quote" varchar,
    "attribution" varchar,
    "role" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_cta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar,
    "body" varchar,
    "button_label" varchar,
    "button_url" varchar,
    "tone" "enum__pages_v_blocks_cta_tone" DEFAULT 'dark',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" "enum__pages_v_version_slug",
    "version_intro" varchar,
    "version_hero_image_id" integer,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "_pages_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE "resources" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar,
    "club_id" integer,
    "ay" varchar,
    "prefix" varchar DEFAULT 'resources',
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric
  );

  CREATE TABLE "media" (
    "id" serial PRIMARY KEY NOT NULL,
    "alt" varchar NOT NULL,
    "club_id" integer,
    "prefix" varchar DEFAULT 'media',
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric,
    "sizes_small_url" varchar,
    "sizes_small_width" numeric,
    "sizes_small_height" numeric,
    "sizes_small_mime_type" varchar,
    "sizes_small_filesize" numeric,
    "sizes_small_filename" varchar,
    "sizes_medium_url" varchar,
    "sizes_medium_width" numeric,
    "sizes_medium_height" numeric,
    "sizes_medium_mime_type" varchar,
    "sizes_medium_filesize" numeric,
    "sizes_medium_filename" varchar,
    "sizes_large_url" varchar,
    "sizes_large_width" numeric,
    "sizes_large_height" numeric,
    "sizes_large_mime_type" varchar,
    "sizes_large_filesize" numeric,
    "sizes_large_filename" varchar
  );

  CREATE TABLE "users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" "enum_users_role" DEFAULT 'member' NOT NULL,
    "club_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "clubs_id" integer,
    "events_id" integer,
    "albums_id" integer,
    "people_id" integer,
    "pages_id" integer,
    "resources_id" integer,
    "media_id" integer,
    "users_id" integer
  );

  CREATE TABLE "payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );

  CREATE TABLE "payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "site_settings_hero_buttons" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL,
    "tone" "enum_site_settings_hero_buttons_tone" DEFAULT 'primary'
  );

  CREATE TABLE "site_settings_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "site_settings_motto_words" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "word" varchar NOT NULL
  );

  CREATE TABLE "site_settings_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "content" jsonb NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_image_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer NOT NULL,
    "content" jsonb NOT NULL,
    "image_position" "enum_site_settings_blocks_image_text_image_position" DEFAULT 'left',
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_cards_cards" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "body" varchar,
    "icon_id" integer,
    "link_url" varchar,
    "link_label" varchar
  );

  CREATE TABLE "site_settings_blocks_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "columns" "enum_site_settings_blocks_gallery_columns" DEFAULT '4',
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_link_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL,
    "description" varchar
  );

  CREATE TABLE "site_settings_blocks_link_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" jsonb NOT NULL
  );

  CREATE TABLE "site_settings_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_stats_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "site_settings_blocks_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "quote" varchar NOT NULL,
    "attribution" varchar,
    "role" varchar,
    "block_name" varchar
  );

  CREATE TABLE "site_settings_blocks_cta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "body" varchar,
    "button_label" varchar,
    "button_url" varchar,
    "tone" "enum_site_settings_blocks_cta_tone" DEFAULT 'dark',
    "block_name" varchar
  );

  CREATE TABLE "site_settings_nav" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "href" varchar NOT NULL
  );

  CREATE TABLE "site_settings_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" varchar NOT NULL
  );

  CREATE TABLE "site_settings_extra_socials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL
  );

  CREATE TABLE "site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "hero_heading" varchar,
    "motto" varchar,
    "home_labels_clubs_eyebrow" varchar,
    "home_labels_clubs_title" varchar,
    "home_labels_events_eyebrow" varchar,
    "home_labels_events_title" varchar,
    "home_labels_socials_title" varchar,
    "committee_eyebrow" varchar,
    "committee_title" varchar,
    "committee_intro" jsonb,
    "committee_events_title" varchar,
    "committee_people_title" varchar,
    "committee_photo_id" integer,
    "footer_note" varchar,
    "banner_enabled" boolean DEFAULT false,
    "banner_text" varchar,
    "banner_url" varchar,
    "about" jsonb,
    "socials_email" varchar,
    "socials_telegram" varchar,
    "socials_instagram" varchar,
    "socials_whatsapp" varchar,
    "socials_tiktok" varchar,
    "socials_youtube" varchar,
    "socials_facebook" varchar,
    "socials_linkedin" varchar,
    "socials_discord" varchar,
    "socials_website" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "site_settings_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  ALTER TABLE "clubs_quick_facts" ADD CONSTRAINT "clubs_quick_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_key_events" ADD CONSTRAINT "clubs_key_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_achievements" ADD CONSTRAINT "clubs_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_faqs" ADD CONSTRAINT "clubs_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_extra_socials" ADD CONSTRAINT "clubs_extra_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_rich_text" ADD CONSTRAINT "clubs_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_image_text" ADD CONSTRAINT "clubs_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clubs_blocks_image_text" ADD CONSTRAINT "clubs_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_cards_cards" ADD CONSTRAINT "clubs_blocks_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clubs_blocks_cards_cards" ADD CONSTRAINT "clubs_blocks_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_cards" ADD CONSTRAINT "clubs_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_gallery" ADD CONSTRAINT "clubs_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_link_list_links" ADD CONSTRAINT "clubs_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_link_list" ADD CONSTRAINT "clubs_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_faq_items" ADD CONSTRAINT "clubs_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_faq" ADD CONSTRAINT "clubs_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_stats_items" ADD CONSTRAINT "clubs_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_stats" ADD CONSTRAINT "clubs_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_quote" ADD CONSTRAINT "clubs_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_blocks_cta" ADD CONSTRAINT "clubs_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs" ADD CONSTRAINT "clubs_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clubs" ADD CONSTRAINT "clubs_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clubs_rels" ADD CONSTRAINT "clubs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_rels" ADD CONSTRAINT "clubs_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_quick_facts" ADD CONSTRAINT "_clubs_v_version_quick_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_key_events" ADD CONSTRAINT "_clubs_v_version_key_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_achievements" ADD CONSTRAINT "_clubs_v_version_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_faqs" ADD CONSTRAINT "_clubs_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_extra_socials" ADD CONSTRAINT "_clubs_v_version_extra_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_rich_text" ADD CONSTRAINT "_clubs_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_image_text" ADD CONSTRAINT "_clubs_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_image_text" ADD CONSTRAINT "_clubs_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_cards_cards" ADD CONSTRAINT "_clubs_v_blocks_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_cards_cards" ADD CONSTRAINT "_clubs_v_blocks_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_cards" ADD CONSTRAINT "_clubs_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_gallery" ADD CONSTRAINT "_clubs_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_link_list_links" ADD CONSTRAINT "_clubs_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_link_list" ADD CONSTRAINT "_clubs_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_faq_items" ADD CONSTRAINT "_clubs_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_faq" ADD CONSTRAINT "_clubs_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_stats_items" ADD CONSTRAINT "_clubs_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_stats" ADD CONSTRAINT "_clubs_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_quote" ADD CONSTRAINT "_clubs_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_blocks_cta" ADD CONSTRAINT "_clubs_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v" ADD CONSTRAINT "_clubs_v_parent_id_clubs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v" ADD CONSTRAINT "_clubs_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v" ADD CONSTRAINT "_clubs_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v_rels" ADD CONSTRAINT "_clubs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_rels" ADD CONSTRAINT "_clubs_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_club_id_clubs_id_fk" FOREIGN KEY ("version_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_cards" ADD CONSTRAINT "pages_blocks_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_cards" ADD CONSTRAINT "pages_blocks_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards" ADD CONSTRAINT "pages_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_list_links" ADD CONSTRAINT "pages_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_list" ADD CONSTRAINT "pages_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_cards" ADD CONSTRAINT "_pages_v_blocks_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_cards" ADD CONSTRAINT "_pages_v_blocks_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards" ADD CONSTRAINT "_pages_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_list_links" ADD CONSTRAINT "_pages_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_list" ADD CONSTRAINT "_pages_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clubs_fk" FOREIGN KEY ("clubs_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hero_buttons" ADD CONSTRAINT "site_settings_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_motto_words" ADD CONSTRAINT "site_settings_motto_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_rich_text" ADD CONSTRAINT "site_settings_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_image_text" ADD CONSTRAINT "site_settings_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_image_text" ADD CONSTRAINT "site_settings_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_cards_cards" ADD CONSTRAINT "site_settings_blocks_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_cards_cards" ADD CONSTRAINT "site_settings_blocks_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_cards" ADD CONSTRAINT "site_settings_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_gallery" ADD CONSTRAINT "site_settings_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_link_list_links" ADD CONSTRAINT "site_settings_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_link_list" ADD CONSTRAINT "site_settings_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_faq_items" ADD CONSTRAINT "site_settings_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_faq" ADD CONSTRAINT "site_settings_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_stats_items" ADD CONSTRAINT "site_settings_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_stats" ADD CONSTRAINT "site_settings_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_quote" ADD CONSTRAINT "site_settings_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_cta" ADD CONSTRAINT "site_settings_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav" ADD CONSTRAINT "site_settings_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_faqs" ADD CONSTRAINT "site_settings_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_extra_socials" ADD CONSTRAINT "site_settings_extra_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_committee_photo_id_media_id_fk" FOREIGN KEY ("committee_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clubs_quick_facts_order_idx" ON "clubs_quick_facts" USING btree ("_order");
  CREATE INDEX "clubs_quick_facts_parent_id_idx" ON "clubs_quick_facts" USING btree ("_parent_id");
  CREATE INDEX "clubs_key_events_order_idx" ON "clubs_key_events" USING btree ("_order");
  CREATE INDEX "clubs_key_events_parent_id_idx" ON "clubs_key_events" USING btree ("_parent_id");
  CREATE INDEX "clubs_achievements_order_idx" ON "clubs_achievements" USING btree ("_order");
  CREATE INDEX "clubs_achievements_parent_id_idx" ON "clubs_achievements" USING btree ("_parent_id");
  CREATE INDEX "clubs_faqs_order_idx" ON "clubs_faqs" USING btree ("_order");
  CREATE INDEX "clubs_faqs_parent_id_idx" ON "clubs_faqs" USING btree ("_parent_id");
  CREATE INDEX "clubs_extra_socials_order_idx" ON "clubs_extra_socials" USING btree ("_order");
  CREATE INDEX "clubs_extra_socials_parent_id_idx" ON "clubs_extra_socials" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_rich_text_order_idx" ON "clubs_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "clubs_blocks_rich_text_parent_id_idx" ON "clubs_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_rich_text_path_idx" ON "clubs_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "clubs_blocks_image_text_order_idx" ON "clubs_blocks_image_text" USING btree ("_order");
  CREATE INDEX "clubs_blocks_image_text_parent_id_idx" ON "clubs_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_image_text_path_idx" ON "clubs_blocks_image_text" USING btree ("_path");
  CREATE INDEX "clubs_blocks_image_text_image_idx" ON "clubs_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "clubs_blocks_cards_cards_order_idx" ON "clubs_blocks_cards_cards" USING btree ("_order");
  CREATE INDEX "clubs_blocks_cards_cards_parent_id_idx" ON "clubs_blocks_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_cards_cards_icon_idx" ON "clubs_blocks_cards_cards" USING btree ("icon_id");
  CREATE INDEX "clubs_blocks_cards_order_idx" ON "clubs_blocks_cards" USING btree ("_order");
  CREATE INDEX "clubs_blocks_cards_parent_id_idx" ON "clubs_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_cards_path_idx" ON "clubs_blocks_cards" USING btree ("_path");
  CREATE INDEX "clubs_blocks_gallery_order_idx" ON "clubs_blocks_gallery" USING btree ("_order");
  CREATE INDEX "clubs_blocks_gallery_parent_id_idx" ON "clubs_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_gallery_path_idx" ON "clubs_blocks_gallery" USING btree ("_path");
  CREATE INDEX "clubs_blocks_link_list_links_order_idx" ON "clubs_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "clubs_blocks_link_list_links_parent_id_idx" ON "clubs_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_link_list_order_idx" ON "clubs_blocks_link_list" USING btree ("_order");
  CREATE INDEX "clubs_blocks_link_list_parent_id_idx" ON "clubs_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_link_list_path_idx" ON "clubs_blocks_link_list" USING btree ("_path");
  CREATE INDEX "clubs_blocks_faq_items_order_idx" ON "clubs_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "clubs_blocks_faq_items_parent_id_idx" ON "clubs_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_faq_order_idx" ON "clubs_blocks_faq" USING btree ("_order");
  CREATE INDEX "clubs_blocks_faq_parent_id_idx" ON "clubs_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_faq_path_idx" ON "clubs_blocks_faq" USING btree ("_path");
  CREATE INDEX "clubs_blocks_stats_items_order_idx" ON "clubs_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "clubs_blocks_stats_items_parent_id_idx" ON "clubs_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_stats_order_idx" ON "clubs_blocks_stats" USING btree ("_order");
  CREATE INDEX "clubs_blocks_stats_parent_id_idx" ON "clubs_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_stats_path_idx" ON "clubs_blocks_stats" USING btree ("_path");
  CREATE INDEX "clubs_blocks_quote_order_idx" ON "clubs_blocks_quote" USING btree ("_order");
  CREATE INDEX "clubs_blocks_quote_parent_id_idx" ON "clubs_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_quote_path_idx" ON "clubs_blocks_quote" USING btree ("_path");
  CREATE INDEX "clubs_blocks_cta_order_idx" ON "clubs_blocks_cta" USING btree ("_order");
  CREATE INDEX "clubs_blocks_cta_parent_id_idx" ON "clubs_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "clubs_blocks_cta_path_idx" ON "clubs_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "clubs_slug_idx" ON "clubs" USING btree ("slug");
  CREATE INDEX "clubs_hero_idx" ON "clubs" USING btree ("hero_id");
  CREATE INDEX "clubs_logo_idx" ON "clubs" USING btree ("logo_id");
  CREATE INDEX "clubs_updated_at_idx" ON "clubs" USING btree ("updated_at");
  CREATE INDEX "clubs_created_at_idx" ON "clubs" USING btree ("created_at");
  CREATE INDEX "clubs__status_idx" ON "clubs" USING btree ("_status");
  CREATE INDEX "clubs_rels_order_idx" ON "clubs_rels" USING btree ("order");
  CREATE INDEX "clubs_rels_parent_idx" ON "clubs_rels" USING btree ("parent_id");
  CREATE INDEX "clubs_rels_path_idx" ON "clubs_rels" USING btree ("path");
  CREATE INDEX "clubs_rels_media_id_idx" ON "clubs_rels" USING btree ("media_id");
  CREATE INDEX "_clubs_v_version_quick_facts_order_idx" ON "_clubs_v_version_quick_facts" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_quick_facts_parent_id_idx" ON "_clubs_v_version_quick_facts" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_version_key_events_order_idx" ON "_clubs_v_version_key_events" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_key_events_parent_id_idx" ON "_clubs_v_version_key_events" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_version_achievements_order_idx" ON "_clubs_v_version_achievements" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_achievements_parent_id_idx" ON "_clubs_v_version_achievements" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_version_faqs_order_idx" ON "_clubs_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_faqs_parent_id_idx" ON "_clubs_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_version_extra_socials_order_idx" ON "_clubs_v_version_extra_socials" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_extra_socials_parent_id_idx" ON "_clubs_v_version_extra_socials" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_rich_text_order_idx" ON "_clubs_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_rich_text_parent_id_idx" ON "_clubs_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_rich_text_path_idx" ON "_clubs_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_image_text_order_idx" ON "_clubs_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_image_text_parent_id_idx" ON "_clubs_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_image_text_path_idx" ON "_clubs_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_image_text_image_idx" ON "_clubs_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_clubs_v_blocks_cards_cards_order_idx" ON "_clubs_v_blocks_cards_cards" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_cards_cards_parent_id_idx" ON "_clubs_v_blocks_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_cards_cards_icon_idx" ON "_clubs_v_blocks_cards_cards" USING btree ("icon_id");
  CREATE INDEX "_clubs_v_blocks_cards_order_idx" ON "_clubs_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_cards_parent_id_idx" ON "_clubs_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_cards_path_idx" ON "_clubs_v_blocks_cards" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_gallery_order_idx" ON "_clubs_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_gallery_parent_id_idx" ON "_clubs_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_gallery_path_idx" ON "_clubs_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_link_list_links_order_idx" ON "_clubs_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_link_list_links_parent_id_idx" ON "_clubs_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_link_list_order_idx" ON "_clubs_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_link_list_parent_id_idx" ON "_clubs_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_link_list_path_idx" ON "_clubs_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_faq_items_order_idx" ON "_clubs_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_faq_items_parent_id_idx" ON "_clubs_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_faq_order_idx" ON "_clubs_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_faq_parent_id_idx" ON "_clubs_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_faq_path_idx" ON "_clubs_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_stats_items_order_idx" ON "_clubs_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_stats_items_parent_id_idx" ON "_clubs_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_stats_order_idx" ON "_clubs_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_stats_parent_id_idx" ON "_clubs_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_stats_path_idx" ON "_clubs_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_quote_order_idx" ON "_clubs_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_quote_parent_id_idx" ON "_clubs_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_quote_path_idx" ON "_clubs_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_clubs_v_blocks_cta_order_idx" ON "_clubs_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_clubs_v_blocks_cta_parent_id_idx" ON "_clubs_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_blocks_cta_path_idx" ON "_clubs_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_clubs_v_parent_idx" ON "_clubs_v" USING btree ("parent_id");
  CREATE INDEX "_clubs_v_version_version_slug_idx" ON "_clubs_v" USING btree ("version_slug");
  CREATE INDEX "_clubs_v_version_version_hero_idx" ON "_clubs_v" USING btree ("version_hero_id");
  CREATE INDEX "_clubs_v_version_version_logo_idx" ON "_clubs_v" USING btree ("version_logo_id");
  CREATE INDEX "_clubs_v_version_version_updated_at_idx" ON "_clubs_v" USING btree ("version_updated_at");
  CREATE INDEX "_clubs_v_version_version_created_at_idx" ON "_clubs_v" USING btree ("version_created_at");
  CREATE INDEX "_clubs_v_version_version__status_idx" ON "_clubs_v" USING btree ("version__status");
  CREATE INDEX "_clubs_v_created_at_idx" ON "_clubs_v" USING btree ("created_at");
  CREATE INDEX "_clubs_v_updated_at_idx" ON "_clubs_v" USING btree ("updated_at");
  CREATE INDEX "_clubs_v_latest_idx" ON "_clubs_v" USING btree ("latest");
  CREATE INDEX "_clubs_v_rels_order_idx" ON "_clubs_v_rels" USING btree ("order");
  CREATE INDEX "_clubs_v_rels_parent_idx" ON "_clubs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_clubs_v_rels_path_idx" ON "_clubs_v_rels" USING btree ("path");
  CREATE INDEX "_clubs_v_rels_media_id_idx" ON "_clubs_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_club_idx" ON "events" USING btree ("club_id");
  CREATE INDEX "events_cover_idx" ON "events" USING btree ("cover_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_club_idx" ON "_events_v" USING btree ("version_club_id");
  CREATE INDEX "_events_v_version_version_cover_idx" ON "_events_v" USING btree ("version_cover_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "albums_club_idx" ON "albums" USING btree ("club_id");
  CREATE INDEX "albums_event_idx" ON "albums" USING btree ("event_id");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "albums_rels" USING btree ("media_id");
  CREATE INDEX "people_club_idx" ON "people" USING btree ("club_id");
  CREATE INDEX "people_ay_idx" ON "people" USING btree ("ay");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_cards_order_idx" ON "pages_blocks_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_cards_parent_id_idx" ON "pages_blocks_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_cards_icon_idx" ON "pages_blocks_cards_cards" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_cards_order_idx" ON "pages_blocks_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_parent_id_idx" ON "pages_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_path_idx" ON "pages_blocks_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_link_list_links_order_idx" ON "pages_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_list_links_parent_id_idx" ON "pages_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_list_order_idx" ON "pages_blocks_link_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_list_parent_id_idx" ON "pages_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_list_path_idx" ON "pages_blocks_link_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_quote_order_idx" ON "pages_blocks_quote" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_parent_id_idx" ON "pages_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_path_idx" ON "pages_blocks_quote" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cards_cards_order_idx" ON "_pages_v_blocks_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_cards_parent_id_idx" ON "_pages_v_blocks_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_cards_icon_idx" ON "_pages_v_blocks_cards_cards" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_cards_order_idx" ON "_pages_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_parent_id_idx" ON "_pages_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_path_idx" ON "_pages_v_blocks_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_link_list_links_order_idx" ON "_pages_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_list_links_parent_id_idx" ON "_pages_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_list_order_idx" ON "_pages_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_list_parent_id_idx" ON "_pages_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_list_path_idx" ON "_pages_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quote_order_idx" ON "_pages_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_parent_id_idx" ON "_pages_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_path_idx" ON "_pages_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "resources_club_idx" ON "resources" USING btree ("club_id");
  CREATE INDEX "resources_ay_idx" ON "resources" USING btree ("ay");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "resources_filename_idx" ON "resources" USING btree ("filename");
  CREATE INDEX "media_club_idx" ON "media" USING btree ("club_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_club_idx" ON "users" USING btree ("club_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_clubs_id_idx" ON "payload_locked_documents_rels" USING btree ("clubs_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_hero_buttons_order_idx" ON "site_settings_hero_buttons" USING btree ("_order");
  CREATE INDEX "site_settings_hero_buttons_parent_id_idx" ON "site_settings_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_motto_words_order_idx" ON "site_settings_motto_words" USING btree ("_order");
  CREATE INDEX "site_settings_motto_words_parent_id_idx" ON "site_settings_motto_words" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_rich_text_order_idx" ON "site_settings_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_rich_text_parent_id_idx" ON "site_settings_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_rich_text_path_idx" ON "site_settings_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_image_text_order_idx" ON "site_settings_blocks_image_text" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_image_text_parent_id_idx" ON "site_settings_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_image_text_path_idx" ON "site_settings_blocks_image_text" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_image_text_image_idx" ON "site_settings_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "site_settings_blocks_cards_cards_order_idx" ON "site_settings_blocks_cards_cards" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_cards_cards_parent_id_idx" ON "site_settings_blocks_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_cards_cards_icon_idx" ON "site_settings_blocks_cards_cards" USING btree ("icon_id");
  CREATE INDEX "site_settings_blocks_cards_order_idx" ON "site_settings_blocks_cards" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_cards_parent_id_idx" ON "site_settings_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_cards_path_idx" ON "site_settings_blocks_cards" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_gallery_order_idx" ON "site_settings_blocks_gallery" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_gallery_parent_id_idx" ON "site_settings_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_gallery_path_idx" ON "site_settings_blocks_gallery" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_link_list_links_order_idx" ON "site_settings_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_link_list_links_parent_id_idx" ON "site_settings_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_link_list_order_idx" ON "site_settings_blocks_link_list" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_link_list_parent_id_idx" ON "site_settings_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_link_list_path_idx" ON "site_settings_blocks_link_list" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_faq_items_order_idx" ON "site_settings_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_faq_items_parent_id_idx" ON "site_settings_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_faq_order_idx" ON "site_settings_blocks_faq" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_faq_parent_id_idx" ON "site_settings_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_faq_path_idx" ON "site_settings_blocks_faq" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_stats_items_order_idx" ON "site_settings_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_stats_items_parent_id_idx" ON "site_settings_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_stats_order_idx" ON "site_settings_blocks_stats" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_stats_parent_id_idx" ON "site_settings_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_stats_path_idx" ON "site_settings_blocks_stats" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_quote_order_idx" ON "site_settings_blocks_quote" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_quote_parent_id_idx" ON "site_settings_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_quote_path_idx" ON "site_settings_blocks_quote" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_cta_order_idx" ON "site_settings_blocks_cta" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_cta_parent_id_idx" ON "site_settings_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_cta_path_idx" ON "site_settings_blocks_cta" USING btree ("_path");
  CREATE INDEX "site_settings_nav_order_idx" ON "site_settings_nav" USING btree ("_order");
  CREATE INDEX "site_settings_nav_parent_id_idx" ON "site_settings_nav" USING btree ("_parent_id");
  CREATE INDEX "site_settings_faqs_order_idx" ON "site_settings_faqs" USING btree ("_order");
  CREATE INDEX "site_settings_faqs_parent_id_idx" ON "site_settings_faqs" USING btree ("_parent_id");
  CREATE INDEX "site_settings_extra_socials_order_idx" ON "site_settings_extra_socials" USING btree ("_order");
  CREATE INDEX "site_settings_extra_socials_parent_id_idx" ON "site_settings_extra_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_committee_photo_idx" ON "site_settings" USING btree ("committee_photo_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_media_id_idx" ON "site_settings_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "clubs_quick_facts" CASCADE;
  DROP TABLE "clubs_key_events" CASCADE;
  DROP TABLE "clubs_achievements" CASCADE;
  DROP TABLE "clubs_faqs" CASCADE;
  DROP TABLE "clubs_extra_socials" CASCADE;
  DROP TABLE "clubs_blocks_rich_text" CASCADE;
  DROP TABLE "clubs_blocks_image_text" CASCADE;
  DROP TABLE "clubs_blocks_cards_cards" CASCADE;
  DROP TABLE "clubs_blocks_cards" CASCADE;
  DROP TABLE "clubs_blocks_gallery" CASCADE;
  DROP TABLE "clubs_blocks_link_list_links" CASCADE;
  DROP TABLE "clubs_blocks_link_list" CASCADE;
  DROP TABLE "clubs_blocks_faq_items" CASCADE;
  DROP TABLE "clubs_blocks_faq" CASCADE;
  DROP TABLE "clubs_blocks_stats_items" CASCADE;
  DROP TABLE "clubs_blocks_stats" CASCADE;
  DROP TABLE "clubs_blocks_quote" CASCADE;
  DROP TABLE "clubs_blocks_cta" CASCADE;
  DROP TABLE "clubs" CASCADE;
  DROP TABLE "clubs_rels" CASCADE;
  DROP TABLE "_clubs_v_version_quick_facts" CASCADE;
  DROP TABLE "_clubs_v_version_key_events" CASCADE;
  DROP TABLE "_clubs_v_version_achievements" CASCADE;
  DROP TABLE "_clubs_v_version_faqs" CASCADE;
  DROP TABLE "_clubs_v_version_extra_socials" CASCADE;
  DROP TABLE "_clubs_v_blocks_rich_text" CASCADE;
  DROP TABLE "_clubs_v_blocks_image_text" CASCADE;
  DROP TABLE "_clubs_v_blocks_cards_cards" CASCADE;
  DROP TABLE "_clubs_v_blocks_cards" CASCADE;
  DROP TABLE "_clubs_v_blocks_gallery" CASCADE;
  DROP TABLE "_clubs_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_clubs_v_blocks_link_list" CASCADE;
  DROP TABLE "_clubs_v_blocks_faq_items" CASCADE;
  DROP TABLE "_clubs_v_blocks_faq" CASCADE;
  DROP TABLE "_clubs_v_blocks_stats_items" CASCADE;
  DROP TABLE "_clubs_v_blocks_stats" CASCADE;
  DROP TABLE "_clubs_v_blocks_quote" CASCADE;
  DROP TABLE "_clubs_v_blocks_cta" CASCADE;
  DROP TABLE "_clubs_v" CASCADE;
  DROP TABLE "_clubs_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_cards" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_link_list_links" CASCADE;
  DROP TABLE "pages_blocks_link_list" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_quote" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_pages_v_blocks_link_list" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_hero_buttons" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_motto_words" CASCADE;
  DROP TABLE "site_settings_blocks_rich_text" CASCADE;
  DROP TABLE "site_settings_blocks_image_text" CASCADE;
  DROP TABLE "site_settings_blocks_cards_cards" CASCADE;
  DROP TABLE "site_settings_blocks_cards" CASCADE;
  DROP TABLE "site_settings_blocks_gallery" CASCADE;
  DROP TABLE "site_settings_blocks_link_list_links" CASCADE;
  DROP TABLE "site_settings_blocks_link_list" CASCADE;
  DROP TABLE "site_settings_blocks_faq_items" CASCADE;
  DROP TABLE "site_settings_blocks_faq" CASCADE;
  DROP TABLE "site_settings_blocks_stats_items" CASCADE;
  DROP TABLE "site_settings_blocks_stats" CASCADE;
  DROP TABLE "site_settings_blocks_quote" CASCADE;
  DROP TABLE "site_settings_blocks_cta" CASCADE;
  DROP TABLE "site_settings_nav" CASCADE;
  DROP TABLE "site_settings_faqs" CASCADE;
  DROP TABLE "site_settings_extra_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TYPE "public"."enum_clubs_blocks_image_text_image_position";
  DROP TYPE "public"."enum_clubs_blocks_gallery_columns";
  DROP TYPE "public"."enum_clubs_blocks_cta_tone";
  DROP TYPE "public"."enum_clubs_slug";
  DROP TYPE "public"."enum_clubs_accent";
  DROP TYPE "public"."enum_clubs_status";
  DROP TYPE "public"."enum__clubs_v_blocks_image_text_image_position";
  DROP TYPE "public"."enum__clubs_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__clubs_v_blocks_cta_tone";
  DROP TYPE "public"."enum__clubs_v_version_slug";
  DROP TYPE "public"."enum__clubs_v_version_accent";
  DROP TYPE "public"."enum__clubs_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_cta_tone";
  DROP TYPE "public"."enum_pages_slug";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_cta_tone";
  DROP TYPE "public"."enum__pages_v_version_slug";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_settings_hero_buttons_tone";
  DROP TYPE "public"."enum_site_settings_blocks_image_text_image_position";
  DROP TYPE "public"."enum_site_settings_blocks_gallery_columns";
  DROP TYPE "public"."enum_site_settings_blocks_cta_tone";`)
}
