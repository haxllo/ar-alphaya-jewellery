import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return (
    <div 
      className={cn(
        "absolute inset-x-0 h-px w-full bg-deep-black/5",
        className
      )} 
    />
  )
}

// For use between sections with padding
// Very subtle divider that's barely visible - matches minimal luxury aesthetic
export function SectionDivider({ className }: DividerProps) {
  return (
    <div className="mx-auto max-w-7xl px-8">
      <div className="relative flex items-center justify-center my-16 md:my-24">
        <div className="h-px w-full bg-deep-black/5" />
        <span className="absolute bg-neutral-soft px-6 text-xs uppercase tracking-wider text-deep-black/20 font-light">
          ◆
        </span>
      </div>
    </div>
  )
}
