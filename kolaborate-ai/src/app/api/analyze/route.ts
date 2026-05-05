import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { brief } = await req.json();

    if (!brief) {
      return NextResponse.json({ error: "Brief is required" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert freelance consultant who analyzes client job briefs. 
Your job is to identify problems, gaps, and risks in client briefs and help freelancers ask the right questions before starting work.
Always return valid JSON matching the exact schema provided.`,
        },
        {
          role: "user",
          content: `Analyze this client brief and return a JSON analysis:

BRIEF: ${brief}

Return ONLY valid JSON in this exact format:
{
  "clarity": "Poor|Fair|Good|Excellent",
  "summary": "One sentence summary of what the client wants",
  "gaps": ["missing information 1", "missing information 2"],
  "questions": ["clarifying question 1", "clarifying question 2", "clarifying question 3"],
  "redFlags": ["potential risk or red flag 1", "potential risk or red flag 2"],
  "suggestions": ["suggestion to improve the brief or project 1", "suggestion 2"],
  "readiness": "A score from 1-10 indicating how ready this brief is to start work on"
}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    console.error("Analyze API error:", error);
    return NextResponse.json({ error: "Failed to analyze brief" }, { status: 500 });
  }
}
