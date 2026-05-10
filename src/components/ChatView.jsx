import { useRef, useEffect, useCallback, useState } from 'react';
import Avatar from './Avatar';
import ChatMessage from './ChatMessage';
import { groupByDate } from '../utils/parser';
import { formatDateLabel } from '../utils/dateUtils';

const WA_GREEN   = '#008069';
const WA_CHAT_BG = '#ece5dd';

/* WhatsApp watermark SVG as data URL */
const CHAT_BG_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' opacity='0.07'%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='%23888' stroke-width='0.8'/%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='%23888' stroke-width='0.5'/%3E%3Cline x1='0' y1='40' x2='80' y2='40' stroke='%23888' stroke-width='0.3'/%3E%3Cline x1='40' y1='0' x2='40' y2='80' stroke='%23888' stroke-width='0.3'/%3E%3C/svg%3E")`;

export default function ChatView({ messages, senders, myName, chatTitle, dateFmt, onBack, onNewChat }) {
  const chatRef = useRef(null);
  const [showTopBtn,    setShowTopBtn]    = useState(false);
  const [showBottomBtn, setShowBottomBtn] = useState(false);

  const isGroupChat = senders.length > 2;
  const others      = senders.filter(s => s !== myName);
  const displayName = isGroupChat ? chatTitle : (others[0] || chatTitle);

  const groups   = groupByDate(messages);
  const dateKeys = Object.keys(groups);
  const msgCount = messages.filter(m => m.type === 'msg').length;

  /* Scroll to bottom on mount */
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, []);

  /* Show/hide nav buttons */
  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowTopBtn(scrollTop > 200);
    setShowBottomBtn(scrollTop < scrollHeight - clientHeight - 80);
  }, []);

  const scrollToTop    = () => chatRef.current?.scrollTo({ top: 0,                              behavior: 'smooth' });
  const scrollToBottom = () => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight,    behavior: 'smooth' });

  return (
    <div className="chat-view-page">
      {/* ── Toolbar above phone ── */}
      <div className="chat-toolbar">
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13.5, color: 'var(--text-secondary)', padding: 0,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          ← Back
        </button>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{msgCount.toLocaleString()}</strong> messages
          </span>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{dateKeys.length}</strong> days
          </span>
        </div>
        <button onClick={onNewChat} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13.5, color: WA_GREEN, padding: 0, fontWeight: 600,
        }}>
          New chat
        </button>
      </div>

      {/* ── Phone frame ── */}
      <div className="phone-frame fade-in" style={{
        background: '#1a1a1a', position: 'relative', userSelect: 'none',
      }}>
        {/* Physical side buttons */}
        {[{ l: -3, t: 110, h: 30 }, { l: -3, t: 150, h: 55 }, { l: -3, t: 215, h: 55 }].map((b, i) => (
          <div className="phone-side-button" key={i} style={{ position: 'absolute', left: b.l, top: b.t, width: 3, height: b.h, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
        ))}
        <div className="phone-side-button" style={{ position: 'absolute', right: -3, top: 165, width: 3, height: 72, background: '#2a2a2a', borderRadius: '0 2px 2px 0' }} />

        {/* Screen */}
        <div className="phone-screen" style={{ overflow: 'hidden', background: '#000', display: 'flex', flexDirection: 'column' }}>

          {/* Status bar */}
          <div style={{ background: WA_GREEN, padding: '13px 22px 5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>9:41</span>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {/* Signal bars */}
              <svg width="16" height="11" viewBox="0 0 16 11" fill="rgba(255,255,255,0.9)">
                <rect x="0"    y="7"   width="3"   height="4"   rx="0.5" />
                <rect x="4.5"  y="4.5" width="3"   height="6.5" rx="0.5" />
                <rect x="9"    y="2"   width="3"   height="9"   rx="0.5" />
                <rect x="13.5" y="0"   width="2.5" height="11"  rx="0.5" opacity="0.35" />
              </svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="white" />
                <path d="M4.5 6.5C5.8 5.2 6.8 4.5 8 4.5s2.2.7 3.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
                <path d="M1 3C3 1.2 5.4 0 8 0s5 1.2 7 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
              </svg>
              {/* Battery */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <div style={{ width: 23, height: 11, border: '1.5px solid rgba(255,255,255,0.75)', borderRadius: 3, padding: 1.5, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '80%', height: '100%', background: 'white', borderRadius: 1.5 }} />
                </div>
                <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.6)', borderRadius: '0 1px 1px 0' }} />
              </div>
            </div>
          </div>

          {/* WhatsApp header bar */}
          <div style={{ background: WA_GREEN, padding: '7px 10px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '4px 2px', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <Avatar name={displayName} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
                {isGroupChat ? `${senders.length} participants` : 'tap here for contact info'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {/* Phone icon */}
              <button style={{ background: 'none', border: 'none', padding: 7, cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </button>
              {/* More icon */}
              <button style={{ background: 'none', border: 'none', padding: 7, cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5"  r="1.5" fill="white" />
                  <circle cx="12" cy="12" r="1.5" fill="white" />
                  <circle cx="12" cy="19" r="1.5" fill="white" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Chat scroll area ── */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div
              ref={chatRef}
              onScroll={handleScroll}
              className="no-scrollbar"
              style={{
                height: '100%', overflowY: 'auto', overflowX: 'hidden',
                background: WA_CHAT_BG, backgroundImage: CHAT_BG_PATTERN,
                padding: '8px 0 4px', display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Encryption notice */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 12px 10px' }}>
                <div style={{
                  background: 'rgba(255,243,205,0.95)', borderRadius: 8, padding: '5px 10px',
                  textAlign: 'center', maxWidth: '85%', fontSize: 11.5, color: '#75603a', lineHeight: 1.55,
                }}>
                  🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                </div>
              </div>

              {/* Messages */}
              {dateKeys.map(dk => {
                const dayMsgs = groups[dk];
                return (
                  <div key={dk}>
                    {/* Date divider */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 8px' }}>
                      <span style={{
                        background: 'rgba(255,243,205,0.95)', color: '#75603a',
                        fontSize: 12, padding: '4px 12px', borderRadius: 8,
                        fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}>
                        {formatDateLabel(dk, dateFmt)}
                      </span>
                    </div>

                    {dayMsgs.map((msg, i) => {
                      const prev = dayMsgs[i - 1];
                      const sameSender = prev && prev.sender === msg.sender && prev.type === 'msg';

                      if (msg.type === 'sys') return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'center', margin: '4px 12px' }}>
                          <span style={{
                            background: 'rgba(255,243,205,0.92)', color: '#75603a',
                            fontSize: 11.5, padding: '4px 10px', borderRadius: 8,
                            textAlign: 'center', maxWidth: '85%', lineHeight: 1.45,
                          }}>
                            {msg.text}
                          </span>
                        </div>
                      );

                      return (
                        <div key={i} style={{ marginTop: sameSender ? 2 : 8, paddingLeft: 10, paddingRight: 10 }}>
                          <ChatMessage
                            msg={msg}
                            isMe={msg.sender === myName}
                            showSender={!sameSender}
                            isGroupChat={isGroupChat}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{ height: 6 }} />
            </div>

            {/* ── Navigation FABs ── */}
            {showTopBtn && (
              <button onClick={scrollToTop} title="Jump to first message" style={{
                position: 'absolute', bottom: showBottomBtn ? 56 : 12, right: 10, zIndex: 20,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.52)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                transition: 'bottom 0.2s',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            )}
            {showBottomBtn && (
              <button onClick={scrollToBottom} title="Jump to latest message" style={{
                position: 'absolute', bottom: 12, right: 10, zIndex: 20,
                width: 36, height: 36, borderRadius: '50%',
                background: WA_GREEN, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Decorative input bar ── */}
          <div style={{ background: '#f0f2f5', padding: '6px 8px', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 24, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, minHeight: 44 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.7">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              <span style={{ flex: 1, fontSize: 15, color: '#aaa' }}>Message</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.7">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: WA_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ background: '#f0f2f5', paddingBottom: 8, display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
            <div style={{ width: 128, height: 5, background: '#c8c8c8', borderRadius: 3 }} />
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
        Viewing as <strong style={{ color: 'var(--text-primary)' }}>{myName}</strong>
        &nbsp;·&nbsp;{msgCount.toLocaleString()} messages &nbsp;·&nbsp; {dateKeys.length} days
        &nbsp;·&nbsp; 🔒 Private — parsed in your browser
      </p>
    </div>
  );
}
