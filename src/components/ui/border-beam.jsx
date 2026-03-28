"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#00BFC6",
  colorTo = "#123C4A",
  delay = 0,
}) => {
  return (
    <div
      style={{
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--anchor": `${anchor}`,
        "--border-width": `${borderWidth}px`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `-${delay}s`,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:var(--border-width)_solid_transparent]",

        // mask styles
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]",

        // pseudo styles
        "after:absolute after:aspect-square after:w-[var(--size)] after:animate-border-beam after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  )
}
