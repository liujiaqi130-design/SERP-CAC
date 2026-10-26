import Link from "next/link"
import { SparklesIcon } from "lucide-react"

import { NewChatButton } from "@/components/new-chat-button"

export function SiteHeader() {
  return (
    <header className="studio-header">
      <Link href="/" className="studio-brand" aria-label="Studio Companion home">
        <span className="studio-brand-mark"><SparklesIcon aria-hidden="true" /></span>
        <span className="studio-brand-copy">
          <strong>Studio Companion</strong>
          <span>by Giotto</span>
        </span>
      </Link>
      <NewChatButton />
    </header>
  )
}
