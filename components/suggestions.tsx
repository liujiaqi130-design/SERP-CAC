"use client"

import { Button } from "@/components/ui/button"

const suggestions = [
  { label: "Recreate an Alight Motion title", prompt: "I made an animated title in Alight Motion and want to recreate a similar editable text effect in After Effects." },
  { label: "Animate text in After Effects", prompt: "I am new to After Effects. Show me a simple way to customize a text layer and animate it with keyframes." },
  { label: "Move a design between apps", prompt: "I need to move a creative project between two apps. Help me choose a workflow and explain what may not transfer automatically." },
]

export function Suggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="studio-suggestions">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.label}
          type="button"
          variant="outline"
          size="sm"
          className="studio-suggestion"
          onClick={() => onSelect(suggestion.prompt)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
