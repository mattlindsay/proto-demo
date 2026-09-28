import { useState } from 'react';
import type { CartTileProps, StepperLayout } from '../../../types/cartTile';
import iconClose from '../../../assets/icon-close.svg';
import QuantityStepper, { COUNT_MIN, G_MIN, clampGrams, snapGrams } from '../../atoms/QuantityStepper';
import ImagePlaceholder from '../../atoms/ImagePlaceholder';
import Tag from '../../atoms/Tag';
import { MAX_PRICE, MAX_UNIT_PRICE, clampPoints, minWasPrice, money } from './money';
import { useContainerTier } from './useContainerTier';
import styles from './CartTile.module.css';

const DEFAULT_BREAKPOINTS = { bp1: 340, bp2: 500, bp3: 768 };

export default function CartTile({
  variant = 'tile',
  title,
  unitPrice,
  mode = 'count',
  initialWeightKg = 0.35,
  hasSavings = false,
  wasUnitPrice,
  onlineOnly = false,
  hasPoints = false,
  points = 10,
  breakpoints = DEFAULT_BREAKPOINTS,
  imageUrl,
  onRemove,
  onQuantityChange,
}: CartTileProps) {
  const compact = variant === 'compact';
  const weight = mode === 'weight';

  // Both amounts are kept so flipping mode restores each one's own starting
  // point instead of carrying a count across as a weight.
  const [qty, setQty] = useState(COUNT_MIN);
  const [grams, setGrams] = useState(() => (Number.isFinite(initialWeightKg) ? snapGrams(initialWeightKg * 1000) : G_MIN));

  const [tileRef, tier] = useContainerTier(compact, breakpoints.bp1, breakpoints.bp2, breakpoints.bp3);

  const layout: StepperLayout = !compact
    ? 'tile'
    : !tier.isRow
      ? 'compactStacked'
      : tier.isTight
        ? 'compactRowM'
        : 'compactRowL';

  function handleAmountChange(next: number) {
    const value = weight ? clampGrams(next) : Math.max(COUNT_MIN, next);
    if (weight) setGrams(value);
    else setQty(value);
    onQuantityChange?.(value);
  }

  // One factor drives every money figure: a count of items in count mode,
  // kilograms in weight mode. Weight can multiply the unit price up to 10x, so
  // each total carries its own cap on top of the capped unit price.
  const unit = Math.min(MAX_UNIT_PRICE, Math.max(0, unitPrice || 0));
  const factor = weight ? grams / 1000 : qty;
  const total = money(Math.min(MAX_PRICE, unit * factor));

  const wasUnit = Math.max(wasUnitPrice ?? unit + 1, minWasPrice(unit));
  const saveAmount = money(Math.min(MAX_PRICE, (wasUnit - unit) * factor));
  const wasTotal = money(Math.min(MAX_PRICE, wasUnit * factor));

  const showOnline = hasSavings && onlineOnly;
  const showTags = hasSavings || hasPoints;

  const narrow = compact && tier.isNarrow;

  const className = [
    styles.tile,
    compact ? styles.compact : '',
    narrow ? styles.narrow : '',
    compact && tier.isRow ? styles.row : '',
    compact && !tier.isNarrow && !tier.isRow ? styles.stacked : '',
    compact && tier.isRow && tier.isTight ? styles.tight : '',
    compact && tier.isRow && !tier.isTight ? styles.loose : '',
  ].filter(Boolean).join(' ');

  // At the Narrow tier the footer sits as a direct child of the tile so it can
  // span the full width below the image; otherwise it lives inside the info
  // column (indented under the description, or beside it in Row). Rendered in
  // one place at a time — this is the conditional-render equivalent of the
  // prototype's DOM move.
  const footer = (
    <div className={styles.footer}>
      <QuantityStepper
        mode={mode}
        value={weight ? grams : qty}
        layout={layout}
        onChange={handleAmountChange}
      />
      <div className={styles.priceBlock}>
        <div className={styles.price}>
          <span className={styles.symbol}>$</span>
          <span>{total}</span>
        </div>
        {hasSavings && (
          <div className={styles.was}>
            Was <span className={styles.wasAmount}>${wasTotal}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={tileRef} className={className}>
      <ImagePlaceholder compact={compact} src={imageUrl} className={styles.image} />
      <div className={styles.body}>
        <div className={styles.main}>
          {showTags && (
            <div className={styles.tags}>
              {hasSavings && <Tag variant="save" compact={compact}>Save ${saveAmount}</Tag>}
              {showOnline && <Tag variant="online" compact={compact}>Online only</Tag>}
              {hasPoints && (
                // Points are a per-product label, so they don't scale with qty.
                <Tag variant="points" compact={compact}>{clampPoints(points).toLocaleString('en-AU')} pts</Tag>
              )}
            </div>
          )}
          <div className={styles.title}>{title}</div>
        </div>
        {!narrow && footer}
      </div>
      {narrow && footer}
      <button type="button" className={styles.remove} aria-label="Remove item" onClick={onRemove}>
        <span className={styles.circle}>
          <img src={iconClose} alt="" />
        </span>
      </button>
    </div>
  );
}
