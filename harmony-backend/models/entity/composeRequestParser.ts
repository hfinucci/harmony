import {AppendBlock, AppendRow, ComposeUseCase, EditBlock, InitializeRoom, DeleteBlock} from "./useCases";
import {logger} from "../../server";

const useCases = [
    new AppendRow(),
    new AppendBlock(),
    new EditBlock(),
    new DeleteBlock(),
    new InitializeRoom()
];

export class ComposeRequestParser {

    public static parse(rawRequest: string): ComposeUseCase | undefined {
        let request: string;
        try {
            request = JSON.parse(rawRequest);
        } catch (e) {
            logger.error("Error in JSON parse: " + e)
            return undefined;
        }
        for (let i = 0; i <= useCases.length; i++) {
            try {
                let result = useCases[i].parse(request);
                if (result) {
                    return useCases[i];
                }
            } catch (e) {
                logger.error("Error parsing useCase: " + e)
            }
        }
        return undefined
    }
}