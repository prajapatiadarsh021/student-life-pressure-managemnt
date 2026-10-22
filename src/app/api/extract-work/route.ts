import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      base64Data,
      mimeType = "image/jpeg",
      text,
      fileName = "document",
    }: {
      base64Data?: string;
      mimeType?: string;
      text?: string;
      fileName?: string;
    } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // 1. If Gemini API Key is available, use Gemini 2.5 Flash for Multimodal OCR / Document Parsing
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an academic workload parser for university students. 
Analyze the provided document, assignment sheet, screenshot, syllabus, or text.
Extract all concrete, actionable academic tasks, problem sets, chapters, and essay assignments that need to be done.
Break down broad tasks into clear, individual, actionable items (between 3 to 10 items).

Return your response strictly as a JSON array of strings, for example:
[
  "Review Organic Chemistry Chapters 4 & 5",
  "Complete practice problem set #3 (Q1-15)",
  "Write research essay draft outline & thesis",
  "Lab data analysis and graph plotting",
  "Prepare flashcards for midterm review"
]
Return ONLY the valid JSON array without any markdown formatting or extra text.`;

        const parts: any[] = [{ text: prompt }];

        if (base64Data) {
          // Clean base64 string if it contains data URI prefix
          const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
          parts.push({
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: cleanBase64,
            },
          });
        } else if (text) {
          parts.push({ text: `Source document content:\n${text}` });
        }

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts }],
          config: {
            temperature: 0.2,
            maxOutputTokens: 800,
          },
        });

        const reply =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reply) {
          // Extract JSON array from reply
          const cleanJson = reply.replace(/```json/gi, "").replace(/```/g, "").trim();
          const match = cleanJson.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const taskStrings = parsed.map((item: any) =>
                typeof item === "string" ? item : item.title || item.task || String(item)
              );
              return NextResponse.json({
                success: true,
                tasks: taskStrings,
                source: "gemini-multimodal",
              });
            }
          }

          // If JSON parse failed, split by lines
          const lines = reply
            .split("\n")
            .map((l) => l.replace(/^\s*(\d+[\.\)]|[-*•])\s*/, "").trim())
            .filter((l) => l.length > 3 && !l.startsWith("[") && !l.endsWith("]"));

          if (lines.length > 0) {
            return NextResponse.json({
              success: true,
              tasks: lines,
              source: "gemini-text",
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini document extraction failed, using fallback parser:", geminiError);
      }
    }

    // 2. Intelligent Fallback Parser (Local / Offline)
    let extractedTasks: string[] = [];

    if (text && text.trim().length > 0) {
      // Parse plain text by lines or bullets
      const lines = text
        .split("\n")
        .map((l) => l.replace(/^\s*(\d+[\.\)]|[-*•])\s*/, "").trim())
        .filter((l) => l.length > 3 && !l.startsWith("http") && !l.startsWith("["));

      if (lines.length > 0) {
        extractedTasks = lines.slice(0, 10);
      }
    }

    // If still empty, infer from filename or document type
    if (extractedTasks.length === 0) {
      const lowerName = (fileName || "").toLowerCase();

      if (lowerName.includes("chem") || lowerName.includes("bio") || lowerName.includes("lab")) {
        extractedTasks = [
          `Review lab experimental data & methodology (${fileName})`,
          "Perform calculations, error margins & plot graphs",
          "Draft discussion section & answer post-lab questions",
          "Finalize bibliography & export submission PDF",
        ];
      } else if (lowerName.includes("essay") || lowerName.includes("paper") || lowerName.includes("lit") || lowerName.includes("history")) {
        extractedTasks = [
          `Formulate thesis statement & annotate primary sources (${fileName})`,
          "Draft sections 1 & 2 of argument body",
          "Draft counter-argument & conclusion section",
          "Proofread grammar, formatting & citation checks",
        ];
      } else if (lowerName.includes("math") || lowerName.includes("phys") || lowerName.includes("calc") || lowerName.includes("cs") || lowerName.includes("code")) {
        extractedTasks = [
          `Audit problem set requirements from ${fileName}`,
          "Solve primary core equations & analytical proofs",
          "Implement test cases & debug edge scenarios",
          "Double-check solutions with reference materials",
        ];
      } else {
        const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        extractedTasks = [
          `Read and outline core requirements in ${cleanName}`,
          `Work through initial practice problems / section drafts`,
          `Synthesize notes & resolve difficult questions`,
          `Complete final proofread & submit before deadline portal`,
        ];
      }
    }

    return NextResponse.json({
      success: true,
      tasks: extractedTasks,
      source: "smart-fallback",
    });
  } catch (error) {
    console.error("Extract work API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract tasks",
        tasks: [
          "Review textbook chapters & lecture notes",
          "Complete key practice exercises",
          "Draft written report / summary",
          "Final review and portal submission",
        ],
      },
      { status: 500 }
    );
  }
}
