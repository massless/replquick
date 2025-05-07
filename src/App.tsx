import { useState, useEffect } from "react";
import { EvalResponse } from "./types";
import { DebugView } from "./components/DebugView";
import { InteractiveView } from "./components/InteractiveView";
import { CodeInput } from "./components/CodeInput";
import "./App.css";

interface EvaluationHistory {
  id: number;
  code: string;
  timestamp: number;
}

const DB_NAME = "replquick-history";
const STORE_NAME = "evaluations";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<EvalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [history, setHistory] = useState<EvaluationHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<'debug' | 'interactive'>('interactive');

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        loadHistory(db);
      };
    };

    initDB();
  }, []);

  const loadHistory = async (db: IDBDatabase) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const history = request.result.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(history);
    };
  };

  const addToHistory = async (code: string) => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const evaluation: Omit<EvaluationHistory, "id"> = {
      code,
      timestamp: Date.now(),
    };

    store.add(evaluation);
    await loadHistory(db);
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const handleHistorySelect = (index: number, onSelect?: () => void) => {
    console.log("[App] handleHistorySelect", index);
    setCurrentHistoryIndex(index);
    if (index === -1) {
      setInputValue("");
    } else {
      const code = history[index].code;
      setInputValue(code);
      setActiveTab("interactive");
      handleSubmitWithCode(code);
    }
    // Call the callback if provided (used to hide history panel)
    onSelect?.();
  };

  const handleSubmitWithCode = async (code: string) => {
    console.log("[App] handleSubmitWithCode", { code });
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/eval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        console.error("[App] eval error", { response, code });
        throw new Error("Failed to evaluate code");
      }

      const data = await response.json();
      console.log("[App] data", data);
      setResult(data);
      // Update session ID if it's a new session
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }
      // Only store in history if evaluation was successful
      await addToHistory(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleSubmitWithCode(inputValue);
  };

  const handleNewSession = () => {
    setSessionId("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <h1>Replquick</h1>

      <div className="main-content">
        <div className="form-section">
          <div className="form">
            <div className="form-group">
              <CodeInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                history={history}
                onHistorySelect={handleHistorySelect}
                currentHistoryIndex={currentHistoryIndex}
              />
            </div>
            <div className="button-group">
              <button
                type="button"
                onClick={handleSubmit}
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Evaluating..." : "Evaluate"}
              </button>
              <button
                type="button"
                onClick={handleNewSession}
                className="new-session-button"
              >
                New Session
              </button>
            </div>
            {sessionId && (
              <div className="session-info">Session ID: {sessionId}</div>
            )}

            {error && <div className="error-message">Error: {error}</div>}
          </div>
        </div>

        {result && (
          <div className="result-section">
            <div className="tabs">
              <button
                className={`tab-button ${activeTab === 'interactive' ? 'active' : ''}`}
                onClick={() => setActiveTab('interactive')}
              >
                Result
              </button>
              <button
                className={`tab-button ${activeTab === 'debug' ? 'active' : ''}`}
                onClick={() => setActiveTab('debug')}
              >
                Debug
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'debug' ? (
                <DebugView data={result} />
              ) : (
                <InteractiveView data={result} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
