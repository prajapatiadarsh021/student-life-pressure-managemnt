import {
  Persona,
  PressureEpisode,
  AntidotePowerMove,
  AnonymousVoice,
  GlitchFlipCardData,
  PowerAffirmation,
} from "@/types";

export const PERSONAS: Record<string, Persona> = {
  overachiever: {
    id: "overachiever",
    name: "The Overachiever",
    avatar: "🎯",
    roleTitle: "Straight-A Exhaustion",
    color: "#ef4444",
    glowClass: "glow-crimson",
    slogan: "Rest feels like failure. An 89% feels like the end of the world.",
    realityCheck:
      "Burning out chasing straight A's, terrified of falling behind, addicted to validation that never satisfies you.",
    heroQuote:
      "If I am not excelling at everything, every second of the day, who even am I?",
    internalMonologue:
      "If my GPA drops, my parents will worry, my scholarships vanish, and all those 80-hour study weeks were for nothing.",
    recommendedEpisodes: ["ep-2", "ep-4"],
    recommendedAntidoteId: "power-4",
    copingTip:
      "An 85% turned in on time is 1,000% healthier than a 100% that broke your mental stability.",
  },
  scrambler: {
    id: "scrambler",
    name: "The Last-Minute Scrambler",
    avatar: "⚡",
    roleTitle: "Paralyzing Panic Loop",
    color: "#f97316",
    glowClass: "glow-amber",
    slogan: "I had 3 weeks to do this. Why am I opening the document at 3:15 AM?",
    realityCheck:
      "Paralyzing deadline panic, endless procrastination guilt, and relying on cortisol surges to finish assignments.",
    heroQuote:
      "It's not that I don't care. It's that the fear of starting feels heavier than staying up all night.",
    internalMonologue:
      "I stare at the prompt, get overwhelmed by how much is due, scroll my phone to calm down, and now it's midnight again.",
    recommendedEpisodes: ["ep-1", "ep-3"],
    recommendedAntidoteId: "power-1",
    copingTip:
      "Commit to working for just 5 minutes with zero quality expectations. The friction is in starting, not doing.",
  },
  invisible: {
    id: "invisible",
    name: "The Invisible Fighter",
    avatar: "🎭",
    roleTitle: "The Emotional Mask",
    color: "#a855f7",
    glowClass: "glow-lavender",
    slogan: "Always smiling, saying 'I'm fine', carrying everyone while quietly drowning.",
    realityCheck:
      "Master of social masking. You support every struggling friend while letting nobody see your own cracks.",
    heroQuote:
      "I don't have the luxury of falling apart right now. People depend on me to be okay.",
    internalMonologue:
      "If I tell anyone how hard I'm struggling, I become a burden. So I laugh it off and say 'just tired from midterms.'",
    recommendedEpisodes: ["ep-3", "ep-2"],
    recommendedAntidoteId: "power-3",
    copingTip:
      "Vulnerability is not weakness; masking your pain is exhausting your nervous system. Say 'I am at capacity' today.",
  },
  career: {
    id: "career",
    name: "The Career Anxious",
    avatar: "📈",
    roleTitle: "LinkedIn Doomscroller",
    color: "#06b6d4",
    glowClass: "glow-cyan",
    slogan: "Everyone else is landing FAANG offers, and I'm struggling to write cover letters.",
    realityCheck:
      "Overwhelmed by peer resumes, early career dread, and the terrifying belief that you're already 5 years behind.",
    heroQuote:
      "I open LinkedIn to search for jobs and close it 10 minutes later feeling completely unemployable.",
    internalMonologue:
      "He's 19 and founded a startup. She has 3 summer internships. Why do I feel like I'm running in cement?",
    recommendedEpisodes: ["ep-4", "ep-1"],
    recommendedAntidoteId: "power-2",
    copingTip:
      "LinkedIn is everyone's curated PR highlight reel. Nobody posts the 150 ghosted applications and panic attacks.",
  },
};

