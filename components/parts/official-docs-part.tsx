"use client"

import { ArrowUpRightIcon, BookOpenTextIcon } from "lucide-react"

import { type OfficialDocsToolPart } from "@/tools"

export function OfficialDocsPart({ part }: { part: OfficialDocsToolPart }) {
  if (part.state !== "output-available" || part.output.items.length === 0) {
    return null
  }

  return (
    <section className="official-docs" aria-label="Official software guides">
      <div className="official-docs-heading">
        <BookOpenTextIcon aria-hidden="true" />
        <span>Official guides</span>
      </div>
      <ul>
        {part.output.items.map((item) => (
          <li key={item.url}>
            <a href={item.url} target="_blank" rel="noreferrer">
              <span>
                <strong>{item.title}</strong>
                <small>{item.app} · {item.summary}</small>
              </span>
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}