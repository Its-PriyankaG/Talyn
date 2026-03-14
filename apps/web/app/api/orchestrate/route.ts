import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const role = formData.get("role") as string;
    const resume = formData.get("resume") as File;
    const sessionId = formData.get("session_id") as string;

    if (!role || !resume || !sessionId) {
      return NextResponse.json(
        { error: "session_id, role and resume are required" },
        { status: 400 }
      );
    }

    // Step 1: Send resume to resume-intel-service
    const resumeForm = new FormData();
    resumeForm.append("session_id", sessionId);
    resumeForm.append("resume_pdf", resume);

    const resumeRes = await fetch("http://localhost:8003/resume/ingest", {
      method: "POST",
      body: resumeForm,
    });

    if (!resumeRes.ok) {
      const errText = await resumeRes.text();
      return NextResponse.json(
        { error: "Resume ingestion failed", details: errText },
        { status: 500 }
      );
    }

    const resumeData = await resumeRes.json();

    // Step 2: Call question-service to generate questions
    const questionRes = await fetch(
      "http://localhost:8004/questions/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          role: role,
          anonymized_resume: resumeData.anonymized_resume,
          github_signal: resumeData.github_signal,
        }),
      }
    );

    if (!questionRes.ok) {
      const errText = await questionRes.text();
      return NextResponse.json(
        { error: "Question generation failed", details: errText },
        { status: 500 }
      );
    }

    const questionData = await questionRes.json();

    // Step 3: Return result
    return NextResponse.json({
      session_id: sessionId,
      questions: questionData.questions,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Orchestration failed", details: error.message },
      { status: 500 }
    );
  }
}