import { useEffect } from "react";
import { trackEvent } from "../stats";

export const useTextSelectionTracking = (generationId?: string) => {
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText && selectedText.length > 0) {
        trackEvent("text_selected", {
          textLength: selectedText.length,
          generationId: generationId || "unknown",
        });
      }
    };

    document.addEventListener("mouseup", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, [generationId]);
};
