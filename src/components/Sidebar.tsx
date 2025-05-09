"use client";
import React from "react";
import { Sheet } from "@silk-hq/components";
import "./Sidebar.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  presentTrigger: React.ReactNode;
  sheetContent: React.ReactNode;
}

const Sidebar = ({ presentTrigger, sheetContent, ...restProps }: Props) => {
  return (
    <Sheet.Root license="commercial" sheetRole="dialog" {...restProps}>
      {presentTrigger}
      <Sheet.Portal>
        <Sheet.View
          className="Sidebar-view"
          contentPlacement="left"
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
