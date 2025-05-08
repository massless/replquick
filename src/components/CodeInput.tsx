import { useState, useRef, useEffect } from "react";
import { HistoryPanel } from "./HistoryPanel";
import { ExamplesPopover } from "./ExamplesPopover";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorView, placeholder } from "@codemirror/view";
import "./CodeInput.css";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  history: EvaluationHistory[];
  onHistorySelect: (index: number, hideHistory: () => void) => void;
  onExamplesSelect: (example: string) => void;
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
  onExamplesSelect,
  currentHistoryIndex,
  isDarkMode,
}: CodeInputProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const examplesButtonRef = useRef<HTMLButtonElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [examplesButtonRect, setExamplesButtonRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === "Enter" && keyboardEvent.shiftKey) {
        console.log("[CodeInput] Shift+Enter pressed");
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();

        // Get the editor instance
        const editorElement = document.querySelector(".cm-editor");
        if (editorElement) {
          const view = (editorElement as any).cmView as EditorView;
          if (view) {
            // Prevent the default newline insertion by dispatching an empty transaction
            view.dispatch({
              changes: {
                from: view.state.selection.main.head,
                to: view.state.selection.main.head,
                insert: "",
              },
              selection: {
                anchor: view.state.selection.main.head,
                head: view.state.selection.main.head,
              },
            });
          }
        }

        onSubmit();
      }
    };

    const editorElement = document.querySelector(".cm-editor");
    if (editorElement) {
      editorElement.addEventListener("keydown", handleKeyDown, {
        capture: true,
      });
      return () => {
        editorElement.removeEventListener("keydown", handleKeyDown, {
          capture: true,
        });
      };
    }
  }, [onSubmit]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        !target.closest(".history-item") &&
        !examplesButtonRef.current?.contains(target) &&
        !target.closest(".example-item")
      ) {
        setShowHistory(false);
        setShowExamples(false);
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

  useEffect(() => {
    if (showExamples && examplesButtonRef.current) {
      setExamplesButtonRect(examplesButtonRef.current.getBoundingClientRect());
    } else {
      setExamplesButtonRect(null);
    }
  }, [showExamples]);

  const handleHistorySelect = (index: number) => {
    onHistorySelect(index, () => {
      setShowHistory(false);
    });
  };

  const handleExampleSelect = (code: string) => {
    onChange(code);
    onExamplesSelect(code);
  };

  return (
    <div className="code-input-container">
      <div className="code-input-header">
        <div className="history-toggle">
          <button ref={buttonRef} onClick={() => {
            setShowHistory(!showHistory);
            setShowExamples(false);
          }}>
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

        <div className="examples-toggle">
          <button ref={examplesButtonRef} onClick={() => {
            setShowExamples(!showExamples);
            setShowHistory(false);
          }}>
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
              <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v14z"></path>
              <path d="M3 9h18"></path>
              <path d="M9 3v18"></path>
            </svg>
            Examples
          </button>
        </div>
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          currentHistoryIndex={currentHistoryIndex}
          onHistorySelect={handleHistorySelect}
          triggerRect={buttonRect}
          isDarkMode={isDarkMode}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showExamples && (
        <ExamplesPopover
          onClose={() => setShowExamples(false)}
          onSelect={handleExampleSelect}
          triggerRect={examplesButtonRect}
          isDarkMode={isDarkMode}
        />
      )}

      <div className="code-editor-wrapper">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[
            javascript({ jsx: true }),
            placeholder("Enter some JavaScript code here..."),
          ]}
          theme={isDarkMode ? vscodeDark : githubLight}
          onChange={(v) => {
            const normalizedValue = v
              .replace(/\r\n/g, "\n")
              .replace(/\n+$/, "");
            onChange(normalizedValue);
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: value.trim().length > 0,
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
            highlightActiveLine: value.trim().length > 0,
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
