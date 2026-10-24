"use client"

import { Button } from "@/components/ui/button"

const suggestions = [
  {
    label: "Recreate an Alight Motion title",
    prompt:
      "I made an animated title in Alight Motion and want to recreate a similar editable text effect in After Effects. Ask one clarifying question if you need more detail, then give beginner-friendly steps.",
  },
  {
    label: "Animate text in After Effects",
    prompt:
      "I am new to After Effects. Show me a simple way to customize a text layer and animate it with keyframes.",
  },
  {
    label: "Move a design between apps",
    prompt:
      "I need to move a creative project between two apps. Ask me which apps and what I need to preserve, then suggest a workflow.",
  },
  {
    label: "Help me choose a workflow",
    prompt:
      "I know the visual result I want but I am unsure which steps or app settings will get me there. Ask me a clarifying question first.",
  },
]

export function Suggestions({
  onSelect,
}: {
  onSelect: (prompt: string) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.label}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion.prompt)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
