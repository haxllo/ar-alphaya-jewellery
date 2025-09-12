'use client'

interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function SearchPagination({
  currentPage,
  totalPages,
  onPageChange
}: SearchPaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm font-medium rounded-md border ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-black'
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-sm text-gray-500"
            >
              ...
            </span>
          )
        }

        const pageNumber = page as number
        const isCurrentPage = pageNumber === currentPage

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-2 text-sm font-medium rounded-md border ${
              isCurrentPage
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-black'
            }`}
          >
            {pageNumber}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm font-medium rounded-md border ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-black'
        }`}
      >
        Next
      </button>
    </div>
  )
}
