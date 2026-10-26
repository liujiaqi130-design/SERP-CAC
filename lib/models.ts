export const MODELS = [
  { id: "nvidia/nemotron-3.5-lightning-free", name: "Nemotron 3.5 Lightning (Free)" },
]

export const DEFAULT_MODEL = MODELS[0].id

export interface ChatModel {
  id: string
  name: string
}

export function isModelAllowed(id: string) {
  return MODELS.some((model) => model.id === id)
}
