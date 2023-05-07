import Processor from "./Processor";
import CastleEntranceProcessor from "./castle/CastleEntranceProcessor";
import PersonalCareerManagementProcessor from "./personal/PersonalCareerManagementProcessor";
import PersonalEquipmentManagementProcessor from "./personal/PersonalEquipmentManagementProcessor";
import PersonalFastLoginProcessor from "./personal/PersonalFastLoginProcessor";
import PersonalPetManagementProcessor from "./personal/PersonalPetManagementProcessor";
import PersonalStatusProcessor from "./personal/PersonalStatusProcessor";

/**
 * @deprecated
 */
class ProcessorManager {

    readonly #processors: Processor[];

    constructor() {
        this.#processors = [
            new CastleEntranceProcessor(),
            new PersonalCareerManagementProcessor(),
            new PersonalEquipmentManagementProcessor(),
            new PersonalFastLoginProcessor(),
            new PersonalPetManagementProcessor(),
            new PersonalStatusProcessor(),
        ];
    }

    lookupProcessor(cgi: string): Processor | null {
        const pageText = $("body:first").text();
        for (const processor of this.#processors) {
            if (processor.accept(cgi, pageText)) {
                return processor;
            }
        }
        return null;
    }
}

export = ProcessorManager;