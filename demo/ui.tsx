import { useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Reusable presentational primitives for the showcase. Plain inline styles —
 * the demo intentionally ships no styling dependency of its own.
 */

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: '#f0eeec',
        borderRadius: 10,
        padding: 3,
        gap: 3,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '7px 16px',
              borderRadius: 8,
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? '#1c1917' : '#78716c',
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
              transition: 'all .15s',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          background: checked ? 'var(--accent)' : '#d6d3d1',
          transition: 'background .15s',
          position: 'relative',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
            transition: 'transform .15s',
            boxShadow: '0 1px 2px rgba(0,0,0,.2)',
          }}
        />
      </button>
    </label>
  );
}

/** Copies `text` to the clipboard and briefly confirms. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. non-secure context) — fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy to clipboard"
      style={{
        border: 'none',
        cursor: 'pointer',
        background: copied ? 'var(--accent)' : 'rgba(255,255,255,.14)',
        color: copied ? '#1c1917' : '#fafaf9',
        borderRadius: 8,
        padding: '4px 12px',
        fontSize: 13,
        fontWeight: 500,
        transition: 'all .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export function Panel({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 1px 2px rgba(0,0,0,.03)',
        ...style,
      }}
    >
      {title && (
        <h2
          style={{
            margin: '0 0 18px',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--ink)',
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function OutputRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 0',
        borderTop: '1px solid var(--line)',
      }}
    >
      <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
      <code style={{ fontSize: 13.5, color: 'var(--ink)' }}>{value}</code>
    </div>
  );
}
