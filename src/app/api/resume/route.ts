import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.resumeText) {
      return NextResponse.json(
        { success: false, message: "Resume text is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Resume received",
        data: body.resumeText,
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