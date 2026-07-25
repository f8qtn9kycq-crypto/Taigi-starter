import { RefObject, useEffect, useRef } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(",");

type FocusTrapOptions = {
  initialFocus: RefObject<HTMLElement | null>;
  onClose: () => void;
  open: boolean;
  returnFocus?: RefObject<HTMLElement | null>;
};

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

export function useFocusTrap({
  initialFocus,
  onClose,
  open,
  returnFocus,
}: FocusTrapOptions): RefObject<HTMLElement | null> {
  const dialogRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const returnTarget = returnFocus?.current ?? previousFocus;
    const focusInitial = window.requestAnimationFrame(() => {
      const first = initialFocus.current ?? focusableElements(dialogRef.current ?? document.body)[0];
      first?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const elements = focusableElements(dialogRef.current);
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && (currentIndex <= 0 || currentIndex === -1)) {
        event.preventDefault();
        elements[elements.length - 1].focus();
      } else if (!event.shiftKey && (currentIndex === elements.length - 1 || currentIndex === -1)) {
        event.preventDefault();
        elements[0].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusInitial);
      document.removeEventListener("keydown", handleKeyDown);
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [initialFocus, open, returnFocus]);

  return dialogRef;
}
