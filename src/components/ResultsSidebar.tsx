import { Scroll, SheetStack, SheetRootProps } from "@silk-hq/components";
import { Sidebar } from "./Sidebar";
import { useRef, useState } from "react";
import { EvalResponse } from "../types";
import { useIsMobile } from "../hooks/useIsMobile";
import { DebugView } from "./DebugView";
import { InteractiveView } from "./InteractiveView";
import "./MainSidebar.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface ResultSidebarProps extends SheetRootDivProps {
  result: EvalResponse;
  presentTrigger?: React.ReactNode;
  activeTab: "debug" | "interactive";
}

export const ResultsSidebar = (props: ResultSidebarProps) => {
  const isMobile = useIsMobile();

  const { result, presented, onPresentedChange } = props;
  const [activeTab, setActiveTab] = useState<"debug" | "interactive">(
    props.activeTab || "interactive"
  );
  const [width, setWidth] = useState(500); // px
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
    <Sidebar
      presented={presented}
      onPresentedChange={onPresentedChange}
      className="ResultsSidebar-view"
      contentPlacement="right"
      presentTrigger={null}
      sheetContent={
        <div className="MainSidebar-root">
          <Scroll.Root asChild>
            <Scroll.View>
              <Scroll.Content className="MainSidebar-scrollContent ResultsSidebar-scrollContent">
                <div className="tab-content">
                  {activeTab === "debug" ? (
                    <DebugView data={result} />
                  ) : (
                    <InteractiveView data={result} />
                  )}
                </div>

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
                    className={`tab-button ${
                      activeTab === "debug" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("debug")}
                  >
                    Debug
                  </button>
                </div>
              </Scroll.Content>
            </Scroll.View>
          </Scroll.Root>
        </div>
      }
    />
  );
};

export default ResultsSidebar;
