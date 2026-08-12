import assert from "node:assert/strict";
import test from "node:test";
import { getExternalFormUrl } from "../app/services/feedback.ts";

test("accepts and normalizes an HTTPS external form URL", () => {
  assert.equal(
    getExternalFormUrl("  https://forms.example.test/viewform?x=1  "),
    "https://forms.example.test/viewform?x=1",
  );
});

test("rejects missing, HTTP, and malformed external form URLs", () => {
  assert.equal(getExternalFormUrl(undefined), null);
  assert.equal(getExternalFormUrl(""), null);
  assert.equal(getExternalFormUrl("http://forms.example.test/viewform"), null);
  assert.equal(getExternalFormUrl("not-a-url"), null);
});
