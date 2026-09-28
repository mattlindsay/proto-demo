export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Caps every price at 7 figures ($9,999,999.99) so the tile never renders an
// 8-digit dollar amount. Unit price caps one cent lower so a Was price (always
// unit price + at least 1c) can still exist under the same ceiling.
export const MAX_PRICE = 9999999.99;
export const MAX_UNIT_PRICE = round2(MAX_PRICE - 0.01);

// toFixed rounds 1.575 down to 1.57 because the float behind it is a hair
// under. Weights land on half-cents often (0.35kg at $4.50), so the cents are
// rounded explicitly first. Thousands get comma separators (1,000.00).
export function money(n: number): string {
  const fixed = (Math.round(Number((n * 100).toPrecision(12))) / 100).toFixed(2);
  const [whole, cents] = fixed.split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${cents}`;
}

// A savings tile must always save at least 1c, so Was can never sit at or
// below the unit price.
export function minWasPrice(unitPrice: number): number {
  return round2(unitPrice + 0.01);
}

export const POINTS_MIN = 10;
export const POINTS_MAX = 100000;

export function clampPoints(v: number): number {
  if (Number.isNaN(v)) v = POINTS_MIN;
  return Math.min(POINTS_MAX, Math.max(POINTS_MIN, v));
}
