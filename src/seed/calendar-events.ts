/**
 * Club events transcribed from the committee's own `SMUX Calendar (2026).xlsx`.
 *
 * Each entry's club comes from the cell's fill colour, matched against the legend in
 * the sheet's header row. Management Committee rows, public holidays and admin markers
 * are excluded — these are the club-facing events only.
 *
 * The calendar records dates but not times, venues or costs. Nothing has been invented
 * to fill those gaps: events seed with `timeTbc` set, and venue and cost stay in
 * [BRACKETS] until someone confirms them.
 *
 * Generated from the spreadsheet; re-derive rather than hand-editing.
 */

export interface CalendarEvent {
  slug: string
  title: string
  club: 'biking' | 'diving' | 'kayaking' | 'skating' | 'trekking' | 'xseed'
  /** YYYY-MM-DD in Singapore time. */
  date: string
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    slug: 'training-and-urban-2025-10-24',
    title: 'Training and Urban',
    club: 'skating',
    date: '2025-10-24',
  },
  {
    slug: 'local-hike-springleaf-2025-10-25',
    title: 'Local Hike - Springleaf',
    club: 'trekking',
    date: '2025-10-25',
  },
  { slug: 'pedal-paddle-2025-10-26', title: 'Pedal & Paddle', club: 'biking', date: '2025-10-26' },
  {
    slug: 'pedal-paddle-2025-10-26-2',
    title: 'Pedal & Paddle',
    club: 'kayaking',
    date: '2025-10-26',
  },
  {
    slug: 'halloween-skate-2025-10-31',
    title: 'Halloween Skate',
    club: 'skating',
    date: '2025-10-31',
  },
  {
    slug: 'sign-ups-for-recruitment-closes-2359-2025-10-31',
    title: 'Sign-Ups for Recruitment Closes (2359)',
    club: 'xseed',
    date: '2025-10-31',
  },
  {
    slug: 'kayak-sup-collab-2025-11-01',
    title: 'Kayak SUP Collab',
    club: 'kayaking',
    date: '2025-11-01',
  },
  {
    slug: 'midnight-trek-2025-11-01',
    title: 'Midnight Trek',
    club: 'trekking',
    date: '2025-11-01',
  },
  {
    slug: 'kayak-sup-collab-2025-11-01-2',
    title: 'Kayak SUP Collab',
    club: 'xseed',
    date: '2025-11-01',
  },
  {
    slug: 'dive-seaglass-workshop-2025-11-02',
    title: 'Dive Seaglass Workshop',
    club: 'diving',
    date: '2025-11-02',
  },
  {
    slug: 'skate-x-osl-wyp-2025-11-04',
    title: 'Skate x OSL WYP',
    club: 'skating',
    date: '2025-11-04',
  },
  {
    slug: 'dive-x-osl-wyp-2025-11-05',
    title: 'Dive x OSL WYP',
    club: 'diving',
    date: '2025-11-05',
  },
  {
    slug: 'shortlist-finalise-candidates-2025-11-09',
    title: 'Shortlist & finalise candidates',
    club: 'xseed',
    date: '2025-11-09',
  },
  {
    slug: 'training-and-urban-2026-01-16',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-01-16',
  },
  {
    slug: 'training-and-urban-2026-01-23',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-01-23',
  },
  {
    slug: 'longboarding-clinic-cruising-2026-01-23',
    title: 'Longboarding clinic + cruising',
    club: 'xseed',
    date: '2026-01-23',
  },
  {
    slug: 'kayaking-orientation-programme-2026-01-24',
    title: 'Kayaking Orientation Programme',
    club: 'kayaking',
    date: '2026-01-24',
  },
  {
    slug: 'local-hike-tree-top-walk-2026-01-24',
    title: 'Local Hike (Tree-top walk)',
    club: 'trekking',
    date: '2026-01-24',
  },
  {
    slug: 'seaglass-workshop-2026-01-25',
    title: 'Seaglass Workshop',
    club: 'diving',
    date: '2026-01-25',
  },
  {
    slug: 'bbpt-rideout-ecp-to-marina-bay-2026-01-31',
    title: 'BBPT + Rideout: ECP to Marina Bay',
    club: 'biking',
    date: '2026-01-31',
  },
  {
    slug: 'fam-dive-with-brs-hantu-excos-only-2026-01-31',
    title: 'Fam Dive with BRS @ Hantu (excos only)',
    club: 'diving',
    date: '2026-01-31',
  },
  {
    slug: 'local-hike-rail-corridor-park-2026-01-31',
    title: 'Local Hike (Rail Corridor Park)',
    club: 'trekking',
    date: '2026-01-31',
  },
  {
    slug: 'nus-collab-wakeboarding-2026-01-31',
    title: 'NUS Collab Wakeboarding',
    club: 'xseed',
    date: '2026-01-31',
  },
  {
    slug: 'trek-run-golden-mile-food-complex-2026-02-04',
    title: 'Trek Run (Golden Mile Food Complex)',
    club: 'trekking',
    date: '2026-02-04',
  },
  {
    slug: 'training-and-urban-2026-02-06',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-02-06',
  },
  {
    slug: 'karting-sentosa-2026-02-06',
    title: 'Karting (Sentosa)',
    club: 'xseed',
    date: '2026-02-06',
  },
  { slug: 'wakeboarding-2026-02-12', title: 'Wakeboarding', club: 'xseed', date: '2026-02-12' },
  {
    slug: 'valentines-special-blade-date-training-and-urban-2026-02-13',
    title: "Valentines' Special: Blade & Date (Training and Urban)",
    club: 'skating',
    date: '2026-02-13',
  },
  {
    slug: 'longboarding-clinic-cruising-2026-02-13',
    title: 'Longboarding clinic + cruising',
    club: 'xseed',
    date: '2026-02-13',
  },
  {
    slug: 'rideout-pasir-ris-to-punggol-2026-02-14',
    title: 'Rideout: Pasir Ris to Punggol',
    club: 'biking',
    date: '2026-02-14',
  },
  {
    slug: 'kayak-by-the-bae-2026-02-14',
    title: 'Kayak by the Bae 🥺❤️',
    club: 'kayaking',
    date: '2026-02-14',
  },
  {
    slug: 'local-hike-macritchie-2026-02-14',
    title: 'Local Hike (Macritchie)',
    club: 'trekking',
    date: '2026-02-14',
  },
  {
    slug: 'oceanarium-visit-2026-02-15',
    title: 'Oceanarium Visit',
    club: 'diving',
    date: '2026-02-15',
  },
  {
    slug: 'training-and-urban-2026-02-27',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-02-27',
  },
  {
    slug: 'recess-dive-tioman-2026-03-06',
    title: 'Recess Dive @ Tioman',
    club: 'diving',
    date: '2026-03-06',
  },
  { slug: 'star-trek-2026-03-06', title: 'Star Trek', club: 'trekking', date: '2026-03-06' },
  {
    slug: '1-star-course-2026-03-14',
    title: '1 Star Course',
    club: 'kayaking',
    date: '2026-03-14',
  },
  {
    slug: 'training-and-urban-2026-03-20',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-03-20',
  },
  {
    slug: 'training-for-xep-fort-canning-hike-2026-03-20',
    title: 'Training for XEP (Fort Canning Hike)',
    club: 'trekking',
    date: '2026-03-20',
  },
  {
    slug: 'longboarding-clinic-cruising-2026-03-20',
    title: 'Longboarding clinic + cruising',
    club: 'xseed',
    date: '2026-03-20',
  },
  {
    slug: 'trek-run-marina-barrage-picnic-2026-03-25',
    title: 'Trek Run (Marina Barrage + Picnic)',
    club: 'trekking',
    date: '2026-03-25',
  },
  {
    slug: 'full-urban-day-2026-03-27',
    title: 'Full Urban Day',
    club: 'skating',
    date: '2026-03-27',
  },
  {
    slug: 'rideout-west-coast-park-to-jurong-lake-gardens-2026-03-28',
    title: 'Rideout: West Coast Park to Jurong Lake Gardens',
    club: 'biking',
    date: '2026-03-28',
  },
  {
    slug: 'nus-collab-wakeboarding-2026-03-28',
    title: 'NUS Collab Wakeboarding',
    club: 'xseed',
    date: '2026-03-28',
  },
  {
    slug: 'karting-sentosa-2026-04-02',
    title: 'Karting (Sentosa)',
    club: 'xseed',
    date: '2026-04-02',
  },
  {
    slug: 'smux-evening-cycling-x-psr-2026-04-04',
    title: 'SMUX Evening Cycling x PSR',
    club: 'biking',
    date: '2026-04-04',
  },
  {
    slug: 'panic-jurong-lake-2026-04-04',
    title: 'PANIC @Jurong Lake',
    club: 'kayaking',
    date: '2026-04-04',
  },
  {
    slug: 'local-hike-training-for-xep-bukit-timah-2026-04-04',
    title: 'Local Hike/Training for XEP (Bukit Timah)',
    club: 'trekking',
    date: '2026-04-04',
  },
  { slug: 'wakeboarding-2026-04-05', title: 'Wakeboarding', club: 'xseed', date: '2026-04-05' },
  {
    slug: 'training-and-urban-2026-04-10',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-04-10',
  },
  {
    slug: 'training-for-summer-xp-macritchie-2026-04-11',
    title: 'Training for Summer XP (Macritchie)',
    club: 'trekking',
    date: '2026-04-11',
  },
  {
    slug: 'pedal-paddle-kayaking-x-biking-2026-05-02',
    title: 'Pedal Paddle (Kayaking x Biking)',
    club: 'kayaking',
    date: '2026-05-02',
  },
  {
    slug: 'pre-departure-briefing-ecp-traning-for-xep-2026-05-03',
    title: 'Pre Departure Briefing + ECP (Traning for XEP)',
    club: 'trekking',
    date: '2026-05-03',
  },
  {
    slug: 'eos-dive-tioman-2026-05-08',
    title: 'EOS Dive @ Tioman',
    club: 'diving',
    date: '2026-05-08',
  },
  {
    slug: 'summer-xp-to-mt-ophir-2026-05-08',
    title: 'Summer XP to Mt Ophir',
    club: 'trekking',
    date: '2026-05-08',
  },
  { slug: 'ocbc-cycle-2026-05-10', title: 'OCBC Cycle', club: 'biking', date: '2026-05-10' },
  { slug: 'wakeboarding-2026-05-11', title: 'Wakeboarding', club: 'xseed', date: '2026-05-11' },
  { slug: 'wakeboarding-2026-05-13', title: 'Wakeboarding', club: 'xseed', date: '2026-05-13' },
  {
    slug: 'stand-up-paddling-course-2026-05-24',
    title: 'Stand Up Paddling (Course)',
    club: 'xseed',
    date: '2026-05-24',
  },
  {
    slug: 'skate-xperience-1-inline-floorball-2026-05-26',
    title: 'Skate Xperience 1: Inline Floorball',
    club: 'skating',
    date: '2026-05-26',
  },
  {
    slug: 'skate-xperience-2-ice-skating-2026-06-02',
    title: 'Skate Xperience 2: Ice Skating',
    club: 'skating',
    date: '2026-06-02',
  },
  {
    slug: 'skate-xperience-1-inline-floorball-2026-06-09',
    title: 'Skate Xperience 1: Inline Floorball',
    club: 'skating',
    date: '2026-06-09',
  },
  { slug: 'intertidal-2026-06-22', title: 'Intertidal', club: 'diving', date: '2026-06-22' },
  {
    slug: 'sea-glass-workshop-2026-07-25',
    title: 'Sea Glass Workshop',
    club: 'diving',
    date: '2026-07-25',
  },
  { slug: 'mass-bbpt-2026-08-11', title: 'Mass BBPT', club: 'biking', date: '2026-08-11' },
  {
    slug: 'bts-dive-tioman-2026-08-21',
    title: 'BTS Dive @ Tioman',
    club: 'diving',
    date: '2026-08-21',
  },
  {
    slug: 'training-and-urban-free-clinic-2026-08-21',
    title: 'Training and Urban: Free Clinic!',
    club: 'skating',
    date: '2026-08-21',
  },
  { slug: 'longboarding-2026-08-21', title: 'Longboarding', club: 'xseed', date: '2026-08-21' },
  {
    slug: 'pcn-lkcsb-to-ecp-2026-08-22',
    title: 'PCN: LKCSB to ECP',
    club: 'biking',
    date: '2026-08-22',
  },
  {
    slug: 'marina-bay-expedition-programme-2026-08-22',
    title: 'Marina Bay Expedition Programme',
    club: 'kayaking',
    date: '2026-08-22',
  },
  {
    slug: 'local-hike-tree-top-walk-2026-08-22',
    title: 'Local Hike (Tree-top walk)',
    club: 'trekking',
    date: '2026-08-22',
  },
  {
    slug: 'trek-run-golden-mile-2026-08-26',
    title: 'Trek Run (Golden Mile)',
    club: 'trekking',
    date: '2026-08-26',
  },
  {
    slug: 'smux-skatathon-d0-prep-2026-08-29',
    title: 'SMUX Skatathon D0 Prep',
    club: 'skating',
    date: '2026-08-29',
  },
  { slug: 'wakeboarding-2026-08-29', title: 'Wakeboarding', club: 'xseed', date: '2026-08-29' },
  {
    slug: 'smux-skatathon-2026-2026-08-30',
    title: 'SMUX Skatathon 2026',
    club: 'skating',
    date: '2026-08-30',
  },
  {
    slug: 'training-and-urban-free-clinic-2026-09-04',
    title: 'Training and Urban: Free Clinic!',
    club: 'skating',
    date: '2026-09-04',
  },
  { slug: 'wakeboarding-2026-09-04', title: 'Wakeboarding', club: 'xseed', date: '2026-09-04' },
  {
    slug: 'local-hike-mount-faber-labrador-park-2026-09-05',
    title: 'Local Hike (Mount Faber + Labrador Park)',
    club: 'trekking',
    date: '2026-09-05',
  },
  { slug: 'wakeboarding-2026-09-10', title: 'Wakeboarding', club: 'xseed', date: '2026-09-10' },
  {
    slug: 'training-and-urban-2026-09-11',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-09-11',
  },
  {
    slug: 'special-event-pulau-ubin-2026-09-12',
    title: 'Special Event (Pulau Ubin)',
    club: 'trekking',
    date: '2026-09-12',
  },
  {
    slug: 'pcn-changi-village-to-changi-airport-2026-09-19',
    title: 'PCN: Changi Village to Changi Airport',
    club: 'biking',
    date: '2026-09-19',
  },
  {
    slug: 'kayaking-and-fishing-w-smurf-2026-09-19',
    title: 'Kayaking and Fishing (w SMURF)',
    club: 'kayaking',
    date: '2026-09-19',
  },
  { slug: 'wakeboard-2026-09-20', title: 'Wakeboard', club: 'xseed', date: '2026-09-20' },
  {
    slug: 'trek-run-botanic-garden-2026-09-23',
    title: 'Trek Run (Botanic Garden)',
    club: 'trekking',
    date: '2026-09-23',
  },
  { slug: 'psr-event-2026-09-25', title: 'PSR event', club: 'biking', date: '2026-09-25' },
  {
    slug: 'training-and-urban-2026-09-25',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-09-25',
  },
  { slug: 'longboard-2026-09-25', title: 'Longboard', club: 'xseed', date: '2026-09-25' },
  {
    slug: '1-2-star-course-no-kayak-exco-2026-10-03',
    title: '1/2 Star Course (no kayak exco)',
    club: 'kayaking',
    date: '2026-10-03',
  },
  {
    slug: 'law-mentorship-law-camp-x-smux-biking-2026-10-05',
    title: 'Law mentorship (Law Camp x SMUX Biking)',
    club: 'biking',
    date: '2026-10-05',
  },
  {
    slug: 'special-event-trekking-x-xseed-mandai-2026-10-05',
    title: 'Special Event (Trekking x Xseed @ Mandai)',
    club: 'trekking',
    date: '2026-10-05',
  },
  {
    slug: 'artscience-museum-2026-10-07',
    title: 'ArtScience Museum',
    club: 'diving',
    date: '2026-10-07',
  },
  {
    slug: 'recess-week-dive-tioman-2026-10-09',
    title: 'Recess Week Dive @ Tioman',
    club: 'diving',
    date: '2026-10-09',
  },
  { slug: 'pedal-paddle-2026-10-10', title: 'Pedal Paddle', club: 'biking', date: '2026-10-10' },
  {
    slug: 'skate-xseed-longboard-collab-urban-2026-10-16',
    title: 'Skate & Xseed (longboard) Collab Urban',
    club: 'skating',
    date: '2026-10-16',
  },
  {
    slug: 'skate-xseed-collab-urban-2026-10-16',
    title: 'Skate & Xseed Collab Urban',
    club: 'xseed',
    date: '2026-10-16',
  },
  {
    slug: '2-star-course-2026-10-17',
    title: '2 Star Course',
    club: 'kayaking',
    date: '2026-10-17',
  },
  {
    slug: 'local-hike-coney-island-2026-10-17',
    title: 'Local Hike (Coney Island)',
    club: 'trekking',
    date: '2026-10-17',
  },
  {
    slug: 'wah-sup-tentative-2026-10-17',
    title: 'WAH-SUP(tentative)',
    club: 'xseed',
    date: '2026-10-17',
  },
  {
    slug: 'trek-run-gardens-by-the-bay-2026-10-21',
    title: 'Trek Run (Gardens by the Bay)',
    club: 'trekking',
    date: '2026-10-21',
  },
  {
    slug: 'training-and-urban-2026-10-23',
    title: 'Training and Urban',
    club: 'skating',
    date: '2026-10-23',
  },
  { slug: 'wakeboarding-2026-10-23', title: 'Wakeboarding', club: 'xseed', date: '2026-10-23' },
  {
    slug: 'lkcsb-jurong-lake-gardens-via-rail-corridor-2026-10-24',
    title: 'LKCSB - Jurong Lake Gardens via Rail Corridor',
    club: 'biking',
    date: '2026-10-24',
  },
  {
    slug: 'halloween-skate-2026-10-30',
    title: 'Halloween Skate',
    club: 'skating',
    date: '2026-10-30',
  },
  {
    slug: 'special-event-midnight-hike-2026-10-30',
    title: 'Special Event (Midnight Hike)',
    club: 'trekking',
    date: '2026-10-30',
  },
  { slug: 'oceanarium-2026-10-31', title: 'Oceanarium', club: 'diving', date: '2026-10-31' },
  { slug: 'night-kayak-2026-10-31', title: 'Night Kayak', club: 'kayaking', date: '2026-10-31' },
  { slug: 'wakeboarding-2026-11-13', title: 'Wakeboarding', club: 'xseed', date: '2026-11-13' },
  {
    slug: 'sundown-kayak-kallang-2026-11-14',
    title: 'Sundown Kayak @ Kallang',
    club: 'kayaking',
    date: '2026-11-14',
  },
]

