import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { PERSONAS } from "@/data/pressureData";
import {
  generateOfflineResponse,
  checkIsCrisis,
} from "@/data/chatKnowledgeBase";
import { ChatMode, ChatMessage } from "@/types/chat";
import { PersonaId } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      mode = "vent",
      personaId = "invisible",
      stressLevel = 3,
      history = [],
    }: {
      message: string;
      mode: ChatMode;
      personaId: PersonaId;
      stressLevel: number;
      history?: ChatMessage[];
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Safety check first
    if (checkIsCrisis(message)) {
      const crisisResp = generateOfflineResponse({
        userMessage: message,
        mode,
        personaId,
        stressLevel,
      });
      return NextResponse.json({
        reply: crisisResp.content,
        isCrisis: true,
        groundingAnchor: crisisResp.groundingAnchor,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // If Gemini API key is configured, use Google Gemini
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const persona = PERSONAS[personaId] || PERSONAS.invisible;

        const systemInstruction = `You are "PRESSURE COMPANION", an empathetic, psychologically grounded AI companion for university and college students on the web platform "PRESSURE POINTS: The Truth About Student Life".

USER CONTEXT:
- Active Student Archetype: ${persona.name} (${persona.roleTitle})
- Archetype Reality: "${persona.realityCheck}"
- Current Stress Dial Level: ${stressLevel}/5 (1=Mild Tension, 3=High-Pressure, 5=System Overload)
- Active Conversation Mode: "${mode.toUpperCase()}"

CONVERSATION MODES GUIDELINES:
1. When mode is "vent": The student just wants to be heard. DO NOT give unsolicited advice, checklists, or toxic positivity like "look on the bright side!". Deeply validate their exhaustion, normalize the pressure, and acknowledge that student life is genuinely brutal right now.
2. When mode is "panic": Acute anxiety or deadline paralysis. Give a 30-second somatic reset first (unclench jaw, 2 quick inhales and long exhale), then provide 2 immediate triage steps to calm their nervous system.
3. When mode is "untangle": Identify cognitive distortions (all-or-nothing thinking, imposter syndrome, catastrophizing, comparing their raw behind-the-scenes with someone's LinkedIn/IG highlight reel). Reframe with compassionate, grounding reality.
4. When mode is "action": The student is paralyzed by a giant project. Slice it into a 5-minute micro-action. Remind them: Done at 85% beats a masterpiece that destroyed their mental health.
5. When mode is "plan": The student needs an empathetic, realistic daily study schedule. Structure the day with distinct time blocks (e.g. 09:00 - 10:15 AM Deep Focus, 10:15 - 10:45 AM Nervous System Recovery / Screen-Free, 10:45 - 12:00 PM Execution Block, 12:00 - 01:15 PM Lunch & Decompress, 01:15 - 02:30 PM Admin / Flashcards, 02:30 - 03:00 PM Hard Shutdown). Emphasize energy management over brutal hustle.

TONE:
Authentic, empathetic, non-patronizing, and warm. Format your response cleanly with short, digestible paragraphs or bullet points. Avoid clinical jargon or lecturing.`;

        // Format history for context
        const contents = [
          ...history.slice(-6).map((h) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          })),
          {
            role: "user",
            parts: [{ text: message }],
          },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        });

        const reply =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reply) {
          return NextResponse.json({
            reply,
            source: "gemini",
            mode,
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to offline knowledge engine:", geminiError);
        // Seamlessly continue to offline engine fallback
      }
    }

    // Fallback: Rich offline empathetic knowledge engine
    const offlineResult = generateOfflineResponse({
      userMessage: message,
      mode,
      personaId,
      stressLevel,
    });

    return NextResponse.json({
      reply: offlineResult.content,
      thoughtDistortion: offlineResult.thoughtDistortion,
      actionSteps: offlineResult.actionSteps,
      groundingAnchor: offlineResult.groundingAnchor,
      dailySchedule: offlineResult.dailySchedule,
      isCrisis: offlineResult.isCrisis,
      source: "offline-engine",
      mode,
    });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
