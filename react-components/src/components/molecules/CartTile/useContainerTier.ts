import { useEffect, useRef, useState } from 'react';

export interface ContainerTier {
  isNarrow: boolean;
  isRow: boolean;
  isTight: boolean;
}

// Compact adapts off the tile's own measured width, not the viewport, so it
// looks right in whatever container it is dropped into. bp1 is where the
// stepper+price drop to a full-width row (Narrow -> Stacked); bp2 is where the
// skeleton flips Stacked -> Row; bp3 is where Row goes from tight to loose.
export function useContainerTier(enabled: boolean, bp1: number, bp2: number, bp3: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<ContainerTier>({ isNarrow: false, isRow: false, isTight: false });

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const measure = () => {
      const width = el.getBoundingClientRect().width;
      const isNarrow = width < bp1;
      const isRow = width >= bp2;
      const isTight = isRow && width < bp3;
      setTier((prev) =>
        prev.isNarrow === isNarrow && prev.isRow === isRow && prev.isTight === isTight
          ? prev
          : { isNarrow, isRow, isTight }
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [enabled, bp1, bp2, bp3]);

  return [ref, tier] as const;
}
