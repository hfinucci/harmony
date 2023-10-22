import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { describe, expect, test } from "vitest";

describe("Test LandingPage", () => {
    test("renders correctly", () => {
        render(<LandingPage />);

        expect(screen.getByText("Harmony")).toBeInTheDocument();
    });
});
