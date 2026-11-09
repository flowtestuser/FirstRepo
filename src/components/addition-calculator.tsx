"use client";

import { useRef, useState } from "react";
import { addDecimalStrings, type AdditionResult } from "@/lib/addition";

export function AdditionCalculator() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const calculation = addDecimalStrings(first, second);
  const firstHasError =
    (calculation.status === "invalid" ||
      calculation.status === "out-of-range") &&
    calculation.operand === "first";
  const secondHasError =
    (calculation.status === "invalid" ||
      calculation.status === "out-of-range") &&
    calculation.operand === "second";
  const message = getMessage(calculation);

  function clearOperands() {
    setFirst("");
    setSecond("");
    firstInputRef.current?.focus();
  }

  return (
    <section className="calculator" aria-labelledby="calculator-title">
      <div className="calculator-topline">
        <h2 id="calculator-title">Add two numbers</h2>
        <span className="operation-mark" aria-hidden="true">
          +
        </span>
      </div>

      <div className="operand-grid">
        <div className="operand-field">
          <label htmlFor="first-number">First number</label>
          <input
            ref={firstInputRef}
            autoComplete="off"
            id="first-number"
            inputMode="decimal"
            aria-describedby="calculation-guidance"
            aria-invalid={firstHasError}
            onChange={(event) => setFirst(event.target.value)}
            placeholder="e.g. 24"
            type="text"
            value={first}
          />
        </div>

        <span className="operator" aria-hidden="true">
          +
        </span>

        <div className="operand-field">
          <label htmlFor="second-number">Second number</label>
          <input
            autoComplete="off"
            id="second-number"
            inputMode="decimal"
            aria-describedby="calculation-guidance"
            aria-invalid={secondHasError}
            onChange={(event) => setSecond(event.target.value)}
            placeholder="e.g. 18"
            type="text"
            value={second}
          />
        </div>
      </div>

      <div className="answer-area" aria-live="polite" aria-atomic="true">
        <p className="answer-label">Your total</p>
        {calculation.status === "valid" ? (
          <output
            className="answer-value"
            aria-label={`The sum is ${calculation.sum}`}
          >
            {calculation.sum}
          </output>
        ) : (
          <p className="answer-placeholder">—</p>
        )}
        <p
          id="calculation-guidance"
          className={
            calculation.status === "invalid" ||
            calculation.status === "out-of-range"
              ? "guidance guidance-error"
              : "guidance"
          }
        >
          {message}
        </p>
      </div>

      <div className="calculator-actions">
        <p className="precision-note">
          Exact decimal addition, up to 100 digits per number.
        </p>
        <button
          className="clear-button"
          disabled={!first && !second}
          onClick={clearOperands}
          type="button"
        >
          Clear
        </button>
      </div>
    </section>
  );
}

function getMessage(result: AdditionResult): string {
  if (result.status === "incomplete") {
    return "Enter both numbers to see their sum.";
  }

  if (result.status === "invalid") {
    return `The ${result.operand} number needs digits, an optional sign, and one decimal point.`;
  }

  if (result.status === "out-of-range") {
    return `The ${result.operand} number is too long. Use up to 100 digits.`;
  }

  return "Updated as you type.";
}
