import Processor from "./Processor";
import CastleEntranceProcessor from "./castle/CastleEntranceProcessor";
import PersonalCareerManagementProcessor from "./personal/PersonalCareerManagementProcessor";
import PersonalEquipmentManagementProcessor from "./personal/PersonalEquipmentManagementProcessor";
import PersonalFastLoginProcessor from "./personal/PersonalFastLoginProcessor";
import PersonalPetManagementProcessor from "./personal/PersonalPetManagementProcessor";
import PersonalStatusProcessor from "./personal/PersonalStatusProcessor";
import TownAdventureGuildProcessor from "./town/TownAdventureGuildProcessor";
import TownDashboardProcessor from "./town/TownDashboardProcessor";
import TownGemHouseProcessor from "./town/TownGemHouseProcessor";
import TownCastleKeeperProcessor from "./town/TownCastleKeeperProcessor";

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
            new TownAdventureGuildProcessor(),
            new TownCastleKeeperProcessor(),
            new TownDashboardProcessor(),
            new TownGemHouseProcessor(),
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