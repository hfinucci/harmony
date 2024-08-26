import { SongService } from "../../service/songService.ts";
import { UserService } from "../../service/userService.ts";
import {afterEach, describe, expect, test, vi} from "vitest";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import CreateSongModal from "./CreateSongModal.tsx";
import {BrowserRouter} from "react-router-dom";
import {userEvent} from "@testing-library/user-event";
//
// vi.mock("../../service/songService.ts", () => ({
//     SongService: {
//         createSong: vi.fn(),
//         getSongById: vi.fn()
//     }
// }));
// vi.mock("../../service/userService.ts", () => ({
//     UserService: {
//         getUserOrgs: vi.fn(),
//         getOrgAlbums: vi.fn()
//     }
// }));
//
// const mockCallback = vi.fn();
//
// describe("Test CreateSorgModal", () => {
//     afterEach(() => {
//         vi.clearAllMocks();
//     });
//
//     test("should create song", async () => {
//         const user = userEvent.setup();
//         // mock response
//         const mockOrgsResponse = {
//             status: 200,
//             json: vi.fn().mockResolvedValue([
//                 { id: 1, name: "org1", image: "https://example.com/image1.jpg" },
//                 { id: 2, name: "org2", image: "https://example.com/image2.jpg" },
//                 { id: 3, name: "org3", image: "https://example.com/image3.jpg" },
//                 { id: 4, name: "org4", image: "https://example.com/image4.jpg" }
//             ])
//         }
//         const mockCreateSongResponse = {
//             status: 200,
//             json: vi.fn().mockResolvedValue({ id: 1 })
//         }
//         const mockGetSongResponse = {
//             status: 200,
//             json: vi.fn().mockResolvedValue({ id: 1, name: "SONGSONG1", org: "org1", composeid: "1", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "1" })
//         }
//         SongService.createSong.mockResolvedValue(mockCreateSongResponse);
//         UserService.getUserOrgs.mockResolvedValue(mockOrgsResponse);
//         SongService.getSongById.mockResolvedValue(mockGetSongResponse);
//
//         render(
//             <BrowserRouter>
//                     <CreateSongModal callback={mockCallback} />
//             </BrowserRouter>
//         );
//
//         const showModalButton = screen.getByLabelText("create song");
//         act(() => showModalButton.click());
//
//         const nameInput = await screen.findByTestId("create-org-name")
//         const orgInput = await screen.findByRole("combobox");
//         const submitButton = await screen.findByRole("button", {
//             name: "components.createSongModal.create"
//         });
//
//         act(() => {
//             fireEvent.input(nameInput, { target: { value: "SONGSONG1" } });
//             user.selectOptions(orgInput, "1");
//             user.click(submitButton)
//         });
//
//         await waitFor(() => expect(SongService.createSong).toHaveBeenCalled());
//     });
//
//     test("should cancel create song", async () => {
//         const user = userEvent.setup();
//         // mock response
//         const mockOrgsResponse = {
//             status: 200,
//             json: vi.fn().mockResolvedValue([
//                 { id: 1, name: "org1", image: "https://example.com/image1.jpg" },
//                 { id: 2, name: "org2", image: "https://example.com/image2.jpg" },
//                 { id: 3, name: "org3", image: "https://example.com/image3.jpg" },
//                 { id: 4, name: "org4", image: "https://example.com/image4.jpg" }
//             ])
//         }
//         UserService.getUserOrgs.mockResolvedValue(mockOrgsResponse);
//
//         render(
//             <BrowserRouter>
//                 <CreateSongModal callback={mockCallback} />
//             </BrowserRouter>
//         );
//
//         const showModalButton = screen.getByLabelText("create song");
//         act(() => showModalButton.click());
//
//         const cancelButton = await screen.findByText("components.createSongModal.cancel")
//
//         act(() => {
//             fireEvent.click(cancelButton, { target: { value: "SONGSONG1" } });
//         });
//
//         await waitFor(() => expect(SongService.createSong).toHaveBeenCalled);
//     });
// });