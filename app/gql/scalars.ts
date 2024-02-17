export type PriceData = {
  amount: number,
  format: number,
  currencyCode: string,
  currencyName: string,
};

export type DiscountData = {
  min_prices: { eur: number | null, usd: number | null },
  percentage: string,
  fixed_value: boolean,
  fixed_values: { eur: number | null, usd: number | null }
}

export type AttributeData<T> = {
  [K in keyof T]:
    T[K] extends "material" ? MaterialAttributeData :
    T[K] extends "color" ?  ColorAttributeData:
    never;
}

export type MaterialAttributeData = { "en": string };
export type ColorAttributeData = { "label": string, "value": string };
export type Rating = 1 | 2 | 3 | 4 | 5;
