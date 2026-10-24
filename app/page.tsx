import type { Metadata } from "next"

import { MODELS } from "@/lib/models"
import { Chat } from "@/components/chat"

export const metadata: Metadata = {
  title: "Giotto",
  description: "A creative software workflow assistant powered by Anthropic Claude.",
}

export default function Page() {
  return <Chat models={MODELS} />
}
