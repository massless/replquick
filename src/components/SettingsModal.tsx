import React, { useState, useEffect } from "react";
import "./SettingsModal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  history: any[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  sessionId,
  onToggleDarkMode,
  history,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Achievement badge logic
  const evalCount = history.length;
  let badge = null;
  let badgeLabel = "";
  if (evalCount >= 20) {
    badge = "🥇";
    badgeLabel = "Gold";
  } else if (evalCount >= 5) {
    badge = "🥈";
    badgeLabel = "Silver";
  } else if (evalCount >= 2) {
    badge = "🥉";
    badgeLabel = "Bronze";
  }

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClearData = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      // Clear localStorage
      localStorage.clear();

      // Clear IndexedDB
      const databases = await window.indexedDB.databases();
      databases.forEach((db) => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });

      // Reload the page to reset the application state
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <header>
            <h2>Settings</h2>
            <div className="settings-meta">
              {sessionId && (
                <div className="session-info" title={sessionId}>
                  <span className="session-id-label">Session ID:</span>
                  <span className="session-id-value">
                    {sessionId.length > 12
                      ? sessionId.slice(0, 6) + "..." + sessionId.slice(-4)
                      : sessionId}
                  </span>
                  <button
                    className="copy-session-id"
                    onClick={handleCopySessionId}
                    title="Copy Session ID"
                  >
                    {copied ? (
                      "✓"
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
              <div className="eval-count-badge">
                <span className="eval-count">Evaluations: {evalCount}</span>
                {badge && (
                  <span
                    className={`badge badge-${badgeLabel.toLowerCase()}`}
                    title={`${badgeLabel} badge`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            </div>
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
            <label htmlFor="darkMode" className="toggle-label">
              <span className="toggle-text">
                {isDarkMode ? "Dark mode" : "Light mode"}
              </span>
              {isDarkMode ? (
                <span className="icon-moon" title="Dark mode">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                  </svg>
                </span>
              ) : (
                <span className="icon-sun" title="Light mode">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </span>
              )}
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
        </div>
        <div className="modal-footer">
          <button
            className="clear-data-button"
            onClick={handleClearData}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              width: "auto",
              fontSize: "0.9em",
              marginTop: "8px",
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
            </svg>
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};
