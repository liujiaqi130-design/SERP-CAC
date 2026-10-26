"use client"

import Image from "next/image"

type GiottoMascotProps = {
  state: "thinking" | "generated"
}

export function GiottoMascot({ state }: GiottoMascotProps) {
  const label = state === "thinking" ? "Giotto is thinking" : "Giotto is ready"

  return (
    <div className="giotto-mascot" role="img" aria-label={label}>
      <Image
        className="giotto-mascot-frame giotto-mascot-frame-one"
        src={state === "thinking" ? "/mascot/giotto-thinking-1.webp" : "/mascot/giotto-generated-1.webp"}
        alt=""
        width={640}
        height={640}
        unoptimized
      />
      <Image
        className="giotto-mascot-frame giotto-mascot-frame-two"
        src={state === "thinking" ? "/mascot/giotto-thinking-2.webp" : "/mascot/giotto-generated-2.webp"}
        alt=""
        width={640}
        height={640}
        unoptimized
      />
    </div>
  )
}