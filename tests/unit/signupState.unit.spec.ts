import { describe, expect, it } from 'vitest'
import { getSignupStatus } from '@/lib/signupState'

// Singapore is UTC+8, so these instants are 08:00 local on the stated day.
const OPENS = '2026-09-08T00:00:00.000Z'
const CLOSES = '2026-09-20T00:00:00.000Z'
const at = (iso: string) => new Date(iso)

const window = { signupOpens: OPENS, signupCloses: CLOSES }

describe('getSignupStatus', () => {
  describe('before the window opens', () => {
    it('reports the opening date', () => {
      expect(getSignupStatus(window, at('2026-09-01T00:00:00.000Z'))).toEqual({
        state: 'not-open',
        label: 'Opens 8 Sep',
      })
    })

    it('is still shut one millisecond before opening', () => {
      expect(getSignupStatus(window, at('2026-09-07T23:59:59.999Z')).state).toBe('not-open')
    })
  })

  describe('inside the window', () => {
    it('opens exactly at signupOpens', () => {
      expect(getSignupStatus(window, at(OPENS))).toEqual({
        state: 'open',
        label: 'Sign up',
      })
    })

    it('stays open one millisecond before closing', () => {
      expect(getSignupStatus(window, at('2026-09-19T23:59:59.999Z')).state).toBe('open')
    })
  })

  describe('after the window closes', () => {
    // A stated deadline is read as "shut at that moment", not "shut just after it".
    it('closes exactly at signupCloses', () => {
      expect(getSignupStatus(window, at(CLOSES))).toEqual({
        state: 'closed',
        label: 'Sign-ups closed',
      })
    })

    it('stays closed well afterwards', () => {
      expect(getSignupStatus(window, at('2026-10-01T00:00:00.000Z')).state).toBe('closed')
    })
  })

  describe('capacity', () => {
    it('closes a full event even while the window is open', () => {
      const full = { ...window, capacity: 20, spotsTaken: 20 }
      expect(getSignupStatus(full, at('2026-09-10T00:00:00.000Z'))).toEqual({
        state: 'closed',
        label: 'Sign-ups closed',
      })
    })

    it('treats an over-subscribed event as full', () => {
      const over = { ...window, capacity: 20, spotsTaken: 25 }
      expect(getSignupStatus(over, at('2026-09-10T00:00:00.000Z')).state).toBe('closed')
    })

    it('stays open below capacity', () => {
      const room = { ...window, capacity: 20, spotsTaken: 19 }
      expect(getSignupStatus(room, at('2026-09-10T00:00:00.000Z')).state).toBe('open')
    })

    // Sign-ups happen off-site, so a club may never record what has been taken.
    it('ignores capacity when the taken count is unknown', () => {
      const unknown = { ...window, capacity: 20, spotsTaken: null }
      expect(getSignupStatus(unknown, at('2026-09-10T00:00:00.000Z')).state).toBe('open')
    })
  })

  describe('missing dates', () => {
    it('is open when nothing gates it', () => {
      expect(getSignupStatus({}, at('2026-09-10T00:00:00.000Z')).state).toBe('open')
    })

    it('never closes without a closing date', () => {
      expect(getSignupStatus({ signupOpens: OPENS }, at('2027-01-01T00:00:00.000Z')).state).toBe(
        'open',
      )
    })

    it('is open from the start without an opening date', () => {
      expect(getSignupStatus({ signupCloses: CLOSES }, at('2026-09-01T00:00:00.000Z')).state).toBe(
        'open',
      )
    })

    it('ignores an unparseable date rather than throwing', () => {
      expect(getSignupStatus({ signupOpens: 'not a date' }, at(OPENS)).state).toBe('open')
    })
  })
})
