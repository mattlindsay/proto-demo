import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { StepperLayout, StepperMode } from '../../../types/cartTile';
import iconMinus from '../../../assets/icon-minus.svg';
import iconPlus from '../../../assets/icon-plus.svg';
import { resolveStepperWidth } from './stepperWidths';
import { COUNT_MIN, G_MAX, G_MIN, G_STEP, clampGrams, formatKg, snapGrams } from './stepperMath';
import styles from './QuantityStepper.module.css';

interface QuantityStepperProps {
  mode: StepperMode;
  // Item count in 'count' mode, whole grams in 'weight' mode.
  value: number;
  layout: StepperLayout;
  onChange: (value: number) => void;
}

export default function QuantityStepper({ mode, value, layout, onChange }: QuantityStepperProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const weight = mode === 'weight';
  const step = weight ? G_STEP : 1;
  const atMin = weight ? value <= G_MIN : value <= COUNT_MIN;
  const atMax = weight && value >= G_MAX;
  const display = draft ?? (weight ? formatKg(value) : String(value));

  function commit(next: number) {
    onChange(weight ? clampGrams(next) : Math.max(COUNT_MIN, next));
  }

  // Typing is committed on blur/Enter, not per keystroke, so it isn't fought
  // mid-edit. parseFloat reads "0.62kg" as 0.62, so the unit needn't be deleted.
  function commitDraft() {
    if (draft === null) return;
    setDraft(null);
    commit(weight ? snapGrams(parseFloat(draft) * 1000) : parseInt(draft, 10) || COUNT_MIN);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur();
  }

  const compact = layout !== 'tile';

  return (
    <div
      className={`${styles.stepper} ${compact ? styles.compact : ''}`}
      style={{ width: resolveStepperWidth(layout) }}
      data-testid="quantity-stepper"
    >
      <button
        type="button"
        className={styles.minus}
        aria-label="Decrease quantity"
        disabled={atMin}
        onClick={() => commit(value - step)}
      >
        <img src={iconMinus} alt="" />
      </button>
      <input
        type="text"
        inputMode={weight ? 'decimal' : 'numeric'}
        aria-label={weight ? 'Weight in kilograms' : 'Quantity'}
        value={display}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className={styles.plus}
        aria-label="Increase quantity"
        disabled={atMax}
        onClick={() => commit(value + step)}
      >
        <img src={iconPlus} alt="" />
      </button>
    </div>
  );
}
