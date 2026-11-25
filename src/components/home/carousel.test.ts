import { describe, expect, it } from "vitest";
import { circularOffset, wrapIndex } from "./carousel";

describe("feature carousel positions", () => {
  it("wraps past the last card back to the first", () => {
    expect(wrapIndex(5, 5)).toBe(0);
    expect(wrapIndex(-1, 5)).toBe(4);
  });

  it("places the last card immediately left of the first when the first is active", () => {
    expect(circularOffset(4, 0, 5)).toBe(-1);
    expect(circularOffset(1, 0, 5)).toBe(1);
    expect(circularOffset(0, 0, 5)).toBe(0);
  });

  it("keeps every card within two positions of the active one", () => {
    for (let active = 0; active < 5; active++) {
      for (let i = 0; i < 5; i++) {
        expect(Math.abs(circularOffset(i, active, 5))).toBeLessThanOrEqual(2);
      }
    }
  });
});
