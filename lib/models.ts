export const MODELS = [
  { id: "anthropic/claude-haiku-5-5", name: "Claude Haiku 5.5" },
]

export const DEFAULT_MODEL = MODELS[0].id

export interface ChatModel {
  id: string
  name: string
}

export function isModelAllowed(id: string) {
  return MODELS.some((model) => model.id === id)
}
