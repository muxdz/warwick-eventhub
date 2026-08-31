import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("renders basic JSX", () => {
  render(<p>Hello Vitest</p>);

  expect(
    screen.getByText("Hello Vitest")
  ).toBeInTheDocument();
});