import { useState } from "react";
import { EvalResponse } from "../types";
import { DebugView } from "./DebugView";
import { InteractiveView } from "./InteractiveView";

interface ResultSectionProps {
  result: EvalResponse;
}

export function ResultSection({ result }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<"debug" | "interactive">("interactive");

  return (
    <div className="result-section">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "interactive" ? "active" : ""}`}
          onClick={() => setActiveTab("interactive")}
        >
          Result
        </button>
        <button
          className={`tab-button ${activeTab === "debug" ? "active" : ""}`}
          onClick={() => setActiveTab("debug")}
        >
          Debug
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "debug" ? (
          <DebugView data={result} />
        ) : (
          <InteractiveView data={result} />
        )}
      </div>
    </div>
  );
}