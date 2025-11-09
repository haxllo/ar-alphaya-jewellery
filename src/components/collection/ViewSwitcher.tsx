'use client'

export type ViewType = 'grid-2' | 'grid-3' | 'grid-4'

interface ViewSwitcherProps {
  view: ViewType
  onViewChange: (view: ViewType) => void
}

export default function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid-2')}
        className={`p-2 rounded transition-colors ${
          view === 'grid-2' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="2 column grid view"
        title="2 columns"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
        </svg>
      </button>
      
      <button
        onClick={() => onViewChange('grid-3')}
        className={`p-2 rounded transition-colors ${
          view === 'grid-3' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="3 column grid view"
        title="3 columns"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h5v5H3V3zm7 0h5v5h-5V3zm7 0h5v5h-5V3zM3 10h5v5H3v-5zm7 0h5v5h-5v-5zm7 0h5v5h-5v-5zM3 17h5v5H3v-5zm7 0h5v5h-5v-5zm7 0h5v5h-5v-5z" />
        </svg>
      </button>
      
      <button
        onClick={() => onViewChange('grid-4')}
        className={`p-2 rounded transition-colors ${
          view === 'grid-4' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="4 column grid view"
        title="4 columns"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h3v3H3V3zm5 0h3v3H8V3zm5 0h3v3h-3V3zm5 0h3v3h-3V3zM3 8h3v3H3V8zm5 0h3v3H8V8zm5 0h3v3h-3V8zm5 0h3v3h-3V8zM3 13h3v3H3v-3zm5 0h3v3H8v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3zM3 18h3v3H3v-3zm5 0h3v3H8v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3z" />
        </svg>
      </button>
      
    </div>
  )
}
