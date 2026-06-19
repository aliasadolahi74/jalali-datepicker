'use client';

import { cn } from '../utils/cn';
import styles from './JalaliDatePicker.module.css';

interface CalendarFooterProps {
  showToday: boolean;
  onToday: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CalendarFooter({
  showToday,
  onToday,
  onConfirm,
  onCancel,
}: CalendarFooterProps) {
  return (
    <div className={styles.footer}>
      {/* Under dir="rtl": امروز sits on the right; لغو + تأیید group on the left
          (لغو precedes تأیید in the DOM, so تأیید lands furthest left). */}
      {showToday && (
        <button
          type="button"
          className={cn(styles.button, styles.buttonGhost)}
          onClick={onToday}
        >
          امروز
        </button>
      )}
      <span className={styles.footerGrow} />
      <button
        type="button"
        className={cn(styles.button, styles.buttonGhost)}
        onClick={onCancel}
      >
        لغو
      </button>
      <button
        type="button"
        className={cn(styles.button, styles.buttonPrimary)}
        onClick={onConfirm}
      >
        تأیید
      </button>
    </div>
  );
}
