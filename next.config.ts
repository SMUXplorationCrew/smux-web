import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  /**
   * Uploaded files never change under a given name — Payload writes a new filename on
   * re-upload — so they can be cached hard. This is what keeps proxying through the app
   * cheap: the CDN answers repeat requests and the function runs about once per file.
   */
  async headers() {
    return [
      {
        // Public media only. Filenames are stable — Payload writes a new one on
        // re-upload — so these can be cached hard and served from the edge.
        source: '/api/media/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        /**
         * Resources are members-only, so they must never enter a shared cache.
         *
         * Marked `public` they could be retained by the CDN or a proxy and replayed to
         * a signed-out visitor, or to a different person entirely, without Payload's
         * access check ever running again — handing out members-only documents to
         * anyone who guessed the URL.
         */
        source: '/api/resources/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' }],
      },
    ]
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
