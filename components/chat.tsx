"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"
import { type ChatModel } from "@/lib/models"
import { type ChatUIMessage } from "@/tools"
import { ChatMessage } from "@/components/chat-message"
import { GiottoMascot } from "@/components/giotto-mascot"
import { PromptForm } from "@/components/prompt-form"
import { QuestionCard } from "@/components/question-card"
import { Suggestions } from "@/components/suggestions"
import { ModelSelect } from "@/components/model-select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const softwareOptions = [
  "After Effects",
  "Alight Motion",
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "Other app",
]

export function Chat({ models }: { models: ChatModel[] }) {
  const [model, setModel] = React.useState(models[0]?.id ?? "")
  const [sourceApp, setSourceApp] = React.useState("Alight Motion")
  const [targetApp, setTargetApp] = React.useState("After Effects")
  const [goal, setGoal] = React.useState("")

  const { messages, sendMessage, status, stop, error, addToolOutput } =
    useChat<ChatUIMessage>({
      // Continue automatically after the user answers Giotto's clarification.
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    })

  const resolvedModel = models.some((item) => item.id === model)
    ? model
    : (models[0]?.id ?? "")
  const isBusy = status === "submitted" || status === "streaming"
  const lastMessage = messages.at(-1)
  const pendingQuestion =
    lastMessage?.role === "assistant"
      ? lastMessage.parts.find(
          (part): part is Extract<typeof part, { type: "tool-ask_user" }> =>
            part.type === "tool-ask_user" &&
            (part.state === "input-streaming" ||
              part.state === "input-available")
        )
      : undefined

  function submitWorkflow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedGoal = goal.trim()
    if (!trimmedGoal || isBusy) return

    const prompt = [
      `Current software: ${sourceApp}.`,
      `Target software: ${targetApp}.`,
      `What I want to do: ${trimmedGoal}`,
      "Help me make this workflow. If a missing detail could change the steps, ask one focused clarifying question before answering.",
    ].join(" ")

    sendMessage({ text: prompt }, { body: { model: resolvedModel } })
    setGoal("")
  }

  return (
    <main className="studio-chat">
      {messages.length === 0 ? (
        <section className="studio-home" aria-labelledby="welcome-title">
          <div className="studio-welcome">
            <span className="studio-eyebrow"><SparklesIcon aria-hidden="true" /> CREATIVE WORKFLOW ASSISTANT</span>
            <h1 id="welcome-title">Let&apos;s make your next idea work.</h1>
            <p>Tell Giotto what you want to create, and it&apos;ll help translate the workflow between apps.</p>
          </div>

          <form className="workflow-card" onSubmit={submitWorkflow}>
            <label className="workflow-description-label" htmlFor="workflow-goal">WHAT WOULD YOU LIKE TO DO?</label>
            <textarea
              id="workflow-goal"
              className="workflow-goal"
              placeholder="For example: recreate my Alight Motion text animation in After Effects…"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              rows={3}
            />
            <div className="workflow-apps">
              <label className="workflow-field">
                <span>CURRENT APP</span>
                <select value={sourceApp} onChange={(event) => setSourceApp(event.target.value)}>
                  {softwareOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="workflow-field">
                <span>TARGET APP</span>
                <select value={targetApp} onChange={(event) => setTargetApp(event.target.value)}>
                  {softwareOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </div>
            <p className="workflow-hint">If you choose Other app, include its name in your description.</p>
            <div className="workflow-footer">
              <ModelSelect
                models={models}
                value={resolvedModel}
                onValueChange={setModel}
              />
              <button className="workflow-submit" type="submit" disabled={!goal.trim() || isBusy}>
                Translate workflow <ArrowRightIcon aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="suggestion-area">
            <p>NEED A STARTING POINT?</p>
            <Suggestions onSelect={setGoal} />
          </div>
          <p className="studio-footnote">Giotto can ask a quick follow-up when your goal could mean more than one thing.</p>
        </section>
      ) : (
        <>
          <MessageScrollerProvider>
            <MessageScroller className="studio-conversation">
              <MessageScrollerViewport>
                <MessageScrollerContent className="studio-message-list">
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      <ChatMessage
                        message={message}
                        isStreaming={isBusy && message.id === lastMessage?.id}
                      />
                    </MessageScrollerItem>
                  ))}
                  {status === "submitted" && (
                    <MessageScrollerItem messageId="thinking">
                      <div className="studio-thinking"><GiottoMascot state="thinking" /><span>Giotto is thinking…</span></div>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
                {pendingQuestion && (
                  <QuestionCard
                    part={pendingQuestion}
                    onAnswer={(toolCallId, answer) =>
                      addToolOutput({
                        tool: "ask_user",
                        toolCallId,
                        output: answer,
                        options: { body: { model: resolvedModel } },
                      })
                    }
                  />
                )}
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          <div className="studio-composer-wrap">
            {error && (
              <Alert variant="destructive" className="studio-error">
                <AlertTitle>Request failed</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <PromptForm
              models={models}
              model={resolvedModel}
              onModelChange={setModel}
              isBusy={isBusy}
              onSubmit={(text) => sendMessage({ text }, { body: { model: resolvedModel } })}
              onStop={() => stop()}
            />
            <p className="composer-note">Enter to send · Shift + Enter for a new line</p>
          </div>
        </>
      )}
    </main>
  )
}
