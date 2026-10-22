import { QuickPrompt, ChatMode, StudentMood, ChatMessage } from "@/types/chat";
import { PersonaId } from "@/types";

export const CHAT_MODES: Record<
  ChatMode,
  { name: string; tag: string; description: string; color: string; badge: string }
> = {
  vent: {
    name: "Raw Vent",
    tag: "No Advice • Pure Listening",
    description: "I will hold space and validate your struggle. Zero unsolicited advice, zero toxic positivity.",
    color: "#f43f5e",
    badge: "VENT MODE",
  },
  panic: {
    name: "Panic Grounding",
    tag: "3-Min Reset",
    description: "For acute pre-exam dread, deadline hyperventilation, or cognitive freeze. Somatic resets first.",
    color: "#06b6d4",
    badge: "GROUNDING",
  },
  untangle: {
    name: "Thought Untangler",
    tag: "CBT Reframing",
    description: "Identify cognitive distortions (all-or-nothing, imposter syndrome, catastrophizing) and see reality clearly.",
    color: "#a855f7",
    badge: "DE-DISTORT",
  },
  action: {
    name: "Action Slicer",
    tag: "Beat Procrastination",
    description: "Turn an overwhelming monster assignment into tiny, frictionless 5-minute micro-steps.",
    color: "#10b981",
    badge: "ACTION SLICER",
  },
  plan: {
    name: "Day Planner",
    tag: "Energy-Aware Study Blueprint",
    description: "Design a humane, realistic daily schedule that balances high-yield study blocks with essential nervous system recovery.",
    color: "#6366f1",
    badge: "DAY PLANNER",
  },
};

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "q1",
    label: "Exam in 2 hours & spiraling",
    text: "I have a massive exam coming up and my chest is tight. I feel like I forgot everything I studied and I'm going to ruin my GPA.",
    mode: "panic",
    emoji: "⚡",
  },
  {
    id: "q2",
    label: "Feeling like an imposter",
    text: "I feel like everyone in my department understands this material naturally, and I was only admitted by mistake. I'm terrified they'll find out.",
    mode: "untangle",
    emoji: "🎭",
  },
  {
    id: "q3",
    label: "Tired of pretending 'I'm fine'",
    text: "I'm so exhausted from having to smile and tell my parents and friends that 'school is great!' when internally I am hanging on by a thread.",
    mode: "vent",
    emoji: "🥀",
  },
  {
    id: "q4",
    label: "Paralyzed by a giant assignment",
    text: "I have a huge project due tomorrow that I haven't started. The panic is making me freeze and scroll instead of working. Help me break the freeze.",
    mode: "action",
    emoji: "⏳",
  },
  {
    id: "q5",
    label: "LinkedIn comparison dread",
    text: "I opened LinkedIn and saw three people in my year landing crazy internships. I feel like I'm already years behind and unemployable.",
    mode: "untangle",
    emoji: "📉",
  },
  {
    id: "q6",
    label: "Just let me complain without fixing it",
    text: "I don't need solutions right now. I just want someone to acknowledge that juggling 5 classes, rent, sleep, and expectations is utterly exhausting.",
    mode: "vent",
    emoji: "💬",
  },
  {
    id: "q7",
    label: "Plan my 4-hour study day",
    text: "I have 4 hours today to study, but I'm mentally exhausted and prone to procrastination. Help me build a realistic, energy-managed day plan.",
    mode: "plan",
    emoji: "📅",
  },
  {
    id: "q8",
    label: "Beat morning freeze & plan today",
    text: "I woke up overwhelmed by my todo list. Build me a structured routine for today with focus blocks, recovery pauses, and a hard shutdown time.",
    mode: "plan",
    emoji: "☀️",
  },
];

export const CRISIS_KEYWORDS = [
  "suicide",
  "suicidal",
  "kill myself",
  "want to die",
  "wanna die",
  "end it all",
  "end my life",
  "self harm",
  "cutting myself",
  "hurt myself",
  "better off dead",
  "can't live like this",
  "don't want to wake up",
  "give up on life",
];

export function checkIsCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  if (/\b(die|suicide|suicidal)\b/.test(lower) && (lower.includes("want") || lower.includes("wanna") || lower.includes("give up") || lower.includes("myself") || lower.includes("i "))) {
    return true;
  }
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

