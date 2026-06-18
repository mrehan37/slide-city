import { RacePackage, Testimonial, GalleryItem, TrackSector, LeaderboardRacer } from './types';

export const PEXELS_IMAGES = {
  indoorRace: '/images/hero-1600.webp',
  indoorRaceSmall: '/images/hero-960.webp',
  startingGrid: '/images/starting-grid.webp',
  soloKart: '/images/solo-kart.webp',
  helmet: '/images/helmet.webp',
  outdoorRace: '/images/outdoor-race.webp',
  eventGrid: '/images/starting-grid.webp',
  teamEvent: '/images/team-event.webp',
  party: '/images/party.webp',
  schoolGroup: '/images/school-group.webp',
};

export const HERO_HIGHLIGHTS = [
  { text: 'Electric Drift Karts', icon: 'zap' },
  { text: 'Group & Birthday Bookings', icon: 'users' },
  { text: 'Lap Timing Boards', icon: 'clock' },
  { text: 'Beginner & Pro Formats', icon: 'award' },
];

export const RACE_PACKAGES: RacePackage[] = [
  {
    id: 'single-pass',
    name: 'Single Race Pass',
    price: 25,
    duration: '1 x 12 Minute Session',
    bestFor: 'First-time riders, quick adrenaline sessions',
    features: [
      'Safety briefing and pro helmet hire',
      'Lap results shown on pitwall screens',
      'Electronic speed levelling for confidence',
      'Perfect first taste of Slide City racing',
    ],
    speedLimit: '35 mph',
  },
  {
    id: 'double-pack',
    name: 'Double Race Pack',
    price: 45,
    duration: '2 x 12 Minute Sessions',
    bestFor: 'Riders seeking to master drift lines',
    badge: 'Popular',
    features: [
      'Break between races to review lap times',
      'Second session speed tier up to 45 mph',
      'Digital race profile and results tracking',
      'Save £5 compared with single bookings',
    ],
    speedLimit: '45 mph',
    popular: true,
  },
  {
    id: 'group-party',
    name: 'Group Party Package',
    price: 320,
    duration: '2 Hours Private Party Room',
    bestFor: 'Birthdays, youth groups, stag and hen parties',
    badge: 'Min 8 Racers',
    features: [
      '3 dedicated races for every participant',
      'Exclusive grid start with countdown lights',
      'Championship podium ceremony and medals',
      'Pizza, soft drinks, and party room included',
    ],
    speedLimit: '45 mph event mode',
  },
  {
    id: 'corporate-gp',
    name: 'Corporate Grand Prix',
    price: 599,
    duration: '3 Hours Full Track Buyout',
    bestFor: 'Team building, corporate days, large celebrations',
    badge: 'VIP Catering',
    features: [
      'Exclusive run-of-track & custom racing brackets',
      'Customised grid board with company branding',
      '1-to-1 coaching session with pro drivers',
      'Full VIP lounge access with premium hot catering',
    ],
    speedLimit: '50 mph pro mode',
  },
];

