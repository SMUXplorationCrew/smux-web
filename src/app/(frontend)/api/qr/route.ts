import QRCode from 'qrcode'
export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get('value') || ''
  if (value.length > 2048 || !value) return new Response('Invalid value', { status: 400 })
  return new Response(await QRCode.toString(value, { type: 'svg', margin: 2, width: 300 }), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  })
}
