import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ConfigurationPage from "./ConfigurationPage";

describe("Test ConfigurationPage", () => {
    test("renders correctly", () => {
        render(<ConfigurationPage />);

        expect(screen.getByText("Configuración")).toBeInTheDocument();
    });

    test("opens and closes the modal", async () => {
        render(<ConfigurationPage />);

        const button = screen.getByRole("button", {
            name: /delete account/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText(
            "¿Estás seguro que querés eliminar tu cuenta?"
        );
        expect(modal).toBeInTheDocument();

        const cancelButton = await screen.findByRole("button", {
            name: /Cancelar/i,
        });
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(
            screen.queryByText(/¿Estás seguro que querés eliminar tu cuenta?/i)
        ).not.toBeInTheDocument();
    });
});
