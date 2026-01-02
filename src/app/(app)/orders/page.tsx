'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  gemstone?: string
  image?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total: number
  currency: string
  created_at: string
  paid_at?: string
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sessionStatus === 'loading') return

    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/orders')
      return
    }

    // Fetch orders
    fetch('/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setOrders(data.orders || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching orders:', error)
        setOrders([]) // Set empty array on error
        setIsLoading(false)
      })
  }, [sessionStatus, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPrice = (cents: number, currency: string = 'LKR') => {
    return `Rs ${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'delivered':
        return 'text-green-600'
      case 'processing':
      case 'shipped':
        return 'text-blue-600'
      case 'cancelled':
      case 'refunded':
        return 'text-red-600'
      default:
        return 'text-deep-black/70'
    }
  }

  if (sessionStatus === 'loading' || isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12 min-h-screen bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
        <div className="text-center py-12">
          <p className="text-deep-black/70">Loading orders...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 min-h-screen bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-deep-black/70 hover:text-metal-gold mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-serif font-normal text-deep-black">Your Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-neutral-soft rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-deep-black/40" />
          </div>
          
          <h2 className="text-xl font-medium text-deep-black mb-4">No orders yet</h2>
          <p className="text-deep-black/70 mb-8">
            When you place your first order, it will appear here.
          </p>
          
          <Link 
            href="/" 
            className="inline-block bg-deep-black text-white px-6 py-3 rounded-full hover:bg-forest-deep transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-metal-gold/20 rounded-2xl p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-deep-black">{order.order_number}</h3>
                  <p className="text-sm text-deep-black/70">
                    Placed on {formatDate(order.created_at)}
                  </p>
                  {order.paid_at && (
                    <p className="text-sm text-deep-black/50">
                      Paid on {formatDate(order.paid_at)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-deep-black">
                    {formatPrice(order.total, order.currency)}
                  </p>
                  <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                  {order.payment_status !== order.status && (
                    <p className="text-xs text-amber-mirage-500 mt-1">
                      Payment: {order.payment_status}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 mt-4 pt-4 border-t border-metal-gold/10">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded mr-4 border border-amber-mirage-200"
                      />
                    )}
                    {!item.image && (
                      <div className="w-12 h-12 bg-neutral-soft rounded mr-4"></div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-deep-black">{item.name}</p>
                      <div className="flex items-center gap-2 text-sm text-deep-black/70">
                        <span>Quantity: {item.quantity}</span>
                        {item.size && <span>• Size: {item.size}</span>}
                        {item.gemstone && <span>• {item.gemstone}</span>}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-amber-mirage-brown">
                      {formatPrice(item.price * item.quantity, order.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
