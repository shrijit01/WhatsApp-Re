import Avatar from './Avatar';

const WA_GREEN = '#008069';

export default function SelectScreen({ messages, senders, onSelect, onBack }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
      background: 'var(--bg-page)',
    }}>
      <div className="fade-in" style={{
        width: '100%', maxWidth: 400,
        background: 'var(--bg-card)', borderRadius: 'var(--radius-card)',
        padding: '2rem', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: WA_GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            Who are you in this chat?
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
            Your messages will appear on the right in green
          </p>
        </div>

        {/* Sender list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1rem' }}>
          {senders.map(s => (
            <button
              key={s}
              onClick={() => onSelect(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'var(--bg-page)', border: '1px solid var(--border-light)',
                borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.15s', fontSize: 15, color: 'var(--text-primary)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = WA_GREEN}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              <Avatar name={s} size={42} />
              <div>
                <div style={{ fontWeight: 600 }}>{s}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {messages.filter(m => m.sender === s).length.toLocaleString()} messages
                </div>
              </div>
              <div style={{ marginLeft: 'auto', color: WA_GREEN }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <button onClick={onBack} style={{
          width: '100%', padding: 10, background: 'transparent',
          border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
          fontSize: 13.5, borderRadius: 8,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ← Upload a different file
        </button>
      </div>
    </div>
  );
}
