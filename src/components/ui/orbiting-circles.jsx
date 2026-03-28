import { cn } from "@/lib/utils"

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 0,
  radius = 50,
  path = true,
}) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-black/10 stroke-1 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}

      <div
        style={{
          "--duration": duration,
          "--radius": radius,
          "--delay": -delay,
        }}
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full [animation-delay:calc(var(--delay)*1s)]",
          { "[animation-direction:reverse]": reverse },
          className,
        )}
      >
        {children}
      </div>
    </>
  )
}
