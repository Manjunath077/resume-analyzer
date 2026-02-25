import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { resumeText, jd } = body;

    if (!resumeText || !jd) {
      return NextResponse.json(
        { success: false, message: "Resume and JD required" },
        { status: 400 }
      );
    }

    // Mock AI result (temporary)
    const mockScore = Math.floor(Math.random() * 40) + 60;

    return NextResponse.json(
      {
        success: true,
        score: mockScore,
        feedback: "This resume matches the job description moderately well.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Analysis failed" },
      { status: 500 }
    );
  }
}