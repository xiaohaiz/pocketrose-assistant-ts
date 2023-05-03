import Processor from "./Processor";
import BattleProcessor from "./battle/BattleProcessor";
import CastleDashboardProcessor from "./dashboard/CastleDashboardProcessor";
import CastleEntranceProcessor from "./castle/CastleEntranceProcessor";
import CastlePostHouseProcessor from "./castle/CastlePostHouseProcessor";
import CastleWareHouseProcessor from "./castle/CastleWareHouseProcessor";
import EventDashboardProcessor from "./dashboard/EventDashboardProcessor";
import LoginDashboardProcessor from "./dashboard/LoginDashboardProcessor";
import MapDashboardProcessor from "./dashboard/MapDashboardProcessor";
import MapPostHouseProcessor from "./map/MapPostHouseProcessor";
import PersonalCareerManagementProcessor from "./personal/PersonalCareerManagementProcessor";
import PersonalEquipmentManagementProcessor from "./personal/PersonalEquipmentManagementProcessor";
import PersonalFastLoginProcessor from "./personal/PersonalFastLoginProcessor";
import PersonalPetManagementProcessor from "./personal/PersonalPetManagementProcessor";
import PersonalSetupProcessor from "./personal/PersonalSetupProcessor";
import PersonalStatusProcessor from "./personal/PersonalStatusProcessor";
import TownAdventureGuildProcessor from "./town/TownAdventureGuildProcessor";
import TownDashboardProcessor from "./dashboard/TownDashboardProcessor";
import TownListDashboardProcessor from "./dashboard/TownListDashboardProcessor";
import TownPostHouseProcessor from "./town/TownPostHouseProcessor";

class ProcessorManager {

    readonly #processors: Processor[];

    constructor() {
        this.#processors = [
            new BattleProcessor(),
            new CastleDashboardProcessor(),
            new CastleEntranceProcessor(),
            new CastlePostHouseProcessor(),
            new CastleWareHouseProcessor(),
            new EventDashboardProcessor(),
            new LoginDashboardProcessor(),
            new MapDashboardProcessor(),
            new MapPostHouseProcessor(),
            new PersonalCareerManagementProcessor(),
            new PersonalEquipmentManagementProcessor(),
            new PersonalFastLoginProcessor(),
            new PersonalPetManagementProcessor(),
            new PersonalSetupProcessor(),
            new PersonalStatusProcessor(),
            new TownAdventureGuildProcessor(),
            new TownDashboardProcessor(),
            new TownListDashboardProcessor(),
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