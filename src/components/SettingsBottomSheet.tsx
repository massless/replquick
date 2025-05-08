"use client";
import { Sheet } from "@silk-hq/components";
import { BottomSheet } from "./BottomSheet";
import "./SettingsModal.css";
import { useState } from "react";

export const SettingsBottomSheet = ({
  presentTrigger,
  sessionId,
  isDarkMode,
  onToggleDarkMode,
  history,
}: {
  presentTrigger: React.ReactNode;
  sessionId: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  history: any[];
}) => {
  const [copied, setCopied] = useState(false);

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

  return (
    <BottomSheet
      presentTrigger={presentTrigger}
      sheetContent={
        <div className={"ExampleBottomSheet-root"}>
          <Sheet.Handle
            className="ExampleBottomSheet-handle"
            action="dismiss"
          />
          <div className="ExampleBottomSheet-information">
            <Sheet.Title className="ExampleBottomSheet-title">
              Settings
            </Sheet.Title>
            <Sheet.Description className="ExampleBottomSheet-description">
              We don't have authentication right now, so we're using a session
              to track your history.
            </Sheet.Description>

            <div className="settings-meta">
              {sessionId && (
                <div className="setting-item">
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
                </div>
              )}

              <div className="setting-item">
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

              <div className="setting-item">
                <button className="clear-data-button" onClick={handleClearData}>
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
                  Clear all data
                </button>
              </div>
            </div>
          </div>
          <Sheet.Trigger
            className="ExampleBottomSheet-validateTrigger"
            action="dismiss"
          >
            Got it
          </Sheet.Trigger>
        </div>
      }
    />
  );
};

export default SettingsBottomSheet;