export const PRESSURE_EPISODES: PressureEpisode[] = [
  {
    id: "ep-1",
    episodeNumber: "01",
    title: "The 3:00 AM Spiral",
    duration: "42 MIN",
    matchScore: 98,
    intensity: "Critical",
    tag: "Sleep Deprivation & Deadline Doom",
    synopsis:
      "When the clock strikes 3 AM, the room goes silent and your nervous system goes into fight-or-flight. Blue light, racing thoughts, and caffeine crashes.",
    trigger:
      "The submission portal says due at 8:00 AM. You have three tabs of unfinished references and a pounding headache.",
    quote:
      "You tell yourself 'just tonight,' but tonight has been happening every Tuesday for four semesters.",
    stats: {
      label: "Students averaging under 5 hrs sleep before finals",
      value: "68%",
    },
    breakdown: [
      "Circadian disruption impairs cognitive memory retention by up to 40%.",
      "Late-night panic is chemically driven by elevated cortisol, not lack of intelligence.",
      "The illusion of productivity: working 6 hours exhausted accomplishes less than 90 focused daytime minutes.",
    ],
    survivalStep:
      "Hard shutdown at 3:30 AM. Close the screen, drink a glass of water, and write down 3 bullet points for tomorrow morning.",
  },
  {
    id: "ep-2",
    episodeNumber: "02",
    title: "The Imposter Among Us",
    duration: "49 MIN",
    matchScore: 96,
    intensity: "High",
    tag: "Grade Comparisons & Family Expectations",
    synopsis:
      "Sitting in a 300-person lecture hall convinced admissions made an administrative mistake and everyone else was born understanding this material.",
    trigger:
      "A classmate casually whispers 'that midterm was so easy' while your paper is covered in red ink.",
    quote:
      "My parents sacrificed their savings for me to be here. Admitting I don't understand feels like betraying them.",
    stats: {
      label: "Top-tier university students experiencing Imposter Syndrome",
      value: "82%",
    },
    breakdown: [
      "Pluralistic ignorance: everyone is silently confused, but everyone assumes everyone else is fine.",
      "High expectations from immigrant or working-class parents create silent guilt.",
      "You measure your raw behind-the-scenes against your peers' polished public performance.",
    ],
    survivalStep:
      "Ask one question in office hours or to a peer. The moment you voice uncertainty, the illusion of everyone else's perfection shatters.",
  },
  {
    id: "ep-3",
    episodeNumber: "03",
    title: "The 'I'm Fine' Syndrome",
    duration: "38 MIN",
    matchScore: 99,
    intensity: "Severe",
    tag: "Emotional Masking & Quiet Burnout",
    synopsis:
      "The rehearsed social smile. The automatic 'I am just tired!' response whenever someone glances at the bags under your eyes.",
    trigger:
      "A close friend or professor gently asks: 'How are you really holding up?' and your throat instantly tightens.",
    quote:
      "If I stop smiling and let down my guard, I am afraid the entire dam will break and I won't know how to rebuild it.",
    stats: {
      label: "Students who mask severe emotional distress daily",
      value: "78%",
    },
    breakdown: [
      "Social camouflage drains more metabolic energy than studying differential equations.",
      "Internalized hyper-independence: believing asking for help is an admission of failure.",
      "Burnout isn't when you collapse; it's the 6 months you spent running on fumes before the collapse.",
    ],
    survivalStep:
      "Practice one unmasked sentence: 'I am really drained this week and can't take on more.' You don't owe anyone a performance.",
  },
  {
    id: "ep-4",
    episodeNumber: "04",
    title: "The Constant Race",
    duration: "45 MIN",
    matchScore: 94,
    intensity: "High",
    tag: "Perfectionism & Resume Anxiety",
    synopsis:
      "From high school honors to college internships to graduate school: the goalposts keep moving, and nobody ever taught you how to pause.",
    trigger:
      "A 20-year-old on LinkedIn posts: 'Excited to announce my 4th Fortune 500 summer fellowship and Forbes 30 under 30 nomination!'",
    quote:
      "It feels like if I take a single weekend off, someone else will take my future seat at the table.",
    stats: {
      label: "Students reporting anxiety directly caused by career networking platforms",
      value: "71%",
    },
    breakdown: [
      "The toxic gamification of student achievement through resumes and connections.",
      "Mistaking urgency for importance: not every internship application is life or death.",
      "Tunnel vision: forgetting that 90% of successful professionals took non-linear, messy paths.",
    ],
    survivalStep:
      "Implement a 48-hour social & LinkedIn blackout during exam weeks. Your trajectory is uniquely yours.",
  },
];

