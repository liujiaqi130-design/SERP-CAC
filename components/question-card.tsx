"use client"

import { type AskUserToolPart } from "@/tools"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export function QuestionCard({
  part,
  onAnswer,
}: {
  part: AskUserToolPart
  onAnswer: (
    toolCallId: string,
    answers: { question: string; answer: string }[]
  ) => void
}) {
  const questions = part.state === "input-available" ? part.input.questions : []

  return (
    <div className="clarification-dock">
      <section className="clarification-card" aria-label="Giotto needs clarification">
        <div className="clarification-heading">
          <span className="clarification-kicker">QUICK CLARIFICATION</span>
          <p>Choose the option that best matches what you mean.</p>
        </div>
        {questions.length === 0 ? (
          <div className="studio-thinking"><span /> Preparing a question…</div>
        ) : (
          <Questionnaire
            key={part.toolCallId}
            defaultItem="q0"
            items={questions.map((question, index) => ({
              choices: question.choices.map((choice) => ({ value: choice })),
              name: `q${index}`,
              required: true,
            }))}
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              onAnswer(
                part.toolCallId,
                questions.map((question, index) => ({
                  question: question.question,
                  answer: String(formData.get(`q${index}`) ?? ""),
                }))
              )
            }}
          >
            {questions.length > 1 && <QuestionnaireProgress className="clarification-progress" />}
            {questions.map((question, index) => (
              <QuestionnaireItem key={index} name={`q${index}`} required className="clarification-item">
                <QuestionnaireTitle className="clarification-question">{question.question}</QuestionnaireTitle>
                <QuestionnaireChoices className="clarification-choices">
                  {question.choices.map((choice) => (
                    <QuestionnaireChoice key={choice} value={choice} className="clarification-choice">
                      {choice}
                    </QuestionnaireChoice>
                  ))}
                  <QuestionnaireInput
                    aria-label="Another answer"
                    placeholder="Or type your answer…"
                    className="clarification-input"
                  />
                </QuestionnaireChoices>
                <QuestionnaireError />
              </QuestionnaireItem>
            ))}
            <QuestionnaireActions className="clarification-actions">
              <QuestionnairePrevious />
              <QuestionnaireNext>Next</QuestionnaireNext>
              <QuestionnaireSubmit>Use this answer</QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        )}
      </section>
    </div>
  )
}
