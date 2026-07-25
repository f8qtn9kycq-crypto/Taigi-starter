import assert from "node:assert/strict";
import test from "node:test";
import {
  csvCell,
  FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS,
  isContentLengthTooLarge,
  isRateLimitAllowed,
  isSameOriginRequest,
  isSupportedJsonContentType,
  MAX_FEEDBACK_BODY_BYTES,
  rateLimitWindowStart,
} from "../app/utils/feedback-security.ts";

test("rejects cross-origin or malformed feedback requests", () => {
  assert.equal(isSameOriginRequest("https://taigi.example/api/feedback", "https://evil.example"), false);
  assert.equal(isSameOriginRequest("https://taigi.example/api/feedback", "not a URL"), false);
  assert.equal(isSameOriginRequest("https://taigi.example/api/feedback", "https://taigi.example"), true);
  assert.equal(isSameOriginRequest("https://taigi.example/api/feedback", null), true);
  assert.equal(isSupportedJsonContentType("application/json; charset=utf-8"), true);
  assert.equal(isSupportedJsonContentType("text/plain"), false);
});

test("bounds feedback body before JSON parsing", () => {
  assert.equal(isContentLengthTooLarge(String(MAX_FEEDBACK_BODY_BYTES)), false);
  assert.equal(isContentLengthTooLarge(String(MAX_FEEDBACK_BODY_BYTES + 1)), true);
  assert.equal(isContentLengthTooLarge("not-a-number"), true);
  assert.equal(isContentLengthTooLarge(null), false);
});

test("enforces the server-side feedback rate-limit policy", () => {
  assert.equal(isRateLimitAllowed(FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS), true);
  assert.equal(isRateLimitAllowed(FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS + 1), false);
  assert.equal(isRateLimitAllowed(1.5), false);
  assert.equal(rateLimitWindowStart(61_000), 60_000);
});

test("neutralizes spreadsheet formulas while preserving CSV escaping", () => {
  for (const formula of ["=1+1", "+cmd", "-1+1", "@SUM(A:A)", "  =1+1", "\t@cmd"]) {
    assert.equal(csvCell(formula).startsWith('"\''), true, formula);
  }
  assert.equal(csvCell('hello, "world"'), '"hello, ""world"""');
  assert.equal(csvCell("hello\nworld"), '"hello\nworld"');
});
