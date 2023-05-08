import PageInterceptor from "./PageInterceptor";
import BattlePageInterceptor from "./internal/BattlePageInterceptor";
import CastleDashboardPageInterceptor from "./internal/CastleDashboardPageInterceptor";
import CastlePostHousePageInterceptor from "./internal/CastlePostHousePageInterceptor";
import CastleRanchPageInterceptor from "./internal/CastleRanchPageInterceptor";
import CastleWarehousePageInterceptor from "./internal/CastleWarehousePageInterceptor";
import LoginDashboardPageInterceptor from "./internal/LoginDashboardPageInterceptor";
import MapDashboardPageInterceptor from "./internal/MapDashboardPageInterceptor";
import MapPostHousePageInterceptor from "./internal/MapPostHousePageInterceptor";
import NationInformationPageInterceptor from "./internal/NationInformationPageInterceptor";
import PersonalCareerManagementPageInterceptor from "./internal/PersonalCareerManagementPageInterceptor";
import PersonalEquipmentManagementPageInterceptor from "./internal/PersonalEquipmentManagementPageInterceptor";
import PersonalFastLoginPageInterceptor from "./internal/PersonalFastLoginPageInterceptor";
import PersonalPetManagementPageInterceptor from "./internal/PersonalPetManagementPageInterceptor";
import PersonalSalaryPageInterceptor from "./internal/PersonalSalaryPageInterceptor";
import PersonalSetupPageInterceptor from "./internal/PersonalSetupPageInterceptor";
import PersonalStatusPageInterceptor from "./internal/PersonalStatusPageInterceptor";
import TownAdventureGuildPageInterceptor from "./internal/TownAdventureGuildPageInterceptor";
import TownCastleKeeperPageInterceptor from "./internal/TownCastleKeeperPageInterceptor";
import TownDashboardPageInterceptor from "./internal/TownDashboardPageInterceptor";
import TownGemHousePageInterceptor from "./internal/TownGemHousePageInterceptor";
import TownInformationPageInterceptor from "./internal/TownInformationPageInterceptor";
import TownPetMapHousePageInterceptor from "./internal/TownPetMapHousePageInterceptor";
import TownPetRankHousePageInterceptor from "./internal/TownPetRankHousePageInterceptor";
import TownPostHousePageInterceptor from "./internal/TownPostHousePageInterceptor";
import TownWeaponHousePageInterceptor from "./internal/TownWeaponHousePageInterceptor";

class PageInterceptorManager {

    readonly #interceptors: PageInterceptor[]

    constructor() {
        this.#interceptors = [
            new BattlePageInterceptor(),
            new CastleDashboardPageInterceptor(),
            new CastlePostHousePageInterceptor(),
            new CastleRanchPageInterceptor(),
            new CastleWarehousePageInterceptor(),
            new LoginDashboardPageInterceptor(),
            new MapDashboardPageInterceptor(),
            new MapPostHousePageInterceptor(),
            new NationInformationPageInterceptor(),
            new PersonalCareerManagementPageInterceptor(),
            new PersonalEquipmentManagementPageInterceptor(),
            new PersonalFastLoginPageInterceptor(),
            new PersonalPetManagementPageInterceptor(),
            new PersonalSalaryPageInterceptor(),
            new PersonalSetupPageInterceptor(),
            new PersonalStatusPageInterceptor(),
            new TownAdventureGuildPageInterceptor(),
            new TownCastleKeeperPageInterceptor(),
            new TownDashboardPageInterceptor(),
            new TownGemHousePageInterceptor(),
            new TownInformationPageInterceptor(),
            new TownPetMapHousePageInterceptor(),
            new TownPetRankHousePageInterceptor(),
            new TownPostHousePageInterceptor(),
            new TownWeaponHousePageInterceptor(),
        ];
    }

    lookupInterceptor(cgi: string): PageInterceptor | null {
        const pageText = $("body:first").text();
        for (const interceptor of this.#interceptors) {
            if (interceptor.accept(cgi, pageText)) {
                return interceptor;
            }
        }
        return null;
    }

}

export = PageInterceptorManager;