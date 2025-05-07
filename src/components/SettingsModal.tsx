import React from "react";
import "./SettingsModal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  sessionId,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear localStorage
      localStorage.clear();

      // Clear IndexedDB
      const databases = await window.indexedDB.databases();
      databases.forEach(db => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });

      // Reload the page to reset the application state
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <header>
            <h2>Settings</h2>

            {sessionId && (
              <div className="session-info">Session ID: {sessionId}</div>
            )}
          </header>
          <button className="close-button" onClick={onClose}>
            <svg
              fill="currentColor"
              strokeWidth="0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
            >
              <path
                fillRule="evenodd"
                d="m7.116 8-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="setting-item">
            <label htmlFor="darkMode">
              {isDarkMode ? "Dark mode" : "Light mode"}
            </label>
            <div className="toggle-switch" onClick={onToggleDarkMode}>
              <input
                type="checkbox"
                id="darkMode"
                checked={isDarkMode}
                onChange={onToggleDarkMode}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <button
              className="clear-data-button"
              onClick={handleClearData}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
