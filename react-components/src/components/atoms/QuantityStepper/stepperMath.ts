export const COUNT_MIN = 1;
// Weighted products are held in whole grams so repeated taps can't drift into
// 0.4499999. 350g floor, 10kg ceiling, 50g a tap.
export const G_MIN = 350;
export const G_MAX = 10000;
export const G_STEP = 50;

export function clampGrams(g: number): number {
  if (Number.isNaN(g)) g = G_MIN;
  return Math.min(G_MAX, Math.max(G_MIN, g));
}

export function snapGrams(g: number): number {
  if (Number.isNaN(g)) g = G_MIN;
  return clampGrams(Math.round(g / G_STEP) * G_STEP);
}

// 0.35kg, 0.4kg, 1kg: trailing zeros trimmed, matching the Figma stepper.
export function formatKg(g: number): string {
  return (g / 1000).toFixed(2).replace(/\.?0+$/, '') + 'kg';
}
