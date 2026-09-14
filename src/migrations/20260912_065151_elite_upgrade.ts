import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
 CREATE TABLE IF NOT EXISTS smux_rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL);
 CREATE INDEX IF NOT EXISTS smux_rate_limits_expiry ON smux_rate_limits(expires_at);
 CREATE TABLE IF NOT EXISTS smux_mail_outbox (id serial PRIMARY KEY, key text UNIQUE NOT NULL, user_id integer NOT NULL, interest_id integer NOT NULL, subject text NOT NULL, body text NOT NULL, state text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now());
 CREATE INDEX IF NOT EXISTS smux_mail_outbox_state ON smux_mail_outbox(state,updated_at);

   CREATE TYPE "public"."enum_clubs_discovery_environment" AS ENUM('land', 'water', 'mixed');
  CREATE TYPE "public"."enum__clubs_v_version_discovery_environment" AS ENUM('land', 'water', 'mixed');
  CREATE TYPE "public"."enum_events_registration_mode" AS ENUM('external', 'native');
  CREATE TYPE "public"."enum_events_activity" AS ENUM('ride', 'dive', 'paddle', 'skate', 'hike', 'social', 'other');
  CREATE TYPE "public"."enum_events_review_state" AS ENUM('draft', 'ready', 'approved');
  CREATE TYPE "public"."enum__events_v_version_registration_mode" AS ENUM('external', 'native');
  CREATE TYPE "public"."enum__events_v_version_activity" AS ENUM('ride', 'dive', 'paddle', 'skate', 'hike', 'social', 'other');
  CREATE TYPE "public"."enum__events_v_version_review_state" AS ENUM('draft', 'ready', 'approved');
  CREATE TYPE "public"."enum_resources_audience" AS ENUM('members', 'committee');
  CREATE TYPE "public"."enum_resources_category" AS ENUM('safety', 'packing', 'handover', 'other');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_campaigns_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__campaigns_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_registrations_status" AS ENUM('registered', 'waitlisted', 'cancelled');
  CREATE TYPE "public"."enum_publish_jobs_state" AS ENUM('pending', 'running', 'complete', 'failed');
  CREATE TYPE "public"."enum_metrics_kind" AS ENUM('club-view', 'signup-click', 'calendar-add', 'campaign-view');
  CREATE TYPE "public"."enum_invitations_role" AS ENUM('member', 'editor');
  CREATE TYPE "public"."enum_contact_requests_state" AS ENUM('new', 'in-progress', 'resolved');
  CREATE TYPE "public"."enum_link_checks_state" AS ENUM('healthy', 'review', 'failed');
  CREATE TYPE "public"."enum__site_settings_v_version_hero_buttons_tone" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__site_settings_v_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__site_settings_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__site_settings_v_blocks_cta_tone" AS ENUM('dark', 'accent', 'quiet');
  CREATE TABLE "_albums_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar NOT NULL,
    "version_club_id" integer,
    "version_event_id" integer,
    "version_date" timestamp(3) with time zone,
    "version_summary" varchar,
    "version_photo_credit" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_albums_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE "_people_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar NOT NULL,
    "version_role" varchar NOT NULL,
    "version_club_id" integer,
    "version_ay" varchar NOT NULL,
    "version_photo_id" integer,
    "version_contact" varchar,
    "version_display_order" numeric DEFAULT 100,
    "version_archived" boolean DEFAULT false,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_media_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_alt" varchar NOT NULL,
    "version_club_id" integer,
    "version_credit" varchar,
    "version_caption" varchar,
    "version_prefix" varchar DEFAULT 'media',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version_url" varchar,
    "version_thumbnail_u_r_l" varchar,
    "version_filename" varchar,
    "version_mime_type" varchar,
    "version_filesize" numeric,
    "version_width" numeric,
    "version_height" numeric,
    "version_focal_x" numeric,
    "version_focal_y" numeric,
    "version_sizes_small_url" varchar,
    "version_sizes_small_width" numeric,
    "version_sizes_small_height" numeric,
    "version_sizes_small_mime_type" varchar,
    "version_sizes_small_filesize" numeric,
    "version_sizes_small_filename" varchar,
    "version_sizes_medium_url" varchar,
    "version_sizes_medium_width" numeric,
    "version_sizes_medium_height" numeric,
    "version_sizes_medium_mime_type" varchar,
    "version_sizes_medium_filesize" numeric,
    "version_sizes_medium_filename" varchar,
    "version_sizes_large_url" varchar,
    "version_sizes_large_width" numeric,
    "version_sizes_large_height" numeric,
    "version_sizes_large_mime_type" varchar,
    "version_sizes_large_filesize" numeric,
    "version_sizes_large_filename" varchar,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "stories" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "club_id" integer,
    "summary" varchar,
    "cover_id" integer,
    "body" jsonb,
    "album_id" integer,
    "destination" varchar,
    "latitude" numeric,
    "longitude" numeric,
    "author" varchar,
    "photo_credit" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_stories_status" DEFAULT 'draft'
  );

  CREATE TABLE "_stories_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_club_id" integer,
    "version_summary" varchar,
    "version_cover_id" integer,
    "version_body" jsonb,
    "version_album_id" integer,
    "version_destination" varchar,
    "version_latitude" numeric,
    "version_longitude" numeric,
    "version_author" varchar,
    "version_photo_credit" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__stories_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "campaigns" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "intro" varchar,
    "starts_at" timestamp(3) with time zone,
    "ends_at" timestamp(3) with time zone,
    "venue" varchar,
    "cover_id" integer,
    "body" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_campaigns_status" DEFAULT 'draft'
  );

  CREATE TABLE "campaigns_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "clubs_id" integer
  );

  CREATE TABLE "_campaigns_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_intro" varchar,
    "version_starts_at" timestamp(3) with time zone,
    "version_ends_at" timestamp(3) with time zone,
    "version_venue" varchar,
    "version_cover_id" integer,
    "version_body" jsonb,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__campaigns_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "_campaigns_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "clubs_id" integer
  );

  CREATE TABLE "benefits" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "club_id" integer,
    "description" varchar NOT NULL,
    "eligibility" varchar NOT NULL,
    "url" varchar,
    "expires_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_benefits_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar NOT NULL,
    "version_club_id" integer,
    "version_description" varchar NOT NULL,
    "version_eligibility" varchar NOT NULL,
    "version_url" varchar,
    "version_expires_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "registrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "reference" varchar NOT NULL,
    "event_id" integer NOT NULL,
    "club_id" integer,
    "user_id" integer NOT NULL,
    "status" "enum_registrations_status" NOT NULL,
    "checked_in_at" timestamp(3) with time zone,
    "check_in_token_hash" varchar,
    "check_in_expires_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "interests" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL,
    "event_id" integer,
    "club_id" integer,
    "key" varchar NOT NULL,
    "consented_at" timestamp(3) with time zone NOT NULL,
    "active" boolean DEFAULT true,
    "last_notified_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "audit_log" (
    "id" serial PRIMARY KEY NOT NULL,
    "action" varchar NOT NULL,
    "actor_id" integer,
    "club_id" integer,
    "collection_name" varchar,
    "document_id" varchar,
    "details" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "publish_jobs" (
    "id" serial PRIMARY KEY NOT NULL,
    "paths" jsonb NOT NULL,
    "state" "enum_publish_jobs_state" DEFAULT 'pending',
    "attempts" numeric DEFAULT 0,
    "last_error" varchar,
    "finished_at" timestamp(3) with time zone,
    "club_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "metrics" (
    "id" serial PRIMARY KEY NOT NULL,
    "kind" "enum_metrics_kind" NOT NULL,
    "subject" varchar NOT NULL,
    "day" varchar NOT NULL,
    "count" numeric DEFAULT 1,
    "key" varchar NOT NULL,
    "club_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "invitations" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar NOT NULL,
    "role" "enum_invitations_role" NOT NULL,
    "club_id" integer,
    "token_hash" varchar NOT NULL,
    "expires_at" timestamp(3) with time zone NOT NULL,
    "accepted_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "contact_requests" (
    "id" serial PRIMARY KEY NOT NULL,
    "subject" varchar NOT NULL,
    "email" varchar NOT NULL,
    "club_id" integer,
    "message" varchar NOT NULL,
    "state" "enum_contact_requests_state" DEFAULT 'new',
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "link_checks" (
    "id" serial PRIMARY KEY NOT NULL,
    "url" varchar NOT NULL,
    "club_id" integer,
    "state" "enum_link_checks_state" NOT NULL,
    "status_code" numeric,
    "checked_at" timestamp(3) with time zone,
    "note" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_site_settings_v_version_hero_buttons" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL,
    "tone" "enum__site_settings_v_version_hero_buttons_tone" DEFAULT 'primary',
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar NOT NULL,
    "label" varchar NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_motto_words" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "word" varchar NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_rich_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "content" jsonb NOT NULL,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_image_text" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer NOT NULL,
    "content" jsonb NOT NULL,
    "image_position" "enum__site_settings_v_blocks_image_text_image_position" DEFAULT 'left',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_cards_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "body" varchar,
    "icon_id" integer,
    "link_url" varchar,
    "link_label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_cards" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "columns" "enum__site_settings_v_blocks_gallery_columns" DEFAULT '4',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_link_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL,
    "description" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_link_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" jsonb NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_stats_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar NOT NULL,
    "label" varchar NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "quote" varchar NOT NULL,
    "attribution" varchar,
    "role" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_blocks_cta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "body" varchar,
    "button_label" varchar,
    "button_url" varchar,
    "tone" "enum__site_settings_v_blocks_cta_tone" DEFAULT 'dark',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_site_settings_v_version_nav" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "href" varchar NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" varchar NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_extra_socials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_current_academic_year" varchar,
    "version_contact_form_enabled" boolean DEFAULT false,
    "version_hero_heading" varchar,
    "version_motto" varchar,
    "version_home_labels_clubs_eyebrow" varchar,
    "version_home_labels_clubs_title" varchar,
    "version_home_labels_events_eyebrow" varchar,
    "version_home_labels_events_title" varchar,
    "version_home_labels_socials_title" varchar,
    "version_committee_eyebrow" varchar,
    "version_committee_title" varchar,
    "version_committee_intro" jsonb,
    "version_committee_events_title" varchar,
    "version_committee_people_title" varchar,
    "version_committee_photo_id" integer,
    "version_footer_note" varchar,
    "version_banner_enabled" boolean DEFAULT false,
    "version_banner_text" varchar,
    "version_banner_url" varchar,
    "version_about" jsonb,
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
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_site_settings_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  ALTER TABLE "clubs" ADD COLUMN "discovery_environment" "enum_clubs_discovery_environment";
  ALTER TABLE "clubs" ADD COLUMN "discovery_commitment" varchar;
  ALTER TABLE "clubs" ADD COLUMN "discovery_cost_guide" varchar;
  ALTER TABLE "clubs" ADD COLUMN "discovery_beginner_friendly" boolean DEFAULT false;
  ALTER TABLE "clubs" ADD COLUMN "discovery_verified_at" timestamp(3) with time zone;
  ALTER TABLE "_clubs_v" ADD COLUMN "version_discovery_environment" "enum__clubs_v_version_discovery_environment";
  ALTER TABLE "_clubs_v" ADD COLUMN "version_discovery_commitment" varchar;
  ALTER TABLE "_clubs_v" ADD COLUMN "version_discovery_cost_guide" varchar;
  ALTER TABLE "_clubs_v" ADD COLUMN "version_discovery_beginner_friendly" boolean DEFAULT false;
  ALTER TABLE "_clubs_v" ADD COLUMN "version_discovery_verified_at" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN "registration_mode" "enum_events_registration_mode" DEFAULT 'external';
  ALTER TABLE "events" ADD COLUMN "cancelled" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "cancellation_reason" varchar;
  ALTER TABLE "events" ADD COLUMN "organizer_contact" varchar;
  ALTER TABLE "events" ADD COLUMN "prerequisites" varchar;
  ALTER TABLE "events" ADD COLUMN "itinerary" jsonb;
  ALTER TABLE "events" ADD COLUMN "packing_list" jsonb;
  ALTER TABLE "events" ADD COLUMN "activity" "enum_events_activity";
  ALTER TABLE "events" ADD COLUMN "beginner_friendly" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "review_state" "enum_events_review_state" DEFAULT 'draft';
  ALTER TABLE "events" ADD COLUMN "external_id" varchar;
  ALTER TABLE "events" ADD COLUMN "series_id" varchar;
  ALTER TABLE "events" ADD COLUMN "archived" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_registration_mode" "enum__events_v_version_registration_mode" DEFAULT 'external';
  ALTER TABLE "_events_v" ADD COLUMN "version_cancelled" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_cancellation_reason" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_organizer_contact" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_prerequisites" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_itinerary" jsonb;
  ALTER TABLE "_events_v" ADD COLUMN "version_packing_list" jsonb;
  ALTER TABLE "_events_v" ADD COLUMN "version_activity" "enum__events_v_version_activity";
  ALTER TABLE "_events_v" ADD COLUMN "version_beginner_friendly" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_review_state" "enum__events_v_version_review_state" DEFAULT 'draft';
  ALTER TABLE "_events_v" ADD COLUMN "version_external_id" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_series_id" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_archived" boolean DEFAULT false;
  ALTER TABLE "albums" ADD COLUMN "summary" varchar;
  ALTER TABLE "albums" ADD COLUMN "photo_credit" varchar;
  ALTER TABLE "people" ADD COLUMN "display_order" numeric DEFAULT 100;
  ALTER TABLE "people" ADD COLUMN "archived" boolean DEFAULT false;
  ALTER TABLE "resources" ADD COLUMN "audience" "enum_resources_audience" DEFAULT 'members';
  ALTER TABLE "resources" ADD COLUMN "category" "enum_resources_category" DEFAULT 'other';
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "users" ADD COLUMN "active" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "requires_review" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "campaigns_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "benefits_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "registrations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "interests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audit_log_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "publish_jobs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "metrics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invitations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_requests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "link_checks_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "current_academic_year" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_form_enabled" boolean DEFAULT false;
  ALTER TABLE "_albums_v" ADD CONSTRAINT "_albums_v_parent_id_albums_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v" ADD CONSTRAINT "_albums_v_version_club_id_clubs_id_fk" FOREIGN KEY ("version_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v" ADD CONSTRAINT "_albums_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v_rels" ADD CONSTRAINT "_albums_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_albums_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v_rels" ADD CONSTRAINT "_albums_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_club_id_clubs_id_fk" FOREIGN KEY ("version_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_club_id_clubs_id_fk" FOREIGN KEY ("version_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_club_id_clubs_id_fk" FOREIGN KEY ("version_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_album_id_albums_id_fk" FOREIGN KEY ("version_album_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns_rels" ADD CONSTRAINT "campaigns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_rels" ADD CONSTRAINT "campaigns_rels_clubs_fk" FOREIGN KEY ("clubs_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v" ADD CONSTRAINT "_campaigns_v_parent_id_campaigns_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_campaigns_v" ADD CONSTRAINT "_campaigns_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_campaigns_v_rels" ADD CONSTRAINT "_campaigns_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_campaigns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v_rels" ADD CONSTRAINT "_campaigns_v_rels_clubs_fk" FOREIGN KEY ("clubs_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "benefits" ADD CONSTRAINT "benefits_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_benefits_v" ADD CONSTRAINT "_benefits_v_parent_id_benefits_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."benefits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_benefits_v" ADD CONSTRAINT "_benefits_v_version_club_id_clubs_id_fk" FOREIGN KEY ("version_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interests" ADD CONSTRAINT "interests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interests" ADD CONSTRAINT "interests_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interests" ADD CONSTRAINT "interests_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publish_jobs" ADD CONSTRAINT "publish_jobs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "metrics" ADD CONSTRAINT "metrics_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invitations" ADD CONSTRAINT "invitations_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "link_checks" ADD CONSTRAINT "link_checks_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_hero_buttons" ADD CONSTRAINT "_site_settings_v_version_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_stats" ADD CONSTRAINT "_site_settings_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_motto_words" ADD CONSTRAINT "_site_settings_v_version_motto_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_rich_text" ADD CONSTRAINT "_site_settings_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_image_text" ADD CONSTRAINT "_site_settings_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_image_text" ADD CONSTRAINT "_site_settings_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_cards_cards" ADD CONSTRAINT "_site_settings_v_blocks_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_cards_cards" ADD CONSTRAINT "_site_settings_v_blocks_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_cards" ADD CONSTRAINT "_site_settings_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_gallery" ADD CONSTRAINT "_site_settings_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_link_list_links" ADD CONSTRAINT "_site_settings_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_link_list" ADD CONSTRAINT "_site_settings_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_faq_items" ADD CONSTRAINT "_site_settings_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_faq" ADD CONSTRAINT "_site_settings_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_stats_items" ADD CONSTRAINT "_site_settings_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_stats" ADD CONSTRAINT "_site_settings_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_quote" ADD CONSTRAINT "_site_settings_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_cta" ADD CONSTRAINT "_site_settings_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_nav" ADD CONSTRAINT "_site_settings_v_version_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_faqs" ADD CONSTRAINT "_site_settings_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_extra_socials" ADD CONSTRAINT "_site_settings_v_version_extra_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_committee_photo_id_media_id_fk" FOREIGN KEY ("version_committee_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_albums_v_parent_idx" ON "_albums_v" USING btree ("parent_id");
  CREATE INDEX "_albums_v_version_version_club_idx" ON "_albums_v" USING btree ("version_club_id");
  CREATE INDEX "_albums_v_version_version_event_idx" ON "_albums_v" USING btree ("version_event_id");
  CREATE INDEX "_albums_v_version_version_updated_at_idx" ON "_albums_v" USING btree ("version_updated_at");
  CREATE INDEX "_albums_v_version_version_created_at_idx" ON "_albums_v" USING btree ("version_created_at");
  CREATE INDEX "_albums_v_created_at_idx" ON "_albums_v" USING btree ("created_at");
  CREATE INDEX "_albums_v_updated_at_idx" ON "_albums_v" USING btree ("updated_at");
  CREATE INDEX "_albums_v_rels_order_idx" ON "_albums_v_rels" USING btree ("order");
  CREATE INDEX "_albums_v_rels_parent_idx" ON "_albums_v_rels" USING btree ("parent_id");
  CREATE INDEX "_albums_v_rels_path_idx" ON "_albums_v_rels" USING btree ("path");
  CREATE INDEX "_albums_v_rels_media_id_idx" ON "_albums_v_rels" USING btree ("media_id");
  CREATE INDEX "_people_v_parent_idx" ON "_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_club_idx" ON "_people_v" USING btree ("version_club_id");
  CREATE INDEX "_people_v_version_version_ay_idx" ON "_people_v" USING btree ("version_ay");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_created_at_idx" ON "_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "_people_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_club_idx" ON "_media_v" USING btree ("version_club_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_sizes_small_version_sizes_small_filenam_idx" ON "_media_v" USING btree ("version_sizes_small_filename");
  CREATE INDEX "_media_v_version_sizes_medium_version_sizes_medium_filen_idx" ON "_media_v" USING btree ("version_sizes_medium_filename");
  CREATE INDEX "_media_v_version_sizes_large_version_sizes_large_filenam_idx" ON "_media_v" USING btree ("version_sizes_large_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_club_idx" ON "stories" USING btree ("club_id");
  CREATE INDEX "stories_cover_idx" ON "stories" USING btree ("cover_id");
  CREATE INDEX "stories_album_idx" ON "stories" USING btree ("album_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_club_idx" ON "_stories_v" USING btree ("version_club_id");
  CREATE INDEX "_stories_v_version_version_cover_idx" ON "_stories_v" USING btree ("version_cover_id");
  CREATE INDEX "_stories_v_version_version_album_idx" ON "_stories_v" USING btree ("version_album_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "campaigns_slug_idx" ON "campaigns" USING btree ("slug");
  CREATE INDEX "campaigns_cover_idx" ON "campaigns" USING btree ("cover_id");
  CREATE INDEX "campaigns_updated_at_idx" ON "campaigns" USING btree ("updated_at");
  CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");
  CREATE INDEX "campaigns__status_idx" ON "campaigns" USING btree ("_status");
  CREATE INDEX "campaigns_rels_order_idx" ON "campaigns_rels" USING btree ("order");
  CREATE INDEX "campaigns_rels_parent_idx" ON "campaigns_rels" USING btree ("parent_id");
  CREATE INDEX "campaigns_rels_path_idx" ON "campaigns_rels" USING btree ("path");
  CREATE INDEX "campaigns_rels_clubs_id_idx" ON "campaigns_rels" USING btree ("clubs_id");
  CREATE INDEX "_campaigns_v_parent_idx" ON "_campaigns_v" USING btree ("parent_id");
  CREATE INDEX "_campaigns_v_version_version_slug_idx" ON "_campaigns_v" USING btree ("version_slug");
  CREATE INDEX "_campaigns_v_version_version_cover_idx" ON "_campaigns_v" USING btree ("version_cover_id");
  CREATE INDEX "_campaigns_v_version_version_updated_at_idx" ON "_campaigns_v" USING btree ("version_updated_at");
  CREATE INDEX "_campaigns_v_version_version_created_at_idx" ON "_campaigns_v" USING btree ("version_created_at");
  CREATE INDEX "_campaigns_v_version_version__status_idx" ON "_campaigns_v" USING btree ("version__status");
  CREATE INDEX "_campaigns_v_created_at_idx" ON "_campaigns_v" USING btree ("created_at");
  CREATE INDEX "_campaigns_v_updated_at_idx" ON "_campaigns_v" USING btree ("updated_at");
  CREATE INDEX "_campaigns_v_latest_idx" ON "_campaigns_v" USING btree ("latest");
  CREATE INDEX "_campaigns_v_rels_order_idx" ON "_campaigns_v_rels" USING btree ("order");
  CREATE INDEX "_campaigns_v_rels_parent_idx" ON "_campaigns_v_rels" USING btree ("parent_id");
  CREATE INDEX "_campaigns_v_rels_path_idx" ON "_campaigns_v_rels" USING btree ("path");
  CREATE INDEX "_campaigns_v_rels_clubs_id_idx" ON "_campaigns_v_rels" USING btree ("clubs_id");
  CREATE INDEX "benefits_club_idx" ON "benefits" USING btree ("club_id");
  CREATE INDEX "benefits_updated_at_idx" ON "benefits" USING btree ("updated_at");
  CREATE INDEX "benefits_created_at_idx" ON "benefits" USING btree ("created_at");
  CREATE INDEX "_benefits_v_parent_idx" ON "_benefits_v" USING btree ("parent_id");
  CREATE INDEX "_benefits_v_version_version_club_idx" ON "_benefits_v" USING btree ("version_club_id");
  CREATE INDEX "_benefits_v_version_version_updated_at_idx" ON "_benefits_v" USING btree ("version_updated_at");
  CREATE INDEX "_benefits_v_version_version_created_at_idx" ON "_benefits_v" USING btree ("version_created_at");
  CREATE INDEX "_benefits_v_created_at_idx" ON "_benefits_v" USING btree ("created_at");
  CREATE INDEX "_benefits_v_updated_at_idx" ON "_benefits_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "registrations_reference_idx" ON "registrations" USING btree ("reference");
  CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");
  CREATE INDEX "registrations_club_idx" ON "registrations" USING btree ("club_id");
  CREATE INDEX "registrations_user_idx" ON "registrations" USING btree ("user_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE INDEX "interests_user_idx" ON "interests" USING btree ("user_id");
  CREATE INDEX "interests_event_idx" ON "interests" USING btree ("event_id");
  CREATE INDEX "interests_club_idx" ON "interests" USING btree ("club_id");
  CREATE UNIQUE INDEX "interests_key_idx" ON "interests" USING btree ("key");
  CREATE INDEX "interests_updated_at_idx" ON "interests" USING btree ("updated_at");
  CREATE INDEX "interests_created_at_idx" ON "interests" USING btree ("created_at");
  CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");
  CREATE INDEX "audit_log_club_idx" ON "audit_log" USING btree ("club_id");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE INDEX "publish_jobs_state_idx" ON "publish_jobs" USING btree ("state");
  CREATE INDEX "publish_jobs_club_idx" ON "publish_jobs" USING btree ("club_id");
  CREATE INDEX "publish_jobs_updated_at_idx" ON "publish_jobs" USING btree ("updated_at");
  CREATE INDEX "publish_jobs_created_at_idx" ON "publish_jobs" USING btree ("created_at");
  CREATE INDEX "metrics_kind_idx" ON "metrics" USING btree ("kind");
  CREATE INDEX "metrics_subject_idx" ON "metrics" USING btree ("subject");
  CREATE INDEX "metrics_day_idx" ON "metrics" USING btree ("day");
  CREATE UNIQUE INDEX "metrics_key_idx" ON "metrics" USING btree ("key");
  CREATE INDEX "metrics_club_idx" ON "metrics" USING btree ("club_id");
  CREATE INDEX "metrics_updated_at_idx" ON "metrics" USING btree ("updated_at");
  CREATE INDEX "metrics_created_at_idx" ON "metrics" USING btree ("created_at");
  CREATE INDEX "invitations_club_idx" ON "invitations" USING btree ("club_id");
  CREATE INDEX "invitations_updated_at_idx" ON "invitations" USING btree ("updated_at");
  CREATE INDEX "invitations_created_at_idx" ON "invitations" USING btree ("created_at");
  CREATE INDEX "contact_requests_club_idx" ON "contact_requests" USING btree ("club_id");
  CREATE INDEX "contact_requests_updated_at_idx" ON "contact_requests" USING btree ("updated_at");
  CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests" USING btree ("created_at");
  CREATE INDEX "link_checks_club_idx" ON "link_checks" USING btree ("club_id");
  CREATE INDEX "link_checks_updated_at_idx" ON "link_checks" USING btree ("updated_at");
  CREATE INDEX "link_checks_created_at_idx" ON "link_checks" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_version_hero_buttons_order_idx" ON "_site_settings_v_version_hero_buttons" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_hero_buttons_parent_id_idx" ON "_site_settings_v_version_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_stats_order_idx" ON "_site_settings_v_version_stats" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_stats_parent_id_idx" ON "_site_settings_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_motto_words_order_idx" ON "_site_settings_v_version_motto_words" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_motto_words_parent_id_idx" ON "_site_settings_v_version_motto_words" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_rich_text_order_idx" ON "_site_settings_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_rich_text_parent_id_idx" ON "_site_settings_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_rich_text_path_idx" ON "_site_settings_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_image_text_order_idx" ON "_site_settings_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_image_text_parent_id_idx" ON "_site_settings_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_image_text_path_idx" ON "_site_settings_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_image_text_image_idx" ON "_site_settings_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_site_settings_v_blocks_cards_cards_order_idx" ON "_site_settings_v_blocks_cards_cards" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_cards_cards_parent_id_idx" ON "_site_settings_v_blocks_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_cards_cards_icon_idx" ON "_site_settings_v_blocks_cards_cards" USING btree ("icon_id");
  CREATE INDEX "_site_settings_v_blocks_cards_order_idx" ON "_site_settings_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_cards_parent_id_idx" ON "_site_settings_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_cards_path_idx" ON "_site_settings_v_blocks_cards" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_gallery_order_idx" ON "_site_settings_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_gallery_parent_id_idx" ON "_site_settings_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_gallery_path_idx" ON "_site_settings_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_link_list_links_order_idx" ON "_site_settings_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_link_list_links_parent_id_idx" ON "_site_settings_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_link_list_order_idx" ON "_site_settings_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_link_list_parent_id_idx" ON "_site_settings_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_link_list_path_idx" ON "_site_settings_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_faq_items_order_idx" ON "_site_settings_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_faq_items_parent_id_idx" ON "_site_settings_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_faq_order_idx" ON "_site_settings_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_faq_parent_id_idx" ON "_site_settings_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_faq_path_idx" ON "_site_settings_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_stats_items_order_idx" ON "_site_settings_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_stats_items_parent_id_idx" ON "_site_settings_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_stats_order_idx" ON "_site_settings_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_stats_parent_id_idx" ON "_site_settings_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_stats_path_idx" ON "_site_settings_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_quote_order_idx" ON "_site_settings_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_quote_parent_id_idx" ON "_site_settings_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_quote_path_idx" ON "_site_settings_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_cta_order_idx" ON "_site_settings_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_cta_parent_id_idx" ON "_site_settings_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_cta_path_idx" ON "_site_settings_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_site_settings_v_version_nav_order_idx" ON "_site_settings_v_version_nav" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_nav_parent_id_idx" ON "_site_settings_v_version_nav" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_faqs_order_idx" ON "_site_settings_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_faqs_parent_id_idx" ON "_site_settings_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_extra_socials_order_idx" ON "_site_settings_v_version_extra_socials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_extra_socials_parent_id_idx" ON "_site_settings_v_version_extra_socials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_committee_photo_idx" ON "_site_settings_v" USING btree ("version_committee_photo_id");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_rels_order_idx" ON "_site_settings_v_rels" USING btree ("order");
  CREATE INDEX "_site_settings_v_rels_parent_idx" ON "_site_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_site_settings_v_rels_path_idx" ON "_site_settings_v_rels" USING btree ("path");
  CREATE INDEX "_site_settings_v_rels_media_id_idx" ON "_site_settings_v_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_benefits_fk" FOREIGN KEY ("benefits_id") REFERENCES "public"."benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interests_fk" FOREIGN KEY ("interests_id") REFERENCES "public"."interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publish_jobs_fk" FOREIGN KEY ("publish_jobs_id") REFERENCES "public"."publish_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invitations_fk" FOREIGN KEY ("invitations_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_requests_fk" FOREIGN KEY ("contact_requests_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_link_checks_fk" FOREIGN KEY ("link_checks_id") REFERENCES "public"."link_checks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "events_external_id_idx" ON "events" USING btree ("external_id");
  CREATE INDEX "events_series_id_idx" ON "events" USING btree ("series_id");
  CREATE INDEX "_events_v_version_version_external_id_idx" ON "_events_v" USING btree ("version_external_id");
  CREATE INDEX "_events_v_version_version_series_id_idx" ON "_events_v" USING btree ("version_series_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_benefits_id_idx" ON "payload_locked_documents_rels" USING btree ("benefits_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");
  CREATE INDEX "payload_locked_documents_rels_interests_id_idx" ON "payload_locked_documents_rels" USING btree ("interests_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_locked_documents_rels_publish_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("publish_jobs_id");
  CREATE INDEX "payload_locked_documents_rels_metrics_id_idx" ON "payload_locked_documents_rels" USING btree ("metrics_id");
  CREATE INDEX "payload_locked_documents_rels_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("invitations_id");
  CREATE INDEX "payload_locked_documents_rels_contact_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_requests_id");
  CREATE INDEX "payload_locked_documents_rels_link_checks_id_idx" ON "payload_locked_documents_rels" USING btree ("link_checks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS smux_mail_outbox; DROP TABLE IF EXISTS smux_rate_limits;

   ALTER TABLE "_albums_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_albums_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_people_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "campaigns_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_campaigns_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_campaigns_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_benefits_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registrations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "publish_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invitations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "link_checks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_hero_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_motto_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_cards_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_link_list_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_link_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_extra_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_albums_v" CASCADE;
  DROP TABLE "_albums_v_rels" CASCADE;
  DROP TABLE "_people_v" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "campaigns" CASCADE;
  DROP TABLE "campaigns_rels" CASCADE;
  DROP TABLE "_campaigns_v" CASCADE;
  DROP TABLE "_campaigns_v_rels" CASCADE;
  DROP TABLE "benefits" CASCADE;
  DROP TABLE "_benefits_v" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "interests" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "publish_jobs" CASCADE;
  DROP TABLE "metrics" CASCADE;
  DROP TABLE "invitations" CASCADE;
  DROP TABLE "contact_requests" CASCADE;
  DROP TABLE "link_checks" CASCADE;
  DROP TABLE "_site_settings_v_version_hero_buttons" CASCADE;
  DROP TABLE "_site_settings_v_version_stats" CASCADE;
  DROP TABLE "_site_settings_v_version_motto_words" CASCADE;
  DROP TABLE "_site_settings_v_blocks_rich_text" CASCADE;
  DROP TABLE "_site_settings_v_blocks_image_text" CASCADE;
  DROP TABLE "_site_settings_v_blocks_cards_cards" CASCADE;
  DROP TABLE "_site_settings_v_blocks_cards" CASCADE;
  DROP TABLE "_site_settings_v_blocks_gallery" CASCADE;
  DROP TABLE "_site_settings_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_site_settings_v_blocks_link_list" CASCADE;
  DROP TABLE "_site_settings_v_blocks_faq_items" CASCADE;
  DROP TABLE "_site_settings_v_blocks_faq" CASCADE;
  DROP TABLE "_site_settings_v_blocks_stats_items" CASCADE;
  DROP TABLE "_site_settings_v_blocks_stats" CASCADE;
  DROP TABLE "_site_settings_v_blocks_quote" CASCADE;
  DROP TABLE "_site_settings_v_blocks_cta" CASCADE;
  DROP TABLE "_site_settings_v_version_nav" CASCADE;
  DROP TABLE "_site_settings_v_version_faqs" CASCADE;
  DROP TABLE "_site_settings_v_version_extra_socials" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stories_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_campaigns_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_benefits_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_registrations_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_interests_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_audit_log_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_publish_jobs_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_metrics_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invitations_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_requests_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_link_checks_fk";

  DROP INDEX "events_external_id_idx";
  DROP INDEX "events_series_id_idx";
  DROP INDEX "_events_v_version_version_external_id_idx";
  DROP INDEX "_events_v_version_version_series_id_idx";
  DROP INDEX "payload_locked_documents_rels_stories_id_idx";
  DROP INDEX "payload_locked_documents_rels_campaigns_id_idx";
  DROP INDEX "payload_locked_documents_rels_benefits_id_idx";
  DROP INDEX "payload_locked_documents_rels_registrations_id_idx";
  DROP INDEX "payload_locked_documents_rels_interests_id_idx";
  DROP INDEX "payload_locked_documents_rels_audit_log_id_idx";
  DROP INDEX "payload_locked_documents_rels_publish_jobs_id_idx";
  DROP INDEX "payload_locked_documents_rels_metrics_id_idx";
  DROP INDEX "payload_locked_documents_rels_invitations_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_requests_id_idx";
  DROP INDEX "payload_locked_documents_rels_link_checks_id_idx";
  ALTER TABLE "clubs" DROP COLUMN "discovery_environment";
  ALTER TABLE "clubs" DROP COLUMN "discovery_commitment";
  ALTER TABLE "clubs" DROP COLUMN "discovery_cost_guide";
  ALTER TABLE "clubs" DROP COLUMN "discovery_beginner_friendly";
  ALTER TABLE "clubs" DROP COLUMN "discovery_verified_at";
  ALTER TABLE "_clubs_v" DROP COLUMN "version_discovery_environment";
  ALTER TABLE "_clubs_v" DROP COLUMN "version_discovery_commitment";
  ALTER TABLE "_clubs_v" DROP COLUMN "version_discovery_cost_guide";
  ALTER TABLE "_clubs_v" DROP COLUMN "version_discovery_beginner_friendly";
  ALTER TABLE "_clubs_v" DROP COLUMN "version_discovery_verified_at";
  ALTER TABLE "events" DROP COLUMN "registration_mode";
  ALTER TABLE "events" DROP COLUMN "cancelled";
  ALTER TABLE "events" DROP COLUMN "cancellation_reason";
  ALTER TABLE "events" DROP COLUMN "organizer_contact";
  ALTER TABLE "events" DROP COLUMN "prerequisites";
  ALTER TABLE "events" DROP COLUMN "itinerary";
  ALTER TABLE "events" DROP COLUMN "packing_list";
  ALTER TABLE "events" DROP COLUMN "activity";
  ALTER TABLE "events" DROP COLUMN "beginner_friendly";
  ALTER TABLE "events" DROP COLUMN "review_state";
  ALTER TABLE "events" DROP COLUMN "external_id";
  ALTER TABLE "events" DROP COLUMN "series_id";
  ALTER TABLE "events" DROP COLUMN "archived";
  ALTER TABLE "_events_v" DROP COLUMN "version_registration_mode";
  ALTER TABLE "_events_v" DROP COLUMN "version_cancelled";
  ALTER TABLE "_events_v" DROP COLUMN "version_cancellation_reason";
  ALTER TABLE "_events_v" DROP COLUMN "version_organizer_contact";
  ALTER TABLE "_events_v" DROP COLUMN "version_prerequisites";
  ALTER TABLE "_events_v" DROP COLUMN "version_itinerary";
  ALTER TABLE "_events_v" DROP COLUMN "version_packing_list";
  ALTER TABLE "_events_v" DROP COLUMN "version_activity";
  ALTER TABLE "_events_v" DROP COLUMN "version_beginner_friendly";
  ALTER TABLE "_events_v" DROP COLUMN "version_review_state";
  ALTER TABLE "_events_v" DROP COLUMN "version_external_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_series_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_archived";
  ALTER TABLE "albums" DROP COLUMN "summary";
  ALTER TABLE "albums" DROP COLUMN "photo_credit";
  ALTER TABLE "people" DROP COLUMN "display_order";
  ALTER TABLE "people" DROP COLUMN "archived";
  ALTER TABLE "resources" DROP COLUMN "audience";
  ALTER TABLE "resources" DROP COLUMN "category";
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "users" DROP COLUMN "active";
  ALTER TABLE "users" DROP COLUMN "requires_review";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "campaigns_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "benefits_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "registrations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "interests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audit_log_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "publish_jobs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "metrics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invitations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "link_checks_id";
  ALTER TABLE "site_settings" DROP COLUMN "current_academic_year";
  ALTER TABLE "site_settings" DROP COLUMN "contact_form_enabled";
  DROP TYPE "public"."enum_clubs_discovery_environment";
  DROP TYPE "public"."enum__clubs_v_version_discovery_environment";
  DROP TYPE "public"."enum_events_registration_mode";
  DROP TYPE "public"."enum_events_activity";
  DROP TYPE "public"."enum_events_review_state";
  DROP TYPE "public"."enum__events_v_version_registration_mode";
  DROP TYPE "public"."enum__events_v_version_activity";
  DROP TYPE "public"."enum__events_v_version_review_state";
  DROP TYPE "public"."enum_resources_audience";
  DROP TYPE "public"."enum_resources_category";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum_campaigns_status";
  DROP TYPE "public"."enum__campaigns_v_version_status";
  DROP TYPE "public"."enum_registrations_status";
  DROP TYPE "public"."enum_publish_jobs_state";
  DROP TYPE "public"."enum_metrics_kind";
  DROP TYPE "public"."enum_invitations_role";
  DROP TYPE "public"."enum_contact_requests_state";
  DROP TYPE "public"."enum_link_checks_state";
  DROP TYPE "public"."enum__site_settings_v_version_hero_buttons_tone";
  DROP TYPE "public"."enum__site_settings_v_blocks_image_text_image_position";
  DROP TYPE "public"."enum__site_settings_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__site_settings_v_blocks_cta_tone";`)
}
