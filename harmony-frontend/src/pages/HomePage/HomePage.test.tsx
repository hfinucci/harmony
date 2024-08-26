import {describe, vi, test, afterEach, expect} from "vitest";
import { UserService } from "../../service/userService.ts";
import { OrgService } from "../../service/orgService.ts";
import { SongService } from "../../service/songService.ts";
import {fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage.tsx";
import {Song} from "../SongsPage/SongsPage.tsx";
import {Org} from "../../types/dtos/Org.ts";

// vi.mock("../../service/userService.ts", () => ({
//     UserService: {
//         getUserOrgs: vi.fn(),
//         getSongsByUserId: vi.fn(),
//         getUserAlbums: vi.fn()
//     },
// }));
// vi.mock("../../service/orgService.ts", () => ({
//     OrgService: {
//         getOrgMembers: vi.fn()
//     },
// }));
// vi.mock("../../service/songService.ts", () => ({
//     SongService: {
//         createSong: vi.fn()
//     },
// }));
//
// describe("Test HomePage", () => {
//     // Clean up mocks
//     afterEach(() => {
//         vi.clearAllMocks();
//     });
//
//     test("view orgs and songs", async () => {
//         // Mock response
//         const mockOrgs: Org[] = [
//             { id: 1, name: "org1", image: "https://example.com/image1.jpg" },
//             { id: 2, name: "org2", image: "https://example.com/image2.jpg" },
//             { id: 3, name: "org3", image: "https://example.com/image3.jpg" }
//         ];
//         const mockOrgMembers = [
//             { id: 1, name: "member1" },
//             { id: 2, name: "member2" },
//             { id: 3, name: "member3" }
//         ];
//         const mockSongs: Song[] = [
//             { id: 1, name: "song1", org: "org1", composeid: "1", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "1" },
//             { id: 2, name: "song2", org: "org2", composeid: "2", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "2" },
//             { id: 3, name: "song3", org: "org3", composeid: "3", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "3" }
//         ];
//
//         localStorage.setItem("harmony-uid", "1")
//         UserService.getUserOrgs.mockResolvedValue({
//             status: 200,
//             json: vi.fn().mockResolvedValue(mockOrgs)
//         });
//         UserService.getSongsByUserId.mockResolvedValue(mockSongs);
//         OrgService.getOrgMembers.mockResolvedValue({
//             status: 200,
//             json: vi.fn().mockResolvedValue(mockOrgMembers)
//         });
//
//         render(
//             <BrowserRouter>
//                 <HomePage />
//             </BrowserRouter>
//         );
//
//         const orgsTitle = await screen.findByText("pages.home.myOrgs");
//         expect(orgsTitle).toBeInTheDocument();
//     });
//
//     test("view more than 3 orgs and more than 5 songs", async () => {
//         // Mock response
//         const mockOrgs: Org[] = [
//             { id: 1, name: "org1", image: "https://example.com/image1.jpg" },
//             { id: 2, name: "org2", image: "https://example.com/image2.jpg" },
//             { id: 3, name: "org3", image: "https://example.com/image3.jpg" },
//             { id: 4, name: "org4", image: "https://example.com/image4.jpg" }
//         ];
//         const mockOrgMembers = [
//             { id: 1, name: "member1" },
//             { id: 2, name: "member2" },
//             { id: 3, name: "member3" }
//         ];
//         const mockSongs: Song[] = [
//             { id: 1, name: "song1", org: "org1", composeid: "1", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "1" },
//             { id: 2, name: "song2", org: "org2", composeid: "2", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "2" },
//             { id: 3, name: "song3", org: "org3", composeid: "3", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "3" },
//             { id: 4, name: "song4", org: "org4", composeid: "4", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "4" },
//             { id: 5, name: "song5", org: "org1", composeid: "5", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "5" },
//             { id: 6, name: "song6", org: "org2", composeid: "6", created: "2021-01-01", lastmodified: "2021-01-01", composeId: "6" }
//         ];
//
//         localStorage.setItem("harmony-uid", "1")
//         UserService.getUserOrgs.mockResolvedValue({
//             status: 200,
//             json: vi.fn().mockResolvedValue(mockOrgs)
//         });
//         UserService.getSongsByUserId.mockResolvedValue(mockSongs);
//         OrgService.getOrgMembers.mockResolvedValue({
//             status: 200,
//             json: vi.fn().mockResolvedValue(mockOrgMembers)
//         });
//
//         render(
//             <BrowserRouter>
//                 <HomePage />
//             </BrowserRouter>
//         );
//
//         const orgsTitle = await screen.findByText("pages.home.more");
//         expect(orgsTitle).toBeInTheDocument();
//     });
// });