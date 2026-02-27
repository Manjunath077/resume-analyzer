import { NextResponse } from "next/server";
import { testLLMConnection } from "@/lib/llm/llm.connection";
import { sampleResume, sampleJD } from "@/mocks/sample-data";
import { LLM_MODEL, TROUBLESHOOTING_STEPS } from "@/lib/llm/llm.constants";
import { LLMService } from "@/lib/llm/llm.services";

export async function GET() {
  try {
    const connectionTest = await testLLMConnection();

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: connectionTest.message,
          troubleshooting: TROUBLESHOOTING_STEPS,
        },  
        { status: 503 }
      );
    }

    const llm = new LLMService();
    const analysis = await llm.analyzeResume(sampleResume, sampleJD);

    return NextResponse.json({
      success: true,
      message: "Groq integration is working!",
      connection: connectionTest.message,
      model: LLM_MODEL,
      sample_analysis: analysis,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}