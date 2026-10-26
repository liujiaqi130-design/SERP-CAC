import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai"

import { DEFAULT_MODEL, isModelAllowed } from "@/lib/models"
import { getTools, type ChatUIMessage } from "@/tools"

export const maxDuration = 30

const MAX_OUTPUT_TOKENS = 1600

// The AI SDK global provider routes this model ID through Vercel AI Gateway.
// AI_GATEWAY_API_KEY stays server-side; add rate limiting before exposing this
// endpoint to public traffic. See the README "Security" section.
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const model = (body as { model?: unknown })?.model
  const modelId = typeof model === "string" ? model : DEFAULT_MODEL

  if (!isModelAllowed(modelId)) {
    return Response.json(
      { error: `Model ${modelId} is not available.` },
      { status: 400 }
    )
  }

  const tools = getTools(modelId)

  // Validate the shape of every message and tool part before trusting it.
  let messages: ChatUIMessage[]
  try {
    const validated = await validateUIMessages<ChatUIMessage>({
      messages: (body as { messages?: unknown })?.messages,
      tools: tools as Parameters<typeof validateUIMessages>[0]["tools"],
    })
    messages = validated
  } catch {
    return Response.json({ error: "Invalid messages." }, { status: 400 })
  }

  const result = streamText({
    model: modelId,
    system: [
      "You are Giotto, a friendly guide for creative software workflows.",
      "Help beginners adapt effects and workflows between creative apps, especially animation and design tools.",
      "Keep replies short and simple. Use plain language and only the steps or details needed to answer the user's question. Avoid long introductions and unnecessary explanations.",
      "For software-specific instructions, call official_docs with the relevant app names and task. Use the returned summaries only to choose a relevant link. Do not say you opened the full page or claim it verifies details beyond its summary. Include a concise markdown link to a relevant official guide when one is returned. The UI also shows the official guides below the answer. The curated guide list is limited; do not imply it is a complete search of the app's documentation.",
      "Before answering, consider whether the request has multiple plausible interpretations that would lead to meaningfully different advice. Ask a clarifying question only when the ambiguity matters to the answer or could cause a wrong or unusable workflow; otherwise, make a reasonable interpretation and proceed.",
      "When clarification is needed, use the ask_user tool to ask one concise, specific question that separates the most likely interpretations. Offer exactly three short choices, including a sensible 'Other / describe it' option when appropriate. Do not ask for details the user already gave, and do not ask several questions at once.",
      "Use the user's reply to resolve the ambiguity, then answer the original request with clear numbered steps and explain which details may need manual adjustment between apps. If an important ambiguity remains, ask one further targeted question only when needed; otherwise state your assumption briefly and proceed.",
      "Do not claim you can see, control, or edit the user's software or files. Use web search only when current information or sources are useful.",
    ].join(" "),
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: isStepCount(5),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    abortSignal: req.signal,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendSources: true,
      onError: () => "Something went wrong. Please try again.",
    }),
  })
}
