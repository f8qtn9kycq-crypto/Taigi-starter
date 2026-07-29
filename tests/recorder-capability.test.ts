import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyRecorderError,
  detectRecorderSupport,
  getRecorderInitialStatus,
} from "../app/hooks/useRecorder.ts";

const getUserMedia = async (): Promise<MediaStream> => {
  throw new Error("not called");
};

test("recording capability is supported when both browser APIs exist", () => {
  assert.equal(detectRecorderSupport({ getUserMedia }, true), true);
});

test("recording capability is unavailable when MediaRecorder is missing", () => {
  assert.equal(detectRecorderSupport({ getUserMedia }, false), false);
});

test("recording capability is unavailable when microphone access is missing", () => {
  assert.equal(detectRecorderSupport(undefined, true), false);
});

test("checking resolves to idle when recording is supported", () => {
  assert.equal(getRecorderInitialStatus({ getUserMedia }, true), "idle");
});

test("checking resolves to unsupported when recording is unavailable", () => {
  assert.equal(getRecorderInitialStatus(undefined, true), "unsupported");
});

test("permission denial is reported separately from browser unavailability", () => {
  assert.equal(classifyRecorderError({ name: "NotAllowedError" }), "denied");
  assert.equal(classifyRecorderError(new Error("device unavailable")), "unsupported");
});
