import React, { useState } from "react";
import { Sheet } from "@silk-hq/components";
import { useEscapeKey } from "../hooks/useEscapeKey";
import "./BottomSheet.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  presentTrigger: React.ReactNode;
  sheetContent: React.ReactNode;
}

const BottomSheet = ({ presentTrigger, sheetContent, ...restProps }: Props) => {
  const [presented, setPresented] = useState(false);
  useEscapeKey(presented, setPresented);

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
