import {z} from "zod";
import {AppendBlock, AppendRow, ComposeUseCase, EditBlock, InitializeRoom} from "./useCases";
import {logger} from "../../server";

const useCases = [
    new AppendRow(),
    new AppendBlock(),
    new EditBlock(),
    new InitializeRoom()
];

export class ComposeRequestParser {

    public static parse(rawRequest: string): ComposeUseCase | undefined {
        let request: string;
        try {
            request = JSON.parse(rawRequest);
        } catch (e) {
            throw new Error("Invalid JSON");
        }
        for (let i = 0; i <= useCases.length; i++) {
            let result = useCases[i].parse(request);
            if (result) {
                return useCases[i];
            }
        }
        return undefined
    }
}