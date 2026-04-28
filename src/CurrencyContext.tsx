import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'INR' | 'GBP' | 'AED';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to USD
}

const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  INR: { code: 'INR', symbol: '₹', rate: 83.50 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceUSD: number) => string;
  allCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('aura_currency');
    return saved && CURRENCIES[saved as CurrencyCode] ? CURRENCIES[saved as CurrencyCode] : CURRENCIES.USD;
  });

  const setCurrency = (code: CurrencyCode) => {
    const newCurrency = CURRENCIES[code];
    setCurrencyState(newCurrency);
    localStorage.setItem('aura_currency', code);
  };

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * currency.rate;
    return `${currency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const allCurrencies = Object.values(CURRENCIES);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, allCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
