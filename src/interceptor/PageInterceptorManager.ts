import BattlePageInterceptor from "./internal/BattlePageInterceptor";
import CastleBankPageInterceptor from "./internal/CastleBankPageInterceptor";
import CastleDashboardPageInterceptor from "./internal/CastleDashboardPageInterceptor";
import CastlePostHousePageInterceptor from "./internal/CastlePostHousePageInterceptor";
import LoginDashboardPageInterceptor from "./internal/LoginDashboardPageInterceptor";
import MapDashboardPageInterceptor from "./internal/MapDashboardPageInterceptor";
import MapPostHousePageInterceptor from "./internal/MapPostHousePageInterceptor";
import MetroDashboardPageInterceptor from "./internal/MetroDashboardPageInterceptor";
import NationInformationPageInterceptor from "./internal/NationInformationPageInterceptor";
import PersonalCareerManagementPageInterceptor from "./internal/PersonalCareerManagementPageInterceptor";
import PersonalEquipmentManagementPageInterceptor from "./internal/PersonalEquipmentManagementPageInterceptor";
import PersonalFastLoginPageInterceptor from "./internal/PersonalFastLoginPageInterceptor";
import PersonalPetManagementPageInterceptor from "./internal/PersonalPetManagementPageInterceptor";
import PersonalSalaryPageInterceptor from "./internal/PersonalSalaryPageInterceptor";
import PersonalSetupPageInterceptor from "./internal/PersonalSetupPageInterceptor";
import PersonalStatusPageInterceptor from "./internal/PersonalStatusPageInterceptor";
import TangDashboardPageInterceptor from "./internal/TangDashboardPageInterceptor";
import TownAccessoryHousePageInterceptor from "./internal/TownAccessoryHousePageInterceptor";
import TownAdventureGuildPageInterceptor from "./internal/TownAdventureGuildPageInterceptor";
import TownArmorHousePageInterceptor from "./internal/TownArmorHousePageInterceptor";
import TownBankPageInterceptor from "./internal/TownBankPageInterceptor";
import TownDashboardPageInterceptor from "./internal/TownDashboardPageInterceptor";
import TownGemHousePageInterceptor from "./internal/TownGemHousePageInterceptor";
import TownInformationPageInterceptor from "./internal/TownInformationPageInterceptor";
import TownItemHousePageInterceptor from "./internal/TownItemHousePageInterceptor";
import TownPetMapHousePageInterceptor from "./internal/TownPetMapHousePageInterceptor";
import TownPetRankHousePageInterceptor from "./internal/TownPetRankHousePageInterceptor";
import TownPostHousePageInterceptor from "./internal/TownPostHousePageInterceptor";
import TownWeaponHousePageInterceptor from "./internal/TownWeaponHousePageInterceptor";
import PageInterceptor from "./PageInterceptor";

class PageInterceptorManager {

    readonly #interceptors: PageInterceptor[]

    constructor() {
        this.#interceptors = [
            new BattlePageInterceptor(),
            new CastleBankPageInterceptor(),
            new CastleDashboardPageInterceptor(),
            new CastlePostHousePageInterceptor(),
            new LoginDashboardPageInterceptor(),
            new MapDashboardPageInterceptor(),
            new MapPostHousePageInterceptor(),
            new MetroDashboardPageInterceptor(),
            new NationInformationPageInterceptor(),
            new PersonalCareerManagementPageInterceptor(),
            new PersonalEquipmentManagementPageInterceptor(),
            new PersonalFastLoginPageInterceptor(),
            new PersonalPetManagementPageInterceptor(),
            new PersonalSalaryPageInterceptor(),
            new PersonalSetupPageInterceptor(),
            new PersonalStatusPageInterceptor(),
            new TangDashboardPageInterceptor(),
            new TownAccessoryHousePageInterceptor(),
            new TownAdventureGuildPageInterceptor(),
            new TownArmorHousePageInterceptor(),
            new TownBankPageInterceptor(),
            new TownDashboardPageInterceptor(),
            new TownGemHousePageInterceptor(),
            new TownInformationPageInterceptor(),
            new TownItemHousePageInterceptor(),
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