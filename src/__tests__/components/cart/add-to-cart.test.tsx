import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddToCart from '@/components/cart/add-to-cart'
import { renderWithProviders, createMockProduct, mockCartStore } from '../../utils/test-utils'

// Mock the cart store
jest.mock('@/lib/store/cart', () => ({
  useCartStore: () => mockCartStore,
}))

describe('AddToCart Component', () => {
  const mockProduct = createMockProduct()
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockCartStore.items = []
  })

  test('renders add to cart button', () => {
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    expect(addButton).toBeInTheDocument()
  })

  test('shows size selector when product has sizes', () => {
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    const sizeSelector = screen.getByLabelText(/size/i)
    expect(sizeSelector).toBeInTheDocument()
    
    // Check that all sizes are available
    mockProduct.sizes?.forEach(size => {
      expect(screen.getByText(size.label)).toBeInTheDocument()
    })
  })

  test('adds product to cart when clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addButton)
    
    expect(mockCartStore.addItem).toHaveBeenCalledWith({
      productId: mockProduct.id,
      slug: mockProduct.slug,
      name: mockProduct.name,
      price: mockProduct.price,
      quantity: 1,
      size: 'S', // Default first size
      image: mockProduct.images[0],
    })
  })

  test('adds product with selected size', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    // Select a different size
    const sizeSelector = screen.getByLabelText(/size/i)
    await user.selectOptions(sizeSelector, 'M')
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addButton)
    
    expect(mockCartStore.addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'M',
      })
    )
  })

  test('updates quantity correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    const quantityInput = screen.getByLabelText(/quantity/i)
    await user.clear(quantityInput)
    await user.type(quantityInput, '3')
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addButton)
    
    expect(mockCartStore.addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 3,
      })
    )
  })

  test('shows success message after adding to cart', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText(/added to cart/i)).toBeInTheDocument()
    })
  })

  test('disables button when product is out of stock', () => {
    const outOfStockProduct = createMockProduct({ inStock: false })
    renderWithProviders(<AddToCart product={outOfStockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /out of stock/i })
    expect(addButton).toBeDisabled()
  })

  test('handles products without sizes', () => {
    const productWithoutSizes = createMockProduct({ sizes: [] })
    renderWithProviders(<AddToCart product={productWithoutSizes} />)
    
    // Size selector should not be present
    expect(screen.queryByLabelText(/size/i)).not.toBeInTheDocument()
    
    // Should still be able to add to cart
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).not.toBeDisabled()
  })

  test('validates quantity input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddToCart product={mockProduct} />)
    
    const quantityInput = screen.getByLabelText(/quantity/i)
    
    // Try to enter invalid quantity
    await user.clear(quantityInput)
    await user.type(quantityInput, '0')
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addButton)
    
    // Should show validation error or reset to minimum quantity
    await waitFor(() => {
      expect(quantityInput).toHaveValue(1) // Should reset to minimum
    })
  })
})
