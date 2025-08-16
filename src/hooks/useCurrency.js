import { useState, useEffect } from "react";
import { getStoreCurrency, getCurrencySymbol } from "../Api";

export const useCurrency = () => {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    getStoreCurrency().then(setCurrency);
  }, []);

  return {
    currency, // e.g., "USD"
    symbol: getCurrencySymbol(currency), // e.g., "$"
  };
};