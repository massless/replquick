import { useEffect } from "react";

export const useEscapeKey = (
  presented: boolean,
  setPresented: (value: boolean) => void
) => {
  useEffect(() => {
    if (!presented) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPresented(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presented, setPresented]);
};
