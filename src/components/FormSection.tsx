import { useState } from "react";
import { CodeInput } from "./CodeInput";
import { EvaluationHistory } from "../types";

interface GlobalInfo {
  name: string;
  type: string;
  timestamp: number;
  size: number;
}

interface FormSectionProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: () => void;
  handleNewSession: () => void;
  loading: boolean;
  error: string | null;
  history: EvaluationHistory[];
  onHistorySelect: (index: number, onSelect?: () => void) => void;
  onExamplesSelect: (example: string) => void;
  currentHistoryIndex: number;
  isDarkMode: boolean;
  width?: number | string;
  globals: GlobalInfo[];
}

export function FormSection({
  inputValue,
  setInputValue,
  handleSubmit,
  handleNewSession: __, // TODO: We're keeping the UX simple for now, but we'll add a new session button in the future
  loading,
  error,
  history,
  onHistorySelect,
  onExamplesSelect,
  currentHistoryIndex,
  isDarkMode,
  width,
  globals,
}: FormSectionProps) {
  return (
    <div className="form-section" style={width ? { width } : undefined}>
      <div className="form">
        <div className="form-group">
          <CodeInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            history={history}
            onHistorySelect={onHistorySelect}
            currentHistoryIndex={currentHistoryIndex}
            isDarkMode={isDarkMode}
            onExamplesSelect={onExamplesSelect}
            globals={globals}
          />
        </div>
        <div className="button-group">
          <span className="shift-enter-hint">Shift + Enter to run</span>
          <button
            type="button"
            onClick={handleSubmit}
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Evaluating..." : "⚡ Evaluate"}
          </button>
          {/* <button
            type="button"
            onClick={handleNewSession}
            className="new-session-button"
          >
            New Session
          </button> */}
        </div>

        {error && <div className="error-message">Error: {error}</div>}
      </div>
    </div>
  );
}
