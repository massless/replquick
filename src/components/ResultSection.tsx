import { useState, useRef } from "react";
import { EvalResponse } from "../types";
import { DebugView } from "./DebugView";
import { InteractiveView } from "./InteractiveView";

interface ResultSectionProps {
  result: EvalResponse;
  width: number;
  setWidth: (w: number) => void;
  isMobile: boolean;
  activeTab: "debug" | "interactive";
}

export function ResultSection(props: ResultSectionProps) {
  const { result, width, setWidth, isMobile } = props;
  const [activeTab, setActiveTab] = useState<"debug" | "interactive">(
    props.activeTab || "interactive"
  );
  const isResizing = useRef(false);

  // Mouse event handlers for resizing (right edge)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isResizing.current = true;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = startWidth - (moveEvent.clientX - startX);
      setWidth(Math.max(300, Math.min(900, newWidth)));
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className="result-section"
      style={{ width: isMobile ? "auto" : width }}
    >
      {/* Resizer handle on the right */}
      {!isMobile && (
        <div
          className="resizer"
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: "ew-resize",
            zIndex: 10,
            background: "rgba(0,0,0,0.05)",
          }}
        />
      )}

      <div className="tabs">
        <button
          className={`tab-button ${
            activeTab === "interactive" ? "active" : ""
          }`}
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
