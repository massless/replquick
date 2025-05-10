import { useState, useEffect } from "react";
import { Sheet } from "@silk-hq/components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorView, placeholder } from "@codemirror/view";
import HistorySheet from "./HistorySheet";
import GlobalsSheet from "./GlobalsSheet";
import ExamplesSheet from "./ExamplesSheet";
import ResultsSidebar from "./ResultsSidebar";
import { EvalResponse } from "../types";
import "./CodeInput.css";

interface CodeInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  history: EvaluationHistory[];
  onHistorySelect: (index: number) => void;
  onExamplesSelect: (example: string) => void;
  onClear: () => void;
  currentHistoryIndex: number;
  result: EvalResponse | null;
  isDarkMode: boolean;
  globals: GlobalInfo[];
}

interface EvaluationHistory {
  id: number;
  code: string;
  timestamp: number;
}

interface GlobalInfo {
  name: string;
  type: string;
  timestamp: number;
  size: number;
}

export function CodeInput({
  value,
  onChange,
  onSubmit,
  onClear,
  loading,
  history,
  onHistorySelect,
  onExamplesSelect,
  currentHistoryIndex,
  result,
  isDarkMode,
  globals,
}: CodeInputProps) {
  const [showResults, setShowResults] = useState(false);

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
    if (result) {
      setShowResults(true);
    }
  }, [result]);

  const handleExampleSelect = (code: string) => {
    onChange(code);
    onExamplesSelect(code);
  };

  return (
    <div className="code-input-container">
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

      <div className="button-group">
        <span className="shift-enter-hint">Shift + Enter to run</span>
        <button
          type="button"
          onClick={onSubmit}
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Evaluating..." : "⚡ Evaluate"}
        </button>

        {value.trim() && (
          <button
            onClick={() => {
              onChange("");
              setShowResults(false);
              onClear();
            }}
            className="clear-button"
          >
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
              <path d="M4 7h16"></path>
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
              <path d="M10 12l4 4m0 -4l-4 4"></path>
            </svg>
            Clear
          </button>
        )}
      </div>

      <div className="code-input-header">
        <ExamplesSheet
          className="examples-toggle toggle-button"
          presentTrigger={
            <Sheet.Trigger asChild>
              <button>
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
            </Sheet.Trigger>
          }
          onClose={() => {}}
          onExampleSelect={handleExampleSelect}
        />

        <GlobalsSheet
          globals={globals}
          className="globals-toggle toggle-button"
          presentTrigger={
            <Sheet.Trigger asChild>
              <button>
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
                    d="M8.5 1a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm4.894 4a5.527 5.527 0 0 0-3.053-2.676c.444.84.765 1.74.953 2.676h2.1zm.582 2.995A5.11 5.11 0 0 0 14 7.5a5.464 5.464 0 0 0-.213-1.5h-2.342c.032.331.055.664.055 1a10.114 10.114 0 0 1-.206 2h2.493c.095-.329.158-.665.19-1.005zm-3.535 0 .006-.051A9.04 9.04 0 0 0 10.5 7a8.994 8.994 0 0 0-.076-1H6.576A8.82 8.82 0 0 0 6.5 7a8.98 8.98 0 0 0 .233 2h3.534c.077-.332.135-.667.174-1.005zM10.249 5a8.974 8.974 0 0 0-1.255-2.97C8.83 2.016 8.666 2 8.5 2a3.62 3.62 0 0 0-.312.015l-.182.015L8 2.04A8.97 8.97 0 0 0 6.751 5h3.498zM5.706 5a9.959 9.959 0 0 1 .966-2.681A5.527 5.527 0 0 0 3.606 5h2.1zM3.213 6A5.48 5.48 0 0 0 3 7.5 5.48 5.48 0 0 0 3.213 9h2.493A10.016 10.016 0 0 1 5.5 7c0-.336.023-.669.055-1H3.213zm2.754 4h-2.36a5.515 5.515 0 0 0 3.819 2.893A10.023 10.023 0 0 1 5.967 10zM8.5 12.644A8.942 8.942 0 0 0 9.978 10H7.022A8.943 8.943 0 0 0 8.5 12.644zM11.033 10a10.024 10.024 0 0 1-1.459 2.893A5.517 5.517 0 0 0 13.393 10h-2.36z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Globals
              </button>
            </Sheet.Trigger>
          }
        />

        <HistorySheet
          history={history}
          className="history-toggle toggle-button"
          currentHistoryIndex={currentHistoryIndex}
          onHistorySelect={onHistorySelect}
          isDarkMode={isDarkMode}
          presentTrigger={
            <Sheet.Trigger asChild>
              <button>
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
            </Sheet.Trigger>
          }
        />

        <div className="results-toggle toggle-button">
          <button
            disabled={!result}
            onClick={() => setShowResults(!showResults)}
          >
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
            Results
          </button>
        </div>

        {result && (
          <ResultsSidebar
            presented={showResults}
            onPresentedChange={setShowResults}
            result={result}
            activeTab={"interactive"}
          />
        )}
      </div>
    </div>
  );
}
