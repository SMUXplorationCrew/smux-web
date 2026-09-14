import dns from 'node:dns/promises'
import https from 'node:https'
import { isIP } from 'node:net'
import { httpUrl } from '@/lib/url'

const privateIP = (ip: string) =>
  ip.includes(':') ||
  /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|198\.(18|19)\.|2[2-5]\d\.)/.test(
    ip,
  )
/** Public HTTPS only; pin the vetted DNS address, do not follow redirects (avoids rebinding/SSRF). */
export async function inspectLink(
  raw: string,
): Promise<{ status: number; state: 'healthy' | 'review' | 'failed' }> {
  const safe = httpUrl(raw)
  if (!safe) throw new Error('Invalid URL')
  const url = new URL(safe)
  if (url.protocol !== 'https:' || (url.port && url.port !== '443') || isIP(url.hostname))
    throw new Error('Link checks require a public HTTPS hostname.')
  const addresses = await dns.lookup(url.hostname, { all: true })
  if (!addresses.length || addresses.some((a) => privateIP(a.address)))
    throw new Error('Private network destinations cannot be checked.')
  const address = addresses[0]
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: 'HEAD',
        timeout: 8000,
        lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
      },
      (response) => {
        response.resume()
        const status = response.statusCode || 0
        resolve({
          status,
          state:
            status >= 200 && status < 300
              ? 'healthy'
              : status === 404 || status === 410
                ? 'failed'
                : 'review',
        })
      },
    )
    request.on('timeout', () => request.destroy(new Error('Request timed out')))
    request.on('error', reject)
    request.end()
  })
}
