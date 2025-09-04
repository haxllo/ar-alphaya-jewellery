export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

export interface ExchangeRate {
  fromCurrency: string
  toCurrency: string
  rate: number
  lastUpdated: string
}

export interface CurrencyState {
  currentCurrency: Currency
  rates: ExchangeRate[]
  lastUpdated: string
}

// Supported currencies
export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' }
]

// Default currency (Sri Lankan Rupee)
export const DEFAULT_CURRENCY: Currency = SUPPORTED_CURRENCIES[0]

class CurrencyService {
  private static readonly STORAGE_KEY = 'ar-alphaya-currency-settings'
  private static readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
  
  // Mock exchange rates (in a real app, fetch from API like exchangerate-api.com)
  private static mockRates: Record<string, number> = {
    'LKR-USD': 0.0031,
    'LKR-EUR': 0.0029,
    'LKR-GBP': 0.0025,
    'LKR-INR': 0.26,
    'LKR-AUD': 0.0047,
    'LKR-CAD': 0.0042,
    'LKR-JPY': 0.46,
    'LKR-SGD': 0.0042,
    // Reverse rates (calculated automatically)
    'USD-LKR': 320,
    'EUR-LKR': 345,
    'GBP-LKR': 400,
    'INR-LKR': 3.85,
    'AUD-LKR': 213,
    'CAD-LKR': 238,
    'JPY-LKR': 2.17,
    'SGD-LKR': 238
  }

  /**
   * Get current currency from localStorage or default
   */
  static getCurrentCurrency(): Currency {
    if (typeof window === 'undefined') return DEFAULT_CURRENCY

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        const currency = SUPPORTED_CURRENCIES.find(c => c.code === settings.currentCurrency)
        return currency || DEFAULT_CURRENCY
      }
    } catch (error) {
      console.error('Error reading currency settings:', error)
    }
    
    return DEFAULT_CURRENCY
  }

  /**
   * Set current currency and store in localStorage
   */
  static setCurrentCurrency(currency: Currency): void {
    if (typeof window === 'undefined') return

    try {
      const settings = {
        currentCurrency: currency.code,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving currency settings:', error)
    }
  }

  /**
   * Convert price from base currency (LKR) to target currency
   */
  static convertPrice(priceInLKR: number, targetCurrency: string): number {
    if (targetCurrency === 'LKR') return priceInLKR

    const rateKey = `LKR-${targetCurrency}`
    const rate = this.mockRates[rateKey]
    
    if (!rate) {
      console.warn(`Exchange rate not found for ${rateKey}`)
      return priceInLKR
    }

    return Math.round(priceInLKR * rate * 100) / 100
  }

  /**
   * Convert price between any two currencies
   */
  static convertBetweenCurrencies(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): number {
    if (fromCurrency === toCurrency) return amount

    // Convert to LKR first, then to target currency
    let amountInLKR = amount
    
    if (fromCurrency !== 'LKR') {
      const toLKRRate = this.mockRates[`${fromCurrency}-LKR`]
      if (toLKRRate) {
        amountInLKR = amount * toLKRRate
      }
    }

    return this.convertPrice(amountInLKR, toCurrency)
  }

  /**
   * Format price with appropriate currency symbol and formatting
   */
  static formatPrice(amount: number, currency: Currency): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 2
    })

    try {
      return formatter.format(amount)
    } catch (error) {
      // Fallback formatting
      const formattedAmount = currency.code === 'JPY' 
        ? Math.round(amount).toLocaleString()
        : amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      
      return `${currency.symbol}${formattedAmount}`
    }
  }

  /**
   * Get exchange rate between two currencies
   */
  static getExchangeRate(fromCurrency: string, toCurrency: string): number | null {
    if (fromCurrency === toCurrency) return 1
    
    const rateKey = `${fromCurrency}-${toCurrency}`
    return this.mockRates[rateKey] || null
  }

  /**
   * Fetch latest exchange rates (mock implementation)
   * In a real app, this would call an external API like exchangerate-api.com
   */
  static async fetchExchangeRates(): Promise<Record<string, number>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In a real implementation:
    // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/LKR`)
    // const data = await response.json()
    // return data.rates
    
    // Return mock rates with some variation
    const variation = 0.02 // 2% variation
    const updatedRates: Record<string, number> = {}
    
    Object.entries(this.mockRates).forEach(([key, rate]) => {
      const randomVariation = 1 + (Math.random() - 0.5) * variation
      updatedRates[key] = Math.round(rate * randomVariation * 10000) / 10000
    })
    
    return updatedRates
  }

  /**
   * Update exchange rates and cache them
   */
  static async updateExchangeRates(): Promise<void> {
    try {
      const rates = await this.fetchExchangeRates()
      this.mockRates = rates
      
      // Cache the rates with timestamp
      if (typeof window !== 'undefined') {
        const cacheData = {
          rates,
          timestamp: Date.now()
        }
        localStorage.setItem('ar-alphaya-exchange-rates', JSON.stringify(cacheData))
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error)
    }
  }

  /**
   * Load cached exchange rates if they're still fresh
   */
  static loadCachedRates(): boolean {
    if (typeof window === 'undefined') return false

    try {
      const cached = localStorage.getItem('ar-alphaya-exchange-rates')
      if (cached) {
        const { rates, timestamp } = JSON.parse(cached)
        
        // Check if cache is still fresh (within CACHE_DURATION)
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          this.mockRates = rates
          return true
        }
      }
    } catch (error) {
      console.error('Error loading cached rates:', error)
    }
    
    return false
  }

  /**
   * Get currency by code
   */
  static getCurrencyByCode(code: string): Currency | null {
    return SUPPORTED_CURRENCIES.find(c => c.code === code) || null
  }
}

export { CurrencyService }
