import { useState } from "react";
import { Sheet, SheetRootProps } from "@silk-hq/components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { LongSheet } from "./LongSheet";
import { EvaluationHistory } from "../types";
import "./ExamplesSheet.css";
import "./HistorySheet.css";
import "./HistoryPanel.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface HistorySheetProps extends SheetRootDivProps {
  history: EvaluationHistory[];
  currentHistoryIndex: number;
  onHistorySelect: (index: number) => void;
  presentTrigger: React.ReactNode;
  isDarkMode: boolean;
}

const HistorySheet = ({
  history,
  currentHistoryIndex,
  onHistorySelect,
  presentTrigger,
  className,
  isDarkMode,
}: HistorySheetProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const getCodePreview = (code: string) => {
    // Get first line or first 100 characters, whichever is shorter
    const firstLine = code.split("\n")[0];
    return firstLine.length > 100
      ? firstLine.substring(0, 100) + "..."
      : firstLine;
  };

  const isCodeExpandable = (code: string) => {
    return code.includes("\n") || code.length > 100;
  };

  const handleItemClick = (index: number, _event: React.MouseEvent) => {
    console.log("[HistoryPanel] History item clicked:", index); // Debug log
    onHistorySelect(index);
  };

  const onSelect = (index: number, _event: React.MouseEvent) => {
    console.log("[HistoryPanel] History item clicked:", index); // Debug log
    onHistorySelect(index);
  };

  const toggleExpand = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <LongSheet
      className={`ExampleLongSheet-content ${className}`}
      presentTrigger={presentTrigger}
      sheetContent={
        <div className="ExampleLongSheet-article">
          <Sheet.Trigger action="dismiss" asChild>
            <button className={`ExampleLongSheet-dismissTrigger`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ExampleLongSheet-dismissTriggerIcon`}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </Sheet.Trigger>

          <div className="ExampleLongSheet-articleContent">
            <Sheet.Title className="ExampleLongSheet-title" asChild>
              <h1>History</h1>
            </Sheet.Title>
            <h2 className="ExampleLongSheet-subtitle">
              Look back and see what you've done.
            </h2>

            <section className="ExampleLongSheet-articleBody">
              {history.length === 0 ? (
                <div className="empty-state">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="empty-icon"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                  <p>No history yet</p>
                </div>
              ) : (
                history.map((item, index) => (
                  <div
                    key={item.id}
                    className={`history-item ${
                      index === currentHistoryIndex ? "current" : ""
                    } ${expandedItems.has(index) ? "expanded" : ""}`}
                    onClick={(e) => toggleExpand(index, e)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="history-item-header">
                      <span className="timestamp">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <button
                        className="expand-button"
                        onClick={(e) => toggleExpand(index, e)}
                        aria-label={
                          expandedItems.has(index) ? "Collapse" : "Expand"
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>

                    <Sheet.Trigger
                      action="dismiss"
                      asChild
                      key={`history-item-${index}`}
                    >
                      <button
                        className="history-item-evaluate-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onSelect(index, e);
                        }}
                      >
                        Evaluate
                      </button>
                    </Sheet.Trigger>

                    <div className="code-preview">
                      <SyntaxHighlighter
                        language="json"
                        style={isDarkMode ? vscDarkPlus : prism}
                        customStyle={{
                          margin: "0",
                          padding: "4px 0",
                          background: "transparent",
                          textAlign: "left",
                          fontSize: "0.8em",
                        }}
                        wrapLines={true}
                        wrapLongLines={true}
                        showLineNumbers={false}
                      >
                        {getCodePreview(item.code)}
                      </SyntaxHighlighter>
                    </div>

                    {isCodeExpandable(item.code) && (
                      <div className="code-container">
                        <SyntaxHighlighter
                          language="json"
                          style={isDarkMode ? vscDarkPlus : prism}
                          customStyle={{
                            margin: "0",
                            padding: "4px 8px",
                            textAlign: "left",
                            fontSize: "0.8em",
                          }}
                          wrapLines={true}
                          wrapLongLines={true}
                          showLineNumbers={false}
                        >
                          {item.code}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      }
    />
  );
};

export default HistorySheet;
