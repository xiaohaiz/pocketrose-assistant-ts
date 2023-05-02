import TownDashboardProcessor from "../../processor/dashboard/TownDashboardProcessor";
import TownPostHouseProcessor from "../../processor/town/TownPostHouseProcessor";
import RequestInterceptor from "../RequestInterceptor";
import TownAdventureGuildProcessor from "../../processor/town/TownAdventureGuildProcessor";

class TownRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "town.cgi";

    process(): void {
        const pageText = document.documentElement.outerText;
        if (pageText.includes("城市支配率")) {
            new TownDashboardProcessor().process();
            return;
        }
        if (pageText.includes("* 宿 屋 *")) {
            new TownPostHouseProcessor().process();
            return;
        }
        if (pageText.includes("*  藏宝图以旧换新业务 *")) {
            new TownAdventureGuildProcessor().process();
        }
    }
}


export = TownRequestInterceptor;