import { calculateSum, formatNumber, parseNumericInput } from "./addition.js";

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Required app element not found: ${selector}`);
  }

  return element;
}

const form = getRequiredElement<HTMLFormElement>("#addition-form");
const firstField = getRequiredElement<HTMLInputElement>("#first-number");
const secondField = getRequiredElement<HTMLInputElement>("#second-number");
const result = getRequiredElement<HTMLOutputElement>("#sum-result");
const feedback = getRequiredElement<HTMLParagraphElement>("#feedback");

function setInvalidState(field: HTMLInputElement, invalid: boolean): void {
  field.setAttribute("aria-invalid", String(invalid));
}

function updateSum(): void {
  const fields = [firstField, secondField];
  const malformedField = fields.find((field) => field.validity.badInput);

  if (malformedField) {
    setInvalidState(firstField, malformedField === firstField);
    setInvalidState(secondField, malformedField === secondField);
    result.textContent = "—";
    feedback.textContent = "Use a valid number in both fields.";
    return;
  }

  const firstValue = parseNumericInput(firstField.value);
  const secondValue = parseNumericInput(secondField.value);

  if (
    (!firstValue.ok && firstValue.reason === "empty") ||
    (!secondValue.ok && secondValue.reason === "empty")
  ) {
    setInvalidState(firstField, false);
    setInvalidState(secondField, false);
    result.textContent = "—";
    feedback.textContent = "Enter both numbers to see the sum.";
    return;
  }

  if (!firstValue.ok || !secondValue.ok) {
    setInvalidState(firstField, !firstValue.ok);
    setInvalidState(secondField, !secondValue.ok);
    result.textContent = "—";
    feedback.textContent = "Use a valid number in both fields.";
    return;
  }

  setInvalidState(firstField, false);
  setInvalidState(secondField, false);

  const calculation = calculateSum(firstValue.value, secondValue.value);

  if (!calculation.ok) {
    result.textContent = "—";
    feedback.textContent =
      calculation.reason === "precision"
        ? "That whole-number total is beyond the precision this tool can safely show. Try smaller values."
        : "Those numbers are too large to add safely. Try smaller values.";
    setInvalidState(firstField, true);
    setInvalidState(secondField, true);
    return;
  }

  result.textContent = formatNumber(calculation.value);
  feedback.textContent = "Sum updated.";
}

form.addEventListener("input", updateSum);
form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("reset", () => {
  window.requestAnimationFrame(() => {
    setInvalidState(firstField, false);
    setInvalidState(secondField, false);
    result.textContent = "—";
    feedback.textContent = "Enter both numbers to see the sum.";
    firstField.focus();
  });
});
