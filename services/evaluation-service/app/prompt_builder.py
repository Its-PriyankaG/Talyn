def build_prompt(responses):

    text = ""

    for r in responses:

        text += f"""
Question:
{r['question']}

Candidate Answer:
{r['transcript']}

Time Taken:
{r['time_taken']} seconds
"""

    return f"""
You are an expert technical interviewer.

Evaluate the candidate across these dimensions:

1 Technical Accuracy
2 Concept Depth
3 Problem Solving
4 Communication
5 Confidence
6 Time Efficiency

Interview Responses:

{text}

Return JSON in this format:

{{
 "scores": {{
  "technical_accuracy": number,
  "concept_depth": number,
  "problem_solving": number,
  "communication": number,
  "confidence": number,
  "time_efficiency": number
 }},
 "comments": {{
  "technical_accuracy": "...",
  "concept_depth": "...",
  "problem_solving": "...",
  "communication": "...",
  "confidence": "...",
  "time_efficiency": "..."
 }},
 "final_score": number,
 "final_decision": "EXCEPTIONAL | STRONG | PROMISING | AVERAGE | REJECT"
}}
"""