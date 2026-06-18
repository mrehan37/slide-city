export interface RacePackage {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g. "3 x 10 Min Races" or "2 Hours Private"
  bestFor: string;
  badge?: string;
  features: string[];
  speedLimit: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  tag: string; // e.g., "Parent", "Organizer", "Fan"
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'karts' | 'action' | 'track' | 'events';
  image: string;
  aspect: string;
}

export interface TrackSector {
  id: string;
  name: string;
  difficulty: 'Green' | 'Orange' | 'Red';
  length: string;
  keyFeature: string;
  driftPotential: string;
  icon: string;
}

export interface LeaderboardRacer {
  rank: number;
  name: string;
  avgLapTime: string;
  bestLap: string;
  kartNo: number;
  gap: string;
  interval: string;
}
