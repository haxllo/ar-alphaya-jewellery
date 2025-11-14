'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Filter, CheckSquare, X, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Product } from '@/types/admin'

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    outOfStock: 0
  })
  
  // AlertDialog state
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{
    title: string
    description: string
    action: () => void
    actionLabel: string
    variant?: 'default' | 'destructive'
  } | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [search])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/products/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const deleteProduct = async (id: string) => {
    setAlertConfig({
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product? This action cannot be undone.',
      actionLabel: 'Delete',
      variant: 'destructive',
      action: async () => {
        try {
          await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
          fetchProducts()
          fetchStats()
          toast({
            variant: "success",
            title: "Product deleted",
            description: "Product has been successfully deleted",
          })
        } catch (error) {
          console.error('Error deleting product:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete product",
          })
        }
      }
    })
    setAlertOpen(true)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map(p => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAction = (actionType: string) => {
    if (selectedIds.size === 0) return
    
    const count = selectedIds.size
    const ids = Array.from(selectedIds)
    
    let title = ''
    let description = ''
    let actionLabel = ''
    let variant: 'default' | 'destructive' = 'default'
    
    switch (actionType) {
      case 'delete':
        title = 'Delete Products'
        description = `Are you sure you want to delete ${count} product(s)? This action cannot be undone.`
        actionLabel = 'Delete'
        variant = 'destructive'
        break
      case 'publish':
        title = 'Publish Products'
        description = `Publish ${count} product(s)? They will be visible on your website.`
        actionLabel = 'Publish'
        break
      case 'draft':
        title = 'Move to Draft'
        description = `Move ${count} product(s) to draft? They will be hidden from your website.`
        actionLabel = 'Move to Draft'
        break
      default:
        return
    }
    
    setAlertConfig({
      title,
      description,
      actionLabel,
      variant,
      action: async () => {
        try {
          const response = await fetch('/api/admin/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: actionType, ids })
          })
          
          if (!response.ok) {
            throw new Error('Bulk action failed')
          }
          
          setSelectedIds(new Set())
          fetchProducts()
          fetchStats()
          
          toast({
            variant: "success",
            title: "Success!",
            description: actionType === 'delete' 
              ? `Successfully deleted ${count} product(s)`
              : actionType === 'publish'
              ? `Successfully published ${count} product(s) - now visible on website`
              : `Moved ${count} product(s) to draft - hidden from website`,
          })
        } catch (error) {
          console.error('Error performing bulk action:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to perform bulk action. Please try again.",
          })
        }
      }
    })
    setAlertOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 hidden xs:block">Manage your jewellery inventory</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/admin/guide" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-10" title="Help Guide">
                  <BookOpen className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Help Guide</span>
                </Button>
              </Link>
              <Link href="/admin/products/new" className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto h-11 sm:h-10" title="Add Product">
                  <Plus className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600">Published</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.published}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600">Drafts</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.draft}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600">Featured</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.featured}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 h-11 sm:h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-10" title="Filters">
              <Filter className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIds.size > 0 && (
          <div className="bg-white border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {selectedIds.size} selected
                  </span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border" />
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                    onClick={() => handleBulkAction('publish')}
                  >
                    Publish
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                    onClick={() => handleBulkAction('draft')}
                  >
                    Draft
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                    onClick={() => handleBulkAction('delete')}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
                onClick={() => setSelectedIds(new Set())}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-gray-600">No products found</p>
              <Link href="/admin/products/new">
                <Button className="mt-4">Create your first product</Button>
              </Link>
            </div>
          ) : (
            <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selectedIds.size === products.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sku || 'No SKU'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {product.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={product.status === 'published' ? 'success' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={product.in_stock ? 'success' : 'destructive'}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex gap-3">
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded bg-gray-200" />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{product.sku || 'No SKU'}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Rs. {product.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={product.status === 'published' ? 'success' : 'secondary'} className="text-xs">
                          {product.status}
                        </Badge>
                        <Badge variant={product.in_stock ? 'success' : 'destructive'} className="text-xs">
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-sm text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </div>

      <Toaster />
      
      {/* Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={alertConfig?.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              onClick={() => {
                alertConfig?.action()
                setAlertOpen(false)
              }}
            >
              {alertConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
