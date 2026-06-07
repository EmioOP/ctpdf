'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const themes = {
  light: [
    { label: 'GitHub Light',     value: 'github-light' },
    { label: 'Min Light',        value: 'min-light' },
    { label: 'Solarized Light',  value: 'solarized-light' },
    { label: 'One Light',        value: 'one-light' },
    { label: 'Catppuccin Latte', value: 'catppuccin-latte' },
    { label: 'Rose Pine Dawn',   value: 'rose-pine-dawn' },
  ],
  dark: [
    { label: 'Dracula',          value: 'dracula' },
    { label: 'GitHub Dark',      value: 'github-dark' },
    { label: 'Monokai',          value: 'monokai' },
    { label: 'Nord',             value: 'nord' },
    { label: 'One Dark Pro',     value: 'one-dark-pro' },
    { label: 'Night Owl',        value: 'night-owl' },
  ]
};

const languages = [
  { label: 'C',          value: 'c',          ext: '.c'    },
  { label: 'C++',        value: 'cpp',        ext: '.cpp'  },
  { label: 'Python',     value: 'python',     ext: '.py'   },
  { label: 'JavaScript', value: 'javascript', ext: '.js'   },
  { label: 'TypeScript', value: 'typescript', ext: '.ts'   },
  { label: 'Java',       value: 'java',       ext: '.java' },
  { label: 'Go',         value: 'go',         ext: '.go'   },
  { label: 'Rust',       value: 'rust',       ext: '.rs'   },
  { label: 'Bash',       value: 'bash',       ext: '.sh'   },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [mode, setMode] = useState('paste');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('c');
  const [theme, setTheme] = useState('github-light');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const selectedLang = languages.find(l => l.value === language);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      let response;

      if (mode === 'paste') {
        if (!code.trim()) { setError('No code to render.'); setLoading(false); return; }

        response = await fetch(`${BACKEND_URL}/generate/paste`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code, language, theme, filename: `code${selectedLang ? selectedLang.ext : ''}` })
        });

      } else {
        if (!file) { setError('No file selected.'); setLoading(false); return; }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('theme', theme);

        response = await fetch(`${BACKEND_URL}/generate/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'PDF generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mode === 'upload' ? `${file.name}.pdf` : `code${selectedLang ? selectedLang.ext : ''}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0f',
      color: '#e8e6e1',
      fontFamily: '"Berkeley Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
    }}>

      {/* Navbar */}
      <nav style={{
        borderBottom: '1px solid #1e1e22',
        padding: '0 2rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: '#0d0d0f',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '22px', height: '22px',
            background: '#e2ff5d',
            borderRadius: '4px',
            display: 'inline-block',
            flexShrink: 0,
          }} />
          <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.04em', color: '#fff' }}>
            code<span style={{ color: '#e2ff5d' }}>to</span>pdf
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#555', letterSpacing: '0.02em' }}>
            {session?.user?.name}
          </span>
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="avatar"
              style={{ width: '26px', height: '26px', borderRadius: '50%', opacity: 0.85 }}
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              background: 'none',
              border: '1px solid #2a2a2e',
              color: '#666',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ff6b6b';
              e.currentTarget.style.borderColor = '#ff6b6b33';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.borderColor = '#2a2a2e';
            }}
          >
            sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '11px', color: '#e2ff5d', letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase' }}>
            render
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Code to PDF,<br />
            <span style={{ color: '#555' }}>beautifully.</span>
          </h1>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'inline-flex',
          border: '1px solid #1e1e22',
          borderRadius: '6px',
          marginBottom: '2rem',
          overflow: 'hidden',
        }}>
          {['paste', 'upload'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '7px 20px',
                fontSize: '12px',
                letterSpacing: '0.04em',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: mode === m ? '#e2ff5d' : 'transparent',
                color: mode === m ? '#0d0d0f' : '#666',
                fontFamily: 'inherit',
                fontWeight: mode === m ? 600 : 400,
              }}
            >
              {m === 'paste' ? '↳ paste' : '↑ upload'}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div style={{
          border: '1px solid #1e1e22',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#111113',
        }}>

          {/* Paste mode */}
          {mode === 'paste' && (
            <div>
              {/* Language tab strip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #1e1e22',
                overflowX: 'auto',
              }}>
                {languages.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setLanguage(l.value)}
                    style={{
                      padding: '10px 16px',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                      border: 'none',
                      borderBottom: language === l.value ? '2px solid #e2ff5d' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                      background: 'transparent',
                      color: language === l.value ? '#e2ff5d' : '#444',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Line numbers + textarea */}
              <div style={{ display: 'flex' }}>
                <div style={{
                  padding: '16px 0',
                  minWidth: '44px',
                  textAlign: 'right',
                  borderRight: '1px solid #1a1a1e',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  {(code || ' ').split('\n').map((_, i) => (
                    <div key={i} style={{
                      fontSize: '12px',
                      lineHeight: '1.7',
                      color: '#333',
                      paddingRight: '12px',
                    }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={`// paste your ${selectedLang ? selectedLang.label : 'code'} here`}
                  rows={18}
                  spellCheck={false}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    padding: '16px 20px',
                    fontSize: '13px',
                    lineHeight: '1.7',
                    color: '#c8c5bf',
                    fontFamily: 'inherit',
                    caretColor: '#e2ff5d',
                  }}
                />
              </div>
            </div>
          )}

          {/* Upload mode */}
          {mode === 'upload' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
              style={{
                padding: '64px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
                background: dragOver ? '#16161a' : 'transparent',
                borderBottom: '1px solid #1e1e22',
              }}
            >
              {file ? (
                <div>
                  <p style={{ fontSize: '13px', color: '#e2ff5d', margin: '0 0 6px', letterSpacing: '0.02em' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>
                    {(file.size / 1024).toFixed(1)} kb — click to replace
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>⌃</div>
                  <p style={{ fontSize: '13px', color: '#555', margin: '0 0 6px' }}>
                    drop a file or click to browse
                  </p>
                  <p style={{ fontSize: '11px', color: '#333', margin: 0, letterSpacing: '0.04em' }}>
                    .c .cpp .py .js .ts .java .go .rs .sh
                  </p>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                accept=".c,.h,.cpp,.py,.js,.ts,.java,.go,.rs,.rb,.php,.cs,.swift,.kt,.sh"
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* Bottom controls */}
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '160px' }}>
              <span style={{ fontSize: '11px', color: '#444', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                THEME
              </span>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                style={{
                  background: '#0d0d0f',
                  border: '1px solid #2a2a2e',
                  color: '#888',
                  fontSize: '12px',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  flex: 1,
                  outline: 'none',
                }}
              >
                <optgroup label="Light">
                  {themes.light.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </optgroup>
                <optgroup label="Dark">
                  {themes.dark.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </optgroup>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                padding: '9px 24px',
                background: loading ? '#2a2a1a' : '#e2ff5d',
                color: loading ? '#888' : '#0d0d0f',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.background = '#f0ff80';
              }}
              onMouseLeave={e => {
                if (!loading) e.currentTarget.style.background = '#e2ff5d';
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 0.8s linear infinite', width: '12px', height: '12px' }}
                    viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 60" />
                  </svg>
                  rendering…
                </>
              ) : (
                <>↓ export pdf</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '12px',
            padding: '10px 16px',
            background: '#1a0e0e',
            border: '1px solid #3a1a1a',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#ff6b6b',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
          }}>
            ✕ {error}
          </div>
        )}

      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::selection { background: #e2ff5d33; }
        textarea::placeholder { color: #2e2e32; }
        select option { background: #111113; }
        select optgroup { background: #111113; color: #666; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}