import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { describe, expect, test } from "vitest";
import {BrowserRouter} from "react-router-dom";

describe("Test LandingPage", () => {
    test("renders correctly", () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText("Harmony")).toBeInTheDocument();
        expect(
            screen.getByAltText("pages.landingPage.guitarists")
        ).toBeInTheDocument();
        expect(
            screen.getByAltText("pages.landingPage.jazzband")
        ).toBeInTheDocument();
        expect(
            screen.getByAltText("pages.landingPage.listening")
        ).toBeInTheDocument();
        expect(
            screen.getByAltText("pages.landingPage.rockband")
        ).toBeInTheDocument();
    });
});
