"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { type ChatMessagePart, type ChatUIMessage } from "@/tools"
import { AskUserPart } from "@/components/parts/ask-user-part"
import { GithubRepoPart } from "@/components/parts/github-repo-part"
import { GiottoMascot } from "@/components/giotto-mascot"
import { OfficialDocsPart } from "@/components/parts/official-docs-part"
import { SourcesPart } from "@/components/parts/sources-part"
import { TextPart } from "@/components/parts/text-part"
import { WebSearchPart } from "@/components/parts/web-search-part"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"

export function ChatMessage({
  message,
  isStreaming = false,
}: {
  message: ChatUIMessage
  isStreaming?: boolean
}) {
  if (message.role === "user") {
    return (
      <Message align="end" className="studio-message studio-message-user">
        <MessageContent>
          <Bubble align="end" variant="muted" className="studio-user-bubble">
            <BubbleContent>
              {message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }

  const responseText = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")

  return (
    <Message align="start" className="studio-message studio-message-assistant">
      <GiottoMascot state={isStreaming ? "thinking" : "generated"} />
      <MessageContent>
        <div className="assistant-response-panel">
          {mergeTextParts(message.parts).map((part, index) => {
            switch (part.type) {
              case "text":
                return <TextPart key={index} part={part} />
              case "tool-official_docs":
                return <OfficialDocsPart key={part.toolCallId} part={part} />
              case "tool-github_repo":
                return <GithubRepoPart key={part.toolCallId} part={part} />
              case "tool-ask_user":
                return <AskUserPart key={part.toolCallId} part={part} />
              case "tool-web_search":
                return <WebSearchPart key={part.toolCallId} part={part} />
              default:
                return null
            }
          })}
          {!isStreaming && <SourcesPart parts={message.parts} />}
        </div>
        {!isStreaming && responseText.trim() && <ResponseActions text={responseText} />}
      </MessageContent>
    </Message>
  )
}

function ResponseActions({ text }: { text: string }) {
  const [vote, setVote] = React.useState<"up" | "down" | null>(null)
  const [copied, setCopied] = React.useState(false)

  async function copyResponse() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="response-actions" aria-label="Response actions">
      <div className="response-feedback" aria-label="Was this response helpful?">
        <button
          type="button"
          className={vote === "up" ? "response-icon-button is-selected" : "response-icon-button"}
          aria-label="This response was helpful"
          aria-pressed={vote === "up"}
          onClick={() => setVote(vote === "up" ? null : "up")}
        >
          <ThumbsUpIcon aria-hidden="true" />
        </button>
        <button
          type="button"
          className={vote === "down" ? "response-icon-button is-selected" : "response-icon-button"}
          aria-label="This response was not helpful"
          aria-pressed={vote === "down"}
          onClick={() => setVote(vote === "down" ? null : "down")}
        >
          <ThumbsDownIcon aria-hidden="true" />
        </button>
      </div>
      <button type="button" className="response-copy-button" onClick={copyResponse}>
        {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
        {copied ? "Copied" : "Copy steps"}
      </button>
    </div>
  )
}

// Web search replies stream one text part per citation, so join them back
// into one markdown document.
function mergeTextParts(parts: ChatMessagePart[]) {
  return parts
    .filter((part) => part.type !== "source-url")
    .reduce<ChatMessagePart[]>((merged, part) => {
      const last = merged.at(-1)
      if (part.type === "text" && last?.type === "text") {
        merged[merged.length - 1] = { ...part, text: last.text + part.text }
        return merged
      }
      merged.push(part)
      return merged
    }, [])
}
