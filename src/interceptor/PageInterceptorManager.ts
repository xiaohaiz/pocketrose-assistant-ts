import BattlePageInterceptor from "./internal/BattlePageInterceptor";
import CastleBankPageInterceptor from "./internal/CastleBankPageInterceptor";
import CastleDashboardPageInterceptor from "./internal/CastleDashboardPageInterceptor";
import CastleInformationPageInterceptor from "./internal/CastleInformationPageInterceptor";
import CastlePostHousePageInterceptor from "./internal/CastlePostHousePageInterceptor";
import ConversationPageInterceptor from "./internal/ConversationPageInterceptor";
import CountryChangePageInterceptor from "./internal/CountryChangePageInterceptor";
import CountryPalacePageInterceptor from "./internal/CountryPalacePageInterceptor";
import CountryTownStrengthenPageInterceptor from "./internal/CountryTownStrengthenPageInterceptor";
import LoginDashboardPageInterceptor from "./internal/LoginDashboardPageInterceptor";
import MapDashboardPageInterceptor from "./internal/MapDashboardPageInterceptor";
import MetroDashboardPageInterceptor from "./internal/MetroDashboardPageInterceptor";
import NationInformationPageInterceptor from "./internal/NationInformationPageInterceptor";
import PageInterceptor from "./PageInterceptor";
import PersonalCareerManagementPageInterceptor from "./internal/PersonalCareerManagementPageInterceptor";
import PersonalEquipmentManagementPageInterceptor from "./internal/PersonalEquipmentManagementPageInterceptor";
import PersonalManualPageInterceptor from "./internal/PersonalManualPageInterceptor";
import PersonalMirrorPageInterceptor from "./internal/PersonalMirrorPageInterceptor";
import PersonalPetManagementPageInterceptor from "./internal/PersonalPetManagementPageInterceptor";
import PersonalProfilePageInterceptor from "./internal/PersonalProfilePageInterceptor";
import PersonalSetupPageInterceptor from "./internal/PersonalSetupPageInterceptor";
import PersonalStatisticsPageInterceptor from "./internal/PersonalStatisticsPageInterceptor";
import PersonalStatusPageInterceptor from "./internal/PersonalStatusPageInterceptor";
import PersonalTeamManagementPageInterceptor from "./internal/PersonalTeamManagementPageInterceptor";
import PersonalTeamPageInterceptor from "./internal/PersonalTeamPageInterceptor";
import RoleInformationPageInterceptor from "./internal/RoleInformationPageInterceptor";
import TangDashboardPageInterceptor from "./internal/TangDashboardPageInterceptor";
import TownAccessoryHousePageInterceptor from "./internal/TownAccessoryHousePageInterceptor";
import TownAdventureGuildPageInterceptor from "./internal/TownAdventureGuildPageInterceptor";
import TownArmorHousePageInterceptor from "./internal/TownArmorHousePageInterceptor";
import TownBankPageInterceptor from "./internal/TownBankPageInterceptor";
import TownDashboardPageInterceptor from "./internal/TownDashboardPageInterceptor";
import TownForgePageInterceptor from "./internal/TownForgePageInterceptor";
import TownGemHousePageInterceptor from "./internal/TownGemHousePageInterceptor";
import TownInformationPageInterceptor from "./internal/TownInformationPageInterceptor";
import TownItemHousePageInterceptor from "./internal/TownItemHousePageInterceptor";
import TownPersonalChampionPageInterceptor from "./internal/TownPersonalChampionPageInterceptor";
import TownPetLeaguePageInterceptor from "./internal/TownPetLeaguePageInterceptor";
import TownPetMapHousePageInterceptor from "./internal/TownPetMapHousePageInterceptor";
import TownPetRankHousePageInterceptor from "./internal/TownPetRankHousePageInterceptor";
import TownPostPageInterceptor from "./internal/TownPostPageInterceptor";
import TownTaskHousePageInterceptor from "./internal/TownTaskHousePageInterceptor";
import TownWeaponHousePageInterceptor from "./internal/TownWeaponHousePageInterceptor";
import {CastleDevelopmentPageInterceptor} from "./internal/CastleDevelopmentPageInterceptor";
import {MapBuyCastlePageInterceptor} from "./internal/MapBuyCastlePageInterceptor";
import {TownCastleHousekeeperPageInterceptor} from "./internal/TownCastleHousekeeperPageInterceptor";
import {TownEquipmentProfilePageInterceptor} from "./internal/TownEquipmentProfilePageInterceptor";
import CountryCacheManagementPageInterceptor from "./internal/CountryCacheManagementPageInterceptor";
import CountryKingMinistryPageInterceptor from "./internal/CountryKingMinistryPageInterceptor";
import CountryDenotePageInterceptor from "./internal/CountryDenotePageInterceptor";
import VipInformationPageInterceptor from "./internal/VipInformationPageInterceptor";

class PageInterceptorManager {

    readonly #interceptors: PageInterceptor[]

    constructor() {
        this.#interceptors = [
            new BattlePageInterceptor(),
            new CastleBankPageInterceptor(),
            new CastleDashboardPageInterceptor(),
            new CastleDevelopmentPageInterceptor(),
            new CastleInformationPageInterceptor(),
            new CastlePostHousePageInterceptor(),
            new ConversationPageInterceptor(),
            new CountryChangePageInterceptor(),
            new CountryDenotePageInterceptor(),
            new CountryCacheManagementPageInterceptor(),
            new CountryKingMinistryPageInterceptor(),
            new CountryPalacePageInterceptor(),
            new CountryTownStrengthenPageInterceptor(),
            new LoginDashboardPageInterceptor(),
            new MapBuyCastlePageInterceptor(),
            new MapDashboardPageInterceptor(),
            new MetroDashboardPageInterceptor(),
            new NationInformationPageInterceptor(),
            new PersonalCareerManagementPageInterceptor(),
            new PersonalEquipmentManagementPageInterceptor(),
            new PersonalTeamManagementPageInterceptor(),
            new PersonalManualPageInterceptor(),
            new PersonalMirrorPageInterceptor(),
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
            new TownCastleHousekeeperPageInterceptor(),
            new TownDashboardPageInterceptor(),
            new TownEquipmentProfilePageInterceptor(),
            new TownForgePageInterceptor(),
            new TownGemHousePageInterceptor(),
            new TownInformationPageInterceptor(),
            new TownItemHousePageInterceptor(),
            new TownPersonalChampionPageInterceptor(),
            new TownPetLeaguePageInterceptor(),
            new TownPetMapHousePageInterceptor(),
            new TownPetRankHousePageInterceptor(),
            new TownPostPageInterceptor(),
            new TownTaskHousePageInterceptor(),
            new TownWeaponHousePageInterceptor(),
            new VipInformationPageInterceptor(),
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