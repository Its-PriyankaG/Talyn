import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const role = formData.get("role") as string;
  const resume = formData.get("resume") as File;

  if (!role || !resume) {
    return NextResponse.json(
      { error: "Role and resume are required" },
      { status: 400 }
    );
  }

  // 1. Create session
  const sessionRes = await fetch("http://localhost:8001/session/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  const sessionData = await sessionRes.json();
  const sessionId = sessionData.session_id;

  // 2. Resume ingest (PDF)
  const resumeForm = new FormData();
  resumeForm.append("session_id", sessionId);
  resumeForm.append("resume_pdf", resume);

  const resumeRes = await fetch("http://localhost:8003/resume/ingest", {
    method: "POST",
    body: resumeForm,
  });

  const resumeData = await resumeRes.json();

  // 3. Question generation
  const questionRes = await fetch(
    "http://localhost:8004/questions/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        role,
        anonymized_resume: resumeData.anonymized_resume,
        github_signal: resumeData.github_signal,
      }),
    }
  );

  const questionData = await questionRes.json();

  return NextResponse.json({
    session_id: sessionId,
    questions: questionData.questions,
  });
}
