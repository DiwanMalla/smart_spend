export interface Currency {
  value: string; // Unique code for the currency
  label: string; // Human-readable label (Name + Symbol)
  locale: string; // Common locale for formatting
  code: string; // Currency code
  name: string; // Currency name
  symbol: string; // Currency symbol
}

export const Currencies: Currency[] = [
  {
    value: "USD",
    label: "United States Dollar ($)",
    locale: "en-US",
    code: "USD",
    name: "United States Dollar",
    symbol: "$",
  },
  {
    value: "EUR",
    label: "Euro (€)",
    locale: "de-DE",
    code: "EUR",
    name: "Euro",
    symbol: "€",
  },
  {
    value: "GBP",
    label: "British Pound Sterling (£)",
    locale: "en-GB",
    code: "GBP",
    name: "British Pound Sterling",
    symbol: "£",
  },
  {
    value: "JPY",
    label: "Japanese Yen (¥)",
    locale: "ja-JP",
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
  },
  {
    value: "AUD",
    label: "Australian Dollar (A$)",
    locale: "en-AU",
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
  },
  {
    value: "CAD",
    label: "Canadian Dollar (C$)",
    locale: "en-CA",
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
  },
  {
    value: "CHF",
    label: "Swiss Franc (CHF)",
    locale: "de-CH",
    code: "CHF",
    name: "Swiss Franc",
    symbol: "CHF",
  },
  {
    value: "CNY",
    label: "Chinese Yuan (¥)",
    locale: "zh-CN",
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
  },
  {
    value: "SEK",
    label: "Swedish Krona (kr)",
    locale: "sv-SE",
    code: "SEK",
    name: "Swedish Krona",
    symbol: "kr",
  },
  {
    value: "NZD",
    label: "New Zealand Dollar (NZ$)",
    locale: "en-NZ",
    code: "NZD",
    name: "New Zealand Dollar",
    symbol: "NZ$",
  },
  {
    value: "MXN",
    label: "Mexican Peso ($)",
    locale: "es-MX",
    code: "MXN",
    name: "Mexican Peso",
    symbol: "$",
  },
  {
    value: "SGD",
    label: "Singapore Dollar (S$)",
    locale: "en-SG",
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
  },
  {
    value: "HKD",
    label: "Hong Kong Dollar (HK$)",
    locale: "zh-HK",
    code: "HKD",
    name: "Hong Kong Dollar",
    symbol: "HK$",
  },
  {
    value: "NOK",
    label: "Norwegian Krone (kr)",
    locale: "nb-NO",
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
  },
  {
    value: "KRW",
    label: "South Korean Won (₩)",
    locale: "ko-KR",
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
  },
  {
    value: "TRY",
    label: "Turkish Lira (₺)",
    locale: "tr-TR",
    code: "TRY",
    name: "Turkish Lira",
    symbol: "₺",
  },
  {
    value: "INR",
    label: "Indian Rupee (₹)",
    locale: "hi-IN",
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
  },
  {
    value: "RUB",
    label: "Russian Ruble (₽)",
    locale: "ru-RU",
    code: "RUB",
    name: "Russian Ruble",
    symbol: "₽",
  },
  {
    value: "ZAR",
    label: "South African Rand (R)",
    locale: "en-ZA",
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
  },
  {
    value: "BRL",
    label: "Brazilian Real (R$)",
    locale: "pt-BR",
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
  },
  {
    value: "THB",
    label: "Thai Baht (฿)",
    locale: "th-TH",
    code: "THB",
    name: "Thai Baht",
    symbol: "฿",
  },
  {
    value: "AED",
    label: "United Arab Emirates Dirham (د.إ)",
    locale: "ar-AE",
    code: "AED",
    name: "United Arab Emirates Dirham",
    symbol: "د.إ",
  },
  {
    value: "SAR",
    label: "Saudi Riyal (﷼)",
    locale: "ar-SA",
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼",
  },
  {
    value: "MYR",
    label: "Malaysian Ringgit (RM)",
    locale: "ms-MY",
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
  },
  {
    value: "IDR",
    label: "Indonesian Rupiah (Rp)",
    locale: "id-ID",
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
  },
];

export default Currencies;
