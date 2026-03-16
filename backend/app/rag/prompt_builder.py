def build_explanation_prompt(
    title: str,
    severity: str,
    description: str | None,
    recommendation: str | None,
    retrieved_context: str,
) -> str:
    return f"""
You are a secure programming assistant.

Your task is to explain a detected vulnerability in a clear, accurate, and academic way.
Base your answer on the retrieved security context and the finding details.
Do not invent unsupported claims.
Do not provide exploit instructions.
Focus on secure remediation guidance.

Finding Title: {title}
Severity: {severity}
Description: {description or "No additional description provided."}
Existing Recommendation: {recommendation or "No scanner recommendation provided."}

Retrieved Security Context:
{retrieved_context}

Write a response with:
1. What the issue means
2. Why it is risky
3. How to fix it securely
4. A brief safer coding recommendation
""".strip()