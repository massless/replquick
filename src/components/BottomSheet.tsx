import React from "react";
import { Sheet, SheetId, SheetRootProps } from "@silk-hq/components";
import "./BottomSheet.css";

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;
interface Props extends SheetRootDivProps {
  presentTrigger: React.ReactNode;
  sheetContent: React.ReactNode;
}

const BottomSheet = ({ presentTrigger, sheetContent, ...restProps }: Props) => {
  return (
    <Sheet.Root license="commercial" {...restProps}>
      {presentTrigger}
      <Sheet.Portal>
        <Sheet.View
          className="BottomSheet-view"
          nativeEdgeSwipePrevention={true}
        >
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content className="BottomSheet-content">
            <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
            {sheetContent}
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
};

export { BottomSheet };
