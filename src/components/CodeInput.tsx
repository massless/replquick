import { useState, useRef, useEffect } from "react";
import { HistoryPanel } from "./HistoryPanel";
import { useIsMobile } from "../hooks/useIsMobile";
import "./CodeInput.css";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const _isMobile = useIsMobile();
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on the button or a history item
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        !target.closest(".history-item")
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showHistory && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    } else {
      setButtonRect(null);
    }
  }, [showHistory]);

  const handleHistorySelect = (index: number) => {
    onHistorySelect(index, () => {
      setShowHistory(false);
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
        <button ref={buttonRef} onClick={() => setShowHistory(!showHistory)}>
          <svg
            fill="none"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 8l0 4l2 2"></path>
            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
          </svg>
          History
        </button>
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          currentHistoryIndex={currentHistoryIndex}
          onHistorySelect={handleHistorySelect}
          triggerRect={buttonRect}
        />
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter JavaScript code to evaluate..."
        className="input"
        style={{ minHeight: '100px', overflow: 'hidden' }}
      />
    </div>
  );
}
