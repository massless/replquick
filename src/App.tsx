import { useState, useEffect } from "react";
import { EvalResponse, EvaluationHistory } from "./types";
import { Sheet } from "@silk-hq/components";
import { WelcomeModal } from "./components/WelcomeModal";
import { FormSection } from "./components/FormSection";
import MainSidebar from "./components/MainSidebar";
import "./App.css";

const DB_NAME = "replquick-history";
const STORE_NAME = "evaluations";
const GLOBALS_STORE_NAME = "globals";
const API_URL = import.meta.env.VITE_API_URL;

interface GlobalInfo {
  name: string;
  type: string;
  timestamp: number;
  size: number;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<EvalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(
    localStorage.getItem("sessionId") || ""
  );
  const [history, setHistory] = useState<EvaluationHistory[]>([]);
  const [globals, setGlobals] = useState<GlobalInfo[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || !savedTheme; // Default to dark mode if no theme is saved
  });

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Initialize IndexedDB and get current session
  useEffect(() => {
    const initDB = async () => {
      const request = indexedDB.open(DB_NAME);

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
        if (!db.objectStoreNames.contains(GLOBALS_STORE_NAME)) {
          db.createObjectStore(GLOBALS_STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        loadHistory(db);
        loadGlobals(db);
      };
    };

    initDB();
    // Try to get sessionId from localStorage first
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }

    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (!hasVisitedBefore) {
      setShowWelcomeModal(true);
    }
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

  const loadGlobals = async (db: IDBDatabase) => {
    const transaction = db.transaction([GLOBALS_STORE_NAME], "readonly");
    const store = transaction.objectStore(GLOBALS_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const globals = request.result;
      setGlobals(globals);
    };
  };

  const updateGlobals = async (newGlobals: GlobalInfo[]) => {
    const db = await openDB();
    const transaction = db.transaction([GLOBALS_STORE_NAME], "readwrite");
    const store = transaction.objectStore(GLOBALS_STORE_NAME);

    // Get existing globals
    const existingGlobals = await new Promise<GlobalInfo[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
    });

    // Combine existing and new globals, removing duplicates by name
    const combinedGlobals = [...existingGlobals];
    for (const newGlobal of newGlobals) {
      const existingIndex = combinedGlobals.findIndex(
        (g) => g.name === newGlobal.name
      );
      if (existingIndex === -1) {
        combinedGlobals.push(newGlobal);
      } else {
        combinedGlobals[existingIndex] = newGlobal;
      }
    }

    // Clear and update with combined globals
    await store.clear();
    for (const global of combinedGlobals) {
      store.add(global);
    }

    await loadGlobals(db);
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

  const clearHistory = async () => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
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
      handleSubmitWithCode(code);
    }
    // Call the callback if provided (used to hide history panel)
    onSelect?.();
  };

  const handleExamplesSelect = (example: string) => {
    setInputValue(example);
    handleSubmitWithCode(example);
  };

  const handleSubmitWithCode = async (code: string) => {
    console.log("[App] handleSubmitWithCode", { code, sessionId });
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL ? API_URL : ""}/eval`, {
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
        localStorage.setItem("sessionId", data.sessionId);
      }
      // Store new globals if any
      if (data.newGlobals && data.newGlobals.length > 0) {
        await updateGlobals(data.newGlobals);
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

  const handleNewSession = async () => {
    console.log("[App] handleNewSession", { sessionId });

    try {
      const response = await fetch(`${API_URL ? API_URL : ""}/session/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create new session");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      localStorage.setItem("sessionId", data.sessionId);
      setHistory([]);
      setCurrentHistoryIndex(-1);
      await clearHistory();
      setResult(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create new session"
      );
    }
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("hasVisitedBefore", "true");
  };

  const onToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app-container">
      <MainSidebar
        presentTrigger={
          <Sheet.Trigger asChild>
            <header>
              <h1 className="app-title">
                <img src="/logo.svg" alt="Logo" className="logo" />
              </h1>
            </header>
          </Sheet.Trigger>
        }
        sessionId={sessionId}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        history={history}
      />

      <div className="main-content">
        <FormSection
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          handleNewSession={handleNewSession}
          loading={loading}
          error={error}
          history={history}
          result={result}
          onHistorySelect={handleHistorySelect}
          onExamplesSelect={handleExamplesSelect}
          currentHistoryIndex={currentHistoryIndex}
          isDarkMode={isDarkMode}
          globals={globals}
        />
      </div>

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
      />
    </div>
  );
}

export default App;
