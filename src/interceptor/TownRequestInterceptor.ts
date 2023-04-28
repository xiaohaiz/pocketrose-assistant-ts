import PageUtils from "../util/PageUtils";
import TownDashboardProcessor from "../processor/dashboard/TownDashboardProcessor";

class TownRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "town.cgi";

    process(): void {
        const pageHtml = PageUtils.currentPageHtml();
        const pageText = PageUtils.currentPageText();
        if (pageText.includes("城市支配率")) {
            new TownDashboardProcessor(pageHtml, pageText).process();
        }
    }
}


export = TownRequestInterceptor;