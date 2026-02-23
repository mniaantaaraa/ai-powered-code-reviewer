import OpenAI from "openai";
import { z } from "zod";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  return openaiClient;
}

export const ReviewCommentSchema = z.object({
  file: z.string(),
  line: z.number(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  category: z.enum(["bug", "security", "performance", "style", "suggestion"]),
  message: z.string(),
  suggestion: z.string().optional(),
});

export const ReviewResultSchema = z.object({
  summary: z.string(),
  riskScore: z.number().min(0).max(100),
  comments: z.array(ReviewCommentSchema),
});

export type ReviewComment = z.infer<typeof ReviewCommentSchema>;
export type ReviewResult = z.infer<typeof ReviewResultSchema>;

interface FileChange {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the provided pull request diff and provide a structured review.

Your review should:
1. Identify bugs, security issues, performance problems, and code style issues
2. Provide a brief summary of the changes
3. Assign a risk score (0-100) based on the complexity and potential issues
4. Give specific, actionable feedback with line numbers

Respond with valid JSON matching this schema:
{
  "summary": "Brief summary of changes and overall assessment",
  "riskScore": 0-100,
  "comments": [
    {
      "file": "path/to/file.ts",
      "line": 42,
      "severity": "critical" | "high" | "medium" | "low",
      "category": "bug" | "security" | "performance" | "style" | "suggestion",
      "message": "What the issue is",
      "suggestion": "How to fix it (optional)"
    }
  ]
}

Severity guide:
- critical: Security vulnerabilities, data loss, crashes
- high: Bugs that will cause issues in production
- medium: Should be fixed but won't break things
- low: Style issues, minor improvements

Be concise but specific. Reference exact line numbers from the diff.`;

export async function reviewCode(
  prTitle: string,
  files: FileChange[],
): Promise<ReviewResult> {
  const diffContent = files
    .filter((f) => f.patch)
    .map(
      (f) => `### ${f.filename} (${f.status})\n\`\`\`diff\n${f.patch}\n\`\`\``,
    )
    .join("\n\n");

  if (!diffContent.trim()) {
    return {
      summary: "No code changes to review (binary files or empty diff).",
      riskScore: 0,
      comments: [],
    };
  }

  const userPrompt = `Review this pull request:

**Title:** ${prTitle}

**Changes:**
${diffContent}`;

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const parsed = JSON.parse(content);
  const validated = ReviewResultSchema.parse(parsed);

  return validated;
}


interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface ReviewData {
  prTitle: string;
  summary: string | null;
  riskScore: number | null;
  comments: unknown;
}

export async function chatAboutReview(
  review: ReviewData,
  userMessage: string,
  conversationHistory: ConversationMessage[],
): Promise<string> {
  const systemPrompt = `You are an AI code review assistant. You have already reviewed a pull request and provided feedback. Now the developer has questions about your review.

**Pull Request:** ${review.prTitle}
**Your Summary:** ${review.summary ?? "No summary available"}
**Risk Score:** ${review.riskScore ?? "N/A"}/100
**Your Comments:** ${JSON.stringify(review.comments, null, 2)}

Answer the developer's questions clearly and concisely. Reference specific parts of your review when relevant. Be helpful and constructive.`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  return content;
}


interface GenerateFixInput {
  fileName: string;
  originalCode: string;
  issue: string;
  suggestion?: string;
}

export async function generateCodeFix(input: GenerateFixInput): Promise<string> {
  const systemPrompt = `You are an expert code fixer. Given a code snippet and an issue description, generate the corrected version of the code.

Rules:
1. Return ONLY the corrected code, no explanations
2. Maintain the same code style and formatting
3. Fix only the specific issue mentioned
4. Keep all other code unchanged
5. Do not add comments explaining the fix`;

  const userPrompt = `File: ${input.fileName}

Original Code:
\`\`\`
${input.originalCode}
\`\`\`

Issue: ${input.issue}
${input.suggestion ? `\nSuggested Fix: ${input.suggestion}` : ""}

Generate the corrected code:`;

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  // Remove markdown code blocks if present
  const cleanedCode = content
    .replace(/^```[\w]*\n/gm, "")
    .replace(/\n```$/gm, "")
    .trim();

  return cleanedCode;
}
