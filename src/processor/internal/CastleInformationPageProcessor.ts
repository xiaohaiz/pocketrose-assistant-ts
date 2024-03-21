import CastleInformation from "../../core/dashboard/CastleInformation";
import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";

class CastleInformationPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        this.#processPage().then();
    }

    async #processPage() {
        const page = CastleInformation.parsePage(PageUtils.currentPageHtml());
    }

}

export = CastleInformationPageProcessor;