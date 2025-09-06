import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { UserProfile } from '@auth0/nextjs-auth0/client'

// Mock Zustand stores
export const mockCartStore = {
  items: [] as any[],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  clearImmediate: jest.fn(),
  setQuantity: jest.fn(),
}

export const mockWishlistStore = {
  items: [] as any[],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  isInWishlist: jest.fn(() => false),
  clearWishlist: jest.fn(),
  getItemCount: jest.fn(() => 0),
}

// Mock Auth0 user
export const mockUser: UserProfile = {
  sub: 'auth0|test-user-id',
  name: 'Test User',
  given_name: 'Test',
  family_name: 'User',
  nickname: 'testuser',
  email: 'test@example.com',
  email_verified: true,
  picture: 'https://example.com/avatar.jpg',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// Mock Auth0 context
interface MockAuth0ContextProps {
  user?: UserProfile | null
  isLoading?: boolean
  error?: Error | null
}

export const MockAuth0Provider: React.FC<{
  children: React.ReactNode
  value?: MockAuth0ContextProps
}> = ({ children, value = {} }) => {
  const mockValue = {
    user: value.user || null,
    isLoading: value.isLoading || false,
    error: value.error || null,
  }

  // Mock the useUser hook
  jest.doMock('@auth0/nextjs-auth0/client', () => ({
    useUser: () => mockValue,
    UserProvider: ({ children }: { children: React.ReactNode }) => children,
  }))

  return <>{children}</>
}

// Custom render function that includes providers
interface CustomRenderOptions extends RenderOptions {
  user?: UserProfile | null
  isLoading?: boolean
  error?: Error | null
  cartItems?: any[]
  wishlistItems?: any[]
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const {
    user = null,
    isLoading = false,
    error = null,
    cartItems = [],
    wishlistItems = [],
    ...renderOptions
  } = options

  // Setup store mocks
  mockCartStore.items = cartItems as any[]
  mockWishlistStore.items = wishlistItems as any[]

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockAuth0Provider value={{ user, isLoading, error }}>
        {children}
      </MockAuth0Provider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Helper function to create mock products
export const createMockProduct = (overrides = {}) => ({
  id: 'test-product-1',
  slug: 'test-product',
  name: 'Test Product',
  description: 'A test product for testing',
  price: 5000, // 50.00 LKR in cents
  currency: 'LKR',
  images: ['/images/test-product.jpg'],
  category: 'rings',
  sku: 'TEST-001',
  materials: ['Gold', 'Diamond'],
  sizes: [
    { label: 'Small', value: 'S' },
    { label: 'Medium', value: 'M' },
    { label: 'Large', value: 'L' },
  ],
  inStock: true,
  featured: false,
  tags: ['test', 'jewelry'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})

// Helper function to create mock cart items
export const createMockCartItem = (overrides = {}) => ({
  productId: 'test-product-1',
  slug: 'test-product',
  name: 'Test Product',
  price: 5000,
  quantity: 1,
  size: 'M',
  image: '/images/test-product.jpg',
  ...overrides,
})

// Helper function to create mock wishlist items
export const createMockWishlistItem = (overrides = {}) => ({
  productId: 'test-product-1',
  slug: 'test-product',
  name: 'Test Product',
  price: 5000,
  category: 'rings',
  materials: ['Gold', 'Diamond'],
  image: '/images/test-product.jpg',
  addedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})

// Mock fetch responses
export const mockFetch = (response: any, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  })
}

// Cleanup function for tests
export const cleanup = () => {
  jest.clearAllMocks()
  mockCartStore.items = []
  mockWishlistStore.items = []
}

// Wait for async operations
export const waitFor = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Test data generators
export const generateProducts = (count: number) => 
  Array.from({ length: count }, (_, index) => 
    createMockProduct({
      id: `product-${index + 1}`,
      slug: `product-${index + 1}`,
      name: `Product ${index + 1}`,
      price: (index + 1) * 1000,
    })
  )

// Custom matchers
expect.extend({
  toBeInCart(received: any, expected: any) {
    const pass = mockCartStore.items.some(
      (item: any) => item.productId === expected
    )
    
    if (pass) {
      return {
        message: () => `expected product ${expected} not to be in cart`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected product ${expected} to be in cart`,
        pass: false,
      }
    }
  },
})
