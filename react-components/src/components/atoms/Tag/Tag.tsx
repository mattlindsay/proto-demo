import type { ReactNode } from 'react';
import iconRewards from '../../../assets/icon-everyday-rewards.svg';
import styles from './Tag.module.css';

export type TagVariant = 'save' | 'online' | 'points';

interface TagProps {
  variant: TagVariant;
  compact?: boolean;
  children: ReactNode;
}

export default function Tag({ variant, compact = false, children }: TagProps) {
  const className = [
    styles.tag,
    variant === 'online' ? styles.online : '',
    variant === 'points' ? styles.points : '',
    compact ? styles.compact : '',
  ].filter(Boolean).join(' ');

  return (
    <span className={className}>
      {variant === 'points' && <img className={styles.icon} src={iconRewards} alt="" />}
      {children}
    </span>
  );
}
