// import { NextResponse } from "next/server";
// import { testLLMConnection } from "@/lib/llm/llm.connection";
// import { sampleResume, sampleJD } from "@/features/resume/ui/sample-data";
// import { LLM_MODEL, TROUBLESHOOTING_STEPS } from "@/lib/llm/llm.constants";
// import { LLMService } from "@/features/analysis/domain/analysis.service";

// export async function GET() {
//   try {
//     const connectionTest = await testLLMConnection();

//     if (!connectionTest.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: connectionTest.message,
//           troubleshooting: TROUBLESHOOTING_STEPS,
//         },  
//         { status: 503 }
//       );
//     }

//     const llm = new LLMService();
//     const analysis = await llm.analyzeResume(sampleResume, sampleJD);

//     return NextResponse.json({
//       success: true,
//       message: "Groq integration is working!",
//       connection: connectionTest.message,
//       model: LLM_MODEL,
//       sample_analysis: analysis,
//     });

//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//         stack:
//           process.env.NODE_ENV === "development"
//             ? error.stack
//             : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { AnalysisQueueService } from "@/features/analysis/domain/analysis.queue.service";
import { auth } from "@/features/auth/domain/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      );
    }

    const service = new AnalysisQueueService();

    const jobCount = await service.queueAnalysis(
      jobId,
      session.user.id
    );

    return NextResponse.json({
      message: "Analysis started",
      queuedJobs: jobCount,
    });
  } catch (error) {
    console.error("Analysis run error:", error);

    return NextResponse.json(
      { error: "Failed to start analysis" },
      { status: 500 }
    );
  }
}