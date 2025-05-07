import { useState, useRef, useEffect } from "react";
import { HistoryPanel } from "./HistoryPanel";
import { useIsMobile } from "../hooks/useIsMobile";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import "./CodeInput.css";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  history: EvaluationHistory[];
  onHistorySelect: (index: number, hideHistory: () => void) => void;
  currentHistoryIndex: number;
  isDarkMode: boolean;
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
  isDarkMode,
}: CodeInputProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const _isMobile = useIsMobile();
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
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
          isDarkMode={isDarkMode}
        />
      )}

      <div className="code-editor-wrapper">
        <CodeMirror
          value={value}
          height="100%"
          theme={isDarkMode ? vscodeDark : githubLight}
          extensions={[javascript()]}
          onChange={(v) => {
            // Normalize line endings to \n and remove any trailing newlines
            const normalizedValue = v.replace(/\r\n/g, '\n').replace(/\n+$/, '');
            onChange(normalizedValue);
          }}
          placeholder="Enter JavaScript code to evaluate..."
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
}
