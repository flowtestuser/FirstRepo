import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateSum,
  formatNumber,
  parseNumericInput,
} from "./addition.js";

test("rejects empty and invalid input instead of coercing it to zero", () => {
  assert.deepEqual(parseNumericInput(""), {
    ok: false,
    reason: "empty",
  });
  assert.deepEqual(parseNumericInput("   "), {
    ok: false,
    reason: "empty",
  });
  assert.deepEqual(parseNumericInput("not a number"), {
    ok: false,
    reason: "invalid",
  });
  assert.deepEqual(parseNumericInput("12.5"), {
    ok: true,
    value: 12.5,
  });
});

test("adds positive integers and zero", () => {
  assert.deepEqual(calculateSum(14, 28), { ok: true, value: 42 });
  assert.deepEqual(calculateSum(0, 0), { ok: true, value: 0 });
});

test("adds negative and decimal values", () => {
  assert.deepEqual(calculateSum(-5, 2), { ok: true, value: -3 });
  const result = calculateSum(0.1, 0.2);

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.equal(formatNumber(result.value), "0.3");
  }
});

test("rejects non-finite inputs", () => {
  assert.deepEqual(calculateSum(Number.NaN, 2), {
    ok: false,
    reason: "overflow",
  });
});

test("rejects integer results outside safe precision", () => {
  assert.deepEqual(calculateSum(Number.MAX_SAFE_INTEGER, 1), {
    ok: false,
    reason: "precision",
  });
});

test("rejects arithmetic overflow", () => {
  assert.deepEqual(calculateSum(Number.MAX_VALUE, Number.MAX_VALUE), {
    ok: false,
    reason: "overflow",
  });
});
