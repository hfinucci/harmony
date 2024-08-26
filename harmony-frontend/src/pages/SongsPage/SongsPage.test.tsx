import {describe, vi, test, afterEach, expect} from "vitest";
import { UserService } from "../../service/userService.ts";
import {render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SongsPage from "./SongsPage.tsx";

vi.mock("../../service/userService.ts", () => ({
    UserService: {
        getSongsByUserId: vi.fn()
    },
}));

describe("Test SongsPage", () => {
    // Clean up mocks
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("view songs", async () => {
        // Mock response
        const mockSongs = {
            page: 1,
            totalItems: 3,
            totalPages: 1,
            songs: [
                { id: 1, name: "song1", org: "org1", composeid: "1", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "1" },
                { id: 2, name: "song2", org: "org2", composeid: "2", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "2" },
                { id: 3, name: "song3", org: "org3", composeid: "3", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "3" }
            ]
        };

        localStorage.setItem("harmony-uid", "1")
        UserService.getSongsByUserId.mockResolvedValue(mockSongs);

        render(
            <BrowserRouter>
                <SongsPage />
            </BrowserRouter>
        );

        expect(await screen.findByText("song1")).toBeDefined();
        expect(await screen.findByText("song2")).toBeDefined();
        expect(await screen.findByText("song3")).toBeDefined();
    });
});