import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
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
}

export function HistoryPanel({
  history,
  currentHistoryIndex,
  onHistorySelect,
  triggerRect,
}: HistoryPanelProps) {
  if (!triggerRect) return null;

  const panelStyle = {
    position: 'fixed' as const,
    top: triggerRect.bottom + 8,
    left: triggerRect.left,
    width: `calc(100vw - ${triggerRect.left * 2}px)`,
  };

  const handleItemClick = (index: number, event: React.MouseEvent) => {
    console.log('[HistoryPanel] History item clicked:', index); // Debug log
    onHistorySelect(index);
  };

  return createPortal(
    <div className="history-panel" style={panelStyle}>
      {history.map((item, index) => (
        <div
          key={item.id}
          className={`history-item ${index === currentHistoryIndex ? "current" : ""}`}
          onClick={(e) => handleItemClick(index, e)}
          role="button"
          tabIndex={0}
        >
          <span className="timestamp">
            {new Date(item.timestamp).toLocaleTimeString()}
          </span>
          <SyntaxHighlighter
            language="json"
            style={docco}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              textAlign: "left",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {item.code}
          </SyntaxHighlighter>
        </div>
      ))}
    </div>,
    document.getElementById('root') || document.body
  );
}