export const TRACK_SECTORS: TrackSector[] = [
  {
    id: 's1',
    name: 'The Launchpad Straight',
    difficulty: 'Green',
    length: '110m',
    keyFeature: 'Max top speed zone heading into a wide curve',
    driftPotential: 'Low (Clean line)',
    icon: 'ChevronsUp',
  },
  {
    id: 's2',
    name: 'Tsunami Drift Hairpin',
    difficulty: 'Red',
    length: '65m',
    keyFeature: '180-degree turn styled with slick track surface',
    driftPotential: 'Extreme (Drift zone)',
    icon: 'Shuffle',
  },
  {
    id: 's3',
    name: 'Sonic S-Curves',
    difficulty: 'Orange',
    length: '85m',
    keyFeature: 'Left-right-left high-speed transfers testing grip',
    driftPotential: 'Medium (Counter-steering)',
    icon: 'TrendingUp',
  },
  {
    id: 's4',
    name: 'The Checkered Squeeze',
    difficulty: 'Red',
    length: '40m',
    keyFeature: 'Tight technical chicane leading to the final start-finish line',
    driftPotential: 'High (Perfect apex needed)',
    icon: 'Cpu',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'Parent of 10-year-old',
    avatar: '/images/avatar-parent.webp',
    text: 'We booked my son’s birthday at Slide City and the team made everything easy. The safety briefing was clear, the marshals were brilliant with the kids, and the podium photos made the day feel huge.',
    rating: 5,
    tag: 'Parent',
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Corporate Events Lead',
    avatar: '/images/avatar-corporate.webp',
    text: 'Our team-building Grand Prix was the highlight of the quarter. Slide City handled the schedule, heats, catering, and awards so smoothly that our staff could just turn up and race.',
    rating: 5,
    tag: 'Group Booking',
  },
  {
    id: 't3',
    name: 'Alex "Nitro" Rivera',
    role: 'Competitive League Driver',
    avatar: '/images/avatar-racer.webp',
    text: 'Slide City has the sharpest indoor karting flow I’ve raced in the UK. The electric karts launch hard, the corners reward clean lines, and the timing screens keep every heat properly competitive.',
    rating: 5,
    tag: 'Racing Fan',
  },
  {
    id: 't4',
    name: 'Priya Patel',
    role: 'Birthday Party Host',
    avatar: '/images/avatar-parent.webp',
    text: 'We had twelve kids racing and the whole thing felt organised from start to finish. The party room was ready, the staff kept everyone calm, and the kids are still talking about the medals.',
    rating: 5,
    tag: 'Parent',
  },
  {
    id: 't5',
    name: 'Daniel Brooks',
    role: 'Operations Manager',
    avatar: '/images/avatar-corporate.webp',
    text: 'Slide City gave our team a proper break from the usual work social. The heat structure made it competitive without getting chaotic, and the timing screens kept everyone involved.',
    rating: 5,
    tag: 'Group Booking',
  },
  {
    id: 't6',
    name: 'Mia Thompson',
    role: 'Weekend Racer',
    avatar: '/images/avatar-racer.webp',
    text: 'The karts feel quick, the staff actually explain the racing line, and the results board makes every lap matter. Great place to bring friends who think they are faster than they are.',
    rating: 5,
    tag: 'Racing Fan',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Drift Action on Turn 4',
    category: 'action',
    image: PEXELS_IMAGES.indoorRace,
    aspect: 'aspect-square sm:aspect-video md:col-span-2',
  },
  {
    id: 'g2',
    title: 'Precision Full Face Helmets',
    category: 'karts',
    image: PEXELS_IMAGES.helmet,
    aspect: 'aspect-square',
  },
  {
    id: 'g3',
    title: 'Night Grid Setup',
    category: 'track',
    image: PEXELS_IMAGES.startingGrid,
    aspect: 'aspect-square',
  },
  {
    id: 'g4',
    title: 'Dynamic Electric Power Unit',
    category: 'karts',
    image: PEXELS_IMAGES.soloKart,
    aspect: 'aspect-video md:col-span-2',
  },
  {
    id: 'g5',
    title: 'Championship Podium Ceremony',
    category: 'events',
    image: PEXELS_IMAGES.party,
    aspect: 'aspect-square',
  },
  {
    id: 'g6',
    title: 'Neon Light Track Layout',
    category: 'track',
    image: PEXELS_IMAGES.outdoorRace,
    aspect: 'aspect-square',
  },
];

export const INITIAL_LEADERBOARD_ADULT: LeaderboardRacer[] = [
  { rank: 1, name: 'Chase "Aero" Sterling', avgLapTime: '17.892s', bestLap: '17.411s', kartNo: 4, gap: '---', interval: '---' },
  { rank: 2, name: 'Lana "Oversteer" Croft', avgLapTime: '18.104s', bestLap: '17.653s', kartNo: 15, gap: '+0.212s', interval: '+0.212s' },
  { rank: 3, name: 'Devon "Apex" Taylor', avgLapTime: '18.330s', bestLap: '17.910s', kartNo: 22, gap: '+0.438s', interval: '+0.226s' },
  { rank: 4, name: 'Reid "Draft" Kennedy', avgLapTime: '18.591s', bestLap: '18.024s', kartNo: 9, gap: '+0.699s', interval: '+0.261s' },
  { rank: 5, name: 'Lia "Sparks" Vance', avgLapTime: '18.788s', bestLap: '18.150s', kartNo: 11, gap: '+0.896s', interval: '+0.197s' },
];

export const INITIAL_LEADERBOARD_JUNIOR: LeaderboardRacer[] = [
  { rank: 1, name: 'Tommy "Bullet" Tyler', avgLapTime: '21.402s', bestLap: '20.910s', kartNo: 3, gap: '---', interval: '---' },
  { rank: 2, name: 'Chloe "Speedy" Baker', avgLapTime: '21.854s', bestLap: '21.112s', kartNo: 7, gap: '+0.452s', interval: '+0.452s' },
  { rank: 3, name: 'Zack "Drift" Ramirez', avgLapTime: '22.016s', bestLap: '21.390s', kartNo: 12, gap: '+0.614s', interval: '+0.162s' },
  { rank: 4, name: 'Sienna "Turbo" Gomez', avgLapTime: '22.422s', bestLap: '21.889s', kartNo: 18, gap: '+1.020s', interval: '+0.406s' },
];
