import { useState, useRef, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./CodeInput.css";

// Register the language
SyntaxHighlighter.registerLanguage("javascript", js);

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  history: EvaluationHistory[];
  onHistorySelect: (index: number, hideHistory: () => void) => void;
  currentHistoryIndex: number;
}

interface EvaluationHistory {
  id: number;
  code: string;
  timestamp: number;
}

export function CodeInput({
  value,
  onChange,
  onSubmit,
  history,
  onHistorySelect,
  currentHistoryIndex,
}: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    // Check initially
    checkMobile();

    // Add listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHistorySelect = (index: number) => {
    onHistorySelect(index, () => {
      // Only hide history on mobile devices
      if (isMobile) {
        setShowHistory(false);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "ArrowUp" && e.ctrlKey) {
      e.preventDefault();
      if (currentHistoryIndex < history.length - 1) {
        handleHistorySelect(currentHistoryIndex + 1);
      }
    } else if (e.key === "ArrowDown" && e.ctrlKey) {
      e.preventDefault();
      if (currentHistoryIndex > 0) {
        handleHistorySelect(currentHistoryIndex - 1);
      } else if (currentHistoryIndex === 0) {
        handleHistorySelect(-1);
      }
    } else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="code-input-container">
      <div className="history-toggle">
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {showHistory && (
        <div className="history-view">
          {history.map((item, index) => (
            <div
              key={item.id}
              className={`history-item ${
                index === currentHistoryIndex ? "current" : ""
              }`}
              onClick={() => handleHistorySelect(index)}
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
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter JavaScript code to evaluate..."
        className="input"
        rows={5}
      />
    </div>
  );
}
