'use client'

interface DeliveryEstimateProps {
  city?: string
}

export default function DeliveryEstimate({ city }: DeliveryEstimateProps) {
  const getEstimatedDelivery = () => {
    const today = new Date()
    const minDays = 3
    const maxDays = 5
    
    const minDate = new Date(today)
    minDate.setDate(today.getDate() + minDays)
    
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + maxDays)
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`
  }

  return (
    <div className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
      <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <div>
        <p className="font-medium text-gray-900">Estimated Delivery</p>
        <p className="text-gray-600 mt-0.5">
          {getEstimatedDelivery()}
          {city && ` to ${city}`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Orders placed before 2 PM ship same day
        </p>
      </div>
    </div>
  )
}
