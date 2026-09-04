/**
 * Real SMUX content, transcribed from the Vivace 2026 CCA listings supplied by the
 * owner. Club copy, FAQs, sessions and socials are theirs, not invented.
 *
 * Two things are deliberately not verbatim:
 *   - Taglines are short paraphrases of each club's own About text, because the source
 *     listings have no tagline field.
 *   - Committee roles are "Exco" wherever the source did not state one. Trekking's
 *     photos carried real roles in their filenames, so those are used exactly.
 */

export interface SeedPerson {
  name: string
  role: string
  file: string
}

export interface SeedImage {
  file: string
  alt: string
}

export interface SeedClub {
  slug: 'biking' | 'diving' | 'kayaking' | 'skating' | 'trekking' | 'xseed'
  name: string
  tagline: string
  whoWeAre: string[]
  sessions: string[]
  howToJoin: string[]
  keyEvents: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
  achievements: string[]
  socials: {
    email?: string
    telegram?: string
    instagram?: string
    facebook?: string
    tiktok?: string
    website?: string
  }
  hero: SeedImage
  gallery: SeedImage[]
  people: SeedPerson[]
}

export const SITE = {
  motto: 'Explore the outdoors. Grow through adventure.',
  // The wireframe's hand-lettered motto, set as a typographic block on the home page.
  mottoWords: ['Fun', 'Family', 'Adventure'],
  about: [
    'SMUX is the CCA student constituent body that represents the outdoor and adventure wing of SMU. Established in 2000, we are a tight-knit family of 6 clubs — Biking, Diving, Kayaking, Skating, Trekking and XSeed (board sports).',
    'SMUX prides itself on being inclusive, crafting accessible events catered to students of all experience levels, and offering both local and overseas opportunities to explore the outdoors. Through these avenues, SMUX facilitates personal development and growth through adventure.',
  ],
  socials: {
    email: 'xplorationcrew@sa.smu.edu.sg',
    telegram: 't.me/smuxplorationcrew',
    instagram: 'smuxplorationcrew',
    website: 'https://smuxplorationcrew.sg/',
    linkedin: 'https://www.linkedin.com/in/smuxplorationcrew/',
  },
  stats: [
    { value: '6', label: 'clubs' },
    { value: '2000', label: 'established' },
    { value: 'All', label: 'levels welcome' },
  ],
  faqs: [
    {
      question: 'What is the difference between SMUX and SMU-X?',
      answer:
        'SMUX is pronounced as ‘SMUCKS’ and not S-M-U-X! We are a CCA CBd for outdoor adventure activities — not to be confused with the experiential learning framework SMU-X.',
    },
    {
      question: 'What sort of experience do I need to be part of SMUX?',
      answer:
        'You do not need any prior background to join us. Just bring along an open mind and your spirit for adventure to explore the outdoors with us!',
    },
    {
      question: 'How frequent are the sessions for SMUX?',
      answer:
        'It depends on the club you choose to join but each club generally conducts their activities weekly! Our members often go for multiple club activities as they fall on different days of the week.',
    },
    {
      question: 'What is the level of commitment for each SMUX club?',
      answer:
        'Generally, our activity sessions do not require any level of commitment. You may sign-up for events as and when you’d like.',
    },
    {
      question: 'Do I need to be a member to participate in SMUX activities?',
      answer:
        'No, you do not! Our activities are open to all SMU students. If you’d like additional perks such as priority sign-ups, member-exclusive benefits, and discounts on selected events and merchandise, you can purchase a membership from any SMUX club. Club members are automatically recognised as SMUX members and enjoy both club-specific and SMUX-wide benefits.',
    },
  ],
}

/**
 * Euphorux Camp — the SMUX-wide camp, run by the main committee rather than one club.
 *
 * The mass photo leads: a real photograph of the whole crew is a far better home hero
 * than a placeholder block or a stock image of somebody else's adventure.
 */
export const SMUX_WIDE_ALBUM = {
  title: 'Euphorux Camp',
  date: '2026-08-01T00:00:00.000Z',
  hero: {
    file: '../Euphorux Camp/Mass Photo.JPG',
    alt: 'The whole SMUX crew together at Euphorux Camp',
  },
  photos: [
    { file: '../Euphorux Camp/1.jpg', alt: 'Participants at Euphorux Camp' },
    { file: '../Euphorux Camp/2.jpg', alt: 'Camp activities at Euphorux Camp' },
    { file: '../Euphorux Camp/3.jpg', alt: 'Teams taking part in Euphorux Camp' },
    { file: '../Euphorux Camp/4.jpg', alt: 'Group activity at Euphorux Camp' },
  ],
}

