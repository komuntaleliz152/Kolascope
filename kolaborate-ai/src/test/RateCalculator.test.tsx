import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RatesPage from "@/app/rates/page";

describe("Rate Calculator", () => {
  it("renders the page title", () => {
    render(<RatesPage />);
    expect(screen.getByText("Rate Calculator")).toBeInTheDocument();
  });

  it("shows calculate button", () => {
    render(<RatesPage />);
    expect(screen.getByText("Calculate My Rate")).toBeInTheDocument();
  });

  it("button is disabled when inputs are empty", () => {
    render(<RatesPage />);
    const button = screen.getByText("Calculate My Rate");
    expect(button).toBeDisabled();
  });

  it("calculates rates when inputs are filled", () => {
    render(<RatesPage />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "1500" } }); // expenses
    fireEvent.change(inputs[1], { target: { value: "500" } });  // profit
    const button = screen.getByText("Calculate My Rate");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(screen.getByText("Minimum Rate")).toBeInTheDocument();
    expect(screen.getByText("Recommended Rate")).toBeInTheDocument();
    expect(screen.getByText("Premium Rate")).toBeInTheDocument();
  });
});
