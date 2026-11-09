/**
 * @typedef {{ ok: true, value: number } | { ok: false, reason: "precision" | "overflow" }} CalculationResult
 * @typedef {{ ok: true, value: number } | { ok: false, reason: "empty" | "invalid" }} ParsedInput
 */

/**
 * Parse a non-empty numeric input without treating blank text as zero.
 * @param {string} value
 * @returns {ParsedInput}
 */
export function parseNumericInput(value) {
  if (value.trim() === "") {
    return { ok: false, reason: "empty" };
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, value: parsed };
}

/**
 * Add two finite numbers without presenting an unsafe integer result as exact.
 * @param {number} first
 * @param {number} second
 * @returns {CalculationResult}
 */
export function calculateSum(first, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return { ok: false, reason: "overflow" };
  }

  const sum = first + second;

  if (!Number.isFinite(sum)) {
    return { ok: false, reason: "overflow" };
  }

  if (
    Number.isInteger(first) &&
    Number.isInteger(second) &&
    !Number.isSafeInteger(sum)
  ) {
    return { ok: false, reason: "precision" };
  }

  return { ok: true, value: sum };
}

/**
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumSignificantDigits: 15,
  }).format(value);
}
