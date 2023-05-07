import Processor from "./Processor";
import CastleEntranceProcessor from "./castle/CastleEntranceProcessor";
import CastlePostHouseProcessor from "./castle/CastlePostHouseProcessor";
import CastleRanchProcessor from "./castle/CastleRanchProcessor";
import CastleWareHouseProcessor from "./castle/CastleWareHouseProcessor";
import EventDashboardProcessor from "./common/EventDashboardProcessor";
import LoginDashboardProcessor from "./common/LoginDashboardProcessor";
import MapDashboardProcessor from "./map/MapDashboardProcessor";
import MapPostHouseProcessor from "./map/MapPostHouseProcessor";
import PersonalCareerManagementProcessor from "./personal/PersonalCareerManagementProcessor";
import PersonalEquipmentManagementProcessor from "./personal/PersonalEquipmentManagementProcessor";
import PersonalFastLoginProcessor from "./personal/PersonalFastLoginProcessor";
import PersonalPetManagementProcessor from "./personal/PersonalPetManagementProcessor";
import PersonalStatusProcessor from "./personal/PersonalStatusProcessor";
import TownAdventureGuildProcessor from "./town/TownAdventureGuildProcessor";
import TownDashboardProcessor from "./town/TownDashboardProcessor";
import TownListDashboardProcessor from "./common/TownListDashboardProcessor";
import TownPetMapProcessor from "./town/TownPetMapProcessor";
import TownPostHouseProcessor from "./town/TownPostHouseProcessor";
import TownGemHouseProcessor from "./town/TownGemHouseProcessor";
import TownPetRankHouseProcessor from "./town/TownPetRankHouseProcessor";
import TownCastleKeeperProcessor from "./town/TownCastleKeeperProcessor";

/**
 * @deprecated
 */
class ProcessorManager {

    readonly #processors: Processor[];

    constructor() {
        this.#processors = [
            new CastleEntranceProcessor(),
            new CastlePostHouseProcessor(),
            new CastleRanchProcessor(),
            new CastleWareHouseProcessor(),
            new EventDashboardProcessor(),
            new LoginDashboardProcessor(),
            new MapDashboardProcessor(),
            new MapPostHouseProcessor(),
            new PersonalCareerManagementProcessor(),
            new PersonalEquipmentManagementProcessor(),
            new PersonalFastLoginProcessor(),
            new PersonalPetManagementProcessor(),
            new PersonalStatusProcessor(),
            new TownAdventureGuildProcessor(),
            new TownCastleKeeperProcessor(),
            new TownDashboardProcessor(),
            new TownGemHouseProcessor(),
            new TownListDashboardProcessor(),
            new TownPetMapProcessor(),
            new TownPetRankHouseProcessor(),
            new TownPostHouseProcessor(),
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