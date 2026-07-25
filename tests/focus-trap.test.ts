import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getFocusTrapIndex } from "../app/hooks/useFocusTrap.ts";

test("focus trap wraps forward and backward at dialog boundaries", () => {
  assert.equal(getFocusTrapIndex(-1, 3, false), 0);
  assert.equal(getFocusTrapIndex(2, 3, false), 0);
  assert.equal(getFocusTrapIndex(0, 3, true), 2);
  assert.equal(getFocusTrapIndex(-1, 3, true), 2);
  assert.equal(getFocusTrapIndex(0, 0, false), -1);
});

test("dialogs wire the shared focus trap and close controls", async () => {
  const [hook, review, feedback] = await Promise.all([
    readFile(new URL("../app/hooks/useFocusTrap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ReviewModal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/FeedbackForm.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(hook, /document\.addEventListener\("keydown", handleKeyDown\)/);
  assert.match(hook, /window\.clearTimeout|window\.cancelAnimationFrame/);
  assert.match(review, /useFocusTrap\(\{/);
  assert.match(review, /ref=\{dialogRef\}/);
  assert.match(feedback, /useFocusTrap\(\{/);
  assert.match(feedback, /returnFocus: triggerRef/);
  assert.match(feedback, /ref=\{dialogRef\}/);
  assert.match(feedback, /ref=\{closeRef\}/);
});
