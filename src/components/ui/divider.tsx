import { Separator } from "@/components/ui/separator"

interface DividerProps {
  className?: string
}

// For use between sections with padding
// Minimal luxury section divider with centered ornament
export function SectionDivider({ className }: DividerProps) {
  return (
    <div className="mx-auto max-w-7xl px-8 my-16 md:my-24">
      <div className="flex items-center gap-4">
        <Separator className="bg-deep-black/5" />
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-neutral-soft text-xs text-deep-black/20">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="opacity-40">
            <path d="M6 0 L12 6 L6 12 L0 6 Z" />
          </svg>
        </div>
        <Separator className="bg-deep-black/5" />
      </div>
    </div>
  )
}
