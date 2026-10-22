export type ChatRole = "user" | "assistant" | "system";

export type ChatMode =
  | "vent" // Raw Vent (Pure validation, zero unsolicited advice)
  | "panic" // Panic De-escalator (Immediate physiological & cognitive grounding)
  | "untangle" // Thought Untangler (CBT reframing & distortion busting)
  | "action" // Action Slicer (Overcome paralysis with 5-minute micro steps)
  | "plan"; // Day Planner (Empathetic, energy-aware daily study schedule)

export type StudentMood =
  | "overwhelmed"
  | "anxious"
  | "exhausted"
  | "numb"
  | "frustrated"
  | "calmer";

export interface ScheduleBlock {
  time: string;
  activity: string;
  type: "deep" | "rest" | "admin" | "review";
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  mode?: ChatMode;
  thoughtDistortion?: string;
  actionSteps?: string[];
  groundingAnchor?: string;
  dailySchedule?: ScheduleBlock[];
}

export interface QuickPrompt {
  id: string;
  label: string;
  text: string;
  mode: ChatMode;
  emoji: string;
}
