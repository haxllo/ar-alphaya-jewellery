import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return (
    <div 
      className={cn(
        "absolute inset-x-0 h-px w-full bg-amber-mirage-200",
        className
      )} 
    />
  )
}

// For use between sections with padding
export function SectionDivider({ className }: DividerProps) {
  return (
    <div className={cn("relative my-16 md:my-24", className)}>
      <Divider />
    </div>
  )
}
