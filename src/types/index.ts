export type PersonaId =
  | "overachiever"
  | "scrambler"
  | "invisible"
  | "career";

export interface Persona {
  id: PersonaId;
  name: string;
  avatar: string;
  roleTitle: string;
  color: string;
  glowClass: string;
  slogan: string;
  realityCheck: string;
  heroQuote: string;
  internalMonologue: string;
  recommendedEpisodes: string[];
  recommendedAntidoteId: string;
  copingTip: string;
}

export interface PressureEpisode {
  id: string;
  episodeNumber: string;
  title: string;
  duration: string;
  matchScore: number;
  intensity: "High" | "Critical" | "Severe";
  tag: string;
  synopsis: string;
  trigger: string;
  quote: string;
  stats: {
    label: string;
    value: string;
  };
  breakdown: string[];
  survivalStep: string;
}

export interface AntidotePowerMove {
  id: string;
  number: string;
  title: string;
  category: string;
  timeToImplement: string;
  tagline: string;
  protocol: string[];
  mantra: string;
  impactScore: string;
}

export interface AnonymousVoice {
  id: string;
  author: string;
  major: string;
  text: string;
  category: "Academic" | "Social" | "Career" | "Family";
  initialRelates: number;
  timestamp: string;
  hasAudioClip: boolean;
}

export interface GlitchFlipCardData {
  id: string;
  socialMask: string;
  maskContext: string;
  realThought: string;
  rootFear: string;
  personaTarget: string;
}

export interface PowerAffirmation {
  id: string;
  title: string;
  body: string;
  authorNote: string;
  theme: "Validation" | "Rest" | "Pace" | "Perspective";
}
