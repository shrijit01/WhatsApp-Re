import { avatarColor } from './Avatar';

const MY_BUBBLE    = '#dcf8c6';
const OTHER_BUBBLE = '#ffffff';

/* ── Render text with clickable links ───────────────────────── */
function renderTextWithLinks(rawText) {
  const URL_RE = /(https?:\/\/[^\s]+)/g;
  const parts  = rawText.split(URL_RE);
  // reset lastIndex between uses
  return parts.map((part, i) =>
    /^https?:\/\//.test(part)
      ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ color: '#0a8cde', textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {part}
        </a>
      )
      : part
  );
}

/* ── Media placeholder icon ─────────────────────────────────── */
function MediaIcon({ text }) {
  if (/video/i.test(text))    return <span>🎥 Video omitted</span>;
  if (/audio/i.test(text))    return <span>🎵 Audio omitted</span>;
  if (/sticker/i.test(text))  return <span>🎭 Sticker omitted</span>;
  if (/document/i.test(text)) return <span>📄 Document omitted</span>;
  if (/gif/i.test(text))      return <span>🎞️ GIF omitted</span>;
  return <span>📷 Image omitted</span>;
}

/* ── Blue double-tick ────────────────────────────────────────── */
function DoubleTickIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1 5.5l3 3L11 1"  stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M6 5.5l3 3 7-7"   stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── Main bubble ─────────────────────────────────────────────── */
export default function ChatMessage({ msg, isMe, showSender, isGroupChat }) {
  const isMedia   = /omitted/i.test(msg.text);
  const isDeleted = /this message was deleted|you deleted this message/i.test(msg.text);
  const bg        = isMe ? MY_BUBBLE : OTHER_BUBBLE;

  return (
    <div style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      paddingLeft:  isMe ? 60 : 8,
      paddingRight: isMe ? 8  : 60,
    }}>
      <div style={{
        background:   bg,
        borderRadius: isMe ? '10px 2px 10px 10px' : '2px 10px 10px 10px',
        padding:      '5px 8px 4px',
        boxShadow:    '0 1px 1px rgba(0,0,0,0.1)',
        maxWidth:     '100%',
        minWidth:     70,
        position:     'relative',
      }}>
        {/* Tail */}
        <div style={{
          position:    'absolute',
          top:         0,
          [isMe ? 'right' : 'left']: -7,
          width:       0,
          height:      0,
          borderStyle: 'solid',
          borderWidth: isMe ? '0 0 8px 8px' : '0 8px 8px 0',
          borderColor: isMe
            ? `transparent transparent transparent ${bg}`
            : `transparent ${bg} transparent transparent`,
        }} />

        {/* Group sender name */}
        {showSender && isGroupChat && (
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2, color: avatarColor(msg.sender) }}>
            {msg.sender}
          </div>
        )}

        {/* Body */}
        {isDeleted ? (
          <div style={{ fontSize: 13.5, color: '#aaa', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
            🚫 <span>{msg.text}</span>
          </div>
        ) : isMedia ? (
          <div style={{ fontSize: 13.5, color: '#888', fontStyle: 'italic' }}>
            <MediaIcon text={msg.text} />
          </div>
        ) : (
          <div style={{ fontSize: 14, color: '#111', lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word', userSelect: 'text' }}>
            {renderTextWithLinks(msg.text)}
          </div>
        )}

        {/* Footer: Edited · time · ticks */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, marginTop: 2 }}>
          {msg.edited && (
            <span style={{ fontSize: 11, color: '#999', fontStyle: 'italic', marginRight: 1 }}>Edited</span>
          )}
          <span style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap' }}>{msg.time}</span>
          {isMe && <DoubleTickIcon />}
        </div>
      </div>
    </div>
  );
}
