import PageInterceptor from "./PageInterceptor";
import CastleDashboardPageInterceptor from "./internal/CastleDashboardPageInterceptor";
import PersonalSetupPageInterceptor from "./internal/PersonalSetupPageInterceptor";
import BattlePageInterceptor from "./internal/BattlePageInterceptor";
import TownWeaponHousePageInterceptor from "./internal/TownWeaponHousePageInterceptor";
import TownPostHousePageInterceptor from "./internal/TownPostHousePageInterceptor";
import TownPetRankHousePageInterceptor from "./internal/TownPetRankHousePageInterceptor";
import TownPetMapHousePageInterceptor from "./internal/TownPetMapHousePageInterceptor";
import CastlePostHousePageInterceptor from "./internal/CastlePostHousePageInterceptor";
import TownInformationPageInterceptor from "./internal/TownInformationPageInterceptor";
import LoginDashboardPageInterceptor from "./internal/LoginDashboardPageInterceptor";
import NationInformationPageInterceptor from "./internal/NationInformationPageInterceptor";
import CastleRanchPageInterceptor from "./internal/CastleRanchPageInterceptor";
import CastleWarehousePageInterceptor from "./internal/CastleWarehousePageInterceptor";
import MapDashboardPageInterceptor from "./internal/MapDashboardPageInterceptor";
import MapPostHousePageInterceptor from "./internal/MapPostHousePageInterceptor";
import TownGemHousePageInterceptor from "./internal/TownGemHousePageInterceptor";
import TownCastleKeeperPageInterceptor from "./internal/TownCastleKeeperPageInterceptor";
import TownDashboardPageInterceptor from "./internal/TownDashboardPageInterceptor";
import TownAdventureGuildPageInterceptor from "./internal/TownAdventureGuildPageInterceptor";
import PersonalStatusPageInterceptor from "./internal/PersonalStatusPageInterceptor";
import PersonalPetManagementPageInterceptor from "./internal/PersonalPetManagementPageInterceptor";
import PersonalFastLoginPageInterceptor from "./internal/PersonalFastLoginPageInterceptor";
import PersonalCareerManagementPageInterceptor from "./internal/PersonalCareerManagementPageInterceptor";

class PageInterceptorManager {

    readonly #interceptors: PageInterceptor[]

    constructor() {
        this.#interceptors = [
            new BattlePageInterceptor(),
            new CastleDashboardPageInterceptor(),
            new CastlePostHousePageInterceptor(),
            new PersonalSetupPageInterceptor(),
            new TownPetMapHousePageInterceptor(),
            new TownPetRankHousePageInterceptor(),
            new TownPostHousePageInterceptor(),
            new TownWeaponHousePageInterceptor(),
            new TownInformationPageInterceptor(),
            new LoginDashboardPageInterceptor(),
            new NationInformationPageInterceptor(),
            new CastleRanchPageInterceptor(),
            new CastleWarehousePageInterceptor(),
            new MapDashboardPageInterceptor(),
            new MapPostHousePageInterceptor(),
            new TownGemHousePageInterceptor(),
            new TownCastleKeeperPageInterceptor(),
            new TownDashboardPageInterceptor(),
            new TownAdventureGuildPageInterceptor(),
            new PersonalStatusPageInterceptor(),
            new PersonalPetManagementPageInterceptor(),
            new PersonalFastLoginPageInterceptor(),
            new PersonalCareerManagementPageInterceptor(),
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