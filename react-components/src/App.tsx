import { useState } from 'react';
import CartTile from './components/molecules/CartTile';
import styles from './App.module.css';

// Mixed count/weight so stepper width uniformity is visible at a glance.
const PRODUCTS = [
  { id: 'a', title: 'Fresh bananas, loose (each)', unitPrice: 2.9, mode: 'count' as const },
  { id: 'b', title: 'Free range chicken breast fillets, per kg', unitPrice: 14.5, mode: 'weight' as const, initialWeightKg: 0.35 },
  { id: 'c', title: 'Premium beef scotch fillet steak, per kg', unitPrice: 59.99, mode: 'weight' as const, initialWeightKg: 10 },
];

export default function App() {
  const [variant, setVariant] = useState<'tile' | 'compact'>('tile');
  const [hasSavings, setHasSavings] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [hasPoints, setHasPoints] = useState(false);
  const [width, setWidth] = useState(520);

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <div className={styles.segmented}>
          <button type="button" className={variant === 'tile' ? styles.active : ''} onClick={() => setVariant('tile')}>Tile</button>
          <button type="button" className={variant === 'compact' ? styles.active : ''} onClick={() => setVariant('compact')}>Compact</button>
        </div>
        <label><input type="checkbox" checked={hasSavings} onChange={(e) => setHasSavings(e.target.checked)} /> Savings</label>
        <label><input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} /> Online only</label>
        <label><input type="checkbox" checked={hasPoints} onChange={(e) => setHasPoints(e.target.checked)} /> Points</label>
        <label className={styles.slider}>
          Width {width}px
          <input type="range" min={280} max={960} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </label>
      </div>

      <div className={styles.list} style={{ width }}>
        {PRODUCTS.map((p) => (
          <CartTile
            key={p.id}
            variant={variant}
            title={p.title}
            unitPrice={p.unitPrice}
            mode={p.mode}
            initialWeightKg={p.initialWeightKg}
            hasSavings={hasSavings}
            wasUnitPrice={p.unitPrice + 1}
            onlineOnly={onlineOnly}
            hasPoints={hasPoints}
          />
        ))}
      </div>
    </div>
  );
}
