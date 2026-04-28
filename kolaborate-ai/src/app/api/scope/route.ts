import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { projectDesc, hourlyRate } = await req.json();

    if (!projectDesc) {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert freelance project estimator. Analyze project descriptions and return accurate scope breakdowns as JSON.
Always return valid JSON matching the exact schema provided. Be realistic with time estimates — include buffer time.`,
        },
        {
          role: "user",
          content: `Analyze this project and return a scope breakdown as JSON:

PROJECT: ${projectDesc}
${hourlyRate ? `FREELANCER HOURLY RATE: $${hourlyRate}/hr` : ""}

Return ONLY valid JSON in this exact format:
{
  "summary": "One sentence summary of the project",
  "tasks": [
    { "name": "Task name", "hours": "estimated hours as number string", "complexity": "Low|Medium|High" }
  ],
  "totalHours": "total hours as number string",
  "suggestedRate": "suggested hourly rate in USD as number string",
  "estimatedBudget": "total budget range e.g. 500-800",
  "risks": ["risk 1", "risk 2"]
}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const raw = completion.choices[0].message.content ?? "{}";
    // extract JSON even if model wraps it in markdown
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const scope = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    return NextResponse.json({ scope });
  } catch (error: unknown) {
    console.error("Scope API error:", error);
    return NextResponse.json({ error: "Failed to estimate scope" }, { status: 500 });
  }
}
