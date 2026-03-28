"use client"

import confetti from "canvas-confetti"

export function Confetti({
  particleCount = 50,
  angle = 90,
  spread = 45,
  startVelocity = 45,
  decay = 0.9,
  gravity = 1,
  drift = 0,
  flat = false,
  ticks = 200,
  origin = { x: 0.5, y: 0.5 },
  colors = ["#00BFC6", "#123C4A", "#FFFFFF"],
  shapes = ["square", "circle", "star"],
  zIndex = 100,
  scalar = 1,
}) {
  const fire = () => {
    confetti({
      particleCount,
      angle,
      spread,
      startVelocity,
      decay,
      gravity,
      drift,
      flat,
      ticks,
      origin,
      colors,
      shapes,
      zIndex,
      scalar,
    })
  }

  // Auto-fire on mount if needed, or expose function
  return { fire }
}

export function ConfettiButton({
  children,
  options,
  ...props
}) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    confetti({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    })
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}
