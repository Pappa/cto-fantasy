import { generateProductFeatures } from "./features";

describe("generateProductFeatures", () => {
  it("should return product features", () => {
    const storyPointValues = [1, 2, 3, 5, 8, 13, 20];
    const { initial, rest } = generateProductFeatures(storyPointValues);
    const ids = [...initial, ...rest].map(({ id }) => id);
    expect(Array.isArray(initial)).toBeTruthy();
    expect(Array.isArray(rest)).toBeTruthy();
    expect(
      initial.every(
        ({ id, status, title, feature, effort, effortRemaining }) =>
          typeof id === "string" &&
          status === "TODO" &&
          typeof title === "string" &&
          typeof feature === "string" &&
          typeof effort === "number" &&
          typeof effortRemaining === "number"
      )
    ).toBeTruthy();
    expect(
      rest.every(
        ({ id, status, title, feature, effort, effortRemaining }) =>
          typeof id === "string" &&
          status === "NOT_VISIBLE" &&
          typeof title === "string" &&
          typeof feature === "string" &&
          typeof effort === "number" &&
          typeof effortRemaining === "number"
      )
    ).toBeTruthy();
    expect(new Set(ids).size).toBe(ids.length);
  });
});