// Built-in offline empathetic knowledge generator (zero-key fallback)
export function generateOfflineResponse({
  userMessage,
  mode,
  personaId,
  stressLevel,
}: {
  userMessage: string;
  mode: ChatMode;
  personaId: PersonaId;
  stressLevel: number;
}): Partial<ChatMessage> {
  const text = userMessage.toLowerCase();

  // Safety trigger
  if (checkIsCrisis(userMessage)) {
    return {
      isCrisis: true,
      content:
        "I hear how extraordinarily heavy and painful things feel right now. Please know that your life and your presence in this world matter deeply — infinitely more than any exam, degree, GPA, or career hurdle. You do not have to carry this alone. Please connect with someone who can support you right this second.",
      groundingAnchor:
        "Call 9152987821 (iCALL Psychosocial Helpline) or write to us at icall@tiss.ac.in.",
    };
  }

  // MODE 1: RAW VENT (Listening without advice)
  if (mode === "vent") {
    if (text.includes("parents") || text.includes("family")) {
      return {
        mode: "vent",
        content:
          "I hear you so deeply. Carrying the weight of your family's expectations — especially when you love them and know how much they sacrificed — is a special kind of suffocating pressure. It makes it feel like an average grade is a betrayal, rather than just a normal part of learning. You are allowed to be tired. You are allowed to struggle. Your worth as their child is not an exchange for perfection.",
        groundingAnchor: "Drop your shoulders away from your ears right now. Let out a long sigh.",
      };
    }
    return {
      mode: "vent",
      content:
        "I am not going to give you generic platitudes or tell you to 'make a checklist.' You are completely right: student life right now is absurdly demanding. Juggling relentless coursework, social comparisons, financial strain, and future anxiety while having to look put-together is fundamentally exhausting.\n\nYour frustration and fatigue are completely valid. You aren't weak for feeling this way — you're a human being operating under high-voltage chronic pressure.",
      groundingAnchor: "You don't have to smile right now. Let the mask down for the next 10 minutes.",
    };
  }

  // MODE 2: PANIC GROUNDING (Somatic reset & triage)
  if (mode === "panic") {
    return {
      mode: "panic",
      content:
        "Stop reading slides for 60 seconds. Your prefrontal cortex is currently locked out because your sympathetic nervous system detected an academic emergency like a physical predator. Let's force blood back into your logical brain.",
      actionSteps: [
        "Unclench your jaw right now. Push your tongue against the roof of your mouth, then relax it.",
        "Take a long physiological sigh: two quick inhales through the nose, one long slow exhale through the mouth.",
        "Drink a few sips of cold water. Feeling the cold liquid resets the vagus nerve.",
      ],
      groundingAnchor:
        "Remember: You have survived every single test you thought would ruin your life before. This is an exam, not a firing squad.",
    };
  }

  // MODE 3: THOUGHT UNTANGLER (CBT Reframing)
  if (mode === "untangle") {
    if (text.includes("imposter") || text.includes("mistake") || text.includes("smart")) {
      return {
        mode: "untangle",
        thoughtDistortion: "Pluralistic Ignorance & Imposter Syndrome",
        content:
          "You are assuming that because you feel confused internally, everyone else must be understanding everything effortlessly externally.",
        actionSteps: [
          "Recognize: Confidence in lecture halls is 90% social masking. Most students are silently bewildered.",
          "Distinguish: 'Feeling like a fraud' is a biological emotional state, not empirical evidence of incompetence.",
          "Reality Check: The admissions committee reviewed thousands of applicants. You didn't slip through a clerical error — you earned your seat.",
        ],
        groundingAnchor:
          "Mantra: 'Uncertainty is how learning actually feels from the inside.'",
      };
    }

    if (text.includes("linkedin") || text.includes("behind") || text.includes("career")) {
      return {
        mode: "untangle",
        thoughtDistortion: "Selective Abstraction & Highlight Reel Bias",
        content:
          "You are looking at someone's PR announcement and comparing it to your raw behind-the-scenes Tuesday afternoon.",
        actionSteps: [
          "Audit the timeline: Career trajectories are 40-year marathons. A peer's freshman internship does not close your door.",
          "Acknowledge the invisible: Nobody posts their 95 rejected emails, their existential dread, or parental nepotism.",
          "Close the app: Doomscrolling career sites during high-stress weeks only burns mental battery with zero output.",
        ],
        groundingAnchor:
          "Mantra: 'Their success is proof that opportunity exists, not proof that I am lacking.'",
      };
    }

    return {
      mode: "untangle",
      thoughtDistortion: "All-or-Nothing Catastrophizing",
      content:
        "Your mind is jumping from 'I am struggling with this concept' directly to 'My future is doomed.' Let's separate the facts from the catastrophizing fiction.",
      actionSteps: [
        "What is the actual worst-case realistic scenario? (Usually a B or retaking a quiz, not homelessness).",
        "Notice the black-and-white trap: You don't need a 100% to build a fulfilling, prosperous life.",
        "Done at 85% is 1000x better than an impossible 100% that destroys your nervous system.",
      ],
      groundingAnchor: "In 5 years, this specific assignment won't even be a footnote in your memory.",
    };
  }

  // MODE 4: ACTION SLICER (Anti-procrastination micro-steps)
  if (mode === "action") {
    return {
      mode: "action",
      content:
        "The reason you can't start is because your brain is trying to swallow the entire 10-hour project in one mental bite. Let's slice it down until the resistance disappears.",
      actionSteps: [
        "Step 1: Open the blank document and type the worst, ugliest 3 sentences possible. Zero quality control.",
        "Step 2: Set a timer on your phone for exactly 7 minutes. You have permission to quit when the timer beeps.",
        "Step 3: Put your phone in another room or out of reach. Reduce the friction to focus.",
      ],
      groundingAnchor: "You don't need motivation to start. Action creates motivation, not the other way around.",
    };
  }

  // MODE 5: DAY PLANNER (Energy-Managed Daily Study Blueprint)
  if (mode === "plan") {
    const isMorning = text.includes("morning") || text.includes("woke") || text.includes("wake");
    const isExamPrep = text.includes("exam") || text.includes("test") || text.includes("cram");

    return {
      mode: "plan",
      content:
        isExamPrep
          ? "Here is your High-Yield Exam Day Plan. When test pressure is high, cramming without recovery destroys cognitive recall. We pace retrieval practice with deliberate brain cooling:"
          : isMorning
          ? "Good morning. When facing a mountain of tasks, the key is an easy first ramp. Here is an energy-paced daily schedule designed to protect your nervous system and ensure deep progress:"
          : "Here is your Energy-Managed Study Day Blueprint. High-pressure students crash when they schedule 8 unbroken hours. Instead, we use structured focus cycles, proactive recovery pauses, and a hard shutdown:",
      dailySchedule: [
        {
          time: "09:00 - 10:15 AM",
          activity: "Block 1: Deep Analytical Work (Hardest concept / Active recall while cognitive bandwidth is peak)",
          type: "deep",
        },
        {
          time: "10:15 - 10:45 AM",
          activity: "Vagus Nerve Recovery (Zero screens, 10-min sunlight walk, cold water hydration)",
          type: "rest",
        },
        {
          time: "10:45 - 12:00 PM",
          activity: "Block 2: Problem Sets / Practice Questions / Draft Writing (Closed notes first)",
          type: "deep",
        },
        {
          time: "12:00 - 01:15 PM",
          activity: "Nourishment & Sensory Rest (Protein-rich meal, step away from study desk)",
          type: "rest",
        },
        {
          time: "01:15 - 02:30 PM",
          activity: "Block 3: Low-Energy / Admin Sprint (Flashcards, lecture recordings, slide consolidation)",
          type: "admin",
        },
        {
          time: "02:30 - 03:00 PM",
          activity: "Daily Closeout & Tomorrow's Priority Lock (Pack bag, hard mental shutdown)",
          type: "review",
        },
      ],
      actionSteps: [
        "The 50/10 Focus Rule: Work 50 minutes with all notifications silenced, then step away for 10 minutes.",
        "Energy Triage: If mental battery drops below 30%, swap out complex theory for passive video review or flashcards.",
        "Hard Shutdown Rule: When the final block ends, stop working. Guilt-free evening rest consolidates memory.",
      ],
      groundingAnchor:
        "A disciplined 3.5-hour day with true recovery beats 9 hours of distracted, guilt-ridden fake studying every single time.",
    };
  }

  // Default fallback
  return {
    content:
      "I hear how intense the pressure feels right now. When student life piles up, it is easy to feel completely disoriented. Take a slow breath — which of these would help most right now: breaking this down into tiny steps, untangling a specific worry, or just venting without advice?",
    groundingAnchor: "Breathe in for 4 seconds, breathe out for 6.",
  };
}
