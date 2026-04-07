import { combineText } from "../navigation/utils/scanUtils";

test("combines multiple pages correctly", () => {
  const input = ["Hello", "World"];

  const result = combineText(input);

  expect(result).toContain("Page 1");
  expect(result).toContain("Hello");
  expect(result).toContain("Page 2");
  expect(result).toContain("World");
});