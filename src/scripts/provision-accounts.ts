import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import { chmodSync, writeFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Creates the seven SMUX sign-ins: one per club editor, plus the main committee.
 *
 * Idempotent. An account that already exists has its role, club and active flag brought
 * back in line, but keeps its password — re-running this to fix a wrong club must not
 * silently invalidate a password someone is already using. Pass `--reset-password` to
 * issue a new one deliberately.
 *
 * Passwords are generated here and written to a file you name with `--out`, mode 0600.
 * They are never printed to stdout and never written inside the repository: stdout ends
 * up in terminal scrollback and CI logs, and the repo ends up on GitHub.
 *
 *   pnpm provision:accounts --out ~/smux-accounts.txt
 *
 * Check DATABASE_URL before running. This writes real sign-ins to whatever it points at.
 */

type Spec = { email: string; role: 'mc' | 'editor'; club?: string; name: string }

const ACCOUNTS: Spec[] = [
  { email: 'diving@sa.smu.edu.sg', role: 'editor', club: 'diving', name: 'SMUX Diving' },
  { email: 'kayaking@sa.smu.edu.sg', role: 'editor', club: 'kayaking', name: 'SMUX Kayaking' },
  { email: 'trekking@sa.smu.edu.sg', role: 'editor', club: 'trekking', name: 'SMUX Trekking' },
  { email: 'biking@sa.smu.edu.sg', role: 'editor', club: 'biking', name: 'SMUX Biking' },
  { email: 'skating@sa.smu.edu.sg', role: 'editor', club: 'skating', name: 'SMUX Skating' },
  { email: 'xseed@sa.smu.edu.sg', role: 'editor', club: 'xseed', name: 'SMUX XSeed' },
  { email: 'xplorationcrew@sa.smu.edu.sg', role: 'mc', name: 'SMUXploration Crew' },
]

// base64url over 18 random bytes: 24 characters, no ambiguous punctuation to mistype
// when someone reads it off a screen.
const newPassword = () => randomBytes(18).toString('base64url')

const argValue = (flag: string) => {
  const i = process.argv.indexOf(flag)
  return i === -1 ? undefined : process.argv[i + 1]
}

const run = async () => {
  const out = argValue('--out')
  const resetPassword = process.argv.includes('--reset-password')
  if (!out) throw new Error('Pass --out <path> for the credential file, outside this repo.')
  if (out.includes(process.cwd()))
    throw new Error(`Refusing to write credentials into the repo: ${out}`)

  const payload = await getPayload({ config })
  console.log(`Database host: ${new URL(process.env.DATABASE_URL ?? '').host}`)

  // Ids are numeric here: Payload on Postgres uses serial primary keys.
  const clubIdBySlug = new Map<string, number>()
  const { docs: clubs } = await payload.find({
    collection: 'clubs',
    limit: 100,
    overrideAccess: true,
  })
  for (const club of clubs) clubIdBySlug.set(String(club.slug), club.id)

  const issued: string[] = []

  for (const spec of ACCOUNTS) {
    const club = spec.club ? clubIdBySlug.get(spec.club) : undefined
    if (spec.club && club === undefined)
      throw new Error(`No club "${spec.club}" — seed the clubs first.`)

    const { docs: existing } = await payload.find({
      collection: 'users',
      where: { email: { equals: spec.email } },
      limit: 1,
      overrideAccess: true,
    })

    const shared = { name: spec.name, role: spec.role, club: club ?? null, active: true }

    if (existing[0]) {
      const password = resetPassword ? newPassword() : undefined
      await payload.update({
        collection: 'users',
        id: existing[0].id,
        data: password ? { ...shared, password } : shared,
        overrideAccess: true,
      })
      console.log(`updated  ${spec.email}  (${spec.role}${spec.club ? `/${spec.club}` : ''})`)
      if (password) issued.push(`${spec.email}\t${password}`)
    } else {
      const password = newPassword()
      await payload.create({
        collection: 'users',
        data: { ...shared, email: spec.email, password },
        overrideAccess: true,
      })
      console.log(`created  ${spec.email}  (${spec.role}${spec.club ? `/${spec.club}` : ''})`)
      issued.push(`${spec.email}\t${password}`)
    }
  }

  if (issued.length) {
    const body = [
      `SMUX sign-ins — issued ${new Date().toISOString()}`,
      `Database: ${new URL(process.env.DATABASE_URL ?? '').host}`,
      '',
      ...issued,
      '',
      'Hand each line to its owner privately and delete this file afterwards.',
      '',
    ].join('\n')
    writeFileSync(out, body, { mode: 0o600 })
    chmodSync(out, 0o600)
    console.log(`\n${issued.length} password(s) written to ${out} (mode 0600).`)
  } else {
    console.log('\nNo new passwords issued. Pass --reset-password to force new ones.')
  }

  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
