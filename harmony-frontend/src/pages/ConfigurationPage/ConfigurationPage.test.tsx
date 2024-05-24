import { fireEvent, render, screen, act } from "@testing-library/react";
import {describe, expect, test, vi, afterEach} from "vitest";
import ConfigurationPage from "./ConfigurationPage";
import { BrowserRouter } from "react-router-dom";
import { ImageService } from "../../service/imageService.ts";
import { UserService} from "../../service/userService.ts";

// Mock services
vi.mock("../../service/imageService.ts", () => ({
    ImageService: {
        getProfileImages: vi.fn(),
    },
}));
vi.mock("../../service/userService.ts", () => ({
    UserService: {
        changeProfileImage: vi.fn(),
        deleteAccount: vi.fn(),
        changePassword: vi.fn(),
    },
}));

describe("Test ConfigurationPage", () => {
    // Clean up mocks
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("opens and closes the delete account modal", async () => {
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

    test("delete account successfully", async () => {
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

        const mockResponse = {
            status: 200,
        };

        // Set up mock implementation
        UserService.deleteAccount.mockResolvedValue(mockResponse);

        const submitButton = await screen.findByRole("button", {
            name: /Yes/i,
        });
        expect(submitButton).toBeInTheDocument();

        await act(() => fireEvent.click(submitButton));
        expect(screen.queryByText(/Are you sure you want to delete your account?/i)).not.toBeInTheDocument();
    });

    test("delete account fails", async () => {
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

        const mockResponse = {
            status: 400,
        };

        // Set up mock implementation
        UserService.deleteAccount.mockResolvedValue(mockResponse);

        const submitButton = await screen.findByRole("button", {
            name: /Yes/i,
        });
        expect(submitButton).toBeInTheDocument();

        await act(() => fireEvent.click(submitButton));
        expect(screen.queryByText("Error deleting account")).toBeInTheDocument();
    });

    test("opens and closes the change password modal", async () => {
        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const button = screen.getByRole("button", {
            name: /change password/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText("New password");
        expect(modal).toBeInTheDocument();

        const cancelButton = await screen.findByRole("button", {
            name: /Close/i,
        });
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(screen.queryByText(/New password/i)).not.toBeInTheDocument();
    })

    test("opens and closes the change profile image modal", async () => {
        // Mocked response data
        const mockImages = [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ];
        const mockResponse = {
            status: 200,
            json: vi.fn().mockResolvedValue(mockImages),
        };

        // Set up mock implementation
        ImageService.getProfileImages.mockResolvedValue(mockResponse);
        localStorage.setItem('harmony-profile-image', 'https://example.com/image1.jpg');

        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const button = screen.getByRole("button", {
            name: /change image/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText("Change Profile Image");
        expect(modal).toBeInTheDocument();

        const cancelButton = await screen.findByRole("button", {
            name: /Cancel/i,
        });
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(screen.queryByText("Change Profile Image")).not.toBeInTheDocument();
    })

    test("changes profile image successfully", async () => {
        // Mocked response data
        const mockImages = [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ];
        const mockGetResponse = {
            status: 200,
            json: vi.fn().mockResolvedValue(mockImages),
        };

        // Set up mock implementation
        ImageService.getProfileImages.mockResolvedValue(mockGetResponse);
        localStorage.setItem('harmony-profile-image', 'https://example.com/image1.jpg');

        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const button = screen.getByRole("button", {
            name: /change image/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText("Change Profile Image");
        expect(modal).toBeInTheDocument();

        const mockPutResponse = {
            status: 200,
            text: vi.fn().mockResolvedValue(mockImages[1]),
        };

        // Set up mock implementation
        UserService.changeProfileImage.mockResolvedValue(mockPutResponse);

        // Select the second image
        const image2 = await screen.findByTestId("image2.jpg");
        fireEvent.click(image2);

        const submitButton = await screen.findByRole("button", {
            name: "Change",
        });
        expect(submitButton).toBeInTheDocument();

        await act(() => fireEvent.click(submitButton));
        expect(screen.queryByText("Change Profile Image")).not.toBeInTheDocument();
    });

    test("fails to change profile image due to empty body", async () => {
        // Mocked response data
        const mockImages = [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ];
        const mockGetResponse = {
            status: 200,
            json: vi.fn().mockResolvedValue(mockImages),
        };

        // Set up mock implementation
        ImageService.getProfileImages.mockResolvedValue(mockGetResponse);
        localStorage.setItem('harmony-profile-image', 'https://example.com/image1.jpg');

        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const button = screen.getByRole("button", {
            name: /change image/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText("Change Profile Image");
        expect(modal).toBeInTheDocument();

        const submitButton = await screen.findByRole("button", {
            name: "Change",
        });
        expect(submitButton).toBeInTheDocument();

        await act(() => fireEvent.click(submitButton));
        expect(UserService.changeProfileImage).not.toHaveBeenCalled();
        expect(screen.queryByText("Change Profile Image")).not.toBeInTheDocument();
    });

    test("fails to change profile image due to bad request", async () => {
        // Mocked response data
        const mockImages = [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ];
        const mockGetResponse = {
            status: 200,
            json: vi.fn().mockResolvedValue(mockImages),
        };

        // Set up mock implementation
        ImageService.getProfileImages.mockResolvedValue(mockGetResponse);
        localStorage.setItem('harmony-profile-image', 'https://example.com/image1.jpg');

        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const button = screen.getByRole("button", {
            name: /change image/i,
        });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = await screen.findByText("Change Profile Image");
        expect(modal).toBeInTheDocument();

        const mockPutResponse = {
            status: 400,
            text: vi.fn().mockResolvedValue(mockImages[1]),
        };

        // Set up mock implementation
        UserService.changeProfileImage.mockResolvedValue(mockPutResponse);

        // Select the second image
        const image2 = await screen.findByTestId("image2.jpg");
        fireEvent.click(image2);

        const submitButton = await screen.findByRole("button", {
            name: "Change",
        });
        expect(submitButton).toBeInTheDocument();

        await act(() => fireEvent.click(submitButton));
        expect(screen.queryByText(/Error changing profile image, please try again/i)).toBeInTheDocument();
    });

    test("changes language successfully", async () => {
        render(
            <BrowserRouter>
                <ConfigurationPage />
            </BrowserRouter>
        );

        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();

        fireEvent.change(select, { target: { value: "es" } });
        expect(screen.queryByText("English")).not.toBeChecked();
    });
});
