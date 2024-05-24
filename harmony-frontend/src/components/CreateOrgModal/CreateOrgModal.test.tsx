import { OrgService } from "../../service/orgService.ts";
import {afterEach, describe, expect, test, vi} from "vitest";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import CreateOrgModal from "./CreateOrgModal.tsx";
import {BrowserRouter} from "react-router-dom";

vi.mock("../../service/orgService.ts", () => ({
    OrgService: {
        createOrg: vi.fn()
    }
}))

describe("Test CreateOrgModal", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("should create org", async () => {
        // mock response
        const mockResponse = {
            status: 200,
            json: vi.fn().mockResolvedValue({ id: 1 })
        }
        OrgService.createOrg.mockResolvedValue(mockResponse);


        render(
            <BrowserRouter>
                    <CreateOrgModal />
            </BrowserRouter>
        );

        const showModalButton = screen.getByLabelText("create org");
        act(() => showModalButton.click());

        const nameInput = await screen.findByTestId("name")
        const imageInput = await screen.findByTestId("org-image");
        const submitButton = await screen.findByRole("button", {
            name: "components.createOrgModal.create"
        });

        act(() => {
            fireEvent.input(nameInput, { target: { value: "ORG1" } });
            fireEvent.input(imageInput, { target: { files: ["image"] } });
            fireEvent.submit(submitButton)
        });

        await waitFor(() => expect(OrgService.createOrg).toHaveBeenCalled());
    });

    test("should fail to create org", async () => {
        // mock response
        const mockResponse = {
            status: 400,
            json: vi.fn().mockResolvedValue({ id: 1 })
        }
        OrgService.createOrg.mockResolvedValue(mockResponse);


        render(
            <BrowserRouter>
                {/*<I18nextProvider i18n={i18n}>*/}
                <CreateOrgModal />
                {/*</I18nextProvider>*/}
            </BrowserRouter>
        );

        const showModalButton = screen.getByLabelText("create org");
        act(() => showModalButton.click());

        const nameInput = await screen.findByTestId("name")
        const imageInput = await screen.findByTestId("org-image");
        const submitButton = await screen.findByRole("button", {
            name: "components.createOrgModal.create"
        });

        act(() => {fireEvent.input(nameInput, { target: { value: "ORG1" } });
            fireEvent.input(imageInput, { target: { files: ["image"] } });
            fireEvent.submit(submitButton)});

        await waitFor(() => expect(OrgService.createOrg).toHaveBeenCalled());
    });

    test("should close modal", async () => {
        render(
            <BrowserRouter>
                <CreateOrgModal />
            </BrowserRouter>
        );

        const showModalButton = screen.getByLabelText("create org");
        act(() => showModalButton.click());

        const cancelButton = screen.getByText("components.createOrgModal.cancel");
        act(() => cancelButton.click());

        await waitFor(() => expect(screen.queryByText("components.createOrgModal.cancel")).not.toBeInTheDocument());
    });
});