export const CLUBS: SeedClub[] = [
  {
    slug: 'biking',
    name: 'SMUX Biking',
    tagline: 'Grab your bike, bites and buddies.',
    whoWeAre: [
      'SMUX Biking caters to riders of all proficiency levels.',
      'Look forward riding to various places in Singapore as we mingle over food, and share new experiences with one another while forging new friendships!',
      'Join our welcoming and friendly family as we grab our bikes, bites and buddies for breezy rides. You provide the legs, we provide the ride and great experiences!',
    ],
    sessions: ['Day: Saturdays. Time: typically 4–7pm. Venue: changes based on route!'],
    howToJoin: [
      'Students do not need to audition or interview to join SMUX Biking. We cater to riders of all proficiency levels, so long as you pass our Bike Proficiency Test (BPT) before the rideout, we will love to have you join us and mingle!',
    ],
    keyEvents: [
      {
        title: 'Sunset on Wheels',
        description:
          'Catered to participants at an introductory level with a twist (cycling in the evening). Participants will cycle around Singapore with frequent food stops to popular supper places!',
      },
      {
        title: 'PCN Series rideouts',
        description:
          'The PCN series rideouts aim to bring riders of all proficiencies to explore different parts of Singapore, from MacRitchie Reservoir and Kranji Marshes to the iconic East Coast Park.',
      },
      {
        title: 'OCBC Cycle',
        description:
          'We participate annually at the OCBC Cycle, a corporate biking event that brings people and families together in one event! Mingle with fellow biking enthusiasts and exchange unforgettable memories.',
      },
    ],
    faqs: [
      {
        question: 'Do I need to own a bicycle to participate in SMUX Biking events?',
        answer:
          'No, you do not! We have road and mountain bikes to loan out when you sign up for our rides. If you decide to bring your own bike, do ensure that it is in serviceable condition. Please keep in mind that the organizers will not be held liable for the maintenance and condition of your bicycle.',
      },
      {
        question: 'I have not ridden a bicycle for a long time, can I still participate?',
        answer:
          'Yes, you can once you have passed our bike proficiency test that will be conducted if it’s your first time riding with us.',
      },
      {
        question: 'Do you guys ride on the road, and is it safe?',
        answer:
          'Yes, we do! We have experience leading and rearing rides, and a safety briefing will be conducted before starting off. In terms of an emergency, our executive committee members are equipped with first-aid and basic bicycle technical know-how to aid you.',
      },
      {
        question: 'What happens if I cannot keep up with the train I am in?',
        answer:
          'You can ask any of our friendly executive committee members to be put in the slower train, and a committee member will accompany you should you need to rest.',
      },
      {
        question: 'I’m not a SMUX Biking member, can I join the events?',
        answer:
          'Yes, absolutely! We welcome everyone to our events after they have passed the Basic Biking Proficiency Test. SMUX Biking members will have a discounted price for bike and helmet rental, and will receive priority for our signature events!',
      },
    ],
    achievements: [
      '14/14 finishers for OCBC Cycle 2024 Sportive 40km Ride with Provost',
      '5/5 finishers for OCBC Cycle 2023 Sportive 40km Ride with Provost, and 12/12 finishers for Straits Times 20km City Ride',
      '11/11 finishers for NTU Bike Rally 2019, 118km',
    ],
    socials: {
      email: 'biking@sa.smu.edu.sg',
      telegram: 't.me/+1bFgrdUz2384OTJl',
      instagram: 'smuxbiking',
      facebook: 'https://www.facebook.com/groups/5094212471',
      tiktok: 'https://www.tiktok.com/@smuxbiking',
    },
    hero: {
      file: 'Biking/Uploads by Raj (spam)/RAJ-1737.jpg',
      alt: 'SMUX Biking riders on a group rideout in Singapore',
    },
    gallery: [
      { file: 'Biking/02 - Flyer -_ Punggol.jpg', alt: 'Riders on the Flyer to Punggol route' },
      { file: 'Biking/03 - Rail Corridor_.jpg', alt: 'Cycling along the Rail Corridor' },
      { file: 'Biking/04 - SMU -_ Changi.jpg', alt: 'Riders on the SMU to Changi route' },
      { file: 'Biking/05 - Tandem.jpg', alt: 'Riders on a tandem bicycle' },
      {
        file: 'Biking/06 - Pedal X Paddle.jpg',
        alt: 'Pedal X Paddle joint event with SMUX Kayaking',
      },
      {
        file: 'Biking/07 - Punggol -_ Pasir Ris.jpg',
        alt: 'Riders on the Punggol to Pasir Ris route',
      },
      { file: 'Biking/Group pic 1.JPG', alt: 'SMUX Biking group photo' },
      { file: 'Biking/grp pic 2.JPG', alt: 'SMUX Biking group photo at a rideout' },
      {
        file: 'Biking/Uploads by Raj (spam)/RAJ-1736.jpg',
        alt: 'SMUX Biking riders during a rideout',
      },
      {
        file: 'Biking/Uploads by Raj (spam)/RAJ-1740.jpg',
        alt: 'SMUX Biking riders resting during a rideout',
      },
    ],
    people: [
      { name: 'Dinneth Bandara', role: 'Exco', file: 'Biking/Dinneth Bandara.jpg' },
      { name: 'En Xian Lee', role: 'Exco', file: 'Biking/En Xian Lee.jpg' },
      { name: 'Fazlur Mohamed', role: 'Exco', file: 'Biking/Fazlur Mohamed.jpg' },
      { name: 'Isabelle Foo', role: 'Exco', file: 'Biking/Isabelle Foo.jpg' },
      { name: 'Jarren Tan', role: 'Exco', file: 'Biking/Jarren Tan.jpg' },
      { name: 'Steven Yansen', role: 'Exco', file: 'Biking/Steven Yansen.JPG' },
      { name: 'Verlin You', role: 'Exco', file: 'Biking/Verlin You.JPG' },
      { name: 'Wu Mingxuan', role: 'Exco', file: 'Biking/Wu Mingxuan.jpg' },
    ],
  },

  {
    slug: 'diving',
    name: 'SMUX Diving',
    tagline: 'Live, breathe, beneath.',
    whoWeAre: [
      'Live, breathe, beneath with SMUX Diving Team. We provide a unique platform for students to come together as a community to pursue their passion for adventure, the ocean and marine life.',
      'Our aim is to make diving accessible to beginners, sharing the beauty of the underwater while spreading conservation initiatives to the masses.',
    ],
    sessions: [
      'We aim to have 4 major dives throughout the year, usually at the beginning of the semester (Back to School Dive) or during recess week.',
      'We also host our Intertidal Walk and Sea Glass Workshop based on tide levels, and introductory courses to Underwater Hockey and Underwater Rugby once a semester, subject to vendor availability.',
    ],
    howToJoin: [
      'SMUX Diving has no prerequisites to joining our events. We offer the opportunity for anyone to experience diving regardless of prior skillsets. You will be equipped with the necessary skills and knowledge when you take your first diving certification course with us!',
    ],
    keyEvents: [
      {
        title: 'Certification Dives',
        description:
          'Not a licensed diver? SMUX Diving hosts subsidised certification dives with our vendor, Blue Reef Scuba. Non-divers can obtain their PADI Open Water Certification, while divers can upgrade to Advanced Open Water.',
      },
      {
        title: 'Leisure Dives',
        description:
          'An opportunity for divers, both seasoned and newly certified, to make waves and memories. Over the years we have dived in Thailand, the Philippines, Malaysia and Indonesia.',
      },
      {
        title: 'Intertidal Walk',
        description:
          'Takes participants to intertidal zones where a rich and thriving biodiversity can be found. Divers and non-divers alike experience the scenery and get up close with marine life.',
      },
      {
        title: 'Sea Glass Workshop',
        description:
          'As part of our conservation efforts, SMUX Diving hosts beach clean-ups where participants help make our shores pristine while turning trash into sustainable treasures.',
      },
    ],
    faqs: [
      {
        question: 'Must I be a strong swimmer to learn diving?',
        answer:
          'Swimming 200m and treading water for 10 minutes is a prerequisite for diving. However, you do not have to be a very strong swimmer. The buoyancy control device also acts as a flotation device to help you stay afloat before and after dives. Before diving you will undergo theory and practical lessons covering the necessary safety precautions.',
      },
      {
        question: 'Is diving an expensive sport?',
        answer:
          'Costs vary according to the dive centre and country. A new diver typically pays for an entry-level certification course inclusive of equipment rental. Our official diving trips are usually at subsidised rates, and you may apply to use your PSEA funds for school-approved SMUX Diving trips.',
      },
      {
        question: 'Can I still dive if I rely on my glasses heavily?',
        answer:
          'Yes. You can wear daily contact lenses while diving, or invest in a prescription mask — diving mask lenses can have degrees too. If your degree is under 150 you may not need either: underwater, the magnifying property of water acts as mild corrective lenses.',
      },
      {
        question: 'Do I need a diving licence to join SMUX Diving events?',
        answer:
          'Nope! We offer dive certification courses, and many of our divers took their very first certification with us. We also have land-based events that do not require you to dive.',
      },
    ],
    achievements: [],
    socials: {
      email: 'diving@sa.smu.edu.sg',
      telegram: 't.me/smuxdiving',
      instagram: 'smuxdiving',
      facebook: 'https://www.facebook.com/smuxdivingteam',
    },
    hero: {
      file: 'Diving/Li Chengs Tough TG-6-32.jpg',
      alt: 'SMUX Diving members underwater during a dive',
    },
    gallery: [
      {
        file: 'Diving/Intertidal Walk Oct 25-23.jpg',
        alt: 'Participants exploring the intertidal zone on an Intertidal Walk',
      },
      { file: 'Diving/Li Chengs Tough TG-6-12.jpg', alt: 'Underwater scene on a SMUX dive' },
      {
        file: 'Diving/Li Chengs Tough TG-6-38.jpg',
        alt: 'Marine life photographed on a SMUX dive',
      },
    ],
    people: [
      { name: 'Jen Xen', role: 'Exco', file: 'Diving/Jen Xen.jpg' },
      { name: 'Jeselle', role: 'Exco', file: 'Diving/Jeselle.jpg' },
      { name: 'Joshua', role: 'Exco', file: 'Diving/Joshua.jpg' },
      { name: 'Junqi', role: 'Exco', file: 'Diving/Junqi.jpg' },
      { name: 'Ritco', role: 'Exco', file: 'Diving/Ritco.jpg' },
      { name: 'Zhi Xin', role: 'Exco', file: 'Diving/Zhi Xin.jpg' },
    ],
  },

  {
    slug: 'kayaking',
    name: 'SMUX Kayaking',
    tagline: 'Your gateway into water adventure sports.',
    whoWeAre: [
      'SMUX Kayaking is more than a club, it is your gateway into the world of water adventure sports. Whether you’re picking up a paddle for the first time or looking to push your limits further, we welcome kayakers of all levels into this tight-knit family united by a love for the water.',
      'We paddle across some of Singapore’s most scenic waterways such as Marina Reservoir, Pasir Ris, Sembawang, and beyond. For those ready to go further, we actively support members in pursuing kayaking certifications.',
      'As part of the larger SMUX family, we regularly collaborate with our sister clubs to craft unique, cross-discipline events.',
    ],
    sessions: [
      'Saturdays, 9:00am to 12:00pm. Kallang Water Sports Centre and PassionWave outlets.',
    ],
    howToJoin: [
      'Students do not need to audition or interview to join SMUX Kayaking, as our club welcomes individuals of all kayaking abilities.',
    ],
    keyEvents: [
      {
        title: 'Paddle by the Bae',
        description:
          'A scenic sunset paddle from Kallang Reservoir to Marina Barrage. Perfect for couples, crushes and even besties — good vibes, views, and row-mance.',
      },
      {
        title: 'Jurong Lake Discovery',
        description:
          'Explore Jurong Lake’s hidden beauty on an expedition through calm waters and cultural landmarks. Unwind, reconnect with nature, and take in Singapore’s serene side.',
      },
      {
        title: 'PANIC!',
        description:
          'Our paddle picnic. Break a sweat out on the water before heading back to shore for a well-deserved feast, refuelling with food and drinks in the best company.',
      },
    ],
    faqs: [
      {
        question: 'Do participants require background knowledge or certification?',
        answer:
          'Certain paddles require a 1 star or 2 star certification, but we do have paddles catered to participants who are new to kayaking.',
      },
      {
        question: 'How regular are your paddles?',
        answer:
          'Once a week, on Saturdays. Closer to exam periods, we take a break from our weekly paddles.',
      },
      {
        question: 'Are the paddles free?',
        answer:
          'Most of our paddles are subsidised. The prices will be listed when the paddles are opened for sign-ups.',
      },
      {
        question: 'I have never paddled before, will I struggle?',
        answer:
          'We have events specifically catered towards beginners or new paddlers. These act as an introductory course focused on teaching the basics of paddling.',
      },
      {
        question: 'Will I be required to prove that I can swim?',
        answer:
          'We conduct a Water Proficiency Test (WPT) to determine your swimming ability. If you have a prior swimming certification, you need not attend the WPT.',
      },
    ],
    achievements: [
      'One Raft One Nation 2025 — record for largest raft formed by kayaks',
      'NUS Legs and Paddles 2019 — 2nd place, mixed doubles',
    ],
    socials: {
      email: 'kayaking@sa.smu.edu.sg',
      telegram: 't.me/SMUXKayaking',
      instagram: 'smuxkayaking',
      facebook: 'https://www.facebook.com/smuxkayaking/',
      website: 'https://smuxkayaking.wixsite.com/blog',
    },
    hero: { file: 'Kayaking/IMG_8940.jpeg', alt: 'SMUX Kayaking paddlers on the water at sunset' },
    gallery: [
      { file: 'Kayaking/R6__0568.JPG', alt: 'Kayakers paddling in formation' },
      { file: 'Kayaking/photo_2026-01-19 23.13.38.jpeg', alt: 'SMUX Kayaking members on a paddle' },
      {
        file: 'Kayaking/photo_2026-01-19 23.13.54.jpeg',
        alt: 'Kayaks lined up before a session',
      },
      { file: 'Kayaking/photo_2026-01-20 00.05.00.jpeg', alt: 'SMUX Kayaking group on the water' },
    ],
    people: [
      { name: 'Cheyenne', role: 'Exco', file: 'Kayaking/cheyenne.jpeg' },
      { name: 'Claudia', role: 'Exco', file: 'Kayaking/claudia.jpeg' },
      { name: 'Crystal', role: 'Exco', file: 'Kayaking/crystal.jpeg' },
      { name: 'Denisse', role: 'Exco', file: 'Kayaking/denisse.jpeg' },
      { name: 'Jonas', role: 'Exco', file: 'Kayaking/jonas.jpeg' },
      { name: 'Keane', role: 'Exco', file: 'Kayaking/keane.jpeg' },
      { name: 'Megan', role: 'Exco', file: 'Kayaking/megan.jpeg' },
    ],
  },

  {
    slug: 'skating',
    name: 'SMUX Skating',
    tagline: 'From your first skate to the city at night.',
    whoWeAre: [
      'SMUX Skating is an inline skating club in SMU that is open to all students. Whether you’re a pro or have never picked up a pair of skates before, we welcome everyone to the SMUX Skating family!',
      'Our weekly Friday sessions have a training segment where we teach beginners how to skate from scratch and give intermediates a space to have some fun and learn new tricks. After training, we bring skaters who are urban-proficient to skate in the city for dinner before skating back to school.',
    ],
    sessions: [
      'Skate Training: Fridays, 4:00pm to 6:00pm at SMU T-Junction, SMU Connexion or SCIS Subway.',
      'Urban Skate: Fridays, 7:00pm to 9:30pm, all around Singapore — keep a lookout for the semester forecast for locations.',
    ],
    howToJoin: [
      'Students do not need to audition or interview to join SMUX Skating. We welcome skaters of all proficiency levels. Just bring yourself, your friends and your spirit of fun! Join our Telegram group and follow our Instagram to snag a slot when our weekly sign-ups drop.',
    ],
    keyEvents: [
      {
        title: 'SMU Skatathon',
        description:
          'Singapore’s one and only inline skating marathon. This annual event brings together skaters from around the world. Worried about a full marathon? Skatathon offers various race categories to suit all skill levels.',
      },
      {
        title: 'Skate Experience',
        description:
          'Four exciting skate-inspired events over the summer break, designed to ignite the excitement of even the most reluctant skater you know.',
      },
      {
        title: 'Halloween Skate',
        description:
          'Glide through a thrilling Halloween-themed skate party. Come dressed in your best costume and enjoy a night of fun yet eerie skating.',
      },
    ],
    faqs: [
      {
        question: 'Do I have to own a pair of skates to attend?',
        answer:
          'Nope! We have skates of most sizes available for rent each session. Skates are rented on a first come first served basis according to your indication of whether you will be attending that week’s session.',
      },
      {
        question: 'Do I need to know how to skate to attend?',
        answer:
          'Nope! Most of us start out with little or no experience skating. We have friendly exco members who conduct lessons for everyone to pick up this skill.',
      },
      {
        question: 'Inline skating sounds dangerous. Is it easy to get hurt?',
        answer:
          'The very first skill we teach is how to fall properly and safely. We provide helmets, which are a must on skates, along with wrist, elbow and knee guards. For all beginners, guards are compulsory.',
      },
      {
        question: 'Where can I sign up for weekly sessions?',
        answer:
          'Aside from our emails, we have a Telegram group where we mingle and post updates for all our activities. DM us on Instagram to find out more.',
      },
    ],
    achievements: [],
    socials: {
      email: 'skating@sa.smu.edu.sg',
      telegram: 't.me/smuxskaters',
      instagram: 'smuxskating',
    },
    hero: {
      file: 'Skating/HD quality/SMU Skatathon HD.JPG',
      alt: 'Skaters racing at the SMU Skatathon',
    },
    gallery: [
      {
        file: 'Skating/HD quality/Halloween Skate HD.jpg',
        alt: 'Skaters in costume at the Halloween Skate',
      },
      { file: 'Skating/HD quality/Ice Skating HD.jpg', alt: 'SMUX Skating members ice skating' },
      {
        file: 'Skating/HD quality/Weekly Skating Urban HD.jpg',
        alt: 'Urban skate session through the city at night',
      },
      { file: 'Skating/group pic 1.jpg', alt: 'SMUX Skating group photo' },
      { file: 'Skating/group pic 2.jpg', alt: 'SMUX Skating group photo after a session' },
      {
        file: 'Skating/first weekly session 2026.jpg',
        alt: 'The first weekly skating session of 2026',
      },
      {
        file: 'Skating/satay by the bay urban 2025.jpg',
        alt: 'Urban skate to Satay by the Bay, 2025',
      },
      { file: 'Skating/vivo urban skate_.jpg', alt: 'Urban skate to VivoCity' },
      { file: 'Skating/inline floorball.jpg', alt: 'Inline floorball session' },
    ],
    people: [
      { name: 'Chng Dee Ian', role: 'Exco', file: 'Skating/chng dee ian_.jpg' },
      { name: 'Chong Rui Sian', role: 'Exco', file: 'Skating/chong rui sian.jpg' },
      { name: 'Hia Soo Teng Janice', role: 'Exco', file: 'Skating/hia soo teng janice_.jpg' },
      { name: 'Kezman Tang', role: 'Exco', file: 'Skating/kezman tang.jpg' },
      { name: 'Lee Pei Wen', role: 'Exco', file: 'Skating/lee pei wen.jpg' },
      { name: 'Low Zi Hong', role: 'Exco', file: 'Skating/low zi hong_.jpg' },
      { name: 'Maia Goh', role: 'Exco', file: 'Skating/maia goh.jpg' },
      { name: 'Mandy Yong', role: 'Exco', file: 'Skating/mandy yong.jpg' },
      { name: 'Seah Shi Han', role: 'Exco', file: 'Skating/seah shi han.jpg' },
      { name: 'Ting Wei Fan', role: 'Exco', file: 'Skating/ting wei fan.jpg' },
    ],
  },

  {
    slug: 'trekking',
    name: 'SMUX Trekking',
    tagline: 'Got an attitude for altitude?',
    whoWeAre: [
      'The SMUX Trekking Team started as a platform for members passionate or interested about trekking, to prepare and build camaraderie for treks together.',
      'Join us on our #TrekRunWednesdays or Saturday hikes, to meet new people and get your weekly dose of exercise! We also organise exciting special events during the midterm, summer and winter breaks that will bring you and your friends to interesting places around Singapore.',
      'This is also a great opportunity to experience outdoor adventures and pick up some fun outdoor skills. Look out for our upcoming events, hikes, runs and overseas expedition!',
    ],
    sessions: [
      '#TrekRunWednesday: selected Wednesdays, evening.',
      '#SaturdayHike: Saturdays, morning.',
    ],
    howToJoin: [
      'Students do not need to audition or interview to join SMUX Trekking. We are a club that is open to anyone with a readiness to explore the outdoors!',
    ],
    keyEvents: [
      {
        title: 'Star Trek',
        description:
          'A fun-filled overnight beach trek with your friends, complete with laughter and great memories.',
      },
      {
        title: 'Overseas Expedition',
        description:
          'Haven’t travelled overseas in years? Come scratch that itch with an extra dose of nature this coming winter break. Join us on Instagram and Telegram for the latest details.',
      },
      {
        title: 'Trekking 101',
        description:
          'A two-part event that introduces participants to the basics of navigation and camping skills while enjoying the outdoors.',
      },
    ],
    faqs: [
      {
        question: 'Are there any requirements to join SMUX Trekking’s activities?',
        answer:
          'No, we welcome all SMU students! Anyone looking to make new friends and keep fit can join us for weekly trek runs and hikes. Our runs and hikes have options for different intensities, so you can choose your pace.',
      },
      {
        question: 'What should I bring for trek activities?',
        answer:
          'Come in comfortable sportswear and sport shoes. Bring your water bottle, some cash for a meal after the activity, your SMU matric card, and an inhaler if you are asthmatic.',
      },
      {
        question: 'Is there a place to deposit my stuff safely for your Wednesday runs?',
        answer:
          'Yes. We book a seminar room for every Wednesday run. It serves as our gathering place and you may leave your belongings there.',
      },
      {
        question: 'How do I sign up for trek activities?',
        answer:
          'All sign-ups are through Google Forms, sent by EDM to your school email and posted in our Telegram group. Sign-ups are first come first served and fill up quickly, so join our Telegram group for immediate notifications.',
      },
      {
        question: 'Can we borrow equipment such as trekking bags, windbreakers and headlamps?',
        answer:
          'Yes, you can borrow this equipment from us for free if you join us for our expeditions. You just have to ensure the equipment is undamaged when you return it.',
      },
    ],
    achievements: [],
    socials: {
      email: 'trekking@sa.smu.edu.sg',
      telegram: 't.me/smuxtrekkers',
      instagram: 'smuxtrekking',
      website: 'https://smux-trekking.wixsite.com/blog',
    },
    hero: {
      file: 'Trekking/Event 1 (Caption_ Railway Corridor🚂).jpg',
      alt: 'SMUX Trekking members hiking the Railway Corridor',
    },
    gallery: [
      {
        file: 'Trekking/Event 2 (Caption_ Always A Family🫶🏻).jpg',
        alt: 'SMUX Trekking members together on a hike',
      },
      { file: 'Trekking/Event 3 (Caption_ Night Runner).jpg', alt: 'Trek run in the evening' },
      { file: 'Trekking/Event 4 (Night Owls 🦉).jpg', alt: 'Night trek with SMUX Trekking' },
      { file: 'Trekking/Exco Team Photo.png', alt: 'SMUX Trekking executive committee team photo' },
    ],
    people: [
      { name: 'Ng Min Xie', role: 'President', file: 'Trekking/Ng Min Xie_ President.png' },
      {
        name: 'Wong Jean Ing Alyssa',
        role: 'Vice President and Head of General Safety',
        file: 'Trekking/Wong Jean Ing Alyssa_VP and HGS.png',
      },
      {
        name: 'Tan Jing Ing Charlotte',
        role: 'Head of Finance and Sponsorship',
        file: 'Trekking/Tan Jing Ing Charlotte_ HFS.png',
      },
      {
        name: 'Germaine Pan Jing Xuan',
        role: 'Events and Safety IC',
        file: 'Trekking/Germaine Pan Jing Xuan_ Events and Safety IC.png',
      },
      {
        name: 'Kayra Zalfa Alimaa (Kiya)',
        role: 'Events IC',
        file: 'Trekking/Kayra Zalfa Alimaa (Kiya)_Events IC.png',
      },
      {
        name: 'Lim Yi Liang Lucas',
        role: 'Marketing and Sponsorship IC',
        file: 'Trekking/Lim Yi Liang Lucas_Marketing and Sponsorship IC.png',
      },
      {
        name: 'Randahl Ng',
        role: 'Logistics and Safety IC',
        file: 'Trekking/Randahl Ng_Logistics and Safety IC.png',
      },
    ],
  },

  {
    slug: 'xseed',
    name: 'SMUX XSeed',
    tagline: 'Explore. Experience. Elevate.',
    whoWeAre: [
      'XSEED is SMU’s premier outdoor adventure sports club, offering students the chance to push boundaries and dive into adrenaline-pumping experiences.',
      'Beyond our regular local activities, XSEED occasionally organises spontaneous thrill-seeking collaborations with other SMUX clubs.',
      'Whether you’re a seasoned adrenaline junkie or looking to step out of your comfort zone, XSEED gives you the platform to grow holistically, develop your sporting abilities, and connect with like-minded peers. See you on the board!',
    ],
    sessions: [
      'Fridays, 4:00pm to 10:00pm at SMU Li Ka Shing Level 1. Training timings are subject to change.',
    ],
    howToJoin: [
      'Students do not need to audition or interview to join the club. SMUX XSEED welcomes participants from all backgrounds and interests — we believe outdoor sports are meant for everyone and anyone.',
    ],
    keyEvents: [
      {
        title: 'Longboarding',
        description:
          'A longer, wider board built for smooth cruising and high-speed downhill rides — stable enough for beginners, yet with plenty of room to grow.',
      },
      {
        title: 'Cable Boarding',
        description:
          'Singapore Wake Park offers cable wakeboarding, where an overhead motor-driven cable pulls riders across the water. Beginners start on System A, advance to System B for turns, then graduate to the Full-Size Cable.',
      },
      {
        title: 'Stand Up Paddling',
        description:
          'Balance on a large, stable board while using a long paddle to glide across the water. A fun, low-impact activity that is easy to pick up and endlessly enjoyable.',
      },
      {
        title: 'Trifecta Snow/Surf',
        description:
          'An immersive indoor centre offering advanced virtual snow simulators and a deep-water surf wave generator for all skill levels.',
      },
    ],
    faqs: [
      {
        question: 'Are SMUX XSEED’s activities risky or dangerous?',
        answer:
          'XSEED actively works with OSL and OSS to ensure a high standard of risk mitigation and good safety management. Our exhilarating activities can be enjoyed safely without significant risks.',
      },
      {
        question: 'Is it difficult to pick up XSEED’s activities because they are unfamiliar?',
        answer:
          'XSEED is an incubator for new outdoor adventure activities in SMU. We actively work towards a conducive learning environment where students of all proficiencies can participate regardless of prior experience.',
      },
      {
        question: 'Why does XSEED not specialise in one sport like the rest of the SMUX teams?',
        answer:
          'XSEED believes in strength through diversity — by providing a myriad of opportunities, we hope our members grow holistically and broaden their proficiency in less mainstream outdoor adventure sports.',
      },
      {
        question: 'How do I sign up for XSeed activities?',
        answer:
          'Sign up via Google Forms in EDMs sent to your school email account, or in our Telegram group. Sign-ups are first come first served and fill up quickly.',
      },
    ],
    achievements: [],
    socials: {
      email: 'xseed@sa.smu.edu.sg',
      telegram: 't.me/smuxseed',
      instagram: 'smuxxseed',
    },
    hero: {
      file: 'Xseed/events/Stationary Surfing.jpeg',
      alt: 'XSeed member on the stationary surf wave generator',
    },
    gallery: [
      { file: 'Xseed/events/Go Karting.png', alt: 'XSeed go-karting session' },
      { file: 'Xseed/group.jpg', alt: 'SMUX XSeed group photo' },
    ],
    people: [
      { name: 'Clarrie', role: 'Exco', file: 'Xseed/clarrie.jpeg' },
      { name: 'Darren', role: 'Exco', file: 'Xseed/darren.jpeg' },
      { name: 'Hark', role: 'Exco', file: 'Xseed/hark.jpeg' },
      { name: 'Jovan', role: 'Exco', file: 'Xseed/jovan.jpeg' },
      { name: 'Regen', role: 'Exco', file: 'Xseed/regen.jpeg' },
      { name: 'Ryan', role: 'Exco', file: 'Xseed/ryan.jpeg' },
      { name: 'Shervyn', role: 'Exco', file: 'Xseed/shervyn.jpeg' },
    ],
  },
]
