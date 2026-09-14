import type { Payload } from 'payload'
import { siteUrl } from '@/lib/site'
import { safeReturnPath } from '@/lib/url'

/** Claim work atomically; recover stale leases after a worker crashes. */
export async function processPublicationJobs(payload: Payload) {
  const results = []
  for (let i = 0; i < 3; i++) {
    const claimed = await payload.db.pool.query(
      `UPDATE publish_jobs SET state='running', attempts=COALESCE(attempts,0)+1, updated_at=now() WHERE id=(SELECT id FROM publish_jobs WHERE (state IN ('pending','failed') OR (state='running' AND updated_at<now()-interval '10 minutes')) AND COALESCE(attempts,0)<5 ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING id,paths`,
    )
    const job = claimed.rows[0]
    if (!job) break
    try {
      const paths = (Array.isArray(job.paths) ? job.paths : []) as string[]
      for (const path of paths) {
        if (typeof path !== 'string' || safeReturnPath(path, '') !== path)
          throw new Error('Invalid publication path')
        const response = await fetch(new URL(path, siteUrl), {
          signal: AbortSignal.timeout(20000),
          redirect: 'manual',
          headers: { 'x-smux-warm': '1' },
        })
        await response.body?.cancel()
        if (!response.ok && response.status !== 404)
          throw new Error(`Refresh returned ${response.status} for ${path}`)
      }
      await payload.db.pool.query(
        "UPDATE publish_jobs SET state='complete',last_error=NULL,finished_at=now(),updated_at=now() WHERE id=$1",
        [job.id],
      )
      results.push({ id: job.id, state: 'complete' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Refresh failed'
      await payload.db.pool.query(
        "UPDATE publish_jobs SET state='failed',last_error=$2,updated_at=now() WHERE id=$1",
        [job.id, message.slice(0, 250)],
      )
      results.push({ id: job.id, state: 'failed' })
    }
  }
  return results
}
