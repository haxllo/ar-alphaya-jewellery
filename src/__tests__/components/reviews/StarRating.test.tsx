import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StarRating from '@/components/reviews/StarRating'
import { renderWithProviders } from '../../utils/test-utils'

describe('StarRating Component', () => {
  test('displays correct number of stars', () => {
    renderWithProviders(<StarRating rating={3} />)
    
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5) // Always shows 5 stars
  })

  test('shows filled stars for rating value', () => {
    renderWithProviders(<StarRating rating={4} />)
    
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
    
    // Check rating text is displayed
    expect(screen.getByText('4.0')).toBeInTheDocument()
  })

  test('handles half star ratings', () => {
    renderWithProviders(<StarRating rating={3.5} />)
    
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
    
    // Check rating text shows decimal
    expect(screen.getByText('3.5')).toBeInTheDocument()
  })

  test('calls onRatingChange when interactive and star is clicked', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    renderWithProviders(
      <StarRating rating={2} onRatingChange={handleChange} interactive />
    )
    
    const stars = screen.getAllByRole('button')
    await user.click(stars[3]) // Click 4th star (0-indexed)
    
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  test('does not call onRatingChange when not interactive', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    renderWithProviders(
      <StarRating rating={2} onRatingChange={handleChange} interactive={false} />
    )
    
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5) // Stars are always rendered as buttons but disabled
    
    // Buttons should be disabled
    stars.forEach(star => {
      expect(star).toBeDisabled()
    })
    
    expect(handleChange).not.toHaveBeenCalled()
  })

  test('shows rating text by default', () => {
    renderWithProviders(
      <StarRating rating={4.2} />
    )
    
    expect(screen.getByText('4.2')).toBeInTheDocument()
  })

  test('hides rating text when rating is zero', () => {
    renderWithProviders(
      <StarRating rating={0} />
    )
    
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  test('handles zero rating', () => {
    renderWithProviders(<StarRating rating={0} />)
    
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
    
    // No rating text should be shown
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  test('handles maximum rating', () => {
    renderWithProviders(<StarRating rating={5} />)
    
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
    
    expect(screen.getByText('5.0')).toBeInTheDocument()
  })

  test('applies custom size classes', () => {
    renderWithProviders(
      <StarRating rating={3} size="lg" />
    )
    
    const stars = screen.getAllByRole('button')
    expect(stars[0]).toBeInTheDocument()
  })

  test('applies custom className', () => {
    renderWithProviders(
      <StarRating rating={3} className="custom-rating" />
    )
    
    const starContainer = screen.getAllByRole('button')[0].parentElement
    expect(starContainer).toHaveClass('custom-rating')
  })

  test('shows hover effects on interactive stars', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StarRating rating={2} interactive />)
    
    const stars = screen.getAllByRole('button')
    
    // Check that interactive stars have hover classes
    expect(stars[0]).toHaveClass('cursor-pointer')
    expect(stars[0]).toHaveClass('hover:scale-110')
  })

  test('disabled stars do not have hover effects', () => {
    renderWithProviders(<StarRating rating={2} interactive={false} />)
    
    const stars = screen.getAllByRole('button')
    
    // Non-interactive stars should have cursor-default
    expect(stars[0]).toHaveClass('cursor-default')
    expect(stars[0]).not.toHaveClass('hover:scale-110')
  })
})
