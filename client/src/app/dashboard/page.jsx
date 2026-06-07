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
  { label: 'C',          value: 'c' },
  { label: 'C++',        value: 'cpp' },
  { label: 'Python',     value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java',       value: 'java' },
  { label: 'Go',         value: 'go' },
  { label: 'Rust',       value: 'rust' },
  { label: 'Bash',       value: 'bash' },
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

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      let response;

      if (mode === 'paste') {
        if (!code.trim()) { setError('Please paste some code first'); return; }

        response = await fetch(`${BACKEND_URL}/generate/paste`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code, language, theme, filename: `code.${language}` })
        });

      } else {
        if (!file) { setError('Please select a file'); return; }

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

      // Download PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mode === 'upload' ? `${file.name}.pdf` : 'code.pdf';
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">CodeToPDF</h1>
          <div className="flex items-center gap-4">
            <img
              src={session?.user?.image}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6 bg-gray-200 p-1 rounded-xl w-fit">
          <button
            onClick={() => setMode('paste')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'paste'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Paste Code
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'upload'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload File
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          {/* Paste mode */}
          {mode === 'paste' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={16}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}

          {/* Upload mode */}
          {mode === 'upload' && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer mb-4"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="text-4xl mb-3">📁</div>
              <p className="text-gray-600 font-medium">
                {file ? file.name : 'Click to upload your code file'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                .c .cpp .py .js .ts .java .go .rs and more
              </p>
              <input
                id="fileInput"
                type="file"
                accept=".c,.h,.cpp,.py,.js,.ts,.java,.go,.rs,.rb,.php,.cs,.swift,.kt,.sh"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}

          {/* Theme selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="☀️ Light (PDF friendly)">
                {themes.light.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </optgroup>
              <optgroup label="🌙 Dark (Screen friendly)">
                {themes.dark.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating PDF...
              </span>
            ) : (
              '⬇ Generate PDF'
            )}
          </button>

        </div>
      </main>
    </div>
  );
}