import { cn } from "@/lib/utils"

export function TweetCard({
  name,
  handle,
  content,
  avatar,
  date,
  verified = true,
  className,
}) {
  return (
    <div
      className={cn(
        "flex h-full w-[350px] flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all duration-300",
        "bg-white/[0.01] [box-shadow:0_0_0_1px_rgba(255,255,255,.05),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "hover:bg-white/[0.05] dark:border-white/10 dark:bg-black/20",
        className,
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="h-10 w-10 rounded-full bg-neutral-800 object-cover"
          src={avatar}
          alt={name}
        />
        <div className="flex flex-col">
          <figcaption className="flex items-center gap-1 text-sm font-semibold dark:text-white">
            {name}
            {verified && (
              <svg
                viewBox="0 0 24 24"
                aria-label="Verified account"
                className="h-4 w-4 fill-[#00BFC6]"
              >
                <g>
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.06-1.06 2.47 2.47 6.13-6.13 1.06 1.06-7.19 7.19z"></path>
                </g>
              </svg>
            )}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{handle}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed dark:text-white/80">
        {content}
      </blockquote>
      <div className="mt-4 text-[10px] dark:text-white/30">{date}</div>
    </div>
  )
}
