import type { Payload } from 'payload'
import { processPublicationJobs } from '@/lib/jobs'
import { inspectLink } from '@/lib/network'
import { siteUrl } from '@/lib/site'
export const emailReady = () =>
  process.env.SMUX_EMAIL_DELIVERY === 'enabled' &&
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
/** Durable delivery records survive retries. SMTP delivery is at-least-once after a worker crash. */
export async function maintenance(payload: Payload) {
  await payload.db.pool.query('DELETE FROM smux_rate_limits WHERE expires_at<now()')
  await payload.db.pool.query(
    "DELETE FROM metrics WHERE day < to_char(now()-interval '13 months','YYYY-MM-DD')",
  )
  await payload.db.pool.query(
    "DELETE FROM smux_mail_outbox WHERE state='sent' AND updated_at<now()-interval '90 days'",
  )
  await payload.db.pool.query(
    `INSERT INTO smux_mail_outbox(key,user_id,interest_id,subject,body)
 SELECT 'interest:'||i.id||':event:'||e.id||':open:'||coalesce(e.signup_opens::text,'none'),i.user_id,i.id,'SMUX signup: '||e.title,'Registration is available for '||e.title||'. Details: '||$1||'/events/'||e.slug
 FROM interests i JOIN users u ON u.id=i.user_id JOIN events e ON (i.event_id=e.id OR (i.event_id IS NULL AND i.club_id=e.club_id))
 WHERE i.active=true AND u.active=true AND e._status='published' AND coalesce(e.archived,false)=false AND coalesce(e.cancelled,false)=false
 AND e.starts_at>now() AND (e.signup_opens IS NULL OR e.signup_opens<=now()) AND (e.signup_closes IS NULL OR e.signup_closes>now())
 AND (e.registration_mode='native' OR e.signup_url ~ '^https?://')
 ON CONFLICT(key) DO NOTHING`,
    [siteUrl],
  )
  const sent: number[] = []
  if (emailReady())
    for (let n = 0; n < 10; n++) {
      const claim = await payload.db.pool.query(
        `UPDATE smux_mail_outbox SET state='sending',attempts=attempts+1,updated_at=now() WHERE id=(SELECT id FROM smux_mail_outbox WHERE (state IN ('pending','failed') OR (state='sending' AND updated_at<now()-interval '10 minutes')) AND attempts<5 ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`,
      )
      const item = claim.rows[0]
      if (!item) break
      const eligibility = await payload.db.pool.query(
        'SELECT u.email FROM users u JOIN interests i ON i.user_id=u.id WHERE u.id=$1 AND i.id=$2 AND u.active=true AND i.active=true',
        [item.user_id, item.interest_id],
      )
      if (!eligibility.rows.length) {
        await payload.db.pool.query(
          "UPDATE smux_mail_outbox SET state='cancelled',updated_at=now() WHERE id=$1",
          [item.id],
        )
        continue
      }
      try {
        await payload.sendEmail({
          to: eligibility.rows[0].email,
          subject: item.subject,
          text: `${item.body}\n\nYou requested this SMUX reminder. Manage or unsubscribe: ${siteUrl}/account`,
        })
        await payload.db.pool.query(
          "UPDATE smux_mail_outbox SET state='sent',updated_at=now() WHERE id=$1",
          [item.id],
        )
        sent.push(item.id)
      } catch {
        await payload.db.pool.query(
          "UPDATE smux_mail_outbox SET state='failed',updated_at=now() WHERE id=$1",
          [item.id],
        )
      }
    }
  const due = await payload.db.pool.query(
    "SELECT e.id,e.signup_url,e.club_id FROM events e WHERE e._status='published' AND e.signup_url ~ '^https://' AND e.starts_at>now() AND NOT EXISTS(SELECT 1 FROM link_checks l WHERE l.url=e.signup_url AND l.checked_at>now()-interval '7 days') LIMIT 3",
  )
  for (const e of due.rows) {
    let result: { state: 'healthy' | 'failed' | 'review'; status: number } = {
      state: 'review',
      status: 0,
    }
    try {
      result = await inspectLink(e.signup_url)
    } catch {}
    await payload.create({
      collection: 'link-checks',
      data: {
        url: e.signup_url,
        club: e.club_id,
        state: result.state,
        statusCode: result.status,
        checkedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })
  }
  return {
    publicationJobs: await processPublicationJobs(payload),
    emailsSent: sent.length,
    emailEnabled: emailReady(),
    linksChecked: due.rows.length,
  }
}
