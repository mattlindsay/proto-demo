import styles from './ImagePlaceholder.module.css';

interface ImagePlaceholderProps {
  compact?: boolean;
  // Optional: renders a real image once product data exists. Without it the
  // atom stays a plain grey placeholder box, as in the prototype.
  src?: string;
  alt?: string;
  className?: string;
}

export default function ImagePlaceholder({ compact = false, src, alt = '', className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`${styles.box} ${compact ? styles.compact : ''} ${className}`}>
      {src && <img src={src} alt={alt} />}
    </div>
  );
}
