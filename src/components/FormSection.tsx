import { CodeInput } from "./CodeInput";
import { EvalResponse, EvaluationHistory } from "../types";

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
  result: EvalResponse | null;
  onHistorySelect: (index: number, onSelect?: () => void) => void;
  onExamplesSelect: (example: string) => void;
  onClear: () => void;
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
  onClear,
  currentHistoryIndex,
  result,
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
            result={result}
            isDarkMode={isDarkMode}
            onExamplesSelect={onExamplesSelect}
            globals={globals}
            loading={loading}
            onClear={onClear}
          />
        </div>

        {error && <div className="error-message">Error: {error}</div>}
      </div>
    </div>
  );
}
