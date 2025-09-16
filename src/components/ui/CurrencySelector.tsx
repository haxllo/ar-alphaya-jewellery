'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Currency, SUPPORTED_CURRENCIES, CurrencyService } from '@/lib/currency';

// Map currency code to ISO country code for flagcdn
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  LKR: 'lk',
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  INR: 'in',
  AUD: 'au',
  CAD: 'ca',
  JPY: 'jp',
  SGD: 'sg',
};

function getFlagUrl(currencyCode: string, size: 16 | 24 = 16): string | null {
  const country = CURRENCY_TO_COUNTRY[currencyCode];
  if (!country) return null;
  // Use flagcdn PNGs (fast and widely cached)
  const height = size; // 16 or 24 high; width is auto based on aspect ratio
  return `https://flagcdn.com/${height}x${Math.round((height * 4) / 3)}/${country}.png`;
}

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export default function CurrencySelector({ 
  className = '',
  showLabel = true,
  compact = false
}: CurrencySelectorProps) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load current currency from localStorage
    const currency = CurrencyService.getCurrentCurrency();
    setCurrentCurrency(currency);

    // Load cached exchange rates or update them
    const hasCachedRates = CurrencyService.loadCachedRates();
    if (!hasCachedRates) {
      updateRates();
    }
  }, []);

  const updateRates = async () => {
    setIsLoading(true);
    try {
      await CurrencyService.updateExchangeRates();
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentCurrency(currency);
    CurrencyService.setCurrentCurrency(currency);
    setIsOpen(false);

    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { currency } 
      }));
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-currency-selector]')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (compact) {
    return (
      <div className={`relative ${className}`} data-currency-selector>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
        >
          <span className="inline-flex items-center justify-center w-5 h-5">
            {getFlagUrl(currentCurrency.code, 24) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getFlagUrl(currentCurrency.code, 24) as string}
                alt={currentCurrency.code}
                className="h-5 w-auto rounded-sm"
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xs font-medium">{currentCurrency.code}</span>
            )}
          </span>
          <span className="font-medium">{currentCurrency.code}</span>
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="py-1">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    currentCurrency.code === currency.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    {getFlagUrl(currency.code, 24) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getFlagUrl(currency.code, 24) as string}
                        alt={currency.code}
                        className="h-5 w-auto rounded-sm"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-medium">{currency.code}</span>
                    )}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-gray-500">{currency.name}</div>
                  </div>
                  <span className="text-xs text-gray-400">{currency.symbol}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 px-3 py-2">
              <button
                onClick={updateRates}
                disabled={isLoading}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <GlobeAltIcon className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Updating rates...' : 'Update rates'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} data-currency-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
      >
        <GlobeAltIcon className="h-4 w-4 text-gray-500" />
        {showLabel && <span className="text-sm text-gray-700">Currency:</span>}
        <span className="inline-flex items-center justify-center w-5 h-5">
          {getFlagUrl(currentCurrency.code, 16) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getFlagUrl(currentCurrency.code, 16) as string}
              alt={currentCurrency.code}
              className="h-4 w-auto rounded-sm"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-xs font-medium">{currentCurrency.code}</span>
          )}
        </span>
        <span className="font-medium">{currentCurrency.code}</span>
        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Select Currency</h3>
              <p className="text-xs text-gray-500 mt-1">Prices will be converted automatically</p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                    currentCurrency.code === currency.code 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    {getFlagUrl(currency.code, 24) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getFlagUrl(currency.code, 24) as string}
                        alt={currency.code}
                        className="h-5 w-auto rounded-sm"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-medium">{currency.code}</span>
                    )}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-xs text-gray-500">{currency.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{currency.symbol}</div>
                    {currentCurrency.code === currency.code && (
                      <div className="text-xs text-blue-600">Current</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 px-4 py-3">
              <button
                onClick={updateRates}
                disabled={isLoading}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
              >
                <GlobeAltIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Updating exchange rates...' : 'Update exchange rates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
