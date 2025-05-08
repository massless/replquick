import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { createPortal } from "react-dom";
import "./HistoryPanel.css";

interface EvaluationHistory {
  id: number;
  code: string;
  timestamp: number;
}

interface HistoryPanelProps {
  history: EvaluationHistory[];
  currentHistoryIndex: number;
  onHistorySelect: (index: number) => void;
  triggerRect: DOMRect | null;
  isDarkMode: boolean;
  onClose: () => void;
}

export function HistoryPanel({
  history,
  currentHistoryIndex,
  onHistorySelect,
  triggerRect,
  isDarkMode,
  onClose,
}: HistoryPanelProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

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

  const getCodePreview = (code: string) => {
    // Get first line or first 100 characters, whichever is shorter
    const firstLine = code.split("\n")[0];
    return firstLine.length > 100
      ? firstLine.substring(0, 100) + "..."
      : firstLine;
  };

  const isCodeExpandable = (code: string) => {
    return code.includes("\n") || code.length > 100;
  };

  if (!triggerRect) return null;

  const panelStyle = {
    position: "fixed" as const,
    top: triggerRect.bottom + 8,
    left: triggerRect.left,
    width: `calc(100vw - ${triggerRect.left * 2}px)`,
  };

  const handleItemClick = (index: number, _event: React.MouseEvent) => {
    console.log("[HistoryPanel] History item clicked:", index); // Debug log
    onHistorySelect(index);
  };

  const toggleExpand = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const portalRoot = document.getElementById("portal-root") || document.body;

  return createPortal(
    <div className="history-panel" style={panelStyle}>
      {history.length === 0 ? (
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
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          <p>No history yet</p>
        </div>
      ) : (
        history.map((item, index) => (
          <div
            key={item.id}
            className={`history-item ${
              index === currentHistoryIndex ? "current" : ""
            } ${expandedItems.has(index) ? "expanded" : ""}`}
            onClick={(e) => handleItemClick(index, e)}
            role="button"
            tabIndex={0}
          >
            <div className="history-item-header">
              <span className="timestamp">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
              <button
                className="expand-button"
                onClick={(e) => toggleExpand(index, e)}
                aria-label={expandedItems.has(index) ? "Collapse" : "Expand"}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div className="code-preview">
              <SyntaxHighlighter
                language="json"
                style={isDarkMode ? vscDarkPlus : prism}
                customStyle={{
                  margin: "0",
                  padding: "4px 0",
                  background: "transparent",
                  textAlign: "left",
                  fontSize: "0.8em",
                }}
                wrapLines={true}
                wrapLongLines={true}
                showLineNumbers={false}
              >
                {getCodePreview(item.code)}
              </SyntaxHighlighter>
            </div>
            {isCodeExpandable(item.code) && (
              <div className="code-container">
                <SyntaxHighlighter
                  language="json"
                  style={isDarkMode ? vscDarkPlus : prism}
                  customStyle={{
                    margin: "0",
                    padding: "4px",
                    background: "transparent",
                    textAlign: "left",
                    fontSize: "0.8em",
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                  showLineNumbers={false}
                >
                  {item.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        ))
      )}
    </div>,
    portalRoot
  );
}
