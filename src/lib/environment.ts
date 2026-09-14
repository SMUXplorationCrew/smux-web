export const validateEnvironment = () => {
  const deployed = process.env.VERCEL === '1' || process.env.SMUX_ENVIRONMENT === 'production'
  const required = [
    'PAYLOAD_SECRET',
    ...(deployed
      ? [
          'R2_BUCKET',
          'R2_ACCESS_KEY_ID',
          'R2_SECRET_ACCESS_KEY',
          'R2_ENDPOINT',
          'SITE_URL',
          'SMTP_HOST',
          'SMTP_USER',
          'SMTP_PASS',
        ]
      : []),
  ]
  const missing = required.filter((key) => !process.env[key])
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL && !process.env.DATABASE_URL_UNPOOLED)
    missing.push('DATABASE_URL')
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(', ')}`)
  if (deployed && (process.env.PAYLOAD_SECRET?.length || 0) < 32)
    throw new Error('PAYLOAD_SECRET must contain at least 32 characters.')
  if (
    deployed &&
    (!process.env.SITE_URL?.startsWith('https://') || process.env.SITE_URL.includes('localhost'))
  )
    throw new Error('Production requires a canonical HTTPS SITE_URL.')
  if (
    process.env.SMUX_ALLOW_SCHEMA_PUSH === 'true' &&
    !/^dev-|^test-/.test(process.env.NEON_BRANCH || '')
  )
    throw new Error('Schema push is permitted only on explicitly named dev-/test- branches.')
}
