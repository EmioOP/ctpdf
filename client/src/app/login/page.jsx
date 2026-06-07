'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 1.5rem',
      fontFamily: '"Berkeley Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, #e2ff5d08 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo mark */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{
            width: '26px', height: '26px',
            background: '#e2ff5d',
            borderRadius: '5px',
            display: 'inline-block',
            flexShrink: 0,
          }} />
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.04em', color: '#fff' }}>
            code<span style={{ color: '#e2ff5d' }}>to</span>pdf
          </span>
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        border: '1px solid #1e1e22',
        borderRadius: '12px',
        background: '#111113',
        padding: '2.5rem 2rem',
        textAlign: 'center',
      }}>

        <p style={{
          fontSize: 'clamp(20px, 4vw, 26px)',
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 8px',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}>
          Render your code.
        </p>
        <p style={{
          fontSize: '13px',
          color: '#444',
          margin: '0 0 2rem',
          lineHeight: 1.5,
        }}>
          Sign in to start exporting beautiful PDFs.
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1a1a1e', marginBottom: '2rem' }} />

        {/* Google button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid #2a2a2e',
            borderRadius: '7px',
            color: '#aaa',
            fontSize: '13px',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#e2ff5d44';
            e.currentTarget.style.color = '#e2ff5d';
            e.currentTarget.style.background = '#e2ff5d08';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2a2a2e';
            e.currentTarget.style.color = '#aaa';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{
          fontSize: '11px',
          color: '#2e2e32',
          marginTop: '1.5rem',
          lineHeight: 1.6,
        }}>
          By signing in, you agree to our Terms of Service.
        </p>
      </div>

      {/* Bottom decoration */}
      <div style={{
        marginTop: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        {['c', 'py', 'ts', 'rs', 'go'].map((ext, i) => (
          <span key={ext} style={{
            fontSize: '10px',
            color: i === 2 ? '#e2ff5d44' : '#1e1e22',
            letterSpacing: '0.06em',
          }}>
            .{ext}
          </span>
        ))}
        <span style={{ fontSize: '10px', color: '#1e1e22', letterSpacing: '0.06em' }}>→</span>
        <span style={{ fontSize: '10px', color: '#e2ff5d44', letterSpacing: '0.06em' }}>.pdf</span>
      </div>

    </div>
  );
}