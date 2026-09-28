import type { StepperLayout } from '../../../types/cartTile';

// Figma "Stepper" (node 4982:2280): min 136px, max 280px for the default tile.
export const STEPPER_MIN = 136;
export const STEPPER_MAX = 280;

// One fixed width per layout, so every tile in a list has an identical stepper
// whether it shows a count ("1") or a weight ("0.35kg"). Tune values here only.
// Starting values: tile/compactStacked = Figma min, compactRowL = the 768w Figma
// frame. compactRowM is 104, not the 500w frame's 96: that frame used 23px
// buttons but ours are 28px, and at 96 "0.35kg" overflowed its 40px input.
// To be confirmed against the designer's exact numbers.
export const STEPPER_WIDTH: Record<StepperLayout, number> = {
  tile: 136,
  compactStacked: 136,
  compactRowM: 104,
  compactRowL: 152,
};

export function resolveStepperWidth(layout: StepperLayout): number {
  const width = STEPPER_WIDTH[layout];
  if (layout === 'tile' && (width < STEPPER_MIN || width > STEPPER_MAX)) {
    if (import.meta.env.DEV) {
      console.warn(`STEPPER_WIDTH.tile (${width}px) is outside the Figma ${STEPPER_MIN}-${STEPPER_MAX}px bounds; clamping.`);
    }
    return Math.min(STEPPER_MAX, Math.max(STEPPER_MIN, width));
  }
  return width;
}
