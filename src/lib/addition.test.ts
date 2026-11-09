import { describe, expect, it } from "vitest";
import { addDecimalStrings } from "./addition";

describe("addDecimalStrings", () => {
  it("adds whole numbers", () => {
    expect(addDecimalStrings("12", "30")).toEqual({
      status: "valid",
      sum: "42",
    });
  });

  it("adds decimals without floating-point artifacts", () => {
    expect(addDecimalStrings("0.1", "0.2")).toEqual({
      status: "valid",
      sum: "0.3",
    });
  });

  it("supports negative and fractional operands", () => {
    expect(addDecimalStrings("-3.4", "1.1")).toEqual({
      status: "valid",
      sum: "-2.3",
    });
  });

  it("normalizes equivalent zero values", () => {
    expect(addDecimalStrings("-0.00", "0")).toEqual({
      status: "valid",
      sum: "0",
    });
  });

  it("returns an incomplete state when an operand is missing", () => {
    expect(addDecimalStrings("", "2")).toEqual({ status: "incomplete" });
  });

  it("rejects malformed input without coercing it to zero", () => {
    expect(addDecimalStrings("1.2.3", "2")).toEqual({
      status: "invalid",
      operand: "first",
    });
    expect(addDecimalStrings("1", "-")).toEqual({
      status: "invalid",
      operand: "second",
    });
  });

  it("rejects operands with more than 100 digits", () => {
    expect(addDecimalStrings("9".repeat(101), "1")).toEqual({
      status: "out-of-range",
      operand: "first",
    });
  });
});
