import React from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { useEscapeKey } from "../hooks/useEscapeKey";
import "./GlobalsPopover.css";

interface GlobalInfo {
  name: string;
  type: string;
  timestamp: number;
  size: number;
}

interface GlobalsPopoverProps {
  onClose: () => void;
  globals: GlobalInfo[];
  triggerRect: DOMRect | null;
  isDarkMode: boolean;
}

export function GlobalsPopover({
  onClose,
  globals,
  triggerRect,
  isDarkMode,
}: GlobalsPopoverProps) {
  const isMobile = useIsMobile();
  useEscapeKey(true, onClose);

  if (!triggerRect) return null;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) {
    return null;
  }

  if (!triggerRect || !portalRoot) return null;

  return createPortal(
    <div
      className="globals-popover"
      style={{
        top: triggerRect.bottom + window.scrollY + 8,
        left: isMobile ? 0 : triggerRect.left + window.scrollX,
        right: isMobile ? 0 : undefined,
        margin: isMobile ? "0 auto" : undefined,
        width: isMobile ? "100vw" : undefined,
        maxWidth: isMobile ? "100vw" : 400,
        borderRadius: isMobile ? "24px 24px 0 0" : "20px",
        boxShadow: isMobile
          ? "0 -2px 24px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.03)"
          : "0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.03)",
        paddingBottom: isMobile ? 24 : undefined,
      }}
    >
      <div className="globals-header">
        <h3>Globals</h3>
        <button
          className="globals-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="globals-close-icon"
            width={22}
            height={22}
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div className="globals-list">
        {globals.length === 0 ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="empty-icon"
            >
              <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
              <path d="M12 8l0 8"></path>
              <path d="M8 12l8 0"></path>
            </svg>
            <p>No globals yet</p>
          </div>
        ) : (
          <div className="globals-items">
            {globals.map((global, index) => (
              <div key={index} className="global-item">
                <div className="global-header">
                  <code>{global.name}</code>
                  <span className="global-type">{global.type}</span>
                </div>
                <div className="global-details">
                  <span className="global-time" title="Added at">
                    {formatDate(global.timestamp)}
                  </span>
                  <span className="global-size" title="Size in memory">
                    {formatBytes(global.size)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    portalRoot
  );
}
