import React from 'react';
import { createPortal } from 'react-dom';
import './GlobalsPopover.css';
import { useIsMobile } from '../hooks/useIsMobile';

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
  if (!triggerRect) return null;

  const isMobile = useIsMobile();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Add ESC key handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const portalRoot = document.getElementById('portal-root') || document.body;

  return createPortal(
    <div
      className="globals-popover"
      style={{
        top: triggerRect.bottom + window.scrollY + 8,
        left: isMobile ? 20 : triggerRect.left + window.scrollX,
      }}
    >
      <div className="globals-header">
        <h3>Your API</h3>
        <button onClick={onClose} className="close-button">
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
      <div className="globals-list">
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
    </div>,
    portalRoot
  );
}