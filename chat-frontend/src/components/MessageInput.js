import React, { useState } from 'react';

const USERS = ['Alice', 'Bob', 'Carol', 'David', 'Eva'];

const MessageInput = ({ onSend, disabled }) => {
  const [selectedUser, setSelectedUser] = useState(USERS[0]);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(selectedUser, text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      {/* User selector */}
      <div style={styles.selectWrapper}>
        <svg style={styles.userIcon} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="#7c6ee6" strokeWidth="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7c6ee6" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={styles.select}
        >
          {USERS.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <svg style={styles.chevron} viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="#9b8ef7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text input */}
      <input
        type="text"
        placeholder={`Message as ${selectedUser}...`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(disabled ? styles.inputDisabled : {}),
        }}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        style={styles.sendBtn}
        title="Send message"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid #ebebf5',
    background: '#ffffff',
    flexShrink: 0,
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  userIcon: {
    position: 'absolute',
    left: '9px',
    width: '14px',
    height: '14px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  select: {
    paddingLeft: '28px',
    paddingRight: '28px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '22px',
    border: '1.5px solid #e0dcf8',
    background: '#f5f3ff',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
    color: '#4a3fa0',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    minWidth: '110px',
  },
  chevron: {
    position: 'absolute',
    right: '9px',
    width: '14px',
    height: '14px',
    pointerEvents: 'none',
  },
  input: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '22px',
    border: '1.5px solid #e8e8f2',
    background: '#f8f8fc',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    color: '#1a1a2e',
    minWidth: 0,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputDisabled: {
    background: '#f0f0f5',
    color: '#aaa',
  },
  sendBtn: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s, transform 0.15s',
  },
};

export default MessageInput;
