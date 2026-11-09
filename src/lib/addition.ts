export type AdditionResult =
  | { status: "incomplete" }
  | { status: "invalid"; operand: "first" | "second" }
  | { status: "out-of-range"; operand: "first" | "second" }
  | { status: "valid"; sum: string };

type ParsedDecimal = {
  coefficient: bigint;
  scale: number;
};

const DECIMAL_PATTERN = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/;
const MAX_DIGITS = 100;

function parseDecimal(
  value: string,
): ParsedDecimal | "invalid" | "out-of-range" {
  const normalized = value.trim();
  const match = DECIMAL_PATTERN.exec(normalized);

  if (!match) {
    return "invalid";
  }

  const [, sign, whole = "0", decimal = "", fractionOnly] = match;
  const fraction = fractionOnly ?? decimal;
  const digitCount = `${whole}${fraction}`.length;

  if (digitCount > MAX_DIGITS) {
    return "out-of-range";
  }

  const coefficient = BigInt(`${whole}${fraction}` || "0");

  return {
    coefficient: sign === "-" ? -coefficient : coefficient,
    scale: fraction.length,
  };
}

function formatDecimal(coefficient: bigint, scale: number): string {
  if (coefficient === 0n) {
    return "0";
  }

  const isNegative = coefficient < 0n;
  const digits = (isNegative ? -coefficient : coefficient)
    .toString()
    .padStart(scale + 1, "0");
  const integer = scale === 0 ? digits : digits.slice(0, -scale);
  const fraction = scale === 0 ? "" : digits.slice(-scale).replace(/0+$/, "");
  const sign = isNegative ? "-" : "";

  return fraction ? `${sign}${integer}.${fraction}` : `${sign}${integer}`;
}

export function addDecimalStrings(
  first: string,
  second: string,
): AdditionResult {
  if (!first.trim() || !second.trim()) {
    return { status: "incomplete" };
  }

  const parsedFirst = parseDecimal(first);
  if (parsedFirst === "invalid") {
    return { status: "invalid", operand: "first" };
  }
  if (parsedFirst === "out-of-range") {
    return { status: "out-of-range", operand: "first" };
  }

  const parsedSecond = parseDecimal(second);
  if (parsedSecond === "invalid") {
    return { status: "invalid", operand: "second" };
  }
  if (parsedSecond === "out-of-range") {
    return { status: "out-of-range", operand: "second" };
  }

  const scale = Math.max(parsedFirst.scale, parsedSecond.scale);
  const firstValue =
    parsedFirst.coefficient * 10n ** BigInt(scale - parsedFirst.scale);
  const secondValue =
    parsedSecond.coefficient * 10n ** BigInt(scale - parsedSecond.scale);

  return {
    status: "valid",
    sum: formatDecimal(firstValue + secondValue, scale),
  };
}
