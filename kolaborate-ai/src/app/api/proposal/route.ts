import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { jobBrief, freelancerBio, tone = "Professional" } = await req.json();

    if (!jobBrief) {
      return NextResponse.json({ error: "Job brief is required" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert freelance proposal writer. Write compelling, professional, and personalized proposals that win clients.
Keep proposals concise (250-350 words). Tone should be: ${tone}.
- Professional: formal, confident, business-like
- Friendly: warm, approachable, conversational
- Bold: direct, assertive, results-focused
Structure: opening hook → understanding of the problem → your approach → relevant experience → call to action.
Never use generic filler phrases like "I am writing to express my interest". Be direct and specific.`,
        },
        {
          role: "user",
          content: `Write a winning freelance proposal for this job:

JOB BRIEF:
${jobBrief}

${freelancerBio ? `FREELANCER BACKGROUND:\n${freelancerBio}` : ""}

Write a tailored, compelling proposal that stands out.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const proposal = completion.choices[0].message.content;
    return NextResponse.json({ proposal });
  } catch (error: unknown) {
    console.error("Proposal API error:", error);
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 });
  }
}
