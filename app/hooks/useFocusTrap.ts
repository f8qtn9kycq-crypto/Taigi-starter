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

export function getFocusTrapIndex(currentIndex: number, length: number, reverse: boolean): number {
  if (length <= 0) return -1;
  if (reverse) return currentIndex <= 0 || currentIndex >= length ? length - 1 : currentIndex - 1;
  return currentIndex < 0 || currentIndex >= length - 1 ? 0 : currentIndex + 1;
}

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
    const focusInitial = () => {
      const first = initialFocus.current ?? focusableElements(dialogRef.current ?? document.body)[0];
      first?.focus();
    };
    focusInitial();
    const focusFrame = window.requestAnimationFrame(focusInitial);
    const focusTimer = window.setTimeout(focusInitial, 0);

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
      const isBoundary = event.shiftKey
        ? currentIndex <= 0 || currentIndex >= elements.length
        : currentIndex < 0 || currentIndex === elements.length - 1;
      if (isBoundary) {
        event.preventDefault();
        elements[getFocusTrapIndex(currentIndex, elements.length, event.shiftKey)].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [initialFocus, open, returnFocus]);

  return dialogRef;
}
