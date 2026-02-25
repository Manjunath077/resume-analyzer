import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.jd) {
      return NextResponse.json(
        { success: false, message: "Job Description is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job Description received",
        data: body.jd,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 500 }
    );
  }
}