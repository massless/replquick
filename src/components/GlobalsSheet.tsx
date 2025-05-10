import { Sheet, SheetRootProps } from "@silk-hq/components";
import { LongSheet } from "./LongSheet";
import "./ExamplesSheet.css";
import "./GlobalsSheet.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface GlobalInfo {
  name: string;
  type: string;
  timestamp: number;
  size: number;
}

interface GlobalsSheetProps extends SheetRootDivProps {
  globals: GlobalInfo[];
  presentTrigger: React.ReactNode;
}

const GlobalsSheet = ({
  globals,
  presentTrigger,
  className,
}: GlobalsSheetProps) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
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
              <h1>Globals</h1>
            </Sheet.Title>
            <h2 className="ExampleLongSheet-subtitle">
              You're making a rich environment for your code.
            </h2>

            <section className="ExampleLongSheet-articleBody">
              <div className="globals-list">
                {globals.length === 0 ? (
                  <div className="empty-state">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="empty-icon"
                    >
                      <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                      <path d="M12 8l0 8"></path>
                      <path d="M8 12l8 0"></path>
                    </svg>
                    <p>No globals yet</p>
                  </div>
                ) : (
                  <div className="globals-items">
                    {globals.map((global, index) => (
                      <div key={index} className="global-item">
                        <div className="global-header">
                          <code>{global.name}</code>
                          <span className="global-type">{global.type}</span>
                        </div>
                        <div className="global-details">
                          <span className="global-time" title="Added at">
                            {formatDate(global.timestamp)}
                          </span>
                          <span className="global-size" title="Size in memory">
                            {formatBytes(global.size)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      }
    />
  );
};

export default GlobalsSheet;
