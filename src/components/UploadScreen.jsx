import { useRef, useState, useCallback } from 'react';

const WA_GREEN = '#008069';

const STEPS = [
  'Open any chat or group in WhatsApp',
  'Tap ⋮ (Android) or contact name (iOS) → Export Chat',
  'Choose "Without Media"',
  'Share / save the .txt file, then upload here',
];

export default function UploadScreen({ onFile }) {
  const [isDrag, setIsDrag] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setIsDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
      background: 'var(--bg-page)',
    }}>
      <div className="fade-in" style={{
        width: '100%', maxWidth: 460,
        background: 'var(--bg-card)', borderRadius: 'var(--radius-card)',
        padding: '2.5rem', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: WA_GREEN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 24 24" width="44" height="44" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            WhatsApp Chat Viewer
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Upload your exported chat and relive it in an authentic WhatsApp mobile UI.
            <br />
            <strong style={{ color: 'var(--text-primary)' }}>100% private — nothing leaves your browser.</strong>
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', border: `2px dashed ${isDrag ? WA_GREEN : 'var(--border-mid)'}`,
            borderRadius: 14, padding: '2rem 1.5rem', textAlign: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
            background: isDrag ? 'rgba(0,128,105,0.04)' : 'var(--bg-page)',
          }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
            stroke={isDrag ? WA_GREEN : '#aaa'} strokeWidth="1.5"
            style={{ display: 'block', margin: '0 auto 10px', transition: 'stroke 0.2s' }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
          </svg>
          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            {isDrag ? 'Drop it here!' : 'Drop your exported chat file here'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            or <span style={{ color: WA_GREEN, fontWeight: 600 }}>click to browse</span>
            &nbsp;· .txt file accepted
          </p>
        </div>
        <input
          ref={fileRef} type="file" accept=".txt,.zip"
          style={{ display: 'none' }}
          onChange={e => e.target.files[0] && onFile(e.target.files[0])}
        />

        {/* How-to */}
        <div style={{
          width: '100%', background: 'var(--bg-page)',
          border: '1px solid var(--border-light)', borderRadius: 14, padding: '1.1rem 1.25rem',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
            📱 How to export from WhatsApp
          </p>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < STEPS.length - 1 ? 8 : 0 }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', background: WA_GREEN, color: '#fff',
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          🔒 Your chat is parsed entirely in your browser. No data is uploaded to any server.
        </p>
      </div>
    </div>
  );
}
