"use client"

export default function Home() {
  const features = [
    {
      tag: 'live',
      name: 'CodeToPDF',
      desc: 'Paste or upload source files. Export syntax-highlighted PDFs in any theme.',
      href: '/dashboard',
      ext: ['.c', '.py', '.ts', '.rs'],
      out: '.pdf',
    },
  ];

  const coming = [
    { name: '???',  desc: 'Something new is being figured out.' },
    { name: '???', desc: 'More tools are on the way.' },
    { name: '???',  desc: 'Stay tuned.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0f',
      color: '#e8e6e1',
      fontFamily: '"Berkeley Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
    }}>

      {/* Ambient */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #e2ff5d07 0%, transparent 70%)',
      }} />

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1e1e22',
        padding: '0 2rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky', top: 0,
        background: '#0d0d0f',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '22px', height: '22px', background: '#e2ff5d',
            borderRadius: '4px', display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.04em', color: '#fff' }}>
            code<span style={{ color: '#e2ff5d' }}>to</span>pdf
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 2rem 8rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '5rem' }}>
          <p style={{
            fontSize: '11px', color: '#e2ff5d',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            developer tools
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 54px)',
            fontWeight: 700, color: '#fff',
            lineHeight: 1.08, margin: '0 0 20px',
            letterSpacing: '-0.03em',
          }}>
            Beautiful exports<br />
            <span style={{ color: '#333' }}>for your code.</span>
          </h1>
          <p style={{
            fontSize: '14px', color: '#444',
            maxWidth: '440px', lineHeight: 1.7, margin: 0,
          }}>
            A growing suite of tools for turning developer artifacts into
            polished, shareable documents.
          </p>
        </div>

        {/* Live tools */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            fontSize: '10px', color: '#333',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            available now
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: '4rem' }}>
          {features.map(f => (
            <a
              key={f.name}
              href={f.href}
              style={{
                display: 'block',
                border: '1px solid #1e1e22',
                borderRadius: '10px',
                padding: '1.5rem',
                textDecoration: 'none',
                background: '#111113',
                transition: 'border-color 0.15s, background 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#e2ff5d33';
                e.currentTarget.style.background = '#141416';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e22';
                e.currentTarget.style.background = '#111113';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                      {f.name}
                    </span>
                    <span style={{
                      fontSize: '9px', fontWeight: 600,
                      color: '#0d0d0f', background: '#e2ff5d',
                      padding: '2px 7px', borderRadius: '3px',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      live
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', margin: '0 0 14px', lineHeight: 1.5 }}>
                    {f.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {f.ext.map(e => (
                      <span key={e} style={{
                        fontSize: '10px', color: '#333',
                        letterSpacing: '0.04em',
                      }}>{e}</span>
                    ))}
                    <span style={{ fontSize: '10px', color: '#2a2a2e' }}>→</span>
                    <span style={{ fontSize: '10px', color: '#e2ff5d99', letterSpacing: '0.04em' }}>{f.out}</span>
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: '#2a2a2e', flexShrink: 0, marginTop: '2px' }}>→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Coming soon */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            fontSize: '10px', color: '#2a2a2e',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            coming soon
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {coming.map((c, i) => (
            <div
              key={c.name}
              style={{
                border: '1px solid #161618',
                borderRadius: '10px',
                padding: '1.25rem 1.5rem',
                background: '#0d0d0f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: 1 - i * 0.15,
              }}
            >
              <div>
                <span style={{ fontSize: '13px', color: '#2e2e32', fontWeight: 600, letterSpacing: '-0.01em', display: 'block', marginBottom: '4px' }}>
                  {c.name}
                </span>
                <span style={{ fontSize: '12px', color: '#272727', lineHeight: 1.5 }}>
                  {c.desc}
                </span>
              </div>
              <span style={{
                fontSize: '9px', color: '#2a2a2e',
                border: '1px solid #1e1e22',
                padding: '3px 8px', borderRadius: '3px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                flexShrink: 0,
              }}>
                soon
              </span>
            </div>
          ))}
        </div>

      </main>

      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: #e2ff5d22; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}