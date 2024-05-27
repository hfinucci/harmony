import {describe, vi, test, afterEach, expect} from "vitest";
import { UserService } from "../../service/userService.ts";
import { OrgService } from "../../service/orgService.ts";
import {render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {Org} from "../../types/dtos/Org.ts";
import OrgsPage from "./OrgsPage.tsx";

vi.mock("../../service/userService.ts", () => ({
    UserService: {
        getUserOrgs: vi.fn(),
    },
}));
vi.mock("../../service/orgService.ts", () => ({
    OrgService: {
        getOrgMembers: vi.fn()
    },
}));

describe("Test OrgsPage", () => {
    // Clean up mocks
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("view orgs", async () => {
        // Mock response
        const mockOrgs: Org[] = [
            { id: 1, name: "org1", image: "https://example.com/image1.jpg" },
            { id: 2, name: "org2", image: "https://example.com/image2.jpg" },
            { id: 3, name: "org3", image: "https://example.com/image3.jpg" }
        ];
        const mockOrgMembers = [
            { id: 1, name: "member1" },
            { id: 2, name: "member2" },
            { id: 3, name: "member3" }
        ];

        localStorage.setItem("harmony-uid", "1")
        UserService.getUserOrgs.mockResolvedValue({
            status: 200,
            json: vi.fn().mockResolvedValue(mockOrgs)
        });
        OrgService.getOrgMembers.mockResolvedValue({
            status: 200,
            json: vi.fn().mockResolvedValue(mockOrgMembers)
        });

        render(
            <BrowserRouter>
                <OrgsPage />
            </BrowserRouter>
        );

        // Check if orgs are displayed
        const org1 = await screen.findByText("org1");
        const org2 = await screen.findByText("org2");
        const org3 = await screen.findByText("org3");

        expect(org1).toBeInTheDocument();
        expect(org2).toBeInTheDocument();
        expect(org3).toBeInTheDocument();
    });

    // TODO: Fix test
    // test("view no orgs", async () => {
    //     // Mock response
    //     const mockOrgs: Org[] = [
    //     ];
    //     const mockOrgMembers = [
    //     ];
    //
    //     localStorage.setItem("harmony-uid", "1")
    //     UserService.getUserOrgs.mockResolvedValue({
    //         status: 200,
    //         json: vi.fn().mockResolvedValue(mockOrgs)
    //     });
    //     OrgService.getOrgMembers.mockResolvedValue({
    //         status: 200,
    //         json: vi.fn().mockResolvedValue(mockOrgMembers)
    //     });
    //
    //     render(
    //         <BrowserRouter>
    //             <OrgsPage />
    //         </BrowserRouter>
    //     );
    //
    //     // Check if orgs are displayed
    //     const noOrgs = await screen.findByText("pages.orgs.noSongs");
    //     expect(noOrgs).toBeInTheDocument();
    // });

});