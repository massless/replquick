import { Scroll, Sheet, SheetRootProps, SheetStack } from "@silk-hq/components";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import "./MainSidebar.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface MainSidebarProps extends SheetRootDivProps {
  presentTrigger: React.ReactNode;
  sessionId: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  history: any[];
}

export const MainSidebar = ({
  presentTrigger,
  sessionId,
  isDarkMode,
  onToggleDarkMode,
  history,
}: MainSidebarProps) => {
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

  const truncateSessionId = (id: string) => {
    if (!id) return null;
    return id.length > 12 ? id.slice(0, 6) + "..." + id.slice(-4) : id;
  };

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
    <SheetStack.Root asChild>
      <Sidebar
        presentTrigger={presentTrigger}
        sheetContent={
          <div className="MainSidebar-root">
            <div className="MainSidebar-header">
              <div className="MainSidebar-logo">
                <img src="/logo.svg" alt="Logo" className="logo" />
              </div>
              <div className="MainSidebar-orgName">Replquick</div>
              <div className="MainSidebar-orgEmail">
                {truncateSessionId(sessionId) ?? "Test account"}
              </div>
            </div>
            <Scroll.Root asChild>
              <Scroll.View>
                <Scroll.Content className="MainSidebar-scrollContent ExampleBottomSheet-root">
                  <div className="ExampleBottomSheet-information">
                    <Sheet.Title className="ExampleBottomSheet-title">
                      Settings
                    </Sheet.Title>
                    <Sheet.Description className="ExampleBottomSheet-description">
                      We don't have authentication right now, so we're using a
                      session to track your history.
                    </Sheet.Description>

                    <div className="settings-meta">
                      {sessionId && (
                        <div className="setting-item">
                          <div className="setting-item-left">
                            <div className="setting-item-title">Session ID</div>
                            <div className="setting-item-description">
                              Unique identifier for your session
                            </div>
                          </div>
                          <div className="setting-item-right">
                            <div className="session-info">
                              <span className="session-id-value">
                                {truncateSessionId(sessionId)}
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
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                    />
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="setting-item">
                        <div className="setting-item-left">
                          <div className="setting-item-title">Evaluations</div>
                          <div className="setting-item-description">
                            Track your progress and earn badges
                          </div>
                        </div>
                        <div className="setting-item-right">
                          <div className="eval-count-badge">
                            <span className="eval-count">{evalCount}</span>
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
                      </div>

                      <div className="setting-item">
                        <div className="setting-item-left">
                          <div className="setting-item-title">Appearance</div>
                          <div className="setting-item-description">
                            Switch between light and dark mode
                          </div>
                        </div>
                        <div className="setting-item-right">
                          <label htmlFor="darkMode" className="toggle-label">
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
                          <div
                            className="toggle-switch"
                            onClick={onToggleDarkMode}
                          >
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

                      <div className="setting-item">
                        <div className="setting-item-left">
                          <div className="setting-item-title">
                            Data Management
                          </div>
                          <div className="setting-item-description">
                            Clear all your local data and start fresh
                          </div>
                        </div>
                        <div className="setting-item-right">
                          <button
                            className="clear-data-button"
                            onClick={handleClearData}
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
                            Clear Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Scroll.Content>
              </Scroll.View>
            </Scroll.Root>
          </div>
        }
      />
    </SheetStack.Root>
  );
};

export default MainSidebar;
