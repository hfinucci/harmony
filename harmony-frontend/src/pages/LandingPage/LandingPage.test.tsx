import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { describe, expect, test } from "vitest";

describe("Test LandingPage", () => {
    test("renders correctly", () => {
        render(<LandingPage />);

        expect(screen.getByText("Harmony")).toBeInTheDocument();
        expect(screen.getByAltText("Guitarists")).toBeInTheDocument();
        expect(screen.getByAltText("Jazz band")).toBeInTheDocument();
        expect(
            screen.getByAltText("Listening to music in a room")
        ).toBeInTheDocument();
        expect(screen.getByAltText("Rock band")).toBeInTheDocument();
    });
});
