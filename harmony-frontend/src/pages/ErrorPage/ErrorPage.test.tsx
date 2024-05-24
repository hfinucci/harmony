import {describe, test, expect} from "vitest";
import {render, screen } from "@testing-library/react";
import ErrorPage from "./ErrorPage.tsx";
import { BrowserRouter } from "react-router-dom";


describe("Test ErrorPage", () => {
    test("render error page correctly", async () => {
        render(
            <BrowserRouter>
                <ErrorPage/>
            </BrowserRouter>
        );

        const errorTitle = await screen.findByText("Error 404");
        const errorMessage = await screen.findByText("pages.error.default");

        expect(errorTitle).toBeInTheDocument();
        expect(errorMessage).toBeInTheDocument();
    });
});