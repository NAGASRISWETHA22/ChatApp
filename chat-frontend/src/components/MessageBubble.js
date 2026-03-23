import React from 'react';

const USER_COLORS = [
  { bg: '#ddeeff', text: '#0a3d7a', border: '#b0ccf0', avatarBg: '#b0ccf0' },
  { bg: '#d6f5e8', text: '#0a5c30', border: '#8ee0b5', avatarBg: '#8ee0b5' },
  { bg: '#fde8d8', text: '#8a3010', border: '#f5b896', avatarBg: '#f5b896' },
  { bg: '#ecdeff', text: '#5a0a8a', border: '#d59ef5', avatarBg: '#d59ef5' },
  { bg: '#fff4cc', text: '#6b5200', border: '#f0d878', avatarBg: '#f0d878' },
  { bg: '#ffdcec', text: '#8a0a3a', border: '#f5a0c0', avatarBg: '#f5a0c0' },
  { bg: '#ddf5ff', text: '#0a5070', border: '#8ed8f5', avatarBg: '#8ed8f5' },
  { bg: '#fff0e0', text: '#7a3a00', border: '#f5c880', avatarBg: '#f5c880' },
];

function getColorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MessageBubble = ({ message, showAvatar }) => {
  const color = getColorForName(message.senderName);

  return (
    <div style={styles.wrapper}>
      {/* Avatar — always reserve the space so bubbles align */}
      <div style={{ width: 34, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
        {showAvatar && (
          <div
            style={{
              ...styles.avatar,
              background: color.avatarBg,
              color: color.text,
              border: `1.5px solid ${color.border}`,
            }}
          >
            {getInitials(message.senderName)}
          </div>
        )}
      </div>

      <div style={styles.content}>
        {showAvatar && (
          <span style={{ ...styles.senderName, color: color.text }}>
            {message.senderName}
          </span>
        )}
        <div
          style={{
            ...styles.bubble,
            background: color.bg,
            border: `1px solid ${color.border}`,
            borderRadius: showAvatar ? '18px 18px 18px 4px' : '18px',
          }}
        >
          <p style={styles.text}>{message.content}</p>
        </div>
        {showAvatar && (
          <span style={styles.time}>{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    marginBottom: '3px',
    padding: '0 12px',
    animation: 'fadeSlideIn 0.2s ease',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.5px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 'calc(100% - 60px)',
  },
  senderName: {
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '4px',
    marginLeft: '4px',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.2px',
  },
  bubble: {
    padding: '9px 14px',
    maxWidth: '100%',
    wordBreak: 'break-word',
  },
  text: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.55',
    color: '#1a1a2e',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '400',
  },
  time: {
    fontSize: '10px',
    color: '#aaa',
    marginTop: '4px',
    marginLeft: '4px',
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default MessageBubble;
