"use client";
import React from "react";
import { Sheet, SheetRootProps } from "@silk-hq/components";
import "./Sidebar.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface Props extends SheetRootDivProps {
  presentTrigger: React.ReactNode;
  sheetContent: React.ReactNode;
  contentPlacement?: "left" | "right";
}

const Sidebar = ({
  presentTrigger,
  sheetContent,
  contentPlacement = "left",
  ...restProps
}: Props) => {
  return (
    <Sheet.Root license="commercial" sheetRole="dialog" {...restProps}>
      {presentTrigger}
      <Sheet.Portal>
        <Sheet.View
          className={`Sidebar-view${
            restProps.className ? ` ${restProps.className}` : ""
          }`}
          contentPlacement={contentPlacement}
          swipeOvershoot={false}
          nativeEdgeSwipePrevention={true}
        >
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content className="Sidebar-content">
            {sheetContent}
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
};

export { Sidebar };