/**
 * SMUX-wide events run by the main committee, from the same spreadsheet.
 *
 * These have no club: they belong to SMUX itself. Internal governance (council and
 * safety meetings, the AGM, exco retreats) and multi-week campaigns (nominations,
 * membership and merch sales) are excluded — they are not things a student turns up to.
 */
export interface McEvent {
  slug: string
  title: string
  date: string
}

export const MC_EVENTS: McEvent[] = [
  { slug: 'smux-welfare-drive-2025-11-07', title: 'SMUX Welfare Drive', date: '2025-11-07' },
  { slug: 'smuxie-night-2025-11-07', title: 'SMUXIE Night', date: '2025-11-07' },
  { slug: 'smux-study-on-2025-11-17', title: 'SMUX Study On!', date: '2025-11-17' },
  {
    slug: 'smuxie-exclusive-hydrodash-2025-12-08',
    title: 'SMUXIE Exclusive: Hydrodash',
    date: '2025-12-08',
  },
  { slug: 'smuxie-roadshow-2026-02-04', title: 'SMUXIE Roadshow', date: '2026-02-04' },
  {
    slug: 'smuxie-exclusive-overnight-camp-2026-03-03',
    title: 'SMUXIE Exclusive: Overnight Camp',
    date: '2026-03-03',
  },
  { slug: 'welfare-drive-2026-04-08', title: 'Welfare Drive', date: '2026-04-08' },
  { slug: 'smuxie-night-1-2026-04-08', title: 'SMUXIE Night 1', date: '2026-04-08' },
  { slug: 'smux-study-on-2026-04-12', title: 'SMUX Study On!', date: '2026-04-12' },
  { slug: 'smux-study-on-2026-04-13', title: 'SMUX Study On!', date: '2026-04-13' },
  { slug: 'smux-free-clinic-week-2026-08-21', title: 'SMUX Free Clinic Week', date: '2026-08-21' },
  { slug: 'forest-adventure-2026-08-28', title: 'Forest Adventure', date: '2026-08-28' },
  { slug: 'obv-brief-2026-09-11', title: 'OBV Brief', date: '2026-09-11' },
  {
    slug: 'obv-training-1-mt-faber-marang-trail-2026-09-18',
    title: 'OBV Training 1 - Mt Faber Marang Trail',
    date: '2026-09-18',
  },
  {
    slug: 'obv-training-2-fort-canning-kayak-kwsc-2026-10-18',
    title: 'OBV Training 2 - Fort Canning + Kayak @ KWSC',
    date: '2026-10-18',
  },
  {
    slug: 'smuxie-camp-lazarus-island-2026-10-24',
    title: 'SMUXIE Camp @ Lazarus Island',
    date: '2026-10-24',
  },
  {
    slug: 'obv-training-3-bt-timah-weighted-hike-2026-10-30',
    title: 'OBV Training 3 - Bt. Timah Weighted Hike',
    date: '2026-10-30',
  },
  {
    slug: 'exco-appreciation-night-2026-11-06',
    title: 'Exco Appreciation Night',
    date: '2026-11-06',
  },
  { slug: 'welfare-drive-2026-11-11', title: 'Welfare Drive', date: '2026-11-11' },
  { slug: 'smuxie-night-2-2026-11-11', title: 'SMUXIE Night 2', date: '2026-11-11' },
  {
    slug: 'obv-training-4-fort-canning-weighted-hike-kayak-kwsc-2026-11-15',
    title: 'OBV Training 4 - Fort Canning Weighted Hike + Kayak @ KWSC',
    date: '2026-11-15',
  },
  { slug: 'smux-study-on-2026-11-16', title: 'SMUX Study On!', date: '2026-11-16' },
  {
    slug: 'smux-ha-long-bay-expedition-2026-12-05',
    title: 'SMUX Ha Long Bay Expedition',
    date: '2026-12-05',
  },
  {
    slug: 'smux-ha-long-bay-expedition-2026-12-07',
    title: 'SMUX Ha Long Bay Expedition',
    date: '2026-12-07',
  },
]
