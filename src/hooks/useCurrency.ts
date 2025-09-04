'use client';

import { useState, useEffect, useCallback } from 'react';
import { Currency, CurrencyService, DEFAULT_CURRENCY } from '@/lib/currency';

interface UseCurrencyReturn {
  currentCurrency: Currency;
  convertPrice: (priceInLKR: number) => number;
  formatPrice: (priceInLKR: number) => string;
  formatAmount: (amount: number, currency: Currency) => string;
  changeCurrency: (currency: Currency) => void;
  isLoading: boolean;
  error: string | null;
}

export function useCurrency(): UseCurrencyReturn {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current currency on mount
  useEffect(() => {
    const currency = CurrencyService.getCurrentCurrency();
    setCurrentCurrency(currency);

    // Load cached rates
    CurrencyService.loadCachedRates();
  }, []);

  // Listen for currency changes from other components
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      const { currency } = event.detail;
      setCurrentCurrency(currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const convertPrice = useCallback((priceInLKR: number): number => {
    try {
      return CurrencyService.convertPrice(priceInLKR, currentCurrency.code);
    } catch (err) {
      console.error('Error converting price:', err);
      return priceInLKR;
    }
  }, [currentCurrency]);

  const formatPrice = useCallback((priceInLKR: number): string => {
    try {
      const convertedPrice = convertPrice(priceInLKR);
      return CurrencyService.formatPrice(convertedPrice, currentCurrency);
    } catch (err) {
      console.error('Error formatting price:', err);
      return `${currentCurrency.symbol}${priceInLKR}`;
    }
  }, [currentCurrency, convertPrice]);

  const formatAmount = useCallback((amount: number, currency: Currency): string => {
    try {
      return CurrencyService.formatPrice(amount, currency);
    } catch (err) {
      console.error('Error formatting amount:', err);
      return `${currency.symbol}${amount}`;
    }
  }, []);

  const changeCurrency = useCallback(async (currency: Currency) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update currency
      CurrencyService.setCurrentCurrency(currency);
      setCurrentCurrency(currency);

      // Update exchange rates
      await CurrencyService.updateExchangeRates();

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { currency } 
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change currency';
      setError(errorMessage);
      console.error('Error changing currency:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentCurrency,
    convertPrice,
    formatPrice,
    formatAmount,
    changeCurrency,
    isLoading,
    error
  };
}

// Utility hook for price formatting only (lighter weight)
export function usePriceFormatter() {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    const currency = CurrencyService.getCurrentCurrency();
    setCurrentCurrency(currency);

    const handleCurrencyChange = (event: CustomEvent) => {
      const { currency } = event.detail;
      setCurrentCurrency(currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const formatPrice = useCallback((priceInLKR: number): string => {
    try {
      const convertedPrice = CurrencyService.convertPrice(priceInLKR, currentCurrency.code);
      return CurrencyService.formatPrice(convertedPrice, currentCurrency);
    } catch (err) {
      console.error('Error formatting price:', err);
      return `${currentCurrency.symbol}${priceInLKR}`;
    }
  }, [currentCurrency]);

  return { formatPrice, currentCurrency };
}
