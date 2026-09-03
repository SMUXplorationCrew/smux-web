import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Albums } from './collections/Albums'
import { Clubs } from './collections/Clubs'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { People } from './collections/People'
import { Resources } from './collections/Resources'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * R2 is wired but dormant. Uploads land on local disk until the bucket credentials
 * exist, at which point setting them switches storage over with no code change.
 * sharp still generates the WebP variants either way, so images are never resized at
 * request time regardless of where they are stored.
 */
const isProduction = process.env.NODE_ENV === 'production'

/**
 * `neon link` writes DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct) into
 * .env and keeps them current, so we read those rather than copying the credential
 * into a second variable that could silently drift.
 *
 * Which one to use differs by environment, and both directions matter:
 *
 * - Locally, Payload pushes schema changes. Neon's pooler runs PgBouncer in transaction
 *   mode, which breaks the session state DDL depends on, so development takes the
 *   direct connection.
 * - In production every request is a short-lived serverless invocation. Direct
 *   connections would exhaust Postgres' connection limit under any real traffic, so
 *   production takes the pooled one — safe there precisely because schema push is off.
 *
 * DATABASE_URI still wins if set, so a non-Neon Postgres can be pointed at this app.
 */
const databaseUrl =
  process.env.DATABASE_URI ||
  (isProduction
    ? process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED
    : process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL) ||
  ''

/**
 * Email, wired the same way as R2: present credentials switch it on, absent ones leave
 * Payload's console transport in place.
 *
 * Without an adapter, a password reset silently does nothing — Payload logs the mail and
 * moves on, so the first editor who forgets their password is locked out with no
 * self-service route and no visible error to explain it.
 */
const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
)

const email = smtpConfigured
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'noreply@smuxplorationcrew.sg',
      defaultFromName: 'SMUX',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

const r2Configured = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT,
)

/**
 * Files are addressed through the app, not R2's public r2.dev domain.
 *
 * r2.dev is documented as development-only and is aggressively rate limited — testing
 * showed 403s after roughly fifteen requests in quick succession, and a club page pulls
 * forty images at once, so a handful of simultaneous visitors would see images fail at
 * random. A custom domain would remove the limit, but that needs a zone in the
 * Cloudflare account and there is none.
 *
 * Serving via /api/media/file/... is therefore the reliable option. next.config.ts marks
 * those responses immutable so the CDN serves repeat views from the edge and the origin
 * is hit about once per file — still no resizing at request time, which is the rule that
 * actually matters here.
 */

const storagePlugins = r2Configured
  ? [
      s3Storage({
        collections: {
          media: { prefix: 'media' },
          resources: { prefix: 'resources' },
        },
        bucket: process.env.R2_BUCKET as string,
        config: {
          endpoint: process.env.R2_ENDPOINT,
          region: process.env.R2_REGION || 'auto',
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
          },
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· SMUX',
      description: 'Content management for SMUXploration Crew.',
    },
  },
  collections: [Clubs, Events, Albums, People, Pages, Resources, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    /**
     * Never mutate the schema from a deployed app. Several serverless invocations can
     * start at once, and concurrent pushes against the same database race each other.
     * The schema is applied from a developer machine; production only reads and writes
     * rows.
     */
    push: !isProduction,
    pool: {
      connectionString: databaseUrl,
    },
  }),
  sharp,
  ...(email ? { email } : {}),
  graphQL: {
    // The playground is a development convenience; in production it is an interactive
    // schema browser pointed at real data, for no benefit.
    disablePlaygroundInProduction: true,
  },
  plugins: [...storagePlugins],
})
