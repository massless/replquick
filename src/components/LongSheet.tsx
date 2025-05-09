"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Sheet, Scroll } from "@silk-hq/components";
import "./LongSheet.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  presentTrigger: React.ReactNode;
  sheetContent: React.ReactNode;
}

const LongSheet = React.forwardRef<HTMLDivElement, Props>(
  ({ presentTrigger, sheetContent, ...restProps }, ref) => {
    const [presented, setPresented] = useState(false);
    const [restingOutside, setRestingOutside] = useState(false);

    // Track switching based on scroll position & presented

    const scrollRef = useRef<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [track, setTrack] = useState<"top" | "bottom">("bottom");

    const scrollHandler = useCallback(
      ({ progress }: any) => {
        if (restingOutside) return; // ! Checking because it may scroll to 1 when outside
        setTrack(progress < 0.5 ? "bottom" : "top");
      },
      [restingOutside]
    );

    useEffect(() => {
      if (restingOutside) {
        setTrack("bottom");
      }
    }, [restingOutside]);

    // Handle clicks outside this component
    useEffect(() => {
      if (!presented) return;

      function handleClickOutside(event: MouseEvent) {
        console.log("[LongSheet] handleClickOutside", event.target);
        if (
          event.target instanceof Node &&
          contentRef.current &&
          !contentRef.current.contains(event.target)
        ) {
          console.log("[LongSheet] Dismissing");
          setPresented(false);
        }
      }

      // Add event listener when the component mounts
      document.addEventListener("mousedown", handleClickOutside);

      // Clean up the event listener when component unmounts
      return () => {
        console.log("[LongSheet] Removing event listener");
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [presented]);

    return (
      <Sheet.Root
        license="commercial"
        presented={presented}
        onPresentedChange={setPresented}
        {...restProps}
      >
        {presentTrigger}
        <Sheet.Portal>
          <Sheet.View
            className="LongSheet-view"
            contentPlacement="center"
            tracks={track}
            swipeOvershoot={false}
            nativeEdgeSwipePrevention={true}
            enteringAnimationSettings={{
              easing: "spring",
              stiffness: 480,
              damping: 45,
              mass: 1.5,
            }}
            onTravelStatusChange={(status) =>
              setRestingOutside(status === "idleOutside")
            }
          >
            <Sheet.Backdrop themeColorDimming="auto" />
            <Sheet.Content asChild>
              <Scroll.Root
                className="LongSheet-content"
                componentRef={scrollRef}
                asChild
              >
                <Scroll.View
                  className="LongSheet-scrollRoot"
                  onScroll={scrollHandler}
                >
                  <Scroll.Content className="LongSheet-scrollContent">
                    <div ref={contentRef} className="LongSheet-innerContent">
                      {sheetContent}
                    </div>
                  </Scroll.Content>
                </Scroll.View>
              </Scroll.Root>
            </Sheet.Content>
          </Sheet.View>
        </Sheet.Portal>
      </Sheet.Root>
    );
  }
);

export { LongSheet };
