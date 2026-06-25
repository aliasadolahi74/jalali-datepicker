import { INSTALL_CMD, NPM_URL, REPO_URL } from './links';
import { CopyButton } from './ui';

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

/** Title, tagline, and install command with a copy button. */
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
        Persian (Jalali) date picker for React
      </h1>
      <p
        style={{
          margin: '0 auto 24px',
          maxWidth: 580,
          fontSize: 17,
          color: 'var(--muted)',
        }}
      >
        A self-contained, RTL-first calendar — single &amp; range selection,
        injectable holidays, theming via CSS variables, and a headless hook for
        building your own UI.
      </p>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--ink)',
          color: '#fafaf9',
          padding: '8px 8px 8px 20px',
          borderRadius: 12,
          fontSize: 14,
        }}
      >
        <code style={{ background: 'transparent' }}>{INSTALL_CMD}</code>
        <CopyButton text={INSTALL_CMD} />
      </div>
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
      Built by{' '}
      <a href={REPO_URL} target="_blank" rel="noreferrer">
        Ali Asadollahi
      </a>{' '}
      — MIT licensed
    </footer>
  );
}
