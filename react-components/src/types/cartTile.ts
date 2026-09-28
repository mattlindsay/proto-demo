export type StepperMode = 'count' | 'weight';

// One entry per layout the stepper can sit in. Each has a single fixed width
// (see stepperWidths.ts) so steppers match across every tile in a list.
export type StepperLayout = 'tile' | 'compactStacked' | 'compactRowM' | 'compactRowL';

export interface CartTileProps {
  variant?: 'tile' | 'compact';
  title: string;
  unitPrice: number;
  mode?: StepperMode;
  initialWeightKg?: number;
  hasSavings?: boolean;
  wasUnitPrice?: number;
  onlineOnly?: boolean;
  hasPoints?: boolean;
  points?: number;
  // bp1: Narrow -> Stacked (footer breaks to a full-width row below it).
  // bp2: Stacked -> Row. bp3: Row tight -> loose.
  breakpoints?: { bp1: number; bp2: number; bp3: number };
  imageUrl?: string;
  onRemove?: () => void;
  onQuantityChange?: (value: number) => void;
}

// Contract the (not yet built) ProductList / CategoryContainer organisms will use.
export interface Product extends Omit<CartTileProps, 'onRemove' | 'onQuantityChange'> {
  id: string;
}