export const ANTIDOTES: AntidotePowerMove[] = [
  {
    id: "power-1",
    number: "01",
    title: "The 5-Minute Brain Dump Protocol",
    category: "Mental De-Escalation",
    timeToImplement: "5 Minutes",
    tagline: "Empty the RAM of your overloaded working memory.",
    protocol: [
      "Grab an unruled sheet of paper or empty notepad.",
      "Write down every single pending task, irrational fear, and deadline with zero organization.",
      "Sort into 3 buckets: [Actionable Now], [Requires Tomorrow], [Pure Fiction / Sleep Deprived Doom].",
      "Physically cross off the fiction bucket and tackle only ONE item from bucket 1.",
    ],
    mantra: "My brain is for processing thoughts, not holding infinite open tabs.",
    impactScore: "Instant Relief",
  },
  {
    id: "power-2",
    number: "02",
    title: "De-Weaponizing the Resume & Comparison Detox",
    category: "Perspective Reset",
    timeToImplement: "10 Minutes",
    tagline: "Stop comparing your blooper reel to someone else's highlight trailer.",
    protocol: [
      "Mute professional networks (LinkedIn/IG) on mobile during study crunch blocks.",
      "Remember: Job announcements never include the 80 rejected applications.",
      "List 3 personal skills you possess that cannot be quantified on a standard CV.",
      "Remind yourself that your career is a 40-year marathon, not a freshman sprint.",
    ],
    mantra: "Their success is proof it's possible, not proof that I am lacking.",
    impactScore: "Long-term Resilience",
  },
  {
    id: "power-3",
    number: "03",
    title: "Micro-Boundaries: How to Drop the Mask",
    category: "Emotional Honesty",
    timeToImplement: "Ongoing",
    tagline: "Trade the exhausting 'I am fine' mask for sustainable boundaries.",
    protocol: [
      "Replace 'I'm fine' with 'I have a lot on my plate right now, taking it one hour at a time.'",
      "Say 'No' to one extracurricular favor this week without writing a 3-paragraph apology.",
      "Designate ONE trusted friend who gets the unfiltered, zero-filter version of your reality.",
      "Allow yourself to sit in your room for 20 minutes doing absolutely nothing productive.",
    ],
    mantra: "I do not have to earn my right to rest with exhaustion.",
    impactScore: "Burnout Prevention",
  },
  {
    id: "power-4",
    number: "04",
    title: "The 80/20 Imperfectionist Mindset",
    category: "Perfectionism Cure",
    timeToImplement: "Immediate",
    tagline: "Done and submitted beats a masterpiece that destroyed your health.",
    protocol: [
      "Identify the 20% of effort that generates 80% of the grade or comprehension.",
      "Notice when perfectionism turns into self-sabotage: the extra 4 hours spent tweaking fonts.",
      "Give yourself explicit permission to submit a solid B+ or A- paper without self-flagellation.",
      "Remember: In 5 years, nobody will ask what you got on quiz 4 of organic chemistry.",
    ],
    mantra: "Perfection is fear dressed in high standards. Finished is freedom.",
    impactScore: "High Energy Saved",
  },
];

export const ANONYMOUS_VOICES: AnonymousVoice[] = [
  {
    id: "v-1",
    author: "Anonymous Junior",
    major: "Pre-Med / Biology",
    text: "I cried in the 3rd floor library bathroom between my organic chemistry midterm and lab. I washed my face, checked my eyeliner in the mirror, and walked back out laughing with my study group like nothing happened.",
    category: "Academic",
    initialRelates: 412,
    timestamp: "2 hours ago",
    hasAudioClip: true,
  },
  {
    id: "v-2",
    author: "First-Gen Sophomore",
    major: "Mechanical Engineering",
    text: "My parents worked 14-hour factory shifts so I could be the first in our family at college. Every time I get a C on an exam, I feel like I'm personally throwing away their sacrifices. I can't breathe sometimes.",
    category: "Family",
    initialRelates: 589,
    timestamp: "Yesterday",
    hasAudioClip: true,
  },
  {
    id: "v-3",
    author: "Senior Looking for Work",
    major: "Computer Science & Business",
    text: "LinkedIn feels like psychological warfare. Seeing people I know barely passed intro classes announcing $120k offers makes me feel like I took a wrong turn in life. I haven't slept properly in 3 weeks.",
    category: "Career",
    initialRelates: 734,
    timestamp: "3 hours ago",
    hasAudioClip: true,
  },
  {
    id: "v-4",
    author: "Graduate Researcher",
    major: "Clinical Psychology",
    text: "The irony is I study mental health, and yet I haven't had a single weekend in 3 years where I didn't feel gut-wrenching guilt for taking an afternoon to read a book or watch a movie. The guilt never stops.",
    category: "Academic",
    initialRelates: 362,
    timestamp: "5 hours ago",
    hasAudioClip: true,
  },
  {
    id: "v-5",
    author: "Freshman",
    major: "Architecture & Design",
    text: "The culture here celebrates pulling 3 all-nighters in a row like it's a warrior medal. If you say you went to bed at 11 PM, people look at you like you don't take your future seriously.",
    category: "Social",
    initialRelates: 621,
    timestamp: "Just now",
    hasAudioClip: true,
  },
];

