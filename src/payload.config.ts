import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
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
/**
 * `neon link` writes DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct) into
 * .env and keeps them current, so we read those rather than copying the credential
 * into a second variable that could silently drift.
 *
 * The unpooled string is preferred deliberately. Payload pushes schema changes in
 * development, and Neon's pooler runs PgBouncer in transaction mode, which breaks the
 * session state that DDL and prepared statements depend on. DATABASE_URI remains
 * supported so a non-Neon Postgres can still be pointed at this app.
 */
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URI || process.env.DATABASE_URL || ''

const r2Configured = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT,
)

const storagePlugins = r2Configured
  ? [
      s3Storage({
        collections: { media: true, resources: true },
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
  },
  collections: [Clubs, Events, Albums, People, Pages, Resources, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
  }),
  sharp,
  plugins: [...storagePlugins],
})
