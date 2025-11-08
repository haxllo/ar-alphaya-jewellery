'use client'

import { Label } from '@/components/ui/label'

interface CheckboxGridProps {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  columns?: number
}

export function CheckboxGrid({ label, options, selected, onChange, columns = 3 }: CheckboxGridProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${label}-${option}`}
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor={`${label}-${option}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-gray-500">
          Selected: {selected.join(', ')}
        </p>
      )}
    </div>
  )
}
