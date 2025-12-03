interface DividerProps {
  className?: string
}

// For use between sections with padding
// Minimal luxury section divider with centered diamond ornament
export function SectionDivider({ className }: DividerProps) {
  return (
    <section className="my-16 md:my-24" aria-hidden="true">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-center">
          <div className="flex-1 h-px bg-deep-black/5" />
          <div className="px-4 text-center bg-neutral-soft">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-deep-black/20">
              <path d="M6 0 L12 6 L6 12 L0 6 Z" />
            </svg>
          </div>
          <div className="flex-1 h-px bg-deep-black/5" />
        </div>
      </div>
    </section>
  )
}
