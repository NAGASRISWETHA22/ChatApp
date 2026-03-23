import React, { useEffect, useRef, useState, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchMessages } from '../services/api';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    fetchMessages()
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load messages', err);
        setError('Could not load chat history. Is the backend running?');
        setLoading(false);
      });
  }, []);

  // Auto scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onMessageReceived = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { sendMessage, connected } = useWebSocket(onMessageReceived);

  // Group messages: show avatar only when sender changes
  const shouldShowAvatar = (index) => {
    if (index === 0) return true;
    return messages[index].senderName !== messages[index - 1].senderName;
  };

  // Group messages by date
  const getDateLabel = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const shouldShowDateDivider = (index) => {
    if (index === 0) return true;
    const prev = new Date(messages[index - 1].timestamp).toDateString();
    const curr = new Date(messages[index].timestamp).toDateString();
    return prev !== curr;
  };

  return (
    <div style={styles.shell}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerAvatar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={styles.headerInfo}>
            <span style={styles.headerTitle}>Group Chat</span>
            <span style={styles.headerSub}>
              <span
                style={{
                  ...styles.statusDot,
                  background: connected ? '#31a24c' : '#f0a500',
                  boxShadow: connected ? '0 0 0 2px #d0f0d8' : '0 0 0 2px #fff0cc',
                }}
              />
              {connected ? 'Connected · 5 members' : 'Connecting...'}
            </span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.memberPills}>
            {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
              <div
                key={l}
                style={{
                  ...styles.memberPill,
                  background: ['#b0ccf0','#8ee0b5','#f5b896','#d59ef5','#f0d878'][i],
                  marginLeft: i > 0 ? '-6px' : 0,
                  zIndex: 5 - i,
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div style={styles.messagesArea}>
        {loading && (
          <div style={styles.centerMsg}>
            <div style={styles.spinner} />
            <span>Loading messages...</span>
          </div>
        )}

        {error && !loading && (
          <div style={{ ...styles.centerMsg, color: '#e05252' }}>
            <span>⚠ {error}</span>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#c0b8f0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={styles.emptyTitle}>No messages yet</p>
            <p style={styles.emptySubtitle}>Pick a user from the dropdown below and say hello!</p>
          </div>
        )}

        {!loading &&
          messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              {shouldShowDateDivider(index) && (
                <div style={styles.dateDivider}>
                  <span style={styles.dateDividerText}>{getDateLabel(msg.timestamp)}</span>
                </div>
              )}
              <div style={{ marginTop: shouldShowAvatar(index) && index > 0 ? '10px' : '0' }}>
                <MessageBubble message={msg} showAvatar={shouldShowAvatar(index)} />
              </div>
            </React.Fragment>
          ))}

        <div ref={bottomRef} style={{ paddingBottom: '8px' }} />
      </div>

      {/* ── Input bar ── */}
      <MessageInput onSend={sendMessage} disabled={!connected} />
    </div>
  );
};

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#f4f4fb',
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: '860px',
    margin: '0 auto',
    boxShadow: '0 0 40px rgba(100, 100, 200, 0.10)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#ffffff',
    borderBottom: '1px solid #ebebf5',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a2e',
    letterSpacing: '-0.1px',
  },
  headerSub: {
    fontSize: '12px',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: '400',
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
    transition: 'background 0.3s',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  memberPills: {
    display: 'flex',
    alignItems: 'center',
  },
  memberPill: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#444',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  centerMsg: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#aaa',
    fontSize: '14px',
    marginTop: '60px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2.5px solid #e0dcf8',
    borderTopColor: '#9b8ef7',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '8px',
    paddingTop: '80px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#f0eeff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a4a7a',
  },
  emptySubtitle: {
    fontSize: '13px',
    color: '#aaa',
    textAlign: 'center',
    maxWidth: '220px',
    lineHeight: '1.6',
  },
  dateDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
  },
  dateDividerText: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#bbb',
    background: '#eeeef8',
    padding: '3px 12px',
    borderRadius: '20px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
};

export default ChatWindow;
