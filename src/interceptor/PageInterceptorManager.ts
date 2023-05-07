import PageInterceptor from "./PageInterceptor";
import CastleDashboardPageInterceptor from "./internal/CastleDashboardPageInterceptor";
import PersonalSetupPageInterceptor from "./internal/PersonalSetupPageInterceptor";
import BattlePageInterceptor from "./internal/BattlePageInterceptor";
import TownWeaponHousePageInterceptor from "./internal/TownWeaponHousePageInterceptor";
import TownPostHousePageInterceptor from "./internal/TownPostHousePageInterceptor";
import TownPetRankHousePageInterceptor from "./internal/TownPetRankHousePageInterceptor";

class PageInterceptorManager {

    readonly #interceptors: PageInterceptor[]

    constructor() {
        this.#interceptors = [
            new BattlePageInterceptor(),
            new CastleDashboardPageInterceptor(),
            new PersonalSetupPageInterceptor(),
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