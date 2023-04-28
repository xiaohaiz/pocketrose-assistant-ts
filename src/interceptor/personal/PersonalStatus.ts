import PageUtils from "../../util/PageUtils";

export = PersonalStatus;

class PersonalStatus {

    private readonly pageHtml: string;
    private readonly pageText: string;

    constructor(pageHtml: string, pageText: string) {
        this.pageHtml = pageHtml;
        this.pageText = pageText;
    }

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        console.log(PageUtils.currentPageHtml());
    }
}