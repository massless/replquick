import React from "react";
import { createPortal } from "react-dom";
import "./GlobalsPopover.css";
import { useIsMobile } from "../hooks/useIsMobile";

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
}: GlobalsPopoverProps) {
  if (!triggerRect) return null;

  const isMobile = useIsMobile();

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

  // Add ESC key handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const portalRoot = document.getElementById("portal-root") || document.body;

  return createPortal(
    <div
      className="globals-popover"
      style={{
        top: triggerRect.bottom + window.scrollY + 8,
        left: isMobile ? 20 : triggerRect.left + window.scrollX,
      }}
    >
      <div className="globals-list">
        {globals.length === 0 ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          globals.map((global, index) => (
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
          ))
        )}
      </div>
    </div>,
    portalRoot
  );
}
