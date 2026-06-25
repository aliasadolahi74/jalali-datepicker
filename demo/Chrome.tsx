import { INSTALL_CMD, NPM_URL, REPO_URL } from './links';

/** Top navigation bar. */
export function Header() {
  const linkStyle = {
    textDecoration: 'none',
    fontSize: 14,
    padding: '8px 16px',
    borderRadius: 10,
    border: '1px solid var(--line)',
    background: '#fff',
  } as const;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '20px 0',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>📅</span>
        <strong style={{ fontSize: 18 }}>jalali-datepicker</strong>
      </div>
      <nav style={{ display: 'flex', gap: 10 }}>
        <a href={REPO_URL} target="_blank" rel="noreferrer" style={linkStyle}>
          GitHub
        </a>
        <a href={NPM_URL} target="_blank" rel="noreferrer" style={linkStyle}>
          npm
        </a>
      </nav>
    </header>
  );
}

/** Title, tagline, and install command. */
export function Hero() {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0 40px' }}>
      <h1
        style={{
          margin: '0 0 14px',
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        تقویم شمسی برای React
      </h1>
      <p
        style={{
          margin: '0 auto 24px',
          maxWidth: 560,
          fontSize: 17,
          color: 'var(--muted)',
        }}
      >
        یک دیت‌پیکر جلالی راست‌چین، خودبسنده و تم‌پذیر — انتخاب تکی و بازه‌ای،
        تعطیلات قابل‌تزریق، و یک هوک headless برای ساختن رابط دلخواه.
      </p>
      <code
        style={{
          display: 'inline-block',
          background: 'var(--ink)',
          color: '#fafaf9',
          padding: '12px 22px',
          borderRadius: 12,
          fontSize: 14,
        }}
      >
        {INSTALL_CMD}
      </code>
    </div>
  );
}

/** Page footer. */
export function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '48px 0 32px',
        marginTop: 24,
        borderTop: '1px solid var(--line)',
        color: 'var(--muted)',
        fontSize: 13.5,
      }}
    >
      ساخته‌شده با ❤ توسط{' '}
      <a href={REPO_URL} target="_blank" rel="noreferrer">
        Ali Asadollahi
      </a>{' '}
      — تحت مجوز MIT
    </footer>
  );
}
