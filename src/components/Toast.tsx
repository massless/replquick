import React, { useEffect, useState, useRef } from "react";
import {
  Sheet,
  SheetRootProps,
  useClientMediaQuery,
} from "@silk-hq/components";
import "./Toast.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface Props extends SheetRootDivProps {
  sheetContent: React.ReactNode;
}

const Toast = ({ sheetContent, ...restProps }: Props) => {
  const largeViewport = useClientMediaQuery("(min-width: 1000px)");
  const contentPlacement = largeViewport ? "left" : "top";
  const [pointerOver, setPointerOver] = useState(false);
  const [travelStatus, setTravelStatus] = useState("idleOutside");
  const autoCloseTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  useEffect(() => {
    const startAutoCloseTimeout = () => {
      autoCloseTimeout.current = setTimeout(
        () => restProps.onPresentedChange?.(false),
        5000
      );
    };

    const clearAutoCloseTimeout = () => {
      clearTimeout(autoCloseTimeout.current);
    };

    if (restProps.presented) {
      if (travelStatus === "idleInside" && !pointerOver) {
        startAutoCloseTimeout();
      } else {
        clearAutoCloseTimeout();
      }
    }
    return clearAutoCloseTimeout;
  }, [restProps.presented, travelStatus, pointerOver]);

  return (
    <Sheet.Root
      license="commercial"
      presented={restProps.presented}
      onPresentedChange={restProps.onPresentedChange}
      sheetRole=""
      {...restProps}
    >
      <Sheet.Portal>
        <div className="Toast-container" role="status" aria-live="polite">
          <Sheet.View
            className="Toast-view"
            contentPlacement={contentPlacement}
            inertOutside={false}
            onPresentAutoFocus={{ focus: false }}
            onDismissAutoFocus={{ focus: false }}
            onClickOutside={{
              dismiss: false,
              stopOverlayPropagation: false,
            }}
            onEscapeKeyDown={{
              dismiss: false,
              stopOverlayPropagation: false,
            }}
            onTravelStatusChange={setTravelStatus}
          >
            <Sheet.Content asChild>
              <Sheet.SpecialWrapper.Root className="Toast-content">
                <Sheet.SpecialWrapper.Content>
                  <div
                    className="Toast-innerContent"
                    onPointerEnter={() => setPointerOver(true)}
                    onPointerLeave={() => setPointerOver(false)}
                  >
                    {sheetContent}
                  </div>
                </Sheet.SpecialWrapper.Content>
              </Sheet.SpecialWrapper.Root>
            </Sheet.Content>
          </Sheet.View>
        </div>
      </Sheet.Portal>
    </Sheet.Root>
  );
};

const ReplQuickToast = ({
  title,
  description,
  presented,
  onPresentedChange,
}: {
  title: string;
  description: string;
  presented: boolean;
  onPresentedChange: (presented: boolean) => void;
}) => {
  return (
    <Toast
      presented={presented}
      onPresentedChange={onPresentedChange}
      sheetContent={
        <div className="ExampleToast-root">
          <div className="ExampleToast-illustration" />
          <Sheet.Title className="ExampleToast-title">{title}</Sheet.Title>
          <Sheet.Description className="ExampleToast-description">
            {description}
          </Sheet.Description>
        </div>
      }
    />
  );
};

export { Toast, ReplQuickToast };
