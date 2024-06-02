import PageUtils from "../util/PageUtils";

abstract class StatelessPageProcessor {

    process() {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        this.doProcess().then();
    }

    protected async doProcess() {
    }

}

export = StatelessPageProcessor;