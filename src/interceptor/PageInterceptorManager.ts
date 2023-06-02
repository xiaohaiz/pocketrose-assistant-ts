import BattlePageInterceptor from "./internal/BattlePageInterceptor";
import CastleBankPageInterceptor from "./internal/CastleBankPageInterceptor";
import CastleDashboardPageInterceptor from "./internal/CastleDashboardPageInterceptor";
import CastlePostHousePageInterceptor from "./internal/CastlePostHousePageInterceptor";
import ConversationPageInterceptor from "./internal/ConversationPageInterceptor";
import CountryChangePageInterceptor from "./internal/CountryChangePageInterceptor";
import CountryPalacePageInterceptor from "./internal/CountryPalacePageInterceptor";
import CountryTownStrengthenPageInterceptor from "./internal/CountryTownStrengthenPageInterceptor";
import LoginDashboardPageInterceptor from "./internal/LoginDashboardPageInterceptor";
import MapDashboardPageInterceptor from "./internal/MapDashboardPageInterceptor";
import MetroDashboardPageInterceptor from "./internal/MetroDashboardPageInterceptor";
import NationInformationPageInterceptor from "./internal/NationInformationPageInterceptor";
import PersonalCareerManagementPageInterceptor from "./internal/PersonalCareerManagementPageInterceptor";
import PersonalEquipmentManagementPageInterceptor from "./internal/PersonalEquipmentManagementPageInterceptor";
import PersonalFastLoginPageInterceptor from "./internal/PersonalFastLoginPageInterceptor";
import PersonalManualPageInterceptor from "./internal/PersonalManualPageInterceptor";
import PersonalPetManagementPageInterceptor from "./internal/PersonalPetManagementPageInterceptor";
import PersonalProfilePageInterceptor from "./internal/PersonalProfilePageInterceptor";
import PersonalSetupPageInterceptor from "./internal/PersonalSetupPageInterceptor";
import PersonalStatisticsPageInterceptor from "./internal/PersonalStatisticsPageInterceptor";
import PersonalStatusPageInterceptor from "./internal/PersonalStatusPageInterceptor";
import PersonalTeamPageInterceptor from "./internal/PersonalTeamPageInterceptor";
import RoleInformationPageInterceptor from "./internal/RoleInformationPageInterceptor";
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
import TownTaskHousePageInterceptor from "./internal/TownTaskHousePageInterceptor";
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
            new ConversationPageInterceptor(),
            new CountryChangePageInterceptor(),
            new CountryPalacePageInterceptor(),
            new CountryTownStrengthenPageInterceptor(),
            new LoginDashboardPageInterceptor(),
            new MapDashboardPageInterceptor(),
            new MetroDashboardPageInterceptor(),
            new NationInformationPageInterceptor(),
            new PersonalCareerManagementPageInterceptor(),
            new PersonalEquipmentManagementPageInterceptor(),
            new PersonalFastLoginPageInterceptor(),
            new PersonalManualPageInterceptor(),
            new PersonalPetManagementPageInterceptor(),
            new PersonalProfilePageInterceptor(),
            new PersonalSetupPageInterceptor(),
            new PersonalStatisticsPageInterceptor(),
            new PersonalStatusPageInterceptor(),
            new PersonalTeamPageInterceptor(),
            new RoleInformationPageInterceptor(),
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
            new TownTaskHousePageInterceptor(),
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