export const GLITCH_FLIP_CARDS: GlitchFlipCardData[] = [
  {
    id: "card-1",
    socialMask: "“I'm just tired, haven't had my coffee yet! Haha.”",
    maskContext: "Said while adjusting backpack in the hallway with a polite smile",
    realThought:
      "I have slept 6 hours total in the past 3 days. My chest is tight, my head is throbbing, and I am terrified that if I sit down I won't be able to get back up.",
    rootFear: "Fear of being seen as fragile or unmotivated",
    personaTarget: "The Invisible Fighter",
  },
  {
    id: "card-2",
    socialMask: "“Exams are chill, I'm pretty much prepared.”",
    maskContext: "Said to classmates while sipping an energy drink",
    realThought:
      "I have reread the same lecture slide 35 times and retained literally zero words. I feel like an imposter who is about to be exposed in front of the whole department.",
    rootFear: "Fear of intellectual inadequacy and comparison",
    personaTarget: "The Overachiever",
  },
  {
    id: "card-3",
    socialMask: "“Huge congrats on your offer! I'm just taking my time exploring options!”",
    maskContext: "Commented on LinkedIn with celebratory emojis",
    realThought:
      "I received my 18th rejection email this morning. I feel completely unqualified, invisible, and convinced that my entire degree was an expensive mistake.",
    rootFear: "Fear of career failure and future obsolescence",
    personaTarget: "The Career Anxious",
  },
  {
    id: "card-4",
    socialMask: "“Totally got this under control, I can lead the group project!”",
    maskContext: "Volunteered in group chat with a thumbs-up emoji",
    realThought:
      "I cannot say no because I believe my only value is being useful to other people. If one more task is added to my plate, I am going to have a full panic attack in my car.",
    rootFear: "Fear of losing affection or approval if not over-delivering",
    personaTarget: "The Last-Minute Scrambler",
  },
];

export const POWER_AFFIRMATIONS: PowerAffirmation[] = [
  {
    id: "a-1",
    title: "The GPA Myth",
    body: "Your GPA is an arbitrary snapshot of how well you memorized slides under artificial pressure. It has never measured your empathy, your creativity, your tenacity, or your human soul.",
    authorNote: "Keep this in your pocket on exam morning.",
    theme: "Validation",
  },
  {
    id: "a-2",
    title: "Rest Is Fuel",
    body: "Rest is not a luxury reward you must earn through sheer physical collapse. Rest is biological fuel. A machine running without oil will seize up; you are allowed to stop before you break.",
    authorNote: "Permission to close the laptop tonight.",
    theme: "Rest",
  },
  {
    id: "a-3",
    title: "Non-Linear Timelines",
    body: "Someone else receiving an offer or passing with honors does not subtract an ounce of capability from your future. The world is not a finite pie. Your trajectory was never meant to mirror theirs.",
    authorNote: "Log off LinkedIn. Breathe.",
    theme: "Perspective",
  },
  {
    id: "a-4",
    title: "100% Survival Rate",
    body: "Remember the exam you were convinced would ruin your life freshman year? You survived it. You have survived 100% of the deadlines, panic spikes, and sleepless nights so far.",
    authorNote: "You are stronger than the current syllabus.",
    theme: "Validation",
  },
  {
    id: "a-5",
    title: "The Finished Imperfection",
    body: "An 85% submitted on time beats a 100% that cost you your nervous system, your friendships, and your sanity. Done is liberation.",
    authorNote: "Send it in. You did enough.",
    theme: "Pace",
  },
  {
    id: "a-6",
    title: "The Silent Truth",
    body: "Look around your lecture hall. Half of the people with pristine laptops and confident expressions are fighting the exact same quiet battle inside. You are not alone in the dark.",
    authorNote: "Break the silence with one friend.",
    theme: "Perspective",
  },
];

export const CRISIS_RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or Text 988",
    description: "Free, confidential 24/7 support across the US and Canada.",
    badge: "24/7 Free & Confidential",
    link: "tel:988",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "Connect with a trained crisis counselor via text 24/7.",
    badge: "Text Support",
    link: "sms:741741",
  },
  {
    name: "The Trevor Project",
    contact: "1-866-488-7386 or Text START to 678-678",
    description: "Specialized crisis intervention for LGBTQ+ young people.",
    badge: "LGBTQ+ Youth",
    link: "tel:18664887386",
  },
  {
    name: "Befrienders Worldwide / Find A Helpline",
    contact: "findahelpline.com",
    description: "Free, confidential support from local crisis centers across 130+ countries.",
    badge: "International",
    link: "https://findahelpline.com",
  },
];
