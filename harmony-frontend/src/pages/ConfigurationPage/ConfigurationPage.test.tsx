import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ConfigurationPage from "./ConfigurationPage";
import { BrowserRouter } from "react-router-dom";

describe("Test ConfigurationPage", () => {
    test("renders correctly", () => {
        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        expect(screen.getByText("Configuration")).toBeInTheDocument();
    });

    test("opens and closes the modal", async () => {
        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const button = screen.getByRole("button", {
            name: /delete account/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText(
            "Are you sure you want to delete your account?"
        );
        expect(modal).toBeInTheDocument();

        const cancelButton = await screen.findByRole("button", {
            name: /Cancel/i,
        });
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(
            screen.queryByText(/Are you sure you want to delete your account?/i)
        ).not.toBeInTheDocument();
    });
});
